# Autonomy & Budget

**Owner**: human (only humans edit this file)
**Last reviewed**: 2026-06-03

---

## Current autonomy level

```
LEVEL: 0
```

| Level | Behavior |
|---|---|
| **0** ← current | Agent opens PRs; human merges. No auto-deploy. |
| 1 | Auto-merge on green CI. No prod deploy. |
| 2 | Auto-merge + auto-deploy to staging. Prod human-gated. |
| 3 | Full auto-deploy to prod. (Not in scope yet.) |

## Budget

```
DAILY_BUDGET_USD: 60
DAILY_TICK_CEILING: 20
PER_TICK_TIMEOUT_SECONDS: 1200
```

## Active windows

```
CRON_WINDOW: 23:00–07:00 local
TICK_INTERVAL: 30 minutes
```

## Kill switch

To stop the agent immediately:
- Set `LEVEL: -1` in this file → tick will exit on read
- Or delete the cron via `/schedule delete <id>`
