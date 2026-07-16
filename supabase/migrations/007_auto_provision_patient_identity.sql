-- Server-Trusted Patient Identity Provisioning
-- Version: 007
-- Description: Self-scoped function to provision patient identity for the currently authenticated user
-- This function uses auth.uid() to ensure it only operates on the current user
-- Admin roles are rejected using trusted auth.users.app_metadata

-- Function to provision patient identity for the currently authenticated user
-- SECURITY DEFINER allows bypassing RLS to create patient records
-- SET search_path = '' prevents privilege escalation via search_path attacks
-- Fully schema-qualified references prevent object resolution ambiguity
CREATE OR REPLACE FUNCTION provision_current_patient_identity()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_auth_user_id UUID;
  user_email TEXT;
  user_full_name TEXT;
  user_phone TEXT;
  user_country TEXT;
  user_role TEXT;
  new_patient_id BIGINT;
BEGIN
  -- Get current authenticated user ID
  current_auth_user_id := auth.uid();

  -- Reject if no authenticated user
  IF current_auth_user_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated user';
  END IF;

  -- Check if auth user already has a mapping (idempotent)
  IF EXISTS (
    SELECT 1 FROM public.patient_auth_mapping
    WHERE auth_user_id = current_auth_user_id
  ) THEN
    -- Return existing patient_id
    RETURN (SELECT patient_id FROM public.patient_auth_mapping WHERE auth_user_id = current_auth_user_id LIMIT 1);
  END IF;

  -- Get auth user metadata and role from auth.users
  SELECT 
    email, 
    raw_user_meta_data->>'full_name', 
    raw_user_meta_data->>'phone', 
    raw_user_meta_data->>'country',
    app_metadata->>'role'
  INTO user_email, user_full_name, user_phone, user_country, user_role
  FROM auth.users
  WHERE id = current_auth_user_id;

  -- Reject admin roles to prevent fake patient CRM records
  IF user_role IN ('admin', 'super_admin', 'safety_operator') THEN
    RAISE EXCEPTION 'Admin users cannot provision patient identity';
  END IF;

  -- Create new patient record
  INSERT INTO public.patients (
    full_name,
    email,
    phone,
    country,
    treatment,
    description,
    status,
    report_url,
    notes,
    assigned_hospital,
    estimated_revenue
  ) VALUES (
    COALESCE(user_full_name, user_email),
    user_email,
    user_phone,
    user_country,
    NULL,
    NULL,
    'New',
    NULL,
    NULL,
    NULL,
    NULL
  )
  RETURNING id INTO new_patient_id;

  -- Create auth mapping
  INSERT INTO public.patient_auth_mapping (
    auth_user_id,
    patient_id,
    created_by
  ) VALUES (
    current_auth_user_id,
    new_patient_id,
    'self_provision_function'
  );

  RETURN new_patient_id;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle race condition: mapping was created by another transaction
    RETURN (SELECT patient_id FROM public.patient_auth_mapping WHERE auth_user_id = current_auth_user_id LIMIT 1);
END;
$$;

-- Revoke execute from all roles except authenticated (self-scoped function)
REVOKE EXECUTE ON FUNCTION provision_current_patient_identity() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION provision_current_patient_identity() FROM anon;
GRANT EXECUTE ON FUNCTION provision_current_patient_identity() TO authenticated;
GRANT EXECUTE ON FUNCTION provision_current_patient_identity() TO service_role;

-- Comment: This function provides self-scoped patient identity provisioning.
-- It uses auth.uid() to ensure it only operates on the currently authenticated user.
-- Admin roles are rejected using trusted auth.users.app_metadata.
-- This prevents creating fake patient CRM records for admins, employees, or internal users.
-- The function is safe for authenticated users to invoke directly because it is intrinsically scoped.
