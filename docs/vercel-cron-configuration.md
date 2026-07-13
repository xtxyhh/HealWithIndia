# Vercel Cron Configuration for Monitoring System

## Architecture Decision

**Chosen Architecture:** Vercel Cron Jobs with Native CRON_SECRET Authentication

**Rationale:**
- Vercel Cron is the native scheduling solution for Vercel deployments
- Vercel automatically sends Authorization: Bearer <CRON_SECRET> when CRON_SECRET is configured
- Endpoint validates CRON_SECRET using timing-safe comparison
- No external dependencies required
- Simple to configure and monitor

## Configuration

**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/admin/monitoring/evaluate",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Schedule:** Daily at midnight (0 0 * * *)

**Rationale for Daily Schedule:**
- Compatible with Vercel Hobby plan (Hobby cron schedules can run only once per day)
- Provides baseline monitoring for medical tourism safety
- Production-grade proactive monitoring should use more frequent schedules only on plans that support it (Pro or above)

**For Production-Grade Monitoring:**
On Vercel Pro plan or above, consider:
- `*/30 * * * *` (every 30 minutes) - recommended for proactive safety monitoring
- `0 * * * *` (every hour) - moderate frequency
- `*/15 * * * *` (every 15 minutes) - high-frequency monitoring

## Authentication

**Method:** Bearer Token in Authorization Header (Vercel Cron Native)

**Environment Variable:** `CRON_SECRET`

**Required:** Yes (endpoint fails closed if missing)

**Minimum Length:** 32 characters

**Generation:**
```bash
openssl rand -base64 32
```

## Vercel Cron Authorization Behavior

**Vercel Cron automatically sends Authorization: Bearer <CRON_SECRET> when CRON_SECRET is configured in the Vercel project.**

The endpoint is configured to:
- Accept Authorization: Bearer <CRON_SECRET>
- Validate CRON_SECRET using timing-safe comparison
- Reject secrets via query string (security requirement)
- Fail closed if CRON_SECRET is missing or too short

## Deployment Plan Compatibility

**Vercel Plan Requirements:**
- **Hobby plan:** Cron schedules can run only once per day
- **Pro plan and above:** Supports more frequent cron schedules

**Current Configuration:** Daily schedule (0 0 * * *) - compatible with all plans including Hobby

**If using Free Plan (no cron support):**
- Use external cron service (cron-job.org, EasyCron, etc.)
- Configure external service to call:
  ```bash
  curl -X POST https://your-domain.com/api/admin/monitoring/evaluate \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```

## Alternative Configurations

### Pro Plan - Recommended for Production
```json
{
  "crons": [{
    "path": "/api/admin/monitoring/evaluate",
    "schedule": "*/30 * * * *"
  }]
}
```
**Use Case:** Production-grade proactive safety monitoring
**Requirement:** Vercel Pro plan or above
**Consideration:** Balances responsiveness with resource usage

### High Frequency (Critical Operations)
```json
{
  "crons": [{
    "path": "/api/admin/monitoring/evaluate",
    "schedule": "*/15 * * * *"
  }]
}
```
**Use Case:** If real-time monitoring is required
**Requirement:** Vercel Pro plan or above
**Consideration:** Increases resource usage, may require overlap protection adjustment

## Monitoring and Alerting

**Recommended Monitoring:**
- Track evaluation success/failure via monitoring_evaluations table
- Alert on failed evaluations (error logging in endpoint)
- Monitor execution duration (performance regression)
- Track signals detected/cases created (operational metrics)

**Alerting Thresholds:**
- Evaluation failure: Immediate alert
- Execution duration > 5 minutes: Warning
- No signals detected for 24 hours: Info (may indicate no active journeys)

## Security Considerations

**Never:**
- Add CRON_SECRET to vercel.json
- Log the secret in endpoint
- Accept secret via query string
- Use weak or predictable secrets

**Always:**
- Store CRON_SECRET in Vercel project environment variables
- Rotate secret periodically
- Use HTTPS only
- Monitor for unusual evaluation patterns

## Testing Cron Configuration

**Local Testing:**
```bash
curl -X POST http://localhost:3000/api/admin/monitoring/evaluate \
  -H "Authorization: Bearer YOUR_LOCAL_CRON_SECRET"
```

**Production Testing:**
1. Set CRON_SECRET in Vercel project environment variables
2. Deploy with vercel.json
3. Monitor Vercel Cron logs
4. Verify monitoring_evaluations table receives records
5. Check execution duration metrics

## Rollback Plan

If cron configuration causes issues:
1. Remove or comment out cron in vercel.json
2. Redeploy
3. Use manual trigger for monitoring
4. Investigate logs before re-enabling
