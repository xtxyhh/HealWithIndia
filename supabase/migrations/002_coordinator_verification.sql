-- Coordinator Verification and Fraud Protection Schema Migration
-- Version: 002
-- Description: Official coordinator verification system with reference IDs and fraud protection

-- Official coordinators table
-- Stores verified HealWithIndia coordinators with official reference IDs
CREATE TABLE IF NOT EXISTS official_coordinators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id TEXT UNIQUE NOT NULL, -- Official HealWithIndia coordinator reference ID
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  assigned_region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coordinator-patient assignments table
-- Links patients to their assigned official coordinators
CREATE TABLE IF NOT EXISTS coordinator_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  coordinator_id UUID NOT NULL REFERENCES official_coordinators(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by TEXT, -- Admin or system that made the assignment
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(patient_id, is_active) -- Only one active assignment per patient
);

-- Update patient_safety_profiles to reference coordinator_assignments
-- This ensures coordinator info is always backed by official coordinator data
ALTER TABLE patient_safety_profiles 
  DROP COLUMN IF EXISTS coordinator_id,
  DROP COLUMN IF EXISTS coordinator_name,
  DROP COLUMN IF EXISTS coordinator_reference_id,
  DROP COLUMN IF EXISTS coordinator_phone,
  DROP COLUMN IF EXISTS coordinator_verified,
  ADD COLUMN IF NOT EXISTS coordinator_assignment_id UUID REFERENCES coordinator_assignments(id) ON DELETE SET NULL;

-- Fraud reports table
-- Tracks suspicious activity reports separate from safety cases for dedicated fraud handling
CREATE TABLE IF NOT EXISTS fraud_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  report_type TEXT CHECK (report_type IN ('suspicious_contact', 'payment_request', 'fake_coordinator', 'phishing', 'identity_theft', 'other')),
  description TEXT NOT NULL,
  contact_method TEXT, -- Phone, email, WhatsApp, etc.
  contact_info TEXT, -- The suspicious contact information
  status TEXT CHECK (status IN ('pending_review', 'under_investigation', 'confirmed_fraud', 'false_positive', 'resolved')) DEFAULT 'pending_review',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'high',
  related_safety_case_id UUID REFERENCES safety_cases(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_official_coordinators_reference_id ON official_coordinators(reference_id);
CREATE INDEX IF NOT EXISTS idx_official_coordinators_phone ON official_coordinators(phone);
CREATE INDEX IF NOT EXISTS idx_coordinator_assignments_patient_id ON coordinator_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_coordinator_assignments_coordinator_id ON coordinator_assignments(coordinator_id);
CREATE INDEX IF NOT EXISTS idx_coordinator_assignments_is_active ON coordinator_assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_patient_id ON fraud_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_status ON fraud_reports(status);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_priority ON fraud_reports(priority);

-- Row Level Security (RLS) policies
ALTER TABLE official_coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordinator_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Patients can view their own coordinator assignment
CREATE POLICY "Patients can view own coordinator assignment"
  ON coordinator_assignments FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));

-- Policy: Patients can view their own fraud reports
CREATE POLICY "Patients can view own fraud reports"
  ON fraud_reports FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));

-- Policy: Patients can create fraud reports
CREATE POLICY "Patients can create fraud reports"
  ON fraud_reports FOR INSERT
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));

-- Policy: Service role (admin) can manage all coordinator data
CREATE POLICY "Service role can manage official coordinators"
  ON official_coordinators FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage coordinator assignments"
  ON coordinator_assignments FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage fraud reports"
  ON fraud_reports FOR ALL
  USING (auth.role() = 'service_role');

-- Function to get coordinator verification status for a patient
CREATE OR REPLACE FUNCTION get_coordinator_verification(patient_uuid UUID)
RETURNS TABLE (
  coordinator_id UUID,
  reference_id TEXT,
  full_name TEXT,
  phone TEXT,
  is_verified BOOLEAN,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oc.id,
    oc.reference_id,
    oc.full_name,
    oc.phone,
    TRUE as is_verified, -- All coordinators in official_coordinators table are verified
    oc.is_active
  FROM coordinator_assignments ca
  JOIN official_coordinators oc ON ca.coordinator_id = oc.id
  WHERE ca.patient_id = patient_uuid 
    AND ca.is_active = TRUE
    AND oc.is_active = TRUE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
