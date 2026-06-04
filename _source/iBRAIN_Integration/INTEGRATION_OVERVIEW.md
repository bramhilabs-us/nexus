# iBrain Integration Overview

<!-- @GENOME T2-INT-001 | ACTIVE | 2026-03-30 | parent:T1-ARC-001 | auto:/strategy | linked:/coding -->

> The master plan for integrating iBrain intelligence layer with KARVIA engine.

**Status**: PLANNED (Beta does not require iBrain)
**Target**: Post-Beta (Q2 2026)

---

## 1. Integration Vision

```
Current (Beta)                    Future (Post-Beta)
━━━━━━━━━━━━━━                    ━━━━━━━━━━━━━━━━━━
┌────────────┐                    ┌────────────┐
│   YSELA    │                    │   YSELA    │
└─────┬──────┘                    └─────┬──────┘
      │                                 │
      ▼                                 ▼
┌────────────┐                    ┌────────────┐
│  KARVIA    │                    │  KARVIA    │◄────── Nudges, Predictions
│ (Standalone)│                    │ (Connected)│
└────────────┘                    └─────┬──────┘
                                        │
                                        ▼ Telemetry
                                  ┌────────────┐
                                  │  iBrain    │
                                  │ (ML/AI)    │
                                  └────────────┘
```

---

## 2. Integration Phases

### Phase 1: Telemetry Foundation (Q2 2026)
- KARVIA emits events to iBrain
- Events: task.completed, goal.updated, session.ended
- One-way flow (KARVIA → iBrain)
- No iBrain responses yet

### Phase 2: Basic Nudges (Q3 2026)
- iBrain analyzes patterns
- Returns simple nudges
- KARVIA displays via YSELA
- Two-way flow established

### Phase 3: Predictive Intelligence (Q4 2026)
- Risk prediction for objectives
- Momentum detection
- Personalized coaching
- Full bidirectional integration

---

## 3. Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Communication | REST API (not message queue) | Simpler for MVP, can evolve |
| Data sync | Hybrid (real-time + batch) | Balance latency vs cost |
| Identity | KARVIA owns, iBrain references | Single source of truth |
| Fallback | KARVIA works without iBrain | Graceful degradation |

---

## 4. Key Documents

| Document | Purpose |
|----------|---------|
| [API_CONTRACT.md](API_CONTRACT.md) | Shared API schemas |
| [TELEMETRY_SPEC.md](TELEMETRY_SPEC.md) | Event format definitions |
| [ML_REQUIREMENTS.md](ML_REQUIREMENTS.md) | What KARVIA needs from ML |
| [SYNC_PROTOCOL.md](SYNC_PROTOCOL.md) | Data synchronization rules |
| [SHARED_GLOSSARY.md](SHARED_GLOSSARY.md) | Unified terminology |

---

## 5. Technical Requirements

### KARVIA Must Provide:
- Webhook endpoint for receiving nudges
- Telemetry emission on key events
- User context in event payloads
- Graceful handling of iBrain unavailability

### iBrain Must Provide:
- RESTful nudge delivery API
- Event ingestion endpoint
- Response latency < 500ms (P95)
- Clear error codes for failures

---

## 6. Port Allocation

**Production** (via API calls, not local ports):
- KARVIA → iBrain: HTTPS to iBrain API gateway
- iBrain → KARVIA: HTTPS to KARVIA webhook

**Development** (local testing):
| Service | KARVIA Port | iBrain Port |
|---------|-------------|-------------|
| Main API | 5000 | 5001 |
| IAM | 8081 | 8083 |
| Assessment | 8082 | 8084 |
| Planner | 8083 | 8085 |

Note: Port overlap is only in dev. Production uses API calls.

---

## 7. Next Steps

1. **Beta Launch** (Apr 10, 2026): No iBrain integration
2. **Post-Beta**: Implement telemetry emission
3. **Q2 2026**: Connect iBrain ingestion
4. **Q3 2026**: Enable nudge display
5. **Q4 2026**: Full predictive features

---

*This document serves as the "window" between KARVIA and iBrain teams.*
