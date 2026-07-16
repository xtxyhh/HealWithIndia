-- Fix Coordinator RPC to Return assigned_at Field
-- Version: 006
-- Description: Update get_coordinator_verification_by_auth RPC to include assigned_at timestamp
-- This field is needed by the protection timeline to show when coordinator was assigned

-- Drop and recreate the function with assigned_at field
CREATE OR REPLACE FUNCTION get_coordinator_verification_by_auth(auth_user_uuid UUID)
RETURNS TABLE (
  coordinator_id UUID,
  reference_id TEXT,
  full_name TEXT,
  phone TEXT,
  is_verified BOOLEAN,
  is_active BOOLEAN,
  assigned_at TIMESTAMP WITH TIME ZONE
) LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oc.id,
    oc.reference_id,
    oc.full_name,
    oc.phone,
    TRUE as is_verified, -- All coordinators in official_coordinators table are verified
    oc.is_active,
    ca.assigned_at
  FROM patient_auth_mapping pam
  JOIN coordinator_assignments ca ON pam.patient_id = ca.patient_id
  JOIN official_coordinators oc ON ca.coordinator_id = oc.id
  WHERE pam.auth_user_id = auth_user_uuid 
    AND ca.is_active = TRUE
    AND oc.is_active = TRUE
  LIMIT 1;
END;
$$;
