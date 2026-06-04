# Sprint 17 Dependency + Impact Matrix

**Date**: March 8, 2026  
**Purpose**: Validate logical sequence, prerequisites, and risk propagation for Sprint 17

---

## 1) Dependency Matrix

| ID | Dependency | Type | Current State | Risk if Ignored | Gate Recommendation |
|---|---|---|---|---|---|
| D1 | Sprint 16 completion | Program | Pending (Sprint 16 planned) | Sprint 17 builds on unresolved tech debt/testing/security work | Hard gate: do not start Sprint 17 before Sprint 16 exit criteria |
| D2 | Sprint 15 closure | Program | In progress | Upstream instability in onboarding/data quality affects context maturity quality | Close remaining Sprint 15 work before maturity rollout |
| D3 | Company profile data quality | Product/Data | Partial and uneven | Stage scoring and personalization are biased by sparse/invalid profile data | Fix profile capture + schema alignment first |
| D4 | Canonical prompt layer | Architecture | Missing (prompts fragmented) | Inconsistent AI behavior, hard-to-debug regressions | Introduce single prompt orchestration layer |
| D5 | Outcome capture workflow | Product/UX | Missing | `OKROutcome` model with no data capture path; learning loop fails | Deliver model + route + UI together |
| D6 | Benchmark source-of-truth | Data/Architecture | Multiple competing implementations | Conflicting recommendations across features | Consolidate to one benchmark provider contract |
| D7 | AI interaction observability | Ops/Quality | Partial; not centrally invoked | No reliable quality feedback loop | Require standardized interaction logging wrapper |
| D8 | Runtime model integrity (`KeyResult`) | Technical | Broken dependency | Context build failures and silent fallbacks | Resolve model dependency before maturity-context reliance |

---

## 2) Critical Path (Corrected)

1. **Foundation Gate**
   - Sprint 15 residuals closed
   - Sprint 16 must pass quality/security/test gates

2. **Data Integrity Gate**
   - Company profile writes aligned with schema
   - Baseline metrics and strategic vision fields validated

3. **AI Architecture Gate**
   - Single prompt orchestration introduced
   - Unified model/config policy enforced

4. **Maturity Engine Gate**
   - Implement `ContextMaturityService` with schema-correct scoring
   - Add unit/integration tests for stage assignment

5. **Learning Loop Gate**
   - Implement `OKROutcome` + capture endpoints + collection UI
   - Ensure outcome data is consumed by prompt layer

6. **Experience Gate**
   - Every AI endpoint returns structured guidance payload
   - Cross-endpoint prompt QA for tone, specificity, and “next step” quality

---

## 3) Impact Propagation

## If D1/D2 fail (program prerequisites)
- Delivery forecasts become unreliable.
- Sprint 17 carries unresolved risk from prior sprints.

## If D3 fails (data quality)
- Maturity stage labels become misleading.
- Personalization confidence is overstated.

## If D4 fails (prompt fragmentation)
- User sees different AI “personalities” and logic by page.
- Hard to guarantee consistent quality and compliance guardrails.

## If D5 fails (outcome capture)
- Stage 3/4 claims cannot be operationalized.
- Learning narrative remains theoretical.

## If D6 fails (benchmark duplication)
- SSI narrative, analytics, and OKR generation may disagree.
- Trust erosion due to inconsistent “truth” sources.

## If D7 fails (observability)
- No clear way to detect prompt regressions or user frustration patterns.

## If D8 fails (runtime dependency)
- Context features can error/fallback silently, reducing reliability.

---

## 4) Readiness Score (Audit)

| Dimension | Score | Notes |
|---|---:|---|
| Strategy clarity | 8/10 | Strong intent and outcome framing |
| Logical consistency | 4/10 | Timeline/points contradictions remain |
| Technical readiness | 5/10 | Valuable assets exist, but integration is fragmented |
| Dependency hygiene | 3/10 | Upstream gates unresolved |
| Delivery reliability | 4/10 | Risky without replan |
| **Overall Sprint-17 Readiness** | **4.8/10** | Replan required before execution |

---

## 5) Minimum Gate Checklist Before Execution

- [ ] Sprint 16 marked complete with evidence (tests/security/tech debt targets met)
- [ ] Sprint 17 scope math reconciled (duration + points + week allocation)
- [ ] Prompt architecture consolidation plan approved
- [ ] Maturity scoring field paths validated against `Company` schema
- [ ] Outcome model scope includes collection workflow, not storage only
- [ ] Benchmark architecture reduced to one source-of-truth contract
- [ ] AI interaction logging wrapper integrated in all OpenAI entry points

