# Strategy Session Brief — ecosystem repositioning, scoring model, company journey, brand
**Written**: 2026-06-10, end of the founder review session (session-19). **Consumed by**: the next strategy session (the card points here).
**Status**: synthesis complete, decisions PENDING founder ratification. Nothing below is canon until the session ratifies it into DECISIONS.md + the docs.

---

## 1. The new ecosystem truth (founder-stated this session)

- **BRAMHI = the parent company**, multiple products. Source of truth: `/Users/sagarrs/Desktop/Official Dev/ExternalCom/projects/bramhi/` (7 whitepapers + BRAND_GUIDELINES.md + design-system CSS).
- **Nexus = the consulting wing's delivery system** — the front-end: six pages, NOF workflow, evidence capture, tenancy, engagement lifecycle. A product OF BRAMHI, not the whole.
- **iBrain = ALL intelligence/engine capability** — "Intelligence as a Service (IQaaS)". REAL sources (deep docs): `/Users/sagarrs/Desktop/official_dev/iBrain/{IBRAIN_IMPLEMENTATION, IBRAIN_STRATEGY, External_App_Integration}` (the ExternalCom/projects/ibrain site is marketing-shell only — its api-docs are empty and its engine names differ; the implementation docs below are authoritative). Seven engines per `External_App_Integration/01_WHAT_IS_IBRAIN.md` + `05_SERVICES_OVERVIEW.md`:
  | iBrain engine | Capability | Nexus consumer |
  |---|---|---|
  | Universal Adapter | event ingestion, any format, sub-100ms, batch + retry | every domain event Nexus emits (task.completed, objective.closed, client.added…) |
  | Tracking | event storage, dedup/idempotency, timelines, engagement metrics | the L3 signal collection + telemetry instruments |
  | Observer | pattern recognition, **rule engine → webhooks** | nudge triggers (overdue/at-risk), churn-shaped signals, governance handlers |
  | Scoring | real-time multi-dimensional behavioral scoring | AIR/BOQ score calculators over the signal store |
  | Planner | AI plan generation (goals/timeline/milestones) | AI drafting: objectives/KRs/milestone plans (ai-okr, objective-wizard, generate-weekly-plan successors) |
  | Assessment | skills/capability evaluation, gap analysis | Workforce dimension, gap→Opportunity-Register candidates |
  | IAM | multi-tenant access control | app registration/auth for the Nexus↔iBrain channel |
  Integration shape: **event-driven** (send events via Universal Adapter) + request/response APIs (plans, scores) + **webhooks via Observer rules** + IAM app registration. The ExternalCom site adds the **Hybrid Intelligence Pattern** (iBrain recommendation + local business logic + fallback) and names Matching/Notification engines — likely roadmap; treat Matching (fit thesis) as a requested capability to confirm with the founder.
  **The lineage insight**: iBrain's engines ARE Karvia's engines (tracking, observer, scoring, planner, assessment, iam — the exact list from MODULE_DEPENDENCY_GRAPH), extracted into a platform. Karvia's "8 dead engines" didn't die — they moved out. This rewrites the Night-2 refactor story: Nexus never rebuilds them; the shadow-schema problem dissolves because the engines' data moves behind iBrain's API. There is already a Karvia↔iBrain integration folder: `External_App_Integration/KARVIA/IBRAIN_INTEGRATION` + the Nexus repo's own `_source/iBRAIN_Integration` snapshot — read both before drawing the contract.
- **BRAMHI infra layer** (philosophy + architecture whitepapers): "Values-Aligned Synthesis" — the core primitive **OKRs + Values + Context + Signals → Next Best Move**; RAG/shared-understanding engine; iBrain orchestrates signals/governance above it; products (Srishti layer: YSELA, KARVIA→Nexus) consume.
- **Mapping to Karvia's corpse**: the 5 dead engines (scoring, observer, tracking, insights, planner) ≈ iBrain's engines. Nexus keeps domain workflow + models; intelligence delegates to iBrain. Note: API_SURFACE marked `objectives/ibrain/*` routes "✄ not carried" — **revisit**: they're the seam's ancestor.

**Architecture decision to ratify (proposed C-010)**: Nexus consumes iBrain via published contracts using the Hybrid Intelligence Pattern. Recommended v1 scope: **local-first implementations behind iBrain-shaped contracts** (each scoring/matching/nudge capability implemented locally as the fallback leg first; swapping to live iBrain = config, not refactor). Founder to confirm v1 vs Night-4 timing. C-003 (consolidate) survives — it governs the Nexus app; iBrain is a *separate BRAMHI platform service*, not a Nexus engine.

## 2. The scoring model — reconciliation pending (proposed C-011)

The whitepaper (`NEXUS_STRATEGY/research/boq/bramhi-boq-strategy-whitepaper.html`) vs BOQ_FRAMEWORK.md conflict, and the proposed merge:

