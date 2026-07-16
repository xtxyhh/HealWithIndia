-- Fix ambiguous column reference in activate_patient_protection
-- Version: 010
-- Description: Rename loop variable from item_type to checklist_item to avoid ambiguity with column name

CREATE OR REPLACE FUNCTION activate_patient_protection(target_patient_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
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
  checklist_item TEXT;
  current_protection_status TEXT;
BEGIN
  -- Verify patient exists
  IF NOT EXISTS (SELECT 1 FROM public.patients WHERE id = target_patient_id) THEN
    RAISE EXCEPTION 'Patient not found';
  END IF;

  -- Check current protection status to avoid resetting activation timestamp
  SELECT protection_status INTO current_protection_status
  FROM public.patient_safety_profiles
  WHERE patient_id = target_patient_id;

  -- Create or update patient_safety_profile
  IF current_protection_status IS NULL THEN
    -- New profile - set ACTIVE with activation timestamp
    INSERT INTO public.patient_safety_profiles (
      patient_id,
      protection_status,
      protection_activated_at
    ) VALUES (
      target_patient_id,
      'ACTIVE',
      NOW()
    );
  ELSIF current_protection_status = 'SUSPENDED' THEN
    -- Reactivating suspended profile - update status but preserve original activation timestamp
    UPDATE public.patient_safety_profiles
    SET 
      protection_status = 'ACTIVE',
      protection_suspended_at = NULL
    WHERE patient_id = target_patient_id;
  ELSIF current_protection_status = 'NOT_ACTIVATED' OR current_protection_status = 'PREPARING' THEN
    -- First activation - set ACTIVE with activation timestamp
    UPDATE public.patient_safety_profiles
    SET 
      protection_status = 'ACTIVE',
      protection_activated_at = NOW()
    WHERE patient_id = target_patient_id;
  ELSIF current_protection_status = 'ACTIVE' THEN
    -- Already ACTIVE - preserve state, continue to checklist reconciliation
    -- Do not return - need to ensure all checklist rows exist
  ELSIF current_protection_status = 'COMPLETED' THEN
    -- COMPLETED - preserve state, do not reactivate
    RAISE EXCEPTION 'Conflict: Protection is COMPLETED. Cannot reactivate.';
  ELSE
    -- Unknown state - raise error
    RAISE EXCEPTION 'Unknown protection status: %', current_protection_status;
  END IF;

  -- Initialize checklist items (idempotent - preserves existing completion)
  FOREACH checklist_item IN ARRAY checklist_item_types
  LOOP
    INSERT INTO public.journey_safety_checklist (
      patient_id,
      item_type,
      is_completed,
      completed_at,
      notes
    ) VALUES (
      target_patient_id,
      checklist_item,
      FALSE,
      NULL,
      NULL
    )
    ON CONFLICT (patient_id, item_type) DO NOTHING;
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION activate_patient_protection(target_patient_id BIGINT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION activate_patient_protection(target_patient_id BIGINT) FROM anon;
REVOKE EXECUTE ON FUNCTION activate_patient_protection(target_patient_id BIGINT) FROM authenticated;
GRANT EXECUTE ON FUNCTION activate_patient_protection(target_patient_id BIGINT) TO service_role;
