# Inventory — Epic A: Data Models & Disciplines

<!-- @GENOME T3-SPR-022-PW-IA | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

**Spec**: [EPIC_A_BEHAVIOR_MODEL.md](../epics/EPIC_A_BEHAVIOR_MODEL.md)
**Points**: 5

---

## Reuse-First Matrix

| Capability | Status | Existing | Action |
|------------|--------|----------|--------|
| Discipline taxonomy | 🆕 new | none in repo | CREATE `server/config/disciplines.js` |
| KeyResult as separate collection | 🆕 new | embedded in `Objective.key_results[]` (server/models/Objective.js:116-171) | CREATE `server/models/KeyResult.js` + decide migration policy |
| WeeklyGoal model | 🆕 new | `server/models/Goal.js` exists with `time_period`, `key_result_id`, `parent_goal_id` | CREATE `server/models/WeeklyGoal.js` (do NOT delete Goal.js) |
| Move model | 🆕 new | `server/models/Task.js` exists | CREATE `server/models/Move.js` (do NOT delete Task.js) |
| Disciplines API | 🆕 new | none | CREATE `server/routes/disciplines.js` |
| Objective virtual for KR population | 🔧 extend | Objective.js has embedded `key_results[]` only | ADD virtual `key_results_v2` referencing KeyResult |

---

## Existing Code Touched

| File | Lines | Current behavior | Sprint 22 change |
|------|-------|------------------|------------------|
| `server/models/Objective.js` | 116-171 | Embedded `key_results[]` array | KEEP for backwards compat; ADD virtual `key_results_v2` referencing KeyResult collection |
| `server/models/Goal.js` | full | Quarterly + Weekly goals discriminated by `time_period` | KEEP unchanged; new code uses WeeklyGoal |
| `server/models/Task.js` | full | Daily tasks | KEEP unchanged; new code uses Move |
| `server/index.js` | route mount | n/a | ADD `app.use('/api/disciplines', disciplinesRoute)` |

---

## Net-New Files

```
server/config/disciplines.js          NEW
server/models/KeyResult.js            NEW
server/models/WeeklyGoal.js           NEW
server/models/Move.js                 NEW
server/routes/disciplines.js          NEW
```

---

## Conflicts / Decisions Required

| ID | Conflict | Refer to |
|----|----------|----------|
| A-1 | Should embedded `Objective.key_results[]` be deprecated, dual-written, or read-only? Epic A says "remove embedded KRs" but Epic E spec STILL embeds them | DECISIONS_LOG.md → D-A-1 |
| A-2 | Existing `Goal.js` (Quarterly+Weekly) coexists with new `WeeklyGoal.js` — define which queries hit which model | DECISIONS_LOG.md → D-A-2 |
| A-3 | Existing `Task.js` coexists with new `Move.js` — same coexistence question | DECISIONS_LOG.md → D-A-3 |
| A-4 | KeyResult.year required at top level — but Objective owns `target_year`. Source of truth? | DECISIONS_LOG.md → D-A-4 |
| A-5 | Disciplines categories: Epic A spec lists no `category` field, Epic B's `disciplines.js` block adds `category` (foundation/execution/strategy/wellbeing/collaboration/leadership) — pick one shape | DECISIONS_LOG.md → D-A-5 |

---

## Acceptance-Criteria Coverage Audit

Current AC (8 items) covers: config + 3 models + endpoint + virtual + indexes + tests. **Gap**: no AC for the coexistence policy (A-1, A-2, A-3) nor for the Objective.virtual JSON-serialization behavior. Add 2 AC items post-decision.

---

## Test-Plan Stub

- Unit: model validation (required fields, enum bounds, virtuals compute correctly)
- Unit: discipline config getters (`getDisciplineIds`, `getDisciplineById`)
- Integration: `GET /api/disciplines` returns 9 disciplines, requires auth
- Multi-tenancy: KeyResult write requires `company_id`; query by other company returns empty
- Migration safety: existing Objective with embedded `key_results` still loads after virtual added
