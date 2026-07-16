-- Smart Tourist Protection System - Database Diagnostic Script
-- Version: 3.0
-- Purpose: READ-ONLY schema discovery only
-- STRICTLY READ-ONLY - No mutations allowed
-- Does not expose sensitive patient data
-- Safe to execute even if expected tables do not exist
-- Uses ONLY catalog and information_schema metadata

-- ============================================
-- SECTION 1: ALL PUBLIC TABLES CURRENTLY EXISTING
-- ============================================

SELECT '=== ALL PUBLIC TABLES ===' AS diagnostic_section;

SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================
-- SECTION 2: PATIENTS TABLE EXISTENCE
-- ============================================

SELECT '=== PATIENTS TABLE EXISTENCE ===' AS diagnostic_section;

SELECT 
  EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'patients'
    AND table_type = 'BASE TABLE'
  ) AS patients_table_exists;

-- ============================================
-- SECTION 3: PATIENT_AUTH_MAPPING TABLE EXISTENCE
-- ============================================

SELECT '=== PATIENT_AUTH_MAPPING TABLE EXISTENCE ===' AS diagnostic_section;

SELECT 
  EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'patient_auth_mapping'
    AND table_type = 'BASE TABLE'
  ) AS patient_auth_mapping_exists;

-- ============================================
-- SECTION 4: EXPECTED SAFETY TABLES EXISTENCE
-- ============================================

SELECT '=== EXPECTED SAFETY TABLES EXISTENCE ===' AS diagnostic_section;

SELECT 
  expected_table.table_name,
  EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = expected_table.table_name
    AND table_type = 'BASE TABLE'
  ) AS exists
FROM (VALUES 
  ('patient_safety_profiles'),
  ('safety_check_ins'),
  ('safety_cases'),
  ('safety_case_events'),
  ('journey_safety_checklist'),
  ('official_coordinators'),
  ('coordinator_assignments'),
  ('fraud_reports'),
  ('monitoring_signals'),
  ('risk_assessments'),
  ('monitoring_evaluations'),
  ('monitoring_audit_events')
) AS expected_table(table_name)
ORDER BY expected_table.table_name;

-- ============================================
-- SECTION 5: PATIENTS TABLE COLUMNS AND DATA TYPES
-- ============================================

SELECT '=== PATIENTS TABLE COLUMNS AND DATA TYPES ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'patients'
ORDER BY ordinal_position;

-- ============================================
-- SECTION 6: PATIENT_AUTH_MAPPING TABLE COLUMNS AND DATA TYPES
-- ============================================

SELECT '=== PATIENT_AUTH_MAPPING TABLE COLUMNS AND DATA TYPES ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'patient_auth_mapping'
ORDER BY ordinal_position;

-- ============================================
-- SECTION 7: SAFETY TABLES COLUMNS AND DATA TYPES
-- ============================================

SELECT '=== PATIENT_SAFETY_PROFILES COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'patient_safety_profiles'
ORDER BY ordinal_position;

SELECT '=== SAFETY_CHECK_INS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'safety_check_ins'
ORDER BY ordinal_position;

SELECT '=== SAFETY_CASES COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'safety_cases'
ORDER BY ordinal_position;

SELECT '=== SAFETY_CASE_EVENTS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'safety_case_events'
ORDER BY ordinal_position;

SELECT '=== JOURNEY_SAFETY_CHECKLIST COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'journey_safety_checklist'
ORDER BY ordinal_position;

SELECT '=== OFFICIAL_COORDINATORS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'official_coordinators'
ORDER BY ordinal_position;

SELECT '=== COORDINATOR_ASSIGNMENTS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'coordinator_assignments'
ORDER BY ordinal_position;

SELECT '=== FRAUD_REPORTS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'fraud_reports'
ORDER BY ordinal_position;

SELECT '=== MONITORING_SIGNALS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'monitoring_signals'
ORDER BY ordinal_position;

SELECT '=== RISK_ASSESSMENTS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'risk_assessments'
ORDER BY ordinal_position;

SELECT '=== MONITORING_EVALUATIONS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'monitoring_evaluations'
ORDER BY ordinal_position;

SELECT '=== MONITORING_AUDIT_EVENTS COLUMNS ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'monitoring_audit_events'
ORDER BY ordinal_position;

-- ============================================
-- SECTION 8: FOREIGN KEYS FOR PATIENTS, PATIENT_AUTH_MAPPING, AND SAFETY TABLES
-- ============================================

SELECT '=== FOREIGN KEYS FOR PATIENTS ===' AS diagnostic_section;

SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name = 'patients'
ORDER BY kcu.ordinal_position;

SELECT '=== FOREIGN KEYS FOR PATIENT_AUTH_MAPPING ===' AS diagnostic_section;

SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name = 'patient_auth_mapping'
ORDER BY kcu.ordinal_position;

SELECT '=== FOREIGN KEYS FOR SAFETY TABLES ===' AS diagnostic_section;

SELECT
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'patient_safety_profiles',
    'safety_check_ins',
    'safety_cases',
    'safety_case_events',
    'journey_safety_checklist',
    'official_coordinators',
    'coordinator_assignments',
    'fraud_reports',
    'monitoring_signals',
    'risk_assessments',
    'monitoring_evaluations',
    'monitoring_audit_events'
  )
ORDER BY tc.table_name, kcu.ordinal_position;

-- ============================================
-- SECTION 9: RLS ENABLED STATUS
-- ============================================

SELECT '=== RLS ENABLED STATUS ===' AS diagnostic_section;

SELECT 
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'patients',
  'patient_auth_mapping',
  'patient_safety_profiles',
  'safety_check_ins',
  'safety_cases',
  'safety_case_events',
  'journey_safety_checklist',
  'official_coordinators',
  'coordinator_assignments',
  'fraud_reports',
  'monitoring_signals',
  'risk_assessments',
  'monitoring_evaluations',
  'monitoring_audit_events'
)
ORDER BY tablename;

-- ============================================
-- SECTION 10: RLS POLICY METADATA
-- ============================================

SELECT '=== RLS POLICIES FOR PATIENTS ===' AS diagnostic_section;

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'patients';

SELECT '=== RLS POLICIES FOR PATIENT_AUTH_MAPPING ===' AS diagnostic_section;

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'patient_auth_mapping';

SELECT '=== RLS POLICIES FOR SAFETY TABLES ===' AS diagnostic_section;

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
  'patient_safety_profiles',
  'safety_check_ins',
  'safety_cases',
  'safety_case_events',
  'journey_safety_checklist',
  'official_coordinators',
  'coordinator_assignments',
  'fraud_reports',
  'monitoring_signals',
  'risk_assessments',
  'monitoring_evaluations',
  'monitoring_audit_events'
)
ORDER BY tablename, policyname;

-- ============================================
-- SECTION 11: EXISTING PUBLIC SAFETY-RELATED FUNCTIONS
-- ============================================

SELECT '=== SAFETY-RELATED FUNCTIONS METADATA ===' AS diagnostic_section;

SELECT 
  routine_name,
  routine_type,
  data_type AS return_type,
  external_language,
  is_deterministic,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'verify_patient_ownership',
  'get_patient_id_from_auth',
  'get_coordinator_verification_by_auth',
  'create_monitoring_audit_event',
  'update_patients_updated_at'
)
ORDER BY routine_name;

-- ============================================
-- SECTION 12: FUNCTION NAMES
-- ============================================

SELECT '=== ALL PUBLIC FUNCTION NAMES ===' AS diagnostic_section;

SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- ============================================
-- SECTION 13: FUNCTION ARGUMENT SIGNATURES
-- ============================================

SELECT '=== FUNCTION ARGUMENT SIGNATURES ===' AS diagnostic_section;

SELECT 
  p.proname AS function_name,
  pg_get_function_arguments(p.oid) AS arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
  'verify_patient_ownership',
  'get_patient_id_from_auth',
  'get_coordinator_verification_by_auth',
  'create_monitoring_audit_event',
  'update_patients_updated_at'
)
ORDER BY p.proname;

-- ============================================
-- SECTION 14: FUNCTION RETURN SIGNATURES
-- ============================================

SELECT '=== FUNCTION RETURN SIGNATURES ===' AS diagnostic_section;

SELECT 
  p.proname AS function_name,
  pg_get_function_result(p.oid) AS return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
  'verify_patient_ownership',
  'get_patient_id_from_auth',
  'get_coordinator_verification_by_auth',
  'create_monitoring_audit_event',
  'update_patients_updated_at'
)
ORDER BY p.proname;

-- ============================================
-- SECTION 15: FUNCTION SECURITY-DEFINER STATUS
-- ============================================

SELECT '=== FUNCTION SECURITY-DEFINER STATUS ===' AS diagnostic_section;

SELECT 
  p.proname AS function_name,
  CASE 
    WHEN p.prosecdef THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END AS security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
  'verify_patient_ownership',
  'get_patient_id_from_auth',
  'get_coordinator_verification_by_auth',
  'create_monitoring_audit_event',
  'update_patients_updated_at'
)
ORDER BY p.proname;

