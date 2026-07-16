# Migration Inventory Report

**Date:** July 2026  
**Purpose:** Complete audit of all Supabase migrations for Smart Tourist Protection System

## Migration Directory Inventory

### Current Migration Files (supabase/migrations/)

| File Name | Purpose | Tables Created | Tables Altered | Functions Created | RLS Changes | FK Dependencies | Dependency on Earlier Migrations |
|-----------|---------|----------------|----------------|-------------------|-------------|-----------------|--------------------------------|
| 000_create_patients_table.sql | Core patients table referenced by all safety tables | patients | None | update_patients_updated_at | ENABLE RLS, 2 policies | None | None (must run first) |
| 001_create_safety_tables.sql | Core safety tables for patient safety features | patient_safety_profiles, safety_check_ins, safety_cases, safety_case_events, journey_safety_checklist | None | None | ENABLE RLS on 5 tables, 5 policies | patients (FK) | 000 (patients table) |
| 002_coordinator_verification.sql | Coordinator verification and fraud protection | patient_auth_mapping, official_coordinators, coordinator_assignments, fraud_reports | patient_safety_profiles (ADD COLUMN coordinator_assignment_id) | verify_patient_ownership, get_coordinator_verification_by_auth, get_patient_id_from_auth | ENABLE RLS on 4 tables, 11 policies | patients (FK), auth.users (FK) | 000, 001 |
| 003_fix_safety_rls.sql | Fix missing INSERT/UPDATE policies for patient-owned tables | None | None | verify_patient_ownership (RECREATE) | DROP 7 policies, CREATE 12 policies | None | 002 (uses verify_patient_ownership) |
| 004_monitoring_engine.sql | Monitoring signal, risk assessment, and evaluation tables | monitoring_signals, risk_assessments, monitoring_evaluations | safety_cases (ADD 6 columns) | None | ENABLE RLS on 3 tables, 5 policies | patients (FK), safety_cases (FK) | 000, 001, 002 |
| 005_monitoring_audit_trail.sql | Immutable audit trail for monitoring system | monitoring_audit_events | None | create_monitoring_audit_event | ENABLE RLS, 2 policies | None | 002 (uses verify_patient_ownership) |
| 006_fix_coordinator_rpc_assigned_at.sql | Fix coordinator RPC to return assigned_at field | None | None | get_coordinator_verification_by_auth (RECREATE) | None | None | 002 (recreates function) |

### Seed Data Files (supabase/seed/)

| File Name | Purpose | Tables Seeded | Notes |
|-----------|---------|---------------|-------|
| 000_seed_test_patients.sql | Development test data | patients, patient_auth_mapping, official_coordinators, coordinator_assignments, patient_safety_profiles, journey_safety_checklist, safety_check_ins, safety_cases, risk_assessments | DEVELOPMENT ONLY - Do not apply to production |

## Discrepancy Investigation: 002_safety_security.sql vs 002_coordinator_verification.sql

### Finding
**No file named `002_safety_security.sql` exists in the repository.**

### Investigation Results
- Searched entire repository for `002_safety_security.sql` - **NOT FOUND**
- Searched for any reference to this filename in code - **NOT FOUND**
- Current migration 002 is named `002_coordinator_verification.sql`
- This file contains coordinator verification, fraud protection, and auth mapping functionality

### Conclusion
**The previous report referenced a non-existent filename.** The actual migration is `002_coordinator_verification.sql`. The documentation was stale/inaccurate. No migration was renamed or overwritten - the previous report simply referenced an incorrect filename.

## Canonical Patient Identity Model

### What Record Represents a Patient?

**Answer:** The `patients` table (id: BIGINT)

### What ID Does the Safety System Expect?

**Answer:** `patient_id BIGINT` in all safety tables

### How Is That Record Connected to the Authenticated User?

**Answer:** Via `patient_auth_mapping` table:
- `patient_auth_mapping.auth_user_id UUID` → references `auth.users(id)`
- `patient_auth_mapping.patient_id BIGINT` → references `patients(id)`
- One-to-one mapping enforced by `UNIQUE(patient_id)`

### Identity Chain
```
Supabase Auth User (UUID)
↓
auth.users.id (UUID)
↓
patient_auth_mapping.auth_user_id (UUID)
↓
patient_auth_mapping.patient_id (BIGINT)
↓
patients.id (BIGINT)
↓
All safety tables patient_id (BIGINT)
```

### Application Evidence
- `app/admin/patient/page.tsx` queries `patients` table directly
- `app/admin/leads/page.tsx` uses Patient type with fields: full_name, email, phone, country, treatment, description, status, report_url, notes, assigned_hospital, estimated_revenue
- All safety APIs use `get_patient_id_from_auth(auth_user_uuid UUID)` RPC to resolve patient_id

