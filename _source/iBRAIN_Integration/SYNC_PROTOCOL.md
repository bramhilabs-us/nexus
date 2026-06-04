# Data Sync Protocol

<!-- @GENOME T2-INT-005 | ACTIVE | 2026-03-30 | parent:T2-INT-001 | auto:/coding | linked:/strategy -->

> Rules and patterns for synchronizing data between KARVIA and iBrain.

**Status**: DRAFT (Pre-integration)
**Version**: 0.1

---

## 1. Sync Strategy: Hybrid

```
┌─────────────────────────────────────────────────────────────┐
│                     REAL-TIME SYNC                          │
│  For: User actions requiring immediate ML response          │
│  Method: Webhook/API call                                   │
│  Latency: < 1 second                                        │
├─────────────────────────────────────────────────────────────┤
│  Examples:                                                  │
│  • Task completed → Momentum update                         │
│  • Goal at risk → Immediate nudge                          │
│  • Streak about to break → Intervention                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      BATCH SYNC                             │
│  For: Analytics, model training, non-urgent updates        │
│  Method: Scheduled job                                      │
│  Frequency: Hourly (activity), Daily (aggregates)          │
├─────────────────────────────────────────────────────────────┤
│  Examples:                                                  │
│  • Daily progress summaries                                 │
│  • Weekly pattern analysis                                  │
│  • Historical data for model training                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Data Ownership

| Data | Owner | Sync Direction |
|------|-------|----------------|
| Users, Companies | KARVIA | KARVIA → iBrain |
| Tasks, Goals, Objectives | KARVIA | KARVIA → iBrain |
| ML Scores, Predictions | iBrain | iBrain → KARVIA |
| Nudges (content) | iBrain | iBrain → KARVIA |
| Nudge delivery status | KARVIA | KARVIA → iBrain |

---

## 3. Conflict Resolution

### Rule: KARVIA is Source of Truth for Business Data

| Scenario | Resolution |
|----------|------------|
| Task deleted in KARVIA | iBrain removes from analysis |
| User updated in KARVIA | iBrain refreshes profile |
| Goal progress conflict | KARVIA value wins |
| Nudge delivery failed | KARVIA retries, reports to iBrain |

### Rule: iBrain is Source of Truth for ML Data

| Scenario | Resolution |
|----------|------------|
| Model updated | iBrain pushes new predictions |
| Score recalculated | iBrain sends updated scores |
| Nudge content changed | iBrain sends new content |

---

## 4. Sync Events

### KARVIA → iBrain

| Event | Trigger | Data |
|-------|---------|------|
| `sync.user.created` | New user | User profile (no PII) |
| `sync.user.updated` | Profile change | Changed fields |
| `sync.task.batch` | Hourly | All task activity |
| `sync.goal.batch` | Hourly | All goal updates |
| `sync.daily.summary` | Daily 00:00 UTC | Aggregated metrics |

### iBrain → KARVIA

| Event | Trigger | Data |
|-------|---------|------|
| `sync.nudge.push` | ML decision | Nudge content |
| `sync.score.update` | Score recalc | New scores |
| `sync.prediction.update` | Model run | Updated predictions |

---

## 5. Failure Handling

### KARVIA → iBrain Failures

```
Attempt 1 ──► Fail ──► Wait 1s
Attempt 2 ──► Fail ──► Wait 5s
Attempt 3 ──► Fail ──► Wait 30s
Attempt 4 ──► Fail ──► Dead Letter Queue
                       └──► Alert Operations
                       └──► Retry in 1 hour
```

### iBrain → KARVIA Failures

```
Nudge delivery fails ──► iBrain retries 3x
                        └──► Mark nudge as undeliverable
                        └──► Analytics flag for user
```

---

## 6. Data Retention

| System | Retention | Notes |
|--------|-----------|-------|
| KARVIA | Indefinite | Business data |
| iBrain (raw events) | 90 days | GDPR compliance |
| iBrain (aggregates) | 2 years | ML training |
| Sync logs | 30 days | Debugging |

---

## 7. Privacy Sync Rules

1. **No PII in sync payloads** - Use IDs only
2. **Respect opt-out** - Check `user.telemetry_enabled`
3. **GDPR deletion** - KARVIA notifies iBrain, iBrain purges
4. **Cross-company isolation** - Never sync data across companies

---

*Protocol owner: Shared (KARVIA + iBrain engineering)*
