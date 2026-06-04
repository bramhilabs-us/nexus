# Shared Glossary: KARVIA + iBrain

<!-- @GENOME T2-INT-006 | ACTIVE | 2026-03-30 | parent:T2-INT-001 | auto:/strategy,/coding | linked:- -->

> Unified terminology to ensure consistent communication between KARVIA and iBrain teams.

**Status**: ACTIVE
**Version**: 1.0

---

## Core Concepts

### KARVIA Terms

| Term | Definition | iBrain Equivalent |
|------|------------|-------------------|
| **Objective** | Annual business goal (max 4 per company) | `objective` |
| **Key Result** | Quarterly measurable outcome (3-5 per objective) | `key_result` |
| **Goal** | Quarterly or weekly execution target | `goal` |
| **Task** | Daily action item | `task` |
| **Company** | Multi-tenant organization (root entity) | `organization` |
| **User** | Person with KARVIA account | `user` |
| **Team** | Department or division within company | `team` |
| **SSI Score** | Speed/Strength/Intelligence assessment | `maturity_score` |

### iBrain Terms

| Term | Definition | KARVIA Equivalent |
|------|------------|-------------------|
| **Nudge** | ML-generated behavioral prompt | (displayed in YSELA) |
| **Momentum** | User engagement/activity score | (derived from tasks) |
| **Risk Score** | Probability of missing objective | `health_status` |
| **Pattern** | Detected behavioral trend | (no equivalent) |
| **Intervention** | Proactive nudge to change behavior | (no equivalent) |
| **Streak** | Consecutive days of activity | `streak_count` |

### YSELA Terms (Presentation Layer)

| Term | Definition | KARVIA Data |
|------|------------|-------------|
| **Match** | Weekly execution sprint | Weekly goals |
| **Half** | Daily focus period | Daily tasks |
| **Next Move** | Single action item | Task |
| **Score** | Progress metric | Progress % |
| **Coach** | YSELA AI persona | (prompt-driven) |
| **BBB** | Behavior-Based Business framework | (philosophy) |
| **GRIT** | Growth-Reinforce-Invest-Trigger cycle | (philosophy) |

---

## Status Values

### Task/Goal Status

| KARVIA Value | iBrain Value | YSELA Display |
|--------------|--------------|---------------|
| `pending` | `not_started` | "Ready to Play" |
| `in_progress` | `active` | "In Play" |
| `completed` | `done` | "Goal!" |
| `cancelled` | `removed` | (hidden) |
| `overdue` | `past_due` | "Injury Time" |

### Health Status

| KARVIA Value | Threshold | iBrain Risk | YSELA Display |
|--------------|-----------|-------------|---------------|
| `on_track` | > 70% | Low (< 30) | "Winning" |
| `at_risk` | 40-70% | Medium (30-70) | "Close Match" |
| `behind` | < 40% | High (> 70) | "Trailing" |

---

## ID Formats

| Entity | KARVIA Format | iBrain Format |
|--------|---------------|---------------|
| User | `usr_` + 24 chars | `user_` + UUID |
| Company | `cmp_` + 24 chars | `org_` + UUID |
| Task | `tsk_` + 24 chars | (uses KARVIA ID) |
| Goal | `gol_` + 24 chars | (uses KARVIA ID) |
| Nudge | (from iBrain) | `nud_` + UUID |
| Event | (from iBrain) | `evt_` + UUID |

---

## Time Concepts

| KARVIA Term | Definition | iBrain Usage |
|-------------|------------|--------------|
| `period_type` | calendar_year, fiscal_year, custom | (passed through) |
| `fiscal_start` | April, July, or October | (passed through) |
| `quarter` | Q1, Q2, Q3, Q4 | `quarter_index` (1-4) |
| `week_number` | ISO week of year | `week_index` |

---

## Role Mapping

| KARVIA Role | iBrain Persona | Permissions |
|-------------|----------------|-------------|
| `CONSULTANT` | `admin` | Full access, multi-company |
| `BUSINESS_OWNER` | `owner` | Company admin |
| `EXECUTIVE` | `leader` | Department oversight |
| `MANAGER` | `manager` | Team management |
| `EMPLOYEE` | `member` | Own tasks only |

---

## Abbreviations

| Abbrev | Full Form | Context |
|--------|-----------|---------|
| OKR | Objectives and Key Results | KARVIA core |
| SSI | Speed, Strength, Intelligence | Assessment framework |
| BBB | Behavior-Based Business | YSELA philosophy |
| GRIT | Growth-Reinforce-Invest-Trigger | YSELA engagement |
| PBL | Points-Badges-Leaderboards | YSELA gamification |
| KR | Key Result | OKR component |
| TRM | Targeted Recognition Management | Coaching method |

---

## Anti-Patterns (Terms to Avoid)

| Avoid | Use Instead | Reason |
|-------|-------------|--------|
| "Score" (ambiguous) | "SSI Score" or "Progress %" | Clarity |
| "Goal" (generic) | "Quarterly Goal" or "Weekly Goal" | Specificity |
| "User" (when iBrain) | "Member" or specific role | Context |
| "Alert" | "Nudge" or "Notification" | iBrain terminology |

---

*Glossary owner: Shared. Update requires both team sign-off.*
