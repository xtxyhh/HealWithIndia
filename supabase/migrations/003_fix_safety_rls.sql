-- Safety RLS Repair Migration
-- Version: 003
-- Description: Fix missing INSERT/UPDATE policies for patient-owned safety tables
-- CRITICAL: Migration 002 only added SELECT policies, causing INSERT failures

-- Drop incomplete SELECT-only policies for migration 001 tables
DROP POLICY IF EXISTS "Patients can view own safety profile" ON patient_safety_profiles;
DROP POLICY IF EXISTS "Patients can view own check-ins" ON safety_check_ins;
DROP POLICY IF EXISTS "Patients can view own safety cases" ON safety_cases;
DROP POLICY IF EXISTS "Patients can view own case events" ON safety_case_events;
DROP POLICY IF EXISTS "Patients can view own checklist" ON journey_safety_checklist;

-- Drop incomplete policies for migration 002 tables
DROP POLICY IF EXISTS "Patients can view own coordinator assignment" ON coordinator_assignments;
DROP POLICY IF EXISTS "Patients can view own fraud reports" ON fraud_reports;
DROP POLICY IF EXISTS "Patients can create fraud reports" ON fraud_reports;

-- Create complete policies for patient_safety_profiles
CREATE POLICY "Patients can view own safety profile"
  ON patient_safety_profiles FOR SELECT
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can insert own safety profile"
  ON patient_safety_profiles FOR INSERT
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can update own safety profile"
  ON patient_safety_profiles FOR UPDATE
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()))
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

-- Create complete policies for safety_check_ins
CREATE POLICY "Patients can view own check-ins"
  ON safety_check_ins FOR SELECT
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can insert own check-ins"
  ON safety_check_ins FOR INSERT
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can update own check-ins"
  ON safety_check_ins FOR UPDATE
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()))
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

-- Create complete policies for safety_cases
CREATE POLICY "Patients can view own safety cases"
  ON safety_cases FOR SELECT
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can insert own safety cases"
  ON safety_cases FOR INSERT
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can update own safety cases"
  ON safety_cases FOR UPDATE
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()))
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

-- Create complete policies for safety_case_events (read-only for patients)
CREATE POLICY "Patients can view own case events"
  ON safety_case_events FOR SELECT
  USING (safety_case_id IN (SELECT id FROM safety_cases WHERE patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid())));

-- Create complete policies for journey_safety_checklist
CREATE POLICY "Patients can view own checklist"
  ON journey_safety_checklist FOR SELECT
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can insert own checklist"
  ON journey_safety_checklist FOR INSERT
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can update own checklist"
  ON journey_safety_checklist FOR UPDATE
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()))
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

-- Create complete policies for coordinator_assignments (read-only for patients)
CREATE POLICY "Patients can view own coordinator assignment"
  ON coordinator_assignments FOR SELECT
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

-- Create complete policies for fraud_reports
CREATE POLICY "Patients can view own fraud reports"
  ON fraud_reports FOR SELECT
  USING (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));

CREATE POLICY "Patients can insert own fraud reports"
  ON fraud_reports FOR INSERT
  WITH CHECK (patient_id IN (SELECT patient_id FROM patient_auth_mapping WHERE auth_user_id = auth.uid()));
