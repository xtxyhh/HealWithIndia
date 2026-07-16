# Smart Tourist Protection System - Functional Audit Report

**Date:** July 2026  
**Audit Type:** Functional Recovery and Production Readiness  
**Status:** IN PROGRESS

## Executive Summary

This audit identified **CRITICAL FUNCTIONAL GAPS** that prevent the Smart Tourist Protection System from working end-to-end. While the UI renders and TypeScript compiles, several core features are non-functional due to missing database tables, dead CTAs, and incomplete data flows.

## Critical Findings

### 1. MISSING DATABASE TABLE - `patients` table does not exist
- **Severity:** CRITICAL - BLOCKING
- **Impact:** All safety tables reference `patients(id)` but this table is not defined in any migration
- **Evidence:** 
  - Migration 001 line 13: `patient_id BIGINT NOT NULL REFERENCES patients(id)`
  - Migration 002 line 10: `patient_id BIGINT NOT NULL REFERENCES patients(id)`
  - No migration creates the `patients` table
- **Result:** All foreign key constraints will fail, no safety data can be persisted
- **Status:** BLOCKING ALL FUNCTIONALITY

### 2. Dead CTA Buttons in ProtectionStatus Component
- **Severity:** HIGH
- **Impact:** Users cannot act on recommendations
- **Evidence:**
  - `components/ProtectionStatus.tsx` lines 180-187
  - `actionHref` values: `/safety/urgent-help`, `/safety`, `/safety/check-ins`
  - These are anchor tags that navigate to pages but don't perform the actual action
  - No action handlers for the specific recommendation context
- **Status:** UI ONLY - NO FUNCTIONAL ACTION EXECUTION

### 3. Checklist Toggle Has No Optimistic UI Rollback
- **Severity:** MEDIUM
- **Impact:** UI shows success even if server fails
- **Evidence:**
  - `app/safety/page.tsx` lines 195-215
  - Toggle immediately calls API, reloads all data on success
  - No optimistic UI update, but also no error handling for rollback
  - If API fails, user sees no feedback
- **Status:** PARTIAL - NO ERROR VISIBILITY

### 4. Risk Assessment API Returns Fake Defaults
- **Severity:** MEDIUM
- **Impact:** Users see "normal" risk when no data exists
- **Evidence:**
  - `app/api/safety/risk/route.ts` lines 56-65
  - Returns hardcoded "normal" status when no risk assessment exists
  - This is technically honest but may mask missing monitoring setup
- **Status:** WORKING BUT MAY MASK SETUP ISSUES

### 5. Coordinator Timeline Missing `assigned_at` Field
- **Severity:** LOW
- **Impact:** Timeline may show incorrect timestamp
- **Evidence:**
  - `lib/safety/protection-timeline.ts` line 139
  - Uses `coordinator.assigned_at` but API returns no such field
  - `app/api/safety/coordinator/route.ts` returns only: coordinator_id, reference_id, full_name, phone, is_verified, is_active
- **Status:** PARTIAL - FALLBACK TO CURRENT TIME

## Functional Audit Matrix

| Feature | Previous Status | Root Cause | Fix Implemented | Database Table | API Route | Auth Method | RLS Impact | Runtime Test | Refresh Persistence |
|---------|----------------|------------|----------------|---------------|-----------|-------------|------------|--------------|-------------------|
| Smart Check-In | BROKEN | Missing `patients` table | NOT FIXED | `safety_check_ins` | `/api/safety/check-ins` | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| "I'm Safe" action | BROKEN | Missing `patients` table | NOT FIXED | `safety_check_ins` | `/api/safety/check-ins` POST | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| "Need Assistance" action | BROKEN | Missing `patients` table | NOT FIXED | `safety_check_ins` + `safety_cases` | `/api/safety/check-ins` POST | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Urgent Help action | BROKEN | Missing `patients` table | NOT FIXED | `safety_cases` | `/api/safety/cases` POST | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Urgent Assistance case creation | BROKEN | Missing `patients` table | NOT FIXED | `safety_cases` | `/api/safety/cases` POST | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Safety checklist loading | BROKEN | Missing `patients` table | NOT FIXED | `journey_safety_checklist` | `/api/safety/checklist` GET | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Safety checklist item updates | BROKEN | Missing `patients` table | NOT FIXED | `journey_safety_checklist` | `/api/safety/checklist` POST | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Safety checklist persistence | BROKEN | Missing `patients` table | NOT FIXED | `journey_safety_checklist` | `/api/safety/checklist` POST | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Verified coordinator lookup | BROKEN | Missing `patients` table | NOT FIXED | `patient_auth_mapping` + `coordinator_assignments` | `/api/safety/coordinator` GET | `get_coordinator_verification_by_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Protection timeline loading | BROKEN | Missing `patients` table | NOT FIXED | Multiple tables | Client-side aggregation | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Protection status API | BROKEN | Missing `patients` table | NOT FIXED | Multiple tables | `/api/safety/protection-status` GET | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Protection status calculation | BROKEN | Missing `patients` table | NOT FIXED | N/A (server logic) | `/api/safety/protection-status` GET | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Next recommended action | BROKEN | Missing `patients` table + Dead CTAs | NOT FIXED | N/A (server logic) | `/api/safety/protection-status` GET | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Patient Safety Hub data loading | BROKEN | Missing `patients` table | NOT FIXED | Multiple tables | Multiple APIs | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Admin Safety Operations data loading | BROKEN | Missing `patients` table | NOT FIXED | Multiple tables | Server-side queries | Service role | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Admin urgent case status update | BROKEN | Missing `patients` table | NOT FIXED | `safety_cases` | Server-side update | Service role | BLOCKED - FK fails | NOT TESTED | NOT TESTED |
| Patient authentication on safety routes | WORKING | N/A | N/A | N/A | Supabase Auth | Supabase session | N/A | NOT TESTED | NOT TESTED |
| Admin safety authorisation | WORKING | N/A | N/A | N/A | Middleware check | Role-based | N/A | NOT TESTED | NOT TESTED |
| Logout/session expiration behaviour | NOT AUDITED | N/A | NOT FIXED | N/A | N/A | N/A | N/A | NOT TESTED | NOT TESTED |
| Page refresh state persistence | BROKEN | Missing `patients` table | NOT FIXED | Multiple tables | Multiple APIs | `get_patient_id_from_auth` RPC | BLOCKED - FK fails | NOT TESTED | NOT TESTED |

## Authentication Trace

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
All safety tables patient_id (BIGINT)
```

