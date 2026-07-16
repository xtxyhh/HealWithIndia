# Migration Application Guide

**Purpose:** Apply critical database migrations to enable Smart Tourist Protection System functionality.

## CRITICAL: Migration Order

The migrations MUST be applied in this exact order to satisfy foreign key dependencies:

1. **000_create_patients_table.sql** - NEW (BLOCKING)
2. **000_seed_test_patients.sql** - NEW (OPTIONAL - for testing only)
3. **001_create_safety_tables.sql** - EXISTING
4. **002_coordinator_verification.sql** - EXISTING
5. **003_fix_safety_rls.sql** - EXISTING
6. **004_monitoring_engine.sql** - EXISTING
7. **005_monitoring_audit_trail.sql** - EXISTING
8. **006_fix_coordinator_rpc_assigned_at.sql** - NEW

## Why This Order Matters

### Migration 000 (patients table) MUST run first
- All safety tables (001-005) reference `patients(id)` via foreign keys
- Without the `patients` table, all subsequent migrations will fail
- This is the BLOCKING issue identified in the functional audit

### Migration 000_seed is optional
- Only needed for development/testing environments
- Creates test patients, coordinators, and sample data
- DO NOT run in production

### Migration 006 fixes timeline data
- Updates RPC to return `assigned_at` field
- Can be applied at any time after migration 002
- Safe to run in production

## Application Methods

### Method 1: Supabase Dashboard (Recommended for Production)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Apply migrations in order:

```sql
-- Step 1: Create patients table (BLOCKING)
-- Copy contents of: supabase/migrations/000_create_patients_table.sql
-- Paste and run in SQL Editor

-- Step 2: (OPTIONAL) Seed test data - SKIP FOR PRODUCTION
-- Copy contents of: supabase/migrations/000_seed_test_patients.sql
-- Paste and run in SQL Editor
-- NOTE: Update auth_user_uuid values with real Supabase auth user IDs

-- Step 3: Apply existing safety tables
-- Copy contents of: supabase/migrations/001_create_safety_tables.sql
-- Paste and run in SQL Editor

-- Step 4: Apply coordinator verification
-- Copy contents of: supabase/migrations/002_coordinator_verification.sql
-- Paste and run in SQL Editor

-- Step 5: Fix RLS policies
-- Copy contents of: supabase/migrations/003_fix_safety_rls.sql
-- Paste and run in SQL Editor

-- Step 6: Apply monitoring engine
-- Copy contents of: supabase/migrations/004_monitoring_engine.sql
-- Paste and run in SQL Editor

-- Step 7: Apply audit trail
-- Copy contents of: supabase/migrations/005_monitoring_audit_trail.sql
-- Paste and run in SQL Editor

-- Step 8: Fix coordinator RPC
-- Copy contents of: supabase/migrations/006_fix_coordinator_rpc_assigned_at.sql
-- Paste and run in SQL Editor
```

### Method 2: Supabase CLI (Recommended for Development)

1. Install Supabase CLI if not already installed
2. Link your local project to Supabase
3. Apply migrations:

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations in order
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**Note:** The CLI will automatically apply migrations in the correct order based on filename prefix.

### Method 3: Direct SQL Connection

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Then run each migration file in order
\i supabase/migrations/000_create_patients_table.sql
\i supabase/migrations/001_create_safety_tables.sql
\i supabase/migrations/002_coordinator_verification.sql
\i supabase/migrations/003_fix_safety_rls.sql
\i supabase/migrations/004_monitoring_engine.sql
\i supabase/migrations/005_monitoring_audit_trail.sql
\i supabase/migrations/006_fix_coordinator_rpc_assigned_at.sql
```

## Verification Steps

After applying migrations, verify the schema:

```sql
-- Verify patients table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'patients';

-- Verify all safety tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'patient_safety_profiles',
  'safety_check_ins',
  'safety_cases',
  'safety_case_events',
  'journey_safety_checklist',
  'patient_auth_mapping',
  'official_coordinators',
  'coordinator_assignments',
  'fraud_reports',
  'monitoring_signals',
  'risk_assessments',
  'monitoring_evaluations',
  'monitoring_audit_events'
);

-- Verify foreign key constraints
SELECT
  tc.table_name,
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
ORDER BY tc.table_name;