### Schema Verification
The `000_create_patients_table.sql` schema now matches the application's expected columns:
- ✅ full_name (TEXT)
- ✅ email (TEXT)
- ✅ phone (TEXT)
- ✅ country (TEXT)
- ✅ treatment (TEXT)
- ✅ description (TEXT)
- ✅ status (TEXT)
- ✅ report_url (TEXT)
- ✅ notes (TEXT)
- ✅ assigned_hospital (TEXT)
- ✅ estimated_revenue (NUMERIC)
- ✅ created_at (TIMESTAMP WITH TIME ZONE)
- ✅ updated_at (TIMESTAMP WITH TIME ZONE)

## Architectural Correctness of 000_create_patients_table.sql

### Primary Key Design
- **Type:** BIGSERIAL (BIGINT auto-increment)
- **Correctness:** ✅ Matches all safety table FK expectations (BIGINT)
- **Uniqueness:** ✅ Primary key ensures uniqueness

### Relationship to auth.users
- **Connection:** Via `patient_auth_mapping` table (created in migration 002)
- **Design:** Indirect mapping to support one-to-one auth-to-patient relationship
- **Correctness:** ✅ Proper separation of concerns

### Unique User Mapping
- **Enforcement:** `UNIQUE(patient_id)` in `patient_auth_mapping` (migration 002)
- **Correctness:** ✅ Ensures one auth user maps to one patient

### Email Handling
- **Design:** TEXT field, no UNIQUE constraint in patients table
- **Rationale:** Email uniqueness enforced at auth.users level
- **Correctness:** ✅ Appropriate for CRM use case

### RLS Policies
- **Service role:** Full access via `auth.role() = 'service_role'`
- **Patient access:** Via `verify_patient_ownership(id)` function
- **Correctness:** ✅ Proper security model

### INSERT/UPDATE Policies
- **Service role:** Full access
- **Patient:** Only SELECT policy (INSERT/UPDATE via application logic)
- **Correctness:** ✅ Appropriate for patient data

### Foreign Key Behavior
- **Safety tables:** `REFERENCES patients(id) ON DELETE CASCADE`
- **Correctness:** ✅ Cascading delete prevents orphaned safety data

### Cascade Behavior
- **Design:** ON DELETE CASCADE from patients to all safety tables
- **Correctness:** ✅ Prevents data integrity issues

### Existing User Backfill
- **Status:** Not handled in migration
- **Requirement:** Manual backfill needed for existing auth users
- **Correctness:** ⚠️ Migration is schema-only, data backfill is separate concern

### New User Creation Behavior
- **Status:** Not handled in migration
- **Requirement:** Application must create patient record on user signup
- **Correctness:** ⚠️ Application logic required for new user creation

### Conceptual Identity Path Verification

**User signs up**
- ✅ Supabase Auth handles user creation
- ⚠️ Application must create patient record (not in migration)

**Authenticated session created**
- ✅ Supabase Auth session management

**Patient record exists or is safely created**
- ⚠️ Application must ensure patient record exists
- ⚠️ No automatic patient creation in migration

**Safety APIs derive patient record**
- ✅ `get_patient_id_from_auth` RPC resolves patient_id from auth_user_id
- ✅ All safety APIs use this RPC

**Safety rows use patient.id**
- ✅ All safety tables reference patients(id) via FK

### Architectural Assessment
**Status:** ⚠️ PARTIALLY CORRECT

**Correct:**
- Schema matches application expectations
- Identity chain is properly designed
- RLS policies are appropriate
- FK relationships are correct

**Missing:**
- No automatic patient creation on user signup
- No backfill for existing auth users
- Application must implement patient record creation logic

**Recommendation:** The migration is architecturally correct for schema, but application logic is required to ensure patient records exist for all auth users.

## Treatment of 000_seed_test_patients.sql

### Current Status
- **Location:** Moved to `supabase/seed/000_seed_test_patients.sql`
- **Purpose:** Development and testing only
- **Production Status:** EXCLUDED from production migration sequence

### Content
- Creates 6 test patients with CRM data
- Creates patient_auth_mapping entries with placeholder UUIDs
- Creates 3 test coordinators
- Creates coordinator assignments
- Creates safety profiles
- Creates checklist items
- Creates sample check-ins
- Creates sample safety cases
- Creates risk assessments

### Production Safety
- ✅ Moved out of migrations directory
- ✅ Clearly marked as development-only
- ✅ Placeholder auth_user_uuid values prevent accidental production use
- ✅ Will not be applied by standard migration tools

### Recommendation
**DO NOT apply to production.** This file contains fake test data that should never exist in a production HealWithIndia database.

## Remote Supabase State Verification

### Access Status
**NO REMOTE ACCESS AVAILABLE**