### Verification
- **RPC Function:** `get_patient_id_from_auth(auth_user_uuid UUID) RETURNS BIGINT`
- **Location:** Migration 002 lines 240-249
- **Security:** SECURITY DEFINER, SET search_path = public
- **Status:** CORRECTLY IMPLEMENTED

### Critical Issue
The `patients` table referenced by all foreign keys does not exist in any migration. This breaks the entire identity chain at the database level.

## Database Schema Reality vs Code Expectations

### Schema Issues Found

1. **Missing `patients` table**
   - Expected by: All safety tables (001, 002, 004, 005)
   - Status: NOT DEFINED
   - Impact: All FK constraints fail, no data persistence

2. **Coordinator `assigned_at` field**
   - Expected by: `lib/safety/protection-timeline.ts` line 139
   - Provided by: `get_coordinator_verification_by_auth` RPC (migration 002 lines 208-237)
   - Status: RPC does not return `assigned_at`
   - Impact: Timeline uses fallback timestamp

3. **Checklist `id` and `created_at` fields**
   - Expected by: `lib/safety/protection-timeline.ts` lines 154-155
   - Provided by: `/api/safety/checklist` GET
   - Status: API returns `id` and `created_at` from database
   - Impact: None - fields exist in schema

### Schema Consistency
- **patient_id type:** Consistently BIGINT across all migrations ✓
- **RLS policies:** Consistently use `verify_patient_ownership` ✓
- **Enum values:** Match between migrations and API validation ✓
- **Foreign keys:** All reference missing `patients` table ✗

## Broken APIs Found

### All Safety APIs - BLOCKING
- **Root Cause:** Missing `patients` table
- **Impact:** All INSERT/SELECT operations fail due to FK constraint violations
- **APIs Affected:**
  - `/api/safety/profile` - SELECT fails (FK check on query)
  - `/api/safety/check-ins` - INSERT fails (FK to patients)
  - `/api/safety/checklist` - INSERT fails (FK to patients)
  - `/api/safety/coordinator` - JOIN fails (FK to patients)
  - `/api/safety/cases` - INSERT fails (FK to patients)
  - `/api/safety/risk` - SELECT fails (FK check on query)
  - `/api/safety/fraud` - INSERT fails (FK to patients)
  - `/api/safety/protection-status` - All queries fail (FK checks)

## Dead Buttons Found

