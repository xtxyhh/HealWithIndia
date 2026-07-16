-- Patients Table Migration
-- Version: 000 (Must run before 001_create_safety_tables.sql)
-- Description: Core patients table referenced by all safety tables
-- CRITICAL: This table must exist before any safety table migrations
-- IMPORTANT: patients.id is BIGINT (int8), not UUID. All patient_id columns use BIGINT.
-- NOTE: Schema matches existing HealWithIndia CRM expectations

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
-- Core patient CRM data - matches existing application expectations
CREATE TABLE IF NOT EXISTS patients (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  treatment TEXT,
  description TEXT,
  status TEXT,
  report_url TEXT,
  notes TEXT,
  assigned_hospital TEXT,
  estimated_revenue NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_country ON patients(country);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Policy: Service role (admin) can manage all patients
CREATE POLICY "Service role can manage patients"
  ON patients FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Patients can view their own record via auth mapping
-- This will be enforced after patient_auth_mapping table exists in migration 002
CREATE POLICY "Patients can view own record"
  ON patients FOR SELECT
  USING (verify_patient_ownership(id));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_patients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_patients_updated_at();
