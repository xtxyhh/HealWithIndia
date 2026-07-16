-- Admin-Controlled Patient Lifecycle
-- Version: 009 (FINAL CORRECTED)
-- Description: Add portal access and protection lifecycle for admin-controlled onboarding

-- ============================================
-- PORTAL ACCESS LIFECYCLE
-- ============================================

ALTER TABLE public.patient_auth_mapping
ADD COLUMN IF NOT EXISTS portal_access_status TEXT DEFAULT 'NOT_ENABLED',
ADD COLUMN IF NOT EXISTS portal_access_enabled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS portal_access_suspended_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS invite_resend_count INTEGER DEFAULT 0;

ALTER TABLE public.patient_auth_mapping
DROP CONSTRAINT IF EXISTS patient_auth_mapping_portal_access_status_check;
ALTER TABLE public.patient_auth_mapping
ADD CONSTRAINT patient_auth_mapping_portal_access_status_check
CHECK (portal_access_status IN ('NOT_ENABLED', 'INVITE_PENDING', 'ACTIVE', 'SUSPENDED'));

-- ============================================
-- PROTECTION LIFECYCLE
-- ============================================

ALTER TABLE public.patient_safety_profiles
ADD COLUMN IF NOT EXISTS protection_status TEXT DEFAULT 'NOT_ACTIVATED',
ADD COLUMN IF NOT EXISTS protection_activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS protection_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS protection_suspended_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.patient_safety_profiles
DROP CONSTRAINT IF EXISTS patient_safety_profiles_protection_status_check;
ALTER TABLE public.patient_safety_profiles
ADD CONSTRAINT patient_safety_profiles_protection_status_check
CHECK (protection_status IN ('NOT_ACTIVATED', 'PREPARING', 'ACTIVE', 'COMPLETED', 'SUSPENDED'));

-- ============================================
-- DEPRECATE SELF-PROVISIONING FUNCTION
-- ============================================

COMMENT ON FUNCTION public.provision_current_patient_identity() IS 
'DEPRECATED: This function is deprecated in favor of admin-controlled patient onboarding.';

COMMENT ON FUNCTION public.initialize_current_patient_checklist() IS 
'DEPRECATED: This function is deprecated in favor of admin-controlled protection activation.';