-- ============================================
-- SECTION 16: GET_COORDINATOR_VERIFICATION_BY_AUTH EXISTENCE
-- ============================================

SELECT '=== GET_COORDINATOR_VERIFICATION_BY_AUTH EXISTENCE ===' AS diagnostic_section;

SELECT 
  EXISTS (
    SELECT 1 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name = 'get_coordinator_verification_by_auth'
  ) AS coordinator_rpc_exists;

-- ============================================
-- SECTION 17: COORDINATOR RPC RETURN SIGNATURE INCLUDES ASSIGNED_AT
-- ============================================

SELECT '=== COORDINATOR RPC RETURN SIGNATURE INCLUDES ASSIGNED_AT ===' AS diagnostic_section;

SELECT 
  CASE 
    WHEN pg_get_function_result(p.oid) LIKE '%assigned_at%' 
    THEN TRUE 
    ELSE FALSE 
  END AS assigned_at_in_return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'get_coordinator_verification_by_auth';

-- ============================================
-- SECTION 18: SUPABASE_MIGRATIONS.SCHEMA_MIGRATIONS EXISTENCE
-- ============================================

SELECT '=== SUPABASE_MIGRATIONS.SCHEMA_MIGRATIONS EXISTENCE ===' AS diagnostic_section;

SELECT 
  EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'supabase_migrations' 
    AND table_name = 'schema_migrations'
    AND table_type = 'BASE TABLE'
  ) AS supabase_migration_table_exists;

-- ============================================
-- SECTION 19: MIGRATION-HISTORY TABLE COLUMN METADATA
-- ============================================

SELECT '=== MIGRATION-HISTORY TABLE COLUMN METADATA ===' AS diagnostic_section;

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns
WHERE table_schema = 'supabase_migrations'
AND table_name = 'schema_migrations'
ORDER BY ordinal_position;

-- ============================================
-- SECTION 20: SUMMARY DIAGNOSTIC
-- ============================================

SELECT '=== SCHEMA DISCOVERY SUMMARY ===' AS diagnostic_section;

SELECT 
  'Patients table exists' AS check_item,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patients' AND table_type = 'BASE TABLE') AS status
UNION ALL
SELECT 
  'Patient auth mapping exists' AS check_item,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patient_auth_mapping' AND table_type = 'BASE TABLE') AS status
UNION ALL
SELECT 
  'All safety tables exist' AS check_item,
  (SELECT COUNT(*) = 12 FROM (
    SELECT expected_table.table_name
    FROM (VALUES 
      ('patient_safety_profiles'),
      ('safety_check_ins'),
      ('safety_cases'),
      ('safety_case_events'),
      ('journey_safety_checklist'),
      ('official_coordinators'),
      ('coordinator_assignments'),
      ('fraud_reports'),
      ('monitoring_signals'),
      ('risk_assessments'),
      ('monitoring_evaluations'),
      ('monitoring_audit_events')
    ) AS expected_table(table_name)
    WHERE EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = expected_table.table_name AND table_type = 'BASE TABLE'
    )
  ) sub) AS status
UNION ALL
SELECT 
  'RLS enabled on patients' AS check_item,
  COALESCE((SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'patients'), FALSE) AS status
UNION ALL
SELECT 
  'RLS enabled on patient_auth_mapping' AS check_item,
  COALESCE((SELECT rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'patient_auth_mapping'), FALSE) AS status
UNION ALL
SELECT 
  'verify_patient_ownership function exists' AS check_item,
  EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'verify_patient_ownership') AS status
UNION ALL
SELECT 
  'get_patient_id_from_auth function exists' AS check_item,
  EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'get_patient_id_from_auth') AS status
UNION ALL
SELECT 
  'get_coordinator_verification_by_auth function exists' AS check_item,
  EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'get_coordinator_verification_by_auth') AS status
UNION ALL
SELECT 
  'Coordinator RPC includes assigned_at' AS check_item,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' 
      AND p.proname = 'get_coordinator_verification_by_auth'
      AND pg_get_function_result(p.oid) LIKE '%assigned_at%'
    ) THEN TRUE 
    ELSE FALSE 
  END AS status
UNION ALL
SELECT 
  'Supabase migration history table exists' AS check_item,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'supabase_migrations' AND table_name = 'schema_migrations' AND table_type = 'BASE TABLE') AS status;

SELECT '=== SCHEMA DISCOVERY COMPLETE ===' AS diagnostic_section;
