# Uptime Monitoring (Free)

## UptimeRobot

1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free tier)
2. Add a new monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://your-app.onrender.com/health`
   - **Monitoring Interval**: 5 minutes
3. The `/health` endpoint returns:
   - `200` when app and DB are healthy
   - `503` when DB is down or unhealthy
4. UptimeRobot pings keep Render free tier awake (prevents cold starts)

## Health endpoint

`GET /health` returns:

```json
{
  "status": "healthy",
  "app": "running",
  "db": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

- `status`: `healthy` | `degraded` | `unhealthy`
- `db`: `healthy` | `disconnected` | etc.
- Response `x-request-id` header for tracing
