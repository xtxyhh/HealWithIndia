# Monitoring Execution Architecture

## Overview

The Journey Safety Monitoring Engine uses a scheduled API endpoint architecture for server-side evaluation. This approach is chosen over Vercel Cron or Supabase pg_cron for simplicity and integration with the existing Next.js API infrastructure.

## Architecture

### Scheduled Endpoint

**Endpoint:** `/api/admin/monitoring/evaluate`

**Method:** POST

**Authentication:** Bearer token via `MONITORING_SECRET` environment variable

**Execution:** Can be triggered by:
- Vercel Cron Jobs
- GitHub Actions
- External cron services (e.g., cron-job.org)
- Manual admin trigger

### Execution Flow

1. **Authentication**: Verify `MONITORING_SECRET` in Authorization header
2. **Data Fetching**: Load active patient safety profiles, check-ins, cases, fraud reports
3. **Signal Detection**: Run SignalDetector to identify new safety signals
4. **Deduplication**: Filter out suppressed signals using IncidentEscalator
5. **Signal Storage**: Insert new signals, resolve outdated signals
6. **Risk评估**: Run RiskAssessor to evaluate patient risk levels
7. **Escalation**: Execute incident escalation actions via IncidentEscalator
8. **Audit**: Record execution metrics in monitoring_evaluations table

### Idempotency

The evaluation is designed to be idempotent:
- Duplicate signals are prevented by UNIQUE constraint on (patient_id, signal_type, source_entity_id, status)
- Outdated signals are marked as resolved rather than deleted
- Risk assessments use `is_current` flag to prevent multiple concurrent assessments
- Case creation includes spam detection to prevent duplicate cases

## Required Environment Variables

```env
MONITORING_SECRET=your-secure-random-secret-here
```

**Generation:** Use a cryptographically secure random string (minimum 32 characters)

**Example:** `openssl rand -base64 32`

## Deployment Configuration

### Vercel Cron (Recommended)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/admin/monitoring/evaluate",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

**Schedule:** Every 15 minutes (adjustable based on operational requirements)

### Alternative: External Cron Service

If not using Vercel Cron, configure an external cron service to:

```bash
curl -X POST https://your-domain.com/api/admin/monitoring/evaluate \
  -H "Authorization: Bearer YOUR_MONITORING_SECRET"
```

### Manual Trigger

Admin can manually trigger evaluation via:

```bash
curl -X POST https://your-domain.com/api/admin/monitoring/evaluate \
  -H "Authorization: Bearer YOUR_MONITORING_SECRET"
```

## Performance Considerations

- Evaluation processes all active journeys in a single execution
- Current implementation is synchronous; consider batching for large scale
- Monitoring evaluations table tracks execution duration for performance monitoring
- Add pagination if active journeys exceed 1000 patients

## Security Considerations

- `MONITORING_SECRET` must be kept confidential
- Never log or expose the secret
- Rotate secret periodically
- Use HTTPS only for endpoint calls
- Endpoint is admin-only, no patient access

## Failure Handling

- Individual patient evaluation failures do not stop overall execution
- Errors are logged but execution continues
- Monitoring evaluations table records success/failure metrics
- Implement alerting on repeated evaluation failures

## Scaling

For large-scale deployments (1000+ active patients):

1. Implement patient batching
2. Add parallel processing
3. Consider dedicated worker process
4. Implement queue-based architecture (e.g., Supabase Edge Functions + Queue)