-- ============================================
-- ADMIN-CONTROLLED PROTECTION ACTIVATION FUNCTION
-- ============================================
-- Responsibility: Enforce database invariants for protection activation
-- Authorization: Handled by server API before calling this function
-- Caller: Service-role client only (no auth.uid() dependency)

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
  item_type TEXT;
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
  FOREACH item_type IN ARRAY checklist_item_types
  LOOP
    INSERT INTO public.journey_safety_checklist AS checklist (
      patient_id,
      item_type,
      is_completed,
      completed_at,
      notes
    ) VALUES (
      target_patient_id,
      item_type,
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

-- ============================================
-- ADMIN-CONTROLLED PORTAL ACCESS ENABLEMENT FUNCTION
-- ============================================
-- Responsibility: Enforce database invariants for portal access mapping
-- Authorization: Handled by server API before calling this function
-- Caller: Service-role client only (no auth.uid() dependency)
-- Security: Explicit conflict detection to prevent identity remapping

CREATE OR REPLACE FUNCTION enable_patient_portal_access(target_patient_id BIGINT, target_auth_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  existing_mapping_for_auth_user BIGINT;
  existing_mapping_for_patient UUID;
  current_portal_status TEXT;
BEGIN
  -- Verify patient exists
  IF NOT EXISTS (SELECT 1 FROM public.patients WHERE id = target_patient_id) THEN
    RAISE EXCEPTION 'Patient not found';
  END IF;

  -- Verify auth user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_auth_user_id) THEN
    RAISE EXCEPTION 'Auth user not found';
  END IF;

  -- Check if auth_user_id is already mapped to a different patient
  SELECT patient_id INTO existing_mapping_for_auth_user
  FROM public.patient_auth_mapping
  WHERE auth_user_id = target_auth_user_id;

  IF existing_mapping_for_auth_user IS NOT NULL AND existing_mapping_for_auth_user != target_patient_id THEN
    RAISE EXCEPTION 'Conflict: Auth user is already mapped to patient_id %', existing_mapping_for_auth_user;
  END IF;

  -- Check if patient_id is already mapped to a different auth user
  SELECT auth_user_id INTO existing_mapping_for_patient
  FROM public.patient_auth_mapping
  WHERE patient_id = target_patient_id;

  IF existing_mapping_for_patient IS NOT NULL AND existing_mapping_for_patient != target_auth_user_id THEN
    RAISE EXCEPTION 'Conflict: Patient is already mapped to auth_user_id %', existing_mapping_for_patient;
  END IF;

  -- If mapping already exists with same auth_user_id and patient_id, handle by current state
  IF existing_mapping_for_auth_user = target_patient_id THEN
    -- Get current portal status
    SELECT portal_access_status INTO current_portal_status
    FROM public.patient_auth_mapping
    WHERE auth_user_id = target_auth_user_id AND patient_id = target_patient_id;
    
    -- Preserve existing state - do not downgrade or corrupt
    IF current_portal_status = 'INVITE_PENDING' THEN
      -- Already INVITE_PENDING - idempotent success
      RETURN;
    ELSIF current_portal_status = 'ACTIVE' THEN
      -- Already ACTIVE - preserve state, idempotent success
      RETURN;
    ELSIF current_portal_status = 'SUSPENDED' THEN
      -- SUSPENDED - must use explicit restore action, not enable
      RAISE EXCEPTION 'Conflict: Portal access is SUSPENDED. Use restore action to reactivate.';
    ELSE
      -- NOT_ENABLED or other state - transition to INVITE_PENDING
      UPDATE public.patient_auth_mapping
      SET 
        portal_access_status = 'INVITE_PENDING',
        portal_access_enabled_at = NOW()
      WHERE auth_user_id = target_auth_user_id AND patient_id = target_patient_id;
    END IF;
  ELSE
    -- Create new mapping with INVITE_PENDING status
    INSERT INTO public.patient_auth_mapping (
      auth_user_id,
      patient_id,
      portal_access_status,
      portal_access_enabled_at,
      created_by
    ) VALUES (
      target_auth_user_id,
      target_patient_id,
      'INVITE_PENDING',
      NOW(),
      'admin_portal_workflow'
    );
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION enable_patient_portal_access(target_patient_id BIGINT, target_auth_user_id UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION enable_patient_portal_access(target_patient_id BIGINT, target_auth_user_id UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION enable_patient_portal_access(target_patient_id BIGINT, target_auth_user_id UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION enable_patient_portal_access(target_patient_id BIGINT, target_auth_user_id UUID) TO service_role;

-- ============================================
-- PATIENT LOGIN VERIFICATION FUNCTION
-- ============================================
-- Responsibility: Self-scoped verification of patient portal access
-- Authorization: Uses auth.uid() from authenticated session
-- Caller: Authenticated patient session
-- Lifecycle: Permits INVITE_PENDING for first-login transition flow

CREATE OR REPLACE FUNCTION verify_patient_portal_access()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_auth_user_id UUID;
  mapping_exists BOOLEAN;
  portal_status TEXT;
BEGIN
  current_auth_user_id := auth.uid();

  IF current_auth_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.patient_auth_mapping
    WHERE auth_user_id = current_auth_user_id
  ) INTO mapping_exists;

  IF NOT mapping_exists THEN
    RETURN FALSE;
  END IF;

  SELECT portal_access_status INTO portal_status
  FROM public.patient_auth_mapping
  WHERE auth_user_id = current_auth_user_id
  LIMIT 1;

  -- Permit INVITE_PENDING for first-login transition flow
  -- Permit ACTIVE for normal access
  -- Reject SUSPENDED and NOT_ENABLED
  RETURN portal_status IN ('INVITE_PENDING', 'ACTIVE');
END;
$$;

REVOKE EXECUTE ON FUNCTION verify_patient_portal_access() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION verify_patient_portal_access() FROM anon;
GRANT EXECUTE ON FUNCTION verify_patient_portal_access() TO authenticated;
GRANT EXECUTE ON FUNCTION verify_patient_portal_access() TO service_role;

-- ============================================
-- ADMIN LOGIN VERIFICATION FUNCTION
-- ============================================
-- Responsibility: Self-scoped verification of admin role
-- Authorization: Uses auth.uid() from authenticated session
-- Caller: Authenticated admin session

CREATE OR REPLACE FUNCTION verify_admin_role()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_auth_user_id UUID;
  user_role TEXT;
BEGIN
  current_auth_user_id := auth.uid();

  IF current_auth_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT app_metadata->>'role' INTO user_role
  FROM auth.users
  WHERE id = current_auth_user_id;

  RETURN user_role IN ('admin', 'super_admin', 'safety_operator');
END;
$$;

REVOKE EXECUTE ON FUNCTION verify_admin_role() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION verify_admin_role() FROM anon;
GRANT EXECUTE ON FUNCTION verify_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_role() TO service_role;
