# Sprint 31 — Handoff Document

<!-- @GENOME T3-SPR-031-HANDOFF | DRAFT | 2026-06-02 | parent:T3-SPR-031-MP | auto:/init,/close | linked:/sprint-review -->
<!-- 2026-06-02 — Folder + handoff initialized at S28 lean pivot to carry deferred factory work. Triggered by user direction to lean S28 to brand-chrome only ("reuse karvia-business-2"). All deferred scope traces back to SPRINT28_MASTER_PLAN.md §Deferred to Sprint 31 + SPRINT28_IMPACT_ANALYSIS.md. -->

**Status**: 🟡 PRE-LAUNCH — sprint not yet started; awaiting (a) S28 lean close + (b) S29 + S30 close + (c) trigger evidence (product #2, buyer demand, compliance, or user count threshold).

---

## Launch Gate

Sprint 31 is **plan-only** until ALL of the following are true:

1. **Sprint 28 (lean) closed** — Ysela live at www.ysela.ai; brand-rendering smoke green; karvia-business-2 repurposed
2. **Sprint 29 closed** (scope TBD — no folder yet as of 2026-06-02)
3. **Sprint 30 closed** (`SPRINT-30-Circular-Economy` folder exists 2026-06-02; status TBD at S31 kickoff)
4. **Trigger evidence** — at least ONE of:
   - Product #2 starting development → factory pattern needed concretely
   - Buyer demand for code handover → clean repo required
   - Compliance requirement for data isolation → separate Mongo justified
   - Ysela soft-launch user count crosses ~10–20 → separate prod infra justified

---

## Workstreams (slices grouped by surface)

| Workstream | Slices | Status |
|---|---|---|
| **M — Canonical Mirror** (cross-repo) | M.1 + L.4 + L.4a + L.4b + L.4c + L.4d + L.4e | ⏳ Pending — see [SPRINT31_MASTER_PLAN.md](SPRINT31_MASTER_PLAN.md) |
| **T — Test Coverage Uplift** | L.4f + L.4g + L.4h + L.4i | ⏳ Pending — driven by [SPRINT28_IMPACT_ANALYSIS.md](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_IMPACT_ANALYSIS.md) |
| **F — Factory Seams** | L.5 (+ co-located tests) | ⏳ Pending |

---

## Acceptance Test

Sprint 31 closes when:

1. `bramhilabs-us/YSELA` mirror exists, populated, CI green
2. Mirror Render service + Mongo deploy from `bramhilabs-us/YSELA` end-to-end
3. Brand-rendering + sync-integrity + URL-invariant + multi-env smoke all gate in CI
4. Coverage threshold lifted 50% → 60% on mirror; workshop matches
5. `BRANDING.md` 5-step playbook documented; product #2 launch becomes mechanical
6. Drift detector cron live
7. karvia-business-2 lean repurpose disposition logged

---

## Prerequisites (user provides at S31 kickoff)

- [ ] Mailjet sender name "Ysela" verified (already done in S28? confirm)
- [ ] Render dashboard access for new YSELA-mirror-specific services
- [ ] MongoDB Atlas budget approval (~$60–120/mo run-rate add)
- [ ] GitHub Actions minutes budget (may need paid tier if cadence high)
- [ ] Decision on data migration from shared pre-prod Mongo to new YSELA Mongo (Open Q12)
- [ ] Decision on karvia-business-2 disposition (Open Q11)
- [ ] Decision on visual regression scope (Open Q7)

---

## Architectural Invariants

See [SPRINT31_MASTER_PLAN.md §Architectural Invariants](SPRINT31_MASTER_PLAN.md#architectural-invariants-carried-from-s28).

---

## Open Questions (resolve at S31 kickoff)

See [SPRINT31_MASTER_PLAN.md §Open Questions](SPRINT31_MASTER_PLAN.md#open-questions-resolve-at-s31-kickoff). 12 questions consolidated from S28 handoff + S28 impact analysis + S31 plan.

---

## Carry-Forward from Sprint 28 (lean) — to populate at S31 kickoff

To be populated when Sprint 28 (lean) closes:

- karvia-business-2 lean repurpose final state (any quirks from running on `ysela` branch + shared pre-prod Mongo?)
- Brand-rendering smoke test (L.3c) shipped — does it pass? What did it catch on first run?
- DNS bind state (does www.ysela.ai redirect karvia-business-2.onrender.com? L.3b decision applied?)
- Soft-launch user count + signal — how many real users? Is data isolation already pressuring the shared-Mongo model?
- Sprint 29 + 30 deltas — new code added between S28 and S31 that needs allowlist + brand-rendering test coverage

---

## Audit History

No audit IDs assigned yet — Sprint 31 is greenfield. Audit IDs will be minted at sprint kickoff.

| ID | Source | One-liner | 📝 | 💻 | ✅ |
|---|---|---|---|---|---|
| _(none yet — populate at sprint kickoff)_ | | | | | |

---

## Deferrals (owned by this sprint, may or may not ship)

| Item | Why might defer further | When to revisit |
|---|---|---|
| Visual regression (Playwright pixel-diff) | Baseline-image management overhead; defer if not ready | S32+ |
| Cross-repo public open-source release | Decision depends on licensing + competitive concerns | Post-launch evaluation |
| Email body content sweep + `MAILJET_FROM_EMAIL` domain change | Needs SPF/DKIM on ysela.ai mail (24–48h propagation + Mailjet config) | S31 sprint kickoff decision |
| Multi-product engine extraction (server/ → npm package) | Wait for product #3 per `feedback_minimal_change_grounding` | S33+ |

See [REFINEMENT-BACKLOG/](../REFINEMENT-BACKLOG/) for cross-sprint deferrals.

---

## Sign-off

Sprint 31 handoff initialized 2026-06-02 at S28 lean pivot. Planning carries forward from S28 Master Plan + S28 Impact Analysis intact. Sprint launches when Launch Gate clears (S28 close + S29 + S30 close + trigger evidence).

**Next session recommendation** (at S28 close): No immediate S31 work. S31 sits dormant until trigger evidence materializes. The plan and impact analysis remain the source of truth — no re-planning needed.

**When S31 kickoff fires**:
- `/strategy` session FIRST — re-validate scope against any S29/S30 additions, lock the 12 open questions, mint the audit IDs
- Then 5-session `/coding` execution per [SPRINT28_IMPACT_ANALYSIS.md §6](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_IMPACT_ANALYSIS.md) (sync mechanism → mirror bootstrap → brand chrome [revisit if S28 lean shipped already] → email+domain → multi-env smoke + acceptance)
