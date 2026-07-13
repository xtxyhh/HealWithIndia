-- Monitoring Audit Trail Schema Migration
-- Version: 005
-- Description: Immutable audit trail for monitoring system mutations
-- IMPORTANT: patients.id is BIGINT (int8), not UUID. All patient_id columns use BIGINT.

-- Monitoring audit events table
-- Records all monitoring system mutations for operational audit and compliance
CREATE TABLE IF NOT EXISTS monitoring_audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signal_created',
    'signal_resolved',
    'signal_superseded',
    'risk_assessment_created',
    'risk_assessment_superseded',
    'case_auto_created',
    'case_auto_escalated',
    'case_acknowledged',
    'case_claimed',
    'case_response_state_changed',
    'case_priority_escalated',
    'patient_contact_recorded',
    'coordinator_contact_recorded',
    'case_resolved',
    'evaluation_started',
    'evaluation_completed'
  )),
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'monitoring_signal',
    'risk_assessment',
    'safety_case',
    'monitoring_evaluation',
    'patient'
  )),
  entity_id UUID,
  patient_id BIGINT,
  actor_type TEXT NOT NULL CHECK (actor_type IN (
    'system',
    'admin',
    'safety_operator',
    'monitoring_engine'
  )),
  actor_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  context JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- Indexes for audit trail queries
CREATE INDEX IF NOT EXISTS idx_monitoring_audit_events_event_type ON monitoring_audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_monitoring_audit_events_entity_type ON monitoring_audit_events(entity_type);
CREATE INDEX IF NOT EXISTS idx_monitoring_audit_events_entity_id ON monitoring_audit_events(entity_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_audit_events_patient_id ON monitoring_audit_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_audit_events_timestamp ON monitoring_audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_monitoring_audit_events_actor_type ON monitoring_audit_events(actor_type);

-- Row Level Security (RLS) policies
ALTER TABLE monitoring_audit_events ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can manage audit events (admin only)
CREATE POLICY "Service role can manage monitoring audit events"
  ON monitoring_audit_events FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Patients can view their own audit events
CREATE POLICY "Patients can view own monitoring audit events"
  ON monitoring_audit_events FOR SELECT
  USING (verify_patient_ownership(patient_id));

-- Helper function to create audit events
CREATE OR REPLACE FUNCTION create_monitoring_audit_event(
  p_event_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_patient_id BIGINT,
  p_actor_type TEXT,
  p_actor_id TEXT,
  p_context JSONB DEFAULT '{}'::jsonb,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO monitoring_audit_events (
    event_type,
    entity_type,
    entity_id,
    patient_id,
    actor_type,
    actor_id,
    context,
    metadata
  ) VALUES (
    p_event_type,
    p_entity_type,
    p_entity_id,
    p_patient_id,
    p_actor_type,
    p_actor_id,
    p_context,
    p_metadata
  ) RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
