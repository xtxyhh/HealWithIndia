-- Coordinator Verification and Fraud Protection Schema Migration
-- Version: 002
-- Description: Official coordinator verification system with reference IDs and fraud protection
-- IMPORTANT: patients.id is BIGINT (int8), not UUID. All patient_id columns use BIGINT.

-- Auth user to patient mapping table
-- Securely maps Supabase Auth UUIDs to patient CRM bigint IDs
CREATE TABLE IF NOT EXISTS patient_auth_mapping (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  UNIQUE(patient_id) -- One-to-one mapping: each patient has exactly one auth user
);

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
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
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
  ADD COLUMN IF NOT EXISTS coordinator_assignment_id UUID REFERENCES coordinator_assignments(id) ON DELETE SET NULL;

-- Fraud reports table
-- Tracks suspicious activity reports separate from safety cases for dedicated fraud handling
CREATE TABLE IF NOT EXISTS fraud_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_patient_auth_mapping_auth_user_id ON patient_auth_mapping(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_patient_auth_mapping_patient_id ON patient_auth_mapping(patient_id);
CREATE INDEX IF NOT EXISTS idx_official_coordinators_reference_id ON official_coordinators(reference_id);
CREATE INDEX IF NOT EXISTS idx_official_coordinators_phone ON official_coordinators(phone);
CREATE INDEX IF NOT EXISTS idx_coordinator_assignments_patient_id ON coordinator_assignments(patient_id);
CREATE INDEX IF NOT EXISTS idx_coordinator_assignments_coordinator_id ON coordinator_assignments(coordinator_id);
CREATE INDEX IF NOT EXISTS idx_coordinator_assignments_is_active ON coordinator_assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_patient_id ON fraud_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_status ON fraud_reports(status);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_priority ON fraud_reports(priority);

-- Row Level Security (RLS) policies
ALTER TABLE patient_auth_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordinator_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own auth mapping
CREATE POLICY "Users can view own auth mapping"
  ON patient_auth_mapping FOR SELECT
  USING (auth_user_id = auth.uid());

-- Policy: Patients can view their own coordinator assignment via auth mapping
CREATE POLICY "Patients can view own coordinator assignment"
  ON coordinator_assignments FOR SELECT
  USING (verify_patient_ownership(patient_id));

-- Policy: Patients can view their own fraud reports via auth mapping
CREATE POLICY "Patients can view own fraud reports"
  ON fraud_reports FOR SELECT
  USING (verify_patient_ownership(patient_id));

-- Policy: Patients can create fraud reports via auth mapping
CREATE POLICY "Patients can insert own fraud reports"
  ON fraud_reports FOR INSERT
  WITH CHECK (verify_patient_ownership(patient_id));

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

CREATE POLICY "Service role can manage auth mapping"
  ON patient_auth_mapping FOR ALL
  USING (auth.role() = 'service_role');

-- Helper function to verify patient ownership (bypasses patient_auth_mapping RLS)
-- SECURITY DEFINER allows function to read patient_auth_mapping without RLS interference
-- SET search_path = public prevents privilege escalation
CREATE OR REPLACE FUNCTION verify_patient_ownership(candidate_patient_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.patient_auth_mapping
    WHERE auth_user_id = auth.uid()
    AND patient_id = candidate_patient_id
  );
END;
$$;

-- Revoke public execute (only authenticated users and service role should use this)
REVOKE EXECUTE ON FUNCTION verify_patient_ownership(candidate_patient_id BIGINT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION verify_patient_ownership(candidate_patient_id BIGINT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_patient_ownership(candidate_patient_id BIGINT) TO service_role;

-- Add patient-specific RLS policies for migration 001 tables (deferred until after patient_auth_mapping exists)
CREATE POLICY "Patients can view own safety profile"
  ON patient_safety_profiles FOR SELECT
  USING (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can insert own safety profile"
  ON patient_safety_profiles FOR INSERT
  WITH CHECK (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can update own safety profile"
  ON patient_safety_profiles FOR UPDATE
  USING (verify_patient_ownership(patient_id))
  WITH CHECK (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can view own check-ins"
  ON safety_check_ins FOR SELECT
  USING (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can insert own check-ins"
  ON safety_check_ins FOR INSERT
  WITH CHECK (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can update own check-ins"
  ON safety_check_ins FOR UPDATE
  USING (verify_patient_ownership(patient_id))
  WITH CHECK (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can view own safety cases"
  ON safety_cases FOR SELECT
  USING (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can insert own safety cases"
  ON safety_cases FOR INSERT
  WITH CHECK (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can update own safety cases"
  ON safety_cases FOR UPDATE
  USING (verify_patient_ownership(patient_id))
  WITH CHECK (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can view own case events"
  ON safety_case_events FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM safety_cases sc
    WHERE sc.id = safety_case_events.safety_case_id
    AND verify_patient_ownership(sc.patient_id)
  ));

CREATE POLICY "Patients can view own checklist"
  ON journey_safety_checklist FOR SELECT
  USING (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can insert own checklist"
  ON journey_safety_checklist FOR INSERT
  WITH CHECK (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can update own checklist"
  ON journey_safety_checklist FOR UPDATE
  USING (verify_patient_ownership(patient_id))
  WITH CHECK (verify_patient_ownership(patient_id));

-- Function to get coordinator verification status for a patient (by auth user UUID)
CREATE OR REPLACE FUNCTION get_coordinator_verification_by_auth(auth_user_uuid UUID)
RETURNS TABLE (
  coordinator_id UUID,
  reference_id TEXT,
  full_name TEXT,
  phone TEXT,
  is_verified BOOLEAN,
  is_active BOOLEAN
) LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oc.id,
    oc.reference_id,
    oc.full_name,
    oc.phone,
    TRUE as is_verified, -- All coordinators in official_coordinators table are verified
    oc.is_active
  FROM patient_auth_mapping pam
  JOIN coordinator_assignments ca ON pam.patient_id = ca.patient_id
  JOIN official_coordinators oc ON ca.coordinator_id = oc.id
  WHERE pam.auth_user_id = auth_user_uuid 
    AND ca.is_active = TRUE
    AND oc.is_active = TRUE
  LIMIT 1;
END;
$$;

-- Function to get patient bigint ID from auth user UUID
CREATE OR REPLACE FUNCTION get_patient_id_from_auth(auth_user_uuid UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth_user_uuid LIMIT 1);
END;
$$;
