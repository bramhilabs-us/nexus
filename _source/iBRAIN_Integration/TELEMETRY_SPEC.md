# Telemetry Specification

<!-- @GENOME T2-INT-003 | ACTIVE | 2026-03-30 | parent:T2-INT-001 | auto:/coding | linked:/strategy -->

> Defines the events KARVIA emits to iBrain for behavioral analysis.

**Status**: DRAFT (Pre-integration)
**Version**: 0.1

---

## 1. Event Categories

### 1.1 Task Events
| Event | Trigger | Priority |
|-------|---------|----------|
| `task.created` | New task added | Low |
| `task.started` | Task marked in_progress | Medium |
| `task.completed` | Task marked done | High |
| `task.overdue` | Deadline passed | High |
| `task.rescheduled` | Deadline changed | Medium |

### 1.2 Goal Events
| Event | Trigger | Priority |
|-------|---------|----------|
| `goal.created` | New goal added | Medium |
| `goal.progress_updated` | Progress changed | Low |
| `goal.at_risk` | Health < 40% | High |
| `goal.completed` | 100% progress | High |

### 1.3 Session Events
| Event | Trigger | Priority |
|-------|---------|----------|
| `session.started` | User logs in | Low |
| `session.ended` | User logs out/timeout | Medium |
| `session.page_view` | Navigation event | Low |

### 1.4 Engagement Events
| Event | Trigger | Priority |
|-------|---------|----------|
| `streak.achieved` | N consecutive days | High |
| `streak.broken` | Missed day | High |
| `badge.earned` | Achievement unlocked | Medium |
| `points.awarded` | PBL points added | Low |

---

## 2. Event Schema

```typescript
interface TelemetryEvent {
  // Required fields
  event_type: string;
  timestamp: string;          // ISO 8601
  user_id: string;
  company_id: string;

  // Event-specific data
  payload: Record<string, any>;

  // Context
  context: {
    session_id?: string;
    platform: "web" | "mobile" | "api";
    timezone: string;
    user_agent?: string;
  };

  // Metadata
  meta: {
    karvia_version: string;
    event_version: string;
  };
}
```

---

## 3. Example Events

### Task Completed
```json
{
  "event_type": "task.completed",
  "timestamp": "2026-04-15T08:30:00Z",
  "user_id": "usr_xyz789",
  "company_id": "cmp_def456",
  "payload": {
    "task_id": "tsk_123",
    "task_title": "Follow up with prospect",
    "goal_id": "gol_456",
    "key_result_id": "kr_789",
    "objective_id": "obj_012",
    "time_to_complete_minutes": 45,
    "was_overdue": false,
    "completion_source": "manual"
  },
  "context": {
    "session_id": "ses_abc",
    "platform": "web",
    "timezone": "America/New_York"
  },
  "meta": {
    "karvia_version": "1.2.0",
    "event_version": "1.0"
  }
}
```

### Streak Achieved
```json
{
  "event_type": "streak.achieved",
  "timestamp": "2026-04-15T23:59:59Z",
  "user_id": "usr_xyz789",
  "company_id": "cmp_def456",
  "payload": {
    "streak_days": 7,
    "streak_type": "daily_task_completion",
    "previous_best": 5
  },
  "context": {
    "platform": "web",
    "timezone": "America/New_York"
  },
  "meta": {
    "karvia_version": "1.2.0",
    "event_version": "1.0"
  }
}
```

---

## 4. Emission Rules

### When to Emit
- Emit immediately on event occurrence
- Batch low-priority events (max 100/batch, 60s window)
- High-priority events: real-time (< 1s delay)

### What NOT to Emit
- PII (names, emails) - use IDs only
- Sensitive business data
- System/debug events

### Retry Policy
- 3 retries with exponential backoff
- Dead letter queue after failures
- Alert on sustained failures

---

## 5. Privacy Considerations

- No PII in telemetry payloads
- User can opt-out (respects `telemetry_enabled` flag)
- Data retained for 90 days in iBrain
- GDPR deletion requests honored

---

*Spec owner: KARVIA team. iBrain team implements ingestion.*
