# Sprint 22 — Pre-Work (Epic 0)

<!-- @GENOME T3-SPR-022-PW0 | ACTIVE | 2026-04-29 | parent:T3-SPR-022-MP | auto:/strategy,/coding | linked:- -->

**Epic**: 0 — Pre-Work / Reuse-First Discovery + Gap Closure
**Points**: 13 (Track 1: 8 Discovery + Track 2: 5 Gap Closure)
**Status**: IN PROGRESS — Session #175
**Sprint blocker**: All other Sprint 22 epics depend on Epic 0 sign-off

---

## Why this folder exists

Sprint 22 epic specs were built across multiple sessions (#168–#174). When stress-tested against the live codebase during Session #175 evaluation of Epic C, several **gaps, contradictions, and undeclared dependencies** surfaced. Rather than patch each epic in isolation, Epic 0 produces one coordinated pre-work pass that:

1. **Inventories** what exists in the live codebase per epic (no "build like nothing exists")
2. **Reconciles** every spec field, endpoint, and service call against actual code
3. **Resolves** every ambiguity, undefined rule, and cross-epic conflict
4. **Patches** all 8 epics + master plan in a single coordinated pass

Output: every epic enters `/coding` with zero unknowns.

---

## Index

### Per-Epic Inventories

| Epic | File | Status |
|------|------|--------|
| A — Data Models & Disciplines | [INVENTORY_EPIC_A.md](./INVENTORY_EPIC_A.md) | ✅ |
| B — AIContextService Extension | [INVENTORY_EPIC_B.md](./INVENTORY_EPIC_B.md) | ✅ |
| C — My Clients page | [INVENTORY_EPIC_C.md](./INVENTORY_EPIC_C.md) | ✅ |
| D — Assessment Hub additions | [INVENTORY_EPIC_D.md](./INVENTORY_EPIC_D.md) | ✅ |
| E — Objective Wizard | [INVENTORY_EPIC_E.md](./INVENTORY_EPIC_E.md) | ✅ |
| F — aiOKRService Extension | [INVENTORY_EPIC_F.md](./INVENTORY_EPIC_F.md) | ✅ |
| G — Dashboard V3 + theme | [INVENTORY_EPIC_G.md](./INVENTORY_EPIC_G.md) | ✅ |
| H — Planning Page | [INVENTORY_EPIC_H.md](./INVENTORY_EPIC_H.md) | ✅ |

### Cross-Cutting Reference Docs

| File | Purpose |
|------|---------|
| [MODEL_DELTAS.md](./MODEL_DELTAS.md) | Every model field change Sprint 22 needs, in one place |
| [API_DELTAS.md](./API_DELTAS.md) | Every endpoint touched (extend vs new) with payloads reconciled to code |
| [SERVICE_EXTENSIONS.md](./SERVICE_EXTENSIONS.md) | Method-level audit of `aiOKRService`, `AIContextService`, etc. |
| [TENANCY_RBAC_MATRIX.md](./TENANCY_RBAC_MATRIX.md) | Per-route auth + tenant-scope rules |
| [DECISIONS_LOG.md](./DECISIONS_LOG.md) | Every cross-epic decision and rule-gap closure |
| [DEPENDENCY_DAG.md](./DEPENDENCY_DAG.md) | Phase-level dependency graph (not just epic-level) |
| [TEST_PLAN_STUBS.md](./TEST_PLAN_STUBS.md) | Per-epic BST + Playwright test outlines |

---

## Reordered Sprint 22 (post-Epic-0)

| Order | Epic | Points | Why this slot |
|-------|------|--------|---------------|
| **0** | **Pre-Work / Discovery + Gap Closure** | **13** | Spec hardening; blocks all others |
| 1 | A — Data Models & Disciplines | 5 | Foundation; KeyResult/WeeklyGoal/Move + Company field additions block C/E/F/G/H |
| 2 | B — AIContextService Extension | 10 | Foundation for F |
| 3 | F — aiOKRService Extension (incl. `enrichCompany()`) | 10 | Unblocks C-wizard and E |
| 4 | C — My Clients page (Phase 1+4 parallel to F; Phase 2+3 after F) | 21 | Consultant entry point |
| 5 | E — Objective Wizard | 10 | Needs A (KeyResult) + F (generateKRs) |
| 6 | H — Planning Page | 5 | Needs A (WeeklyGoal) |
| 7 | D — Assessment Hub additions | 8 | Additive; safest to land late |
| 8 | G — Dashboard V3 + theme alias | 5 | Final consolidation |
| | **Total** | **87** | (was 74; +13 for Epic 0) |

### Key reorder vs prior handoff
- **Epic 0 inserted first** (13 pts of spec/discovery work)
- **F moved up** (was P1, after C) — F is hard dependency for both C-wizard and E
- **C split-by-phase** — Phase 1+4 can start parallel to F; Phase 2 waits on A; Phase 3 waits on F
- **H pulled before D** — H consumes A's WeeklyGoal model; D is additive UI on existing Assessment infra

---

## Epic 0 Exit Criteria (gates Sprint 22 start)

Hard gates — **all** must be checked before Epic A can begin:

- [ ] All 8 `INVENTORY_EPIC_*.md` files complete with reuse-matrix table
- [ ] `MODEL_DELTAS.md` covers every field change in Sprint 22
- [ ] `API_DELTAS.md` covers every endpoint with payloads reconciled to actual code shape
- [ ] `SERVICE_EXTENSIONS.md` lists every new method with full signature + owner epic
- [ ] `TENANCY_RBAC_MATRIX.md` covers every new/extended route
- [ ] `DECISIONS_LOG.md` has zero `OPEN` rows — every gap has a resolved decision
- [ ] `DEPENDENCY_DAG.md` shows phase-level graph; user signed off
- [ ] `TEST_PLAN_STUBS.md` exists for all 8 epics
- [ ] All 8 epic specs patched: zero contradictions, zero undefined fields, zero phantom service calls, AC covers canonical flow
- [ ] `SPRINT22_MASTER_PLAN.md` updated with new dependency order and 87 pts total
- [ ] `SPRINT22_HANDOFF_DOCUMENT.md` updated with Epic 0 status

---

## Track 2 Gap Categories (covered in DECISIONS_LOG.md)

| ID | Category |
|----|----------|
| 0.13 | Internal contradictions in epic specs |
| 0.14 | Model fields referenced in specs but missing in code |
| 0.15 | Undeclared cross-epic dependencies |
| 0.16 | Missing service methods |
| 0.17 | Existing endpoint shape mismatches spec |
| 0.18 | Multi-tenancy holes on new resources |
| 0.19 | Undefined business rules |
| 0.20 | CSS/asset ownership conflicts |
| 0.21 | Missing test plans |
| 0.22 | Scope-creep features without specs |
| 0.23 | Stale phase descriptions |
| 0.24 | Acceptance criteria coverage gaps |

---

**Created**: April 29, 2026 (Session #175)
**Owner**: Strategy + Tech Architect
**Next**: Read `DECISIONS_LOG.md` for proposed resolutions awaiting sign-off