-- Verify RPC functions exist
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'get_patient_id_from_auth',
  'get_coordinator_verification_by_auth',
  'verify_patient_ownership'
);
```

## Post-Migration Setup

### For Production

1. **Create real patient records:**
   ```sql
   INSERT INTO patients (first_name, last_name, email, phone, country, city) VALUES
     ('Real', 'Patient', 'real.patient@example.com', '+1-555-0100', 'USA', 'New York');
   ```

2. **Create auth mappings:**
   - Get real Supabase auth user IDs from your auth.users table
   - Create patient_auth_mapping entries:
   ```sql
   INSERT INTO patient_auth_mapping (auth_user_id, patient_id, created_by) VALUES
     ('REAL-UUID-FROM-AUTH-USERS', 1, 'admin');
   ```

3. **Create coordinators:**
   ```sql
   INSERT INTO official_coordinators (reference_id, full_name, phone, email, is_active) VALUES
     ('COORD-PROD-001', 'Production Coordinator', '+91-98765-43210', 'coordinator@healwithindia.com', TRUE);
   ```

4. **Create coordinator assignments:**
   ```sql
   INSERT INTO coordinator_assignments (patient_id, coordinator_id, assigned_at, assigned_by, is_active) VALUES
     (1, (SELECT id FROM official_coordinators WHERE reference_id = 'COORD-PROD-001'), NOW(), 'admin', TRUE);
   ```

### For Development

The seed migration (000_seed_test_patients.sql) creates:
- 6 test patients
- 6 auth mappings (with placeholder UUIDs - you must update these)
- 3 test coordinators
- Coordinator assignments
- Safety profiles
- Checklist items
- Sample check-ins
- Sample safety cases
- Risk assessments

**IMPORTANT:** Update the placeholder auth_user_uuid values in the seed migration with real Supabase auth user IDs before running.

## Troubleshooting

### Error: relation "patients" does not exist
- **Cause:** Migration 000 was not applied first
- **Fix:** Apply 000_create_patients_table.sql before any other migration

### Error: foreign key constraint violation
- **Cause:** Migration order was incorrect
- **Fix:** Drop all tables and reapply in correct order, or use CASCADE
- **Destructive fix (use with caution):**
  ```sql
  DROP TABLE IF EXISTS monitoring_audit_events CASCADE;
  DROP TABLE IF EXISTS monitoring_evaluations CASCADE;
  DROP TABLE IF EXISTS risk_assessments CASCADE;
  DROP TABLE IF EXISTS monitoring_signals CASCADE;
  DROP TABLE IF EXISTS fraud_reports CASCADE;
  DROP TABLE IF EXISTS coordinator_assignments CASCADE;
  DROP TABLE IF EXISTS official_coordinators CASCADE;
  DROP TABLE IF EXISTS patient_auth_mapping CASCADE;
  DROP TABLE IF EXISTS safety_case_events CASCADE;
  DROP TABLE IF EXISTS safety_cases CASCADE;
  DROP TABLE IF EXISTS journey_safety_checklist CASCADE;
  DROP TABLE IF EXISTS safety_check_ins CASCADE;
  DROP TABLE IF EXISTS patient_safety_profiles CASCADE;
  DROP TABLE IF EXISTS patients CASCADE;
  ```

### Error: function get_coordinator_verification_by_auth already exists
- **Cause:** Migration 002 was already applied
- **Fix:** This is normal, migration 006 uses CREATE OR REPLACE

### Error: unique constraint violation on patient_auth_mapping
- **Cause:** Duplicate auth mapping for same user or patient
- **Fix:** Check existing mappings and remove duplicates
  ```sql
  SELECT * FROM patient_auth_mapping WHERE auth_user_id = 'YOUR-UUID';
  ```

## Rollback Procedure

If you need to rollback migrations:

```sql
-- Rollback in reverse order
DROP FUNCTION IF EXISTS get_coordinator_verification_by_auth CASCADE;
DROP FUNCTION IF EXISTS create_monitoring_audit_event CASCADE;
DROP TABLE IF EXISTS monitoring_audit_events CASCADE;
DROP TABLE IF EXISTS monitoring_evaluations CASCADE;
DROP TABLE IF EXISTS risk_assessments CASCADE;
DROP TABLE IF EXISTS monitoring_signals CASCADE;
DROP TABLE IF EXISTS fraud_reports CASCADE;
DROP TABLE IF EXISTS coordinator_assignments CASCADE;
DROP TABLE IF EXISTS official_coordinators CASCADE;
DROP TABLE IF EXISTS patient_auth_mapping CASCADE;
DROP TABLE IF EXISTS safety_case_events CASCADE;
DROP TABLE IF EXISTS safety_cases CASCADE;
DROP TABLE IF EXISTS journey_safety_checklist CASCADE;
DROP TABLE IF EXISTS safety_check_ins CASCADE;
DROP TABLE IF EXISTS patient_safety_profiles CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP FUNCTION IF EXISTS verify_patient_ownership CASCADE;
DROP FUNCTION IF EXISTS get_patient_id_from_auth CASCADE;
DROP FUNCTION IF EXISTS update_patients_updated_at CASCADE;
```

## Production Deployment Checklist

- [ ] Backup existing database
- [ ] Apply migration 000_create_patients_table.sql
- [ ] Apply migration 001_create_safety_tables.sql
- [ ] Apply migration 002_coordinator_verification.sql
- [ ] Apply migration 003_fix_safety_rls.sql
- [ ] Apply migration 004_monitoring_engine.sql
- [ ] Apply migration 005_monitoring_audit_trail.sql
- [ ] Apply migration 006_fix_coordinator_rpc_assigned_at.sql
- [ ] Verify all tables exist
- [ ] Verify foreign key constraints
- [ ] Verify RPC functions exist
- [ ] Create real patient records
- [ ] Create auth mappings with real auth user IDs
- [ ] Create coordinator records
- [ ] Create coordinator assignments
- [ ] Test patient safety profile creation
- [ ] Test check-in submission
- [ ] Test checklist updates
- [ ] Test case creation
- [ ] Verify RLS policies work correctly
- [ ] Test with real patient credentials
- [ ] Test with admin credentials

## Contact

If you encounter issues during migration application:
1. Check the Supabase logs for detailed error messages
2. Verify the exact migration order
3. Ensure you have the necessary permissions
4. Contact database administrator if needed
