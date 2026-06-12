# Sprints — Night 1b (Product & technical docs)

**Status**: ACTIVE — proposed by the N1-P6-01 close-out groom (session 2026-06-12-24, C-022); **founder ratified in-session 2026-06-12 (session-25): "agree on it, let's rebase it to 105"** — effective ahead of the PR #27 merge
**Theme**: The docs stage — walk the whole game on paper so the build inherits a game already played (audit 2026-06-12 §10). Product docs + mockup rework, then technical contracts, then the QA map. Zero production code.
**Budget**: 10 steps (EXECUTION_PLAYBOOK § the phase plan — re-baselined 2026-06-12)
**Autonomy**: Level 0 (open PRs only; human merges)
**Why "1b" not "Night 2"**: Night 2 = Foundation in ~40 references across the doc set; the phase numbering stays stable and the docs stage slots in between (C-022.3).

---

## Definition of victory for Night 1b

By the end of the night, every document the build consumes exists and is consistent:

1. The product tier is complete: CAPABILITIES + ROADMAP, the trigger map, best/hostile playthroughs, the org-direct journey (J5), and mockups in the ratified two-tier brand
2. The technical tier freezes rather than invents: modularization plan + TS contract drafts written against the journeys, the Nexus-vs-Karvia diff, the assessment interface spec
3. The QA tier knows the target: test inventory, coverage map, path to 80%
4. The close groom drafts SPRINTS_NIGHT_2 (Foundation) and re-reviews the 02/04 absorption candidates (C-022.4)

**Gate honored throughout**: contract-first discipline across the stage boundary — product-stage stories cite page contracts and module surfaces (J-index style), so N1-P4-01 freezes them (audit §10 condition 2).

---

## SPRINT 1 — Product docs (4 steps)

**Goal**: the product tier tells the whole, current story — no pre-canon edges left.

### N1-P3-01 pt 2 — CAPABILITIES.md + ROADMAP.md (1 step)
- `1-PRODUCT/CAPABILITIES.md`: the 8 lego blocks as capabilities, stage-responsive surfaces, both GTM motions; **a section for the task×person match v1 mechanics** — the canon home the 02_NBM_MODEL absorption waits on (C-022.4)
- `1-PRODUCT/ROADMAP.md`: phased against the re-baselined nights; AIR v1 → future verticals

### N1-P3-08 — Trigger map + playthroughs → USER_JOURNEYS (1 step)
- Every stage transition × designed trigger × fallback nudge chain × owner (walk the hostile playthrough transition by transition)
- Best-case + hostile playthroughs alongside the 4 archetype journeys; **J5 — the org-direct journey** (Article 9 made walkable)
- Stage-machine alignment sweep; nudge fences honored (structure-first, self-retiring, PvE Art 14)
- Landing this closes 04 §7 row 7 → **triggers the 04 absorption re-review** at the close groom

### N1-P3-09 — C-013 brand & layout rework (2 steps)
- tokens.css v2 (Sora/Manrope/Cormorant; teal + gold); DESIGN_LANGUAGE two-tier rework; sidebar shell across all 10 mockups; stage-badge text sweep (audit 2.8)
- Verification gates re-run: hex scan zero, token-existence, contract check, doc-graph green

## SPRINT 2 — Technical contracts (3 steps)

**Goal**: the build spec is frozen on paper; Night 2 starts coding, not deciding.

### N1-P4-01 — Modularization plan + contract drafts (2 steps)
- MODULARIZATION_PLAN.md (8 modules + AIR impl folder) + MODULE_CONTRACTS_DRAFT.md (TS signatures; journey steps as acceptance criteria; routes cite API_SURFACE; edges cite MODULE_DEPENDENCY_GRAPH)
- **Assign the outbound notification/mail owner** (audit 4.5) — contract-fronted, never per-module ad-hoc mail
- Reflects: consolidate engines (C-003), TS strict (C-004), Program entity (C-005), stage machine + Layer 4 (C-020)
- Fires the MODULE_DEPENDENCY_GRAPH + API_SURFACE revisit triggers

### N1-P4-02 — Nexus vs Karvia diff + Assessment interface spec (1 step)
- NEXUS_VS_KARVIA_DIFF.md (module-by-module) + ASSESSMENT_INTERFACE_SPEC.md (the pluggable contract; second-provider drill is the acceptance test)

## SPRINT 3 — QA map + close (3 steps)

**Goal**: coverage is a plan, not an aspiration; the night seals itself.

### N1-P5-01 — Test inventory (1 step)
- `3-DELIVERY/QA/TEST_INVENTORY.md`: every Karvia test file catalogued (read the validation contracts before judging fixtures — SESSION_PRACTICES rule 7)

### N1-P5-02 — Coverage map + path to 80% (1 step)
- COVERAGE_MAP.md, COVERAGE_GAPS.md, PATH_TO_80_PERCENT.md

### N1b-P6-01 — Night 1b close groom (1 step)
- `/audit` opening move; budget actuals vs the 10 (one retro line: cheaper/dearer)
- **Absorption re-review** (C-022.4): 02 (CAPABILITIES landed?) and 04 (§7 row 7 closed?) — candidates executed only with founder sign-off
- SPRINTS_NIGHT_2.md (Foundation) drafted from the frozen contracts

---

## Sequencing notes

- Sprint 1 before sprint 2: contracts consume the trigger map and J5 (journey steps are the acceptance criteria)
- P3-09 can run parallel to P3-08 (no shared files) but stays in sprint 1 — mockups are the product-docs companion (audit 4.3)
- Re-sum check: 1+1+2 + 2+1 + 1+1+1 = **10** ✓ (SESSION_PRACTICES rule 2)
