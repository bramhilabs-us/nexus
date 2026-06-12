# Backlog

Loaded from `SPRINTS_NIGHT_1.md` on 2026-06-03.
Status legend: READY | IN-PROGRESS | BLOCKED | DONE

---

### N1-P1-01 — Snapshot Karvia docs into `_source/`
- **Status**: DONE (PR pending merge — tick 2026-06-03-01)
- **Size**: S (1 tick)
- **Depends on**: none
- **Definition of done**:
  - Copy KARVIA_STRATEGY, .claude (no local settings), docs (no large bin), OKR planning, iBRAIN_Integration, top-level MDs
  - All exclusions honored (.env*, node_modules, logs, snapshots, test-results, .git, YSELA, bramhi, mockups, .DS_Store)
  - Secret scan of `_source/` clean (or redacted)
- **Notes**: Mechanical. Hooks must NOT fire on karvia path (reads only).

### N1-P2-01 — System architecture map
- **Status**: DONE (PR pending merge — tick 2026-06-03-02)
- **Size**: M (2 ticks; completed in 1)
- **Depends on**: N1-P1-01 (DONE, merged)
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md` written
  - ✓ 2 Mermaid diagrams (high-level + request lifecycle)
  - ✓ 8 Nexus deltas with rationale
  - ✓ Opened C-003 / C-004 / C-005 on architecture questions

### N1-P2-02 — Data models catalogue
- **Status**: DONE (PR pending merge — session 2026-06-09-02)
- **Size**: M (2 ticks; completed in 1 session)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/DATA_MODELS.md` — all 19 Mongoose schemas (~9,300 lines) with key fields, relations, validations
  - ✓ Per-cluster ER diagrams (CRM, OKR, Assessment) in `diagrams/er-*.mmd`
  - ✓ Per-model Nexus disposition (lift / lift+program_id / redesign / fold / defer)
  - ✓ Wired into doc graph (genome, 2 parents); validator green
- **Notes**: Surfaced C-008 (Goal/Move layer) — ANSWERED same day by the founder: **NOF** (`1-PRODUCT/NOF.md`, DECISIONS C-008/C-009). N1-P4-01 fully unblocked; dispositions updated in DATA_MODELS.md.

### N1-P2-03 — API surface catalogue
- **Status**: DONE (tick 2026-06-09-11, PR pending merge)
- **Size**: M (2 ticks — done in 1)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/API_SURFACE.md` — all 28 server route files (313 routes) + 10 engines (97 routes)
  - ✓ Shape-tagging per route (CRM / OKR / ASMT + COMPOSE/AI/SIGNAL/CONF/META aux) with per-route Nexus dispositions

### N1-P2-04 — Module dependency graph
- **Status**: DONE (tick 2026-06-09-09, PR pending merge)
- **Size**: M (2 ticks — done in 1)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md` with Mermaid (+ `diagrams/module-dependency.mmd`)
  - ✓ Cycles flagged red — shadow-schema collisions (Task ×3, User ×2, Objective ×2) ranked as Night 2 refactor targets
  - ✓ Every engine + route-cluster mapped to actual grepped imports; each cross-boundary edge labeled stays-in-module / contract call / domain event / dies (NOF or SSI)

