-- Journey Safety Monitoring Engine Schema Migration
-- Version: 004
-- Description: Core monitoring signal, risk assessment, and evaluation tables for proactive safety monitoring
-- IMPORTANT: patients.id is BIGINT (int8), not UUID. All patient_id columns use BIGINT.

-- Monitoring signals table
-- Stores detected safety signals from journey data, check-ins, incidents, and coordinator activity
CREATE TABLE IF NOT EXISTS monitoring_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL CHECK (signal_type IN (
    'expected_milestone_missed',
    'check_in_overdue',
    'assistance_requested',
    'critical_incident_reported',
    'transport_confirmation_missing',
    'pickup_check_in_missed',
    'accommodation_arrival_missed',
    'hospital_arrival_missed',
    'coordinator_unassigned',
    'coordinator_verification_concern',
    'suspicious_contact_reported',
    'repeated_assistance_requests',
    'case_unacknowledged',
    'critical_case_response_delay',
    'patient_inactivity_during_active_journey'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'high', 'critical')),
  source TEXT NOT NULL CHECK (source IN ('check_in', 'case', 'fraud_report', 'coordinator', 'monitoring_engine')),
  source_entity_id UUID, -- Reference to check-in, case, fraud report, or coordinator assignment
  source_entity_type TEXT, -- Type of the source entity
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'superseded')) DEFAULT 'active',
  metadata JSONB DEFAULT '{}', -- Safe structured metadata (no sensitive data)
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  notes TEXT);
CREATE UNIQUE INDEX IF NOT EXISTS idx_monitoring_signals_active_unique
ON public.monitoring_signals (patient_id, signal_type, source_entity_id)
WHERE status = 'active';
-- Risk assessments table
-- Stores patient risk level evaluations with explainable contributing signals
CREATE TABLE IF NOT EXISTS risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('normal', 'watch', 'elevated', 'high', 'critical')),
  contributing_signal_ids UUID[] DEFAULT ARRAY[]::UUID[], -- Array of signal IDs that contributed
  rule_ids TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of rule identifiers that triggered
  evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}', -- Assessment metadata (no sensitive data)
  is_current BOOLEAN DEFAULT TRUE -- Whether this is the current active assessment
 -- UNIQUE(patient_id, is_current) WHERE is_current = TRUE -- Only one current assessment per patient
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_risk_assessments_current_unique
ON public.risk_assessments (patient_id)
WHERE is_current = TRUE;
-- Monitoring evaluations table
-- Records monitoring engine execution runs for audit and debugging
CREATE TABLE IF NOT EXISTS monitoring_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signals_detected INTEGER DEFAULT 0,
  signals_resolved INTEGER DEFAULT 0,
  risk_assessments_updated INTEGER DEFAULT 0,
  cases_created INTEGER DEFAULT 0,
  cases_escalated INTEGER DEFAULT 0,
  execution_duration_ms INTEGER,
  metadata JSONB DEFAULT '{}', -- Execution metadata
  triggered_by TEXT DEFAULT 'scheduled' -- 'scheduled', 'manual', 'event'
);

-- Add response tracking to safety_cases
-- Track operational response SLAs without changing existing case status semantics
ALTER TABLE safety_cases
  ADD COLUMN IF NOT EXISTS response_state TEXT CHECK (response_state IN (
    'detected',
    'triaged',
    'acknowledged',
    'in_response',
    'patient_contacted',
    'coordinator_contacted',
    'external_guidance_provided',
    'monitoring',
    'resolved',
    'closed'
  )) DEFAULT 'detected';

ALTER TABLE safety_cases
  ADD COLUMN IF NOT EXISTS acknowledged_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE safety_cases
  ADD COLUMN IF NOT EXISTS first_response_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE safety_cases
  ADD COLUMN IF NOT EXISTS patient_contacted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE safety_cases
  ADD COLUMN IF NOT EXISTS response_operator_id TEXT;

ALTER TABLE safety_cases
  ADD COLUMN IF NOT EXISTS resolution_category TEXT CHECK (resolution_category IN (
    'patient_confirmed_safe',
    'coordination_resolved',
    'transport_resolved',
    'hospital_coordination_resolved',
    'accommodation_resolved',
    'fraud_concern_handled',
    'referred_to_emergency_services',
    'other'
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_monitoring_signals_patient_id ON monitoring_signals(patient_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_signals_status ON monitoring_signals(status);
CREATE INDEX IF NOT EXISTS idx_monitoring_signals_severity ON monitoring_signals(severity);
CREATE INDEX IF NOT EXISTS idx_monitoring_signals_detected_at ON monitoring_signals(detected_at);
CREATE INDEX IF NOT EXISTS idx_monitoring_signals_source_entity ON monitoring_signals(source_entity_id, source_entity_type);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_patient_id ON risk_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_is_current ON risk_assessments(is_current);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_risk_level ON risk_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_safety_cases_response_state ON safety_cases(response_state);
CREATE INDEX IF NOT EXISTS idx_safety_cases_acknowledged_at ON safety_cases(acknowledged_at);
CREATE INDEX IF NOT EXISTS idx_monitoring_evaluations_evaluated_at ON monitoring_evaluations(evaluated_at);

-- Row Level Security (RLS) policies
ALTER TABLE monitoring_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_evaluations ENABLE ROW LEVEL SECURITY;

-- Helper function to verify patient ownership (already exists from migration 002/003)
-- Using existing verify_patient_ownership function

-- Policy: Patients can view their own monitoring signals
CREATE POLICY "Patients can view own monitoring signals"
  ON monitoring_signals FOR SELECT
  USING (verify_patient_ownership(patient_id));

-- Policy: Service role can manage monitoring signals
CREATE POLICY "Service role can manage monitoring signals"
  ON monitoring_signals FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Patients can view their own risk assessments
CREATE POLICY "Patients can view own risk assessments"
  ON risk_assessments FOR SELECT
  USING (verify_patient_ownership(patient_id));

-- Policy: Service role can manage risk assessments
CREATE POLICY "Service role can manage risk assessments"
  ON risk_assessments FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Service role can manage monitoring evaluations (admin only)
CREATE POLICY "Service role can manage monitoring evaluations"
  ON monitoring_evaluations FOR ALL
  USING (auth.role() = 'service_role');

-- Extend safety_case_events to include response workflow events
-- No schema change needed - existing event_type CHECK constraint allows new values
-- New event types for response workflow: 'acknowledged', 'patient_contacted', 'coordinator_contacted', 'external_guidance_provided', 'response_state_changed'
