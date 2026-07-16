-- Seed Test Patients Data
-- Version: 000_seed
-- Description: Seed test patient data for development and testing
-- IMPORTANT: This should only be used in development environments
-- Run AFTER 000_create_patients_table.sql

-- Insert test patients
INSERT INTO patients (full_name, email, phone, country, treatment, description, status, assigned_hospital, estimated_revenue) VALUES
  ('John Smith', 'john.smith@example.com', '+1-555-0101', 'USA', 'Cardiac Surgery', 'Patient seeking cardiac treatment in India', 'New', 'Apollo Hospital Delhi', 15000),
  ('Sarah Johnson', 'sarah.johnson@example.com', '+44-7700-900123', 'UK', 'Orthopedic Surgery', 'Knee replacement consultation', 'Consultation', 'Fortis Hospital Mumbai', 12000),
  ('Ahmed Al-Farsi', 'ahmed.alfarsi@example.com', '+971-50-123-4567', 'UAE', 'Cancer Treatment', 'Oncology consultation required', 'New', NULL, 25000),
  ('Chinedu Okonkwo', 'chinedu.okonkwo@example.com', '+234-801-234-5678', 'Nigeria', 'Liver Transplant', 'Liver transplant evaluation', 'Hospital Assigned', 'Manipal Hospital Bangalore', 45000),
  ('Emily Chen', 'emily.chen@example.com', '+1-416-555-0123', 'Canada', 'Fertility Treatment', 'IVF treatment consultation', 'Treatment Started', 'Jaslok Hospital Mumbai', 18000),
  ('James Wilson', 'james.wilson@example.com', '+61-2-9000-1234', 'Australia', 'Neurology', 'Brain tumor consultation', 'Completed', 'Max Hospital Delhi', 30000)
ON CONFLICT (email) DO NOTHING;

-- Create patient_auth_mapping entries for test patients
-- NOTE: These auth_user_uuid values are placeholders. In production, these would be real Supabase auth user IDs
-- You will need to update these with actual auth user IDs from your Supabase project
INSERT INTO patient_auth_mapping (auth_user_id, patient_id, created_by) VALUES
  ('00000000-0000-0000-0000-000000000001', 1, 'migration_seed'),
  ('00000000-0000-0000-0000-000000000002', 2, 'migration_seed'),
  ('00000000-0000-0000-0000-000000000003', 3, 'migration_seed'),
  ('00000000-0000-0000-0000-000000000004', 4, 'migration_seed'),
  ('00000000-0000-0000-0000-000000000005', 5, 'migration_seed'),
  ('00000000-0000-0000-0000-000000000006', 6, 'migration_seed')
ON CONFLICT (auth_user_id) DO NOTHING;

-- Create official coordinators for testing
INSERT INTO official_coordinators (reference_id, full_name, phone, email, is_active, assigned_region) VALUES
  ('COORD-001', 'Rajesh Kumar', '+91-98765-43210', 'rajesh.kumar@healwithindia.com', TRUE, 'Delhi'),
  ('COORD-002', 'Priya Sharma', '+91-98765-43211', 'priya.sharma@healwithindia.com', TRUE, 'Mumbai'),
  ('COORD-003', 'Amit Patel', '+91-98765-43212', 'amit.patel@healwithindia.com', TRUE, 'Bangalore')
ON CONFLICT (reference_id) DO NOTHING;

-- Create coordinator assignments for test patients
INSERT INTO coordinator_assignments (patient_id, coordinator_id, assigned_at, assigned_by, is_active) VALUES
  (1, (SELECT id FROM official_coordinators WHERE reference_id = 'COORD-001'), NOW(), 'migration_seed', TRUE),
  (2, (SELECT id FROM official_coordinators WHERE reference_id = 'COORD-002'), NOW(), 'migration_seed', TRUE),
  (3, (SELECT id FROM official_coordinators WHERE reference_id = 'COORD-001'), NOW(), 'migration_seed', TRUE),
  (4, (SELECT id FROM official_coordinators WHERE reference_id = 'COORD-003'), NOW(), 'migration_seed', TRUE),
  (5, (SELECT id FROM official_coordinators WHERE reference_id = 'COORD-002'), NOW(), 'migration_seed', TRUE),
  (6, (SELECT id FROM official_coordinators WHERE reference_id = 'COORD-003'), NOW(), 'migration_seed', TRUE)
ON CONFLICT (patient_id, is_active) DO NOTHING;

-- Create patient safety profiles for test patients
INSERT INTO patient_safety_profiles (patient_id, journey_stage, coordinator_assignment_id, treatment_destination, hospital_name, estimated_arrival_date) VALUES
  (1, 'travel_confirmed', (SELECT id FROM coordinator_assignments WHERE patient_id = 1 AND is_active = TRUE), 'Delhi', 'Apollo Hospital Delhi', '2026-08-15'),
  (2, 'visa_processing', (SELECT id FROM coordinator_assignments WHERE patient_id = 2 AND is_active = TRUE), 'Mumbai', 'Fortis Hospital Mumbai', '2026-09-01'),
  (3, 'initial', (SELECT id FROM coordinator_assignments WHERE patient_id = 3 AND is_active = TRUE), NULL, NULL, NULL),
  (4, 'travel_confirmed', (SELECT id FROM coordinator_assignments WHERE patient_id = 4 AND is_active = TRUE), 'Bangalore', 'Manipal Hospital Bangalore', '2026-08-20'),
  (5, 'arrived', (SELECT id FROM coordinator_assignments WHERE patient_id = 5 AND is_active = TRUE), 'Mumbai', 'Jaslok Hospital Mumbai', '2026-07-01'),
  (6, 'treatment_in_progress', (SELECT id FROM coordinator_assignments WHERE patient_id = 6 AND is_active = TRUE), 'Delhi', 'Max Hospital Delhi', '2026-06-15')
