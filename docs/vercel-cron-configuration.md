# Vercel Cron Configuration for Monitoring System

## Architecture Decision

**Chosen Architecture:** Vercel Cron Jobs with Bearer Token Authentication

**Rationale:**
- Vercel Cron is the native scheduling solution for Vercel deployments
- Endpoint already designed for Bearer token authentication via MONITORING_SECRET
- No external dependencies required
- Simple to configure and monitor

## Configuration

**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/admin/monitoring/evaluate",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

**Schedule:** Every 30 minutes

**Rationale for 30-minute interval:**
- Balances responsiveness with resource usage
- Allows sufficient time for monitoring evaluation to complete
- Prevents overlapping executions (2-minute overlap protection in endpoint)
- Appropriate for medical tourism safety monitoring (not real-time emergency response)

## Authentication

**Method:** Bearer Token in Authorization Header

**Environment Variable:** `MONITORING_SECRET`

**Required:** Yes (endpoint fails closed if missing)

**Minimum Length:** 32 characters

**Generation:**
```bash
openssl rand -base64 32
```

## Vercel Cron Authorization Behavior

**Vercel Cron does NOT automatically add Authorization headers.**

The endpoint must be configured to accept:
- Authorization: Bearer <MONITORING_SECRET>

Vercel Cron invokes the endpoint as a standard HTTP request without special headers. The authentication is handled by the endpoint itself validating the Bearer token.

## Deployment Plan Compatibility

**Vercel Plan Requirements:**
- Cron Jobs available on Pro plan and above
- Free plan does NOT support Cron Jobs

**If using Free Plan:**
- Use external cron service (cron-job.org, EasyCron, etc.)
- Configure external service to call:
  ```bash
  curl -X POST https://your-domain.com/api/admin/monitoring/evaluate \
    -H "Authorization: Bearer YOUR_MONITORING_SECRET"
  ```

## Alternative Configurations

### Higher Frequency (Critical Operations)
```json
{
  "crons": [{
    "path": "/api/admin/monitoring/evaluate",
    "schedule": "*/15 * * * *"
  }]
}
```
**Use Case:** If real-time monitoring is required
**Consideration:** Increases resource usage, may require overlap protection adjustment

### Lower Frequency (Resource Optimization)
```json
{
  "crons": [{
    "path": "/api/admin/monitoring/evaluate",
    "schedule": "0 * * * *"
  }]
}
```
**Use Case:** If monitoring frequency can be hourly
**Consideration:** Delayed detection of safety signals

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
- Add MONITORING_SECRET to vercel.json
- Log the secret in endpoint
- Accept secret via query string
- Use weak or predictable secrets

**Always:**
- Store MONITORING_SECRET in environment variables
- Rotate secret periodically
- Use HTTPS only
- Monitor for unusual evaluation patterns

## Testing Cron Configuration

**Local Testing:**
```bash
curl -X POST http://localhost:3000/api/admin/monitoring/evaluate \
  -H "Authorization: Bearer YOUR_LOCAL_MONITORING_SECRET"
```

**Production Testing:**
1. Deploy with vercel.json
2. Monitor Vercel Cron logs
3. Verify monitoring_evaluations table receives records
4. Check execution duration metrics

## Rollback Plan

If cron configuration causes issues:
1. Remove or comment out cron in vercel.json
2. Redeploy
3. Use manual trigger for monitoring
4. Investigate logs before re-enabling