### N1-P2-06 — Engineering principles & improvement bar
- **Status**: DONE (PR pending merge — tick 2026-06-04-03)
- **Size**: M (1 tick)
- **Depends on**: N1-P2-01 (DONE, PR #2 pending merge)
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/IMPROVEMENT_PLAN.md` written
  - ✓ 10 named anti-patterns sourced from Karvia evidence
  - ✓ 10 improvements with measurable enforcement
  - ✓ Per-PR quality gate checklist
  - ✓ Parking lot (out of scope explicitly)
  - ✓ Success criteria table (Karvia baseline vs Nexus target)
  - ✓ Implications for C-003/4/5 stated
- **Notes**: This doc is the bar every Night 2-5 tick is measured against. Added mid-sprint per human request.

### N1-P2-07 — Design tokens from the Brandguide (Path B pull-forward)
- **Status**: DONE (tick 2026-06-09-10, PR pending merge)
- **Size**: S (1 session)
- **Depends on**: DESIGN_LANGUAGE.md (DONE), N1-P2-04 (sequencing only — tokens session follows the module graph)
- **Definition of done**:
  - `client/css/tokens.css` — semantic tokens (`--nx-primary`, `--nx-ink`, `--nx-surface`, type/spacing/radius scales) extracted from `1-PRODUCT/design/brand/` assets **+ the reference-deck cues in DESIGN_LANGUAGE § reference visuals** (soft gradient surfaces, purple-tinted shadows, slate text hierarchy, gold sparingly); resolve the Comfortaa vs Cinzel/Inter type question there
  - Hex/scale table recorded in DESIGN_LANGUAGE.md (filling its declared placeholder)
  - Zero inline hex anywhere; tokens are the only color source from here on
- **Notes**: Path B decision (2026-06-09): mockups pulled forward from Night 3 — they depend only on page contracts + design language, both done. Tokens-before-mockups per SESSION_PRACTICES rule 3.

### N1-P2-08 — Six page mockups (static HTML, token-first) (Path B pull-forward)
- **Status**: DONE — superseded review: C-013 absorbed the founder-review checkpoint ("the review verdict is this rework"); the re-skin is N1-P3-09. All 10 surfaces merged.
- **Size**: M (2–3 sessions)
- **Depends on**: N1-P2-07, PRODUCT_STRATEGY page contracts (DONE)
- **Definition of done**:
  - Static HTML mockups for all 6 pages in `NEXUS_STRATEGY/1-PRODUCT/design/mockups/`, consuming `var(--token)` only
  - Engagement + Builder variants for My Clients, Dashboard, Assessments
  - Each mockup implements its page contract exactly: one dominant primary CTA, ≤4 analytics tiles, empty state teaching the purpose
  - Shell includes the account dropdown with the 5 secondary surfaces (Profile, Company Profile, Configuration, Settings, Feedback) per PRODUCT_STRATEGY § player cards; one mockup of Profile (the player card) included
  - One **assessment flashcard deck** mockup (PQ-4): the "why this assessment" intro card + 2–3 question cards + progress feel — flashcards, never survey forms
  - Founder review checkpoint — feedback feeds N1-P4-01 contracts and becomes the Night 3 build spec
- **Notes**: First visible product. Throwaway-quality is NOT acceptable — these are the Night 3 spec (Karvia lesson #174-3).

### N1-P2-05 — User journeys
- **Status**: DONE (tick 2026-06-10-13, PR pending merge)
- **Size**: M (2 ticks — done in 1)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - ✓ 4 journeys (one per archetype) with numbered steps + Mermaid sequence diagrams
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/USER_JOURNEYS.md` + journey↔contract index for N1-P4-01

### N1-P0-02 — Strategy pack: North Star + product/tech/execution cards
- **Status**: DONE (PR pending merge — interactive session 2026-06-09-01)
- **Size**: M (completed in 1 interactive session)
- **Depends on**: N1-P2-01, N1-P2-06, DECISIONS C-001/3/4/5
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/00_NORTH_STAR.md` — ≤90-step thesis, three-layer model, pack-of-cards system
  - ✓ `1-PRODUCT/PRODUCT_STRATEGY.md` — page contracts for all 6 pages, lifecycle stages, first-value journey
  - ✓ `2-TECHNICAL/TECH_STRATEGY.md` — 3 layers, 8-block anatomy, AssessmentProvider contract
  - ✓ `3-DELIVERY/EXECUTION_PLAYBOOK.md` — session types, 90-step phase budgets, measurement
- **Notes**: Human-directed (founder voice brief + iPad notes), added mid-sprint. Downstream: N1-P3-01 builds on PRODUCT_STRATEGY; N1-P4-01 aligns with TECH_STRATEGY; EXECUTION_PLAYBOOK governs all future step budgets.

### N1-P3-01 — Populate 0-BUSINESS and 1-PRODUCT (Transformation OS framing)
- **Status**: IN-PROGRESS (part 1 of 2 done — tick 2026-06-10-18, PR pending: 0-BUSINESS gap filled with POSITIONING/GTM/STAKEHOLDERS/BUSINESS_MODEL. DoD re-scoped per re-sum rule: the strategy pack already covers vision+journeys, so the real gap = 4 business docs + 2 product docs (CAPABILITIES, ROADMAP — part 2). Original "4 files each" predates the pack.)
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01 (DONE — pending PR merge)
- **Definition of done**:
  - 4 files each in 0-BUSINESS/ and 1-PRODUCT/
  - Leads with "Transformation OS"; AI Readiness as launch vertical
  - Both GTM motions covered: consultant-led + direct-to-org
  - Karvia adaptations cited; TODOs flagged where untranslatable
- **Notes**: C-001 answered — broad scope (Transformation OS). See DECISIONS.md 2026-06-03.

### N1-P3-02 — Populate 3-DELIVERY skeleton
- **Status**: DONE (tick 2026-06-10-14, PR pending merge)
- **Size**: S (1 tick)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - ✓ SPRINT_PROCESS.md, RELEASE_PROCESS.md, CI_CD.md written — each with IM-11 reflection record, wired as EXECUTION_PLAYBOOK children

### N1-P3-03 — Populate 4-CUSTOMER skeleton
- **Status**: DONE (tick 2026-06-10-16, PR pending merge)
- **Size**: S (1 tick)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - ✓ INTERVIEW_TEMPLATE, FEEDBACK_LOG, EVIDENCE_INDEX, METRICS templates + tier README — all governed T4 nodes under PRODUCT_STRATEGY

### N1-P4-01 — Modularization plan + contract drafts
- **Status**: READY (C-003/4/5 all answered — see DECISIONS.md 2026-06-04)
- **Size**: M (2 ticks)
- **Depends on**: N1-P2-04 (module graph), N1-P2-02 (data models)
- **Definition of done**:
  - MODULARIZATION_PLAN.md with 8 modules (CRM, Objectives, KeyResults, Milestones (C-008), Tasks, Assessment + Governance + Knowledge) + assessment impl (AIR — SSI dropped per C-006, Karvia reference only)
  - MODULE_CONTRACTS_DRAFT.md with TS interface signatures — journey steps (USER_JOURNEYS J-index) are the acceptance criteria; route sets cite API_SURFACE; edges cite MODULE_DEPENDENCY_GRAPH
  - **Assign the outbound notification/mail owner** (audit 2026-06-12 finding 4.5): invitations, nudge delivery, review reminders — a contract-fronted capability (likely @nexus/crm or a small platform service), never per-module ad-hoc mail
  - Reflects ratified decisions: consolidate engines, TypeScript strict, Program as first-class entity, the stage machine + Layer 4 (C-020)
- **Notes**: All 3 architectural clarifications now answered (2026-06-04). N1-P4-02 also unblocked.

### N1-P4-02 — Nexus vs Karvia diff + Assessment interface spec
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P4-01
- **Definition of done**:
  - NEXUS_VS_KARVIA_DIFF.md (module-by-module)
  - ASSESSMENT_INTERFACE_SPEC.md (pluggable contract)

### N1-P5-01 — Test inventory
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - `NEXUS_STRATEGY/3-DELIVERY/QA/TEST_INVENTORY.md` with every Karvia test file catalogued

### N1-P5-02 — Coverage map + path to 80%
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P5-01, N1-P2-04
- **Definition of done**:
  - COVERAGE_MAP.md, COVERAGE_GAPS.md, PATH_TO_80_PERCENT.md

### N1-P6-01 — Journal + BACKLOG groom + Night 2 sprint draft
- **Status**: READY
- **Size**: S–M (1 session; grew per audit 2026-06-12 + C-021)
- **Depends on**: all other N1 tasks DONE or accounted for
- **Definition of done**:
  - JOURNAL summary for Night 1
  - **Phase-budget re-baseline** (audit finding 7 — N1 ran 27+ steps vs 18 budgeted; re-sum, re-cut N2–N5 against the now-richer strategy or formally extend the 90; EXECUTION_PLAYBOOK table updated and the >25% trigger answered)
  - **Absorption review** (C-021.4): for each capture paper (02/03/04), is its content fully propagated into canon? Absorb-and-delete candidates named (BOQ_FRAMEWORK precedent); execute only with founder sign-off
  - BACKLOG groomed (incl. the stale "PR pending merge" annotation sweep — audit 3.3)
  - Run `/audit` as the groom's opening move (the night-end cadence, audit §10)
  - SPRINTS_NIGHT_2.md draft proposed

### N1-P3-04 — Constitution finalization + strategy-pack realignment (discovered, session 2026-06-10-20)
- **Status**: DONE (session 2026-06-11-21) — exceeded scope
- **Size**: M (1–2 sessions) → done in 1
- **Delivered**: DECISIONS C-010…C-016 (incl. the simulation-driven D1–D8 set); all constitution amendments (Staircase signature diagram, deliverables column, Articles 6+13, ICP, scope clause, gauge-lag, restatement rule, BOQ referent, honest-limits additions, reserved seats); 02_NBM_MODEL ratified → active (+ causal-correctness, altitude limits); **NEW 03_NEXUS_GAME.md** (game whitepaper: stage-responsive page matrix, 14-friction two-pass audit all designed, SaaS value bridge, playthrough); **NEW `0-BUSINESS/scores/` library** (BOQ.md core model with the epistemic engine + 6 driver docs on the shared template); BOQ_FRAMEWORK absorbed + deleted, 12 reference sites rewired
- **Residual**: 01_NEXUS_MODEL.md and 03_NEXUS_GAME.md stay `status: draft` pending founder read-through (5 naming proposals in 01; 4 candidate constitutional rules + Steward/data-covenant in 03)

### N1-P3-05 — Doc list: ICP.md + COMPANY_JOURNEY.md (discovered, C-016)
- **Status**: DONE (session 2026-06-12-22)
- **Size**: S–M (1 session) → done in 1, same session as the 01/03 ratification flips (C-017)
- **Delivered**: `0-BUSINESS/ICP.md` (v1 profile with per-criterion why, 5-question qualification gate, segment registry, demand-triggered anchor-pack roadmap) + `0-BUSINESS/COMPANY_JOURNEY.md` (client-facing ladder: Sponsor bridge, proxy valley owned, gauges-lighting sequence, Steward/handover, promises-and-limits). Graph wired (51 docs green).
- **Residual**: the simulation's full 15-archetype roster was never persisted — ICP.md §3 canonizes the registry by name with the 7 recoverable slot numbers; founder confirms via **clarification C-018**

### N1-P3-06 — SCORING_MODEL.md + TECH_STRATEGY iBrain revision (queued since session-19)
- **Status**: DONE (session 2026-06-12-23)
- **Size**: M (1–2 sessions) → done in 1
- **Delivered**: the gating read first (iBrain `04_API_REFERENCE.md` + all six `karvia_business/iBRAIN_Integration/` contracts + Karvia's shipped `iBrainService.js`), then —
  - **NEW `2-TECHNICAL/SCORING_MODEL.md`**: the computed-category mechanics — signal store (append-only, program-scoped, raw-never-normalized; nudge events + iBrain-piped dev-stack telemetry as signals), question schema (`maps_to` mandatory — bank derives from the metric model, C-012), calculator-plugin contract (pure functions; score optional / floor_state not — absence is typed), BOQ aggregator (geometric mean + provenance inheritance + the gradient), anchor packs as config + restatement-by-recompute, causal-edge config (the Bridge as data, C-015.7), triangulation rule (F13 channel floor + `baseline.divergence`), adjustment records (evidence_ref required — calibrate-never-invent as a schema constraint), epistemic-engine mapping (BOQ §7), module placement + 7th-driver acceptance test
  - **TECH_STRATEGY → four layers**: Layer 4 (iBrain consumption seams: events out / signed webhooks in / request-response N4; compliance veto = PvE + no-verdict-without-a-path + Article 13 labeling + cost ceiling/fallback; dev-stack telemetry via iBrain), **the stage machine** as a first-class Layer-2 engine (constitutional entry moments; subscribers: page weather, gauge arming, deck scheduling, registry; stale C-014 pipeline names fixed en route)
  - **C-020 recorded**: the orchestrator lives **Nexus-side** — iBrain's surface is app-agnostic IQaaS with no context-assembly surface; game state + policy obligations are Nexus's. 04 §2 updated from "deliberately open" to decided; 04 §7 rows 5–6 marked landed
  - SYSTEM_ARCHITECTURE lineage note (engines ≈ iBrain ancestors) + API_SURFACE `/ibrain/*` flip (✄ → seam ancestor, C-010/C-020); BRQ §4 nudge-event-log instrument (declining-send-rate metric); graph green (53 docs)
- **Headline read finding**: Karvia's `iBrainService.js` never integrated with iBrain at all — it is a local in-process heuristic under the iBrain name; the planned integration (the contract folder) was never implemented. Accidentally, that is C-010's local-first fallback pattern.

### N1-P3-07 — C-016/game consequence revisions (discovered, 03 §9 queue)
- **Status**: DONE (session 2026-06-12-22, same session as ratification + N1-P3-05)
- **Size**: M (1 session) → done in 1
- **Delivered**: full DoD + the founder's runtime-model capture, same pass —
  - **NEW `04_RUNTIME_MODEL.md`** (draft, founder capture): 4-layer × 8-block matrix modularization, the orchestrator role (home decided at N1-P3-06 after the iBrain read), the three epistemic categories (computed/learned/generated — proposed Article 13 extension), trigger map + self-retiring nudge doctrine (nudges are BRQ telemetry), three-things-today, card zoom grammar, best/hostile playthroughs
  - Constitution: the four C-017 rules written into the articles (Art 3 freshness, Art 6 cohort floor + no-verdict-without-a-path, **new Art 14 PvE** — now fourteen articles, refs swept)
  - PRODUCT_STRATEGY: page contract → 10 fields (+ stage weather, rules surface), §stage-dimension matrix landed, Sponsor capture + delegate path on My Clients, pipeline badges fixed (constitution §4 names), three-things-today + valley quest line on Dashboard, team-altitude NBM + AI-draft CTA on Objectives, first-session contract + subtraction rule on Planning, score display doctrine section
  - DESIGN_LANGUAGE: card grammar (zoom levels) + UX doctrine sections
  - AI_CONSULTING_PLAYBOOK: qualification gate (+ segment TLO honesty), Sponsor bridge + engagement nudge chain, proxy-valley script, data covenant, value-bridge collateral; **stale ICP framing ("service-heavy SMB") superseded** here and in GTM
  - BUSINESS_MODEL: the Steward + Calibration Review (pricing in stream-2 TODO); POSITIONING: ecosystem position section (BRAMHI/Nexus/iBrain); GTM: ICP fixed, paid-only + Steward notes
- **Residual**: 04_RUNTIME_MODEL ratification (clarification C-019); orchestrator home + stage machine + nudge-telemetry instrument → N1-P3-06 (still blocked-on-read); hostile-playthrough USER_JOURNEYS pass → post-P3-07 task
- **Notes**: brand/layout rework (C-013) and N1-P3-01 pt 2 remain on the master doc list after these.

### N1-P3-09 — C-013 brand & layout rework (discovered by audit 2026-06-12 — decision had no BACKLOG item)
- **Status**: READY (C-013 ratified 2026-06-10; brand assets in `design/brand/`)
- **Size**: M (1–2 sessions)
- **Definition of done** (the C-013 work list):
  - tokens.css v2 re-extracted from the NEXUS product guide (Sora display + Manrope body + Cormorant taglines; teal + gold accents)
  - DESIGN_LANGUAGE two-tier rework (BRAMHI parent tier vs NEXUS product tier)
  - Sidebar navigation shell replaces the topbar across all 10 mockup surfaces
  - Mockup re-skin incl. **stage-badge text sweep** (audit 2.8: Engaged/Assessing/Handed over → constitution §4 badge names)
  - Verification gates re-run: hex scan zero, token-existence check, contract check, doc-graph green
- **Notes**: absorbs the N1-P2-08 founder-review checkpoint (C-013: "the review verdict is this rework"). design/README.md carries the pending-state note.

### N1-P3-08 — Trigger map + best/hostile playthroughs → USER_JOURNEYS (discovered, 04 §7)
- **Status**: READY — C-019 ratified (04 active) and N1-P3-06 done (the stage machine + its transitions in TECH_STRATEGY); no blockers
- **Size**: S–M (1 session)
- **Definition of done**:
  - The trigger map: every stage transition × designed trigger × fallback nudge chain × owner (derived by walking the hostile playthrough transition by transition)
  - `2-TECHNICAL/USER_JOURNEYS.md` gains the best-case and hostile playthroughs alongside the 4 archetype journeys
  - **J5 — the org-direct journey** (audit 2026-06-12 finding 4.4): the company self-serves the ladder with no consultant in any step (Article 9 made walkable)
  - Stage-machine alignment sweep over the existing journeys (audit 2.4 residue: J4's handover framing checked against the stage machine's Evolve entry)
  - Nudge fences honored in every chain: structure-first, self-retiring (logged as BRQ telemetry), PvE (Art 14), Article 9 (org-direct chains end without a consultant)
