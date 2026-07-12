-- Safety RLS Repair Migration
-- Version: 003
-- Description: Fix missing INSERT/UPDATE policies for patient-owned safety tables
-- CRITICAL: Migration 002 only added SELECT policies, causing INSERT failures
--
-- SECURITY NOTE: PostgreSQL RLS evaluates referenced table RLS in subqueries.
-- patient_auth_mapping has RLS enabled, so direct subqueries would fail.
-- Solution: Use SECURITY DEFINER helper function that bypasses RLS safely.

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

-- Drop incomplete SELECT-only policies for migration 001 tables
DROP POLICY IF EXISTS "Patients can view own safety profile" ON patient_safety_profiles;
DROP POLICY IF EXISTS "Patients can view own check-ins" ON safety_check_ins;
DROP POLICY IF EXISTS "Patients can view own safety cases" ON safety_cases;
DROP POLICY IF EXISTS "Patients can view own case events" ON safety_case_events;
DROP POLICY IF EXISTS "Patients can view own checklist" ON journey_safety_checklist;

-- Drop incomplete policies for migration 002 tables
DROP POLICY IF EXISTS "Patients can view own coordinator assignment" ON coordinator_assignments;
DROP POLICY IF EXISTS "Patients can view own fraud reports" ON fraud_reports;
DROP POLICY IF EXISTS "Patients can insert own fraud reports" ON fraud_reports;

-- Create complete policies for patient_safety_profiles
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

-- Create complete policies for safety_check_ins
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

-- Create complete policies for safety_cases
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

-- Create complete policies for safety_case_events (read-only for patients)
CREATE POLICY "Patients can view own case events"
  ON safety_case_events FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM safety_cases sc
    WHERE sc.id = safety_case_events.safety_case_id
    AND verify_patient_ownership(sc.patient_id)
  ));

-- Create complete policies for journey_safety_checklist
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

-- Create complete policies for coordinator_assignments (read-only for patients)
CREATE POLICY "Patients can view own coordinator assignment"
  ON coordinator_assignments FOR SELECT
  USING (verify_patient_ownership(patient_id));

-- Create complete policies for fraud_reports
CREATE POLICY "Patients can view own fraud reports"
  ON fraud_reports FOR SELECT
  USING (verify_patient_ownership(patient_id));

CREATE POLICY "Patients can insert own fraud reports"
  ON fraud_reports FOR INSERT
  WITH CHECK (verify_patient_ownership(patient_id));