ON CONFLICT (patient_id) DO NOTHING;

-- Create initial checklist items for test patients
INSERT INTO journey_safety_checklist (patient_id, item_type, is_completed, completed_at, notes) VALUES
  -- Patient 1 - Travel confirmed, mostly complete
  (1, 'passport_visa', TRUE, NOW() - INTERVAL '30 days', 'Valid until 2027'),
  (1, 'hospital_confirmed', TRUE, NOW() - INTERVAL '25 days', 'Apollo Hospital Delhi'),
  (1, 'coordinator_verified', TRUE, NOW() - INTERVAL '20 days', 'COORD-001'),
  (1, 'pickup_confirmed', TRUE, NOW() - INTERVAL '15 days', 'Airport pickup arranged'),
  (1, 'accommodation_confirmed', TRUE, NOW() - INTERVAL '10 days', 'Hotel near hospital'),
  (1, 'emergency_contacts', TRUE, NOW() - INTERVAL '5 days', 'Spouse contact saved'),
  (1, 'treatment_documents', FALSE, NULL, NULL),
  (1, 'discharge_plan', FALSE, NULL, NULL),
  (1, 'follow_up_instructions', FALSE, NULL, NULL),
  
  -- Patient 2 - Visa processing, early stage
  (2, 'passport_visa', TRUE, NOW() - INTERVAL '10 days', 'Visa approved'),
  (2, 'hospital_confirmed', FALSE, NULL, NULL),
  (2, 'coordinator_verified', TRUE, NOW() - INTERVAL '8 days', 'COORD-002'),
  (2, 'pickup_confirmed', FALSE, NULL, NULL),
  (2, 'accommodation_confirmed', FALSE, NULL, NULL),
  (2, 'emergency_contacts', FALSE, NULL, NULL),
  (2, 'treatment_documents', FALSE, NULL, NULL),
  (2, 'discharge_plan', FALSE, NULL, NULL),
  (2, 'follow_up_instructions', FALSE, NULL, NULL),
  
  -- Patient 3 - Initial, minimal progress
  (3, 'passport_visa', FALSE, NULL, NULL),
  (3, 'hospital_confirmed', FALSE, NULL, NULL),
  (3, 'coordinator_verified', FALSE, NULL, NULL),
  (3, 'pickup_confirmed', FALSE, NULL, NULL),
  (3, 'accommodation_confirmed', FALSE, NULL, NULL),
  (3, 'emergency_contacts', FALSE, NULL, NULL),
  (3, 'treatment_documents', FALSE, NULL, NULL),
  (3, 'discharge_plan', FALSE, NULL, NULL),
  (3, 'follow_up_instructions', FALSE, NULL, NULL)
ON CONFLICT (patient_id, item_type) DO NOTHING;

-- Create sample check-ins for test patients
INSERT INTO safety_check_ins (patient_id, check_in_type, status, notes) VALUES
  (5, 'arrival_india', 'safe', 'Arrived safely at Mumbai airport'),
  (5, 'airport_pickup', 'safe', 'Met coordinator at arrivals'),
  (5, 'accommodation_arrival', 'safe', 'Checked into hotel'),
  (6, 'arrival_india', 'safe', 'Arrived at Delhi airport'),
  (6, 'hospital_arrival', 'safe', 'Admitted to Max Hospital'),
  (6, 'treatment_milestone', 'safe', 'First procedure completed')
ON CONFLICT DO NOTHING;

-- Create sample safety cases for testing
INSERT INTO safety_cases (patient_id, category, priority, status, description) VALUES
  (5, 'transport_issue', 'medium', 'resolved', 'Minor delay in pickup, resolved by coordinator'),
  (6, 'hospital_coordination', 'low', 'open', 'Question about discharge timing')
ON CONFLICT DO NOTHING;

-- Create sample risk assessments for testing
INSERT INTO risk_assessments (patient_id, risk_level, contributing_signal_ids, rule_ids, evaluated_at, is_current) VALUES
  (1, 'normal', ARRAY[]::UUID[], ARRAY[]::TEXT[], NOW(), TRUE),
  (2, 'normal', ARRAY[]::UUID[], ARRAY[]::TEXT[], NOW(), TRUE),
  (3, 'watch', ARRAY[]::UUID[], ARRAY['incomplete_checklist'], NOW(), TRUE),
  (5, 'normal', ARRAY[]::UUID[], ARRAY[]::TEXT[], NOW(), TRUE),
  (6, 'normal', ARRAY[]::UUID[], ARRAY[]::TEXT[], NOW(), TRUE)
ON CONFLICT (patient_id) WHERE is_current = TRUE DO NOTHING;
