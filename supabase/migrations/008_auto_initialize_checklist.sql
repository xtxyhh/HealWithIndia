-- Server-Trusted Checklist Initialization
-- Version: 008
-- Description: Self-scoped function to initialize journey safety checklist for the currently authenticated patient
-- This function uses auth.uid() and patient_auth_mapping to ensure it only operates on the current user's patient
-- NOT every CRM patient record should have a checklist - only those who activate protection

-- Function to initialize checklist items for the currently authenticated patient
-- SECURITY DEFINER allows bypassing RLS to create checklist records
-- SET search_path = '' prevents privilege escalation via search_path attacks
-- Fully schema-qualified references prevent object resolution ambiguity
CREATE OR REPLACE FUNCTION initialize_current_patient_checklist()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_auth_user_id UUID;
  resolved_patient_id BIGINT;
  checklist_item_types TEXT[] := ARRAY[
    'passport_visa',
    'hospital_confirmed',
    'coordinator_verified',
    'pickup_confirmed',
    'accommodation_confirmed',
    'emergency_contacts',
    'treatment_documents',
    'discharge_plan',
    'follow_up_instructions'
  ];
  item_type TEXT;
BEGIN
  -- Get current authenticated user ID
  current_auth_user_id := auth.uid();

  -- Reject if no authenticated user
  IF current_auth_user_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated user';
  END IF;

  -- Resolve patient_id through patient_auth_mapping
  SELECT patient_id INTO resolved_patient_id
  FROM public.patient_auth_mapping
  WHERE auth_user_id = current_auth_user_id
  LIMIT 1;

  -- Reject if no patient mapping found
  IF resolved_patient_id IS NULL THEN
    RAISE EXCEPTION 'No patient mapping found for current user';
  END IF;

  -- Initialize all 9 checklist items for the resolved patient
  FOREACH item_type IN ARRAY checklist_item_types
  LOOP
    INSERT INTO public.journey_safety_checklist AS checklist (
      patient_id,
      item_type,
      is_completed,
      completed_at,
      notes
    ) VALUES (
      resolved_patient_id,
      item_type,
      FALSE,
      NULL,
      NULL
    )
    ON CONFLICT (patient_id, item_type) DO NOTHING;
  END LOOP;
END;
$$;

-- Revoke execute from all roles except authenticated (self-scoped function)
REVOKE EXECUTE ON FUNCTION initialize_current_patient_checklist() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION initialize_current_patient_checklist() FROM anon;
GRANT EXECUTE ON FUNCTION initialize_current_patient_checklist() TO authenticated;
GRANT EXECUTE ON FUNCTION initialize_current_patient_checklist() TO service_role;

-- Comment: This function provides self-scoped checklist initialization.
-- It uses auth.uid() and patient_auth_mapping to ensure it only operates on the current user's patient.
-- This prevents cross-patient checklist initialization attacks.
-- The function is safe for authenticated users to invoke directly because it is intrinsically scoped.
