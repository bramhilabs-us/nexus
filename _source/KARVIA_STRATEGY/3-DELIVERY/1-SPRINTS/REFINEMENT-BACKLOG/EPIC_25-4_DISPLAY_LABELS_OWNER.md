# Epic 25.4 — Display-Labels Owner Mapping Completion

<!-- @GENOME T3-SPR-025-EPIC-4 | DRAFT | 2026-05-05 | parent:T3-SPR-025-MP | auto:- | linked:- -->

**Points**: 1-2
**Priority**: P0 — blocks Epic 25.3 (owner-side redesign needs owner labels populated)
**Source**: S24 F-1d locked the unified `display-labels.js` with consultant mapping populated; owner mapping is empty placeholder

---

## Goal

Populate the owner-facing labels in `client/js/display-labels.js` for the canonical 6-stage `Objective.lifecycle_stage` enum (and any other lifecycle-related labels). After this epic, calling `DisplayLabels.lifecycleView(stage, 'business_owner')` returns useful, design-aligned labels.

## Context

S24 F-1d shipped `client/js/display-labels.js` with this signature:
```js
window.DisplayLabels.lifecycleView(stage, role)
```

The S24 implementation populated only `role === 'consultant'`:
```js
{
  identified: '🎯 Identified',
  kr_breakdown: '🎯 Identified',
  in_execution: '🤝 Handed Off',
  completion_review: '🤝 Handed Off',
  completed: '📊 Sustained',
  sustained_mode: '📊 Sustained'
}
```

For other roles, the function returns a placeholder (e.g., empty string or `'(no label)'`).

S25 fills in those mappings.

## Locked Decisions

- The system enum stays canonical (6 stages); this epic only adds **labels**, not new stages
- Each role has its own mental model — labels reflect what THAT role thinks of the stage, not a universal description
- Empty/placeholder labels are valid for stages that aren't user-meaningful for that role

## Open Questions for S25 Kickoff

The actual label strings are a product/design call. Recommended starting drafts:

### Business Owner labels
| Stage | Proposed BO label | Rationale |
|---|---|---|
| `identified` | "Just created" | Acknowledges the moment they made it |
| `kr_breakdown` | "Adding measurements" | KRs are being added |
| `in_execution` | "In flight" | Plan exists; team is executing |
| `completion_review` | "Wrapping up" | All KRs complete; ready to finalize |
| `completed` | "Done" | Post-finalization |
| `sustained_mode` | "Embedded" | Habit/discipline level achieved |

### Manager labels
| Stage | Proposed Manager label |
|---|---|
| `identified` | "Awaiting plan" |
| `kr_breakdown` | "Awaiting plan" |
| `in_execution` | "Active plan" |
| `completion_review` | "Closing out" |
| `completed` | "Closed" |
| `sustained_mode` | "Reference" |

### Employee labels
| Stage | Proposed Employee label |
|---|---|
| `identified` | "Pending" |
| `kr_breakdown` | "Pending" |
| `in_execution` | "Active" |
| `completion_review` | "Wrapping up" |
| `completed` | "Done" |
| `sustained_mode` | "Reference" |

These are starting points. Final strings agreed at S25 kickoff (potentially via `/design` session).

## Acceptance Criteria

- [ ] `DisplayLabels.lifecycleView(stage, 'business_owner')` returns the agreed string for all 6 stages
- [ ] `DisplayLabels.lifecycleView(stage, 'manager')` returns the agreed string for all 6 stages
- [ ] `DisplayLabels.lifecycleView(stage, 'employee')` returns the agreed string for all 6 stages
- [ ] `DisplayLabels.lifecycleView(stage, 'consultant')` STILL returns the S24 strings (no regression)
- [ ] If `role` is invalid or missing, function falls back to consultant mapping (least-surprise default)
- [ ] If `stage` is invalid, function returns empty string (don't crash UI)

## Tests

NEW `scripts/test-display-labels-roles.js`:
- All 4 roles × 6 stages = 24 assertion table covering correct returns
- Invalid role falls back to consultant
- Invalid stage returns empty string
- Backward compat: S24 consultant labels unchanged

## Implementation Notes

### File to modify
- `client/js/display-labels.js`

### Surgical
- This epic ONLY edits the labels object inside `display-labels.js`. No other file changes.
- ~30-40 lines of new code

### Test reuse
- Existing S24 tests on consultant labels remain green; this epic adds 18 new assertions

## Dependency

Epic 25.3 (owner redesign) **cannot** render correct stage badges until this epic completes. Sequence: 25.4 first, then 25.3 in same session OR same week.

---

**Spec status**: Draft. Final label strings TBD at S25 kickoff via `/design`.