### Evidence
- No `supabase/config.toml` found in repository
- No Supabase CLI configuration detected
- No database credentials available
- .env.local is gitignored and inaccessible

### Verification Status
**NOT VERIFIED**

### Implications
- Cannot determine which migrations are already applied
- Cannot determine which tables currently exist
- Cannot determine if patients table exists
- Cannot determine if safety tables exist
- Cannot determine RLS status
- Cannot determine if migrations are out of sync

### Conclusion
All migration application and verification must be performed manually by the user with database access. No automated verification is possible without Supabase CLI configuration or database credentials.

## Safe Migration Plan

### Assumptions
- Remote database state is UNKNOWN
- Some migrations may already be partially applied
- Must prevent duplicate table/function/policy errors
- Must prevent data loss
- Must not drop existing patient or safety data

### Recommended Approach

#### Option 1: Fresh Database (No Existing Safety Schema)
If the database has no existing safety schema:

**Apply migrations in order:**
1. `000_create_patients_table.sql`
2. `001_create_safety_tables.sql`
3. `002_coordinator_verification.sql`
4. `003_fix_safety_rls.sql`
5. `004_monitoring_engine.sql`
6. `005_monitoring_audit_trail.sql`
7. `006_fix_coordinator_rpc_assigned_at.sql`

**Method:** Supabase Dashboard SQL Editor or Supabase CLI

#### Option 2: Partial Schema Exists (Unknown State)
If the database may have partial safety schema:

**Step 1: Inspect current state**
```sql
-- Check if patients table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'patients';

-- Check which safety tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'patient_safety_profiles',
  'safety_check_ins',
  'safety_cases',
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

-- Check if RPC functions exist
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'get_patient_id_from_auth',
  'get_coordinator_verification_by_auth',
  'verify_patient_ownership'
);
```

**Step 2: Apply missing migrations based on inspection**

**Step 3: Use CREATE OR REPLACE for functions**
- Migration 006 already uses CREATE OR REPLACE
- Safe to reapply if function exists

**Step 4: Use IF NOT EXISTS for tables**
- All migrations use CREATE TABLE IF NOT EXISTS
- Safe to reapply if table exists

**Step 5: Use ADD COLUMN IF NOT EXISTS for alterations**
- Migration 002 uses ADD COLUMN IF NOT EXISTS
- Migration 004 uses ADD COLUMN IF NOT EXISTS
- Safe to reapply if column exists

### Critical Safety Precautions

1. **DO NOT DROP existing tables** - All migrations use CREATE IF NOT EXISTS
2. **DO NOT DROP existing data** - No DELETE statements in migrations
3. **DO NOT disable RLS** - All migrations enable RLS, never disable
4. **DO NOT apply seed data to production** - Seed file moved to seed/ directory
5. **BACKUP before migration** - Always create database backup before applying migrations

## Migration Application Commands

### Supabase Dashboard Method
1. Go to Supabase project dashboard
2. Navigate to SQL Editor
3. Apply migrations in order
4. Copy contents of each migration file
5. Paste and execute
6. Verify no errors

### Supabase CLI Method (Requires Configuration)
```bash
# Link project (requires config.toml or project ref)
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push

# Or apply specific migration
supabase migration apply
```

### Direct SQL Method
```bash
# Connect to database
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Apply migrations
\i supabase/migrations/000_create_patients_table.sql
\i supabase/migrations/001_create_safety_tables.sql
\i supabase/migrations/002_coordinator_verification.sql
\i supabase/migrations/003_fix_safety_rls.sql
\i supabase/migrations/004_monitoring_engine.sql
\i supabase/migrations/005_monitoring_audit_trail.sql
\i supabase/migrations/006_fix_coordinator_rpc_assigned_at.sql
```

## Post-Migration Verification Steps

### Verify Tables Exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'patients',
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
```

### Verify Foreign Keys
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

### Verify RPC Functions
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'get_patient_id_from_auth',
  'get_coordinator_verification_by_auth',
  'verify_patient_ownership'
);
```

### Verify RLS Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'patients',
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
```

## Conclusion

### Migration Status
- **Local migrations:** ✅ All present and correct
- **Schema correctness:** ✅ Fixed to match application expectations
- **Seed data:** ✅ Moved to development-only location
- **Remote state:** ❌ Unknown - no access available
- **Migration application:** ❌ Not applied - requires user action

### Required User Action
The user must:
1. Inspect remote database state using provided SQL
2. Apply missing migrations based on inspection
3. Verify post-migration state
4. Create patient records for existing auth users
5. Implement application logic for patient creation on signup

### System Classification
**CODE FIXED — DATABASE MIGRATION REQUIRED**

The code is correct, but the database schema changes have not been applied and cannot be verified without database access.
