# Local Observability Stack

Grafana + Loki + Promtail for log exploration during development.

## How it works

```
API (bun dev) → writes JSON to logs/api.log
                     ↓
              Promtail (Docker) reads the file
                     ↓
              Loki (Docker) stores the logs
                     ↓
              Grafana (Docker) lets you query them
```

The app has no dependency on Loki or Grafana. It only writes JSON to a file.

---

## Setup (one-time)

### 1. Enable log file output in the API

Make sure `apps/api/.env` contains:

```env
LOG_FILE=logs/api.log
```

This tells Pino to write a JSON copy of every log line to `apps/api/logs/api.log` in addition to the pretty-printed terminal output. `LOG_FILE` is relative to the API process working directory (`apps/api/`).

> **Don't set `LOG_FILE` in production.** Without it, the logger writes JSON to stdout only — the correct behaviour for hosted environments.

### 2. Start the observability stack

```bash
pnpm run docker:obs
```

This starts three containers:

| Container | Port | Role |
|---|---|---|
| `4sports-loki` | 3100 | Log storage |
| `4sports-promtail` | — | Reads `apps/api/logs/*.log`, ships to Loki |
| `4sports-grafana` | **3001** | Query UI |

Grafana is pre-configured with Loki as the default datasource. Anonymous access is enabled — no login required.

### 3. Start the API

```bash
pnpm run dev:api
```

The `logs/api.log` file is created automatically when the first log line is written.

---

## Querying logs in Grafana

1. Open **http://localhost:3001**
2. Click **Explore** (compass icon in the left sidebar)
3. Make sure the datasource is **Loki**
4. Use LogQL to filter:

```logql
# All API logs
{service="api"}

# Errors only
{service="api", level="error"}

# Filter by message content
{service="api"} |= "request completed"

# Specific scope (child logger)
{service="api", scope="api"}
```

---

## Stopping the stack

```bash
pnpm run docker:obs:down
```

Log data persists in Docker named volumes between restarts. To wipe it:

```bash
docker compose -f docker/observability/docker-compose.yml down -v
```

---

## Troubleshooting

**No logs appear in Grafana**

- Confirm `LOG_FILE=logs/api.log` is set in `apps/api/.env`
- Confirm the API has been started and received at least one request
- Check that `apps/api/logs/api.log` exists and has content:
  ```bash
  tail -f apps/api/logs/api.log
  ```
- Check Promtail is picking up the file:
  ```bash
  pnpm run docker:obs:logs
  ```
  You should see `Promtail started` and lines like `file_target_event: new file found`.

**Grafana shows "No data"**

- In Explore, widen the time range (top-right) — Grafana defaults to "Last 1 hour".
- Make sure the query runs after the API has written logs.

**Port 3001 already in use**

Change the Grafana host port in `docker/observability/docker-compose.yml`:
```yaml
ports:
  - '3002:3000'   # pick any free port
```
