# Sprint 21 Recovery Plan

<!-- @GENOME T3-SPR-021-R | ACTIVE | 2026-04-03 | parent:T3-SPR-021 | auto:/coding,/strategy | linked:/testing -->

**Created**: April 3, 2026
**Reason**: Timeline extension from April 10 → April 17
**Decision**: Risk assessment showed 0% sprint progress, Gate 1 overdue
**New Target**: Beta Launch April 17, 2026

---

## Decision Summary

| Metric | Original | Revised |
|--------|----------|---------|
| Sprint Duration | 12 days | 19 days (+7) |
| End Date | April 10 | April 17 |
| Total Points | 42 | 42 (unchanged) |
| Success Probability | 40% | 85% |

### Why Extension Was Chosen

1. **Zero progress**: 0/42 points complete as of Day 5
2. **Gate 1 overdue**: Narrative alignment 2 days late
3. **No buffer**: Original plan had no time for dry run fixes
4. **Quality focus**: Beta launch requires proper validation

---

## Revised Timeline

### Phase 1: Foundation (Apr 3-7) - 5 days

**Focus**: Gate 1 + Gate 2 (Narrative + Prompts)

| Day | Date | Epics | Points | Deliverables |
|-----|------|-------|--------|--------------|
| 5 | Apr 3 | A1 | 1 | Strategy session, roadmap approval |
| 6 | Apr 4 | A2, A3 | 4 | Position audit, consultant narrative |
| 7 | Apr 5 | B1, B2 | 6 | Prompt consolidation, guidance standard |
| 8 | Apr 6 | B3, B4 | 5 | Next moves semantics, vertical context |
| 9 | Apr 7 | B5 | 2 | Consultant context, **GATE 1 ✓, GATE 2 ✓** |

**Phase 1 Total**: 18 points

---

### Phase 2: Reframing (Apr 8-12) - 5 days

**Focus**: Gate 3 + Gate 4 Start (Frontend + Operations)

| Day | Date | Epics | Points | Deliverables |
|-----|------|-------|--------|--------------|
| 10 | Apr 8 | C1 | 3 | Planning page copy changes |
| 11 | Apr 9 | C2, C3 | 5 | Generate action rename, objective display |
| 12 | Apr 10 | D1, D2 | 4 | Weekly cadence, evidence template |
| 13 | Apr 11 | D3, D4 | 4 | Intervention logging, pilot checklist |
| 14 | Apr 12 | E1 | 3 | Blocked/deferred visibility, **GATE 3 ✓** |

**Phase 2 Total**: 19 points

---

### Phase 3: Operations + Validation (Apr 13-17) - 5 days

**Focus**: Gate 4 Close + Dry Run + Buffer

| Day | Date | Epics | Points | Deliverables |
|-----|------|-------|--------|--------------|
| 15 | Apr 13 | E2 | 2 | Evidence capture mechanism, **GATE 4 ✓** |
| 16 | Apr 14 | F1 | 2 | End-to-end dry run |
| 17 | Apr 15 | F2 | 1 | Gate verification |
| 18 | Apr 16 | Buffer | 0 | Fix any dry run issues |
| 19 | Apr 17 | Launch | 0 | **BETA LAUNCH** |

**Phase 3 Total**: 5 points

---

## Revised Gate Schedule

| Gate | Original | Revised | Delta |
|------|----------|---------|-------|
| Gate 1: Narrative Alignment | Apr 1 | Apr 7 | +6 days |
| Gate 2: Prompt Coverage | Apr 5 | Apr 7 | +2 days |
| Gate 3: Frontend Reframing | Apr 7 | Apr 12 | +5 days |
| Gate 4: Beta Operations | Apr 8 | Apr 13 | +5 days |
| **Beta Launch** | Apr 10 | Apr 17 | +7 days |

---

## Epic Breakdown (Unchanged Scope)

| Epic | Points | Owner | Phase |
|------|--------|-------|-------|
| A: Docs & Narrative | 5 | CPO | 1 |
| B: Prompt System | 13 | CTO | 1 |
| C: Frontend Reframing | 8 | CTO | 2 |
| D: Consultant Operations | 8 | CPO | 2 |
| E: Evidence Capture | 5 | CTO | 2-3 |
| F: Internal Dry Run | 3 | Both | 3 |
| **Total** | **42** | | |

---

## Critical Path

```
                           CRITICAL PATH TO BETA
═══════════════════════════════════════════════════════════════════════
   Apr 3    Apr 7    Apr 12   Apr 13   Apr 14-16   Apr 17
     │        │         │        │         │         │
     ▼        ▼         ▼        ▼         ▼         ▼
   START   GATE 1    GATE 3   GATE 4    DRY RUN   LAUNCH
     │     GATE 2       │        │         │         │
     │        │         │        │         │         │
     └── Phase 1 ──┴── Phase 2 ─┴─ Phase 3 ─────────┘
         (18 pts)      (19 pts)     (5 pts)
═══════════════════════════════════════════════════════════════════════
```

**Dependencies**:
1. Gate 1 must close before Gate 2 (narrative informs prompts)
2. Gate 2 must close before Gate 3 (prompts inform frontend copy)
3. Gate 3 + Gate 4 must close before dry run
4. Dry run must complete with buffer before launch

---

## Risk Mitigations Applied

| Risk | Original Plan | Recovery Plan |
|------|---------------|---------------|
| No buffer for fixes | 0 days | 1 day (Apr 16) |
| Rushed dry run | 2 days | 3 days (Apr 14-16) |
| Parallel gate work | Required | Sequential allowed |
| CPO visibility gap | Problem | Daily sync required |

---

## Success Metrics

### Sprint Success = All True

- [ ] Gate 1 closed by April 7
- [ ] Gate 2 closed by April 7
- [ ] Gate 3 closed by April 12
- [ ] Gate 4 closed by April 13
- [ ] Dry run completed with no critical issues
- [ ] First pilot company identified and briefed
- [ ] Beta launch April 17

### Quality Gates

- [ ] All AI responses include guidance blocks
- [ ] Planning page has zero "task" labels visible
- [ ] Consultant can explain beta in one sentence
- [ ] Evidence capture path documented

---

## Immediate Next Steps (April 3)

| # | Action | Owner | Status |
|---|--------|-------|--------|
| 1 | Approve this recovery plan | Both | Pending |
| 2 | CPO: Confirm Gate 1 deliverables | CPO | Pending |
| 3 | CTO: Start Epic B (prompts) | CTO | Ready |
| 4 | Identify first pilot company | CPO | Pending |
| 5 | Update master plan with new dates | CTO | Ready |

---

## Stakeholder Communication

### Message to Team

> Sprint 21 has been extended from April 10 to April 17 to ensure a quality beta launch. This provides:
> - Proper time for all 4 gates
> - Buffer for dry run fixes
> - Confidence in launch quality
>
> All scope remains unchanged. New gate dates are in the recovery plan.

---

**Document Status**: ACTIVE
**Next Review**: April 7 (Gate 1+2 checkpoint)
