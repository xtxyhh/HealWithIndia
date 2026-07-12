-- Patient Safety Hub Schema Migration
-- Version: 001
-- Description: Core tables for patient safety features, journey tracking, and coordinator verification

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patient safety profiles table
-- Links to existing patients table, stores safety-specific data
CREATE TABLE IF NOT EXISTS patient_safety_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  journey_stage TEXT CHECK (journey_stage IN ('initial', 'visa_processing', 'travel_confirmed', 'arrived', 'treatment_in_progress', 'discharged', 'follow_up', 'completed')),
  coordinator_id UUID,
  coordinator_name TEXT,
  coordinator_reference_id TEXT,
  coordinator_phone TEXT,
  coordinator_verified BOOLEAN DEFAULT FALSE,
  treatment_destination TEXT,
  hospital_name TEXT,
  estimated_arrival_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id)
);

-- Safety check-ins table
-- Tracks patient safety status at journey milestones
CREATE TABLE IF NOT EXISTS safety_check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  check_in_type TEXT CHECK (check_in_type IN ('arrival_india', 'airport_pickup', 'accommodation_arrival', 'hospital_arrival', 'treatment_milestone', 'discharge', 'return_travel')),
  status TEXT CHECK (status IN ('safe', 'needs_assistance', 'pending')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safety cases table
-- For urgent help and safety incidents
CREATE TABLE IF NOT EXISTS safety_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('medical_emergency', 'lost_unsafe', 'transport_issue', 'hospital_coordination', 'accommodation_issue', 'suspected_fraud', 'other')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'acknowledged', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  description TEXT,
  assigned_coordinator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Safety case timeline events
CREATE TABLE IF NOT EXISTS safety_case_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  safety_case_id UUID NOT NULL REFERENCES safety_cases(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('created', 'acknowledged', 'assigned', 'status_changed', 'note_added', 'resolved', 'closed')),
  description TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey safety checklist items
CREATE TABLE IF NOT EXISTS journey_safety_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  item_type TEXT CHECK (item_type IN ('passport_visa', 'hospital_confirmed', 'coordinator_verified', 'pickup_confirmed', 'accommodation_confirmed', 'emergency_contacts', 'treatment_documents', 'discharge_plan', 'follow_up_instructions')),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, item_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_safety_profiles_patient_id ON patient_safety_profiles(patient_id);
CREATE INDEX IF NOT EXISTS idx_safety_check_ins_patient_id ON safety_check_ins(patient_id);
CREATE INDEX IF NOT EXISTS idx_safety_check_ins_status ON safety_check_ins(status);
CREATE INDEX IF NOT EXISTS idx_safety_cases_patient_id ON safety_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_safety_cases_status ON safety_cases(status);
CREATE INDEX IF NOT EXISTS idx_safety_cases_priority ON safety_cases(priority);
CREATE INDEX IF NOT EXISTS idx_safety_case_events_case_id ON safety_case_events(safety_case_id);
CREATE INDEX IF NOT EXISTS idx_journey_safety_checklist_patient_id ON journey_safety_checklist(patient_id);

-- Row Level Security (RLS) policies
ALTER TABLE patient_safety_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_safety_checklist ENABLE ROW LEVEL SECURITY;

-- Policy: Patients can only view their own safety data
CREATE POLICY "Patients can view own safety profile"
  ON patient_safety_profiles FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));

CREATE POLICY "Patients can view own check-ins"
  ON safety_check_ins FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));

CREATE POLICY "Patients can view own safety cases"
  ON safety_cases FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));

CREATE POLICY "Patients can view own case events"
  ON safety_case_events FOR SELECT
  USING (safety_case_id IN (SELECT id FROM safety_cases WHERE patient_id IN (SELECT id FROM patients WHERE email = auth.email())));

CREATE POLICY "Patients can view own checklist"
  ON journey_safety_checklist FOR SELECT
  USING (patient_id IN (SELECT id FROM patients WHERE email = auth.email()));

-- Policy: Service role (admin) can manage all safety data
CREATE POLICY "Service role can manage safety profiles"
  ON patient_safety_profiles FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage check-ins"
  ON safety_check_ins FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage safety cases"
  ON safety_cases FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage case events"
  ON safety_case_events FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage checklist"
  ON journey_safety_checklist FOR ALL
  USING (auth.role() = 'service_role');
