# API Contract: KARVIA ↔ iBrain

<!-- @GENOME T2-INT-002 | ACTIVE | 2026-03-30 | parent:T2-INT-001 | auto:/coding | linked:/strategy -->

> Shared API schemas and contracts for KARVIA-iBrain integration.

**Status**: DRAFT (Pre-integration)
**Version**: 0.1

---

## 1. iBrain → KARVIA (Nudge Delivery)

### POST /api/webhooks/ibrain/nudge

KARVIA exposes this endpoint to receive nudges from iBrain.

**Request**:
```json
{
  "nudge_id": "nud_abc123",
  "user_id": "usr_xyz789",
  "company_id": "cmp_def456",
  "type": "momentum" | "risk" | "celebration" | "reminder",
  "message": "You're on a 3-day streak! Keep the momentum going.",
  "priority": "high" | "medium" | "low",
  "expires_at": "2026-04-15T12:00:00Z",
  "metadata": {
    "trigger_event": "task.completed",
    "confidence": 0.85,
    "model_version": "v1.2.3"
  }
}
```

**Response**:
```json
{
  "received": true,
  "nudge_id": "nud_abc123",
  "scheduled_for_display": "2026-04-15T08:00:00Z"
}
```

**Error Codes**:
| Code | Meaning |
|------|---------|
| 400 | Invalid payload |
| 401 | Invalid iBrain API key |
| 404 | User not found |
| 429 | Rate limited |

---

## 2. KARVIA → iBrain (Telemetry)

### POST /api/telemetry/events (iBrain endpoint)

KARVIA sends events to iBrain for analysis.

**Request**:
```json
{
  "event_type": "task.completed",
  "timestamp": "2026-04-15T08:30:00Z",
  "user_id": "usr_xyz789",
  "company_id": "cmp_def456",
  "payload": {
    "task_id": "tsk_123",
    "goal_id": "gol_456",
    "time_spent_minutes": 45,
    "completion_quality": "on_time"
  },
  "context": {
    "session_id": "ses_abc",
    "platform": "web",
    "timezone": "America/New_York"
  }
}
```

**Response**:
```json
{
  "received": true,
  "event_id": "evt_ibr_789",
  "processing_status": "queued"
}
```

---

## 3. Shared Data Types

### User Reference
```typescript
interface UserRef {
  user_id: string;        // KARVIA user ID
  company_id: string;     // KARVIA company ID
  role: "CONSULTANT" | "BUSINESS_OWNER" | "EXECUTIVE" | "MANAGER" | "EMPLOYEE";
}
```

### Event Types
```typescript
type EventType =
  | "task.created"
  | "task.completed"
  | "task.overdue"
  | "goal.created"
  | "goal.updated"
  | "goal.completed"
  | "objective.created"
  | "objective.at_risk"
  | "session.started"
  | "session.ended"
  | "streak.achieved"
  | "streak.broken";
```

### Nudge Types
```typescript
type NudgeType =
  | "momentum"      // Positive reinforcement
  | "risk"          // Early warning
  | "celebration"   // Achievement recognition
  | "reminder"      // Gentle prompt
  | "coaching"      // Skill development
  | "recovery";     // Re-engagement
```

---

## 4. Authentication

### iBrain → KARVIA
```
Authorization: Bearer {KARVIA_IBRAIN_WEBHOOK_SECRET}
X-iBrain-Signature: {HMAC-SHA256 of payload}
```

### KARVIA → iBrain
```
Authorization: Bearer {IBRAIN_API_KEY}
X-KARVIA-Client-ID: karvia-business
```

---

## 5. Rate Limits

| Direction | Limit | Window |
|-----------|-------|--------|
| KARVIA → iBrain | 1000 events | per minute |
| iBrain → KARVIA | 100 nudges | per user per day |

---

## 6. Versioning

API version in header: `X-API-Version: 2026-04-01`

Breaking changes require new version and 6-month deprecation.

---

*Contract owner: KARVIA team. Changes require iBrain team review.*
