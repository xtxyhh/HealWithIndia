# Security and Abuse Audit - Smart Tourist Safety Monitoring System

## Executive Summary

This audit covers the security posture of the newly implemented Journey Safety Monitoring Engine and Incident Response System. The system follows the existing HealWithIndia security model with RLS, auth mapping, and role-based access control.

## Authentication & Authorization

### ✅ Secure Patterns
- **Admin endpoints** (`/api/admin/*`) use `app_metadata.role` for authorization (not user-editable `user_metadata`)
- **Patient endpoints** (`/api/safety/*`) use auth mapping to resolve patient_id from auth.user.id
- **Monitoring endpoint** (`/api/admin/monitoring/evaluate`) uses Bearer token with `MONITORING_SECRET`
- All endpoints verify authenticated user before processing

### ⚠️ Security Considerations

#### 1. Monitoring Secret Management
**Risk:** If `MONITORING_SECRET` is leaked, attacker can trigger monitoring evaluations

**Mitigations:**
- Secret must be stored in environment variables (never in code)
- Use cryptographically secure random string (min 32 chars)
- Rotate secret periodically
- Monitor for unusual evaluation patterns

**Recommendation:** Add rate limiting to evaluate endpoint even with secret

#### 2. No Rate Limiting
**Risk:** Authenticated users could abuse API endpoints

**Current State:** No rate limiting implemented

**Recommendation:** Implement rate limiting using:
- Vercel Edge Config for production
- In-memory rate limiting for development
- Limit: 100 requests/minute per user for patient endpoints
- Limit: 10 requests/minute for admin endpoints

#### 3. Request Size Limits
**Risk:** Large payloads could cause resource exhaustion

**Current State:** No explicit request size limits

**Recommendation:** Add Next.js config limits:
```typescript
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
}
```

## Row Level Security (RLS)

### ✅ Secure Patterns
- All new tables (`monitoring_signals`, `risk_assessments`, `monitoring_evaluations`) have RLS enabled
- Patient-owned tables use `verify_patient_ownership` SECURITY DEFINER helper
- Service role has full access for admin operations
- Patients can only view their own data

### ⚠️ Security Considerations

#### 1. Monitoring Evaluations Table
**Risk:** Service role only access is correct, but no audit of who triggered evaluations

**Current State:** `triggered_by` field exists but not validated

**Recommendation:** Validate `triggered_by` against allowed values (scheduled, manual, event)

#### 2. Signal Metadata
**Risk:** JSONB metadata could contain sensitive data if not careful

**Current State:** Metadata is unstructured JSONB

**Mitigation:** Document that metadata should never contain PII or sensitive data

## Input Validation

### ✅ Secure Patterns
- Check-in types validated against allowed values
- Signal types validated via CHECK constraints
- Risk levels validated via CHECK constraints
- Response actions validated against allowed values

### ⚠️ Security Considerations

#### 1. Signal Detector Metadata
**Risk:** Unvalidated metadata could cause issues

**Current State:** Metadata is passed through without validation

**Recommendation:** Add schema validation for metadata fields

#### 2. Escalation Actions
**Risk:** Malformed escalation actions could cause database errors

**Current State:** Actions are validated but error handling could be improved

**Recommendation:** Add comprehensive error logging for failed escalations

## Data Exposure Risks

### ✅ Secure Patterns
- Patient IDs are BIGINT (not UUIDs), preventing direct enumeration
- Auth mapping prevents cross-patient data access
- Admin endpoints limited to authorized roles
- Patient-facing status messages are sanitized (no technical details)

### ⚠️ Security Considerations

#### 1. Admin Monitoring Endpoint
**Risk:** Returns all active signals and risk assessments

**Current State:** No pagination, could return large datasets

**Recommendation:** Add pagination to `/api/admin/monitoring` endpoint

#### 2. Patient Risk Endpoint
**Risk:** Returns signal metadata that could contain sensitive info

**Current State:** Signals returned to patient include metadata

**Recommendation:** Filter metadata before returning to patient

## Abuse Potential

### 1. Case Creation Spam
**Risk:** Patient could trigger multiple case creations

**Mitigation:** `IncidentEscalator.shouldSuppressCaseCreation` prevents:
- More than 3 cases per hour per patient
- Duplicate cases within 1 hour

**Status:** ✅ Implemented

### 2. Signal Spam
**Risk:** Could flood monitoring_signals table

**Mitigation:** UNIQUE constraint on (patient_id, signal_type, source_entity_id, status)

**Status:** ✅ Implemented

### 3. Evaluation Abuse
**Risk:** Attacker with secret could trigger excessive evaluations

**Mitigation:** None currently

**Recommendation:** Add rate limiting (max 1 evaluation per minute)

## Audit Trail

### ✅ Implemented
- `monitoring_evaluations` table records all evaluation runs
- `safety_case_events` table records all case state changes
- Response actions logged with operator email

### ⚠️ Missing
- No audit log for signal creation/resolution
- No audit log for risk assessment changes
- No request ID for traceability

**Recommendation:** Add request ID generation and logging

## Privacy Considerations

### ✅ Secure Patterns
- No location tracking (per requirements)
- No continuous monitoring (per requirements)
- Patient-facing messages avoid fear-inducing language
- Risk explanations are explainable and non-technical

### ⚠️ Considerations
- Signal metadata could inadvertently capture sensitive info
- Risk assessment explanations should be reviewed for privacy

**Recommendation:** Add privacy review of all patient-facing messages

## Critical Issues Summary

| Issue | Severity | Status | Recommendation |
|-------|----------|--------|----------------|
| No rate limiting on evaluate endpoint | High | Open | Add rate limiting |
| No pagination on admin monitoring endpoint | Medium | Open | Add pagination |
| Signal metadata not filtered for patients | Medium | Open | Filter metadata |
| No audit log for signal changes | Low | Open | Add audit logging |
| No request ID for traceability | Low | Open | Add request ID |

## Recommended Actions

### Immediate (Before Deployment)
1. Add rate limiting to `/api/admin/monitoring/evaluate` endpoint
2. Add pagination to `/api/admin/monitoring` endpoint
3. Filter signal metadata in `/api/safety/risk` endpoint
4. Generate and set `MONITORING_SECRET` in production

### Short Term (Within 1 Week)
1. Implement comprehensive rate limiting across all endpoints
2. Add request ID generation and logging
3. Add audit logging for signal and risk assessment changes
4. Review all patient-facing messages for privacy

### Long Term (Within 1 Month)
1. Implement monitoring for security events (failed auth, rate limit violations)
2. Add automated security testing to CI/CD
3. Conduct penetration testing of monitoring system
4. Document incident response procedures for security incidents

## Compliance Notes

- **GDPR**: No personal data beyond existing patient records. Risk assessments are explainable.
- **HIPAA**: If handling medical data, ensure BAA with cloud providers. No PHI in monitoring signals.
- **Data Retention**: Consider retention policy for monitoring_evaluations and resolved signals

## Conclusion

The monitoring system follows the existing HealWithIndia security model with proper RLS, auth mapping, and role-based access control. The main areas for improvement are rate limiting, pagination, and audit logging. No critical security vulnerabilities were identified, but the recommended actions should be implemented before production deployment.