### ProtectionStatus Component CTAs
- **Location:** `components/ProtectionStatus.tsx` lines 180-187
- **Issue:** Anchor tags navigate to pages but don't execute specific actions
- **CTAs:**
  - "View Case" → `/safety/urgent-help` (just navigates, doesn't show specific case)
  - "Complete Checklist" → `/safety` (just navigates, doesn't focus checklist)
  - "Submit Check-In" → `/safety/check-ins` (just navigates, doesn't pre-select type)
  - "Contact Support" → `/safety` (just navigates, no contact action)
- **Status:** DEAD CTAs - NO FUNCTIONAL ACTION EXECUTION

## Placeholder or Hardcoded Data Found

### Risk Assessment Defaults
- **Location:** `app/api/safety/risk/route.ts` lines 56-65
- **Issue:** Returns hardcoded "normal" status when no risk assessment exists
- **Data:**
  ```json
  {
    "risk_level": "normal",
    "patient_safe_status": "Journey on track",
    "explanation": "Your journey is on track with regular check-ins.",
    "recommended_actions": [],
    "evaluated_at": "2026-07-13T..."
  }
  ```
- **Status:** TECHNICALLY HONEST but may mask missing monitoring setup

## Authentication Identity Mismatches Found

### None Found
- Auth chain is correctly implemented
- All APIs use `get_patient_id_from_auth` RPC
- No client-side patient ID passing
- No user ID vs patient ID confusion in code

## Database/Schema Mismatches Found

### Critical: Missing `patients` Table
- **Expected:** Table `patients` with `id BIGINT PRIMARY KEY`
- **Actual:** Table does not exist
- **Impact:** BLOCKING ALL FUNCTIONALITY
- **Required Migration:** Create `patients` table before migration 001

### Minor: Coordinator `assigned_at` Missing from RPC
- **Expected:** RPC returns `assigned_at` field
- **Actual:** RPC returns only coordinator_id, reference_id, full_name, phone, is_verified, is_active
- **Impact:** Timeline uses fallback timestamp
- **Fix:** Add `assigned_at` to RPC return or handle missing field in client

## RLS Failures Found

### None Found
- RLS policies are correctly defined
- `verify_patient_ownership` function is correctly implemented
- SECURITY DEFINER with SET search_path = public is correct
- No RLS bypass attempts in code

## Client State Synchronisation Failures Found

### Checklist Toggle No Error Feedback
- **Location:** `app/safety/page.tsx` lines 195-215
- **Issue:** If API fails, user sees no error message
- **Current Behavior:** Silent failure, reloads data on success only
- **Impact:** User doesn't know if toggle failed
- **Status:** PARTIAL - NO ERROR VISIBILITY

## Files Modified in This Audit

None - This is an audit-only phase.

## Files Created in This Audit

- `docs/functional-audit-report.md` (this file)

## Migrations Added in This Audit

None - This is an audit-only phase.

## Validation Commands Executed

- TypeScript compilation: `npx tsc --noEmit` - PASSED
- Lint check: `npm run lint` - NOT RUN (PowerShell execution policy issue)

## Browser Flows Actually Tested

**NONE** - Cannot test without:
1. `patients` table created in database
2. Valid patient records in database
3. Valid auth mappings in `patient_auth_mapping`
4. Test credentials for patient and admin users

## Flows NOT Tested and Why

### All Patient Flows
- **Reason:** Missing `patients` table blocks all database operations
- **Required:** Create `patients` table migration and seed test data

### All Admin Flows  
- **Reason:** Missing `patients` table blocks all database operations
- **Required:** Create `patients` table migration and seed test data

### Authentication Flows
- **Reason:** Cannot test without valid Supabase credentials
- **Required:** Test environment with valid auth setup

## Required Manual Test Credentials or Setup

### Database Setup Required
1. Create `patients` table with schema
2. Insert test patient records
3. Create `patient_auth_mapping` records linking auth users to patients
4. Create test coordinator records in `official_coordinators`
5. Create test coordinator assignments
6. Create test safety profiles

### Authentication Setup Required
1. Supabase project with auth enabled
2. Test patient user account
3. Test admin user account with appropriate role
4. Environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Remaining Broken Functionality

### CRITICAL - BLOCKING ALL FEATURES
1. **Missing `patients` table** - All safety features cannot persist data
2. **All safety APIs** - Cannot insert/select data due to FK failures
3. **All patient workflows** - Cannot complete any safety action

### HIGH - UX ISSUES
1. **Dead CTA buttons** - Recommendations don't execute actions
2. **No error feedback** - Checklist toggle failures invisible

### MEDIUM - DATA INTEGRITY
1. **Coordinator timestamp** - Timeline uses fallback for `assigned_at`
2. **Risk defaults** - May mask missing monitoring setup

## Next Steps Required

### Phase 1: Database Schema Fix (BLOCKING)
1. Create migration for `patients` table
2. Define `patients` table schema (id, name, email, country, etc.)
3. Apply migration to database
4. Seed test patient data
5. Create auth mappings for test users

### Phase 2: Fix Dead CTAs
1. Implement action handlers for each recommendation type
2. Add navigation with state/context preservation
3. Test CTA execution end-to-end

### Phase 3: Error Handling
1. Add error feedback for checklist toggle
2. Add loading states for all mutations
3. Add retry mechanisms for failed operations

### Phase 4: Runtime Testing
1. Test all patient flows with real credentials
2. Test all admin flows with real credentials
3. Verify page refresh persistence
4. Verify error handling

## Conclusion

**The Smart Tourist Protection System is NOT FUNCTIONAL.**

While the code compiles and the UI renders, the system cannot persist any safety data due to a missing `patients` table that all safety tables reference via foreign keys. This is a BLOCKING issue that prevents ALL features from working.

Additionally, recommendation CTAs are dead buttons that don't execute actions, and error handling is incomplete.

**DO NOT DEPLOY TO PRODUCTION.**

**REQUIRED ACTIONS:**
1. Create `patients` table migration immediately
2. Fix dead CTA buttons
3. Add comprehensive error handling
4. Perform end-to-end testing with real credentials