- **Six driver dimensions** (whitepaper wins): **ARS** (AI readiness) · **BPI** (productivity) · **CFS** (coordination friction) · **RAQ or BRQ** (rhythm — NAME PENDING) · **FLS** (founder leverage) · **KRP → rename pending** ("Karvia Replacement Probability" is self-referential now; candidate: Consolidation Readiness Score). BOQ_FRAMEWORK's Knowledge Intelligence + CRT move down to L3 operating metrics (Knowledge is a BPI pillar; CRT informs the consolidation score).
- **Two 4-layer stacks, both kept as views of one model**: disclosure stack (BOQ → drivers → operating metrics → evidence; progressive disclosure) + measurement stack (signals → drivers → capabilities → market). Two visuals, distinct jobs: **BRAMHI Organizational Map** (2-axis executive deliverable: rhythm × efficiency; quadrants Chaotic / Aligned-but-Slow / Productive-but-Fragmented / AI-Native) + **the Bridge** (the compounding-engine explainer).
- **BPI formula v1** (whitepaper): `BPI = 100 × Velocity^0.30 × Quality^0.15 × Knowledge^0.25 × CapitalEfficiency^0.30`; index vs SaaS-baseline-100; exact calibration = trade secret. Karvia measured case: BPI 279, $97/point, 97.7% cache reuse — the proof surface; **measured-vs-proxy labeling rule** is binding.
- **Proposed BOQ math**: geometric mean of the six drivers — imbalance penalty falls out of the math (matches "BOQ measures balance").
- **Interpretation bands** (whitepaper, ratify for both ARS and BOQ): 0–30 Reactive · 31–50 Operational · 51–70 Structured · 71–85 AI-Ready · 86–100 AI-Native. (Fixes the mockup's invented "74 = Ready with focus areas" → "74 = AI-Ready".)
- **ARS ≡ AIR Score** (confirm single identity).

## 3. Assessments — conduct, questions, scoring, interpretation (proposed C-012)

- **Three instrument classes, one engine**: survey instruments (flashcard decks, **audience-split**: founder/exec vs managers vs team — different questions, same model), observed instruments (sprint walk-the-floor/interviews/workshops), telemetry instruments (passive signals from Nexus usage post-handover — why BPI/CFS/RAQ only become *measured* in Builder mode).
- **An assessment = a package**: instruments × audience matrix × moment (first_time/recurring/pulse). AIR v1 = the 2-week sprint package; "BOQ Discovery" (whitepaper week-1) = a lighter second package — and a cheap second-provider proof of the lego claim.
- **Questions derive from the metric model, never invented per assessment.** Whitepaper's six survey sections → metric mapping: Objective Clarity→RAQ · Coordination Load→CFS/KRP · Knowledge Retrieval→Knowledge/CFS · AI Readiness→ARS · Founder Bottleneck→FLS · Stack Replacement→KRP/CRT. Question schema: `{audience, moment, section, answer_type, maps_to:[metric,weight]}` — bank is DATA in the impl (anti-AP-3), weights = trade-secret config. AIR's 5 dimensions = engagement diagnostic axes; the 6 sections = question taxonomy; a mapping table connects them.
- **Scoring v1 mechanics**: answer → normalized 0–100 signal → weighted aggregation per dimension (weights config) → AIR Score = weighted blend of 5 dims. **Day-10 workshop rule: calibrate, never invent** — every human adjustment annotates its justifying evidence.
- **Interpretation drives the Opportunity Register mechanically**: lowest drivers → ranked opportunity categories; every displayed score carries band + benchmark context + evidence drill-down.

## 4. The Company Journey (proposed new first-class doc + eventual product surface)

The maturity ladder × the whitepaper's consulting journey, the company-level twin of USER_JOURNEYS:

| Stage | Time | What happens | Scores unlocked | Transition trigger |
|---|---|---|---|---|
| 1 Prospect | — | Add Client auto-initiates AIR | — | client added |
| 2 Assessing | wk 1–2 | AIR sprint (=BOQ Discovery): surveys+observation+tool inventory | **ARS** + Baseline + first Map plot | scoring workshop |
| 3 Engaged | mo 1–6 | roadmap as NOF objectives; org-graph mapping + rhythm design (wk 2–6); controlled migration of one workflow | outcome records accruing | objectives substantially Handed off |
| 4 Builder | mo 3+ | handover; stack consolidation where consolidation score is high; **telemetry lights up** | BPI, CFS, RAQ, FLS become *measured* | sub-score confidence thresholds |
| 5 BOQ North Star | ongoing | quarterly/annual re-assessment, peer benchmarks, **BRAMHI Certified tiers** | **BOQ** as the company's own North-Star KPI | durable relationship |

Score unlocks per stage = game progression; ladder maps 1:1 to My Clients pipeline badges. Candidate product surface: the client company page shows "where you are, what unlocks next."

## 5. Brand & layout (proposed C-013)

- **Two-tier brand architecture**: **BRAMHI Labs** (parent: lotus, Cinzel/Playfair/Inter, purple-lavender, "nurturing consciousness") for consulting collateral/whitepapers — validated by ExternalCom BRAND_GUIDELINES.md v2.0 (which even contains the same `#C98S9A` invalid-hex typo our extraction caught). **NEXUS** (product: `design/brand/NEXUS1BRANDGUIDE.png`, 2026-06-10 — "the connective intelligence layer that brings everything together", **Sora** display + **Manrope** body + Cormorant taglines, new palette w/ teal + gold accents, own lotus-derived logo system) for ALL product surfaces.
- Work: re-extract tokens.css from the NEXUS guide (zoom regions like the N1-P2-07 session did — labels at 5–6×); DESIGN_LANGUAGE gets a two-tier section + new token table; **adopt the application-example layout** (founder likes it: left **sidebar navigation** shell) across all 10 mockups; re-verify hex/token/contract gates.

## 6. Next Best Move framing (proposed into PRODUCT_STRATEGY/TECH_STRATEGY)

- The fit thesis = an NBM application (Profile signals + Company Profile values/goals + Objective → best task to best person; executed by **iBrain Matching**).
- Planning's "what do I do today" = NBM surfaced (its strategic identity).
- Company Profile gains the **registered-values** role (the Values input of the primitive).
- TECH_STRATEGY reserves the **BRAMHI-synthesis seam** alongside srishti's (RAG/values-aligned retrieval, post-beta).

## 7. The decision list (ratify in session → DECISIONS.md)

1. Six drivers = ARS/BPI/CFS/RAQ-or-BRQ/FLS/KRP-renamed; Knowledge+CRT to L3 ☐
2. Rhythm score name: BRQ vs RAQ ☐
3. KRP rename (Consolidation Readiness Score?) ☐
4. Two stacks + two visuals as views of one model ☐
5. ARS ≡ AIR Score ☐
6. BOQ = geometric mean of drivers ☐
7. Five bands for ARS + BOQ ☐
8. Day-10 "calibrate, never invent" ☐
9. Company Journey doc + product surface ☐
10. Two-tier brand (NEXUS product / BRAMHI parent) ☐
11. NBM framing + BRAMHI-synthesis seam ☐
12. **C-010 iBrain delegation**: engines → iBrain contracts, Hybrid pattern, local-first v1 ☐
13. Where intelligence lives night-by-night: which capabilities stub locally in N2–3 vs call iBrain live ☐

## 8. Document work list (after ratification, in order)

1. `_agent/DECISIONS.md`: C-010…C-013 entries
2. **BOQ_FRAMEWORK.md** — major revision: reconciled score family, both stacks/visuals, bands, formulas (evolving-flagged)
3. **NEW `0-BUSINESS/COMPANY_JOURNEY.md`** — the 5-stage ladder (child of BOQ_FRAMEWORK + POSITIONING)
4. **NEW `2-TECHNICAL/SCORING_MODEL.md`** (or § in BOQ_FRAMEWORK) — instrument classes, question schema, normalization, weights-as-config, workshop rule
5. **TECH_STRATEGY.md** — iBrain consumption architecture (engine table → iBrain mapping), Hybrid pattern, BRAMHI-synthesis seam, C-003 clarification
6. **SYSTEM_ARCHITECTURE / API_SURFACE** — annotate: Karvia engines ≈ iBrain ancestors; flip `ibrain/*` route disposition note
7. **AI_CONSULTING_PLAYBOOK** — instruments ↔ question taxonomy mapping; deliverables gain BOQ Report/Organizational Map naming
8. **PRODUCT_STRATEGY** — NBM framing, Company Profile values role, score-band display rule
9. **POSITIONING / GTM** — ecosystem positioning (Nexus = consulting delivery system of BRAMHI; iBrain inside)
10. **USER_JOURNEYS** — cross-ref company journey; J-step contract calls gain iBrain legs where relevant
11. **Brand rework**: tokens.css v2 from NEXUS guide → DESIGN_LANGUAGE rework → sidebar shell → 10 mockups re-skin → all verification gates
12. Fold in **N1-P3-01 part 2** (CAPABILITIES.md, ROADMAP.md) reflecting all of the above — then Night-1 close-out groom + SPRINTS_NIGHT_2 draft.

## 9. Source map for the session

- This brief (read first) · BOQ whitepaper: `NEXUS_STRATEGY/research/boq/…` (sections 2/3/9 are the scoring core) · `ExternalCom/projects/bramhi/whitepapers/` (philosophy + architecture for NBM/ecosystem; market-research for GTM evidence) · `official_dev/iBrain/External_App_Integration/` 01/02/04/05/06/07 (WHAT_IS, QUICK_START, API_REFERENCE, SERVICES, EXAMPLES, WEBHOOKS — the real interface docs) + `IBRAIN_STRATEGY/IBRAIN_MVP_STRATEGY_EXTERNAL_APPS.md` + `External_App_Integration/KARVIA/` + Nexus `_source/iBRAIN_Integration/` · `design/brand/NEXUS1BRANDGUIDE.png` (renamed from NEXUS_BRAND GUIDE.png; old parent guide archived as BRAMHI_V1_BRANDGUIDE.png) + ExternalCom `BRAND_GUIDELINES.md`/`bramhi-design-system.css` (two-tier brand) · current BOQ_FRAMEWORK/PRODUCT_STRATEGY/TECH_STRATEGY (the docs being revised).
