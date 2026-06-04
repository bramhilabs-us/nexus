# Sprint 26 — Handoff Document

<!-- @GENOME T3-SPR-026-HANDOFF | ACTIVE | 2026-05-29 | parent:T3-SPR-026-MP | auto:/init,/close | linked:/sprint-review -->
<!-- 2026-05-28 /testing (S26 BROWSER-SIDE MANUAL GATES — 6/6 PASS, S26 close gate fully cleared). Closes the residual "browser-eye" layer left over from /testing 2026-05-28 Path A scripted acceptance (26/26 ✓ API+DB GREEN, 6 browser gates outstanding). NEW [SPRINT26_MANUAL_GATES_CHECKLIST_2026-05-28.md](SPRINT26_MANUAL_GATES_CHECKLIST_2026-05-28.md) — structured walkthrough cheatsheet (per-gate: URL + role + PASS/FAIL signal + code reference + observation block). User walked all 6 gates on `karvia-business-1.onrender.com`: **(1) KR rows BLUE not RED at 0% / early-period** ✓ PASS — A20260527-02 helper observable on deployed code; **(2) Mailjet inbox OR copy-link fallback UX** ✓ PASS — A20260517-02 honest-degraded contract non-broken; **(3) BO accept-invitation flow** ✓ PASS w/ NOTE — actual redirect is `teams.html` (per [invitation-accept.html:498-499](../../../client/pages/invitation-accept.html#L498-L499)), NOT `assessment-take.html` as gate text claimed; user accepted current flow as functionally correct → handoff gate-text was stale, downstream assessment step still reachable; **(4) AI OKR generation review screen** ✓ PASS — generate → review → approve → persist works end-to-end; **(5) Manager email CTA → objectives.html?focus** ✓ PASS — A20260528-04 destination lock observable on deployed code; **(6) Employee chore ✓/⏸ buttons** ✓ PASS — A20260520-03 wiring intact; KR/Objective progress-bar non-cascade behaved as expected per known A20260520-02/-05 deferral. **No new audit IDs minted** — all 4 referenced code-side fixes (-17-02, -20-03, -27-02, -28-04) already ✅ in master tracker (this session is the deployed-preprod browser confirmation layer atop code-side regression-suite green). **No code touched** this session per /testing scope discipline. **Counter delta**: zero. **Sprint 26 firing UNCHANGED 15/24** — manual gates are acceptance-criterion gates, NOT firing-task counter increments. Prior /coding sessions consistently logged "Sprint 26 firing UNCHANGED 15/24" for non-firing sub-slices (bug-fixes, audit IDs, browser-gate verification). **S28 launch-gate reconciliation**: [SPRINT28_HANDOFF_DOCUMENT.md:13-26](../SPRINT-28-Ysela-Soft-Launch/SPRINT28_HANDOFF_DOCUMENT.md#L13-L26) lists 4 distinct S26-close items — (a) 5-verb acceptance test ✓ CLOSED (Path A 26/26 + this session's 6/6), (b) firing 15/24 → 24/24 ⏳ STILL PENDING (requires 9 more firing-task ships: B3d/A20260514-14 + 8 others — separate coding-track work), (c) 6 manual gates ✓ CLOSED THIS SESSION, (d) `/close` executed ✓ on commit of this session. **Net**: 2 of 4 S26-close gates cleared today; the firing-counter gate (item b) remains a coding-track question independent of /testing. **Carry-forward (refinement-track, NOT S26-blocking)**: (a) handoff gate-3 text correction — "BO accept-invitation → teams.html" (current reality) or amend BO post-accept routing if SSI-first is preferred; (b) A20260520-02 + A20260520-05 KR/Objective progress-bar cascade-from-Task remain DEFERRED to S27 refinement-track per prior plan. **Memory rules**: `feedback_minimal_change_grounding` (Path A checklist over Playwright build-out for one-time gates); `feedback_no_destructive_without_greenlight` (3-path options A/B/C surfaced + user picked A pre-edit); `feedback_read_helper_before_consuming` (getKRRowColorTokens read line-by-line before drafting Gate 1 expectations; invitation-accept.html:498-499 verified BEFORE writing Gate 3 spec — surfaced the handoff-text stale-vs-code discrepancy as INVESTIGATE flag); `feedback_quote_the_canon` (each gate cites file:line reference for the canonical fix source); `feedback_audit_governance` (no IDs minted — already-✅ IDs respected, no spurious flips). **Beta gate**: full Path A acceptance closed (API+DB+browser eye all green) → S26 ready for /close → unblocks S27 close → unblocks S28 launch. -->
<!-- 2026-05-29 /coding (S27 Workstream E burndown — E.3 + E.7 + E.8, three audit IDs 📝→💻→✅ atomic, single commit). Fifth ship of S27 Workstream E today. Three small surgical items shipped together per user direction "knock out 3 small ones (~1.5h, 3 commits)" — combined into 1 commit because all three are independent + low-risk + governance benefit of atomic 3-ID flip. **E.3 / A20260527-06** (1-line URL hint): pre-edit recon surfaced that the bulk "Generate OKRs" button on team-ssi-view was ALREADY deprecated since Sprint 8 (showGenerateOKRButton at team-ssi-view.js:1343 is stubbed). Residual fix: append explicit `?source=team_ssi` query to existing "Generate Objectives →" primary CTA at [team-ssi-view.js:238](../../../client/pages/scripts/team-ssi-view.js#L238) so E.1a query-param branching has explicit signal. **E.7 / A20260529-02 NEW MEDIUM mint** (~20 LoC FE + 130 LoC test): planning-v2.html 0-KR empty-state redirect. NEW audit ID minted today because A20260527-07's original scope was SPLIT at /strategy-mini 2026-05-28 (primary delivery sealed at E.4 ship 2917d2f; remainder ships under -29-02). Existing generic empty-state at [planning-v2.js:446](../../../client/pages/scripts/planning-v2.js#L446) replaced with CTA-bearing banner — id="planning-v2-zero-kr-redirect", headline "No Key Results yet", "→ Go to Objectives" anchor → /pages/objectives.html?focus=<selectedObjectiveId>. CTA inline-styled (navy #1F2937) per cross-page CSS-coupling avoidance. **E.8 / A20260528-04** (~30 LoC code + ~130 LoC test across 5 surfaces): B.4 dispatcher email CTA destination changed planning-v2.html → objectives.html?focus per /strategy-mini 2026-05-28 lock. Surfaces: [LifecycleTransitionService.js:518-521 plan_link builder + L448 docstring](../../../server/services/LifecycleTransitionService.js#L518); [mailjetService.js:1031-1037 dispatcher inline comment](../../../server/services/mailjetService.js#L1031); [EMAIL_DEEP_LINK_CONTRACT.md row 4a](../../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md) (also corrected stale dashboard-v2.html reference that drifted from code pre-this-ship); [ACTIVATION_PLAYBOOK.md §B.4 Impl seam + changelog](../../1-PRODUCT/ACTIVATION_PLAYBOOK.md) with STRUCTURED Original (2026-05-13 A.4 lock) / Current (Sprint 27 E.8) block preserving historical context per `feedback_quote_the_canon` discipline; [test-sprint26-B.4-objective-handoff.js](../../../scripts/test-sprint26-B.4-objective-handoff.js) regression migrated (header docstring + assertion [3] positive + new NO-LONGER-present negative + playbook canon split into 3 + live-fire Manager CTA value). Coach CTA UNCHANGED. **Tests** (3 NEW + 1 migrated, 120/120 ✓ across E.3/E.7/E.8 + 65/65 ✓ B.4 migration): [test-sprint27-E.3](../../../scripts/test-sprint27-E.3-door5-bulk-deemphasis.js) **11/11 ✓** + [test-sprint27-E.7](../../../scripts/test-sprint27-E.7-planning-v2-zero-kr-redirect.js) **22/22 ✓** + [test-sprint27-E.8](../../../scripts/test-sprint27-E.8-b4-dispatcher-destination.js) **22/22 ✓** + migrated [test-sprint26-B.4-objective-handoff.js](../../../scripts/test-sprint26-B.4-objective-handoff.js) **65/65 ✓**. Final test sweep 324/324 ✓ across all 8 S27-touched scripts today (E.0 69/69 + E.4 69/69 + E.5 42/42 + E.6 24/24 + E.3 11/11 + E.7 22/22 + E.8 22/22 + B.4 65/65). Memory rules driving across 3 ships: `feedback_extend_before_wrap` (all 3 extend existing surfaces — no new endpoints/files), `feedback_reuse_max` (E.3 reuses existing CTA + cta_kind primary; E.7 reuses existing empty-state DOM contract; E.8 reuses existing dispatcher URL builder + Coach CTA pattern), `feedback_minimal_change_grounding` (E.3 = 1-line; E.7 = HTML innerHTML swap inline styles; E.8 = surgical 5-surface single-pattern swap), `feedback_no_destructive_without_greenlight` (E.3 surprise recon surfaced bulk-button-already-deprecated state pre-edit; E.7 NEW mint surfaced explicitly per 1-ID-per-shippable-unit; E.8 playbook canon-preservation strategy surfaced before edit — Original/Current block lock vs full rewrite), `feedback_quote_the_canon` (ACTIVATION_PLAYBOOK §B.4 preserves original A.4 lock target verbatim alongside current target with structured Original/Current heading + changelog entry — historical truth visible; B.4 test playbook-canon assertion split into 3 to verify both states + amendment record), `feedback_read_helper_before_consuming` (planning-v2.js renderKeyResults read 442-453 BEFORE edit — confirmed existing branch + DOM target; LifecycleTransitionService.js read 416-538 BEFORE edit — confirmed plan_link builder + APP_URL fail-fast preserved), `feedback_audit_governance` (3-places-atomic — 3 IDs fire today; 2 pre-minted (-27-06 + -28-04) fire first counter entries + 1 NEW mint (-29-02) lands at FIXED state atomic). Counter delta: Medium FIXED 27→30 (+3 from all 3 IDs atomic mints+ships), Medium Total 67→70 (+3), Overall Total 200→203 (+3). Sprint 26 firing UNCHANGED 15/24 (all 3 are S27 firing; E.8 amends a Sprint 26 send-side dispatcher but lands as S27 destination-amendment in the S27 timeline). **S27 Workstream E day-1 ledger**: 6/10 numbered tasks fully shipped today (E.0 UI refactor + E.2 category de-emphasis + E.3 door #5 + E.4 card state-CTAs + E.5 generate-krs extension + E.6 BE aggregation + E.7 planning-v2 redirect + E.8 B.4 destination — 8 distinct shippable items across 6 commits if E.0/E.2 + E.3/E.7/E.8 count as bundled). E.1a/b/c/d wizard restructure remaining (~5h+) — gated on user re-review per "individual objective, we need to review that once again". E.9 regression-suite consolidation pending after E.1 lands. **Next session recommendation**: per user direction, surface wizard design + assignee/owner picker for FRESH REVIEW before any E.1 code edits. -->
<!-- 2026-05-29 /coding (S27 Workstream E.5 ship — A20260527-08 📝→💻→✅ atomic + Q-E5-7 fold-in for Category Coverage default-collapsed per user feedback "not required for now"). Fourth ship today after E.6 + E.0 + E.4. Extends [POST /api/objective-wizard/generate-krs](../../../server/routes/objective-wizard.js#L416) with optional `objective_id` parameter — loads existing Objective into wizard session context for future E.1c wizard add_krs mode + E.4 card CTA consumers. Multi-tenant safety via company_id filter (404 OBJECTIVE_NOT_FOUND); 5-KR cap enforced (400 KR_LIMIT_REACHED when existing >= 5); `targetKrCount = Math.min(4, 5 - existingKrCount)` keeps augmented objectives within 5-KR contract. Session overrides persisted per Q-E5-5 — category/priority/objective_period derived from loaded Objective + written to WizardSession + mirrored to in-memory session via Object.assign. LLM prompt extended with DO-NOT-DUPLICATE exclude-list listing existing KR titles + instruction to generate COMPLEMENTARY metrics per Q-E5-3. Dynamic ${targetKrCount} substitution in 2 prompt sites + slice/fallback caps. Legacy session-only flow preserved (objective_id optional; default targetKrCount=4 unchanged). **Q-E5-7 fold-in** (no separate audit ID — small housekeeping per user feedback during visual review): [objectives.html:149](../../../client/pages/objectives.html#L149) `data-collapsed="false"` → `"true"` so Category Coverage strip is hidden by default; toggle handler unchanged (chevron click still expands). **Test**: NEW [scripts/test-sprint27-E.5-generate-krs-objective-id.js](../../../scripts/test-sprint27-E.5-generate-krs-objective-id.js) **42/42 ✓** across 12 PARTs — banner + Objective import + companyId derivation + multi-tenant 404 + KR-limit 400 + targetKrCount math + session overrides + effectiveTitle resolution + exclude-list block + dynamic prompt count + legacy anti-regression + sibling handlers untouched + category default-collapsed fold-in. Collateral check: E.4 (69/69 ✓) + E.6 (24/24 ✓) + UI consistency (69/69 ✓ after 1-line assertion update to match data-collapsed="true|false" pattern). Counter delta: Medium FIXED 26→27 (+1 from -27-08 atomic mint+ship), Medium Total 66→67 (+1), Overall Total 199→200 (200th lifetime audit ID landed). Sprint 26 firing UNCHANGED 15/24 (E.5 is S27 firing). Memory rules driving: `feedback_extend_before_wrap` (extends existing endpoint — no new route), `feedback_reuse_max` (sanitizeObjectivePeriodPayload reused for period construction; existing OPENAI_ENABLED + generateFallbackKRs branches retained with dynamic count), `feedback_minimal_change_grounding` (objective_id is OPTIONAL — legacy flow untouched), `feedback_no_destructive_without_greenlight` (7 micro-Qs Q-E5-1..7 surfaced + greenlit pre-edit; 5-KR cap chosen over silent over-budget generation; default-collapsed category fold-in surfaced as separate Q before bundling), `feedback_quote_the_canon` (Objective.js schema verified before query construction; sanitizeObjectivePeriodPayload contract followed), `feedback_read_helper_before_consuming` (existing handler read 416-538 BEFORE edits — surfaced companyId wasn't captured, fixed in same surgical block), `feedback_audit_governance` (3-places-atomic — pre-minted -27-08 fires first counter entry today). **Consumer readiness note**: E.5 BE ship lands ahead of E.1c FE — E.4 card "Generate KRs" CTA shipped 1 commit prior routes to `/pages/objective-wizard.html?objective_id=X&action=add_krs` which currently lands on the LEGACY wizard until E.1a/c restructure ships. Acceptable for incremental shipping; URL works at server level. **Next sub-slice**: per user direction "in the next planning of creating a new objective... individual objective, uh, we need to review that once again" — E.1a (wizard restructure with 3 query-param entry modes, 3-4h, largest remaining E task) gated on surfacing the wizard design + assignee/owner picker for fresh review BEFORE any code edits. Today's ship list: 4 atomic commits + 200th lifetime audit ID landed. -->
<!-- 2026-05-29 /coding (S27 Workstream E.4 ship — A20260527-07 + A20260527-09 BOTH 📝→💻→✅ atomic, single commit). Third ship of the day after E.6 + E.0 UI refactor. Data-driven objective card state-CTAs land via NEW [ObjectiveCalculator.getObjectiveCardState](../../../client/pages/scripts/objective-calculator.js) pure helper. State→CTA matrix (locked /strategy-mini 2026-05-28): 0-KR + canEdit → [Generate KRs (routes to E.1c wizard add_krs mode) + Add manually]; has-KRs + no-plan + canEdit → [Plan this objective → + Edit KRs]; has-plan + canEdit → [View progress + Plan + Edit (3 CTAs)]; has-plan + !canEdit → [View progress + Plan (Edit suppressed)]; cancelled/archived → [View details only]; has-KRs + no-plan + !canEdit → read-only fallback. Card renderer becomes dumb iterator via NEW `renderObjectiveCardActions(objective)` at [objectives.js:560](../../../client/pages/scripts/objectives.js#L560) — `state.ctas.map(renderCTA)` with ZERO role-hardcoding in renderer. Delete CTA permission-gated separately (canDelete = isOwner OR CONSULTANT/BUSINESS_OWNER) + hidden on cancelled/archived. Status-color determination at objectives.js:422-471 UNTOUCHED per Q-E4-1 Scope B lock (existing 6-state timeline-aware logic works correctly). NEW CSS .obj-card-cta + .obj-card-cta-primary/-secondary/-danger + .obj-card-badge classes (~70 LoC token-driven via var(--s22-navy)/var(--karvia-gray-*)/var(--karvia-danger)). **Test**: NEW [scripts/test-sprint27-E.4-objective-card-state.js](../../../scripts/test-sprint27-E.4-objective-card-state.js) **69/69 ✓** across 13 PARTs — static markers + vm-sandbox helper load + 8-state matrix sweep + permission matrix sweep across 5 roles (CONSULTANT/BUSINESS_OWNER/EXECUTIVE/MANAGER all canEdit=true; EMPLOYEE non-owner canEdit=false→sees View details only on 0-KR) + populated-vs-raw owner_id shape handling + E.6 weekly_plan_summary consumer (sumWeeklyPlanCount) + legacy fallback. Re-ran E.6 (24/24 ✓) + UI consistency (69/69 ✓) — zero collateral. Counter delta: Medium FIXED 24→26 (+2 from -27-07 + -27-09 atomic mints+ships), Medium Total 64→66 (+2 new mints), Overall Total 197→199 (+2). Sprint 26 firing UNCHANGED 15/24 (E.4 is S27 firing). 7 micro-Qs Q-E4-1..7 surfaced + greenlit pre-edit + 1 surprise finding flagged ("~50 LoC of role-hardcoding" master plan premise turned out wrong — current renderer has zero role checks; E.4 is net-new UX behavior not a refactor). Memory rules: `feedback_extend_before_wrap` (extends ObjectiveCalculator literal at L669 — same module as getKRRowColorTokens; no new module), `feedback_reuse_max` (CTAs reuse existing viewObjectiveDetails/deleteObjective/planning-v2/wizard URL conventions; sumWeeklyPlanCount consumes E.6 weekly_plan_summary shipped 1 commit prior — no new BE endpoints), `feedback_minimal_change_grounding` (status determination at 422-471 untouched; scope-confirmed Scope B), `feedback_no_destructive_without_greenlight` (7 micro-Qs surfaced + greenlit; Delete-preservation Q-E4-2(a) avoids permission-tightening drift), `feedback_quote_the_canon` (master plan E.4 state matrix quoted verbatim into helper JSDoc; test asserts matrix row-by-row), `feedback_read_helper_before_consuming` (renderObjectiveCard read line-by-line at 326-560 BEFORE refactor — surfaced the master-plan premise gap; current renderer has no role hardcoding to remove), `feedback_audit_governance` (3-places-atomic — 2 pre-minted IDs fire first counter entries today). **Permission-derived CTAs are the intentional UX shift this session**: today every user saw View Details + Delete uniformly; after E.4 the EMPLOYEE non-owner sees only View Details, the BO sees the full Generate KRs / Plan / Edit ladder per state. **Next sub-slice**: user visual review (E.0 UI refactor + E.4 cards in browser) per session-close direction "continue and then lets do visual review"; if green → E.5 (extend generate-krs endpoint for E.1c consumer) → E.1a/b/c/d wizard restructure → E.7 (planning-v2 0-KR redirect) → E.8 (B.4 dispatcher destination) → E.9 (regression suite). -->
<!-- 2026-05-29 /coding (S27 Workstream E UI consistency refactor — A20260529-01 NEW MEDIUM + A20260527-05 (E.2 pre-minted) BOTH 📝→💻→✅ atomic, single commit). User direction during /coding mid-session: align objectives.html with my-clients + dashboard visual language ("the way we have KPIs and add client button"). /init stocktake by Explore agent surfaced: dashboard.html + my-clients.html drift from each other → my-clients = canonical (token-driven s13-patterns.css + navy palette + dedicated .mc-* CSS file). 5 micro-Qs greenlit + 1 canonical-target lock pre-edit. Ships: NEW [client/css/objectives.css](../../../client/css/objectives.css) (~220 LoC modeled on my-clients.css consuming `--s22-navy`/`--karvia-gray-*`/`--karvia-warning/danger/success/info` tokens) + 8 surgical [client/pages/objectives.html](../../../client/pages/objectives.html) deltas: (1) `<body class="obj-page">` + `<main class="obj-page-shell">` shell (max-width 1280 + padding 24 mirroring `.mc-page-shell`); (2) NEW page header row `<h1 class="obj-title">Objectives</h1>` + subtitle + `.obj-quarter-pill`; (3) 4-card `.obj-kpi-grid` replacing inline divide-x KPI strip (Active/Progress/KeyResults/AIGenerated — all 4 `stat-*` IDs preserved + `.is-purple`/`.is-blue` modifiers); (4) "Add Objective" button class `karvia-gradient` → `obj-add-btn` (solid `var(--s22-navy)` matching `.mc-add-btn` token); (5) Category Coverage DEMOTED to collapsible `.obj-category-strip` w/ data-collapsed toggle + smaller `.obj-category-chip` elements (E.2 / A20260527-05 fires its first counter entry today via subsumption); (6) Filter buttons → `.obj-filter-btn` (navy-active not gradient); (7) status dot inline `text-red-600`/`text-green-600`/`text-blue-600` → `var(--karvia-danger)`/`var(--karvia-success)`/`var(--karvia-info)`; (8) body bg `#F8FAFC` matches my-clients page bg. Modal interiors UNTOUCHED per scope discipline (separate ship if user wants modal CTA color migration). Test: NEW [scripts/test-sprint27-UI-consistency-objectives.js](../../../scripts/test-sprint27-UI-consistency-objectives.js) **69/69 ✓** across 9 PARTs including all 24 JS hook IDs preserved (`stat-active-count` through `objectives-grid`) — `updateCategoryCoverage()` keeps working via null-safe `if (barEl)` guard at [objectives.html:1829](../../../client/pages/objectives.html#L1829) when category-bar fillers removed. E.6 regression re-run **24/24 ✓** — zero collateral. Counter delta: Medium FIXED 22→24 (+2 from -29-01 + -27-05 atomic mints+ships), Medium Total 62→64 (+2), Overall Total 195→197 (+2 mints). Sprint 26 firing UNCHANGED 15/24 (UI refactor is S27 firing). **Foundation unblocked**: E.4 (data-driven card state-CTAs via getObjectiveCardState) now lands in the refactored design — `.obj-grid` available, navy CTA + KPI card patterns established. Memory rules: `feedback_extend_before_wrap` (extends s13-patterns.css token system; new .obj-* file mirrors .mc-* page-specific pattern), `feedback_reuse_max` (consumes existing tokens — no new minted), `feedback_minimal_change_grounding` (HTML surgical to header+KPI+filter+category sections; modal interiors UNTOUCHED), `feedback_no_destructive_without_greenlight` (5 micro-Qs + canonical-target choice surfaced + greenlit pre-edit), `feedback_quote_the_canon` (my-clients.css + my-clients.html structure cited verbatim during stocktake), `feedback_read_helper_before_consuming` (objectives.js `updateCategoryCoverage` read line-by-line BEFORE removing `.category-bar` — verified null-safe), `feedback_audit_governance` (3-places-atomic — Summary + this comment + Status Matrix block). **Next sub-slice**: E.4 (card state-CTAs against refactored design — consumes weekly_plan_summary from E.6 ship), then E.5 → E.1a→b→c→d → E.7 → E.8 → E.9. -->
<!-- 2026-05-29 /coding (S27 Workstream E.6 ship — A20260528-05 📝→💻→✅ atomic, single slice). First firing task of revised Workstream E lands. GET /api/objectives now returns `weekly_plan_summary: {per_kr: {[kr_id]: count}}` field via single WeeklyGoal aggregation ($match company_id+key_result_id+status!=cancelled, $group key_result_id with $sum:1). Feeds E.4's `getObjectiveCardState(objective, currentUser, weeklyPlanCount)` helper `has_plan` boolean — single round trip vs N+1 FE fan-out. Code: [server/routes/objectives.js:14 + 451-471](../../../server/routes/objectives.js#L451) — WeeklyGoal model import + 15 LoC aggregation block inserted after KR population, before res.json. Test: NEW [scripts/test-sprint27-E.6-weekly-plan-summary.js](../../../scripts/test-sprint27-E.6-weekly-plan-summary.js) — **24/24 ✓** across 7 PARTs (import + pipeline shape + per-objective placement + anti-N+1 + krIds flatMap + handler invariants + WeeklyGoal schema contract). 3 micro-Qs locked pre-edit: Q-E6-1 per-objective placement (vs response-level global map — FE iteration alignment); Q-E6-2 `$ne: 'cancelled'` (mirrors objectives soft-delete pattern at [objectives.js:414](../../../server/routes/objectives.js#L414)); Q-E6-3 ship test in same commit (📝→💻→✅ atomic per `feedback_audit_governance`). Counter delta: Low OPEN 7→6 (−1), Low FIXED 7→8 (+1), Total UNCHANGED 195. Sprint 26 firing UNCHANGED 15/24 (E.6 is S27 firing). Memory rules driving: `feedback_extend_before_wrap` (extends existing GET handler — no new endpoint); `feedback_reuse_max` (existing composite index `{company_id, key_result_id}` from WeeklyGoal:108 makes aggregation O(log n) — no new index); `feedback_minimal_change_grounding` (single aggregation beats N+1 FE fan-out per /strategy-mini Q-1 lock); `feedback_read_helper_before_consuming` (verified WeeklyGoal schema field names + status enum + composite index BEFORE writing $match — Part 7 of regression suite asserts this contract). **Next sub-slice**: UI consistency refactor (objectives.html → my-clients pattern: navy CTA + KPI card strip + s13-patterns.css tokens + new objectives.css) — stocktake complete, plan greenlit, executes before E.4 so card state-CTAs land aligned. Then E.4 → E.1a/b/c/d → E.5 → E.7 → E.8 → E.9. -->
<!-- 2026-05-28 /strategy-mini (Convergence plan-lock for S27 Workstream E — 4 audit IDs minted 📝 PLAN, no code touched). Triggered by user-driven brainstorm during /testing close (manual modal RED-on-day-1 bug observation + 6 strategic directions reshaping S27 E plan). Decisions captured in [OBJECTIVES_PAGE_STRATEGIC_INPUT.md §Plan-Lock 2026-05-28](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md#plan-lock-2026-05-28--convergence-revision) + [SPRINT27_MASTER_PLAN.md §Workstream E (REVISED)](../SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md). **Key locks**: (1) ONE wizard surface = `objective-wizard.html` with 3 entry modes (legacy `?source=team_ssi` / new `?creation_mode=individual` intent-first / `?objective_id=X&action=add_krs` Manager-or-BO add-later); (2) objectives.html = sole Objective+KR creation surface, planning-v2 = consume-only; (3) intent-first wizard drops Step 1 strategic-focus picker for `creation_mode=individual` (AI infers category from intent, editable); (4) owner = anyone with edit permission (BO can self-own + self-add-KRs); (5) data-driven card state-CTAs via NEW `ObjectiveCalculator.getObjectiveCardState` pure helper — zero role-hardcoding; (6) date-system audit confirmed all tracking is objective-relative (no shared anchor — each objective tracks its own Week N/M independent of others). **4 audit IDs minted 📝 PLAN**: A20260528-02 MEDIUM (manual-modal `calendar_year` default → Jan-1 backfill → RED on day 1 — subsumed by E.1a wizard timeline picker); A20260528-03 MEDIUM (objective-wizard finalize line 895 silent `owner_id || userId` fallback — extends A20260527-01 pattern to wizard route, ships as E.1d); A20260528-04 MEDIUM (B.4 dispatcher email CTA destination → objectives.html, was planning-v2 — ships as E.8); A20260528-05 LOW (GET /api/objectives `weekly_plan_summary` field for E.4 helper — ships as E.6). **Audit-ID scope changes from /strategy 2026-05-27**: A20260527-04 (Individual wizard) split into E.1a/b/c — REUSE existing wizard via query-param branching, NOT new modal; A20260527-07 (Manager planning-v2 Generate-KRs CTA) REJECTED for KR creation, scope-flipped to objectives.html card state-CTAs (E.4) + planning-v2 0-KR redirect (E.7); A20260527-08 endpoint UNCHANGED but consumer changed (objectives.html, not planning-v2); A20260527-09 (objective card polish) MERGED into E.4. **Date-system audit result (no new IDs — math is correct)**: confirmed objective-relative math throughout (`calculateExpectedProgress`, `calculateWeekProgress`, `calculateKRRiskStatus`, `getKRRowColorTokens` all read each objective's own start_date/end_date). Two-week-concept distinction locked in [CASCADE_MIGRATION_STATE.md](../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md) (objective-relative "Week N/M" + ISO calendar week coexist by design). The only date leak is A20260528-02. **Revised Workstream E total**: ~13h = 1.5 days (was 1.5-2 days; ~3-4h saved via wizard convergence). Memory rules: `feedback_extend_before_wrap` (reuse existing wizard via query-param branch — saves new-modal code), `feedback_reuse_max` (single state-derivation helper + single BE aggregation), `feedback_minimal_change_grounding` (state-CTA matrix lives in one pure function), `feedback_no_destructive_without_greenlight` (3 brainstorm Q-gate cycles per design iteration), `feedback_quote_the_canon` (DateService + Objective.js read line-by-line before audit findings), `feedback_audit_governance` (4 IDs 3-places-atomic). Counter delta: Medium OPEN 10→13 (+3), Low OPEN 6→7 (+1), Total 191→195. Sprint 26 firing UNCHANGED 15/24 (all 4 are S27 amendments). Next: `/coding` S27 Workstream E in dep order. -->
<!-- 2026-05-28 /testing (S26 Path A scripted acceptance — 26/26 ✓ + 1 LOW tooling bug minted). Trigger: /init recommendation #2 from /coding 2026-05-28 close — Path A 5-verb acceptance test deferred twice from /testing 2026-05-26 now unblocked by burndown completion. Pre-flight: push to `origin/development` confirmed → Render auto-deploy verified live via curl probes (A20260527-02 audit markers + `getKRRowColorTokens` + 0 user-facing "weekly milestones" residue); D.3 prompt-regression 504/504 ✓ GREEN (defensive close-gate ran since `server/prompts/endpoint-templates/single-objective.js` touched this sprint). NEW [scripts/path-a-acceptance-walkthrough.js](../../../scripts/path-a-acceptance-walkthrough.js) — scripted API-driven walkthrough against live `karvia-business-1` + MongoDB DB inspection. **26/26 ✓** across 4 phases: Phase 1 Onboard (consultant signup → BO + Manager invitations persisted with tokens + status='pending' + email_delivery shape per A20260517-02 contract), Phase 4 Author (**A20260527-01 strict gate FIRES live**: POST /api/objectives without owner_id → 400 "owner_id is required" ✓; POST with owner_id → 201 + Objective.owner_id matches submitted + created_by preserved separate ✓ — no silent userId coercion confirmed E2E on deployed code), Phase 5 Hand-off (Manager Invitation + token + role=MANAGER), Sanity (deployed -27-02 helper + audit markers + renderKR routing confirmed). **Mailjet preprod state**: `email_delivery.delivered=false` honestly surfaced via A20260517-02 ship's contract — preprod Mailjet may not be configured, copy-link fallback path is the correct degraded UX; NOT a Sprint 26 defect. **A20260528-01** (LOW, mint+PLAN, deferred fix) — `scripts/cleanup-rsm-tenant.js:113-114 + :151-152` by-user-ref guard uses wrong Invitation field names (`invited_by`/`invited_email` instead of canonical `sent_by`/`recipient_email`); cascade-by-company_id sweep masks the bug for same-tenant cases (which is why all wipes have run clean) but cross-tenant invitations would orphan-leak. 4 LoC fix queued for next /coding session. **6 browser-side manual gates remaining for S26 close**: (1) objectives.html KR rows render BLUE not RED at Week 1/13 with 0% (-27-02 smoking gun closure proof); (2) Mailjet inbox delivery (or copy-link fallback UX if degraded); (3) BO accept-invitation → assessment-take.html UX; (4) AI OKR generation review screen; (5) Manager click-through → planning-v2.html landing; (6) Employee chore complete/postpone (✓/⏸) buttons. Path B (self-serve cohort) deferred to next /testing per Q3(a) green-light. Memory rules: `feedback_no_destructive_without_greenlight` (Q-gate matrix Q1-Q7 + Q-A wipe confirmation surfaced pre-edit), `feedback_audit_governance` (3-places-atomic mint for -28-01), `feedback_quote_the_canon` (Invitation model schema verified before tooling-bug declaration), `feedback_minimal_change_grounding` (-28-01 deferred — /testing session focuses on testing, not fixing), `feedback_reuse_max` (walkthrough script reuses existing /api/auth/signup + /api/invitations/create + /api/objectives endpoints — no new BE surfaces), `feedback_test_fixture_validation` (script verifies actual schema field names before DB queries; caught wrong-field-name bug). Counter delta: Low OPEN 5→6 (+1 -28-01 mint), Total 190→191. Sprint 26 firing UNCHANGED 15/24. **Path A acceptance VERDICT**: API + DB-level GREEN; 6 browser-side manual gates remain. **Beta gate**: -27-01 strict owner_id verified LIVE on preprod — fail-noisy contract fires correctly. -->
<!-- 2026-05-28 /coding (S26 burndown — 3 pre-minted A20260527 IDs all 📝→💻→✅ atomic). **A20260527-02** (MEDIUM, mint+ship — closes A20260526-01 + sibling-sweep miss class): scope widened pre-edit from 1 site (objectives.js:586-606 renderKR) to **4 sites** via `feedback_read_helper_before_consuming` grep audit — Option A (full sweep, single audit ID) greenlit over Option B (defer + mint -28-01/-02). Sites: renderKR card preview + renderKeyResultRow modal + renderTopKeyResults strip + countKRsByStatus→countKRRiskStatuses counter. NEW `ObjectiveCalculator.getKRRowColorTokens(status, hasStarted)` at [objective-calculator.js:203](../../../client/pages/scripts/objective-calculator.js#L203) — canonical 4-state palette map matching `calculateKRRiskStatus` vocabulary; 5-bucket legacy palette (amber 40-69% band) collapsed to 4-state. All 4 sites feature-detect helper + objective availability, route through `calculateKRRiskStatus(objective, kr, krProgress) → getKRRowColorTokens(status, hasStarted)`, fallback to legacy threshold ladder when objective null (preserves "add new KR" modal flow which has no objective context). **A20260527-01** (MEDIUM): POST /api/objectives gains `if (!owner_id) return 400` after category check; silent `|| userId` fallback removed at Objective construct + krSpecs ownerForKR. Pre-edit caller audit confirmed both production POST callers (objectives.html manual modal + okr-creation-wizard.js) send owner_id; direct-write paths (objective-wizard finalize + 4 ai-okr.js sites) bypass endpoint + retain own fallback. Aligns POST endpoint with C.5 wizard finalize strict gate per A20260506-05. **A20260527-03** (LOW): 6 user-facing "weekly milestones" → "weekly goals" per [CASCADE_MIGRATION_STATE.md:113-114](../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md#L113-L114) — 5 planning.html (3 alerts + 1 description template + 1 delete alert) + 1 planning-v2.html (modal helper). Dev JSDoc at planning.html:905 preserved per canon enumeration. **Tests (Option II greenlit pre-commit)**: 3 NEW scripts 81/81 ✓ total (53/53 + 16/16 + 12/12); sibling sweep -20-01 (56/56 ✓) + -20-02/-05 (69/69 ✓) = **206/206 ✓ across 5 scripts** zero collateral. Memory rules: `feedback_read_helper_before_consuming` (the sibling-sweep audit that widened scope is the A20260526-01 lesson applied verbatim), `feedback_extend_before_wrap` (new helper mirrors existing `getStatusColor`/`getStatusTextColor` pattern), `feedback_no_destructive_without_greenlight` (Option A/B/C surfaced for scope + Option I/II for tests, both greenlit), `feedback_audit_governance` (3 IDs 📝→💻→✅ atomic; 3-places-update on each ID), `feedback_quote_the_canon` (CASCADE_MIGRATION_STATE.md:113-114 enumeration followed verbatim), `feedback_minimal_change_grounding` (-01 strict on POST only, direct-write paths each own their invariant). Counter delta: Medium OPEN 11→10, Medium FIXED 19→22, Low FIXED 6→7, Total 187→190. Sprint 26 firing 15/24 UNCHANGED (all 3 bug-fix not firing sub-slices). Files modified (7): objective-calculator.js (new helper); objectives.js (Site 1 + Site 2); objective-detail.js (Site 3 + Site 4); server/routes/objectives.js (strict gate + fallback removal); planning.html (5 strings); planning-v2.html (1 string). Files created (3 test scripts). **Beta gate**: -27-02 closes BO trust gap on objectives page first impression (footer + rows now share temporal vocabulary); -27-01 contract-level fail-noisy aligns POST with wizard finalize strict gate; -27-03 user-facing copy matches canonical 4-level cascade. Sprint 26 close gate (5-verb acceptance on karvia-business-1) now unblocked — runs next. -->
<!-- 2026-05-27 — /strategy session #260 executed full Objectives Page evaluation: 4 RPs (wizard unification + Category Coverage blast-radius + cascade standardization + S26/S27 plan fit) + deferred-KR multi-play audit + new Individual Objective wizard design + holistic audit. ZERO code touched per `feedback_no_destructive_without_greenlight` — research + doc-only session. **Key architectural decision** (user direction quoted): *"Quarterly goal does not have any impact, so I don't think it should survive... let's use the new weekly goal model. KR weekly goal tasks"* → 4-level canonical cascade locked (Objective → KR → WeeklyGoal → Daily Task) for new objectives; legacy 5-level objectives preserved untouched per *"make it sure that you know quarterly goal is at least for the new objective one is removed but eventually we will do"*. **Move layer** (behavior-based, AI-generated from Tasks) parked as future 5th layer per *"the moose is something that we will generate out of... that's a later addition"*. **Additive principle locked**: per *"let's not delete anything so that way we are reducing the risk"* — all retirement deferred to post-Beta measurement; S26/S27 work is additive de-emphasis + new doors only. **9 audit IDs pre-minted A20260527-01..09** split across S26 burndown (3 items: backend owner_id requirement + A20260526-01 KR-row CSS fix + doc-only RP3 cascade standardization, ~3 hours) and S27 Workstream E NEW (6 items: Create Individual Objective wizard + Category Coverage de-emphasis + door #5 de-emphasis + Manager planning-v2 "Generate KRs" CTA for 0-KR objectives + extend generate-krs endpoint for deferred-KR mode + objective card polish, ~1.5-2 days). **TQ4 "different objective" clue resolved**: no strong term hit via blind grep; user observation likely referred to either (a) post-assessment bulk vs canonical wizard distinction (addressed by A20260527-06) OR (b) Manual-vs-AI dropdown split on objectives.html (addressed by A20260527-04 new dropdown entry). **6 doc updates landed**: CLAUDE.md (cascade diagram → 4-level + legacy note), WeeklyGoal.js docstring (cascade alignment), OBJECTIVES_PAGE_STRATEGIC_INPUT.md (status DRAFT → RESOLVED + full Q-gate resolutions), SPRINT27_MASTER_PLAN.md (Workstream E added with full task spine + acceptance test references), this handoff (this comment + /strategy section below). **2 NEW reference docs**: [KARVIA_STRATEGY/1-PRODUCT/PARKED_FEATURES.md](../../1-PRODUCT/PARKED_FEATURES.md) (Category Coverage + door #4/#5/#6 parking inventory + future-trigger criteria) + [KARVIA_STRATEGY/2-TECHNICAL/CASCADE_MIGRATION_STATE.md](../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md) (4-level canonical + legacy preservation + UNION-READ state + 3 parked architectural questions). **Multi-play deferred-KR audit verified at data layer**: save with 0 KRs ✅ + add KRs later via POST /api/key-results ✅ + lifecycle transitions reactive ✅ + UI handles 0-KR ✅ + Dispatcher 4 fires regardless of KR state ✅. **One gap surfaced**: Manager arrives at planning-v2 with 0-KR objective and has no clear "Generate KRs" CTA → closed by A20260527-07/-08. **Individual Objective wizard design locked (Q1-Q4 resolved)**: modal on objectives.html (Q1=a) + collapsible company context panel (Q2=c) + AI sharpening opt-in (Q3=a) + "Add later" default KR mode (Q4=a). 3-step: Step 1 free-text intent + context, Step 2 category/priority/timeline/Manager (required), Step 3 KR mode + save via existing `/api/objective-wizard/finalize`. Reuses existing wizard pipeline + context-hints endpoint + eligible-owners endpoint — zero new core endpoints. **Holistic audit framework run pre-edit**: 10 dimensions all PASS (strategic alignment + additive principle + risk minimization + reuse-max + no-destructive-without-greenlight + stable IDs + document coverage + quote-the-canon + Beta gate labeled + memory rules applied). **Next session recommendation**: `/coding` S26 burndown — three small ship-completion items (A20260527-01 backend owner_id required + A20260527-02 A20260526-01 KR-row CSS color fix + A20260527-03 doc-only cascade standardization UI string normalization across planning.html + planning-v2.html). Then `/coding` S27 Workstream E kickoff. Then end-to-end `/testing` 5-verb acceptance (Path A consulting + Path B self-serve) to close S26. Per user direction *"by end of split twenty six or twenty seven, we need to have everything ready"*. -->
<!-- @GENOME T3-SPR-026-HANDOFF-PRIOR | SUPERSEDED | 2026-05-26 | parent:T3-SPR-026-MP -->
<!-- 2026-05-26 — /testing pivoted to research+audit-mint mid-walkthrough per user direction "we are not pivoting from scope, we are choosing not to do testing". Phase 0 surgical wipe of `rsm@karvia.ai` tenant fired clean via NEW [scripts/cleanup-rsm-tenant.js](../../../scripts/cleanup-rsm-tenant.js) probe-first script (1 user + 1 company "KARVIA Consulting" + 12 cascade docs from 2026-05-23 signup deleted; post-verify 0 ✓ across all buckets). Script fixes A20260518-01 P3 cleanup-target leak class via probe-first + dynamic COMPANY_IDS resolution (companies.created_by ∈ userOids + users.company_id ∈ companies union). Phase 1 signup clean: rsm@karvia.ai consultant → stringsounds BO invited + completed assessment → AI generated 1 Customer Success objective "Launch a standardized customer onboarding process and onboard 90% of new clients" (4 KRs, Week 1/13, May 24 - Aug 22). Phase 2 verified A20260520-04 closure in-browser ✓ (objectives.html renders cleanly, no ReferenceError). **Phase 3 mint**: **A20260526-01** (MEDIUM — UX-INCONSISTENCY-KR-ROW-RED-DESPITE-ONTRACK-FOOTER, 1 surface) — A20260520-01 ship + #258 sibling sweep routed COUNTER (renderSummaryStats) and math (effectiveKRProgress) through `calculateKRRiskStatus`, but per-KR row CSS color binding inside [objectives.js renderKeyResultsPreview:489-503](../../../client/pages/scripts/objectives.js#L489-L503) still uses hard `krProgress >= 70 / >= 40 / else` thresholds. Visible UX contradiction: footer reads "4 KRs on track · 0 pending" ✓ but the 4 KR preview rows render RED-bordered with RED %. Fix direction (deferred): route `krProgress` through `calculateKRRiskStatus(objective, kr)` for status string → derive `{bgColor, textColor, borderLeft}` from status. ~15 LoC + regression test extending -01 PART 8. Severity MEDIUM — UX-inconsistency / Beta-quality polish, not Beta-blocker. **Strategic pivot mid-session** per user observation of NEW 3-step "Create Objective with AI" wizard alongside existing AI OKR generation entry: user direction "we have new wizard, why dont we use that new OKR generation here also, first find, compare, do impact analysis", "lets remove category coverage — as we are focusing on individual objectives created by BOs/consultants/managers (look at strategic shift in the way we approach objective → KRs → quarterly goals → weekly goals → daily tasks — see if we have standardized this, if not its time)", "in part of sprint twenty seven, we can add it. And yeah, we look at what is left in the sprint twenty six, and then we try to complete it." Phases 4-6 (-03 chore actions verify / -02-05 cascade HEADLINE verify / Gates 10-12 First Objective Created acceptance push) **DEFERRED** to post-S27-closure end-to-end testing session per "I think we can push the testing to later, once we have everything covered so we can test out the entire end-to-end scenarios". Strategic-evaluation input captured in NEW [SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md) v1 — 4 RPs (wizard unification audit + category coverage removal blast-radius + cascade standardization audit + S26 burndown/S27 plan fit check) with Q-gates ready for resolution at next /strategy session. **Outstanding clarification from user**: TQ4 — "different objective" mentioned but unsourced; need term/context to grep. **Memory rules driving**: `feedback_no_destructive_without_greenlight` (testing pivot greenlit + 3 wipe-scope Q-gates + 7 pre-walkthrough Q-gates greenlit + research items framed read-only); `feedback_audit_governance` (A20260526-01 minted 3-places-atomic — Summary counters + comment + Status Matrix row); `feedback_quote_the_canon` (smoking gun "4 KRs on track / 0 pending" footer vs all-red KR rows + full user direction verbatim in strategic input doc); `feedback_extend_before_wrap` (A20260526-01 fix direction = route through existing `calculateKRRiskStatus`, NOT new color service; cleanup script extends fixture-wipe pattern with probe-first rather than parallel new script); `feedback_minimal_change_grounding` (NEW cleanup script ~140 LoC over hardcoded-ID approach); `feedback_read_helper_before_consuming` (A20260526-01 is a sibling-sweep miss — verify ALL consumer paths of a helper before claiming sweep complete; lesson for future helper routing). Counter delta: Medium OPEN 10→11 (+1 from -26-01), Total 186→187 (+1 mint). Sprint 26 firing UNCHANGED 15/24. **Quality 8/10** — strong: clean pivot from gate-walkthrough to research-prep without scope creep; surgical-cleanup tool minted as permanent utility; -01 sibling-sweep miss caught at first browser observation (PART 8 vm-sandbox test SHOULD have caught it — methodology improvement queued); strategic input doc captures user direction verbatim. Weak: -01 ship 2026-05-20 declared "fixed" but only patched the counter; the per-row CSS visual gap demonstrates that even the upgraded vm-sandbox PART 7/8 pattern doesn't probe CSS-class assertions; methodology gap noted for /audit. Smaller: cleanup script untracked (would normally commit, but per user clarification at /close TQ5=a recommended). **Branch status at /close**: working tree pending /close commit. **Next session recommendation**: `/strategy` execute the 4 RPs in [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md), resolve Q-W/C/S/P gates with user, amend S27 master plan with the resulting Workstream (or create S28 if scope overflows). Secondary: ask user for "different objective" clarification at session start. Tertiary: /audit static-grep-without-invocation methodology sweep (now compounded by -26-01's CSS-class-not-asserted class). -->
<!-- 2026-05-25 — /coding A20260520-02 + A20260520-05 shared-helper burndown sealed in single commit. Promoted both from 📝 DEFERRED refinement-track → ✅ FIXED per pre-edit Q-gate matrix `a/b/a/a/a/b/a` (greenlit by user after scope+Q-gates surface). **Calculator extensions (additive, no destructive changes)** at [client/pages/scripts/objective-calculator.js](../../../client/pages/scripts/objective-calculator.js): NEW `calculateKRProgressFromChildren(kr, goals)` — pure children-rollup averaging `goal.progress_percentage` over non-cancelled goals; returns `null` when no children so caller falls back to metric-based `calculateKRProgress`. NEW `calculateObjectiveProgressFromKRs(objective, keyResults, progressResolver=null)` — averaged via caller-supplied resolver; default resolver preserves metric-based semantics for backward compat. EXTENDED `calculateKRRiskStatus(objective, kr, overrideProgress=null)` — backward-compat 3rd arg routes status pill through rolled-up progress; closes -02 (NOT_STARTED stale pill) without modifying existing 2-arg callers. EXTENDED `countKRRiskStatuses(objective, keyResults, progressResolver=null)` — same pattern for the bucket counters. EXTENDED `getStatusLabel` map with `'at-risk' → 'At risk'` + `'pending' → 'Not started'` entries (calculateKRRiskStatus output vocabulary coverage). **Consumer wiring across 2 surfaces** per Q3=a sibling sweep: [client/pages/scripts/planning-v2.js](../../../client/pages/scripts/planning-v2.js) — module-scope `krRolledProgress` Map, fan-out `loadKRChildrenForObjective(krs)` hits existing `/api/weekly-goals/:krId` per KR in parallel on `selectObjective` (audit's N=4 case), `resolveKRProgress(kr)` resolver helper, `renderObjectives` routes selected-tile progress via `calculateObjectiveProgressFromKRs`, `renderKeyResults` routes KR bar via rolled-up progress + status pill via `calculateKRRiskStatus(parentObjective, kr, rolled)` override path (drops legacy `kr.status || 'in-progress'` literal); [client/pages/scripts/objectives.js](../../../client/pages/scripts/objectives.js) — full sibling sweep with same Map + `loadKRChildrenForAllObjectives(objectives)` fan-out called after `loadObjectives` resolves, `effectiveKRProgress(kr)` helper (rolled with metric fallback), wired across `calculateStats` (KPI strip avg + label), `createObjectiveCard` (card progress display + allKRsCompleted check), `renderKeyResultsPreview` + `renderKeyResultRow` (KR preview rows in card + modal), `renderSummaryStats` (resolver passed to `countKRRiskStatuses` + to both legacy threshold branches), `getFilteredObjectives` (at-risk / on-track filter classification). **Reality-check during pre-edit grounding** per `feedback_read_helper_before_consuming`: audit's "~30 LoC" estimate assumed `kr.quarterly_goals[].weekly_goals[].tasks[]` tree was populated on planning-v2 render — verified NOT loaded (only `objective.key_results[]` + selected-KR's `weeklyGoals[]`). Q2=b chosen to fan-out fetch per KR via existing endpoint rather than expand BE response shape (Q2=c) or settle for partial selected-KR-only fix (Q2=a). Companion verification per audit's bonus check: `tasks.js:441` `task.updateStatus → goal.progress` cascade confirmed firing pre-edit (existing -03 ship verified Goal.progress IS updated), so option (A) FE-bubble is sufficient — no BE cascade-on-write needed. **Test ship**: NEW [scripts/test-sprint26-A20260520-02-and-05-kr-objective-rollup.js](../../../scripts/test-sprint26-A20260520-02-and-05-kr-objective-rollup.js) — **69/69 ✓** across 8 PARTs (PART 1 helper signatures + audit-ID threading; PART 2 `calculateKRProgressFromChildren` pure math incl SMOKING GUN "1 complete out of 2 → 50%" assertion matching audit screenshot; PART 3 `calculateObjectiveProgressFromKRs` pure math with custom resolver + SMOKING GUN "1 KR rolled to 50%, 3 KRs at 0% → 12-13%"; PART 4 `calculateKRRiskStatus` override-progress backward-compat matrix + clamp + NaN fallback; PART 5 `countKRRiskStatuses` resolver + `getStatusLabel` new vocab; PART 6 planning-v2 consumer wiring static-grep + script-tag order; PART 7 objectives.js sibling-sweep wiring static-grep; PART 8 vm-sandbox `renderSummaryStats` invocation under populated cache — k1=100 shifts counter to "completed" — extends -04 static-grep-without-invocation upgrade pattern). **Backward-compat amendment to A20260520-01 regression test**: signature-regex relaxed to tolerate optional trailing args; vm-sandbox stubs injected for new module-scope `resolveKRProgress` / `effectiveKRProgress` helpers; **56/56 ✓** preserved. **Sibling sweep across all S26 audit-ID regression scripts**: -01 56/56 + -02-and-05 69/69 (NEW) + -03 41/41 + -10/-11/-11-p2/-12-13/-12-14/-12-15/-12-16a/-12-17/-13-05-06-06b/-13-08a/-14-02..-09/-15-02/-15-04/-16-01/-16-02/-17-01/-17-02/-18-01..-04 all ✓ — zero new collateral. Pre-existing -12-18-19 8/9 failure unchanged (static-grep-without-invocation class flagged on -04 sub-finding, deferred to /audit). **No BE / no schema / no migration / no cascade-on-write refactor.** Counter delta in AUDIT_TRACKER: Medium OPEN 12→10 (-2), Medium FIXED 17→19 (+2), Total unchanged 186. Sprint 26 firing UNCHANGED 15/24 (-02 + -05 are bug-fixes not firing sub-slices, though promoted from refinement-track per Q1=a). **Beta gate**: planning-v2 + objectives.html KR progress + Objective progress + KR status pill all now reflect completed work (closes "1 complete" rollup vs "0% bar" contradiction smoking gun). **Memory rules driving**: `feedback_no_destructive_without_greenlight` (7 Q-gates + scope surface before first edit); `feedback_extend_before_wrap` (extend `ObjectiveCalculator` with optional args + new pure helpers — NOT new RollupService or registry); `feedback_minimal_change_grounding` (3rd-arg backward-compat extension over new-helper proliferation; `getStatusLabel` extended in-place); `feedback_reuse_max` (composes existing `/api/weekly-goals/:krId` endpoint, `calculateKRProgress`, `calculateKRRiskStatus`, `calculateExpectedProgress`); `feedback_audit_governance` (3-stage flag PLAN → CODE → ✅ TESTS atomic in single session — 3-places: Summary counters + comment + Status Matrix rows); `feedback_read_helper_before_consuming` (planning-v2 data-shape verified pre-edit — caught audit's optimistic "tree populated" assumption); `feedback_quote_the_canon` (smoking gun "1 complete" rollup quoted line-by-line in test PART 2 + PART 3 SMOKING GUN assertions). **Quality 9/10** — single-shot ship with zero new collateral on full S26 sweep; pre-edit data-shape grounding saved a partial-fix iteration; backward-compat preserved on every signature extension (no destructive change). 1 commit pending. -->
<!-- 2026-05-20 — /testing (post-hotfix walkthrough + tenant wipe) — 1 audit ID minted no code, then `node scripts/delete-journey-fixture.js` fired (Path A — accept orphan leak per documented A20260518-01 P3 deferral). **A20260520-05** (MEDIUM — KR-AND-OBJECTIVE-PROGRESS-BAR-CASCADE-GAP, deferred refinement-track, companion to A20260520-02). Smoking gun (planning-v2.html screenshot 2026-05-20 post-A20260520-04 hotfix deploy): KR 1 panel header "Weekly Goals · 4 weeks · 0% complete"; sub-rollup "May 2026 · 2 weeks · 2 goals · **1 complete**"; Week 21 (This Week) + Week 22 progress bars both 0%; KR.progress 0%; Objective.progress 0%. Distinction held: -02 = KR.status LABEL stale (cosmetic pill); -05 = KR/Objective/Week PROGRESS BARS stale (functional progress display). Same root cause (no rolled-up child compute on FE planning-v2 render). Likely closed by one shared helper `ObjectiveCalculator.calculateKRProgressFromChildren(kr, goals)` + `calculateObjectiveProgressFromKRs(objective, krs)` per `feedback_extend_before_wrap` — ~30 LoC FE, closes -02 + -05 in one commit, no BE / no schema / no cascade-on-write refactor. **DEFERRED** per user direction "add this bug lets fix it later" — refinement-track. **Tenant wipe results** (`karvia_business_preprod`): cascade by company_id $in [stale 2026-05-18 IDs] = 0 (today's 56a37c/56a38f mismatch — orphans today's Company/Objective/KR/Goal/Task/Team docs per documented leak); **users.deleteMany by email = 5** ✓ (belt-and-braces caught all 5 today's users); post-verify users-matching-emails = 0 ✓. Net DB state: 5 user accounts gone + their owned cascade gone; today's Company + objective docs orphan inertly. Tomorrow's rsm@karvia.ai signup creates fresh tenant unaffected by orphans. **Phases walked**: Phase 1 (-04 closure) implicitly silent-green by user not re-surfacing crash on objectives.html before moving to planning-v2; Phase 2 (-01 grace-window + -03 chore actions) not explicitly walked this session; Phase 3 stopped at Test 3.2 planning-v2 with -05 mint. **Gates 10-12 First Objective Created acceptance closure NOT validated** — Author + Hand-off verbs remain unconfirmed at functional Beta level. 6 pre-walkthrough Q-gates greenlit per `feedback_no_destructive_without_greenlight`. Counter delta: Medium OPEN 11→12 (+1 from -05), Total 185→186 (+1 mint). Sprint 26 firing UNCHANGED 15/24 (-05 bug-fix not firing). Memory rules driving: `feedback_audit_governance` (3-places-atomic mint), `feedback_quote_the_canon` (smoking-gun "1 complete" rollup vs 0% bars quoted line-by-line), `feedback_extend_before_wrap` (fix direction = extend ObjectiveCalculator pattern not new cascade service), `feedback_minimal_change_grounding` (shared helper subsumes -02 + -05), `feedback_no_destructive_without_greenlight` (explicit Path A greenlight before fixture wipe). Next: `/testing` 2026-05-21 fresh-restart from Gate 1 → walk all 12 gates end-to-end with explicit -01/-03/-04 verifies + Gates 10-12 push. Or `/coding` ship shared helper closing -02 + -05 in single ~30 LoC commit (fast win). -->
<!-- 2026-05-20 — /coding-hotfix A20260520-04 PLAN→💻→✅ in single session. **Trigger**: user opened `/pages/objectives.html` as BO post-deploy of earlier 2026-05-20 ship → `Uncaught ReferenceError: objective is not defined` thrown at [objectives.js:584](../../../client/pages/scripts/objectives.js#L584), stack `renderSummaryStats:584 → createObjectiveCard:432 → renderObjectives:252/251 → loadObjectives:61`; page fell back to "No Objectives Yet" empty state for every BO/EXEC/MANAGER with seeded objectives → **Beta-blocker** for first-objective view path. **Root cause** (regression from A20260520-01): the helper-routing edit inside `renderSummaryStats` referenced `objective` but the function signature at [:573](../../../client/pages/scripts/objectives.js#L573) was `renderSummaryStats(keyResults, hasStarted)` — `objective` was never a parameter, and the only call site at [:432](../../../client/pages/scripts/objectives.js#L432) only forwarded `(objective.key_results || [], hasStarted)`. **Why -01 test missed it**: PART 4 at [test:229](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js#L229) static-grepped for literal call text — regex satisfied — but did NOT vm-invoke the function to verify `objective` resolved in scope (static-grep-without-invocation = test design gap; documented inline, NOT minted as sub-ID since fix-class is methodology not code defect). **Impact sweep before edit**: blast radius = 1 site (single call site, single page; planning-v2/dashboard-v2/team-ssi-view/weekly-goals don't consume the helpers yet). 40+ other `objective.` references in objectives.js verified inside functions that explicitly take `objective` as parameter — `renderSummaryStats` was the SOLE missing-param function. **Fix shipped (3 LoC code + ~80 LoC test extension)**: [objectives.js:573](../../../client/pages/scripts/objectives.js#L573) signature → `renderSummaryStats(objective, keyResults, hasStarted = true)`; [objectives.js:432](../../../client/pages/scripts/objectives.js#L432) call site forwards `(objective, …)`; [objectives.js:584](../../../client/pages/scripts/objectives.js#L584) feature-detect guard extended to `if (objective && window.ObjectiveCalculator && …)` so future stale callers without the new arg fall back to legacy threshold instead of throwing. **Test extension PART 7** at [test:286-372](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js#L286): extracts `renderSummaryStats` + dependency `calculateKRProgress` function bodies via regex, evals into vm-sandbox with stubbed `window.ObjectiveCalculator`, invokes under 4 scenarios (populated obj+KRs / empty KRs / null-objective fallback / hasStarted=false) and asserts no-throw + non-empty HTML. Original 6 PARTs still pass; PART 7 adds +14 assertions catching the regression class. Extended test runs **56/56 ✓** (was 42/42). Sibling sweep -20-03 (41) + -18-01 (22) + -18-02 (20) + -18-03 (28) + -18-04 (17) = 128/128 ✓ + this 56 = **184/184 ✓ across 6 scripts** zero collateral. **Severity HIGH not CRITICAL** — no data corruption, no auth bypass; data persisted intact, page just refused to render → empty-state fallback. 3 pre-edit Q-gates greenlit per `feedback_no_destructive_without_greenlight`. Counter flip: High OPEN 12→12 (mint+ship same session), High FIXED 31→32 (+1), Total 184→185 (+1 mint). Sprint 26 firing UNCHANGED 15/24 (-04 bug-fix). Beta gate restored: objectives.html renders cleanly for BO post-deploy. Memory rules driving: `feedback_minimal_change_grounding` (3 LoC + test extension, no redesign); `feedback_extend_before_wrap` (PART 7 extends existing test, NOT new file); `feedback_no_destructive_without_greenlight` (impact sweep before edit, user greenlit "this is a blocker — let's fix it and ship it"); `feedback_test_fixture_validation` (vm-sandbox + extracted function bodies, no Mongoose Model.create); `feedback_quote_the_canon` (stack trace quoted verbatim before scope claim). 1 commit pending push. -->
<!-- 2026-05-20 — /coding double-slice burndown sealed (2 audit IDs A20260520-03 + A20260520-01 PLAN→💻→✅ in single session). **A20260520-03** (HIGH, Beta-blocker) Employee CHORES action buttons — [dashboard-v2.js:493](../../../client/pages/scripts/dashboard-v2.js#L493) `renderChores()` extended with ✓ Complete + ⏸ Postpone per item via `data-chore-action` delegated wiring; NEW `completeChore()` PUTs to existing [/api/tasks/:id/complete](../../../server/routes/tasks.js#L413); NEW `openChorePostponeModal()` reuses postpone modal via `pendingPostponeKind='chore'|'move'` discriminator; `confirmPostpone()` branches on kind (chores → [/api/tasks/:id](../../../server/routes/tasks.js#L247) `{due_date}` only; Task model has no notes/postpone_reason field so reason group hidden via `id="postpone-reason-group"`). Defer dropped per Q1(b) — Tasks have no defer semantic (Move-only). Auth path safe: [moves.js:66](../../../server/routes/moves.js#L66) scopes chores to `assigned_to: userId` → existing employee gate on /complete never 403s. Cascade verified: [tasks.js:441](../../../server/routes/tasks.js#L441) `task.updateStatus('completed')` cascades to goal.progress (response returns `goal_updated.new_progress`) — unfreezes the Beta-blocker. **A20260520-01** (HIGH) Objective at-risk premature color coding — IMPACT ANALYSIS REVERSED initial recommendation: existing `ObjectiveCalculator.countKRsByStatus` had SAME bug as objectives.js (hard `progress >= 70` threshold + only objective-START guard, not elapsed-time guard). Option (c) extract NEW velocity-aware helper was correct path. NEW `ObjectiveCalculator.calculateKRRiskStatus(objective, kr)` at [objective-calculator.js:411](../../../client/pages/scripts/objective-calculator.js#L411) — mirrors `calculateObjectiveHealth` velocity logic but at KR level with two invariants: (1) **grace window** — first 20% of objective duration is NEVER at-risk (closes Week 1/13 smoking gun); (2) **absolute delta not relative ratio** — `delta = actual - expected`, `delta >= -10` is on-track (relative ratio distorts at low expected_progress — that's the trap `calculateObjectiveHealth` still has one level up). NEW companion `countKRRiskStatuses(objective, keyResults)`. objectives.js [:589-606](../../../client/pages/scripts/objectives.js#L589-L606) routes through `window.ObjectiveCalculator.countKRRiskStatuses` with feature-detect graceful-degrade fallback. [objectives.html:1105](../../../client/pages/objectives.html#L1105) loads calculator script BEFORE objectives.js (script ordering verified). Legacy `countKRsByStatus` (consumed by `objective-detail.js`) UNTOUCHED — additive helper only. Q6(a) honored — only objectives.js consumer wired; planning-v2 (-02) stays refinement-track per user direction "fix overall tracking later". **Day totals**: 7 surfaces · ~115 LoC code · ~470 LoC test · **83/83 ✓ new** ([-03 41/41](../../../scripts/test-sprint26-A20260520-03-employee-chore-actions.js) + [-01 42/42](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js)). Sibling sweep: -18-01 (22) + -18-02 (20) + -18-03 (28) + -18-04 (17) + -17-01 (41) + -17-02 (41) = **169/169 ✓** zero collateral; **total 252/252 ✓ across 8 scripts**. 10 pre-edit Q-gates + 1 impact-analysis reversal on Q5 surfaced + greenlit per `feedback_no_destructive_without_greenlight`. Counter flips: High OPEN 14→12 (-2), High FIXED 29→31 (+2), Total unchanged 184 (status migration). Sprint 26 firing UNCHANGED 15/24 (both bug-fix). **Beta gate**: -03 unfreezes Employee cascade; -01 closes day-1-objective-look-failing UX trap (Week 1/13 with 0% now renders "4 on track / 0 at risk" not red). -02 remains refinement-track. 1 commit pending. -->
<!-- 2026-05-20 — /testing (Gates 7-9 + Employee Tasks deep-dive) surfaced 3 audit IDs in 📝 PLAN state — no code touched per `feedback_no_destructive_without_greenlight`. Pre-flight extension to `scripts/delete-journey-fixture.js` (added `manjunath.rs@gmail.com` to EMAILS[] for 5-user wipe scope) was the only edit. Full restart from Gate 1 on `karvia-business-1`. Trust-baselined Steps 1-2 (Consultant signup + 4-tier invite chain — Mailjet emails green) + Steps 5-6 (Step-2 Customize + Default-team — A20260518-03 + A20260518-04 silent-green per user observation). Deep-dive on Gates 7-9 (Objective + Planning-v2 + Employee Tasks) surfaced: **A20260520-01** (HIGH — OBJECTIVE-AT-RISK-COLOR-CODING-PREMATURE, 2 sites) day-1 objective with Week 1/13 renders all 4 KRs RED + "0 KRs on track / 4 at risk" because at-risk logic uses 0% progress without `start_date` elapsed-time check. Fix direction: temporal guard via [ObjectiveCalculator](../../../client/js/objective-calculator.js) extension (A20260514-12 precedent) per `feedback_extend_before_wrap` — option B preferred (shared `calculateRiskStatus` helper across objectives.js + planning-v2.js naturally subsumes -02). **A20260520-02** (MEDIUM — KR-STATUS-LABEL-STALE-ON-PLANNING-V2, deferred refinement-track) KR cards show NOT_STARTED despite Week 21 active with tasks. Likely subsumed by -01 option (B). Per user "fix overall tracking later" → refinement-track. **A20260520-03** (HIGH — EMPLOYEE-DASHBOARD-CHORE-ACTIONS-MISSING, 1 surface) Employee dashboard-v2 CHORES section lists assigned tasks but renders ZERO action buttons — no complete/postpone/defer. Probe-confirmed 16 Tasks have status='todo'; nobody can transition. **Beta-blocker — cascade frozen because Employee cannot act.** Fix direction: add ✓/⏸/⏭ action buttons + wire to existing PUT /api/tasks/:id per `feedback_extend_before_wrap` reusing Move-taxonomy already in dashboard (pushed/forgotten/momentum stats imply transitions exist). **Bonus probe finding**: tasks in tenant link via `task.goal_id` not `task.weekly_goal_id` — confirm canonical field before -03 FE wires. **Probe also flagged (informational, not minted)**: fixture-wipe leak (25 orphan companies / 14 users from prior /testing rounds; current tenant 56a38f clean and isolated; A20260518-01 P3 "wipe-everything-except-consultant" remains the right long-term answer) + user.team_ids/manager_id empty by design (team.members[] one-way storage; FE renders teams correctly). 5 pre-walkthrough Q-gates greenlit per `feedback_no_destructive_without_greenlight`. Net: High OPEN 12→14 (+2 from -01 + -03), Medium OPEN 10→11 (+1 from -02 deferred), Total 181→184 (+3 mints). Sprint 26 firing UNCHANGED 15/24 (all 3 are bug-fix not firing sub-slices). Beta gate: -01 + -03 hard-block (objective-look-failing-on-day-1 + employee-can't-act); -02 cosmetic. Recommended next: `/coding` burndown -01 + -03 (-02 lives in refinement-track until product call). -->
<!-- 2026-05-17 — /coding A20260517-02 mint + 📝→💻→✅ in single session (user-surfaced during /testing replay: Sagar invited essenceofmrs → route returned 201 + User+Invitation persisted BUT email_delivery.delivered=false; FE toast lied "they will receive an email"). 3 surfaces ~55 LoC: BE teams.js + BE invitations.js routes hoist loginLink/loginUrl outside try, capture `let emailSent = true` flag, surface `email_sent: bool` + `login_link: string` in 201 response.data (additive). FE teams.js branches `if (createdNew && emailSent === false && loginLink)` → navigator.clipboard.writeText → 'warning' toast → window.prompt() fallback when clipboard unavailable. Existing-user branch UNCHANGED (no email attempted → no field). 8 pre-edit Qs greenlit per `feedback_no_destructive_without_greenlight` (Q5 a defer Mailjet webhook → A20260517-03 refinement-track). Regression NEW test-sprint26-A20260517-02-email-send-status.js 41/41 ✓ first run; sibling sweep 125/125 ✓ (-17-01 + -16-02 + -15-04 + -13-08a); total 166/166 ✓ across 5 scripts zero collateral. Counter delta: High OPEN 9→9 (mint+ship net 0), High FIXED 25→26, Total 169→170. Sprint 26 firing UNCHANGED 15/24. Beta gate 🟢 — silent-email-failure UX trap closed. 1 commit pending push. -->
<!-- 2026-05-17 — /coding A20260517-01 PLAN → ✅ FIXED in single session (user-surfaced during /testing Gate 4-12 replay, fixed mid-replay per `feedback_why_what_how_when` Beta-quality intent). Scope EXPANDED at impact-analysis stage: **Layer 3 surfaced** (stale role-gate at teams.js:36 blocked Manager from creating teams despite middleware allowing them — explains user's cut-off "if he creates a team it becomes...") + **Q4 expanded from 1 site → 4 sites** (same `isManager` predicate repeated across 5 write routes; uniform fix needed for "seamless teams" intent). Per `feedback_extend_before_wrap` introduced single-source [Team.prototype.isManagedBy()](../../../server/models/Team.js#L256) instance method as the canonical predicate — 4 call sites swap from bare `team.manager_id.toString() === userId.toString()` to `team.isManagedBy(userId)`. New static [Team.findByManagerOrMemberAsManager()](../../../server/models/Team.js#L314) for visibility. 13 predicate-matrix assertions exhaustively cover corner cases incl. defensive null/undefined/empty-string/corrupt-member-subdocs/missing-manager_id paths. Regression 41/41 ✓ + 84/84 sibling sweep = 125/125 ✓ zero collateral. Counter flip: High OPEN 10→9, High FIXED 24→25, Total 169 unchanged. Sprint 26 firing UNCHANGED 15/24. Beta gate 🟢 GREEN — Manager team management seamless across view + create + update + add/remove members + invite-new-user for any team they're either `manager_id` of OR active member-with-role-MANAGER of. 1 commit pending push. -->
<!-- 2026-05-17 — /coding A20260516-02 part 2 sealed (PARTIAL → ✅ FULL FIXED). P3 + Gap 2 closed Consultant→team-member parallel chain. 8 pre-edit Qs greenlit per `feedback_no_destructive_without_greenlight`. **Hidden Gap 2 deeper than expected**: the pre-fix assessment-branch invitation was missing 6 canon fields (user_created/user_id/sent_by/recipient_role/sent_at/status='sent') — would have broken Gap 1's relaxed predicate even with the link fix. Per `feedback_reuse_max` mirrored teams.js:967-986 canon verbatim. 3 surfaces (~25 LoC): (1) Gap 2 always-create canonical invitation at [invitations.js:1807-1846](../../../server/routes/invitations.js#L1807) — collapses 2-state code path into single canonical with conditional `assessment_template_id` spread; 7-day expires_at matches email's "expires_days: 7" copy. (2) P3 link flip at [invitations.js:1860](../../../server/routes/invitations.js#L1860) mirroring P1. (3) Q4 `assessment_sent: !!assessmentTemplate` decoupled from invitation existence at [invitations.js:1891](../../../server/routes/invitations.js#L1891). Test extended PART 5 with 21 new assertions → 46/46 ✓ (was 22/22 at part 1). Sibling sweep 5 scripts + this 46 = 149/149 ✓ zero collateral. Counter flip: Critical OPEN 1→0, Critical FIXED 10→11, Total 168 unchanged (status migration). Sprint 26 firing UNCHANGED 15/24. Beta gate full team-member activation chain 🟢 GREEN. Branch: 2 commits ahead of origin (`e2f097a` part 1 + new part 2 pending push). Quality 9/10 — pre-edit canon-trace caught the 6 missing fields in the assessment-branch BEFORE first edit (would have shipped a fix that still 409'd consultant→team-member chain otherwise); two-slice arc same day; cleanup-boundary pattern executed cleanly. -->
<!-- 2026-05-17 — /coding A20260516-02 PARTIAL ship — BO→Manager + Manager→Employee Beta activation chain sealed. Lean slice per Q1(b): P1 + P2 + **Gap 1 newly-surfaced at Q-gate stage** (3 surfaces, ~7 LoC + ~280 LoC test). **Hidden Gap 1**: handoff plan assumed ~3 LoC across 2 files; pre-edit canon-trace of `invitation-accept.html?token=…` → `/api/invitations/accept/:token` revealed the predicate at [invitations.js:172](../../../server/routes/invitations.js#L172) was over-coupled (`invitation_type IN [company_assessment, company_onboard] && user_created`) — teams.js stamps `invitation_type: 'individual'` so the P1 link fix alone would have 409'd Manager on "User already exists". Per `feedback_extend_before_wrap` relaxed to semantic `invitation.user_created === true` (intent encoded directly in the field), renamed `isCompanyInvitationWithUser` → `isPreCreatedUserInvitation` (3 refs atomic), audited all 4 invitation_types that ever set user_created=true. **Hidden Gap 2 surfaced same trace, deferred** to follow-up slice: invitations.js:1799 `/invite-team-member` only creates Invitation when `send_assessment && template_id` truthy — P3 link fix would reference null `invitation` var without restructuring. 6 pre-edit Qs greenlit per `feedback_no_destructive_without_greenlight` (Q1 b lean / Q2 a drop allowlist / Q3 N/A / Q4 a company.name unconditional / Q5 b defer FE polish / Q6 a surgical preprod wipe — STRING Sounds tenant only, consultant + Karvia Consulting preserved so Gate 4 resumes from Gate 2). Surfaces touched: [teams.js:995](../../../server/routes/teams.js#L995) loginLink → `invitation-accept.html?token=${invitation.invitation_token}` mirroring [consultant.js:573](../../../server/routes/consultant.js#L573) canon; [teams.js:1010](../../../server/routes/teams.js#L1010) team_name → `team.company_id.name` (Welcome-to-Default gone, trade-off acknowledged); [invitations.js:172-213](../../../server/routes/invitations.js#L172) predicate relax + rename + audit marker. NEW [scripts/test-sprint26-A20260516-02-activation-funnel.js](../../../scripts/test-sprint26-A20260516-02-activation-funnel.js) **22/22 ✓** (Part 1 teams.js × 7 + Part 2 /accept predicate × 4 + Part 3 audit markers × 3 + Part 4 anti-regression × 6 covering A20260515-04 + A20260513-08a + A20260512-13 + token-must-exist-before-interpolation invariant). Sibling sweep 13 scripts **417/417 ✓** (zero collateral from rename — no test referenced old identifier). Status PARTIAL per A20260514-11 part-1/part-2 precedent — counters held (Critical OPEN stays 1, Critical FIXED stays 10) until P3 + Gap 2 seal. Sprint 26 firing **15/24** (UNCHANGED — bug-fix not firing sub-slice). Branch: 3 files modified (teams.js + invitations.js + delete-journey-fixture.js retarget) + 1 new test, pending commit. Quality 9/10 — pre-edit canon-trace caught the hidden gap before line 1 of code (saved ~30 min iteration + a broken ship); single-shot ship with zero collateral; honored user's Q1(b) lean stance verbatim; cleanup-boundary pattern applied for P3+Gap 2 deferral (will land same day or tomorrow as part-2). -->
<!-- 2026-05-14 — /coding session (Workstream C continues, 2nd slice) sealed **C.3 — AIOKR review cohort-aware framing (audit A20260514-01 minted at impl time)**. **Pre-edit Q gate**: 4 micro-Qs surfaced + greenlit per `feedback_no_destructive_without_greenlight` (all (a) — minimal-change defaults): Q-C3-1 extend `/api/companies/:id` with additive `cohort: {mode, coach?}` field reusing canonical `cohortDetection.js getAssignedConsultant` predicate per `feedback_extend_before_wrap` + `feedback_reuse_max` (single fetch piggyback, same pattern C.2 used) instead of new `/api/companies/:id/cohort` endpoint or FE-only ConsultantPageMode (which detects viewer not company-cohort) / Q-C3-2 3 variants (`consultant_view`/`bo_consulting`/`bo_self_serve`) covering all real actor.role × cohort.mode scenarios instead of 2-variant collapse losing "reviewing FOR client X" semantic / Q-C3-3 page-local `AIOKR_REVIEW_COPY` const inside `ai-okr-review.js` (copy is page-specific) instead of pollution into `display-labels.js` (label module not page-copy module) or premature shared-module abstraction / Q-C3-4 "your consultant" name fallback when coach name unloaded instead of skipping consulting variant entirely (preserves "you have a consultant" semantic). **3 surfaces touched (~165 LoC + ~210 LoC test)**: (1) [server/routes/companies.js](../../../server/routes/companies.js) — `require('../utils/cohortDetection')` + `getAssignedConsultant(companyId)` call appended to `GET /:id` BEFORE `companyWithMetrics` build; coach reduced to `{_id, first_name, last_name}` (no email/managed_businesses leak); `cohort = coach ? {mode:'consulting', coach:{...}} : {mode:'self-serve', coach:null}`; cohort attached to response as additive field — all pre-C.3 keys (`health_score`/`size_description`/`subscription_status`/`assessment_due`) preserved. Tenant safety: route already validates caller has read access to companyId BEFORE the consultant lookup runs. Errors-logged-never-propagated invariant honored via existing `cohortDetection` contract (lookup failure → null → self-serve fallback). ~30 LoC. (2) [client/pages/ai-okr-review.html](../../../client/pages/ai-okr-review.html) — 4 id'd elements (`page-header-title`/`page-header-subtitle`/`info-banner-title`/`info-banner-body`); baked-in default text retained verbatim and matches `bo_self_serve` variant exactly (test-asserted) → fetch failure leaves page identical to pre-C.3 state. ~4 LoC delta. (3) [client/pages/scripts/ai-okr-review.js](../../../client/pages/scripts/ai-okr-review.js) — `AIOKR_REVIEW_COPY` 3-key frozen const + `COACH_NAME_FALLBACK = 'your consultant'` + `_aiokrCohortCache` module-level cache + `pickCohortVariant(userRole, cohortMode)` pure picker (CONSULTANT → consultant_view; non-CONSULTANT + 'consulting' → bo_consulting; default → bo_self_serve) + `interpolateCopy(template, ctx)` pure substitutor (`{client}` → ctx.clientName || "this client"; `{coach}` → ctx.coachName || "your consultant"; non-string template → '') + `fetchCohortContext()` wrapping `/api/companies/:id` reusing `karvia_auth_token` localStorage convention + `renderCohortAwareCopy()` async fire-and-forget called BEFORE suggestion fetch in `initializeReviewPage` (no copy-flash on slow fetch); test-only `window.__aiokrCohort` export of pure functions. ~135 LoC. **NEW [scripts/test-sprint26-C.3-cohort-framing.js](../../../scripts/test-sprint26-C.3-cohort-framing.js) 65/65 ✓**: 19 STATIC GREP across 3 surfaces (companies.js cohortDetection require + cohort field shape + mode strings + reduced coach payload + additive attachment + pre-C.3 fields preserved; ai-okr-review.html 4 element ids; ai-okr-review.js const + 3 variant keys + 4 helper functions + COACH_NAME_FALLBACK + ACTIVATION_PLAYBOOK §A.3 citation) + 7 PICKER MATRIX (CONSULTANT × any mode → consultant_view; BUSINESS_OWNER × {consulting/self-serve}; EXECUTIVE × consulting → bo_consulting BO-cohort lane; null/undefined → bo_self_serve safe defaults) + 9 INTERPOLATION (placeholder substitution + fallbacks + non-string template + multi-occurrence replacement) + 17 COPY INVARIANT (3 variants × 4 required keys present + frozen + 3 distinct subtitles) + 4 BAKED-DEFAULT PARITY (bo_self_serve.{header_title,header_subtitle,banner_title,banner_body} ↔ HTML inline text byte-equal) + 4 PLACEHOLDER PRESENCE (consultant_view has {client}, bo_consulting has {coach}, bo_self_serve has neither — fetch-independent) + 1 sandbox parse. ~210 LoC. **Sibling regression**: C.2 helper 46/46 ✓ (no drift on display-labels) + `node -e "require('./server/routes/companies.js')"` smoke-load clean. **Architectural invariants preserved**: 4-layer Lego (no JWT swap added; no schema change; no new model writes; FE remains tenant-scoped via existing /api/companies/:id auth gate); additive-only BE response (zero existing-key removal — no consumer breaks); pure-function picker + interpolator (no I/O / no DOM / no globals beyond test-only export); cohort predicate single-sourced — same `getAssignedConsultant` function powers Workstream B dispatchers and now C.3 FE display, so any future cohort-detection refinement (e.g., explicit `Engagement` collection in S27) ripples to BOTH email + UI in one edit. **`feedback_extend_before_wrap` activated**: extended existing `/api/companies/:id` route handler instead of mounting `/api/companies/:id/cohort` (would require new sub-route + route-mount line + duplicate auth pattern). **`feedback_reuse_max` activated**: BE `cohortDetection.getAssignedConsultant` reused verbatim — predicate is the canonical isConsulting-lookup. **`feedback_quote_the_canon` activated**: `pickCohortVariant`/`AIOKR_REVIEW_COPY` cite ACTIVATION_PLAYBOOK §A.3 by name in inline doc-comment so future drift fails the static-grep guard `(a) ACTIVATION_PLAYBOOK §A.3 citation present`. **`feedback_minimal_change_grounding` activated**: HTML markup retained verbatim except 4 id attribute additions; baked-in default text preserves prior copy exactly so JS-mount failure is invisible to the user. **S26 firing**: 14/24 → **15/24** (62.5%) after C.3 — A 4/4 ✅ + B 8/8 ✅ + C **3/5** + D 0/2 + E 4/4 ✅. Workstream C remaining: C.1 (consultant nudge surface, 2d) + C.4 (per-invitee progress widget, 1d). Audit ID `A20260514-01` minted + flipped 📝→💻→✅ in single session per `feedback_audit_governance`. Quality 9/10 — single-shot ship across 3 surfaces with zero collateral on 111/111 sweep (65 new + 46 sibling C.2); pre-edit Q gate eliminated rework; cohort predicate reuse means BE surface area = ~30 LoC. Branch status: now 10 commits ahead of origin pending APP_URL Render verification per A20260512-13 contract. -->
<!-- 2026-05-14 — /coding session (Workstream C continues) sealed **C.2 — 4-case empty-state helper (audit A20260506-06)**. **Pre-edit Q gate**: 4 micro-Qs surfaced + greenlit per `feedback_no_destructive_without_greenlight` (all (a) — minimal-change defaults): Q-C2-1 stage definitions quoted verbatim from `ACTIVATION_PLAYBOOK.md` ball-position lens (Stage 0 = `prospect`+no data; Stage 1 = `onboarding`+data) per `feedback_quote_the_canon` instead of looser interpretations / Q-C2-2 helper exposes all 4 cases (build-once, consume-twice — owner rows fire on `objectives.html`; consultant rows pre-paid for S26 C.1 `client-workspace.html#tab=objectives` consumption per master-plan line 124 "no asymmetric reuse on objectives.html") instead of YAGNI 2-case build / Q-C2-3 reuse existing `/api/companies/:id` reading `Company.stage` + `assessment_scores.last_assessed` per `feedback_reuse_max` instead of new `/stage_bucket` endpoint / Q-C2-4 pure-data signature `{title, body, cta}` matching existing `companyStageView`/`lifecycleView` precedent per `feedback_extend_before_wrap` instead of HTML-emitting helper. **3 surfaces touched (~125 LoC + ~210 LoC test)**: (1) [client/js/display-labels.js](../../../client/js/display-labels.js) — NEW `EMPTY_STATE_COPY` 4-key frozen matrix (`stage_0_owner`/`stage_0_consultant`/`stage_1_owner`/`stage_1_consultant`) + NEW `emptyStateBucket(stage, hasAssessmentData)` predicate (returns `'stage_0'`/`'stage_1'`/null) + NEW `emptyStateView({stage, hasAssessmentData, audience})` selector (audience defaults to `'owner'`, case-insensitive; non-`owner|consultant` → null; non-object args → null; unknown bucket → null — caller falls back to existing static copy). All 3 exported via `DisplayLabels` global + `module.exports` Node branch (matches existing exposure pattern). Inline citation comment references `ACTIVATION_PLAYBOOK.md` ball-position lens. ~70 LoC. (2) [client/pages/objectives.html](../../../client/pages/objectives.html) — empty-state markup converted: `<h3>` → `id="empty-state-title"`, `<p>` → `id="empty-state-body"`, NEW `<button id="empty-state-cta" type="button" class="hidden ...">` (hidden by default; revealed when helper returns CTA). Static fallback copy retained inline so HTML still renders meaningfully if JS fails to mount. ~5 LoC delta. (3) [client/pages/scripts/objectives.js `renderEmptyStateCopy()`](../../../client/pages/scripts/objectives.js) — new async fire-and-forget called at end of `showEmptyState()`. Audience hardcoded `'owner'` per Q-C2-2 (objectives.html is BO-side). NEW `fetchCompanyForEmptyState()` helper with module-level cache `_emptyStateCompanyCache` (avoids re-fetch when toggling between filters that re-trigger empty-state). CTA wiring: `cta_action: 'open_ai_wizard'` → guarded call to in-page `window.openObjectiveWizardModal()` (Stage 1 owner — opens existing AI wizard modal, no navigation away from page); `cta_href` → `window.location.href = ...` (Stage 0 owner → `/pages/assessment-hub.html`). Defensive try/catch leaves static fallback copy intact on any error path (no DisplayLabels global / fetch fails / token missing / JSON parse fails / view returns null). ~50 LoC. **NEW [scripts/test-sprint26-C.2-empty-state-helper.js](../../../scripts/test-sprint26-C.2-empty-state-helper.js) 46/46 ✓**: 15 STATIC GREP (display-labels.js exports + 4 copy keys + canon citation; objectives.html 3 element ids; objectives.js renderEmptyStateCopy call + DisplayLabels.emptyStateView reference + audience='owner' literal + open_ai_wizard handler) + 7 BUCKET PREDICATE matrix (prospect/onboarding × data/no-data + 3 fallback edges + undefined stage) + 13 HAPPY-PATH PAYLOAD (4 cases × {object shape, title/body present, CTA href/action correctness} + distinct-titles invariant) + 9 DEFENSIVE FALLBACKS (null/undefined/string args; unknown stage; unknown audience; audience defaulting; case-insensitivity; truthy/falsy hasAssessmentData coercion) + 3 IMMUTABILITY guards (matrix + each row + each cta sub-object frozen). ~210 LoC. **Sibling regression**: [scripts/test-sprint24-241-tile-and-stage.js](../../../scripts/test-sprint24-241-tile-and-stage.js) **73/73 ✓** with `APP_URL=http://localhost:5000` (existing display-labels consumers — `companyStageView`, `CONSULTANT_BALL_VIEW`, stage-pill rendering — unaffected by additions). **Architectural invariants preserved**: pure helper (no I/O / no DOM / no globals beyond DisplayLabels namespace); HTML stays in HTML (label module remains markup-free per existing precedent); 4-layer Lego floor untouched (no backend route changes / no schema changes / no model changes / no JWT-swap surface); Stage 0/1 predicate is the canon — single edit point if playbook ball-position lens evolves. **`feedback_quote_the_canon` activated**: stage definitions copy-pasted from playbook line 44-45 verbatim (`Company.stage='prospect'`, `Company.stage='onboarding'`) — comment in display-labels.js cites the playbook so future drift fails loudly via static-grep guard `(a) Canon citation present`. **`feedback_reuse_max` activated**: `/api/companies/:id` already loaded by other page paths (e.g., `loadCompanyProfile()` at line 1361) — empty-state piggybacks rather than mounting new endpoint. **`feedback_extend_before_wrap` activated**: extended display-labels module (single existing namespace) instead of introducing new `empty-state-copy.js` module + script tag. **`feedback_minimal_change_grounding` activated**: empty-state HTML markup retained verbatim except the 3 id attribute additions + 1 button — static copy still renders if JS doesn't mount. **S26 firing**: 13/24 → **14/24** (58%) after C.2 — A 4/4 ✅ + B 8/8 ✅ + C **2/5** + D 0/2 + E 4/4 ✅. Workstream C remaining: C.1 (consultant nudge surface, 2d) + C.3 (AIOKR cohort framing, 1d) + C.4 (per-invitee progress widget, 1d). Audit ID `A20260506-06` flipped 📝→💻→✅. Quality 9/10 — single-shot ship across 3 surfaces with zero collateral on 119/119 sweep (46 new + 73 sibling); pre-edit Q gate eliminated rework; helper pre-builds the consultant-view rows so C.1 lands without re-editing display-labels.js. Branch status: now 9 commits ahead of origin pending APP_URL Render verification per A20260512-13 contract. -->

<!-- 2026-05-14 — /coding session #241 (Workstream B CLOSES) sealed **B.5 — handoff #5 dispatcher (Consultant lifecycle digest cron)** completing Workstream B at 8/8 ✅. **Pre-edit Q gate**: 4 micro-Qs surfaced + greenlit per `feedback_no_destructive_without_greenlight` — Q-B5-1 (a) extend existing `preferences.notification_settings` subdoc instead of new parallel `notification_preferences` per `feedback_reuse_max` / Q-B5-2 (a) 24h rolling lookback + skip empty roll-ups per task-digest pattern / Q-B5-3 (a) direct collection reads (Invitation/Assessment/Objective/Goal) tenant-scoped by `company_id ∈ managed_businesses` / Q-B5-4 (a) extend [server/routes/auth.js](../../../server/routes/auth.js) `/me/*` convention instead of new `users.js` per `feedback_extend_before_wrap`. **Drift caught**: page matrix line 42 referenced `server/routes/users.js` which never existed in this codebase (verified via `git log --all --diff-filter=D` empty + no `/api/users` mount in `server/index.js`); structural debt logged as new `RT-AUTH-SPLIT` entry in [REFINEMENT-BACKLOG/README.md](../REFINEMENT-BACKLOG/README.md) sub-bucket A (must-before-Beta count unchanged at 0; nice-after-Beta 12→13). **5 surfaces touched (~480 LoC + ~430 LoC test)**: (1) [server/models/User.js:196-210](../../../server/models/User.js#L196-L210) — +1 field `consultant_lifecycle_digest: Boolean, default: true` extending existing 7-field `notification_settings` subdoc (~5 LoC). (2) [server/jobs/dailyDigestJob.js](../../../server/jobs/dailyDigestJob.js) — `LIFECYCLE_DIGEST_WINDOW_MS = 24h` const + `aggregateConsultantClientActivity(consultant, now)` helper running 4 parallel `Model.aggregate([{$match: {company_id: {$in: companyIds}, <timestamp>: {$gte: windowStart, $lte: now}, ...}}, {$group: {_id: '$company_id', count: {$sum:1}}}])` queries (Invitation.sent_at / Assessment.completed_at + status='completed' / Objective.created_at / Goal.created_at + time_period='WEEKLY') + per-Company name lookup; per-client roll-up rows dropped when all-zero totals; aggregation errors caught + return [] (errors-logged-never-propagated). NEW `getConsultantsForLifecycleDigest()` filters role='CONSULTANT' + status='active' + non-empty managed_businesses + opt-out $or default-true-on-absent gate on `preferences.notification_settings.consultant_lifecycle_digest`. NEW `sendLifecycleDigestToConsultant(consultant, now)` skips empty roll-ups (reason='no_activity'), APP_URL fail-fast per A20260512-13, CTA = `${appUrl}/pages/my-clients.html`. NEW `runConsultantLifecycleDigest(now)` pass mirroring `runAssessmentReminders` stats shape. Added to `runCronTick` `Promise.allSettled([runDailyDigest(), runAssessmentReminders(), runConsultantLifecycleDigest()])` — one pass failing does not block the others. ~210 LoC. (3) [server/services/mailjetService.js](../../../server/services/mailjetService.js) — `MailjetService.prototype.sendConsultantLifecycleDigestEmail` + companion `getConsultantLifecycleDigestTemplate`. Per-client `infoBox` with `(company_name).toUpperCase()` header (matches B.3 infoBox pattern); zero-count event lines skipped from checklist; mock-mode early-return + empty-clients defense-in-depth skip + try/catch envelope returning structured result (never throws). Footer cites "Activation Playbook handoff 5". ~110 LoC. (4) [server/routes/auth.js](../../../server/routes/auth.js) — `GET /api/auth/me/preferences` + `PATCH /api/auth/me/preferences` both `authMiddleware`-gated; PATCH allow-list = 8 declared `notification_settings` fields incl. `consultant_lifecycle_digest`; rejects non-boolean values + empty/unknown-only payloads (400); multi-tenant safe via `req.user._id` only. ~75 LoC. (5) [scripts/test-sprint26-B.5-consultant-digest.js](../../../scripts/test-sprint26-B.5-consultant-digest.js) — NEW regression suite, 26 STATIC GREP + 18 LIVE FIRE = **66/66 ✓**. Coverage: schema field + default-true / window const / 4 model-require lines / Goal time_period='WEEKLY' / Assessment status='completed' / all 4 window-bound + tenant-scoped queries / cron pass + runCronTick wiring / consultant selector (role+status+managed) / opt-out $or gate / APP_URL fail-fast + 4 banned-env-var grep / CTA URL contract / mailjet dispatcher prototype + companion template + mock + empty-clients / template zero-count skip / auth.js GET+PATCH + allow-list + non-boolean reject + empty-payload-400 / aggregator null/undefined/empty-managed paths / dispatcher skip behavior / mailjet mock-mode parity / template render returns string + includes uppercased names + CTA URL + skips zero-count lines / 8 allow-list field assertions. ~430 LoC. **Regression sweep across all 6 B-task suites**: B.1 54/54 + B.2 68/68 + B.3 92/92 + B.4 62/62 + B.5 66/66 + B.6 24/24 = **366/366 ✓**. Smoke-load: all 4 modified modules require cleanly (no syntax/import errors). **Architectural invariants preserved**: APP_URL sole source + no fallback chains + tenant isolation (4× `company_id: {$in: companyIds}` filter) + errors-logged-never-propagated (3 try/catch envelopes in cron pass + aggregator + dispatcher) + cron-driven bypass of notifyTransition per playbook row 5 (handoffs 2 + 5 are cron, not lifecycle-event triggers). **Workstream B math**: 8/8 ✅ COMPLETE — all 5 ACTIVATION_PLAYBOOK dispatchers live, all 3 regression tests landed. **S26 firing**: 13/24 (54%) after B.5 — A 4/4 ✅ + B 8/8 ✅ + C 1/5 + D 0/2 + E 4/4 ✅. Remaining: Workstream C (4 tasks: C.1, C.2, C.3, C.4) + Workstream D triage (D.2, D.3). -->

<!-- Prior 2026-05-14 — /coding session #240 (Workstream B continues) sealed **B.3 — handoff #3 dispatcher (Assessment-aggregate-complete → BO + Coach + team)** with single AI-pilot narrative pass + PX-5.3-style invariant gate + receive-side `<NextStep>` per playbook role recipe. **Pre-edit Q gate**: 4 micro-Qs surfaced + greenlit per `feedback_no_destructive_without_greenlight` — Q-B3-1 (a) predicate = "no outstanding invitations + ≥1 completion" / Q-B3-2 (a) ONE LLM call shared across recipients / Q-B3-3 (a) FE reads `Company.stage_history` for gate (no new endpoint, no new schema) / Q-B3-4 (a) team recipients = role in {EMPLOYEE,MANAGER,EXECUTIVE} × status in {active,pending_invite} (BO excluded — gets BO copy separately). All four (a) accepted user "agree go ahead". **6 surfaces touched (~610 LoC + ~840 LoC test)**: (1) [server/services/OnboardingProgressService.js](../../../server/services/OnboardingProgressService.js) — added `Invitation` model import + post-rollup aggregate-complete evaluation block inside `onAssessmentCompleted` body. Idempotency pre-checked via `stage_history.some(e => e.actor === 'system:aggregate_complete')` before `appendHistoryOnly`. Predicate: `Invitation.countDocuments({company_id, status:{$in:['sent','opened','in_progress']}}) === 0 && completedCount >= 1`. Non-pending invitation statuses (expired/cancelled/bounced) explicitly excluded so a bounced address doesn't trap the company forever. ~30 LoC. (2) [server/services/LifecycleTransitionService.js](../../../server/services/LifecycleTransitionService.js) — new branch in `notifyTransition` body matching `(service='company_stage', historyActor='system:aggregate_complete')` → calls new `dispatchAggregateCompleteEmail(payload)`. Dispatcher: APP_URL fail-fast (A20260512-13 contract), single `generateAggregateNarrative()` call up front so all recipients share the same AI body (Q-B3-2 (a)), three send paths — BO via `primary_contact.email` (fallback to BUSINESS_OWNER User in tenant), Coach gated on `isConsultingMode()`, team enumerate via `User.find({role:$in:[EMPLOYEE,MANAGER,EXECUTIVE], status:$in:[active,pending_invite]})`. Per-recipient try/catch so one bad email doesn't block the others. Also new helpers `validateAggregateNarrative`/`staticAggregateNarrative`/`generateAggregateNarrative` — AI invariant gate (length 80-2000, no debug tokens TODO/FIXME/XXX/console.log/[DEBUG], mirrors PX-5.3 shape but tuned for OUTPUT not prompt). On AI fail OR `FEATURE_OPENAI_ENABLED!=true` → deterministic static narrative derived from rollup scores (names strongest/weakest dimension). Internals exposed for test introspection: `_dispatchAggregateCompleteEmail`/`_generateAggregateNarrative`/`_validateAggregateNarrative`/`_staticAggregateNarrative`. ~280 LoC. (3) [server/services/mailjetService.js](../../../server/services/mailjetService.js) — `MailjetService.prototype.sendAssessmentAggregateCompleteEmail` + `getAssessmentAggregateCompleteTemplate` mirroring B.1/B.2/B.4 pattern. Persona-conditional Subject branched on `recipient_kind` ∈ {'bo','coach','team'}: BO Subject names consultant in consulting mode; Coach Subject `"Client X's team has completed assessments"`; Team Subject `"Thanks — your X team's results are in"`. Template uses `emailTemplates.brandedHeaderTemplate` (CTA renders via existing pipeline; APP_URL invariant ride-along). Persona one-liner inside team variant per `A20260506-07` — MANAGER/EXECUTIVE/EMPLOYEE each gets distinct "What this means" copy. ~170 LoC. (4) [client/pages/team-ssi-view.html](../../../client/pages/team-ssi-view.html) — `<div id="next-step-container">` inserted at top of `#tab-container` parent (above loading state); `/js/next-step.js` loaded BEFORE controller script (same load-order pattern as company-profile.html B.1 wiring). ~5 LoC. (5) [client/pages/scripts/team-ssi-view.js](../../../client/pages/scripts/team-ssi-view.js) — `fetchCompanyDetails()` now sibling-reads `result.company || result.data` into `this.companyDoc` (captures `stage_history` + `stage` for the gate; doesn't disturb the pre-existing `result.data.name` line — minimal-change per `feedback_minimal_change_grounding`). New `maybeRenderAggregateCompleteNextStep()` method called from `init` after fetchCompanyDetails. Bails when marker absent OR `stage==='active'` (handoff #4 owns surface). Role recipes verbatim from playbook lines 195-198: BUSINESS_OWNER/EXECUTIVE → "Generate Objectives →" / `/pages/objective-wizard.html` / non-dismissible; CONSULTANT consulting-mode → "Open Workspace →" / `client-workspace.html?client=<id>#tab=objectives` / non-dismissible; MANAGER → explicit early-return (no inline render); EMPLOYEE → render only when URL carries `?source=email` (informational, dismissible, no CTA). Telemetry keys `next_step.aggregate_complete.{bo,coach,employee}`. ~125 LoC. (6) NEW [scripts/test-sprint26-B.3-aggregate-complete-dispatcher.js](../../../scripts/test-sprint26-B.3-aggregate-complete-dispatcher.js) **92/92 ✓** — 14 static-grep sections + 10 live-fire scenarios via require.cache stubs (no MongoMemoryServer). STATIC covers all 6 surfaces, AI invariant gate constants/logic, playbook canon references (BO/EXEC/CONSULTANT/MANAGER/EMPLOYEE rows quoted), FE wiring + role recipe gates. LIVE-FIRE: (15) consulting + 2 team → 4 sends with correct CTAs + cohort flags + narrative ride-along (proves one LLM call shared across recipients per Q-B3-2 (a)); (16) self-serve + 1 team → 2 sends, no Coach, BO `is_consulting_mode=false` + `consultant_name=null`; (17) wrong historyActor → 0 B.3 sends; (18) APP_URL unset → 0 sends; (19) static fallback narrative shape proves it names company + strongest + weakest dimension + passes own invariant gate; (20) `validateAggregateNarrative` 7 invariant assertions (rejects non-string/empty/short/long/TODO-leak/console.log-leak; accepts well-formed); (21-24) `OnboardingProgressService` predicate scenarios — satisfied→marker fires with correct triggeredById/Kind; outstanding>0→no marker; already-marked→idempotent no re-append; completedCount=0→no marker (zero-completion guard). **Locked design decisions**: (Q-B3-1 a) predicate gates on outstanding-invitations + completion-count, NOT on rollup-non-empty (the OR in matrix line 62 was ambiguous; "rollup-non-empty alone" would fire on the FIRST completion and collide with handoff #2). (Q-B3-2 a) ONE LLM call, narrative shared across BO/Coach/team; persona-conditional opener/closer stays static per A20260506-07. (Q-B3-3 a) FE reads `Company.stage_history` from existing GET /api/companies/:id response — zero new endpoint, zero new schema. (Q-B3-4 a) team-recipient predicate keys on role + status, not on completion-state. **AI invariant gate design**: B3_NARRATIVE_MIN=80 / B3_NARRATIVE_MAX=2000 / B3_DEBUG_TOKENS=['TODO','FIXME','XXX','console.log(','[DEBUG]']. Tuned for OUTPUT (much smaller bounds than PX-5.3's 500-50000 PROMPT bounds). On any validation fail → caller silently swaps to static fallback; refinement-track log entry written via `console.warn`. **Why this slice took the shape it did**: every Q answered (a) — that's not the model accepting weak recommendations, it's grounded engineering: predicate (a) avoids dispatcher collision with handoff #2; AI scope (a) avoids per-recipient prompt fan-out which Q-PB-1 already files for refinement; receive-side (a) honors `feedback_extend_before_wrap` (no new endpoint); team (a) honors `A20260506-07` semantics (team-membership not completion-state is the predicate). **Memory rules honored**: `feedback_reuse_max` (zero new helpers outside the dispatcher itself; reused `companyStageInstance.appendHistoryOnly` + `cohortDetection` + `MailjetService.prototype` + `emailTemplates.brandedHeaderTemplate` + `LLMGateway.complete` + existing GET /api/companies/:id response; `<NextStep>` component verbatim); `feedback_extend_before_wrap` (extended OnboardingProgressService.onAssessmentCompleted body with new try/catch block rather than spinning up a separate aggregate-evaluator; extended notifyTransition with one new `if` branch; extended MailjetService.prototype with one new method+template; extended team-ssi-view.js with one new method); `feedback_minimal_change_grounding` (no new endpoint, no new schema field, no new model, no new collection — the marker rides on existing stage_history; the existing `result.data.name` read site stays untouched even though it's a pre-existing latent bug — sibling-read added defensively for B.3's purposes only); `feedback_no_destructive_without_greenlight` (4 Qs pre-edit, user greenlit "agree go ahead"); `feedback_quote_the_canon` (playbook role recipe rows 195-198 quoted in regression test [12]; matrix line 62 trigger semantics drove Q-B3-1's resolution; A20260506-07 referenced for persona-conditional copy contract); `feedback_audit_governance` (A20260506-07 📝→💻→✅ flipped + A20260513-01 ✅ flipped in same commit with citations; AUDIT_TRACKER summary tally updated). **Full S26 regression sweep — 18/18 scripts green, 644/644 ✓** including new B.3 (92/92) — no collateral on B.1 (54/54), B.2 (68/68), B.4 (62/62), B.6 (24/24), C.5 (43/43), E-workstream all unchanged. **S26 firing 11/24 → 12/24 (50%)** — B.3 closes. **Workstream B 🟡 6/8 → 🟡 7/8** (B.1 ✓, B.2 ✓, B.3 ✓, B.4 ✓, B.6 ✓, B.7 ✓, B.8 ✓; remaining B.5 digest extension only). **Branch status**: 12 commits ahead of origin pending APP_URL Render verification per -13 contract. **Next**: per session-end recommendation, options are B.5 (digest extension + `User.notification_preferences`, ~1d, closes Workstream B fully) OR pivot to C-workstream (consultant surface). My rec: B.5 next — finishes Workstream B before consultant-surface work begins. Quality 9/10 — single-shot ship across 6 surfaces with zero collateral on 644/644 regression; pre-edit Q gate caught the predicate-collision risk + AI scope question cleanly; test rewrite from clearStubs-based to setStub-based caught the Mongoose model recompilation issue cleanly on first iteration; B.4 pattern reused for require.cache stubbing. -->

<!-- Prior 2026-05-13 — /coding session #238 (Workstream B continues) sealed **B.2 (Dispatcher 2 — Assessment-pending reminder cron @ 3/7/13 days) + B.7 (regression test, A20260513-03)** in one commit. **Pre-edit Q gate**: 4 micro-Qs surfaced + greenlit per `feedback_no_destructive_without_greenlight` (Q-B2-1 compute-on-the-fly cadence vs schema pre-pop / Q-B2-2 status filter / Q-B2-3 skip public-link / Q-B2-4 stale fallback chain at Invitation.js:495). User confirmed all 4 + added context: "we need to have a survey link also, for users who are not employees" — reinforces Q-B2-3 (public-link path is a separate flow, no reminder needed; survey function stays, only its fallback chain is the violation). **3 surfaces touched (~310 LoC + ~480 LoC test)**: (1) [server/jobs/dailyDigestJob.js](../../../server/jobs/dailyDigestJob.js) — new `REMINDER_CADENCE_DAYS = [3, 7, 13]` constant + DAY_MS; new `dueReminderTier(invitation, now=new Date())` pure function (counter-gated: tier-i fires when `days_since_sent >= CADENCE[i]` AND `reminders_sent === i`; null beyond tier 2); new `getReminderEligibleInvitations()` with status filter `['sent','opened','in_progress']` + `is_public_link: {$ne:true}` + recipient_email existence guard; new `sendReminderForInvitation(invitation, now)` with APP_URL fail-fast, cohort detection (reuse from B.1), Company name lookup for self-serve copy, CTA = `${APP_URL}/pages/assessment-take.html?invitation_token=<token>` (A20260512-18 verbatim), mailjet dispatch, counter increment via `invitation.sendReminder()` instance method (with in-memory fallback for tests); new `runAssessmentReminders(now)` pass — iterates eligible, collects per-tier stats; new `runCronTick()` combined handler firing `runDailyDigest()` + `runAssessmentReminders()` via `Promise.allSettled` so one failing doesn't block the other; cron init swapped to `runCronTick` (was raw `runDailyDigest`); module exports extended with B.2 internals for test access. ~190 LoC. (2) [server/services/mailjetService.js](../../../server/services/mailjetService.js) — `MailjetService.prototype.sendAssessmentReminderEmail` + `getAssessmentReminderTemplate` mirroring B.1/B.4 pattern; cohort-conditional Subject ("From {consultant_name}" / "Karvia"), tier-conditional urgency framing (tier 0 "reminder" / tier 1 "still waiting" / tier 2 "final reminder — expires tomorrow"); brandedHeaderTemplate reuse; mock-mode early-return on `!this.enabled`. ~120 LoC. (3) NEW [scripts/test-sprint26-B.2-reminder-cadence.js](../../../scripts/test-sprint26-B.2-reminder-cadence.js) **68/68 ✓** — 11 static-grep sections + 15 live-fire scenarios via clock injection + in-memory fixtures + require.cache stubs (no MongoMemoryServer). Pure-function `dueReminderTier` cases prove counter-gated semantics across 8 day/tier permutations including missed-day resilience (day-4 tick fires tier 0); `sendReminderForInvitation` full-flow proves consulting + self-serve payloads, idempotency (same-day re-fire = 0 sends after counter increments), APP_URL fail-fast, query-filter shape capture via Invitation.find stub, tier 0/1/2 passthrough to mailjet payload, CTA composition with token. **Locked design decisions**: (Q-B2-1 b) compute-on-the-fly via existing `sent_at`/`reminders_sent`/`last_reminder_at` schema fields — zero write-side change; `reminder_schedule` array stays in schema but remains unused, deferred as refinement-track optimization. (Q-B2-2) eligible = `['sent','opened','in_progress']`; excludes pending/completed/expired/cancelled/bounced. (Q-B2-3) public-link rows skipped (separate flow per user context). (Q-B2-4) fallback chain at Invitation.js:495 pre-flagged in A20260513-08 row — fixed in next /audit per minimal-change. **Why this slice took the shape it did**: B.2 is genuinely standalone — no new schema field, no new collection, the cadence helper is a pure function easily testable with clock injection. The single architectural decision was the runCronTick wrapper (Promise.allSettled) so digest + reminder passes never block each other — that follows the playbook invariant "errors logged, never propagated" naturally. **Memory rules honored**: `feedback_reuse_max` (existing `sent_at`/`reminders_sent`/`last_reminder_at` schema fields + `invitation.sendReminder()` instance method + cohortDetection + Mailjet.prototype + brandedHeaderTemplate all reused — zero new fields, zero new helpers outside the cron pass itself); `feedback_extend_before_wrap` (extended existing `dailyDigestJob.js` with new pass + new cron tick handler rather than spinning up a separate cron file; extended `MailjetService.prototype` with one new method); `feedback_minimal_change_grounding` (no FE touched, no routes touched, no models touched — pre-flagged Invitation.js:495 fallback chain for /audit rather than fixing in-scope); `feedback_no_destructive_without_greenlight` (4 Qs pre-edit; user confirmed + added context); `feedback_quote_the_canon` (CTA target `assessment-take.html?invitation_token=<token>` quoted verbatim from A20260512-18 fix); `feedback_audit_governance` (A20260513-03 flipped 📝→💻→✅ in same commit; Invitation.js:495 finding pre-flagged in A20260513-08 row for next /audit); `feedback_test_fixture_validation` (live-fire used plain JS objects + require.cache stubs — no Mongoose `Model.create` so no schema drift risk; Invitation stub mirrored real lean() shape — `_id/company_id/recipient_email/recipient_name/invitation_token/sent_at/reminders_sent/last_reminder_at`). **Full S26 regression sweep — 17/17 scripts green** including new B.2 (68/68) — no collateral on B.1 (54/54), B.4 (62/62), B.6 (24/24), C.5 (43/43), E-workstream + audit-IDs all unchanged. **A20260513-03 (B.7 audit ID)** flipped 📝→💻→✅ in this commit per `feedback_audit_governance`. **S26 firing 9/24 → 11/24 (46%)** — B.2 + B.7 close together. **Workstream B 🟡 4/8 → 🟡 6/8** (B.1 ✓, B.2 ✓, B.4 ✓, B.6 ✓, B.7 ✓, B.8 ✓; remaining B.3 aggregate-complete + B.5 digest extension). **Branch status**: now **11 commits ahead** of origin pending APP_URL Render verification per -13 contract. **Next**: per session-end recommendation, options are B.3 (aggregate-complete + AI pilot, heaviest at 2d), B.5 (digest extension + User.notification_preferences, 1d), or pivot to C-workstream (consultant surface, empty-state, AIOKR, progress widget — 4.5d total). My rec: B.3 next — finishes the firing-dispatcher chain (handoffs #1, #2, #3, #4 all live) before the consultant-surface work begins. Quality 9/10 — clean single-shot ship across 3 surfaces; pre-edit Qs caught the schema-pre-pop vs compute-on-the-fly choice cleanly; user context on Q-B2-4 surfaced a real flagged-for-audit finding without scope creep; full sweep 17/17 with B.2 the only addition vs session #237's 16/16. -->

<!-- Prior 2026-05-13 — /coding session #237 (Workstream B continues) sealed **B.4 (Dispatcher 4 send-side — Objective.post-save → Manager + Coach) + B.8 (regression test, A20260513-04)** in one commit. **Pre-edit Q gate**: 4 micro-Qs surfaced + greenlit per `feedback_no_destructive_without_greenlight`; user pushed on Q-B4-1 — flagged that strict `role === 'MANAGER'` gating misses functional-manager cases (a BO can manage a team directly; an EXEC runs a department). **Refined Q-B4-1 to (c)** — discriminator becomes self-vs-author (`owner_id === created_by`) not role, since a BO/EXEC owner with role != MANAGER is still a valid handoff recipient. Role-conditional copy adapts subject between MANAGER "plan it" framing and EXECUTIVE/BUSINESS_OWNER "ownership" framing in the same template. **3 surfaces touched (~280 LoC + ~430 LoC test)**: (1) [server/services/LifecycleTransitionService.js](../../../server/services/LifecycleTransitionService.js) — new inline branch in `notifyTransition()` body matching `(service='company_stage', fromStage='onboarding', toStage='active', actor='system:first_objective_created')` → calls new `dispatchObjectiveHandoffEmail(payload)`; dispatcher resolves Objective via `triggeredById` (kind validated as 'Objective'), enforces APP_URL fail-fast (A20260512-13 contract), loads Company + author User, runs self-vs-author gate `String(objective.owner_id) === String(objective.created_by)`, sends Manager email with role passthrough when owner ≠ author, then conditionally sends Coach audit email when `isConsultingMode(company_id)` (cohort reuse from B.1); each send wrapped in own try/catch so one failure doesn't block the other. ~125 LoC. (2) [server/services/mailjetService.js](../../../server/services/mailjetService.js) — `MailjetService.prototype.sendObjectiveHandoffEmail` + `getObjectiveHandoffTemplate` (mirror of B.1 pattern); recipient_kind branches 'manager' | 'coach'; persona-conditional Subject (role-aware for Manager kind: EXECUTIVE/BO → "ownership" framing; else "plan it" framing); Coach Subject = `{author} at {company} has authored an objective[ and assigned it to {assignee}]`; "From {author_name}" header on Manager email per Q-B4-4 (BO is conceptual sender); "Karvia" header on Coach (system audit message); brandedHeaderTemplate reuse; mock-mode early-return on `!this.enabled`. ~150 LoC. (3) NEW [scripts/test-sprint26-B.4-objective-handoff.js](../../../scripts/test-sprint26-B.4-objective-handoff.js) **62/62 ✓** — 11 static-grep sections + 10 live-fire scenarios via require.cache stubs (no MongoMemoryServer): consulting × MANAGER/EXECUTIVE/BUSINESS_OWNER owner with owner ≠ author proves 2-send shape with correct CTAs; self-assignment → 1 send Coach-only with assignee_name=null; self-serve modes; non-matching tuples (3 axes: actor/fromStage/toStage); APP_URL unset → 0 sends; Objective not found → 0 sends no crash; triggeredByKind wrong → 0 sends. ~430 LoC test. **Locked CTAs from A.4**: Manager → `${APP_URL}/pages/planning-v2.html?objective_id=<id>&source=email` (matrix line 79 verbatim); Coach → `${APP_URL}/pages/client-workspace.html?client=<companyId>#tab=objectives`. **No changes to wizard or objectives routes** — `StageTransitionService.onFirstObjectiveCreated` (called from both [objective-wizard.js:825](../../../server/routes/objective-wizard.js#L825) and [objectives.js:288](../../../server/routes/objectives.js#L288) on `objCount === 1`) already emits the canonical tuple; new branch listens for it. Idempotency comes free from the stage-flip's built-in idempotency (`fromStage: 'onboarding'` guard only fires once). **Memory rules honored**: `feedback_reuse_max` (zero new helpers — reused cohortDetection, MailjetService.prototype pattern, brandedHeaderTemplate, emailTemplates pipeline, existing `notifyTransition()` inline-branch contract from Group 2a); `feedback_extend_before_wrap` (extended `notifyTransition` body with one new `if` branch — no event-bus, no listener registry; extended MailjetService.prototype with one new method); `feedback_minimal_change_grounding` (no FE touched, no routes touched, no models touched — trigger seam already wired at S22a #184e); `feedback_no_destructive_without_greenlight` (4 micro-Qs pre-edit, user refined Q-B4-1 mid-flight); `feedback_quote_the_canon` (Manager CTA pattern verbatim from playbook §B.4 Impl seam which quotes matrix line 79 verbatim); `feedback_audit_governance` (A20260513-04 flipped 📝→💻→✅ in same session); `feedback_test_fixture_validation` (live-fire used pure-JS object stubs with no schema needed, but Objective stub schema mirrored real lean() shape — `_id/title/owner_id/created_by/company_id`). **Full S26 regression sweep — 16/16 scripts green** including new B.4 (62/62) — no collateral on B.1 (54/54), B.6 (24/24), C.5 (43/43), E-workstream (E.1 32/32 + E.2 backfill 26/26 + E.2 rollup 34/34 + E.3 32/32 + E.4 29/29), audit-IDs (-13 18/18, -14 16/16, -15 17/17, -16a 29/29, -17 59/59, -18/-19 9/9, -05/-06/-06b 23/23). **A20260513-04 (B.8 audit ID) and A20260506-05 (B.4 send-side, originally minted at cross-sprint G3b 2026-05-06)** both flipped 📝→💻→✅ in this commit per `feedback_audit_governance`. S26 firing 7/24 → **9/24 (37.5%)** — B.4 + B.8 close back-to-back. Workstream B 🟡 2/8 → 🟡 **4/8** (B.1 ✓, B.6 ✓, B.4 ✓, B.8 ✓; remaining B.2 cron + B.7 cadence test + B.3 aggregate-complete + B.5 digest extension). **Branch status**: now **10 commits ahead** of origin pending APP_URL Render verification per -13 contract. **Why this slice took the shape it did**: B.4 dispatcher is the most isolated of the 5 handoffs (zero FE; trigger seam pre-wired by S22a #184e; idempotency comes free from stage-flip idempotency). The single substantive design decision was Q-B4-1's gate semantics — user-driven refinement from role-based to self-vs-author keeps the door open for BO/EXEC functional management without enumerating role rules. Quality 9/10 — clean single-shot ship across 3 surfaces; pre-edit Qs caught the role-vs-functional-management nuance before code; user refinement landed in 1 round with no rework; full sweep 16/16 with B.4 + B.8 the only changes vs session #235's 15/15 (B.4 + B.8 are the 16th). **Next**: per session-end recommendation in #236 handoff entry, options are B.2 cron (Day 4 of plan, ~1d + B.7 0.25d) or B.3 aggregate-complete + AI pilot (Day 6-7, heaviest task at 2d) or C.1-C.4 surface work. -->

<!-- Prior 2026-05-13 — /strategy session #236 (Workstream A close) sealed **A.4 lock — DRAFT → ACTIVE** for [ACTIVATION_PLAYBOOK.md](../../1-PRODUCT/ACTIVATION_PLAYBOOK.md) (T1-PRD-ACTIVATION-PLAYBOOK). Doc-only commit, zero code touched. **5 micro-Qs surfaced + greenlit pre-edit** per `feedback_no_destructive_without_greenlight` (after user pushed for plain-English restatement — small clarity calls, not architecture changes): (Q-A4-1) lock Q-PB-3 = single-CTA-only; (Q-A4-2) B.4 Manager CTA → `planning-v2.html?objective_id=<id>&source=email` single-hop per matrix; (Q-A4-3) B.3 — Manager gets no inline `<NextStep>` on team-ssi-view; (Q-A4-4) B.3 — Employee inline gated on `?source=email`; (Q-A4-5) dedicated role-aware recipes sub-table in §`<NextStep>` contract. **2 surfaces touched (~130 LoC)**: (1) [ACTIVATION_PLAYBOOK.md](../../1-PRODUCT/ACTIVATION_PLAYBOOK.md) — added §`<NextStep>` "Single-CTA rule" (Q-PB-3 resolved); added §"Role-aware caller recipes — B.3 (now) + B.4 (Sprint 27 receive-side)" sub-table with 4 viewer-role rows for B.3 and 2 for B.4; amended master 5-handoffs row #4 UI affordance column to point Manager at `planning-v2.html` (per matrix line 79 verbatim `"Planning | ★ Manager"` per `feedback_quote_the_canon`); amended §B.4 Impl seam with locked email CTA target + Coach-no-inline rationale; added page co-ownership note to §4 actors table referencing matrix line 77 verbatim; flipped 4/4 A.4 lock checkboxes; flipped Status `🟡 DRAFT` → `✅ ACTIVE` + genome `DRAFT` → `ACTIVE`; struck Q-PB-3 in open questions table with RESOLVED cross-ref; appended changelog row. (2) [PERSONA_STAGE_OWNERSHIP_MATRIX.md](../../1-PRODUCT/PERSONA_STAGE_OWNERSHIP_MATRIX.md) — added forward-reference to ACTIVATION_PLAYBOOK as dynamic-activation companion in §Cross-references; documented compatible-extension rel between matrix's 3-state per-objective ball-state and playbook's 5-state per-company-journey ball-state; bumped genome Updated 2026-05-06 → 2026-05-13. **Matrix contradiction sweep clean (3 findings, 0 blockers)**: (C1 cosmetic) playbook simplified football frame to 1 owner per page vs matrix Dashboard co-ownership → resolved with cross-ref note in §4 actors; (C2 substantive) playbook B.4 Impl seam targeted `objectives.html` (BO-owned) for Manager landing → realigned to `planning-v2.html` (Manager-owned per matrix); (C3/C4 informational) landing-route flag + 3-state-vs-5-state framing — documented as compatible, no contradiction. **`feedback_quote_the_canon` applied throughout**: matrix line 77 (Dashboard co-ownership) + line 79 (Planning ownership) quoted verbatim in playbook amendments, not paraphrased. **`feedback_extend_before_wrap`**: extended existing playbook sections rather than introducing new files; matrix updated in place. **`feedback_minimal_change_grounding`**: 4/4 A.4 criteria met with ~130 LoC across 2 docs, no scope creep into BO step-1-2-3 reframe (user explicitly fell back to original plan mid-session: "lets ignore what we discussed, lets not change anything"). **S26 firing UNCHANGED at 7/24** — A.x is governance scope per page-matrix (Audit ID column = "—"). **Workstream A 🟡 3/4 → 🟢 4/4 ✅ COMPLETE**. **A.4 lock criteria**: 2/4 → **4/4 ✅** at this commit. Branch status: now **9 commits ahead** of origin pending APP_URL Render verification per -13 contract. **Next**: `/coding` to pick up next B-workstream firing task — B.2 (assessment-pending reminder cron + B.7 cadence regression test) is Day 4 of the plan and now fully unblocked. Alternative: `/audit` to close A20260513-08 hardcoding sweep. Quality 9/10 — clean 4/4 close with zero code touched; 5 pre-edit Qs translated to plain English at user request, recommendations accepted; matrix sweep surfaced one substantive realignment (B.4 Manager CTA) caught BEFORE B.4 send-side ships. -->

<!-- Prior 2026-05-13 — /coding session #235 (Workstream C starts) sealed **C.5 — BO assigns owner_id (Manager) during wizard authoring** (audit A20260506-05). Feeds B.4 send-side dispatcher cleanly. **`feedback_reuse_max` win**: grounding revealed 4 of 5 wiring layers already in place — `Objective.owner_id` field, wizard finalize accepts owner_id, WizardState.ownerId, Step 3 dropdown HTML already wired. **The real gap was a single missing endpoint**: wizard called `/api/users/team` which didn't exist (no `/api/users` mount in server/index.js) — fetch returned [] on 404 silently, so today the Owner dropdown only ever showed "You" — BO physically could NOT assign a Manager via the wizard. **5 surfaces touched (~250 LoC + 380 LoC test)**: (1) NEW [server/routes/teams.js `GET /eligible-owners`](../../../server/routes/teams.js) — returns active+pending_invite Managers in caller's tenant + caller themselves (for BO/EXEC to keep ownership); consultant cross-tenant via `?company_id=` mirroring existing GET / route; caller-first sort then alpha; ~95 LoC; (2) [WizardAPI.getEligibleOwners()](../../../client/pages/scripts/objective-wizard.js) — replaces broken `getTeamMembers()`; pulls `company_id` from ConsultantPageMode when in cross-tenant mode; reads `data.data.users`; ~22 LoC; (3) [loadEligibleOwners()](../../../client/pages/scripts/objective-wizard.js) controller — renders is_self + role-aware suffixes ("You (Business Owner)" / "Jane Smith (Manager)"); pre-selects caller; defensive fallback to localStorage user if endpoint returns empty (wizard never finalizes with null owner_id); ~70 LoC; (4) [objective-wizard.html](../../../client/pages/objective-wizard.html) Step 3 — label "Owner" → "Manager (Owner)"; helper text "Assign to a Manager — they'll plan this objective" with aria-describedby wiring; ~8 LoC; (5) [server/routes/objective-wizard.js `/finalize`](../../../server/routes/objective-wizard.js) — strict owner_id validation (Q-C5-2 = b): if owner_id provided and ≠ caller, lookup User and reject if not-found (400 INVALID_OWNER), cross-tenant (403 OWNER_TENANT_MISMATCH), or role not in {MANAGER, EXECUTIVE, BUSINESS_OWNER} (400 OWNER_ROLE_INVALID); self-ownership fast-path skips DB; errors logged + 500 on lookup failure; ~50 LoC. **Pre-edit Q-C5-1/2/3 surfaced + greenlit (a, b, b)**: (1) narrow eligibility — Managers + caller (not all client-side roles); (2) strict validation (rejects EMPLOYEE assignments); (3) "Manager (Owner)" label + helper text. **NEW [scripts/test-sprint26-C.5-owner-id-wizard.js](../../../scripts/test-sprint26-C.5-owner-id-wizard.js) 43/43 ✓** — static-grep (32 checks across endpoint shape, API client, controller, HTML, validation) + LIVE-FIRE Express test (11 checks) with in-memory MongoDB fixture: BO + 2 active Managers + Employee + inactive Manager in tenant A + cross-tenant Manager in tenant B. Verifies: role filter (Employee excluded), status filter (inactive excluded), tenant isolation (cross-tenant Manager invisible), alpha sort (Alex before Mia), caller-first via is_self, Manager-caller sees self+other Manager (dedup), consultant 400 without ?company_id=. **`feedback_test_fixture_validation` activated**: live-fire setup first failed with `User validation failed: password_hash: Path is required` — User schema uses `password_hash` (already-hashed bcrypt), not `password`. Fixed by reading server/models/User.js schema first + supplying $2a$-prefixed value (pre-save hook at User.js:467 skips re-hash for $2a$ prefix). The memory rule fired exactly when its label predicts: pre-fixture schema read prevented a debug loop. **`feedback_extend_before_wrap` activated**: opted to add `GET /api/teams/eligible-owners` as a sibling sub-route under existing `/api/teams/` mount rather than introduce a new `/api/users/` mount (which would have required a new express router file + index.js mount line). **Full S26 regression sweep — 457/457 ✓ across 15 scripts**: 18+16+17+29+59+9+23+54+24+43+32+32+34+26+29. **Audit ID `A20260506-05` flipped 📝→💻→✅** (originally minted at cross-sprint audit S24-S27 Group 3b on 2026-05-06). S26 firing 6/24 → **7/24** (29%). Workstream C ⏳ Pending → 🟡 **1/5** (C.5 ✓; C.1/C.2/C.3/C.4 still pending). Memory rules honored: `feedback_reuse_max` (4/5 layers pre-existing — minimal-change wiring), `feedback_extend_before_wrap` (extended /api/teams/ vs new /api/users mount), `feedback_minimal_change_grounding` (no destructive change to existing finalize logic, validation slice inserted between two existing validation blocks), `feedback_no_destructive_without_greenlight` (Q-C5-1/2/3 surfaced pre-edit with explicit recommendations), `feedback_test_fixture_validation` (User schema read PRE-fixture write caught the password_hash field name), `feedback_audit_governance` (A20260506-05 3-stage flipped with commit citations). **Branch status**: now 8 commits ahead of origin pending APP_URL Render verification per -13 contract. **Next**: per session plan, `/strategy` micro-pass to close A.4 lock (B.3 cross-handoff `<NextStep>` design review + PERSONA_STAGE_OWNERSHIP_MATRIX contradiction sweep, ~0.5d). Quality 9/10 — single-shot ship across 5 surfaces with zero collateral on 457/457 regression; pre-edit Q gate eliminated rework; schema-read caught fixture error pre-debug. -->

<!-- Prior 2026-05-13 — /coding session #234 (Workstream B continues) sealed **B.6 — EMAIL_DEEP_LINK_CONTRACT regression suite (PX-5.1)** + minted-and-shipped **A20260513-07** (DEEP-LINK-CLEANUP, HIGH) in same commit. User direction "no hardcodings of any urls" + "i dont think we need to hardcode anything" overrode my initial conservative allow-list path; full strip + boot fail-fast extension shipped instead. **6 surfaces touched (~440 LoC)**: (1) [LifecycleTransitionService.js:146](../../../server/services/LifecycleTransitionService.js#L146) — B.1 dispatcher CTA destination corrected from `/pages/assessment-hub.html` → `${APP_URL}/pages/company-profile.html?source=email` per EMAIL_DEEP_LINK_CONTRACT §4 row 1 VERBATIM. (2) [company-profile.js](../../../client/js/company-profile.js) — added `shouldRevealNextStep()` with TWO triggers: (i) session-driven first-flip; (ii) email-driven `?source=email` URL param per contract §6 receive-side contract; reveal hook called on initial page load too (not only post-save). (3) Five hardcoded URL fallback chains stripped: [auth.js:537](../../../server/routes/auth.js#L537) (`||` `http://localhost:${PORT||5000}`), [tasks.js:152](../../../server/routes/tasks.js#L152) + [:316](../../../server/routes/tasks.js#L316) (`||` hardcoded prod URL × 2), [teams.js:899](../../../server/routes/teams.js#L899) (`||` `http://localhost:8080`), [dailyDigestJob.js:85](../../../server/jobs/dailyDigestJob.js#L85) (`||` hardcoded prod URL) — all five now `process.env.APP_URL` only. (4) [server/config/index.js:290-302](../../../server/config/index.js#L290) — boot-time `APP_URL` validation **extended from prod-only to ALL envs**; error message cites EMAIL_DEEP_LINK_CONTRACT §1 + tells developer the local-dev value to set (`APP_URL=http://localhost:5000`). (5) Playbook §Implementation seam Handoff #1 corrected — replaced "or equivalent invitation flow entrypoint" paraphrase with VERBATIM quote of contract §4 row 1; receive-side row expanded to explain two reveal triggers (session + email) per contract §6. (6) NEW [scripts/test-sprint26-B.6-deep-link-contract.js](../../../scripts/test-sprint26-B.6-deep-link-contract.js) **24/24 ✓** — STRICT (zero allow-list) grep regression covering: [A] banned env vars `BASE_URL`/`FRONTEND_URL`/`SIGNUP_URL` (with CORS-context exclusion since FRONTEND_URL is legitimately retained for CORS); [B] hardcoded `karvia-business*.onrender.com`; [C] `process.env.APP_URL ||` chains + general `process.env.X || '<url>'` fallback chains; [D] `|| 'http://localhost...'` patterns; [E] legacy `?company=`/`?company_id=`/`?clientId=` in NEW `/pages/` URL builds; [F] `#token=` fragment patterns; [G] `req.host`/`req.hostname` on URL-build lines; [P1] boot validation block fires in ALL envs not prod-only; [P2/P3] B.1 dispatcher URL == contract §4 row 1; [P4] FE handles `?source=email` per §6; [P5] each previously-violating site uses APP_URL only. Out-of-scope filter excludes internal microservice URLs (`*_ENGINE_URL` ports 8081-8084) + CORS config. Plus E.1 regression test env-setup updated with `APP_URL = http://localhost:5000` since boot-validation extension now requires APP_URL on every config load. **NEW memory `feedback_quote_the_canon`** saved + indexed in MEMORY.md — lesson surfaced from this very drift: when writing a derivative doc covering ground a canon doc covers, QUOTE the canon (don't paraphrase) since paraphrase guarantees latent drift. The playbook paraphrase "(or equivalent invitation flow entrypoint)" → shipped wrong B.1 URL one session later. Detection rule baked into the memory: prefatory phrases like "or equivalent X" / "the appropriate Y" / "an X-like surface" trigger a pause + canon check. **B.1 regression test updated** — 3 assertions migrated to new CTA destination (CTA `/pages/company-profile.html?source=email`; reveal-gate now first-flip OR ?source=email; invite_link assertion); 54/54 ✓ post-update. **CLEANUP_ACTIVITIES.md Item #8** transitioned from "ALLOW-LISTED" framing to ✅ FIXED state with before/after diff for each of 5 sites + safety-net citation. **AUDIT_TRACKER row A20260513-07** added — 📝→💻→✅ all in same session per `feedback_audit_governance`. Full S26 regression sweep — **414/414 ✓ across 14 scripts** (18+16+17+29+59+9+23+54+24+32+32+34+26+29) including new B.6 (24/24) + updated B.1 (54/54) + boot-validation guard on E.1 (32/32) + all unchanged audit-ID + E-workstream tests. Boot-validation smoke confirmed: `APP_URL=http://localhost:5000 MONGODB_URI=mongodb://... node -e "require('./server/config')"` boots clean; without APP_URL the config constructor throws the EMAIL_DEEP_LINK_CONTRACT-citing error. **Why-What-How-When framework applied at user request before edits**: Why (real customer pain in JOURNEY_GAP_REPORT 2026-05-08, contract retrofitted at S25 close, regression deferred to ride first dispatcher = B.1 now ✓) → What (lock contract + fix B.1 drift + clean pre-existing fallbacks + extend boot safety net) → How (per memory rules — strict strip beats allow-list once user gave clear direction) → When (now, single commit). **"Why did this happen in the first place" answered explicitly**: (cause A) 5 pre-existing fallback chains predate the contract — historical drift; (cause B) B.1 contract drift = I wrote the playbook AND shipped B.1 same session — paraphrased canon doc instead of quoting it. Memory file captures (B) so it doesn't repeat. Memory rules honored: `feedback_why_what_how_when` (explicit Why → What → How → When walk-through before first edit when user asked); `feedback_minimal_change_grounding` (strict strip is actually MORE minimal than allow-list once user picked the direction — fewer files long-term, no marker maintenance); `feedback_no_destructive_without_greenlight` (surfaced 3 micro-Qs with explicit recommendations BEFORE any edit; pivoted cleanly when user directed "no hardcodings of any urls"); `feedback_extend_before_wrap` (extended existing boot-time validation block per A20260512-13 pattern; extended CLEANUP_ACTIVITIES.md with Item #8 vs new doc); `feedback_reuse_max` (reused existing `errors.push()` + `if errors.length > 0 throw` pattern; reused MailjetService.prototype + emailTemplates pipeline already extended in B.1); `feedback_audit_governance` (A20260513-07 stable ID minted with 3-stage tracking + commit citation + handoff mirror); `feedback_test_fixture_validation` (B.6 regression caught 3 out-of-scope hits on first run — IAM/Planner/Scoring engine URLs + CORS_ORIGIN config — fixed by adding scope filter rather than weakening the assertion); `feedback_quote_the_canon` (NEW — playbook §Impl seam corrected to quote contract §4 row 1 verbatim with cross-ref lock). S26 firing 5/24 → **6/24** (B.6 ✓). Workstream B 1/8 → 🟡 **2/8**. **A.4 lock criteria** unchanged at 2/4 (B.1 ✓ + cohort wired ✓); B.3 cross-handoff `<NextStep>` review + matrix sweep still pending. Branch status: now **6 commits ahead** of origin pending APP_URL Render env-var verification on all 3 services (-13 contract). Quality 9/10 — single commit cleaned 6 surfaces + flipped a memory-rule muscle into a permanent feedback file + zero collateral on 414/414 regression. -->

<!-- Prior 2026-05-13 — /coding session #233 (Workstream B firing tasks start) sealed **B.1 — handoff #1 dispatcher (Profile-complete → BO)**. End-to-end: trigger + idempotency + history-only `notifyTransition` extension + dispatcher branch + email template + `<NextStep>` v1 + regression. 7 surfaces touched (~370 LoC + 380 LoC test): (1) [LifecycleTransitionService.js](../../../server/services/LifecycleTransitionService.js) — history-only path now fires `notifyTransition` with new `historyActor` field; `notifyTransition` body branches on `(service='company_stage', historyActor='system:profile_complete')` → `dispatchProfileCompleteEmail` (recipient: `Company.primary_contact.email` → BO User fallback; CTA built via `process.env.APP_URL` only, fail-safe early-return on missing). (2) [mailjetService.js](../../../server/services/mailjetService.js) — NEW `sendCompanyProfileCompleteEmail` + `getCompanyProfileCompleteTemplate` on `MailjetService.prototype` (same S22a pattern as `sendInvitationLinkEmail`); cohort-conditional Subject + TextPart + HTML body via existing `brandedHeaderTemplate`. (3) [server/utils/cohortDetection.js](../../../server/utils/cohortDetection.js) NEW — `isConsultingMode(company_id)` + `getAssignedConsultant(company_id)` mirroring the `requireManagedClient` middleware predicate (CONSULTANT + status:active + managed_businesses); reusable by B.3/B.4/B.5. (4) [companies.js PUT /:id](../../../server/routes/companies.js#L455) — pre-save snapshot via reused predicate `isCompanyProfileComplete(company)` (verbatim shape from [ai-okr.js:3455](../../../server/routes/ai-okr.js#L3455) per `feedback_reuse_max`); post-save first-flip gate fires `companyStageInstance.appendHistoryOnly({actor:'system:profile_complete', ...})`; idempotency via `stage_history.some(e => e.actor === 'system:profile_complete')` pre-check. (5) [client/js/next-step.js](../../../client/js/next-step.js) NEW — `window.NextStep.render(container, opts)` per playbook §`<NextStep>` contract; internal `escapeHtml` (no load-order dep); telemetry events `next_step.shown`/`cta_clicked`/`dismissed` via `window.dispatchEvent` + `console.debug` trace; dismissible variant. (6) [company-profile.html](../../../client/pages/company-profile.html) + [company-profile.js](../../../client/js/company-profile.js) — `<div id="next-step-container">` inside `#profile-content`, `/js/next-step.js` loaded BEFORE controller; controller snapshots `wasProfileCompleteOnLoad` after fetch; `maybeRenderNextStep()` called in saveProfile success branch, gated on FALSE→TRUE flip + once-per-session (`nextStepRendered` flag); CTA passes `telemetry_key:'next_step.profile_complete.bo'`. (7) NEW [scripts/test-sprint26-B.1-profile-complete-dispatcher.js](../../../scripts/test-sprint26-B.1-profile-complete-dispatcher.js) 54/54 ✓ — static-grep + module-stub fixture (Company/User/mailjetService stubbed via `require.cache` injection) covering: predicate reuse, pre/post-save gates, idempotency scan, history-only payload shape (`historyActor` field, fromStage/toStage:null), dispatcher branch + try/catch, recipient resolution + APP_URL invariant ride-along (A20260512-13 contract holds — no FRONTEND_URL / fallback chain in new dispatcher), MailjetService surface + cohort-conditional Subject/TextPart, cohortDetection predicate mirrors `requireManagedClient`, `<NextStep>` contract (escapeHtml + 3 telemetry events + dismissible), HTML/JS wiring, FE first-flip gating, live-fire dispatch (1 send on matching tuple, 0 on unrelated historyActor, 0 on stage-flip-without-historyActor). Full S26 regression sweep 279/279 ✓ across 13 audit-ID + E-workstream scripts (E.1+E.2 backfill+E.2 rollup+E.3+E.4 + -13/-14/-15/-16a/-17/-18-19/-05-06-06b + B.1). User greenlit Q-B1-1/2/3 = a/a/a pre-edit (primary_contact.email canonical recipient; send email on self-trigger; cohort helper as new utility). Memory rules honored: `feedback_reuse_max` (predicate verbatim from ai-okr.js; emailTemplates pipeline reused; `MailjetService.prototype` extension pattern), `feedback_extend_before_wrap` (extended `companyStageInstance.appendHistoryOnly` + MailjetService + emailTemplates — only NEW modules are cohortDetection (3-handoff reuse) + next-step component (3-handoff reuse) — both justified by playbook's explicit shared-primitive design), `feedback_minimal_change_grounding` (all 7 surfaces additive; zero destructive change), `feedback_no_destructive_without_greenlight` (3 micro-Qs surfaced pre-edit, greenlit before first edit), `feedback_test_fixture_validation` (regression uses static-grep + require.cache stubs, no Mongoose `Model.create` so no schema drift risk). S26 firing progress 4/24 → **5/24** (B.1 ✓). Workstream B status: ⏳ Pending → 🟡 1/8. **A.4 unblocked**: 1st checkbox (B.1 shipped) ✓, 3rd checkbox (cohort detection wired in `server/utils/cohortDetection.js`) ✓ — 2 remaining (cross-handoff `<NextStep>` design review against B.3, matrix-contradiction sweep). Quality 9/10 — single-shot end-to-end ship across 7 surfaces with zero regression collateral, dispatcher live-fire test caught a real cache-stubbing path issue in the first draft, 3 regex test bugs caught on first run + fixed in same session, no rework needed on the production code. Next: `/coding` to ship B.6 (PX-5.1 regression suite for deep-link contract, 0.5d) OR `/strategy` micro-pass to close A.4 lock (B.3 design review + matrix sweep, ~0.5d). -->

<!-- Prior 2026-05-13 — /coding session #232 (Workstream A draft) sealed A.1+A.2+A.3 — NEW [ACTIVATION_PLAYBOOK.md](../../1-PRODUCT/ACTIVATION_PLAYBOOK.md) (T1-PRD-ACTIVATION-PLAYBOOK, DRAFT status, ~doc-only). User picked P1 path (full playbook before B.1) over P2-slim and P3-skip after grounding revealed A.4 dep is real + unmet, `<NextStep>` is shared across B.1/B.3/B.4 (page-impact matrix line 101) so single-design-pass prevents 3 retrofits, and "profile-complete" has no stage flip today so trigger semantics need locked spec. Q-B1-A=(a) — history-only marker on `Company.stage_history` (actor `'system:profile_complete'`); `notifyTransition()` extended to fire on history-only path per the comment hook at [LifecycleTransitionService.js:50](../../../server/services/LifecycleTransitionService.js#L50) ("if a S26 subscriber needs them, the call site can be added on the history-only path with the same payload shape"). Playbook covers: §1 The 5 handoffs master table (trigger/receiver/UI/email/action/completion-signal × B.1-B.5); §2 4-actor football mnemonic (Coach=Consultant/Goalkeeper=BO/Midfield=Manager/Attack=Employee) × 5 ball-positions; §3 Cohort-mode detection (consulting vs self-serve) cited via existing `requireManagedClient` middleware seam (no new predicate); §4 architectural invariants (inline branches per Group 2a, APP_URL sole source, tenant isolation, AI-pilot static fallback); §5 `<NextStep>` component contract designed for B.1+B.3+B.4 reuse with telemetry shape locked; §6 implementation seams keyed to S26 task IDs; §7 A.4 lock criteria (4 checkboxes). Heavy cross-refs to PERSONA_STAGE_OWNERSHIP_MATRIX (canonical companion), EMAIL_DEEP_LINK_CONTRACT, ASSESSMENT_LIFECYCLE. Anti-overreach §: NO event-bus, NO Notification collection, NO per-consultant cadence tuning UI in S26, NO template inheritance. Memory rules honored: `feedback_extend_before_wrap` (referenced existing `requireManagedClient` for cohort detection vs. inventing new predicate; referenced existing `emailTemplates.js` patterns vs. new infra), `feedback_minimal_change_grounding` (playbook is doc-only forward-investment; zero code touched), `feedback_reuse_max` (cited existing Group-2a inline-branch contract, existing `notifyTransition` payload shape, existing `appendHistoryOnly` for handoff #1 trigger). S26 firing UNCHANGED at 4/24 — A.x is governance scope not firing task per page matrix (A.x has Audit ID column = "—"). Workstream A status: ⏳ Pending → 🟡 3/4. Next: `/coding` ships B.1 (handoff #1 dispatcher + `<NextStep>` v1 + history-only `notifyTransition` extension + email template + idempotency gate + regression test). Quality 9/10 — playbook structured to be code-actionable (§6 implementation seams cite file:line + task IDs), A.4 lock criteria explicit so future closure is mechanical, three reframe-options surfaced pre-edit. -->
<!-- Prior 2026-05-13 — /coding Day 3 polish slice: shipped A20260513-05 (EMPLOYEE empty-state gate at [team-ssi-view.js:540](../../../client/pages/scripts/team-ssi-view.js#L540), ~10 LoC FE) + -06 (canonical headline counts for /team-breakdown — non-MANAGER roles compute `total_completed` via `Assessment.distinct('user_id', { company_id, status:'completed', user_id:{$ne:null} })` + `total_members` via `User.countDocuments({ company_id, status:{$in:['active','pending_invite']}, role:{$ne:'CONSULTANT'} })`; both early-return + main response paths consume it; MANAGER keeps team-iteration counts; ~30 LoC BE at [assessments.js:763-789](../../../server/routes/assessments.js#L763-L789) + 809-839 + 974-987) + -06b (/kpi-summary `isPersonalScope = role==='MANAGER'`; BO+EXEC drop `sent_by`, MANAGER keeps it; ~12 LoC BE at [assessments.js:2350-2390](../../../server/routes/assessments.js#L2350-L2390)). Two micro-questions surfaced + greenlit pre-edit: Q1 → members include `pending_invite` (b); Q2 → minimal EMPLOYEE gate, no inline Company Overview patch (a). NEW [scripts/test-sprint26-A20260513-05-06-06b-polish.js](../../../scripts/test-sprint26-A20260513-05-06-06b-polish.js) 23/23 ✓ (anchor + branch-position + helper-intact + canonicalHeadline derivation + role gate + early-return adoption + MANAGER fallback + role-conditional sent_by + no inline regression). Full S26 audit-ID regression sweep 171/171 ✓ (-13/-14/-15/-16(a)/-17/-18-19/-05-06-06b). Route syntax/load check ✓. S26 firing UNCHANGED at 4/24 (polish IDs are governance scope per page matrix). Memory rules honored: `feedback_minimal_change_grounding` (caught `is_active`→`status` schema mismatch in triage one-liner before edit), `feedback_extend_before_wrap` (extended /team-breakdown response builder vs. drafting new aggregator), `feedback_no_destructive_without_greenlight` (surfaced 2 Q's before first edit). Quality 9/10 — schema-grounding caught the field-name error pre-edit, all 3 slices landed in spec'd LoC budget, zero collateral. -->
<!-- Prior 2026-05-13 — /audit session: triaged A20260513-05 + -06 minted yesterday. -05 root REFRAMED (both mint-suspicions REFUTED via grounding in [Invitation.js:135-141](../../../server/models/Invitation.js#L135-L141) + [assessments.js:329](../../../server/routes/assessments.js#L329) + [assessments.js:1631-1640](../../../server/routes/assessments.js#L1631-L1640)) — actual root is init-flow collision: `loadCompanyResults()` at [team-ssi-view.js:99](../../../client/pages/scripts/team-ssi-view.js#L99) runs BEFORE `switchTab('my-results')` at line 113; for EMPLOYEE with empty `Company.assessment_scores` rollup, `showEmptyState()` at line 2295 hides `#tab-container` entirely + reveals page-level `#empty-state` whose "No Assessment Results Yet" copy is IDENTICAL to in-tab `#my-results-empty` (invisible confounder from screenshot). Fix is ~3-5 LoC FE gate at line 540. -06 root CONFIRMED ([/team-breakdown at assessments.js:758-761](../../../server/routes/assessments.js#L758-L761) iterates Team rows; companies with 0 Teams undercount) — canonical data exists at /company-results. Fix ~12-15 LoC BE in /team-breakdown response builder. **Companion split minted as A20260513-06b** — assessment-hub `/kpi-summary` scopes `sent_by: userId` for non-CONSULTANT users → role-condition fix ~6-8 LoC BE. **Pass-2 on -13/-14/-15/-17/-16(a) all ✅**: 6 regression scripts present, APP_URL fail-fast intact. **Tracker hygiene**: Critical OPEN corrected 1→0 (stale row count). Quality 8/10 — both reframes caught upstream root via grounding before any code touched; `feedback_minimal_change_grounding` + `feedback_extend_before_wrap` honored. Next: `/coding` Day 3 polish slice (Slices 1+2+3 + regression script + tracker hygiene; ~0.5d total; S26 firing remains 4/24 — polish IDs not firing tasks). -->
<!-- Prior 2026-05-13 — /strategy session: assessment flow reframe. Two over-engineered framings rejected by user pushback (H1/H2/H3 cohort framework → too speculative; full template-polymorphism reframe → still too aggressive). Locked direction: **Beta = single-template (SSI); future families plug into documented seams already in code; no new collections / fields / FE renames until 2nd family actually scoped**. Deliverable shipped: extended [ASSESSMENT_LIFECYCLE.md](../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) §"Plug-in seams (multi-template forward-compat)" with 7 seams (template definition / scoring framework / rollup dispatch / delivery engine / per-respondent read / company rollup target ⚠️ / FE results view ⚠️), each cited at file:line in current code; anti-overreach guard rails (no AssessmentCohort, no cohort_id, no team-ssi-view rename, no Company.assessment_scores generalization until triggers fire); Q8 entry amended to reflect as-shipped reuse of `Assessment.assessment_type` (E.3 / A20260512-08) per `feedback_reuse_max`. Per memory `feedback_extend_before_wrap`: extended existing canonical doc (T2-ARC-023) rather than create a sibling. **Two Beta-polish bugs minted as A20260513-05 (Employee "View Results" → blank `team-ssi-view.html?tab=my-results`; suspected `?assessment=<id>` param carries assignment_id not Assessment._id) + A20260513-06 (`team-ssi-view.html` KPI header "0/0 Completed" while `/company-results` returns 3 real respondents — suspected wrong source)**. Both stay under SSI scope; ~5-20 LoC each. Next: `/audit` to triage suspected roots + pass-2 on -13/-14/-15/-17/-16(a). Then `/coding` to fix. S26 firing UNCHANGED at 4/24 (strategy + polish IDs are governance scope, not firing tasks). Quality 8/10 — two reframe rounds caught early via user pushback, exactly the `feedback_minimal_change_grounding` + `feedback_extend_before_wrap` muscle the memory system is meant to build. -->
<!-- Prior 2026-05-13 — /coding (S26 Day 2 Slice 2 — Path B convergence) sealed A20260512-16(a) re-scoped from "add CTA ~25 LoC" to "make `team-ssi-view.html` the canonical results page" per user direction "this becomes the core of all the results; we don't have to build anything new, just play with FE". Shipped FE-only: NEW 5th tab "My Results" with score cards + weak areas + empty state; EMPLOYEE block at team-ssi-view.js:86 REMOVED; role-aware tab matrix (EMPLOYEE: My Results + read-only Company Overview; MANAGER + Teams; BO/EXEC all 5; CONSULTANT hides My Results); EMPLOYEE Company Overview synthesizes from `/api/companies/:id` `assessment_scores ÷ 10` (no new endpoint — `feedback_extend_before_wrap` honored); `assessment-results.html` retired from 566 LoC → 54-line redirect shim with legacy `?id=` → `?tab=my-results&assessment=` mapping; 3 callers migrated (assessment-take.html post-submit + assessment-hub.html × 2). Zero backend touch. NEW [scripts/test-sprint26-A20260512-16a-canonical-results.js](../../../scripts/test-sprint26-A20260512-16a-canonical-results.js) 29/29 ✓ (markup + access + tab matrix + redirect shim + caller migration). Full session regression 56/56 ✓ (29 new + 9 -18/-19 + 18 -13 contract). Polish deferred: tab label "My Results" stays generic when Mgr+ views team-member assessment (minor UX nit, not Beta blocker). S26 firing still UNCHANGED at 4/24 (governance + convergence scope, not firing tasks). -->
<!-- Prior 2026-05-13 — /coding (S26 Day 2 Slice 1 — closing yesterday's ledger) sealed 2 audit IDs: A20260512-18 (URL drift on `/pages/assessment.html` across EMAIL_DEEP_LINK_CONTRACT §4+§5 + live code at invitations.js:1833 — scope expanded from "doc-only" to doc+code+param-name when grounding revealed live welcome-email 404; -18 fix points all 3 sites at `assessment-take.html?invitation_token=`) + A20260512-19 (mint+ship same session — removed dead `/pages/assessment-form.html` empty-state CTAs from objectives.html + ai-okr-review.html per user direction "no backward loop, forward-only journey assessment→results→objectives→planning", + retired orphan client/pages/business-assessment.html 388 LoC). NEW regression `scripts/test-sprint26-A20260512-18-19-deadlinks.js` 9/9 ✓ (zero `/pages/assessment.html` + zero `/pages/assessment-form.html` in governed dirs ARCHIVE-excluded; positive guards on invitations.js + contract §4 + §5 + removed CTAs + business-assessment.html file-gone). Yesterday's -13 contract regression 18/18 ✓ no breakage. Path B convergence plan locked at session-start (make `team-ssi-view.html` the canonical results page; A20260512-16(a) re-scoped from "add CTA" to "5th tab + role-aware default-tab matrix + retire assessment-results.html to redirect shim") — deferred to Slice 2 (next /coding session) to keep this commit's narrative tight. S26 firing UNCHANGED at 4/24 (-18/-19 are governance scope, not firing tasks). -->
<!-- Prior 2026-05-12 — /close #225 sealed. Session shipped 4 audit IDs across 3 commits (cfca7d6 -13+-14 / 29033f4 -15 / 5cad710 -17) — EMAIL_DEEP_LINK_CONTRACT enforcement + Team Results latest-per-user dedup + existing-user invitation → login-redirect flow + SSI canonical shape contract `UnifiedSSIScoringService.toCanonicalShape(ssiResult)`. NEW memory `feedback_extend_before_wrap.md` saved after user-corrected façade overreach on -17 (proposal shrank from new SSIService+registry+adapter to ONE additive method on existing canonical service). Also delivered 5-finding routing/scoring audit (F1-F5) with -16(a) + -18 proposed but NOT yet implemented (next session). 226/226 ✓ regression. S26 firing UNCHANGED at 4/24 (today's IDs are governance/contract scope, not firing tasks). `development` now 4 commits ahead of origin — push pending Render `APP_URL` env-var verification on all 3 services. Quality 8/10 (one notch below #224's 9/10 due to -17 façade-overreach friction caught by user pushback). -->
<!-- Prior 2026-05-12 — /coding #224 (S26 Day 1): E.2 + E.1 + E.3 + E.4 SEALED — Workstream E fully closed (4/4 firing). E.4 scope narrowed mid-session: grounding revealed Q5+Q12 full canonical contract (latest-per-PERSON + role-weighted + role-change/delete triggers) NOT wired today; E.4 was sized 0.25d (test only) so test ships against today's reality + canonical gap logged in REFINEMENT-BACKLOG. 263/263 ✓ across full E-workstream regression sweep. A20260512-02 + A20260512-01 + A20260512-08 + A20260512-11 all 📝→💻→✅. S26 firing progress 0/24 → 4/24. Preflight Q9 manual still pending before SEC-7 🟢. -->
<!-- Prior 2026-05-12 — /strategy #222: Consultant Cockpit philosophy why-audit + S26/S27 milestone ladder shipped. 2 NEW docs (1 philosophy, 1 roadmap addendum). S26 task scope UNCHANGED (24 firing). 6 future improvement candidates I-01..I-06 deferred post-Beta, cross-linked to 7 Q-PHIL-XX open questions. S26 success criterion LOCKED: 9 clients × 5 team members × correct SSI → Beta launches. -->
<!-- Prior 2026-05-12 — /audit session: plan verdict 🟢 GREEN, scorecard 8.4/10. 4 findings (A20260513-01..04). Amendments landed: page-matrix B.3 dep + impl reorder (E.1+E.2 before B.3). Verdict doc: SPRINT26_PLAN_AUDIT.md. Plan cleared for /coding. -->
<!-- Prior 2026-05-12 — /strategy session added Workstream E (Assessment Aggregation Reliability, 4 tasks). Q5-Q13 locked in ASSESSMENT_STRATEGY_SESSION_INPUT.md. ASSESSMENT_LIFECYCLE.md (T2-ARC-023) is canonical reference. Scope: 18 → 22 firing tasks. A20260512-01 repurposed from auth bug to aggregation mismatch. -->

**Status**: 🟢 ACTIVE — launched 2026-05-12 after Sprint 25 /close #230. Plan audit 🟢 GREEN 2026-05-12 ([SPRINT26_PLAN_AUDIT.md](SPRINT26_PLAN_AUDIT.md), scorecard 8.4/10).
**Sprint Goal**: First Objective Created (Stages 0 → 2 stitched end-to-end)
**Total Tasks**: **24 firing** — A (4) + B (8) + C (5) + D (3) + **E (4)**. Decomposition in [SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md). Estimated ~13 working days (E parallelizes into Days 1-2; B.7/B.8 land same-day as B.2/B.4 — no calendar growth post-audit decisions).

---

## Launch Gate ✅ (all green at S25 /close #230)

Sprint 26 starts only when Sprint 25 has shipped:
- [x] Single-write cascade enforced (PX-3.6 macro + slice 1-3 #219-221; PX-3.10 regression 38/38 ✓)
- [x] `notifyTransition()` helper wired into `StageTransitionService` entry points (PX-2.2 #210, inline helper, no event-bus)
- [x] `EMAIL_DEEP_LINK_CONTRACT.md` authored (PX-5.1 #230)
- [x] `BETA_LAUNCH_CHECKLIST.md` + prompt regression fixture suite + refinement-backlog split (PX-5.2 + PX-5.3 + PX-5.4 #228/#230)
- [x] All Phase-1 verification questions answered (#209)
- [x] Sprint 25 acceptance criterion met (45/45 firing sealed)

---

## Workstreams

| Workstream | Tasks | Status |
|---|---|---|
| A — The Playbook (`ACTIVATION_PLAYBOOK.md`) | A.1-A.4 (4) | 🟢 **4/4 ✅ COMPLETE** — A.1+A.2+A.3 shipped 2026-05-13 (DRAFT); A.4 locked 2026-05-13 /strategy #236 (DRAFT → ACTIVE): Q-PB-3 resolved single-CTA, role-aware recipes table for B.3 + B.4, B.4 Manager CTA realigned to `planning-v2.html` per matrix, matrix sweep clean |
| B — Dispatch + Bridges (5 handoff handlers, 3 fully + 1 send-side + digest extension + 3 regression tests) | B.1-B.8 (8) | 🟢 **8/8 ✅ COMPLETE** — **B.1 shipped 2026-05-13** (handoff #1 dispatcher, 54/54 ✓) + **B.6 shipped 2026-05-13** (PX-5.1 regression STRICT + A20260513-07 in same commit, 24/24 ✓) + **B.4 + B.8 shipped 2026-05-13 #237** (handoff #4 send-side: Manager + Coach dispatcher; Q-B4-1 self-vs-author gate; 62/62 ✓; A20260513-04 + A20260506-05 flipped) + **B.2 + B.7 shipped 2026-05-13 #238** (handoff #2 reminder cron @ 3/7/13 days: counter-gated on-the-fly cadence reusing existing schema fields; tier-conditional + cohort-conditional copy; 68/68 ✓; A20260513-03 flipped) + **B.3 shipped 2026-05-14 #240** (handoff #3 aggregate-complete dispatcher: predicate "no outstanding invitations + ≥1 completion" via Q-B3-1 (a); single AI-pilot narrative across BO/Coach/team per Q-B3-2 (a) with PX-5.3-style invariant gate + static fallback; FE `<NextStep>` per playbook role recipes; 92/92 ✓; A20260506-07 + A20260513-01 flipped) + **B.5 shipped 2026-05-14 #241** (handoff #5 consultant lifecycle digest: 3rd pass in `dailyDigestJob.js` via `runConsultantLifecycleDigest` + `aggregateConsultantClientActivity`; 4 event sources in 24h rolling window per Q-B5-2 (a) + Q-B5-3 (a); `User.preferences.notification_settings.consultant_lifecycle_digest` extends existing subdoc per Q-B5-1 (a) `feedback_reuse_max`; `GET/PATCH /api/auth/me/preferences` extends auth.js `/me/*` convention per Q-B5-4 (a) — `routes/users.js` carved out via REFINEMENT-BACKLOG `RT-AUTH-SPLIT`; 66/66 ✓; A20260506-08 flipped) |
| C — Activation Surface (consultant initiate/monitor/nudge + BO polish) | C.1a, C.1b, C.2-C.5 (6 after split) | 🟡 **4/6** — **C.5 shipped 2026-05-13** (BO assigns Manager owner_id during wizard, 43/43 ✓ + feeds B.4) + **C.2 shipped 2026-05-14** (4-case empty-state helper, 46/46 ✓) + **C.3 shipped 2026-05-14** (AIOKR cohort-aware framing — 3 variants, 65/65 ✓) + **C.1a shipped 2026-05-14** (Consultant workspace honesty pass — 5 audit IDs A20260514-02..-06 SEALED: My Clients tile SSI hotfix + Risk diagnosis tuple + Objectives KPI rationalization (CONSTRAINT canonical / DRIVERS→OWNERSHIP / VELOCITY→BALL POSITION) + Summary 5→4-card simplification + Plan 4→3-card simplification; **118/118 ✓ regression across 5 new scripts**). **C.1b** (nudge action layer) remains DEFERRED. **C.4** (per-invitee progress widget) pending. |
| D — Triage / Carryover (D.1 RETIRED 2026-05-12; PX-2.5/2.7 re-eval + prompt-regression gate) | D.2-D.3 (2 active) | ⏳ Pending |
| **E — Assessment Aggregation Reliability** (NEW 2026-05-12 /strategy — fixes A20260512-01/-02/-08/-11; unblocks B.3 + flips SEC-7 Beta gate) | E.1-E.4 (4) + preflight | 🟢 **4/4 + Q9 ✅** — E.2 ✓ + E.1 ✓ + E.3 ✓ + E.4 ✓ #coding 2026-05-12; **Preflight Q9 ✅ 2026-05-15** (user manual smoke on `karvia-business-1`: logged in as `stringsounds@gmail.com` BO of Legacy Succession, sent + completed assessment, SSI=6 rendered correctly on my-clients tile = canonical `Company.assessment_scores ÷ 10` = Sagar's individual score, single-user math chain verified end-to-end). **Q12 multi-user role-weighted-rollup gap** (10-user hypothetical → would show 10th-submitter's score not weighted avg) confirmed still matching REFINEMENT-BACKLOG Sub-bucket A entry (audit IDs A20260512-11 + A20260512-14); no new audit ID needed. SEC-7 evidence row ready when `BETA_LAUNCH_EVIDENCE_LOG.md` is created at launch prep. |

Full decomposition: [SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md). Canonical reference: [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md).

---

## Acceptance Test

Both Path A (consulting) + Path B (self-serve) complete the 5-verb test (Onboard / Engage / Diagnose / Author / Hand-off) with zero out-of-band intervention.

---

## Architectural Invariants

See [SPRINT26_MASTER_PLAN.md §Architectural Invariants](SPRINT26_MASTER_PLAN.md#architectural-invariants-verify-at-every-session-close).

---

## Open Questions — RESOLVED at kickoff 2026-05-12

| # | Question | Resolution |
|---|---|---|
| Q1 | Email content tone per cohort | **Different copy** — same template, persona-conditional helper (same pattern as `A20260506-07`). Consulting names the consultant; self-serve does not. |
| Q2 | Reminder cadence for assessment-pending | **Default 3 / 7 / 13 days** (1 day before default 14-day expiry). Per-consultant tunability via `User.notification_preferences` **deferred out of S26** to refinement track. |
| Q3 | AI pilot fallback threshold | **Reuse PX-5.3 prompt regression invariants** — length sanity (500-50000 chars) + leaked-debug-strings + identity-line present. On fail → revert to static template, log to refinement track. |
| Q4 | Per-invitee progress widget placement | **Both surfaces** — My Clients tile (consultant glance) + `team-ssi-view.html` (deep view). |

---

## Carry-Forward from Sprint 25 ✅ (verified at kickoff)

- ✅ `notifyTransition()` helper wired (PX-2.2 #210) — S26 lands 4 transition emails on top (B.1-B.4)
- ✅ `EMAIL_DEEP_LINK_CONTRACT.md` shipped (PX-5.1 #230) — Workstream B consumes URL parameter shape; B.6 lands the regression suite
- ✅ `BETA_LAUNCH_CHECKLIST.md` shipped (PX-5.2 #230) — referenced for acceptance gating
- ✅ Prompt regression fixture suite shipped (PX-5.3 #230, 504/504 ✓) — D.3 gates close if `server/prompts/` touched
- ✅ Single-write KR cascade enforced (PX-3.6 macro + PX-3.10 38/38 ✓)
- ✅ Legacy WEEKLY backfill tested + pre-prod execution clean no-op
- 📋 KR-aggregation formula documented in [KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md](../../2-TECHNICAL/KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md) — Sprint 27 consumes
- ⚠️ `A20260512-01` HIGH OPEN (consultant assessment-view auth bug) — S26-D.1 owns triage Day 1

### Phase-2 deferrals carried into S26 triage

- **PX-2.5** (FE wire-up for KR regen on standalone objectives page): demoted #209 because BE endpoint is wizard-session-bound, not usable for saved Objectives. S26-D.2 decides if any S26 task needs it built; otherwise refinement track.
- **PX-2.7** (`ssi-questions-library.json` retirement): deferred #210 — dormant seed-path is not a Beta blocker. Refinement track.

---

## Audit History

Audit IDs that amended this sprint. Update flags as work advances. Master tracker: [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md).

| ID | Source | One-liner | 📝 | 💻 | ✅ |
|---|---|---|---|---|---|
| `A20260530-01` | /strategy + /coding 2026-05-30 (mint + ship same session — Objective Completion Engine Phase 1 — playbook persistent-nudge invariant + eligible-owners scope fix + LTS self-nudge variant) | **SHIPPED — OBJECTIVE-COMPLETION-NUDGE-LAYER-PLAYBOOK-AMENDMENT (4-part bundle + LTS self-nudge).** Playbook P1+P2+P3+P4 documented at [ACTIVATION_PLAYBOOK.md](../../1-PRODUCT/ACTIVATION_PLAYBOOK.md). Eligible-owners endpoint at [teams.js:230-271](../../../server/routes/teams.js#L230) expanded role filter to `$in:['MANAGER','EXECUTIVE']` + ROLE_RANK sort key. LTS dispatcher at [LifecycleTransitionService.js:507-545](../../../server/services/LifecycleTransitionService.js#L507) — pre-amendment `if (!ownerIsAuthor)` skip removed; recipient_kind branches on ownerIsAuthor; ?author_owns=true CTA flag for receive-side hero. mailjet `sendObjectiveHandoffEmail` gains `author_self_nudge` branch with 2-option framing. Receive-side `<NextStep>` 3-variant hero ships in Sprint 27 part 2 (same audit ID). **Test**: NEW [test-sprint26-A20260530-objective-completion-engine-phase1.js](../../../scripts/test-sprint26-A20260530-objective-completion-engine-phase1.js) **68/68 ✓** + [test-sprint26-B.4-objective-handoff.js](../../../scripts/test-sprint26-B.4-objective-handoff.js) **68/68 ✓** (migrated). | ✓ #strategy-2026-05-30 (mint) | ✓ #coding-2026-05-30 (playbook + eligible-owners + LTS self-nudge + mailjet template) | ✓ #coding-2026-05-30 (68/68 ✓ + 68/68 ✓ migrated B.4) |
| `A20260530-02` | /strategy + /coding 2026-05-30 (mint + ship same session — Objective Completion Engine Phase 1 — persistent-nudge cron) | **SHIPPED — OBJECTIVE-STALL-PERSISTENT-NUDGE-CRON.** NEW cron pass `runObjectiveStallReminders()` in [dailyDigestJob.js:509-731](../../../server/jobs/dailyDigestJob.js#L509) mirroring B.2 `runAssessmentReminders` pattern. Fires 5-tier reminders at 3/7/14/21/30 days for `Objective.status='active' AND no WeeklyGoal under any KR`; tiers 3+4 cc Consultant (escalation); after tier 4 `reminder_exhausted_at` stamped, owner-side silent, indefinite in consultant digest. 4 surfaces: Objective model 3 additive optional fields + cron pass + 5-tier mailjet template + consultant digest stall extension (B.5 `aggregateConsultantClientActivity` extended with stallAgg → `needs_followup_count` → "Needs Your Follow-up" section). Sprint 27 Phase 2 mints WeeklyGoal-stall + Task-overdue companion crons (A20260530-03..-04) + receive-side hero + re-delegation CTA + self-cancel CTA (A20260530-05..-06). **Test**: same NEW script — 68/68 ✓ covers PARTs 5-10 + [B.5](../../../scripts/test-sprint26-B.5-consultant-digest.js) **66/66 ✓** (migrated: agg count 4→5 sources). | ✓ #strategy-2026-05-30 (mint) | ✓ #coding-2026-05-30 (4 surfaces — see Description) | ✓ #coding-2026-05-30 (68/68 ✓ + 66/66 ✓ migrated B.5) |
| `A20260528-01` | /testing 2026-05-28 (mint, surfaced while debugging Path A walkthrough script Invitation DB lookups) | **PLAN — LOW — CLEANUP-SCRIPT-FIELD-NAME-DRIFT (1 surface, 4 LoC).** `scripts/cleanup-rsm-tenant.js:113-114 + :151-152` by-user-ref guard uses wrong field names (`invited_by` / `invited_email` instead of canonical `sent_by` / `recipient_email` per [Invitation.js model](../../../server/models/Invitation.js)). Cascade-by-company_id sweep at line 27 + 138-143 catches all same-tenant invitations (which is why /testing 2026-05-26 + 2026-05-28 wipes ran clean), but by-user-ref secondary guard is a no-op — would orphan-leak cross-tenant invitations. **Severity LOW** — secondary defense-in-depth bug; primary cascade sweep correct. **Fix direction (deferred to next /coding session)**: 4 line edits + test extension. Companion: A20260518-01 P3 cleanup-target "wipe-everything-except-consultant" work would subsume this fix — user picks tactical vs architectural at next /coding. | ✓ #testing-2026-05-28 (mint) | ⏳ next /coding | ⏳ pending |
| `A20260527-02` | /strategy 2026-05-27 (pre-mint, 4-RP Objectives Page session) → /coding 2026-05-28 (mint+ship same /coding session — scope widened from 1 site to 4 via pre-edit sibling-sweep audit) | **SHIPPED — KR-row palette sibling-sweep** (MEDIUM, 4 sites — closes A20260526-01 + the remaining sibling-sweep miss class from A20260520-01/-02/-05). NEW canonical `ObjectiveCalculator.getKRRowColorTokens(status, hasStarted)` at [objective-calculator.js:203](../../../client/pages/scripts/objective-calculator.js#L203) — 4-state map matching `calculateKRRiskStatus` output vocabulary; consolidates legacy 5-bucket palette (amber 40-69% band collapsed). Consumed at: (1) [objectives.js:586-606](../../../client/pages/scripts/objectives.js#L586) `renderKR` in card preview (the originally-scoped -26-01 surface); (2) [objectives.js:1211-1213](../../../client/pages/scripts/objectives.js#L1211) `renderKeyResultRow` in detail modal (sibling-sweep miss #1); (3) [objective-detail.js:329-338](../../../client/pages/scripts/objective-detail.js#L329) `renderTopKeyResults` (sibling-sweep miss #2); (4) [objective-detail.js:240](../../../client/pages/scripts/objective-detail.js#L240) counter swap `countKRsByStatus` → `countKRRiskStatuses(objective, …)` (sibling-sweep miss #3). Option A scope-decision greenlit at pre-edit Q-gate per `feedback_read_helper_before_consuming` (the EXACT lesson A20260526-01 minted) — one audit ID covering full class instead of deferring 3 future mints. Each site retains legacy threshold fallback for graceful degrade when objective/helper absent. NEW [scripts/test-sprint26-A20260527-02-kr-row-palette-sweep.js](../../../scripts/test-sprint26-A20260527-02-kr-row-palette-sweep.js) **53/53 ✓** (7 PARTs — helper surface + vm-sandbox 8-state matrix + 4 site signatures + fallback paths + anti-regression). Sibling sweep -20-01 (56/56 ✓) + -20-02/-05 (69/69 ✓) zero collateral. | ✓ #strategy-2026-05-27 (pre-mint) + ✓ #coding-2026-05-28 | ✓ #coding-2026-05-28 | ✓ #coding-2026-05-28 |
| `A20260527-01` | /strategy 2026-05-27 (pre-mint) → /coding 2026-05-28 (ship + tests same session) | **SHIPPED — POST /api/objectives strict owner_id** (MEDIUM). NEW gate at [server/routes/objectives.js:159](../../../server/routes/objectives.js#L159) returns `400 'owner_id is required'`; silent `|| userId` fallback removed at Objective construct (line 220) AND krSpecs ownerForKR (line 192). Pre-edit blast-radius audit confirmed both production POST callers ([objectives.html:1673](../../../client/pages/objectives.html#L1673) manual modal — client-validates owner; [okr-creation-wizard.js:648](../../../client/pages/scripts/okr-creation-wizard.js#L648) — sends from required UI field) send owner_id; direct-write paths (`objective-wizard.js` finalize writes Objective model directly; `ai-okr.js` 4 sites) bypass the POST endpoint and retain their own `|| userId` fallback untouched per `feedback_minimal_change_grounding` — each direct-write path owns its own invariant scope. Aligns POST endpoint with C.5 wizard finalize's strict gate per A20260506-05 (single contract semantics). NEW [scripts/test-sprint26-A20260527-01-objectives-route-owner-id-strict.js](../../../scripts/test-sprint26-A20260527-01-objectives-route-owner-id-strict.js) **16/16 ✓** (5 PARTs — gate landed in correct order + fallback removed + client callers verified + direct-write paths preserved + other gates unchanged). | ✓ #strategy-2026-05-27 (pre-mint) + ✓ #coding-2026-05-28 | ✓ #coding-2026-05-28 | ✓ #coding-2026-05-28 |
| `A20260527-03` | /strategy 2026-05-27 (pre-mint) → /coding 2026-05-28 (ship + tests same session) | **SHIPPED — Cascade vocabulary normalization** (LOW, 6 user-facing strings). "weekly milestones" → "weekly goals" per [CASCADE_MIGRATION_STATE.md:113-114](../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md#L113-L114) canon (locked /strategy 2026-05-27). 5 sites in [planning.html](../../../client/pages/planning.html) (alerts 989/1041/1066/1930 + description template 1132) + 1 site in [planning-v2.html:1720](../../../client/pages/planning-v2.html#L1720) (modal helper text). Dev JSDoc at planning.html:905 explicitly preserved per canon enumeration (not user-facing). Historical Goal-model `.description` rows ("Weekly milestone N") retain legacy string — non-breaking drift accepted. NEW [scripts/test-sprint26-A20260527-03-cascade-vocabulary-normalization.js](../../../scripts/test-sprint26-A20260527-03-cascade-vocabulary-normalization.js) **12/12 ✓** (5 PARTs — all 6 strings landed + JSDoc preserved + zero milestones outside dev comments + canon-citation invariant). | ✓ #strategy-2026-05-27 (pre-mint) + ✓ #coding-2026-05-28 | ✓ #coding-2026-05-28 | ✓ #coding-2026-05-28 |
| `A20260520-05` | /testing 2026-05-20 (post-A20260520-04 hotfix walkthrough; mint + DEFERRED per user direction "add this bug lets fix it later") | **PLAN — DEFERRED to refinement-track** (MEDIUM, companion to A20260520-02). planning-v2.html progress bars don't reflect completed work — KR panel "Weekly Goals · 4 weeks · 0% complete" but sub-rollup "May 2026 · 2 weeks · 2 goals · **1 complete**"; Week 21 (This Week) + Week 22 progress bars both 0%; KR.progress 0%; Objective.progress 0%. Cascade gap from completed weekly goal → KR.progress / Objective.progress doesn't propagate to FE render. Distinct from -02 (label-stale): -05 is progress-bar-stale. Same root (no rolled-up child compute on FE) — option (A) shared helper `calculateKRProgressFromChildren` + `calculateObjectiveProgressFromKRs` per `feedback_extend_before_wrap` closes BOTH -02 + -05 in one ~30 LoC FE change when work resumes. Pre-flight at /coding: query Goal.progress before/after Employee chore complete to determine if Task→Goal cascade fires (then FE-bubble only needed) or Task→Goal cascade is also broken (then read tasks tree directly). | ✓ #testing-2026-05-20 (mint) | ⏳ refinement-track | ⏳ refinement-track |
| `A20260520-04` | /coding-hotfix 2026-05-20 (mint + ship same session — regression from A20260520-01 ship 6h prior) | **SHIPPED — objectives.html render crash hotfix** (HIGH, Beta-blocker). User opened objectives.html as BO post-deploy → `ReferenceError: objective is not defined` thrown at [objectives.js:584](../../../client/pages/scripts/objectives.js#L584) → page fell back to empty state for every BO/EXEC/MANAGER with seeded objectives. Root cause: A20260520-01 added `countKRRiskStatuses(objective, keyResults)` call inside `renderSummaryStats` but never threaded `objective` through the function signature `(keyResults, hasStarted)` at [:573](../../../client/pages/scripts/objectives.js#L573) or the call site `(objective.key_results || [], hasStarted)` at [:432](../../../client/pages/scripts/objectives.js#L432). Why -01 test missed it: PART 4 static-grepped for literal call text without vm-invoking the function under DOM — static-grep-without-invocation false-negative class. Fix (3 LoC code + ~80 LoC test): signature → `renderSummaryStats(objective, keyResults, hasStarted = true)`; call site forwards `(objective, …)`; feature-detect guard extended to `if (objective && …)` so future stale callers fall back to legacy threshold instead of throwing. **Test extension PART 7** at [test:286-372](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js#L286) extracts `renderSummaryStats` + `calculateKRProgress` function bodies via regex, evals into vm-sandbox with stubbed `window.ObjectiveCalculator`, invokes under 4 scenarios (populated/empty/null-obj fallback/hasStarted=false) and asserts no-throw + non-empty HTML — catches this regression class going forward. Extended test runs **56/56 ✓** (was 42/42 pre-extension; +14 new assertions). Sibling sweep -20-03 (41) + -18-01 (22) + -18-02 (20) + -18-03 (28) + -18-04 (17) = 128/128 ✓ + this 56 = **184/184 ✓ across 6 scripts** zero collateral. Severity HIGH not CRITICAL — no data corruption, no auth bypass; data persisted intact, page just refused to render → empty-state fallback. 3 pre-edit Q-gates greenlit per `feedback_no_destructive_without_greenlight`. Counter flip: High OPEN 12→12 (mint+ship same session), High FIXED 31→32 (+1), Total 184→185 (+1 mint). Sprint 26 firing UNCHANGED 15/24 (-04 bug-fix). Beta gate restored: objectives.html renders cleanly for BO post-redeploy. Sub-finding documented inline (NOT minted as -04b): regression-test design gap likely affects other S26 test scripts; full sweep belongs in next /audit session. | ✓ #user-surfaced (mint) + ✓ #coding-hotfix-2026-05-20 | ✓ #coding-hotfix-2026-05-20 (objectives.js:573/432/584) | ✓ #coding-hotfix-2026-05-20 (56/56 ✓ + 128/128 ✓ sibling) |
| `A20260518-05` | /audit 2026-05-18 (CI/PROCESS-GATE-POSTURE process audit) | **CRITICAL — DEV-CI-GATE-MISSING**. [.github/workflows/test.yml:116,159](../../../.github/workflows/test.yml#L116) `security-tests` + `e2e-tests` jobs `if:`-gated to pre-prod/production only. Paid users on karvia-business-1.onrender.com receive every push to `development`; only unit + integration run on dev. Existing `test:multi-tenant`/`test:golden-path`/`test:consultant` scripts ready but unused on dev pushes. Fix: add `development` to `if:` clauses; reuse existing test scripts per `feedback_reuse_max` (no new test code). **Blocked by -08** (deploy fires parallel to CI without dashboard gate — workflow becomes red badge, not stop). | ✓ #audit-2026-05-18 | — | — |
| `A20260518-06` | /audit 2026-05-18 | **HIGH — LINT-DECORATIVE**. [test.yml:272](../../../.github/workflows/test.yml#L272) `continue-on-error: true` silences lint; baseline `npm run lint` = 24 errors + 562 warnings. Fix: two-phase — Phase 1 `npm run lint:fix` (auto-fixes 18) + manual fix 6 remaining → commit; Phase 2 remove `continue-on-error: true`. Reverse-order blocks first push on 24 errors with no recovery. | ✓ #audit-2026-05-18 | — | — |
| `A20260518-07` | /audit 2026-05-18 | **HIGH — PRECOMMIT-DEV-UNGUARDED**. [.git/hooks/pre-commit:15](../../../.git/hooks/pre-commit#L15) only checks `production`; `development` has no commit-level guards; audit-ID convention voluntary not enforced. Fix: extend hook to add `development` branch case requiring `A20260[0-9]{6}-[0-9]+` in `feat(`/`fix(` commits touching `server/`/`client/`/`tests/`. `--no-verify` bypass exists by design — pair with -08 for actual enforcement. | ✓ #audit-2026-05-18 | — | — |
| `A20260518-08` | /audit 2026-05-18 | **HIGH — RENDER-DEPLOY-BYPASS (load-bearing)**. Render dashboard for karvia-business-1 auto-deploys on every push to `development` regardless of CI workflow result. No `render.yaml` in repo → dashboard-only config. Even after -05/-06/-07 land, deploy fires in parallel → workflow becomes red badge not stop. **User-only action required** (agent cannot edit Render dashboard). Single load-bearing finding — without it the entire chain is decorative. Fix: (A) "deploy after Actions success" (Pro/Team plan), or (B) disable auto-deploy + add Action step to trigger deploy on CI pass. | ✓ #audit-2026-05-18 | — (user action) | — |
| `A20260518-09` | /audit 2026-05-18 | **MEDIUM — TRACKER-SUMMARY-DRIFT**. [AUDIT_TRACKER.md:60](../../2-QA-AND-TESTING/AUDIT_TRACKER.md#L60) Summary table lagged journal by 3 days pre-this-audit; Critical OPEN oscillated 0→1 on 2026-05-16 → 1→0 on 2026-05-17 without intermediate table update. Currently in sync by coincidence (baseline). Fix: /close-time invariant "Summary date = latest comment date". This /audit's tracker write closes the immediate drift. | ✓ #audit-2026-05-18 | — | — |
| `A20260518-10` | /audit 2026-05-18 | **MEDIUM — AUDIT-SKILL-PATH-WRONG**. `.claude/commands/audit*` cites `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/AUDIT_TRACKER.md` but tracker actually at `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md` (no `/QA/` subdir). Future /audit Step 0 may skip mandatory tracker-load. Fix: one-line edit in skill doc + grep `.claude/` for other doc citing wrong path. | ✓ #audit-2026-05-18 | — | — |
| `A20260518-11` | /audit 2026-05-18 | **LOW — CI-NO-TIMEOUT-BUDGET**. No `timeout-minutes` on any job in [test.yml](../../../.github/workflows/test.yml); no baseline duration captured. Adding -05's 3 jobs changes feedback latency ~3-5min → ~10-20min unmeasured. Fix: add `timeout-minutes: 10` per job; track median for 1 sprint to establish baseline. | ✓ #audit-2026-05-18 | — | — |
| `A20260517-02` | /testing replay 2026-05-17 (mint, user-surfaced — essenceofmrs got no email after Sagar invite) → /coding 2026-05-17 (ship — same session) | **SHIPPED — Silent email-failure UX trap closed across both invitation routes + FE copy-link fallback** (HIGH). Mid-/testing diagnosis: route returned 201 OK + User+Invitation persisted, but `email_delivery.delivered=false` (Mailjet send silently swallowed by try/catch). FE toast lied "they will receive an email" → activation dead-end. 3 surfaces (~55 LoC): BE [teams.js:1006-1064](../../../server/routes/teams.js#L1006) + BE [invitations.js:1854-1903](../../../server/routes/invitations.js#L1854) — `loginLink`/`loginUrl` hoisted outside try; `let emailSent = true` flag flipped to `false` in catch; 201 response.data gains additive `email_sent: bool` + `login_link: string`. FE [client/pages/scripts/teams.js:866-905](../../../client/pages/scripts/teams.js#L866) branches when `createdNew && emailSent === false && loginLink` → `navigator.clipboard.writeText` → `'warning'` toast → `window.prompt()` fallback when clipboard unavailable. Existing-user branch UNCHANGED (no email attempted → no `email_sent` lie). 8 pre-edit Qs greenlit per `feedback_no_destructive_without_greenlight` (Q5 a defer Mailjet webhook → A20260517-03 refinement). NO new schema, NO new endpoints, NO new shared modules; additive response fields only. Regression NEW [test-sprint26-A20260517-02-email-send-status.js](../../../scripts/test-sprint26-A20260517-02-email-send-status.js) **41/41 ✓** (7 BE teams + 6 BE invitations + 8 FE branching + 5 vm-sandbox FE decision matrix + 12 anti-regression spanning -16-02 + -17-01 + -15-04 + -13-08a + existing-user invariant). Sibling sweep -17-01 (41) + -16-02 (46) + -15-04 (28) + -13-08a (10) = 125/125 ✓ + this 41 = **166/166 ✓ across 5 scripts**, zero collateral. Counter delta: High OPEN 9→9 (net 0 mint+ship), High FIXED 25→26, Total 169→170. Sprint 26 firing UNCHANGED 15/24. Beta gate 🟢 — inviter sees real outcome + auto-copied activation link to share via Slack/SMS/in-person when Mailjet degraded. | ✓ #testing-2026-05-17 + ✓ #coding-2026-05-17 (mint) | ✓ #coding-2026-05-17 | ✓ #coding-2026-05-17 (41/41 ✓ + 125 sibling) |
| `A20260517-01` | /testing replay 2026-05-17 (mint, user-surfaced) → /coding 2026-05-17 (ship — scope EXPANDED at impact-analysis stage from 2 layers → 3) | **SHIPPED — Manager team management seamless across 3 layers** (HIGH, Beta UX activation). 3 surfaces (~32 LoC): **Layer 3** [teams.js:36](../../../server/routes/teams.js#L36) — stale role-gate fixed: added `MANAGER` to in-body allowlist to match `requireRole` middleware contract (explains user's cut-off "if he creates a team it becomes..." — it was becoming a 403). **Layer 1** [teams.js:316](../../../server/routes/teams.js#L316) — visibility fixed: new [Team.findByManagerOrMemberAsManager](../../../server/models/Team.js#L314) helper via `$or: [{manager_id: userId}, {members: {$elemMatch: {user_id, role: 'MANAGER', status: 'active'}}}]`. **Layer 2** (4 write sites: PUT /:teamId + POST /:teamId/members + DELETE /:teamId/members/:userId + POST /:teamId/members/create-user) — single-source [Team.prototype.isManagedBy](../../../server/models/Team.js#L256) instance method replaces bare `team.manager_id.toString() === userId.toString()` everywhere. DELETE /:teamId stays admin-only (intentional). GET /:teamId already isMember-aware (unchanged). 6 pre-edit Qs + 1 impact-analysis amendment greenlit per `feedback_no_destructive_without_greenlight` (Q4 expanded 1 site → 4 sites uniform fix; Q2 1-LoC MANAGER allowlist; Q3 helper per `feedback_extend_before_wrap`; Q5 NEW test; Q7 PLAN→FIXED counter flip). Regression NEW [scripts/test-sprint26-A20260517-01-manager-team-management.js](../../../scripts/test-sprint26-A20260517-01-manager-team-management.js) **41/41 ✓** (13 predicate matrix incl. 5 defensive paths + 6 query shape + 4 Layer 3 + 7 Layer 2 + 8 anti-regression). Sibling sweep -16-02 (46) + -15-04 (28) + -13-08a (10) = 84/84 ✓ + this 41 = **125/125 ✓ across 4 scripts**, zero collateral. test-sprint22-epic-c-phase3 fails identically pre-fix (env config issue, not regression — git-stash reproduced). Counter flip: High OPEN 10→9, High FIXED 24→25, Total 169 unchanged. Beta gate Manager team management 🟢 GREEN — closes "seamless teams" Beta activation requirement. | ✓ #testing-2026-05-17 (mint) + ✓ #coding-2026-05-17 (scope expansion) | ✓ #coding-2026-05-17 | ✓ #coding-2026-05-17 (41/41 ✓ + 84/84 sibling) |
| `A20260514-11` (part 2) | /strategy #240 (mint) → /coding B3a 2026-05-14 (parts 1-3 ✅) → /coding B3c 2026-05-16 (part 2 ✅ + ARCH-DB-002 bundled) | **FULL SHIP — Sibling non-overlap validator (B3c, backend-only)** + `ARCH-DB-002` closure. NEW `validateGoalNoOverlap(candidateGoal, company_id)` at [goals.js:40-130](../../../server/routes/goals.js#L40-L130) mirroring `validateGoalDateHierarchy` pattern: Rev 1 QUARTERLY-only scope (WEEKLY siblings explicitly allowed to overlap — work-unit layer); Rev 2 NEW compound index `{objective_id:1, time_period:1, start_date:1}` at [Goal.js:341-346](../../../server/models/Goal.js#L341-L346) (ONE new, not extension — mongoose syncIndexes absent per canon footnote); Rev 3 grandfathering guard skips when `parent.time_period_type !== 'custom'`. Wired into POST /quarterly + PUT /quarterly/:id (mirrors B1.4 dateCheck pattern; PUT gate fires only when `start_date` or `due_date` was touched; helper self-excludes on PUT via `_id $ne` query). Q1 (a) backend-only — A20260514-13 (Window CRUD UI) **deferred** since B3b shipped min-amendment per user "really really simple, no redesign". Validator still has organic consumers (every POST/PUT /quarterly flow). Q3 (a) — POST /quarterly/bulk NOT wired (pre-existing dateCheck gap there too; refinement-track). Bundles `ARCH-DB-002` from /audit-architecture A20260515-03 — new compound index closes project-mode index gap (zero new scope per canon Rev 2). **Pre-flight 2026-05-16** `scripts/db/verify-goal-schema-relaxation.js` against preprod: 0 overlapping pairs / 4 QUARTERLY-with-dates → strict-from-day-one safe. 8 pre-edit Qs all greenlit (a) per `feedback_no_destructive_without_greenlight`. Regression NEW [scripts/test-sprint26-A20260514-11-part2-validateGoalNoOverlap.js](../../../scripts/test-sprint26-A20260514-11-part2-validateGoalNoOverlap.js) **37/37 ✓** (goals.js static × 16 + Goal.js static × 4 + vm-sandbox overlap math × 9 + live-fire Express+stubbed-Mongoose × 6). Part-1 sibling [scripts/test-sprint26-A20260514-11-window-name-route.js](../../../scripts/test-sprint26-A20260514-11-window-name-route.js) flipped per `feedback_cleanup_boundary_pattern` (TODO-exists → TODO-gone + validator-present + Rev-3-guard-live); still 23/23 ✓; final label PARTIAL → FULL. Sibling sweep: -09 (24/24) + -10 (PASS) + -14-12 (37/37) + -16-01 (30/30) + -15-04 (28/28) + -15-02 (79/79) + -14-07 (43/43) + -14-08 (52/52) = **373/373 ✓ total** across 10 scripts. **Sprint 26 firing 14/24 → 15/24** (B3c = 1 of 4 B3 sessions per canon §4.1). | ✓ #strategy-240 (mint) + ✓ #coding-B3c-2026-05-16 (Rev 1+2+3 finalized) | ✓ #coding-B3a-2026-05-14 (parts 1-3) + ✓ #coding-B3c-2026-05-16 (part 2) | ✓ #coding-B3c-2026-05-16 |
| `ARCH-DB-002` | /audit-architecture A20260515-03 (mint) → /coding B3c 2026-05-16 (closed inline with A20260514-11 part 2 per canon §3.2b Rev 2) | **FIXED — Project-mode index gap closed.** `Goal.quarter`/`year` relaxation (A20260514-10) had left index coverage gap for date-range queries on `objective_id + time_period + start_date`. New compound index landed at [Goal.js:341-346](../../../server/models/Goal.js#L341-L346) covers validateGoalNoOverlap sibling lookup + future date-range queries (Window CRUD UI fetch, dashboard `windows_ending_in_14d` aggregator). ONE new index per canon Rev 2 (not extension — mongoose lacks syncIndexes). Zero new scope per remediation plan §52. | ✓ #audit-architecture-2026-05-15 | ✓ #coding-B3c-2026-05-16 (bundled with A20260514-11 part 2) | ✓ #coding-B3c-2026-05-16 |
| `A20260516-01` | /audit-architecture A20260515-03 sign-off (Critical ×2 promoted) → /coding 2026-05-16 mint+ship same session | **SHIPPED — AI Orchestrator hardening, 2 parts** (closes Critical findings `ARCH-AI-001` + `ARCH-AI-002` before Beta-2). **P1** ([AIContextService.js:2196-2219](../../../server/services/AIContextService.js#L2196-L2219)): Cross-tenant cache key isolation — tenant prefix lifted from `params.company_id \|\| params.companyId` at the call site; `_stableKey` stays pure serializer; missing tenant → `'no-tenant'` sentinel + `logger.warn`. All 3 callers (objectives/weekly-goals/moves) verified pass `company_id` today. **P2** ([objective-wizard.js:265,413,543](../../../server/routes/objective-wizard.js#L265)): 3 LLM routes (`/refine-objective` + `/generate-krs` + `/regenerate-kr`) gained `requireRole(['CONSULTANT','BUSINESS_OWNER','EXECUTIVE'])` between `verifyToken` and async handler. Role set matches [LLMPolicy.OPS['objective-creation']](../../../server/services/LLMPolicy.js#L46). `/initialize-session` + `/finalize` remain `verifyToken`-only by design (non-LLM). ARCH-MW-001 ai-okr.js:3400 bundle NOT included per Q1 (a) — scoped per handoff #246. 7 pre-edit Qs all greenlit (a) per `feedback_no_destructive_without_greenlight`. Regression [scripts/test-sprint26-A20260516-01-ai-orchestrator-hardening.js](../../../scripts/test-sprint26-A20260516-01-ai-orchestrator-hardening.js) **30/30 ✓** (P1 static × 7 + P1 vm-sandbox cache-key matrix × 6 + P2 static × 9 + P2 real-middleware behavior matrix × 6). Sibling sweep 316/316 ✓ across 9 audit-ID scripts (-15-04/-15-02/-14-12/-14-11/-14-10/-14-09/-14-08/-14-07/-13-08a). | ✓ #audit-architecture-2026-05-15 (mint via -03 sign-off) + ✓ #coding-2026-05-16 | ✓ #coding-2026-05-16 | ✓ #coding-2026-05-16 |
| `A20260515-03` | /audit-architecture 2026-05-15 (post-A20260515-02 quality checkpoint before B3c opens) | **AUDIT CHECKPOINT — Sprint 26 4-Layer Lego sweep over OKR Creation Flow + Cohort-Aware Framing**. 4 parallel Explore agents (FE/MW/DB/AI-O) catalogued **25 findings** (3 Critical + 8 High + 10 Medium + 4 Low) across [audit/](audit/) folder — 5 deliverables: [ARCH_AUDIT_REPORT.md](audit/ARCH_AUDIT_REPORT.md), [LAYER_MAP.md](audit/LAYER_MAP.md), [REPLACEABILITY_MATRIX.md](audit/REPLACEABILITY_MATRIX.md), [SCALABILITY_LADDER.md](audit/SCALABILITY_LADDER.md), [REMEDIATION_PLAN.md](audit/REMEDIATION_PLAN.md). Verdict 🟡 — structurally sound; most findings pre-existing debt the recent slices surfaced, not regression. Two-app separation **PASS**. AI-O 6-grid **4/6 strong + 2 partial** (Context cache-key tenant gap; Response Parser no schema). Replaceability matrix **LLM=✅, FE/DB/RBAC=⚠️**. User-signed-off pragmatic cut per `feedback_minimal_change_grounding`: (1) **`ARCH-AI-002` + `-AI-001` → new audit ID `A20260516-01` next /coding session** (~1h, AI Policy enforcement + cache tenant-key); (2) **`ARCH-DB-002` rides B3c** (already in canon §3.2b Rev 2 — zero new scope); (3) **`ARCH-DB-001` rides Sprint 27 PX-3.18 cleanup-target**; (4) **21 findings deferred to refinement-track** — revisit only if customer telemetry surfaces them. Audit is a governance artifact; deliverables ARE the artifacts (no regression test for a read-only audit). | ✓ #audit-architecture-2026-05-15 | n/a | n/a |
| `A20260515-02` | User-surfaced 2026-05-15 (`objectives.html` AI-modal screenshot — "within 90 days" objective showed Dec 31 2025 → Dec 30 2026) → /coding 2026-05-15 (mint + ship same session) | **SHIPPED — AI-modal date cascade fix, 4 parts under one ID** (HIGH, Beta-blocker for AI-OKR flow). Same Beta bug `strategy doc §1.2` documented re-surfaced because B1.1 fixed `objective-wizard.html` only — the AI modal at `objectives.html` was a second un-migrated entry point sharing one BE finalize endpoint. **Part 1**: FE Screen 3 period selector (4 presets default 90d + custom date pickers); `finalizeWizardObjective` payload now sends `time_period_type:'custom'` + dates (BE custom branch [objective-wizard.js:811](../../../server/routes/objective-wizard.js#L811) already wired by `A20260514-07` — `feedback_reuse_max`). **Part 2**: BE reorder so dates resolve before KR build; embedded `KR.quarter` derived from `objective.start_date` (not today) via inline `objectiveStartQuarter`. **Part 3**: Standalone `KeyResult.quarters[]` spans objective period via inline `quartersTouched(start,end)`; cross-year falls back to start-year (D-4 semantic). **Part 4**: `Objective.js target_year` JSDoc cites START-year semantic. **No new schema fields, no new shared modules, no new endpoints** — reuse-max honored. 5 pre-edit Qs all greenlit (a) per `feedback_no_destructive_without_greenlight`. Regression NEW [scripts/test-sprint26-A20260515-02-ai-modal-date-cascade.js](../../../scripts/test-sprint26-A20260515-02-ai-modal-date-cascade.js) **79/79 ✓** across 14 sections (FE/BE/doc + vm-sandbox matrices on 4 inline helpers). Sibling sweep clean: -12/-11/-10/-09/-07 = **147/147 ✓**; total **226/226 ✓** across 6 date-touching audit-ID scripts. | ✓ #user-surfaced (mint) + ✓ #coding-2026-05-15 | ✓ #coding-2026-05-15 | ✓ #coding-2026-05-15 |
| `A20260514-12` | /strategy 2026-05-14 (mint) → /coding B3b 2026-05-15 (ship) | **SHIPPED — Planning page min-amendment (B3b)**. User-locked scope 2026-05-15: "really really simple, no redesign". (1) Removed dead calendar-quarter selector — `selectQuarter()` at [planning-v2.js:909](../../../client/pages/scripts/planning-v2.js#L909) was a no-op (zero data filtering downstream); dropped HTML markup + 4 CSS rules + 3 JS functions + state var + public-surface export. (2) Added date range + week pill to obj card via inline `formatObjectiveDateRange` (Q1 (a) per `feedback_minimal_change_grounding`) + canonical `ObjectiveCalculator.calculateWeekProgress` reuse (Q3 (a) per `feedback_reuse_max`). NEW `objective-calculator.js` script tag. Net LoC **-17** (more deletes than adds). Regression NEW [scripts/test-sprint26-A20260514-12-planning-minamend.js](../../../scripts/test-sprint26-A20260514-12-planning-minamend.js) **37/37 ✓** (5 HTML-removal + 5 HTML-addition + 6 JS-removal + 8 JS-addition + 9 vm-sandbox helper matrix + sibling-grep + canonical-helper integrity). Sibling sweep 64/64 ✓ (-11/-10/-06). 4 pre-edit Qs all greenlit (a) per `feedback_no_destructive_without_greenlight`. | ✓ #strategy-240 (mint) | ✓ #coding-B3b-2026-05-15 | ✓ #coding-B3b-2026-05-15 |
| `A20260515-01` | User-surfaced 2026-05-15 (`stringsounds@gmail.com` BO@CoA + EMPLOYEE@CoB) | **DEFERRED to post-Beta refinement track per user direction "fix later".** Multi-account login bug: same email exists as two legitimate User docs across companies (Layer 1 schema allows it via `{company_id, email}` compound unique index); login at [auth.js:174](../../../server/routes/auth.js#L174) does global `findOne({email})` → returns oldest `_id` non-deterministically, second account unreachable. Signup at [auth.js:65](../../../server/routes/auth.js#L65) contradicts Layer 1 with a global guard. Invitation-accept at [invitations.js:229](../../../server/routes/invitations.js#L229) is correct (company-scoped). Severity HIGH (Beta-blocker for any user with >1 account: consultant-also-BO, BO-also-Employee, cross-tenant test accounts). NOT CRITICAL (no auth bypass — password gates each account individually). Fix options: (A) account picker at login + signup symmetry ~1-1.5h ship-first; (B) unified `User.companies[]` model — schema fields already half-wired at [auth.js:101-107](../../../server/routes/auth.js#L101) — ~500+ LoC + backfill, post-Beta refinement-track; (C) global uniqueness — rejected. No code touched 2026-05-15 per `feedback_no_destructive_without_greenlight`. | ✓ #user-surfaced (mint) | — | — |
| `A20260506-04` | Cross-sprint audit S24-S27, Group 3a | Workstream C reworded from "consultant authors objectives" to "consultant initiates / monitors / nudges; deep-links to BO wizard". **C.1 split 2026-05-14**: page-matrix C.1 row reframed into **C.1a — Consultant workspace honesty pass** (audit IDs `A20260514-02..-06`) + **C.1b — Consultant nudge action layer** (deferred; needs wizard-preview verify + cooldown design). | ✓ | partial (C.1a in flight) | — |
| `A20260514-02` | /coding 2026-05-14 (mint, C.1a slice 1) | **SHIPPED — My Clients tile honesty hotfix.** BE — [server/routes/consultant.js:189-195](../../../server/routes/consultant.js#L189-L195) portfolio-summary aggregation extended with `$ifNull: ['$ssi_result.overall.score', '$ssi_result.overall']` plus same guard on all 3 dimensions (speed/strength/intelligence) per A20260512-17 canonical-shape contract. Matches existing parallel aggregation at line 1269. FE — [client/css/my-clients.css `.mc-tile-header`](../../../client/css/my-clients.css) gains `padding-right: 36px` (clears the absolutely-positioned 28px `.mc-pencil` button + 8px offset). Regression: NEW [scripts/test-sprint26-A20260514-02-my-clients-honesty.js](../../../scripts/test-sprint26-A20260514-02-my-clients-honesty.js) **13/13 ✓** — 6 BE aggregation guards + 1 sibling parity + 6 FE CSS guards. consultant.js smoke-loads clean. | ✓ #coding-2026-05-14 (mint) | ✓ #coding-2026-05-14 C.1a-1 | ✓ #coding-2026-05-14 C.1a-1 |
| `A20260514-03` | /coding 2026-05-14 (mint, C.1a slice 2) | **SHIPPED — Risk diagnosis enhancement.** [`computeRiskStatus()`](../../../server/routes/consultant.js#L42-L77) returns `{status, trigger, detail}` tuple (6 stable trigger enums + 'none'); `detail` is pre-formatted human-readable sub-text. 1 caller destructures (portfolio-kpis); other 3 pass-through. FE — 3 consumers defensive-read with `typeof === 'object'` guard; Summary Risk card renders `detail` as sub-line; Profile health-chip renders `detail` inline via `<small>`. Closes Bug 3 (opaque URGENT badge). Regression: NEW [scripts/test-sprint26-A20260514-03-risk-diagnosis.js](../../../scripts/test-sprint26-A20260514-03-risk-diagnosis.js) **35/35 ✓** — 10 BE static-grep + 17 vm-sandbox state matrix + 7 FE static-grep. Slice 1 (-02) 13/13 ✓ unchanged. | ✓ #coding-2026-05-14 (mint) | ✓ #coding-2026-05-14 C.1a-2 | ✓ #coding-2026-05-14 C.1a-2 |
| `A20260514-04` | /coding 2026-05-14 (mint, C.1a slice 4) | **SHIPPED — Summary tab simplification.** 5+1 cards → clean 4-card strip. Dropped TEAMS (low-signal raw count) + ASSESSMENTS (redundant). Promoted Last Activity from standalone `cw-summary-grid` UP into strip as 4th card (single visual rhythm 4-cards-per-tab). No BE changes. Regression: NEW [scripts/test-sprint26-A20260514-04-summary-simplification.js](../../../scripts/test-sprint26-A20260514-04-summary-simplification.js) **13/13 ✓** — audit marker + 4 card labels + 2 dropped-card negative + 2 retired-DOM-markup + 3 Last Activity wiring + 1 card-count=4 invariant. | ✓ #coding-2026-05-14 (mint) | ✓ #coding-2026-05-14 C.1a-4 | ✓ #coding-2026-05-14 C.1a-4 |
| `A20260514-05` | /coding 2026-05-14 (mint, C.1a slice 3) | **SHIPPED — Objectives KPI rationalization.** BE — CONSTRAINT swapped to canonical `Company.assessment_scores` lowest dimension (was per-Assessment, taker-dependent); 2 `Move.countDocuments` dropped (dead until S27); response shape: `drivers→ownership` rename, `velocity→ball_position` replace. NEW `BALL_POSITION_VIEWS` map + `furthestBallPosition()` helper near `bucketByLifecycle` per `feedback_extend_before_wrap` — 5 canonical states (⚪🟡🎯🤝📊) quoted from ACTIVATION_PLAYBOOK. FE — 4-card strip rebuilt: HEALTH no fraction, CONSTRAINT capitalized, OWNERSHIP defensive read (`k.ownership || k.drivers`), BALL POSITION renders emoji + label via valueHTML. Regression: NEW [scripts/test-sprint26-A20260514-05-objectives-kpi-rationalization.js](../../../scripts/test-sprint26-A20260514-05-objectives-kpi-rationalization.js) **36/36 ✓** — 13 BE + 10 vm-sandbox state matrix + 13 FE. Slices 1+2 cross-check 13+35 ✓ unchanged. | ✓ #coding-2026-05-14 (mint) | ✓ #coding-2026-05-14 C.1a-3 | ✓ #coding-2026-05-14 C.1a-3 |
| `A20260514-06` | /coding 2026-05-14 (mint, C.1a slice 5) | **SHIPPED — Plan tab simplification.** Plan KPI strip 4→3 cards. Dropped TODAY + CATCH-UP (Move-reads dead until S27). Replaced THIS WEEK with PLANNING COVERAGE (`coveredKRs/totalKRs` — no fragile populated-doc dependency). Added NEXT WEEK READY (WGs planned ISO week+1 with year-rollover). Kept FRESHNESS. Tiered coverage accent: ≥80 on_track / 40-79 at_risk / <40 urgent. Q4 (a) policy: 0-KR objectives don't penalize coverage. All Move-reading locals removed — no dead code. Regression: NEW [scripts/test-sprint26-A20260514-06-plan-simplification.js](../../../scripts/test-sprint26-A20260514-06-plan-simplification.js) **21/21 ✓**. | ✓ #coding-2026-05-14 (mint) | ✓ #coding-2026-05-14 C.1a-5 | ✓ #coding-2026-05-14 C.1a-5 |
| `A20260514-01` | /coding 2026-05-14 (mint, C.3) | **SHIPPED — AIOKR review cohort-aware framing.** Page-matrix C.3 row had no audit ID; minted at impl time per `feedback_audit_governance`. Three FE copy variants (consultant_view / bo_consulting / bo_self_serve) replace single static copy on [client/pages/ai-okr-review.html](../../../client/pages/ai-okr-review.html) header + info banner, picked by `pickCohortVariant(userRole, cohortMode)` matching ACTIVATION_PLAYBOOK §A.3. BE additive: [server/routes/companies.js GET /:id](../../../server/routes/companies.js) now returns `cohort: { mode, coach? }` reusing canonical [server/utils/cohortDetection.js `getAssignedConsultant`](../../../server/utils/cohortDetection.js) — same predicate Workstream B dispatchers use. Coach payload reduced to `{_id, first_name, last_name}` (no email leak). 4 pre-edit Qs all greenlit (a) — extend `/api/companies/:id` over new endpoint per `feedback_extend_before_wrap` / 3-variant matrix over 2 / page-local copy const over `display-labels.js` pollution / "your consultant" name fallback over copy-skip. Baked-in HTML defaults preserve self-serve copy verbatim → fetch failure leaves page identical to pre-C.3 state. C.3 regression **65/65 ✓** ([scripts/test-sprint26-C.3-cohort-framing.js](../../../scripts/test-sprint26-C.3-cohort-framing.js)) — static-grep on 3 surfaces + vm-sandbox pure-function exercise of `pickCohortVariant`/`interpolateCopy` (matrix + fallbacks) + copy-immutability + bo_self_serve↔HTML-default parity. C.2 sibling 46/46 ✓ + companies.js smoke-load clean. | ✓ #coding-2026-05-14 (mint) | ✓ #coding-2026-05-14 C.3 | ✓ #coding-2026-05-14 C.3 |
| `A20260506-05` | Cross-sprint audit S24-S27, Group 3b | Manager auto-email on `objective.create` when BO assigns `owner_id` during wizard (Workstream B dispatcher 4 send-side). C.5 shipped owner_id capture (#235); B.4 shipped Manager + Coach dispatcher (#237 — 62/62 ✓). | ✓ | ✓ | ✓ |
| `A20260506-06` | Cross-sprint audit S24-S27, Group 3c | 4-case empty-state helper in `display-labels.js` (Stage 0 vs Stage 1 × consultant-view vs owner-view). **SHIPPED 2026-05-14 #coding (C.2)**: `EMPTY_STATE_COPY` 4-key matrix + `emptyStateView({stage,hasAssessmentData,audience})` pure helper added to [client/js/display-labels.js](../../../client/js/display-labels.js) (~70 LoC). Stage definitions quoted verbatim from [ACTIVATION_PLAYBOOK.md ball-position lens](../../1-PRODUCT/ACTIVATION_PLAYBOOK.md) per `feedback_quote_the_canon` (Stage 0 = `prospect`+no data; Stage 1 = `onboarding`+data). 4 pre-edit Qs greenlit (a)/(a)/(a)/(a): canon-quoted stage mapping, helper exposes 4 cases (consultant rows pre-paid for C.1 consumption per master-plan line 124 "no asymmetric reuse on objectives.html"), reuses existing `/api/companies/:id` (no new endpoint per `feedback_reuse_max`), pure-data signature matching `companyStageView`/`lifecycleView` precedent per `feedback_extend_before_wrap`. [client/pages/objectives.html](../../../client/pages/objectives.html) empty-state markup converted to id'd elements + optional CTA button (~5 LoC). [client/pages/scripts/objectives.js `renderEmptyStateCopy()`](../../../client/pages/scripts/objectives.js) async fire-and-forget, audience='owner' fixed per Q-C2-2; `cta_action: 'open_ai_wizard'` wired to existing in-page `openObjectiveWizardModal()` for Stage 1; defensive fallback leaves static copy if helper/fetch fails (~50 LoC). NEW [scripts/test-sprint26-C.2-empty-state-helper.js](../../../scripts/test-sprint26-C.2-empty-state-helper.js) **46/46 ✓** — 15 static-grep + 7 bucket predicate + 13 happy-path payload + 9 defensive fallbacks + 3 immutability guards. Sibling regression: [scripts/test-sprint24-241-tile-and-stage.js](../../../scripts/test-sprint24-241-tile-and-stage.js) **73/73 ✓** (no drift on existing display-labels consumers). | ✓ | ✓ #coding-2026-05-14 C.2 | ✓ #coding-2026-05-14 C.2 |
| `A20260506-07` | Cross-sprint audit S24-S27, Group 4a | Persona-conditional one-liner in post-assessment email to all team members (BO / Manager / Executive / Employee) — one template, conditional copy. **SHIPPED 2026-05-14 #240 (B.3)**: `MailjetService.prototype.sendAssessmentAggregateCompleteEmail` template branches on `recipient_kind` ∈ {'bo','coach','team'} with `member_role` carrying the team-recipient persona discriminator (MANAGER/EXECUTIVE/EMPLOYEE one-liners). Single template, 4 personas, conditional copy invariant preserved. B.3 regression 92/92 ✓. | ✓ | ✓ | ✓ |
| `A20260506-08` | Cross-sprint audit S24-S27, Group 5a | Extend `dailyDigestJob.js` for consultant lifecycle events + add `User.notification_preferences` schema field. **SHIPPED 2026-05-14 #coding (B.5)** — see AUDIT_TRACKER row 508 for full implementation detail; B.5 regression 66/66 ✓ | ✓ | ✓ #coding-2026-05-14 B.5 | ✓ #coding-2026-05-14 B.5 |
| `A20260512-12` | /coding 2026-05-12 (UI polish) | Objectives page header compaction — drop "Your Objectives" hero + big Category Coverage card; inline KPIs + Add header; slim category strip below | ✓ | ✓ | — |
| `A20260512-02` | /strategy 2026-05-12 (Workstream E) → /coding 2026-05-12 (S26 Day 1, E.2 shipped) | Rollup field divergence — `OnboardingProgressService` reads canonical `ssi_result.dimensions.*` (× 10 to 0-100); per-dimension fallback to legacy `ssi_scores`; backfill script for stale `Company.assessment_scores`. Unit + integration + regression all green (34/34 + 32/32 + 55/55). | ✓ | ✓ | ✓ |
| `A20260512-01` | /strategy 2026-05-12 (Workstream E) → /coding 2026-05-12 (S26 Day 1, E.1 shipped) | Path A/B aggregation mismatch — both `/dashboard-summary` and `/team-breakdown` now read `Company.assessment_scores` (canonical). Empty-state path surfaces canonical rollup so BO-only shops show real SSI. FE `team-ssi-view.js` `hasData` extended to treat non-zero canonical rollup as data-present. F-M-02 round-trip cap improved 7→6. 32/32 + 55/55 ✓. **PREFLIGHT Q9 manual verify still pending** (15 min on `karvia-business-1`). Flips Beta gate SEC-7 🟢 GREEN. | ✓ | ✓ | ✓ |
| `A20260512-08` | /strategy 2026-05-12 (Workstream E) → /coding 2026-05-12 (S26 Day 1, E.3 shipped) | Future-framework scoring dispatch — spec amended per `feedback_reuse_max` memory: reused existing `Assessment.assessment_type` field instead of adding new `scoring_type` column. `OnboardingProgressService.SCORING_DISPATCH` map dispatches by assessment_type; only `'ssi'` registered today; future GRIT/BBB/PBL add new handlers (zero schema change). 26/26 + 234 sweep ✓. | ✓ (amended at code) | ✓ | ✓ |
| `A20260512-11` | /strategy 2026-05-12 (Workstream E) → /coding 2026-05-12 (S26 Day 1, E.4 shipped) | Cascade-correctness regression test — scope narrowed mid-session: Q5+Q12 full canonical contract (latest-per-PERSON + role-weighted + role-change/delete triggers) NOT wired today; E.4 was sized 0.25d (test only). Test ships against today's reality (29/29 ✓ — completion + retake + idempotency + non-SSI dispatch + multi-user latest-Assessment-wins + timestamp). Q12 canonical-contract gap LOGGED at [REFINEMENT-BACKLOG](../REFINEMENT-BACKLOG/README.md) Sub-bucket A. | ✓ (scope narrowed) | ✓ | ✓ |
| `A20260512-13` | /coding-hotfix 2026-05-12 (post-#224 — critical journey unblocker) | EMAIL_DEEP_LINK_CONTRACT violation surfaced live on pre-prod — consultant-invitation email carried `http://localhost:3000/...` because `FRONTEND_URL` unset → banned-fallback chain. 7 banned env reads across 3 routes replaced with `process.env.APP_URL` only (no `||` chain). Boot-time `APP_URL` validation added to `server/config/index.js` (fail-fast in production, same pattern as JWT_SECRET). User Render action: set `APP_URL` on pre-prod + verify on production. 18/18 ✓ (no banned reads + no hardcoded host on `/pages/` URL build lines + positive `APP_URL` reference + prod-boot-without-APP_URL fails with contract-citing error). | ✓ #coding-hotfix | ✓ | ✓ |
| `A20260512-14` | /coding-hotfix 2026-05-12 (Q12 display-slice carve-out) | Team Results tab stacked historical retakes per user → display-layer slice of Q12 canonical-rollup gap. NEW `server/utils/assessmentDedup.js` pure-function `dedupeLatestPerUser` wired into `GET /api/assessments/company-results`. Anonymous respondents (user_id null) pass through ungrouped. Q12 cross-link updated in REFINEMENT-BACKLOG (remaining = write-path role-weighted rollup + role-change/delete triggers). 16/16 ✓ (same-user latest-wins + multi-user dedup + anonymous passthrough + mixed + empty + single-row + bare-id un-populated). E.1 32/32 ✓ + E.4 29/29 ✓ + consultant-reads 55/55 ✓ regression. | ✓ #coding-hotfix | ✓ | ✓ |
| `A20260512-15` | /coding-hotfix 2026-05-12 (existing-user invitation flow) | Existing-user invitation rendered the signup form; 100% of S26 team-invite traffic hits this. BE `/validate/:token` now returns `user_exists` (multi-tenant scoped); FE `invitation-accept.html` early-redirects existing users through login → assessment-take with token preserved; `assessment-take.html` safety net preserves token on direct/stale-tab unauth landings. Auto-login-via-token rejected on security grounds. 17/17 ✓ (existing + new + cross-tenant + user_created + invalid + used). | ✓ #coding-hotfix | ✓ | ✓ |
| `A20260512-17` | /coding-hotfix 2026-05-12 (SSI canonical shape contract) | User direction: "perfect the assessment — modular scoring framework — fix the structure around it." After two-round pushback (per `feedback_reuse_max` + new `feedback_extend_before_wrap` memory), scope shrank from new SSIService + registry + adapter pattern to ONE additive method on existing canonical service. NEW `UnifiedSSIScoringService.toCanonicalShape(ssiResult, meta)` — pure projection producing locked 0-10-uniform contract: `{overall, dimensions × 3, categories × 12 MECE, framework, as_of}`. 12 categories read from `blocks.*.score` (0-10 native) translated via existing `BLOCK_TO_SUB_DIMENSION` — bypasses `projectSubDimensions` 0-100 trick. Submit-flow response migrated to attach `canonical` alongside legacy `scores`. Pluggability stays as `calculateSSI(..., {weights})` parameter; future framework = alternate calc backend, shape unchanged. 59/59 ✓ (function surface + 0-10 magnitudes throughout + 12 MECE locked order + mapStatus ratings + framework/as_of meta + null/partial edges + real calculateSSI → toCanonicalShape integration). Future migrations (one consumer at a time, FE caller verified each): my-clients tile (user's arc goal — even 1 taker shows SSI), team-ssi-view tabs, assessment-results page, /dashboard-summary, /company-results, /team-breakdown. | ✓ #coding-hotfix | ✓ #coding-hotfix (contract + 1 consumer) | ✓ #coding-hotfix |
| `A20260512-18` | /audit-225 (proposed) → /coding 2026-05-13 (S26 Day 2 — closing yesterday's ledger) | **SCOPE EXPANDED at grounding**: original "doc-only" fix bloomed to doc + live code + param-name divergence. EMAIL_DEEP_LINK_CONTRACT §4 row 2 + §5 invitation-token row both referenced non-existent `/pages/assessment.html`; live code at `invitations.js:1833` (team-member welcome email) shipped the same dead URL with the wrong param name (`?token=` vs FE-expected `?invitation_token=`). Fixed all 3 sites in one slice: contract row 2 → `assessment-take.html?invitation_token=<token>`; contract §5 split into `?token=` consumers (invitation-accept, signup) + `?invitation_token=` consumer (assessment-take); invitations.js:1833 matches. NEW static-grep regression `scripts/test-sprint26-A20260512-18-19-deadlinks.js` 9/9 ✓ (zero `/pages/assessment.html` refs in governed dirs; positive guards on all 3 fixed sites). Yesterday's -13 contract regression 18/18 ✓. | ✓ #audit-225 | ✓ #coding-2026-05-13 | ✓ #coding-2026-05-13 |
| `A20260512-19` | /coding 2026-05-13 (S26 Day 2 — discovered during -18 grounding) | Two dead-link CTAs + one orphan file retired. (a) `objectives.html:254` + `ai-okr-review.html:115` both shipped primary "Take Assessment" empty-state CTAs pointing at non-existent `/pages/assessment-form.html` (404). Per user direction "no backward loop — natural progression is assessment → results → objectives → planning", removed the `<a>` CTAs entirely; descriptive empty-state text preserved. (b) Deleted orphan `client/pages/business-assessment.html` (388 LoC, legacy take-page prototype, zero incoming references in client/ or server/). Same regression suite 9/9 ✓ (zero `/pages/assessment-form.html` refs; file gone; positive guards on removed CTAs). | ✓ #coding-2026-05-13 (mint) | ✓ #coding-2026-05-13 | ✓ #coding-2026-05-13 |
| `A20260513-05` | /strategy 2026-05-13 (mint) → /audit 2026-05-13 (triage) → /coding 2026-05-13 Day 3 Slice 1 | **SHIPPED — EMPLOYEE empty-state gate.** Triage REFRAMED both mint-suspicions and pinned the actual root as an init-flow collision in [team-ssi-view.js:99-113](../../../client/pages/scripts/team-ssi-view.js#L99-L113): `loadCompanyResults()` runs before `switchTab('my-results')`; for EMPLOYEE it synthesizes teamResults from `Company.assessment_scores ÷ 10`, and when that rollup is empty, `hasData=false` → `showEmptyState()` hides `#tab-container` entirely. **Fix shipped** (~10 LoC FE at [team-ssi-view.js:540](../../../client/pages/scripts/team-ssi-view.js#L540)): inside `if (!hasData)`, gate the legacy `showEmptyState()` path for EMPLOYEE — reveal `#tab-container` + hide `#loading-state`, then bail. The dedicated My Results tab (set as defaultTab in init) renders normally. Scope guard intact: single-template SSI, no rename, no template_id routing. | ✓ #strategy (mint) + ✓ #audit (triaged) | ✓ #coding-2026-05-13 | ✓ #coding-2026-05-13 |
| `A20260513-06` | /strategy 2026-05-13 (mint) → /audit 2026-05-13 (triage + split) → /coding 2026-05-13 Day 3 Slice 2 | **SHIPPED — canonical headline counts for /team-breakdown.** Root CONFIRMED + companion split as -06b. **Fix shipped** (~30 LoC BE in [server/routes/assessments.js](../../../server/routes/assessments.js#L763-L789)): after the role-based teams fetch, non-MANAGER roles compute a `canonicalHeadline = { total_completed, total_members }` via `Assessment.distinct('user_id', { company_id, status:'completed', user_id:{$ne:null} })` + `User.countDocuments({ company_id, status:{$in:['active','pending_invite']}, role:{$ne:'CONSULTANT'} })`. Both the no-teams early-return path AND the main response builder consume `canonicalHeadline` when present. MANAGER falls through to existing team-iteration counts to honor the "my managed teams" contract. Q1=(b) chosen for members semantic — `pending_invite` users count, since they're expected to complete. `feedback_extend_before_wrap` honored (extended existing endpoint, no new aggregator/service). | ✓ #strategy (mint) + ✓ #audit (triaged) | ✓ #coding-2026-05-13 | ✓ #coding-2026-05-13 |
| `A20260513-06b` | /audit 2026-05-13 (split from -06 at triage) → /coding 2026-05-13 Day 3 Slice 3 | **SHIPPED — role-conditional `sent_by` in /kpi-summary.** [`/kpi-summary`](../../../server/routes/assessments.js#L2350-L2375) non-CONSULTANT branch split via `isPersonalScope = role === 'MANAGER'`: BO + EXECUTIVE drop `sent_by: userId` (company-wide cockpit semantics — they need to see org-level dispatch activity); MANAGER keeps it (personal-scope semantics correct for "what I dispatched to my team"). `/sent-by-me` untouched (Sent by Me tab is rightly personal). ~12 LoC BE. | ✓ #audit (mint) | ✓ #coding-2026-05-13 | ✓ #coding-2026-05-13 |
| `A20260513-08` | /coding-#234 (mint) → **NEXT /audit SESSION** (agenda) | **AGENDA — Codebase-wide hardcoding sweep.** User direction post-B.6: "lets pick this up in the next audit session". Scope: hardcoded URLs/hosts/IPs, credentials/API keys/secrets, magic numbers that should be env-driven, role-name/status-enum drift outside `server/constants/`, hardcoded file paths. Exclusions: node_modules, ARCHIVE/, test fixtures, .env.example, markdown docs. Action: classify severity, propose env/constants home, mint sub-IDs `A20260513-08a/-08b/...` per finding. Why now: B.6 boot fail-fast catches the URL class only; secrets + magic numbers + enum drift don't fail-fast — prevention is one /audit pass, recurrence is a security/correctness incident. See AUDIT_TRACKER row for full search-pattern playbook. | ✓ #coding-#234 (mint) | — (next /audit) | — |
| `A20260513-07` | /coding-#234 (mint + ship same session) | **SHIPPED — EMAIL_DEEP_LINK_CONTRACT cleanup + B.6 regression.** See SPRINT26_HANDOFF head comment for full surface list. 5 fallback chains stripped + B.1 CTA drift fixed + boot fail-fast extended to all envs + playbook §Impl seam corrected to quote canon verbatim + STRICT B.6 regression 24/24 ✓. Memory `feedback_quote_the_canon` minted. | ✓ #coding (mint) | ✓ #coding-#234 | ✓ #coding-#234 |
| `A20260513-04` | /audit 2026-05-12 (mint) → /coding 2026-05-13 #237 (ship) | **SHIPPED — B.4 send-side regression test (B.8 task).** NEW [scripts/test-sprint26-B.4-objective-handoff.js](../../../scripts/test-sprint26-B.4-objective-handoff.js) **62/62 ✓** shipping alongside B.4 dispatcher in single commit. 11 static-grep sections (tuple match, dispatcher shape, Manager + Coach CTA patterns verbatim from playbook, no banned env reads, mailjet surface, role-conditional Subject, "From" headers per Q-B4-4, cohort reuse, brandedHeaderTemplate reuse, canon-quote check) + 10 live-fire scenarios via require.cache stubs covering: consulting × {MANAGER/EXECUTIVE/BUSINESS_OWNER} owner ≠ author → 2 sends; self-assignment → 1 Coach-only with assignee_name=null; self-serve modes; non-matching tuples (actor/fromStage/toStage); APP_URL fail-fast → 0 sends; missing Objective → 0 sends no crash; wrong triggeredByKind → 0 sends. Self-vs-author gate (Q-B4-1 (c) refined from role-based) covers BO/EXEC functional-manager case. | ✓ #audit (mint) | ✓ #coding-#237 | ✓ #coding-#237 |
| `A20260513-03` | /audit 2026-05-12 (mint) → /coding 2026-05-13 #238 (ship) | **SHIPPED — B.2 reminder cadence regression test (B.7 task).** NEW [scripts/test-sprint26-B.2-reminder-cadence.js](../../../scripts/test-sprint26-B.2-reminder-cadence.js) **68/68 ✓** shipping alongside B.2 cron itself in single commit. 11 static-grep sections (REMINDER_CADENCE_DAYS=[3,7,13], dueReminderTier counter-gated helper, runCronTick wires both passes via Promise.allSettled, status filter ['sent','opened','in_progress'], is_public_link exclusion, APP_URL fail-fast, no fallback chains in new dispatcher slice, CTA `assessment-take.html?invitation_token=` per A20260512-18 verbatim, mailjet surface, tier-conditional Subject, cohort-conditional one-liner) + 15 live-fire scenarios via clock-injection + in-memory fixtures + require.cache stubs: pure-function `dueReminderTier` matrix proves counter-gated semantics across 8 day/tier permutations + missed-day resilience (day-4 tick fires tier 0); full `sendReminderForInvitation` flow proves consulting + self-serve payloads, idempotency on same-day re-fire, APP_URL fail-fast, query filter shape captured via stub, tier 0/1/2 passthrough, CTA composition with token. Cadence approach Q-B2-1 (b) — compute-on-the-fly via existing schema fields, no write-side change. | ✓ #audit (mint) | ✓ #coding-#238 | ✓ #coding-#238 |
| `A20260512-16(a)` | /audit-225 (proposed ~25 LoC) → /coding 2026-05-13 (S26 Day 2 Slice 2 — Path B convergence) | **SCOPE EXPANDED at user direction**: original "add CTA on assessment-results.html" bloomed into full Path B convergence — `team-ssi-view.html` is now the canonical results page. NEW 5th tab "My Results" with score cards + weak areas + empty state CTA. EMPLOYEE block at team-ssi-view.js:86 REMOVED; role-aware tab matrix (EMPLOYEE: My Results + read-only Company Overview; MANAGER: + Teams; BO/EXEC: all 5; CONSULTANT: hide My Results). EMPLOYEE Company Overview synthesizes from `/api/companies/:id` `assessment_scores` ÷ 10 (no new endpoint — extends existing path; `feedback_extend_before_wrap` honored). `assessment-results.html` rewritten from 566 LoC full page → 54-line redirect shim with legacy `?id=` → `?tab=my-results&assessment=` mapping. 3 callers migrated (assessment-take.html post-submit + assessment-hub.html × 2). Zero backend touch — reuses `/api/assessments/:id/detailed-results`. 29/29 ✓ regression + 18/18 ✓ -13 contract + 9/9 ✓ -18/-19 deadlinks = 56/56 ✓ across the session. **Polish deferred**: when Mgr+ clicks "View Results" on a team member, tab label still reads "My Results" (other person's name in dynamic header — minor UX nit, not Beta blocker; rename to neutral "Assessment Result" deferred). | ✓ #audit-225 + ✓ #coding-2026-05-13 (scope expanded) | ✓ #coding-2026-05-13 | ✓ #coding-2026-05-13 |

**Workflow**: when implementing in `/coding`, set 💻 here AND in master tracker; cite ID in commit message. At sprint close `/close`, set ✅ once regression suite green.

---

## Sign-off

Sprint 26 handoff initialized 2026-05-06. Planning complete. Sprint launched 2026-05-12 at Sprint 25 /close #230 with Q1-Q4 resolved and task spine decomposed in [SPRINT26_PAGE_MATRIX.md](SPRINT26_PAGE_MATRIX.md).

**S25 retro folded into S26 launch**: action items A4 (`A20260512-01` triage) + A5 (PX-5.1 regression) recorded as S26-D.1 + S26-B.6. A1-A3 (skill-level refinements) tracked in [SPRINT25_RETRO.md](../SPRINT-25-Plumbing/SPRINT25_RETRO.md).

---

## /strategy — 2026-05-27 (Objectives Page strategic resolution — 4 RPs + multi-play audit + 9 audit IDs pre-minted + cascade locked + 2 reference docs created)

### Trigger

User invoked `/strategy` to execute the [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md) research agenda drafted at /testing 2026-05-26 close. 4 RPs (wizard unification + Category Coverage blast-radius + cascade standardization + S26/S27 plan fit) + TQ4 "different objective" clarification + new deferred-KR multi-play audit (user-requested mid-session).

### Why-first re-anchor (per `feedback_why_what_how_when`)

Strategic shift driving session: *"individual objectives created by business owners, consultants or managers"* replaces the "company tracks 6-category coverage" mental model. Wizard unification, Category Coverage removal, and cascade standardization all flow from this single shift.

### Session arc

| Phase | Action | Output |
|---|---|---|
| 0 | Why-first framing + 5 meta Q-gates (Q-X1..X5) on session scope | All greenlit: RP4 first → RP1 → RP2 → RP3 → synthesis, deep-with-citations, per-Q landing |
| 1 | **RP4 — Plan fit** | S26 firing 22/24 (3 residuals: C.1b deferred + D.2/D.3 close-gate). S27 DRAFT blocked on S26 close. Recommended **Option B**: per-question landing (some S26 burndown, some S27 amend, some post-Beta) |
| 2 | **TQ4 grep** | No strong "different objective" hit — 3 weak matches (code comment + S18 archived mockup + e2e test step using "different" as "another"). Best guess: user observed Manual-vs-AI dropdown split on objectives.html OR canonical-vs-bulk distinction on team-ssi-view.html — both addressed by S27 Workstream E |
| 3 | **RP1 — Wizard unification audit** | **Surprise finding: 6 doors to "create an objective"**, not 2. Mapped each door's strategic alignment + Manager-handoff reliability. Door #2 (Manual) has SILENT owner_id fallback at backend ([objectives.js:220](../../../server/routes/objectives.js#L220)). Door #1/#3 share canonical engine. Door #4/#5/#6 are competing legacy doors. |
| 4 | **Tier 1 verification** (user-greenlit) | Door #2 frontend ENFORCES owner ([objectives.html:1651-1655](../../../client/pages/objectives.html#L1651) blocks save with toast; "Owner*" label asterisk at [:323](../../../client/pages/objectives.html#L323)). Backend FALLBACK at [objectives.js:220](../../../server/routes/objectives.js#L220) — latent bug not Beta-blocker today. **Post-assessment entry verified**: [team-ssi-view.js:233-243](../../../client/pages/scripts/team-ssi-view.js#L233-L243) NextStep CTA routes BO/EXEC to canonical wizard (door #1) ✅ — user's intuition correct. BUT competing "Generate OKRs" bulk button (door #5) at [team-ssi-view.js:1410](../../../client/pages/scripts/team-ssi-view.js#L1410) still exists on same page. |
| 5 | **User pivot to ADDITIVE principle** | User direction: *"let's not delete anything so that way we are reducing the risk. So we're just introducing a new way of generating objectives... let's add this as a new option instead of retiring the old option"*. Reframed plan: add new "Create Individual Objective" door + de-emphasize existing doors (not delete). |
| 6 | **Individual Objective wizard design** | 3-step modal: Step 1 free-text intent + collapsible company context (industry / SSI weak area / existing objectives count), Step 2 category (auto-suggested) + priority + timeline + Manager (required), Step 3 KR mode (Add later default / Add manually / Generate with AI). All POST to existing `/api/objective-wizard/finalize` with `creation_mode:'individual'` flag. Q1-Q4 resolved: modal (Q1=a), collapsible (Q2=c), opt-in AI (Q3=a), Add later default (Q4=a). |
| 7 | **RP2 — Category Coverage blast-radius** | Separable into coverage CONCEPT (removable) vs category TAG (load-bearing — used by icons, theming, quarterly review, model index). Per user *"let's keep the category coverage widget be there and... but not evidently show it for now"* → **de-emphasize, not remove**. Documented in [PARKED_FEATURES.md](../../1-PRODUCT/PARKED_FEATURES.md). |
| 8 | **Deferred-KR multi-play audit** (user-requested) | Data layer ✅ across the board (0-KR save + later KR add via `POST /api/key-results` + reactive lifecycle transitions + Dispatcher 4 fires). **Single GAP**: Manager has no CTA when arriving at 0-KR objective on planning-v2 ([planning-v2.js:183](../../../client/pages/scripts/planning-v2.js#L183) silently returns) → closed by A20260527-07/-08. |
| 9 | **RP3 — Cascade standardization** | 4 drift types found: UI terminology ("weekly milestones" vs "weekly goals", 6 spots) + WeeklyGoal.js docstring conflict + WeeklyGoal collection vs Goal{time_period:'WEEKLY'} UNION-READ unfinished migration + route namespace duplication. **Architectural decision** (user): *"Quarterly goal does not have any impact... let's use the new weekly goal model. KR weekly goal tasks"* → **4-level canonical cascade locked**; legacy 5-level preserved. **Move layer** parked as future 5th. |
| 10 | **KR duration semantic locked** | KR inherits Objective duration window. Weekly Goals = ceil((KR.end - KR.start) / 7d). No new field needed. |
| 11 | **Holistic audit pre-edit** (10 dimensions) | All PASS — strategic alignment + additive + risk-min + reuse-max + no-destructive-without-greenlight + stable IDs pre-minted + doc coverage + quote-canon + Beta gate labeled + memory rules firing. |
| 12 | **Synthesis edits** (8 files) | CLAUDE.md cascade diagram + WeeklyGoal.js docstring + OBJECTIVES_PAGE_STRATEGIC_INPUT.md (DRAFT → RESOLVED) + SPRINT27_MASTER_PLAN.md (Workstream E added) + this handoff + 2 NEW reference docs |

### S26 burndown punch list — ✅ SHIPPED 2026-05-28 /coding

All three pre-minted items shipped + tested in single /coding session.

| # | Audit ID | Task | Cost (actual) | Status |
|---|---|---|---|---|
| 1 | **A20260527-02** | KR-row palette sibling-sweep — scope widened from 1 site to 4 via pre-edit `feedback_read_helper_before_consuming` audit; NEW `ObjectiveCalculator.getKRRowColorTokens` consumed at 3 row sites + 1 counter swap (closes A20260526-01 + 3 sibling-sweep miss sites in same class) | ~95 LoC code + ~165 LoC test | ✅ 💻 ✓ 53/53 ✓ |
| 2 | **A20260527-01** | Backend `owner_id` strict gate on POST `/api/objectives` — fail-noisy + `|| userId` fallback removed at 2 internal sites | ~10 LoC code + ~95 LoC test | ✅ 💻 ✓ 16/16 ✓ |
| 3 | **A20260527-03** | UI string normalization "weekly milestones" → "weekly goals" — 6 user-facing strings per CASCADE_MIGRATION_STATE.md canon | 6 string swaps + ~85 LoC test | ✅ 💻 ✓ 12/12 ✓ |

**Session test totals**: 81/81 ✓ new across 3 scripts; sibling sweep -20-01 (56/56 ✓) + -20-02/-05 (69/69 ✓) = **206/206 ✓ across 5 scripts**, zero collateral.

**S26 close gate next**: 5-verb acceptance test execution (Path A consulting + Path B self-serve) on `karvia-business-1` post-deploy. Burndown unblocks this — now ready to run before /close S26.

### S27 Workstream E (added to SPRINT27_MASTER_PLAN.md)

Six items (A20260527-04..09), ~1.5-2 days total. See [SPRINT27_MASTER_PLAN.md Workstream E](../SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md) for full task spine.

### Decisions locked (14)

1. A20260526-01 fix → S26 burndown (A20260527-02)
2. Backend owner_id requirement → S26 burndown (A20260527-01)
3. Create Individual Objective wizard → S27 Workstream E (A20260527-04)
4. Category Coverage widget → de-emphasize but keep (A20260527-05)
5. Door #5 bulk button → de-emphasize on team-ssi-view.html (A20260527-06)
6. Door #4 (industry-template wizard) → leave, measure post-Beta
7. Door #6 (`generate-single-objective`) → leave, measure post-Beta
8. RP3 cascade surgical fixes → S26 burndown (A20260527-03)
9. RP3 architectural spike (Q-A / Q-B / Q-C) → parked post-Beta
10. 5-verb acceptance test → S26 close gate
11. **Canonical 4-level cascade**: Objective → KR → Weekly Goal → Daily Task (locked CLAUDE.md)
12. **Move layer** = future 5th level (post-Beta)
13. Doc-level standardization only this sprint (no code migration for legacy 5-level objectives)
14. Individual wizard Step 3: KR breakdown produces WeeklyGoals directly (no Quarterly Goal layer for new objectives)

### Files modified (8) + files created (2)

| Surface | Type | Change |
|---|---|---|
| [CLAUDE.md](../../../CLAUDE.md) | modified | Core OKR Cascade diagram → 4-level canonical + legacy note + Move-as-future + critical model files list updated |
| [server/models/WeeklyGoal.js](../../../server/models/WeeklyGoal.js) | modified | Docstring updated: 4-level cascade + UNION-READ state reference |
| [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md) | modified | DRAFT → RESOLVED + full Q-W/C/S/P resolutions section + audit IDs table + meta-decisions + result documents linked |
| [SPRINT27_MASTER_PLAN.md](../SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md) | modified | Workstream E added (7 tasks: -04..-09 + E.7 regression test); leading HTML comment; sprint goal note; @GENOME date 2026-05-06 → 2026-05-27 |
| [SPRINT26_HANDOFF_DOCUMENT.md](SPRINT26_HANDOFF_DOCUMENT.md) | modified (this doc) | Leading HTML comment + this `/strategy — 2026-05-27` section + @GENOME date 2026-05-26 → 2026-05-27 |
| [KARVIA_STRATEGY/1-PRODUCT/PARKED_FEATURES.md](../../1-PRODUCT/PARKED_FEATURES.md) | **NEW** | Category Coverage + door #4/#5/#6 parking inventory + future-trigger criteria + revival cost + revival procedure |
| [KARVIA_STRATEGY/2-TECHNICAL/CASCADE_MIGRATION_STATE.md](../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md) | **NEW** | 4-level canonical + legacy 5-level preserved + migration state matrix + route layer state + UI terminology lock + 3 open architectural questions (Q-A/B/C) + decision log |
| [.claude/SESSION_LOG.md](../../../.claude/SESSION_LOG.md) | TODO at /close | Session #260 entry to land at /close |

### Counter delta (research-only session)

| Bucket | Before | After | Δ |
|---|---|---|---|
| Audit IDs pre-minted | 0 | 9 (A20260527-01..09) | +9 (PLAN state) |
| AUDIT_TRACKER counter changes | — | — | 0 (mints happen at /coding when first edit fires) |
| Sprint 26 firing | 15/24 | 15/24 | 0 (research-only) |

### Memory rules applied (10)

- `feedback_no_destructive_without_greenlight` — every research step + every recommendation surfaced Q-gates before action; user pivoted to ADDITIVE principle mid-session and plan was reframed accordingly
- `feedback_minimal_change_grounding` — Tier 1 surgical first (door #4 retirement was nominated then DROPPED per additive principle); doc-only RP3 standardization preferred over code migration
- `feedback_extend_before_wrap` — Individual wizard reuses `/api/objective-wizard/finalize`, Manager CTA reuses `<NextStep>` component pattern, generate-krs endpoint extended (not new)
- `feedback_reuse_max` — composes existing context-hints + eligible-owners + finalize + key-results endpoints
- `feedback_quote_the_canon` — every claim cites file:line; user direction quoted verbatim in OBJECTIVES_PAGE_STRATEGIC_INPUT.md resolutions + CASCADE_MIGRATION_STATE.md decision log
- `feedback_audit_governance` — 9 stable IDs A20260527-NN pre-minted; will fire 3-places-atomic when /coding edits commit
- `feedback_read_helper_before_consuming` — Tier 1 verification ran BEFORE recommending door #2 fix; deferred-KR multi-play audit ran BEFORE locking "Add later" mode in wizard design
- `feedback_why_what_how_when` — Why-first re-anchor on strategic shift opened session; Why/What/How/When framing requested by user mid-session and applied
- `feedback_two_app_model` — wizard design preserves consultant nudge / BO author boundary; consultant doesn't author
- `feedback_test_fixture_validation` — all reads probed schema/code BEFORE claiming behavior (Objective.calculateProgress, /api/key-results POST validation, Dispatcher 4 trigger)

### Quality reflection — 9/10

**Strong**:
- User pivot to ADDITIVE principle mid-session caught the over-engineered "delete and unify" plan; reframed in 2-3 turns without scope thrash
- Deferred-KR multi-play audit was user-requested mid-flow; verified at data layer + surfaced exactly one gap (A20260527-07/-08) before locking wizard design — proves `feedback_read_helper_before_consuming` discipline
- 9 audit IDs pre-minted with consistent tier placement; ready for mechanical /coding execution
- 2 NEW reference docs solve actual coordination problems (PARKED_FEATURES for additive-principle bookkeeping; CASCADE_MIGRATION_STATE for architectural truth in transition state)
- Holistic audit framework ran pre-edit; 10 dimensions all PASS; nothing snuck through

**Weak**:
- Initial wizard unification recommendation included door #4 retirement (mild deletion) — only retracted after user surfaced ADDITIVE principle. Should have proposed additive-first per `feedback_minimal_change_grounding` without prompting
- TQ4 "different objective" not fully resolved — best-guess interpretation accepted; could not be confirmed at session level
- RP3 architectural questions (Q-A/B/C) parked but parking criteria are time-based ("post-Beta + 90 days") rather than measurement-trigger-based; should refine in future spike

**Smaller**:
- Session length ran longer than typical /strategy due to user-requested mid-session audit additions (deferred-KR + objective card polish); split-session would have been an option but user direction *"go ahead and edit everything"* validated continuing through synthesis

### Sprint 26 status (UNCHANGED — research-only session)

15/24 firing — A 4/4 ✅ + B 9/9 ✅ + C 5/6 + D 0/2 + E 4/4 ✅

### Next session recommendation

**Primary**: `/coding` S26 burndown — three items in recommended order (A20260527-02 first since A20260526-01 has been open longest, then A20260527-01 backend owner_id, then A20260527-03 doc string normalization). ~3 hours total, fits one session. Pre-edit Q-gates per `feedback_no_destructive_without_greenlight`. Atomic AUDIT_TRACKER updates per `feedback_audit_governance` at each item ship.

**Secondary** (after primary lands): `/coding` S27 Workstream E kickoff — start with A20260527-04 (Create Individual Objective wizard, largest item) per `feedback_minimal_change_grounding` route through `/api/objective-wizard/finalize`.

**Tertiary** (after Workstream E complete): `/testing` end-to-end 5-verb acceptance test (Path A + B) on `karvia-business-1` to close S26.

**Post-Beta**: Post-Beta-launch usage measurement of doors #4/#5/#6 + Category Coverage widget; retirement decisions per [PARKED_FEATURES.md](../../1-PRODUCT/PARKED_FEATURES.md) revival criteria. Plus architectural spike for cascade Q-A/Q-B/Q-C per [CASCADE_MIGRATION_STATE.md](../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md).

---

## /testing — 2026-05-26 (pivoted to research+audit-mint mid-walkthrough — 1 audit ID minted, surgical preprod wipe, S27 strategic input drafted)

### Trigger

/testing opened to verify -02/-05 closure browser-side after #258 commit `34030aa` deployed to `karvia-business-1`. Phases 1-3 walked; Phase 3 observation prompted strategic pivot mid-session per user direction.

### Session arc

| Phase | Action | Result |
|---|---|---|
| 0 | Pre-flight: surgical wipe of `rsm@karvia.ai` tenant | NEW `scripts/cleanup-rsm-tenant.js` (probe-first) fired clean — 1 user + 1 company + 12 cascade docs deleted; 0 residue across all post-verify buckets |
| 1 | Fresh consultant signup + BO invite + assessment + AI OKR generation | Clean — 1 Customer Success objective created with 4 KRs |
| 2 | Verify A20260520-04 closure in-browser | ✓ objectives.html renders cleanly, no ReferenceError |
| 3 | Surface A20260526-01 visible UX regression | 📝 MINTED — KR rows red despite "on track" footer |
| **Pivot** | User direction: "we are not pivoting from scope, we are choosing not to do testing" | Phases 4-6 DEFERRED to post-S27 end-to-end testing |
| 4 | Verify A20260520-03 chore actions | DEFERRED |
| 5 | Verify -02/-05 cascade HEADLINE | DEFERRED |
| 6 | Gates 10-12 First Objective Created acceptance | DEFERRED |

### A20260526-01 (NEW MINT — MEDIUM, 📝 PLAN)

**Group**: UX-INCONSISTENCY-KR-ROW-RED-DESPITE-ONTRACK-FOOTER (1 surface)

**Smoking gun** (BO objectives.html screenshot 2026-05-26): card "Launch a standardized customer onboarding process..." Week 1/13 · 0% · 4 KRs all `0%` rendered with RED left-border + RED %; footer reads "**4 KRs on track · 0 pending**" ✓ (correct per A20260520-01 grace-window).

**Root cause** (source-traced): A20260520-01 + #258 sibling sweep routed the COUNTER and the math through `calculateKRRiskStatus`, but [objectives.js renderKeyResultsPreview:489-503](../../../client/pages/scripts/objectives.js#L489-L503) per-KR row CSS color binding still uses hard `krProgress >= 70 / >= 40 / else` thresholds — bypasses the temporal-aware helper at the visual layer.

**Class**: sibling-sweep miss — same root-cause family as -01/-04/-02/-05 but at the CSS-class binding instead of the count or math layer. Lesson: `calculateKRRiskStatus` consumers must include ALL surfaces that bind on KR-progress-derived semantics, not just count/value.

**Fix direction (deferred)**: route `krProgress` through `calculateKRRiskStatus(objective, kr)`; derive `{bgColor, textColor, borderLeft}` from status string. ~15 LoC + regression test extending -01 PART 8 vm-sandbox to assert CSS class strings (not just no-throw). Lands in S27 amendment OR S26 burndown per Q-P3 resolution at next /strategy.

### Companion strategic observations (NOT minted — captured in input doc)

1. **NEW 3-step "Create Objective with AI" wizard** observed alongside existing AI OKR generation flow. User flagged for unification analysis — find/compare/impact-analyze.
2. **Category Coverage widget** at top of objectives.html (1/6 covered + 5-categories nag banner) — user direction: remove, since strategic shift is "individual objectives created by BOs/consultants/managers", not gap-filling a 6-bucket matrix.
3. **Cascade hierarchy standardization** — user direction: "look at the strategic shift in the way we approach objective → KRs → quarterly goals → weekly goals → daily tasks — see if we have standardized this, if not its time."
4. **"Different objective"** mentioned by user, didn't see it on page — needs clue (term to grep) before next session.

All 4 captured in [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md) v1 with research deliverables + Q-gates ready for /strategy session.

### Pre-flight Q-gates (cleanup + testing)

| Q | Subject | Greenlight |
|---|---|---|
| WQ1 | Cleanup target DB | a (.env.preprod → karvia_business_preprod) |
| WQ2 | Email scope | b (surgical rsm@karvia.ai only, not full 5-email cohort) |
| WQ3 | Orphan handling | b (probe-first + dynamic COMPANY_IDS, eliminates leak) |
| TQ1 | /testing pivot scope | (a) defer testing entirely, research+audit mint only |
| TQ2 | Research execution mode | (a) all 4 RPs next /strategy session |
| TQ3 | Audit-ID minting policy | (a) standard A20260526-NN for any defects surfaced |
| TQ4 | "Different objective" clarification | DEFERRED — need user clue at /strategy start |
| TQ5 | Cleanup script disposition | (a) commit as permanent surgical-per-email cleanup utility |

### Files touched (3 modified + 1 new + 1 strategic-input)

| Surface | Type | LoC delta |
|---|---|---|
| [scripts/cleanup-rsm-tenant.js](../../../scripts/cleanup-rsm-tenant.js) | new | +140 (probe-first + dynamic COMPANY_IDS + by-user-ref sweep + post-verify) |
| [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) | modified | Summary counters + new comment + new ## OPEN section + Status Matrix row for -26-01 |
| [SPRINT26_HANDOFF_DOCUMENT.md](SPRINT26_HANDOFF_DOCUMENT.md) (this doc) | modified | leading HTML comment + this /testing section + @GENOME date 2026-05-25 → 2026-05-26 |
| [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md) | new | strategic-input doc with 4 RPs + Q-gates |
| [.claude/SESSION_LOG.md](../../../.claude/SESSION_LOG.md) | modified | session #259 entry |

No code touched (per `feedback_no_destructive_without_greenlight`).

### Counter delta

| Bucket | Before | After | Δ |
|---|---|---|---|
| Medium OPEN | 10 | 11 | +1 (A20260526-01 mint) |
| Total | 186 | 187 | +1 |
| Sprint 26 firing | 15/24 | 15/24 | 0 (bug-fix not firing) |

### Memory rules applied

- `feedback_no_destructive_without_greenlight` — 3 wipe Q-gates + 7 walkthrough Q-gates + 5 pivot Q-gates all greenlit before action
- `feedback_audit_governance` — A20260526-01 minted 3-places-atomic (Summary + comment + Status Matrix row); stable ID format `A{YYYYMMDD}-{nn}`
- `feedback_quote_the_canon` — smoking gun "4 KRs on track / 0 pending" footer vs all-red KR rows quoted line-by-line from screenshot; full user direction quoted verbatim in [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md)
- `feedback_extend_before_wrap` — A20260526-01 fix direction = extend existing `calculateKRRiskStatus` consumer path (not new color service); cleanup script extends fixture-wipe pattern with probe-first
- `feedback_minimal_change_grounding` — surgical wipe scoped to rsm@karvia.ai only (not full 5-email cohort wipe); research-only audit-mint posture (no code touched)
- `feedback_read_helper_before_consuming` — A20260526-01 IS the sibling-sweep-miss class; lesson reinforced for /strategy execution
- `feedback_test_fixture_validation` — cleanup script probes schema BEFORE delete fires; reads users.email + companies.created_by + users.company_id to enumerate dynamic ID set

### Next session recommendation

**Primary**: `/strategy` — execute [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](../SPRINT-27-First-Task/OBJECTIVES_PAGE_STRATEGIC_INPUT.md) RP1-RP4 read-only, surface Q-gates with options, amend S27 master plan (or create S28 Workstream) based on user resolutions. Ask user TQ4 ("different objective") clarification at session start.

**Secondary** (if /strategy backlogs): `/coding` ship A20260526-01 fix (~15 LoC + test) as S26 burndown — small, mechanical, closes the -01 ship completion gap without strategic-evaluation dependency.

**Tertiary**: `/audit` methodology sweep — A20260526-01 demonstrates that PART 7/8 vm-sandbox upgrade pattern (from -04 hotfix) still misses CSS-class assertions. Extend the pattern to assert rendered class strings, not just no-throw. Apply across S26 regression suite.

### Quality reflection — 8/10

**Strong**: clean pivot mid-session without scope creep; surgical-cleanup tool minted as permanent utility solving A20260518-01 P3 leak class; -01 sibling-sweep miss caught at first browser observation; strategic input doc captures user direction verbatim with research deliverables + Q-gates ready.

**Weak**: -01 was declared "✅ FIXED" 2026-05-20 but only patched the counter; the per-row CSS visual gap demonstrates that the upgraded PART 7/8 vm-sandbox tests don't probe CSS-class assertions — methodology gap. The -01 + #258 sibling sweeps both missed this consumer path.

**Smaller**: would normally start /strategy work in this session per `feedback_minimal_change_grounding` — but user direction was explicit "let's close this session" → next session is the right boundary for the research work.

### Sprint 26 status (UNCHANGED — A20260526-01 is bug-fix not firing)

15/24 (62.5%) — A 4/4 ✅ · B 9/9 ✅ · C 5/6 · D 0/2 · E 4/4 ✅

---

## /coding — 2026-05-25 (A20260520-02 + A20260520-05 shared-helper burndown — promoted from refinement-track, 2 audit IDs 📝→💻→✅ in single session · 69/69 ✓ regression)

### Trigger

/init flagged A20260520-02 + A20260520-05 as **Secondary** coding option (both 📝 PLAN — DEFERRED to refinement-track per 2026-05-20 /testing user direction "lets fix this later"). User selected this slice over /testing-Gates-10-12 walkthrough and /audit-on-regression-methodology-class. Per `feedback_no_destructive_without_greenlight`, scope + 7 pre-edit Q-gates surfaced before first edit; user greenlit `a/b/a/a/a/b/a` (promote, load-all-children FE, both surfaces, reuse calculateKRRiskStatus vocabulary, additive new methods, pure+consumer-invocation tests, single commit).

### Pre-edit reality-check (changed scope estimate)

Audit's "~30 LoC" estimate assumed `kr.quarterly_goals[].weekly_goals[].tasks[]` tree was populated on planning-v2 render. Per `feedback_read_helper_before_consuming`, verified the actual data shape pre-edit at [planning-v2.js:152-247](../../../client/pages/scripts/planning-v2.js#L152-L247) — only `objective.key_results[]` arrives from `/api/objectives`, and `weeklyGoals[]` is loaded only for the SELECTED KR via `/api/weekly-goals/:krId`. Non-selected KR cards have no children tree at render. Q2 surfaced this reality and offered three resolutions; user picked (b) load-all-children fan-out. This expanded the LoC budget but kept the fix complete on all KR cards (not partial-only-selected).

### Pre-edit Q-gate matrix (7 surfaced, all greenlit)

| Q | Subject | Greenlight |
|---|---|---|
| Q1 | Promote -02 + -05 from DEFERRED → active firing this session | a (promote) |
| Q2 | Data-shape strategy given planning-v2 doesn't have tree pre-loaded | b (load-all-children fan-out FE, ~40 LoC + N parallel calls) |
| Q3 | Sibling sweep to objectives.js (same gap on top-tile + KPI strip) | a (both surfaces this commit) |
| Q4 | Status pill vocabulary (drop legacy NOT_STARTED?) | a (reuse `calculateKRRiskStatus` output via `getStatusLabel`) |
| Q5 | Helper signature pattern | a (additive new methods + backward-compat 3rd arg on existing) |
| Q6 | Regression test shape | b (pure-helper + vm-sandbox consumer-invocation per -04 upgrade) |
| Q7 | Commit shape | a (single commit bundles both audit IDs) |

### Calculator extensions (additive, backward-compat preserved)

[client/pages/scripts/objective-calculator.js](../../../client/pages/scripts/objective-calculator.js):

- **NEW `calculateKRProgressFromChildren(kr, goals)`** — pure children-rollup averaging `goal.progress_percentage` over non-cancelled goals; returns `null` (not 0) when no goals so caller falls back to metric-based cleanly. Clamps to 0..100. NaN entries treated as 0.
- **NEW `calculateObjectiveProgressFromKRs(objective, keyResults, progressResolver=null)`** — averaged via caller-supplied resolver; default resolver preserves metric-based `calculateKRProgress` semantics for existing callers; clamps + NaN-safe.
- **EXTENDED `calculateKRRiskStatus(objective, kr, overrideProgress=null)`** — optional 3rd arg lets caller pass children-rolled-up progress to drive the status pill. Backward-compat: existing 2-arg callers unchanged. Closes A20260520-02 by routing the NOT_STARTED pill through temporal-aware risk math against the rolled-up override.
- **EXTENDED `countKRRiskStatuses(objective, keyResults, progressResolver=null)`** — optional resolver routes bucket counts through rolled-up progress.
- **EXTENDED `getStatusLabel`** map — adds `'at-risk' → 'At risk'` + `'pending' → 'Not started'` entries (covers `calculateKRRiskStatus` output vocabulary).

### Consumer wiring — planning-v2.js

[client/pages/scripts/planning-v2.js](../../../client/pages/scripts/planning-v2.js):

- Module-scope `const krRolledProgress = new Map()` cache (kr._id → rolled progress | null).
- NEW `async function loadKRChildrenForObjective(krs)` — fan-out `/api/weekly-goals/:krId` per KR in parallel via existing endpoint; cache `calculateKRProgressFromChildren` output per KR. Per-KR failures degrade to `null` (caller falls back to metric).
- Wired into `selectObjective` after `loadKeyResults` and before any render.
- NEW `function resolveKRProgress(kr)` — resolver helper returning rolled progress or null.
- `renderObjectives` routes selected-objective tile via `calculateObjectiveProgressFromKRs` with resolver that falls back to metric per-KR (non-selected tiles retain metric-based `obj.progress` — out of scope for this slice).
- `renderKeyResults` routes KR card progress bar via `resolveKRProgress` + metric fallback; KR status pill derives from `calculateKRRiskStatus(parentObjective, kr, rolled)` override path; drops legacy `kr.status || 'in-progress'` literal.

### Consumer wiring — objectives.js sibling sweep

[client/pages/scripts/objectives.js](../../../client/pages/scripts/objectives.js):

- Module-scope `const krRolledProgress = new Map()` (same pattern).
- NEW `async function loadKRChildrenForAllObjectives(objectives)` — fan-out across every KR of every objective in parallel; awaited inside `loadObjectives` BEFORE the first render so KPI strip + cards see the same source-of-truth.
- NEW `function effectiveKRProgress(kr)` — rolled with metric fallback in single call.
- `calculateStats` (KPI strip avg + label) routes via `calculateObjectiveProgressFromKRs`.
- `createObjectiveCard` card progress + allKRsCompleted check route via rolled-up math.
- `renderKeyResultsPreview` (in-card KR rows) + `renderKeyResultRow` (modal KR rows) use `effectiveKRProgress`.
- `renderSummaryStats` passes resolver to `countKRRiskStatuses`; legacy fallback branches also route through `effectiveKRProgress`.
- `getFilteredObjectives` (at-risk / on-track filter classification) routes via local `objectiveEffectiveProgress(obj)` so filter buckets match what's visible on cards.

### Companion verification (no probe needed)

Per audit's bonus check + `feedback_read_helper_before_consuming`, source-traced [tasks.js:441](../../../server/routes/tasks.js#L441) `task.updateStatus('completed')` cascade BEFORE first edit. Confirmed: response returns `goal_updated.new_progress`, meaning Goal.progress IS updated server-side post-task-complete. The cascade gap was at FE-bubble (KR + Objective) not at Task → Goal. Option (A) FE-rollup is sufficient; no BE cascade-on-write needed.

### Regression test ship

NEW [scripts/test-sprint26-A20260520-02-and-05-kr-objective-rollup.js](../../../scripts/test-sprint26-A20260520-02-and-05-kr-objective-rollup.js) — **69/69 ✓** across 8 PARTs:

| PART | Coverage | Assertions |
|---|---|---|
| 1 | Helper signatures + audit-ID threading | 7 |
| 2 | `calculateKRProgressFromChildren` pure math (vm-sandbox) — incl. SMOKING GUN "1 complete out of 2 → 50%" matching audit screenshot | 10 |
| 3 | `calculateObjectiveProgressFromKRs` pure math — incl. SMOKING GUN "1 KR rolled to 50%, 3 KRs at 0% → 12-13%" | 7 |
| 4 | `calculateKRRiskStatus` override backward-compat + clamp + NaN + active-window matrix | 9 |
| 5 | `countKRRiskStatuses` resolver + `getStatusLabel` new vocab | 7 |
| 6 | planning-v2.js consumer wiring (fan-out + resolver routing + script-tag order) | 11 |
| 7 | objectives.js consumer wiring (sibling sweep across 6 consumer sites) | 12 |
| 8 | vm-sandbox `renderSummaryStats` invocation under populated cache (extends -04 static-grep-without-invocation upgrade) — `k1=100` shifts counter to "completed" | 6 |

### A20260520-01 backward-compat amendment

Two stale assertions in [scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js) broke after my optional-arg signature extension:
- Lines 65-68 signature regex anchored on 2-arg form → relaxed to `(?:,[^)]*)?` trailing-args tolerance
- Line 230 call-site regex anchored on `(objective, keyResults)` literal close-paren → relaxed
- PART 7 vm-sandbox referenced new module-scope helpers `resolveKRProgress` / `effectiveKRProgress` that don't exist in -01's sandbox → injected no-op stubs (returns null → falls back to metric)

Per `feedback_audit_governance`, this is test-maintenance for a backward-compat signature extension, not a separate defect — documented inline in -01 test, NOT minted as -02b/-05b. After amendment: -01 56/56 ✓ preserved.

### Sibling regression sweep (zero new collateral)

All S26 audit-ID regression scripts post-edit:
- -01 56/56 ✓
- -02-and-05 69/69 ✓ (NEW)
- -03 41/41 ✓
- -10 / -11-part2 / -11 / -12-13/-14/-15/-16a/-17 / -13-05-06-06b / -13-08a / -14-02..-09 / -14-10/-11/-12 / -15-02 / -15-04 / -16-01 / -16-02 / -17-01 / -17-02 / -18-01..-04 all ✓

Pre-existing -12-18-19 8/9 ✗ failure UNCHANGED (verified via `git stash` round-trip pre/post my edits — same single static-grep-without-invocation false-negative the handoff already flagged on -04 sub-finding; deferred to /audit methodology sweep).

### Files touched (4 modified + 1 new)

| Surface | Type | LoC delta |
|---|---|---|
| [client/pages/scripts/objective-calculator.js](../../../client/pages/scripts/objective-calculator.js) | modified | +90 (additive helpers + signature extensions) |
| [client/pages/scripts/planning-v2.js](../../../client/pages/scripts/planning-v2.js) | modified | +75 (cache + fan-out + resolver + 2 render-site wirings) |
| [client/pages/scripts/objectives.js](../../../client/pages/scripts/objectives.js) | modified | +90 (cache + fan-out + resolver + 6 consumer-site wirings) |
| [scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js) | modified | +8 (backward-compat regex relaxation + sandbox stubs) |
| [scripts/test-sprint26-A20260520-02-and-05-kr-objective-rollup.js](../../../scripts/test-sprint26-A20260520-02-and-05-kr-objective-rollup.js) | new | +312 (8 PARTs, 69 assertions) |

No BE / no schema / no migration / no cascade-on-write refactor.

### Counter delta

| Bucket | Before | After | Δ |
|---|---|---|---|
| Medium OPEN | 12 | 10 | −2 (-02 + -05 flipped) |
| Medium FIXED | 17 | 19 | +2 |
| Total | 186 | 186 | 0 (status migration only) |
| Sprint 26 firing | 15/24 | 15/24 | 0 (bug-fix not firing) |

### Memory rules driving

- `feedback_no_destructive_without_greenlight` — 7 Q-gates greenlit before first edit; data-shape reality-check surfaced pre-edit
- `feedback_extend_before_wrap` — additive helpers + optional-arg extensions on existing canonical service; NO new RollupService / RegistryService / adapter
- `feedback_minimal_change_grounding` — backward-compat 3rd-arg over new helper proliferation; `getStatusLabel` extended in-place
- `feedback_reuse_max` — composes existing `/api/weekly-goals/:krId`, `calculateKRProgress`, `calculateKRRiskStatus`, `calculateExpectedProgress` — no new routes
- `feedback_audit_governance` — 3-stage PLAN → CODE → ✅ TESTS atomic in single session; 3-places-atomic update (Summary + comment + Status Matrix rows)
- `feedback_read_helper_before_consuming` — planning-v2 actual data-shape verified pre-edit; caught audit's optimistic "tree populated" assumption
- `feedback_quote_the_canon` — smoking gun "1 complete out of 2" quoted in PART 2 SMOKING GUN assertion + "1 KR rolled, 3 zero → 12-13%" in PART 3
- `feedback_test_fixture_validation` — pure-helper math via vm-sandbox; no Mongoose Model.create

### Next session recommendation

**Primary: `/testing` 2026-05-26** — pick up Gates 10-12 push that stopped 2026-05-20; verify -02 + -05 fix landed (KR cards on planning-v2 should now show "On track" + non-zero progress when child weekly goals have completed work). Also explicitly walk Test 2.3 (A20260520-03 chore complete cascade → KR/Objective bar update — should now flow end-to-end), Test 2.1 (-01 grace-window math), Test 1.1 (-04 closure).

**Secondary**: `/audit` static-grep-without-invocation methodology sweep — applies the -04 sub-finding + -12-18-19 8/9 pattern to all S26 regression scripts; upgrades them to vm-sandbox invocation tests where applicable.

**Tertiary**: `/strategy` multi-assessment tracking 7 Q-gates ([MULTI_ASSESSMENT_TRACKING_STRATEGY_INPUT.md](MULTI_ASSESSMENT_TRACKING_STRATEGY_INPUT.md)) — queued for resolution.

### Quality reflection — 9/10

**Strong**: Pre-edit data-shape grounding (`feedback_read_helper_before_consuming`) caught audit's optimistic "~30 LoC tree-populated" assumption before line 1 of code. Q-gate surface allowed user to course-correct on Q2 (fan-out vs partial-fix vs BE-rollup). Backward-compat preserved on every signature extension (zero existing-caller breakage). Single-shot ship across 4 modified surfaces + 1 new test with zero new sibling collateral. -01 test amendment isolated to backward-compat regex relaxation + sandbox stubs, not a real defect.

**Weak**: The fan-out fetch cost on objectives.html could become heavy on large portfolios (10 objectives × 4 KRs = 40 parallel calls). Acceptable per Q2=b user choice for this slice but a Q-MAT-style refinement-track ticket may be warranted if a 50-objective portfolio surfaces post-Beta. Non-selected objective tiles on planning-v2 still show metric-based progress — out of scope per slice budget, surfaces as a soft regression-track item if user complains.

**Smaller**: Test PART 8's vm-sandbox extraction is regex-fragile (relies on `function renderSummaryStats\([\s\S]*?\n\}\n` matching exactly one closing brace pattern); could break if future edits use multi-line block braces. Defensible because PART 6/7 also static-grep for the wiring; PART 8 is the invocation backstop.

### Sprint 26 status (UNCHANGED — -02 + -05 are bug-fix not firing)

15/24 (62.5%) — A 4/4 ✅ · B 9/9 ✅ · C 5/6 · D 0/2 · E 4/4 ✅

---

## /testing — 2026-05-20 (post-hotfix walkthrough + tenant wipe — 1 audit ID minted, no code)

### Trigger

User-fired `/testing` immediately after `/coding-hotfix` push (commit `7f75ae3` deployed to karvia-business-1). Goal: verify A20260520-04 closure on objectives.html, re-walk Gates 7-9 to validate -01 + -03 in browser, push into Gates 10-12 to attempt First Objective Created acceptance closure.

### Pre-flight Q-gates (6 surfaced, all greenlit)

| Q | Subject | Greenlight |
|---|---|---|
| Q1 | Scope = verify -04 → Gates 7-9 → Gates 10-12 | (a) yes |
| Q2 | Env = karvia-business-1 preprod (commit 7f75ae3) | (a) yes |
| Q3 | Zero code touched (fixture extension greenlit pre-write if needed) | (a) yes |
| Q4 | New mints prefixed `A20260520-NN` (next free = -05) | (a) yes |
| Q5 | File-and-halt: mint inline + continue walking, no mid-session /coding break | (a) yes |
| Q6 | Walk on current tenant `56a38f` (chain-clean from 2026-05-18 walkthrough), skip wipe pre-flight | (a) yes |

### Walkthrough results

| Phase | Test | Result |
|---|---|---|
| 1 — A20260520-04 closure | objectives.html renders for BO (no JS ReferenceError, no red toast) | ✅ implicitly silent-green (user proceeded to planning-v2 without surfacing crash again) |
| 2 — A20260520-01 grace-window math | KR pills show on-track (not all-red) at Week 1/13 | ⏭️ not explicitly walked (user moved past objectives to planning-v2) |
| 2 — A20260520-03 chore actions | Employee ✓ Complete + ⏸ Postpone wired | ⏭️ not explicitly walked this session |
| 3 — Gate 11 planning-v2 KR cascade | KR progress bars + status reflect completed work | 🟠 **A20260520-05 minted** — progress-bar cascade gap (companion to -02 label-stale) |

### Audit IDs minted (📝 PLAN, no code touched per Q3 + `feedback_no_destructive_without_greenlight`)

| ID | Severity | Surface | Disposition |
|---|---|---|---|
| `A20260520-05` | MEDIUM | planning-v2 KR/Objective progress-bar cascade | **DEFERRED to refinement-track** per user direction "add this bug lets fix it later" |

### Smoking-gun evidence for A20260520-05

Screenshot 2026-05-20 (`planning-v2.html` as BO String Clinet):

- KR 1 panel header: "Weekly Goals · 4 weeks · **0% complete**"
- Sub-rollup line: "May 2026 · 2 weeks · 2 goals · **1 complete**"
- Week 21 (This Week, May 19-24) progress bar: **0%**
- Week 22 (May 26-31) progress bar: **0%**
- KR 1 left rail: **0% NOT_STARTED**
- Objective 1 (top-left card "Reduce production d..."): **0% Week 1/27**

**Contradiction**: 1 weekly goal IS marked complete (rollup count confirms) but completion doesn't propagate to (a) week-row progress bar, (b) KR.progress, (c) Objective.progress.

### Distinction held: -05 vs -02

- `A20260520-02` (already deferred) — KR.STATUS LABEL stays "NOT_STARTED" pill — **cosmetic**
- `A20260520-05` (newly minted) — KR.progress + Objective.progress + Week.progress BARS stay 0% — **functional progress display gap**

Both share root cause: no rolled-up child compute on FE planning-v2 render. **Likely close with one shared helper** per `feedback_extend_before_wrap`:

```
ObjectiveCalculator.calculateKRProgressFromChildren(kr, goals)
ObjectiveCalculator.calculateObjectiveProgressFromKRs(objective, krs)
```

~30 LoC FE, no BE / no schema / no cascade-on-write refactor. Closes -02 + -05 in one commit. Mirrors A20260520-01 helper-extraction precedent.

### Tenant wipe (session-end cleanup)

User direction: "let's clean up all the emails, IDs, companies, objectives we've created. Let's redo testing tomorrow again."

**Path A chosen** (accept orphan leak per documented A20260518-01 P3 deferral; full P3 wipe-everything-except-consultant mode remains refinement-track):

```bash
node scripts/delete-journey-fixture.js
```

**Results** (against `karvia_business_preprod`):

| Stage | Count | Notes |
|---|---|---|
| Pre-flight cascade re-probe by company_id | 0 | Expected — fixture has 2026-05-18 IDs hardcoded; today's tenant 56a37c/56a38f mismatch |
| Cascade deleted by company_id | 0 | Same — orphans today's Company/Objective/KR/Goal/Task/Team docs |
| Companies deleted by ID | 0 | Same — stale ID match |
| Users deleted by ID | 0 | Same |
| **Users deleted by email (belt-and-braces)** | **5** ✓ | All 5 today's users caught: rsm@karvia.ai + stringsounds + sagar + essenceofmrs + manjunath.rs |
| Post-verify users matching emails | 0 ✓ | Clean |

**Net DB state**: 5 user accounts gone + their owned assessments/goals/tasks/invitations gone. Today's Company docs (RSM Consulting `56a37c` + String Client `56a38f`) + objectives + KRs + weekly goals orphan inertly — no user references remain to reach them. **Tomorrow's signup as rsm@karvia.ai creates fresh tenant unaffected by orphans.**

### Counter deltas

| Severity | OPEN | FIXED |
|---|---|---|
| Medium | 11 → **12** (+1 from -05 deferred) | 17 unchanged |
| High | 12 unchanged | 32 (-04 closed this AM) |
| Total | 185 → **186** (+1 mint) | — |

### Sprint 26 firing status (UNCHANGED — -05 is bug-fix not firing sub-slice)

15/24 (62.5%) — A 4/4 ✅ · B 9/9 ✅ · C 5/6 · D 0/2 · E 4/4 ✅

### Branch + DB state at session end

- Working tree: [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) (-05 mint 3-place) + this handoff
- Zero code edits this session (fixture wipe ran existing script unmodified)
- DB state: tenant 56a38f wiped at user level (5 users gone); Company + objective + cascade docs orphan per Path A
- Pending commit at session close: doc-only updates from earlier hotfix block + this session

### Memory rules driving today

- `feedback_no_destructive_without_greenlight` — 6 pre-walkthrough Q-gates greenlit + explicit greenlight for Path A wipe before fire
- `feedback_audit_governance` — A20260520-05 minted atomically in 3 places (Summary counters + comment + Status Matrix)
- `feedback_quote_the_canon` — smoking-gun "1 complete" rollup vs 0% bars quoted line-by-line before scope claim
- `feedback_extend_before_wrap` — -05 fix direction = extend existing ObjectiveCalculator helper pattern, NOT new cascade service
- `feedback_minimal_change_grounding` — shared helper subsumes -02 + -05 in single ~30 LoC FE change
- `feedback_test_fixture_validation` — wipe script unchanged; pre-flight re-probe drift-check + post-delete verification both clean

### Next session recommendation

**Primary: `/testing` 2026-05-21** — fresh restart from Gate 1 (consultant signup) on karvia-business-1 post-wipe; walk all gates end-to-end including:
- Gates 1-6 trust-baseline (verified Beta-stable 2026-05-20)
- Gate 7 A20260520-01 grace-window verify (smoking gun was Week 1/13 → 4 on-track)
- Gate 7 A20260520-04 closure verify (objectives.html no JS crash) — explicit walk this time
- Gate 8 planning-v2 — document baseline state (will reproduce -05 progress-bar gap)
- Gate 9 A20260520-03 Employee chore actions verify (✓ + ⏸ wired, cascade fires)
- Gates 10-12 push to First Objective Created acceptance closure

**Secondary**: `/coding` to ship shared `calculateKRProgressFromChildren` helper closing -02 + -05 in single commit (~30 LoC FE) — fast win, no BE/schema risk.

**Tertiary**: `/audit` to sweep static-grep-without-invocation false-negative class across all S26 regression scripts (sub-finding from -04 hotfix; methodology audit deferred).

### Quality reflection — 7/10

**Strong**: Mid-walkthrough surfacing of -05 captured cleanly with smoking-gun screenshot + canon-trace + cross-link to -02. Same-day -04 hotfix shipped before /testing started → -04 closure implicitly verified by user not re-surfacing the crash. Wipe path selected pragmatically (Path A vs B) — no over-engineering on a deferred-leak track.

**Weak**: Walkthrough stopped at Phase 3 Test 3.2 (planning-v2 progress-bar gap) before completing Gates 10-12 push. First Objective Created acceptance closure not validated this session. Author + Hand-off verbs of the 5-verb test remain unconfirmed at functional Beta level. Test 1.1 (-04 closure) + Test 2.1 (-01 grace-window math) + Test 2.2 (-03 chore actions) all implicitly silent-green by user not surfacing them, but not explicitly walked — soft signal not hard signal.

**Smaller**: A20260520-05 mint shares the same fix path as -02 (already deferred) — could argue for extending -02's scope vs minting -05 as separate ID per `feedback_extend_before_wrap`. Chose to mint as separate ID because: (i) -02 is label-stale (cosmetic) while -05 is progress-bar-stale (functional) — different observable symptoms; (ii) governance benefit of separate IDs for the two regression-tests when fix ships; (iii) per `feedback_audit_governance` stable-IDs principle. Defensible either way.

### Sprint 26 status (UNCHANGED — -05 is bug-fix not firing)

15/24 (62.5%) — A 4/4 ✅ · B 9/9 ✅ · C 5/6 · D 0/2 · E 4/4 ✅

---

## /coding-hotfix — 2026-05-20 (A20260520-04 objectives.html render crash — mint + ship)

### Trigger

User opened `/pages/objectives.html` as BO (`String Clinet` tenant, `karvia-business-1.onrender.com`) post-deploy of earlier 2026-05-20 /coding double-slice ship → red toast "Failed to load objectives" + console `Uncaught ReferenceError: objective is not defined` at [client/pages/scripts/objectives.js:584](../../../client/pages/scripts/objectives.js#L584). Stack: `renderSummaryStats:584 → createObjectiveCard:432 → renderObjectives:252/251 → loadObjectives:61 → initializeObjectivesPage:38`. Page fell back to "No Objectives Yet" empty state despite KPI strip rendering KR=0 / AI=0 (which itself is wrong because objectives ARE persisted). **Beta-blocker** — every BO/EXEC/MANAGER on karvia-business-1 has a broken objectives page until redeploy.

### Pre-edit Q-gates (3 surfaced, all greenlit)

| Q | Subject | Greenlight |
|---|---|---|
| Q1 | Scope = ship same session as hotfix (vs PLAN+next-/coding) | (a) ship — Beta-blocker |
| Q2 | Severity bundling — HIGH or CRITICAL? | (a) HIGH — data persisted, no auth bypass, just render-throw |
| Q3 | Test extension — PART 7 only, or audit-all-scripts methodology sweep? | (a) PART 7 only — methodology sweep belongs in next /audit |

### Root cause

A20260520-01 (shipped earlier same day) added the velocity-aware helper call inside `renderSummaryStats`:

```js
const counts = window.ObjectiveCalculator.countKRRiskStatuses(objective, keyResults);
```

But the function signature was:

```js
function renderSummaryStats(keyResults, hasStarted = true) { ... }
```

And the single call site at line 432 only forwarded `(objective.key_results || [], hasStarted)`. `objective` was never a parameter → undefined inside the function → throw on every `createObjectiveCard` invocation with non-empty objectives.

### Why A20260520-01's 42/42 ✓ regression missed it

PART 4 at [test-sprint26-A20260520-01-objective-at-risk-temporal.js:229-232](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js#L229) static-grepped:

```js
/window\.ObjectiveCalculator\.countKRRiskStatuses\(objective,\s*keyResults\)/.test(objSrc)
```

The regex was satisfied because the literal text exists in source. But the test never **vm-invoked** `renderSummaryStats` to verify `objective` resolved in scope. Same class of false-negative the handoff already flagged for -18-19 + B.6 (static-grep-without-invocation).

### Impact sweep (before edit)

| Surface | Status |
|---|---|
| `renderSummaryStats` callers | **1 site only** (objectives.js:432) |
| `countKRRiskStatuses` / `calculateKRRiskStatus` consumers | **1 page only** (objectives.html) |
| planning-v2.js / dashboard-v2.js / team-ssi-view.js / weekly-goals.html | All untouched — still using legacy thresholds (A20260520-02 deferred territory) |
| Other 40+ `objective.` refs in objectives.js | All inside functions that explicitly take `objective` as param (`formatDateRange`, `createObjectiveCard`, `populateObjectiveModal`, `renderObjectiveOwnerBadge`) |

**Blast radius = 1 site, 1 function. Contained.**

### Fix shipped (3 LoC code + ~80 LoC test extension)

1. **Signature** [objectives.js:573](../../../client/pages/scripts/objectives.js#L573):
   ```js
   function renderSummaryStats(objective, keyResults, hasStarted = true) {
   ```
   JSDoc updated to document the new param.

2. **Call site** [objectives.js:432](../../../client/pages/scripts/objectives.js#L432):
   ```js
   ${renderSummaryStats(objective, objective.key_results || [], hasStarted)}
   ```

3. **Truthiness guard** [objectives.js:583](../../../client/pages/scripts/objectives.js#L583):
   ```js
   if (objective && window.ObjectiveCalculator && typeof window.ObjectiveCalculator.countKRRiskStatuses === 'function') {
   ```
   Defensive — if any future stale caller forgets the new arg, it falls back to legacy threshold (line 605+) instead of throwing.

### Test extension PART 7

Added to [scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js:286-372](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js#L286):

- Extracts `renderSummaryStats` + dependency `calculateKRProgress` function bodies via regex
- Evals into `vm.createContext` with stubbed `window.ObjectiveCalculator`
- Invokes under 4 scenarios:
  - Populated objective + KRs (smoking-gun reproduction) → must NOT throw
  - Empty KRs → must return "No key results" string
  - Null objective → must fall back to legacy threshold (NOT throw — guard works)
  - hasStarted=false → must NOT throw, returns "Starts soon" branch
- 4 static-grep guards on the new signature/call-site/truthiness-guard/audit-ID

PART 7 adds **+14 new assertions** (~85 LoC test code). The signature + call-site assertions in PART 7 would have failed on the pre-fix code → catches this regression class.

### Test totals

| Script | Result |
|---|---|
| `test-sprint26-A20260520-01-objective-at-risk-temporal.js` (extended) | **56/56 ✓** (was 42/42) |
| `test-sprint26-A20260520-03-employee-chore-actions.js` | 41/41 ✓ |
| `test-sprint26-A20260518-01-kpi-list-drift.js` | 22/22 ✓ |
| `test-sprint26-A20260518-02-manager-fe-affordance.js` | 20/20 ✓ |
| `test-sprint26-A20260518-03-question-filter-dispatch.js` | 28/28 ✓ |
| `test-sprint26-A20260518-04-default-team-filter.js` | 17/17 ✓ |
| **Total** | **184/184 ✓ across 6 scripts, zero collateral** |

### Sub-finding (documented inline, NOT minted as -04b)

Regression-test design gap — A20260520-01 PART 4 static-grep-without-invocation pattern is likely present across multiple other [scripts/test-sprint26-*.js](../../../scripts/). Audit-all-scripts methodology sweep deferred to next `/audit` session per Q3(a). PART 7 demonstrates the upgrade pattern future audit-ID tests should follow.

### Counter deltas

| Severity | OPEN | FIXED |
|---|---|---|
| High | 12 → **12** (mint+ship same session) | 31 → **32** (+1 from -04 ✅) |
| Total | 184 → **185** | — |

### Sprint 26 firing status (UNCHANGED — -04 is bug-fix not firing sub-slice)

15/24 (62.5%) — A 4/4 ✅ · B 9/9 ✅ · C 5/6 · D 0/2 · E 4/4 ✅

### Branch + DB state at session end

- Working tree: [client/pages/scripts/objectives.js](../../../client/pages/scripts/objectives.js) (3 LoC) + [scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js](../../../scripts/test-sprint26-A20260520-01-objective-at-risk-temporal.js) (+85 LoC) + [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) (Summary + comment + Status Matrix) + this handoff
- 1 commit pending push
- DB state UNCHANGED — pure FE+test fix

### Memory rules driving today

- `feedback_minimal_change_grounding` — 3 LoC code + test extension, no redesign, no helper extraction, no new file
- `feedback_extend_before_wrap` — PART 7 extends existing test (NOT new test file)
- `feedback_no_destructive_without_greenlight` — impact sweep surfaced 1-site contained blast radius BEFORE first edit; 3 pre-edit Q-gates surfaced; user greenlit "this is a blocker — let's fix it and ship it"
- `feedback_test_fixture_validation` — vm-sandbox + extracted function bodies via regex; no Mongoose Model.create
- `feedback_quote_the_canon` — smoking-gun stack trace quoted verbatim line-by-line before scope claim
- `feedback_read_helper_before_consuming` — re-grounded yesterday's "static-grep proves consumer wiring" assumption; PART 4's regex satisfaction was insufficient evidence; PART 7 is the read-helper-actual-logic upgrade

### Next session recommendation

**Primary: user-fired manual smoke** on karvia-business-1 post-deploy:
1. Login as BO (String Clinet tenant)
2. Open `/pages/objectives.html`
3. Confirm objectives render (no red toast, no console error)
4. Confirm KRs show "4 on track / 0 at risk" (Week 1/13 = grace window, per A20260520-01 fix)

**Secondary: `/testing`** re-walk Gates 7-9 to confirm A20260520-01 + -03 + -04 all functionally green, then push into Gates 10-12 (planning-v2 cascade · weekly task transitions · first-objective acceptance closure) per 2026-05-20 /testing deferred queue.

**Tertiary: `/audit`** — sweep all S26 regression scripts for static-grep-without-invocation false-negative class (documented inline above as -04 sub-finding; surface as new audit-scope ID e.g. `A20260521-01` REGRESSION-TEST-DESIGN-AUDIT).

### Quality reflection — 9/10

**Strong**: User-surfaced bug → root cause + impact sweep + minimal fix proposal + escalation framing (HIGH→CRITICAL Beta-blocker class) inside one round-trip before first edit. Test extension PART 7 ships in same commit as the code fix → catches the class going forward, not just this instance. 56/56 ✓ on first re-run (caught and self-fixed the missing `calculateKRProgress` sandbox-dependency).

**Negative**: Same-day regression from A20260520-01 means -01's test design was inadequate. The "10 pre-edit Q-gates + 1 impact-analysis reversal" cited in -01's quality reflection looked thorough but missed the "actually invoke the function in vm-sandbox" guard. Sub-finding documented inline (regression-test design gap) but not minted — borderline call; could argue for -04b mint to enforce the methodology audit.

### Sprint 26 status (UNCHANGED — -04 is bug-fix not firing)

15/24 (62.5%) — A 4/4 ✅ · B 9/9 ✅ · C 5/6 · D 0/2 · E 4/4 ✅

---

## /testing — 2026-05-20 (Gates 7-9 + Employee Tasks deep-dive — 3 audit IDs minted, no code)

### Trigger

User-invoked `/testing` after 2026-05-19 quadruple-slice burndown sealed (87/87 ✓). Q-kickoff scope per handoff §269-280: re-walk Gates 5-8 to validate the 4 fixes, then push into deferred Gates 9-12 (objective creation → planning-v2 cascade → task creation → first-objective acceptance). User re-scoped mid-discussion ("Email works, which we are sure. Other than the invite, I think we need to test the flow") to trust-baseline invite + email delivery and focus the test surface on Gates 7-9 + Employee task management.

### Pre-flight

- **Fixture extension** (only edit this session, greenlit pre-write): added `'manjunath.rs@gmail.com'` to [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) EMAILS[] line ~55 (5th-user added mid-test 2026-05-18, was outside wipe scope). Header `USERS (4)` → `USERS (5)` with new row noting `_id varies — caught via EMAILS[] match`. Syntax-checked clean.
- **Wipe run**: user fired `node scripts/delete-journey-fixture.js` against `karvia-business-1` preprod DB.
- **5 Q-gates** surfaced pre-walkthrough per `feedback_no_destructive_without_greenlight`: scope (Q1 just single-email extension), env (Q2 karvia-business-1), code-touching rule (Q3 zero code in /testing), audit-ID prefix (Q4 A20260520-NN), scope cap (Q5 mint+continue, no mid-session /coding break). All greenlit with single "yeah lets do it".

### Walkthrough results

| Gate | Status | Validation |
|---|---|---|
| 1 — Consultant signup baseline KPI | ✅ silent-green | No phantom drift on fresh tenant |
| 2 — 4-tier invite chain (Consultant→BO→Manager→2 Employees) | ✅ silent-green | All accounts created, Mailjet emails arriving green |
| 5 — Manager FE affordances (A20260518-02) | ✅ silent-green | No greyed buttons, no Option-α workaround needed |
| 5α — Default team pollution (A20260518-04) | ✅ silent-green | team-ssi clean; Default not rendered |
| 6 — Step-2 Customize question filter (A20260518-03) | ✅ silent-green | User confirmed "I customized... actual number of questions did go through" |
| 7-8 — KPI reconciliation across screens (A20260518-01) | ✅ silent-green | Numbers match lists (no explicit anomaly flagged) |
| **7 — Objective creation** (Gate 9 deferred from 2026-05-18) | 🟠 **A20260520-01** minted | Day-1 objective renders all-red "at risk" |
| **8 — planning-v2 KR cascade** | 🟠 **A20260520-02** minted (deferred) | KR cards show NOT_STARTED despite active week |
| **9 — Employee task management** | 🟠 **A20260520-03** minted | Chores list has zero action buttons |

All 4 fixes from 2026-05-19 /coding burndown re-confirmed Beta-stable.

### Read-only DB probe findings (informational)

Two-pass probe verified chain integrity for current tenant (RSM Consulting `56a37c` + String Client `56a38f`):

| Layer | Count | Status |
|---|---|---|
| Users (correct roles) | 5 | ✅ Consultant + BO + Manager + 2 Employees |
| Objective | 1 | ✅ "Increase customer retention rate by 5%..." May 19 - Aug 17, 2026 |
| KeyResults | 4 | ✅ all linked to objective `56a7ad` |
| Goals (1 Quarterly + 4 Weekly) | 5 | ✅ unified model; all under KR `56a7a9` |
| Tasks | 16 | ✅ status='todo'; ownership spread Manager + 2 Employees |
| Team membership | "First team" 4 members | ✅ `team.members[]` (one-way storage) |

**False-alarm corrected mid-probe**: initial probe queried `goal.title` (empty) — Goal/Task model uses `name` field. Titles ARE populated correctly (`"Week 1: Planning & Setup for Increase customer retention..."`).

**Not minted (informational, refinement-track-eligible)**:
- **Fixture-wipe leak**: hardcoded `USER_IDS`/`COMPANY_IDS` in delete-journey-fixture.js go stale after each Consultant re-signup; DB has accumulated 25 companies / 14 users / 38 invitations from prior /testing rounds. Current tenant 56a38f is clean and isolated; A20260518-01 P3 "wipe-everything-except-consultant" preview remains the right long-term answer.
- **user.team_ids[] + user.manager_id empty** on all 4 String Client users despite `team.members[]` 4-membership working. One-way storage by design; FE renders teams correctly when logged in as Manager/Employee.
- **Task linkage field**: 16 Tasks link to weekly goals via `task.goal_id`, NOT `task.weekly_goal_id`. Confirm canonical field via Task model before -03's FE wiring assumes the key.

### Audit IDs minted (📝 PLAN, no code touched per Q3 + `feedback_no_destructive_without_greenlight`)

| ID | Severity | Surface | Beta impact |
|---|---|---|---|
| `A20260520-01` | HIGH | objectives.js + objectives.html at-risk derivation | Day-1 looks "failing" — first-impression breaker |
| `A20260520-02` | MEDIUM (deferred refinement-track) | planning-v2 KR.status compute | Cosmetic; likely subsumed by -01 option (B) |
| `A20260520-03` | **HIGH (Beta-blocker)** | dashboard-v2 Employee chores | Cascade FROZEN — Employee can't transition tasks |

### Counter deltas

| Severity | OPEN | FIXED |
|---|---|---|
| High | 12 → **14** (+2 from -01 + -03) | 29 unchanged |
| Medium | 10 → **11** (+1 from -02 deferred) | 17 unchanged |
| Total | 181 → **184** (+3 mints) | — |

### Sprint 26 firing status (UNCHANGED — all 3 IDs are bug-fix not firing sub-slice)

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24 (62.5%)** UNCHANGED |

### Branch + DB state at session end

- Working tree: `scripts/delete-journey-fixture.js` (pre-flight EMAILS[] extension) + `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md` (3-place mint) + this handoff
- No commits this session — `/coding` will bundle into next session's commits
- DB state at session end: 14 users + 25 companies (25 orphan from prior rounds; tenant 56a38f current and chain-clean)

### Memory rules driving today

- `feedback_no_destructive_without_greenlight` — no code touched; pre-flight fixture edit greenlit; 5 Q-gates surfaced pre-walkthrough; mint proposals surfaced before AUDIT_TRACKER write
- `feedback_audit_governance` — 3 IDs minted atomically across Summary counters + comment block + Status Matrix in single batch
- `feedback_quote_the_canon` — smoking gun quoted verbatim from each screenshot before scope claim
- `feedback_extend_before_wrap` — all 3 fix directions propose extending existing canon (ObjectiveCalculator / PUT /api/tasks/:id route / KR.status compute), NOT new wrappers
- `feedback_minimal_change_grounding` — -02 deferred per user direction; -01 + -03 framed as minimal LoC additions; option (B) on -01 naturally subsumes -02 via shared helper
- `feedback_reuse_max` — -01 option B reuses ObjectiveCalculator (A20260514-12 precedent); -03 reuses existing PUT /api/tasks/:id route + Move-taxonomy vocab

### Next session recommendation

**Primary: `/coding` burndown — A20260520-01 + A20260520-03**

- Order: -03 first (Beta-blocker; cascade frozen) then -01 (UX-blocker but cascade still works behind misleading red)
- -01 option (B) extracts shared `calculateRiskStatus(objective, kr)` helper into ObjectiveCalculator — naturally closes -02 if helper is consumed on planning-v2.js too
- Pre-flight on -03: confirm Task model `task.goal_id` vs `task.weekly_goal_id` canonical field before FE wires; grep `pushed|forgotten|momentum|Move` to map existing Move-taxonomy surfaces
- Pre-flight on -01: grep `at_risk|on_track|getRiskStatus|calculateRiskStatus` across objectives.js + objective-calculator.js + planning-v2.js; canon-trace A20260514-12 `calculateWeekProgress` for temporal precedent
- Single session estimate: ~50 LoC code (25 LoC -03 FE + 15 LoC -01 helper + 10 LoC -01 call-site swap) + ~400 LoC test (regression NEW per ID + sibling sweeps)

**Secondary: `/strategy`** — resolve [MULTI_ASSESSMENT_TRACKING_STRATEGY_INPUT.md](MULTI_ASSESSMENT_TRACKING_STRATEGY_INPUT.md) 7 Q-gates (still open from 2026-05-19 recommendation; not Beta-blocking).

**Tertiary: `/audit`** — refinement of pre-existing -18-19 + B.6 regression-test regexes (still on refinement-track).

### Quality reflection — 8/10

**Strong**: Trust-baselining (steps 1-2 + 5-6 silent-green per user direct observation) saved ~30 min walking. Read-only DB probe two-pass corrected my own false-alarm (Goal.name vs goal.title) before user had to verify each screen. 3 IDs surfaced in clean smoking-gun form (each with screenshot + DB-probe evidence + canon-trace before scope claim). Pre-flight fixture extension was minimal (1-line array entry + 1-line header comment update; syntax-checked).

**Negative**: Initial probe assumed wrong field name (`title` vs `name`) and surfaced a false flag (Q2). Caught only because user said "not sure what you're talking about" — should have grepped Goal.js + Task.js model field names BEFORE running the probe per `feedback_test_fixture_validation` ("read schema BEFORE seeding/querying"). Test-fixture-validation memory rule extends naturally to query-side: read schema before assuming field names. Future probe scripts should `grep -n "^\s*\(title\|name\|description\)" server/models/$MODEL.js` as pre-flight step.

**Smaller**: -02's "subsumed by -01" framing is speculative — depends on whether /coding ships option (A) inline-only vs option (B) shared helper. If (A) ships, -02 stays open as standalone refinement.

### Sprint 26 status (UNCHANGED — all 3 mints are bug-fix not firing)

15/24 (62.5%) — A 4/4 ✅ · B 9/9 ✅ · C 5/6 · D 0/2 · E 4/4 ✅

---

## /coding — 2026-05-19 (Quadruple-slice burndown — 4 audit IDs PLAN→FIXED · 87/87 ✓ regression)

### What sealed today (4 commits, all pushed-pending)

| # | Audit ID | Commit | Severity | Surfaces | Tests |
|---|---|---|---|---|---|
| 1 | A20260518-02 Manager FE affordance gaps | `581fb33` | HIGH (4 sites) | 3 | 20/20 ✓ |
| 2 | A20260518-03 Step-2 question filter dropped at dispatch | `576468d` | HIGH (2 surfaces) | 5 | 28/28 ✓ |
| 3 | A20260518-01 Portfolio KPI/list drift (P1+P2+P3a+P3b) | `d71aaff` | HIGH (4 parts; P4 deferred) | 4 | 22/22 ✓ |
| 4 | A20260518-04 Default team pollution suppressed | `c4072fe` | MEDIUM (2 surfaces) | 2 | 17/17 ✓ |

**Day totals**: 8 unique surfaces · ~95 LoC code · ~730 LoC test · **87/87 ✓ new regression** across 4 scripts · zero collateral on full Sprint 26 sweep (42/44 — 2 pre-existing failures at -18-19 + B.6 confirmed not from today's edits via git-stash + git-checkout to `c04241e` baseline).

### Slice 1 — A20260518-02 Manager FE affordance gaps (Option B BE flag)

- BE: [server/routes/teams.js GET /](../../../server/routes/teams.js#L330-L345) + [GET /:teamId](../../../server/routes/teams.js#L418-L432) responses now include `is_managed_by_current_user: team.isManagedBy(req.user.id)` mirroring A20260517-01 canon (single source of truth — FE no longer forks predicate)
- FE: [client/pages/scripts/teams.js createTeamCard](../../../client/pages/scripts/teams.js#L200) + [renderTeamDetails](../../../client/pages/scripts/teams.js#L540) consume the BE flag with defensive fallback to legacy predicate for pre-fix response shapes; bare-predicate occurrences are all fallback-gated
- FE: [client/pages/scripts/teams.js initializeTeamsPage](../../../client/pages/scripts/teams.js#L28) Create-Team allowlist + loadUsers gate now include MANAGER per BE Layer-3 contract
- Regression: NEW [scripts/test-sprint26-A20260518-02-manager-fe-affordance.js](../../../scripts/test-sprint26-A20260518-02-manager-fe-affordance.js) 20/20 ✓ + A20260517-01 sibling 41/41 ✓

### Slice 2 — A20260518-03 Step-2 question filter dropped at dispatch

- Model: [server/models/Invitation.js](../../../server/models/Invitation.js#L155-L167) NEW optional `customized_question_ids: [String]` field (`feedback_extend_before_wrap` — no new collection)
- FE: [client/js/assessment-flow.js createInvitations](../../../client/js/assessment-flow.js#L189-L196) forwards `draft.customizedQuestionIds` when non-empty; pre-fix was decorative
- BE: [server/routes/invitations.js POST /create](../../../server/routes/invitations.js#L425-L463) accepts + validates SUBSET of template union (fail-loud 400 on orphan ids per Q4(a)) + persists per invitation
- BE: [server/routes/assessments.js invitation READ + SUBMIT paths](../../../server/routes/assessments.js#L162-L182) intersect override with template union (Q5(a) defensive); fail-loud 500 on empty intersection
- Out of scope: standalone POST /start (Q6 — no invitation source for override) + anonymous public-link survey path (Q-MAT-5)
- Regression: NEW [scripts/test-sprint26-A20260518-03-question-filter-dispatch.js](../../../scripts/test-sprint26-A20260518-03-question-filter-dispatch.js) 28/28 ✓ + sibling 79/79 ✓

### Slice 3 — A20260518-01 Portfolio KPI/list drift (P1+P2+P3a+P3b; P4 deferred)

- BE consultant.js: [GET /portfolio-kpis](../../../server/routes/consultant.js#L385-L455) single shared `Company.find({_id:{$in:managedIds}}).select('_id').lean()` → `aliveIds` consumed by totalClients + risk loop + all downstream aggregates (`feedback_reuse_max`); defensive early-return when aliveIds empty
- BE companies.js: [DELETE /:id?permanent=true](../../../server/routes/companies.js#L989-L1006) now runs `User.updateMany($pull)` to remove deleted Company._id from EVERY owning consultant's array
- Fixture: [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) mirrors prod hard-delete behaviour (Q-WIPE-2(b) carve-out removed since prod fix now exists)
- **P4 cross-screen sweep DEFERRED** to next /testing pass (Dashboard / Objectives / Assessments / Planning)
- Regression: NEW [scripts/test-sprint26-A20260518-01-kpi-list-drift.js](../../../scripts/test-sprint26-A20260518-01-kpi-list-drift.js) 22/22 ✓ + S22 Epic C polish 40/40 sibling (per-consultant unlink branch unchanged — still updateOne, multi-consultant semantic preserved)

### Slice 4 — A20260518-04 Default team pollution suppressed (Option A FE filter)

- FE: [client/pages/scripts/team-ssi-view.js](../../../client/pages/scripts/team-ssi-view.js) NEW `_filterPopulatedTeams(teams)` helper on TeamSSIView class drops teams with `members_invited === 0` (defensive non-array passthrough)
- Applied at all 4 render entry-points BEFORE empty-state check: displayTeamBreakdownTable + displayHeatmap + displayTeamBreakdownInTab + displayHeatmapInTab
- Option A per audit-tracker — smallest scope, doesn't touch consultant.js:540 auto-create that A20260517-01 sibling fixtures assert against
- Regression: NEW [scripts/test-sprint26-A20260518-04-default-team-filter.js](../../../scripts/test-sprint26-A20260518-04-default-team-filter.js) 17/17 ✓

### Counter deltas (4 IDs flipped 📝→💻→✅)

| Counter | Pre | Post | Delta |
|---|---|---|---|
| Critical OPEN | 1 | 1 | unchanged (A20260518-05 process audit) |
| High OPEN | 15 | 12 | **-3** (-01/-02/-03 FIXED) |
| Medium OPEN | 11 | 10 | **-1** (-04 FIXED) |
| Low OPEN | 5 | 5 | unchanged |
| High FIXED | 26 | 29 | **+3** |
| Medium FIXED | 16 | 17 | **+1** |
| Total | 181 | 181 | unchanged (status migration only) |

### Sprint 26 firing status (UNCHANGED — all 4 IDs are bug-fix not firing sub-slice)

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24 (62.5%)** UNCHANGED |

### Branch + DB state at session end

- 4 commits ahead of `origin/development` (581fb33 / 576468d / d71aaff / c4072fe) — pending push
- Working tree: governance edits to AUDIT_TRACKER.md + SESSION_LOG.md + this handoff
- DB state unchanged from 2026-05-18 /testing close (5 users on `karvia_business_preprod`)

### Pre-existing test failures flagged (NOT from today)

| Script | Failures | Note |
|---|---|---|
| `test-sprint26-A20260512-18-19-deadlinks.js` | 8/9 | "invitations.js welcome-email CTA points at assessment-take.html?invitation_token=" — test regex anchor too strict; pre-existed at commit `c04241e` (last /close) — confirmed via git-stash + git-checkout reproduction |
| `test-sprint26-B.6-deep-link-contract.js` | 23/24 | Similar regex-precision failure on teams.js APP_URL anchor; actual code at [teams.js:1020](../../../server/routes/teams.js#L1020) is clean (`${process.env.APP_URL}/pages/invitation-accept.html?token=...` no fallback) — test pattern out of date |

Recommendation: refinement-track item — one /audit pass to update both test regexes against current canonical patterns. Not Beta-blocking; both tests' positive claims are stale-test-assertion vs. real-code-drift mismatches, not contract violations.

### Quality reflection — 9/10

**Strong**: All 4 IDs canon-traced + smoking-gun confirmed BEFORE first edit; 12 Q-gates surfaced and green-lit on defaults via single user "yeah lets do it" (`feedback_no_destructive_without_greenlight`); slice ordering followed handoff recommendation exactly (02 → 03 → 01 → 04); regression-first pattern held (write test → run → fix regex bugs → re-run → green) on every slice; 4 atomic commits per slice (no bundling); cleanup-pattern detected mid-stream when delete-journey-fixture.js header rationale was found to conflict with the prod-fix path → surfaced + amended in same slice. Discovered that A20260518-03 needed both READ and SUBMIT path patches (not just READ) — caught at canon-trace stage before any code touched. Test-pattern bugs caught on first run and fixed in <30 LoC each.

**Negative**: 3 false-negative test regex bugs caught on first run (helper-comment-position, dot-assignment-vs-object-literal, orphan-check-distance, predicate-paren-wrap, member-greater-than-zero-pattern). All were test-side precision issues, no code bugs. Could have pre-validated regex distance via test-of-test on smaller inputs; future refinement-track item.

**Smaller**: Did not investigate `manjunath.rs@gmail.com` 5th-user cleanup for next /testing pass — handoff §234-235 carried a `delete-journey-fixture.js` extension request that I deferred to next /testing pre-flight (not in 4-ID scope). Pre-existing -18-19 + B.6 test failures surfaced but deferred.

### Next session recommendation

**Primary: `/testing` (re-walk Gates 5 + 9-12)**

- Gate 5 Manager-driven Employee invite path — validate A20260518-02 fix end-to-end (BO Option-α workaround no longer needed)
- Gate 6 Step-2 Customize dispatch — validate A20260518-03 fix (11-question dispatch should deliver 11, not 47)
- Gate 7-8 KPI reconciliation — validate A20260518-01 fix (no phantom counters)
- Gates 9-12 (objective creation / planning-v2 cascade / task creation / first-objective acceptance) — DEFERRED from 2026-05-18

Pre-flight: extend `delete-journey-fixture.js` EMAILS[] for `manjunath.rs@gmail.com` per handoff §234-235.

**Secondary: `/strategy` — resolve [MULTI_ASSESSMENT_TRACKING_STRATEGY_INPUT.md](MULTI_ASSESSMENT_TRACKING_STRATEGY_INPUT.md) 7 Q-gates**

- `dispatch_batch_id` extension scope (per-dispatch grouping for KPI rendering)
- Survey-mode parity (Q-MAT-5 mode-aware UI badges)
- Slot into S26 or S27 firing scope

**Tertiary: `/audit` — refinement of -18-19 + B.6 regression-test regexes** (pre-existing technical debt; non-blocking).

---

## /testing — 2026-05-18 (Manual journey walkthrough, full restart from Gate 1 — 4 audit IDs minted, no code)

### Trigger

User-invoked /testing #251 after /init session-restoration. Q-kickoff scope: full wipe + Gate-1 restart on `karvia-business-1` to **(a)** validate the 4 fixes shipped on 2026-05-17 (`A20260516-02` BO→Manager + `A20260517-01` Manager team management BE + `A20260517-02` email-send-status) **(b)** systematically check KPI-vs-list reconciliation across every screen (cross-cutting check that emerged from a pre-wipe my-clients screenshot).

### Pre-flight

| Action | Detail |
|---|---|
| Q-gate sweep | Q1(b) full wipe / Q2(a) probe after each invite gate / Q3(a) inline handoff / Q4(a) file+halt protocol / Q5(Y) read-only probe first — all greenlit |
| Probe | [scripts/probe-journey-fixture-cleanup.js](../../../scripts/probe-journey-fixture-cleanup.js) revealed 4 users + 2 companies + 9 cascade docs (Karvia Consulting + String Client) |
| Wipe | [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) re-extended (2026-05-17 was scoped to STRING Sounds only) for all 4 journey emails — wiped 5 cascade docs + 2 companies + 4 users · post-delete verification ✓ all zeros |
| Live verification of KPI drift theory | Direct probe of `rsm@karvia.ai.managed_businesses` BEFORE wipe — confirmed phantom id `6a0917ae82fcb83c7dd6e21f` (STRING Sounds deleted 2026-05-17 surgical wipe) still in array next to live String Client id |

### Walkthrough results

| Gate | Action | Status | Notes |
|---|---|---|---|
| 1 | Consultant `rsm@karvia.ai` signs up at `/pages/signup.html` | ✅ | Account created, role=CONSULTANT, lands on my-clients.html — KPI baseline check requested but user moved fast through Gates 1-4; baseline KPI not captured (lesson: faster screenshot ask) |
| 2 | Consultant adds String Sounds client + invites BO | ✅ | Per user report — proceeded smoothly |
| 3-4 | BO accepts + Consultant directly adds Manager (path-A consultant→team-member via A20260516-02 P3+Gap 2 chain) | ✅ | Per user report; team "First Team" created with manager_id = BO Client One; Manager Sagar added as member-with-role-MANAGER |
| 5 | Manager attempts to invite Employee from teams.html | 🛑 BLOCKED on FE | No "+ Add Member" affordance visible — A20260518-02 minted. Workaround Option α taken: BO invited Employee directly |
| 5α | BO invites Employee `essenceofmrs@gmail.com` (+ later `manjunath.rs@gmail.com` as 2nd Employee for multi-recipient scenario) | ✅ | Path A20260516-02 P1+P2+Gap 1 proven again — 2 Employees now on team |
| 6 | Consultant launches "Home Services Business Health" assessment to all 4 team members | ⚠️ Partial | Dispatch worked, all 4 received in-app notifications, but A20260518-03 surfaced — 47 questions delivered despite consultant selecting only 11 at Step 2 |
| 7 | 3/4 members complete assessment (BO + Manager + secon emp; essenceofmrs at 0/4) | ✅ | 75% completion; SSI rollup compute working; team-ssi-view Team Breakdown renders correct averages (7.2/5.7/6.0 for First Team) |
| 8 | Consultant views team-ssi-view → Teams tab | ⚠️ Partial | Real team data renders correctly + KPI/list reconcile cleanly. **BUT** Default team auto-created at client-add time pollutes Team Breakdown with 0/0 + 0.0/0.0/0.0 row + RED Performance Heatmap cells — A20260518-04 minted |
| 9-12 | Objective creation, planning-v2 cascade, task creation, first-objective acceptance | ⏸️ Deferred | User scope-pivoted to "log issues + automate next" before reaching objective creation Gates |

### Audit IDs minted (📝 PLAN, no code touched per Q4(a))

| ID | Severity | Title | Surfaces | Cross-ref |
|---|---|---|---|---|
| `A20260518-01` | HIGH | PORTFOLIO-KPI-LIST-RECONCILIATION-DRIFT | 4 parts (KPI count P1 · risk loop P2 · DELETE $pull P3 · cross-screen sweep P4) | Triggered by stale `managed_businesses` from 2026-05-17 surgical wipe |
| `A20260518-02` | HIGH | MANAGER-TEAM-MANAGEMENT-FE-AFFORDANCE-GAPS | 4 sites (Add Member + Remove + Create Team + Manager pill) | **FE counterpart of A20260517-01** — BE shipped but FE missed at impact-trace stage |
| `A20260518-03` | HIGH | ASSESSMENT-QUESTION-FILTER-DROPPED-AT-DISPATCH | 2 surfaces (dispatch payload + regression invariant) | New defect class — Step 2 customize is decorative |
| `A20260518-04` | MEDIUM | DEFAULT-TEAM-POLLUTION-IN-TEAM-SSI-VIEW | 2 surfaces (Team Breakdown + Heatmap) | Iceberg below A20260516-02 P2 ("Welcome to Default" email-tip fix) |

### KPI reconciliation sweep (A20260518-01 P4, validated screen-by-screen)

| Screen | KPI cards | List | Match | Sub-part needed? |
|---|---|---|---|---|
| `my-clients.html` (pre-wipe) | 2 / 2 / — / 2 | 1 ("String Client") | ❌ phantom id | A20260518-01 root finding |
| `teams.html` (Manager view) | 1 / 2 / 2.0 / 0 | 1 card ("First Team") | ✅ | none |
| `team-ssi-view.html` Teams tab (Consultant view) | 3/4 (75%) badge + per-team rows | matches modal individual results | ✅ for First Team · ⚠️ Default pollution | A20260518-04 covers (display issue, not KPI drift) |

**Net P4 finding: NO new KPI-vs-list drift on teams.html or team-ssi-view.html beyond the root finding on my-clients.html.** Sweep continuing to Dashboard, Objectives, Assessments, Planning at next /testing pass post-fix.

### Future-track items captured (NOT minted as audit IDs — /strategy material)

| Item | Class | Trigger | Next action |
|---|---|---|---|
| **Multi-assessment tracking** | Product/schema | User direction 2026-05-18 after 2nd dispatch: "we need a very surgical and simple way to tag each assessment as one assessment as a whole. KPI should show number of assessments sent and responses per assessment. Same goes for surveys too." Followed by user-amendment same session clarifying Survey terminology: *"When I say surveys, initially when the consultant is sending the assessment as a link, the people who take the assessment via the link comes under surveys."* | **Formalized as [MULTI_ASSESSMENT_TRACKING_STRATEGY_INPUT.md](MULTI_ASSESSMENT_TRACKING_STRATEGY_INPUT.md) v2 (amended 2026-05-18)** — 7 Q-gates (Q-MAT-1..Q-MAT-7) drafted with recommended lean defaults; canon-trace confirms `Invitation.dispatch_batch_id` extension is smallest viable change per `feedback_extend_before_wrap` (no new collection). **v2 amendment**: Q-MAT-5 reframed from "design for future Survey model" → "Survey-mode parity rendering" after canon-check confirmed Sprint 9 already shipped `Invitation.is_public_link` + `Assessment.is_anonymous` + `Assessment.anonymous_respondent` subdoc. Survey is the anonymous public-link dispatch mode of the same pipeline, NOT a separate model; `dispatch_batch_id` applies uniformly to both modes with mode-aware UI counter rendering (🔗 Survey vs ✉️ Invite badge per dispatch row). Q6 from prior /strategy session 2026-05-12 quoted verbatim — per-user retake already settled, this spec extends to per-dispatch grouping. Next /strategy session resolves all 7 Qs; recommended slot = refinement-track post-S27 per Q-MAT-6(c) default (not Beta-1-blocking) |
| **Journey-regression automation** | Test infrastructure | User observation: "Mailjet now firing reliably on Render; the 12-gate walkthrough should become part of complete regression suite" | /strategy next session — scope deliverable; candidates = headless Playwright through gates 1-12 OR API-only script chain mirroring `tests/e2e/golden-path.test.js`. Slot into S26 or S27 firing scope |

### Pre-flight cleanup needed before next /testing pass

- **5 users currently live** on preprod: rsm@karvia.ai + stringsounds + sagar + essenceofmrs + manjunath.rs@gmail.com (the 4th user user added mid-test as "second employee")
- Re-extend [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) to add `manjunath.rs@gmail.com` to `EMAILS[]` before next wipe — see probe output 2026-05-18 for fresh user/company IDs (will have changed by then if re-runs happen)

### Memory rules driving today

| Rule | Application |
|---|---|
| `feedback_no_destructive_without_greenlight` | 5 Q-gates at kickoff + Q-WIPE-1/2 before destructive wipe + file-and-halt on every new finding (no code touched) |
| `feedback_audit_governance` | 4 IDs minted atomically across 3 surfaces (Summary counters + comment block + Status Matrix) in batched edits |
| `feedback_quote_the_canon` | Every audit-ID entry quotes the canon defect-line verbatim with file:line citations before scope claim (e.g. `consultant.js:437 totalClients = managedIds.length` quoted before -01 P1 scope) |
| `feedback_extend_before_wrap` | Every fix-direction proposes EXTENDING existing canon (`isManagedBy()` / `selected_questions` field / team-ssi-view filter) — none propose new wrappers/services/abstractions |
| `feedback_reuse_max` | A20260518-01 P1+P2 fix proposes ONE shared `Company.find` for KPI count + risk loop (not two parallel queries) |
| `feedback_minimal_change_grounding` | A20260518-04 option A (FE filter, 5 LoC) recommended over option B (BE rip-out of auto-create which would break A20260517-01-sibling fixtures) |
| `feedback_test_fixture_validation` | Re-probed user/company IDs BEFORE re-extending delete-journey-fixture.js (drift between 2026-05-17 retarget and 2026-05-18 state was substantial — Karvia Consulting + String Client IDs all different from 2026-05-17 baseline) |

### Branch status at session end

- Working tree:
  - MODIFIED [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) (Summary counters + 1 comment block + 4 Status Matrix rows)
  - MODIFIED [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) (re-targeted to 4-email full wipe per Q1(b))
  - MODIFIED this handoff
- 0 commits ahead of `origin/development` (last push was 2026-05-17 /close)
- DB state: 5 users live across 2 tenants on `karvia_business_preprod` (1 Consultant + 1 Default team + First Team with 4 members 3-completed); 1 outstanding assessment for essenceofmrs

### Next session recommendation

**Primary: `/coding` (2026-05-19) — 4-ID atomic burndown of all 2026-05-18 mints**

Recommended sequence (severity + risk order):
1. **A20260518-02** Manager FE affordance gaps (HIGH, ~11 LoC option B BE+FE, ~80 LoC test) — unblocks Gate-5 Manager-driven path so Option α workaround can be dropped; closes A20260517-01 FE counterpart with minimal new surface
2. **A20260518-03** Assessment question filter (HIGH, ~25 LoC, ~80 LoC test) — most impactful for consultant trust; smallest fix per `feedback_extend_before_wrap` is Step-3-forwards-customizedIds rather than NEW PUT endpoint
3. **A20260518-01** Portfolio KPI/list drift (HIGH, ~20 LoC, ~120 LoC test) — fixes P1+P2 with one shared `Company.find`; P3 `$pull` on DELETE company; P4 cross-screen sweep follows up at next /testing
4. **A20260518-04** Default team pollution (MEDIUM, ~5 LoC FE option A, ~30 LoC test) — quickest win; cosmetic only

Total scope estimate: ~61 LoC code + ~310 LoC tests, ~2-3h /coding. All 4 share the file-and-halt+ship-tomorrow precedent of A20260516-02 P1+P2+Gap 1.

**Secondary: `/strategy` (could ride same session as /coding-amendment OR separate)**

- Multi-assessment tracking schema decision (dispatch_iteration + dispatch_label?)
- Journey-regression automation deliverable scoping (Playwright vs API-chain; slot into S26 or S27?)

**Tertiary: `/testing` re-run after /coding** — Gate 5 Manager-driven validation post-A20260518-02 fix + Gates 9-12 (objective/plan/task creation) which were deferred today.

### Quality reflection — 8/10

**Strong**: 4 audit IDs minted with verified root cause + canon-trace + fix-direction recommendations all in one session, no code touched (file-and-halt discipline held); KPI drift theory verified by direct probe in 2 minutes (smoking gun found before scope claim, mirrors -16-02 part-1 pre-edit canon-trace pattern); cross-cutting P4 sweep methodology established and validated at 3 screens; future-track items (multi-assessment tracking + journey automation) explicitly separated from bug-fix audit IDs and routed to /strategy queue per `feedback_audit_governance` separation-of-concerns.

**Negative**: Missed the initial KPI baseline screenshot ask at Gate 1 (user moved fast through 1-4 before screenshot was sent); should have made the screenshot ask blocking, not informational. Also: I proposed Option α (workaround) for Gate 5 which the user accepted, but this means Gate 5 was NOT validated for Manager-driven path — A20260518-02 fix tomorrow needs explicit re-test, not just a regression script.

**Smaller**: 4th user `manjunath.rs@gmail.com` ("secon emp") added by user mid-test is outside our wipe scope — next /testing pre-flight must re-extend wipe targets again, OR we add a "wipe everything except consultant+Karvia Consulting" mode to delete-journey-fixture.js per A20260518-01 P3 cleanup-target preview.

### Sprint 26 status (UNCHANGED — all 4 mints are bug-fix not firing)

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24 (62.5%)** UNCHANGED — 4 new IDs are bug-fix not firing sub-slices |

---

## /close — 2026-05-17 (Quadruple-slice day sealed — 4 audit IDs shipped; full Beta activation + management + email-delivery transparency)

### What sealed today (4 commits, all pushed)

| # | Audit ID | Commit | Severity | Surfaces | Tests |
|---|---|---|---|---|---|
| 1 | A20260516-02 P1+P2+Gap 1 (PARTIAL) | `e2f097a` | CRITICAL bundle | 3 | 22/22 ✓ |
| 2 | A20260516-02 P3+Gap 2 (FULL) | `089abf4` | (FULL flip) | 3 | +24 = 46/46 ✓ |
| 3 | A20260517-01 Manager team management (3 layers) | `2a5be30` | HIGH | 3 | 41/41 ✓ |
| 4 | A20260517-02 Silent email-failure UX trap | `e16c9d3` | HIGH | 3 | 41/41 ✓ |

**Day totals**: 12 surfaces · ~125 LoC code · ~700 LoC test · **128/128 ✓** new + **sibling sweeps zero collateral every slice** (250+ assertions across same-file consumers).

### AUDIT_TRACKER counter movements today

| Severity | OPEN | FIXED |
|---|---|---|
| Critical | 1 → **0** (-1) | 10 → **11** (+1) |
| High | 9 → **9** (net 0 from 2 mint+ship same session) | 24 → **26** (+2) |
| Total | 22 → **21** (-1) | 56 → **59** (+3) overall: 168 → **170** (+2 mints) |

### Beta gates achieved 🟢

- **BO→Manager + Manager→Employee + Consultant→team-member** activation chain (A20260516-02 P1+P2+Gap 1+P3+Gap 2)
- **Manager team management** seamless across visibility + create + permission at 6 surfaces (A20260517-01)
- **Silent-email-failure UX trap closed** with clipboard-copy + prompt() fallback (A20260517-02)

### Sprint 26 status at /close

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24 (62.5%)** UNCHANGED — all 4 IDs today were bug-fix, not firing sub-slices |

### Memory rule confirmation — 4-for-4

Pre-edit canon/impact-trace caught hidden coupling on **every slice today**:

| Slice | What pre-edit trace surfaced |
|---|---|
| A20260516-02 part 1 | **Gap 1** — `/accept` predicate would 409 Manager even after P1 link fix |
| A20260516-02 part 2 | **Gap 2 depth** — assessment-branch invitation was missing 6 of 8 canon fields |
| A20260517-01 | **Layer 3** (stale role-gate at teams.js:36) + **Q4 expanded 1→4 sites** (predicate repeated) |
| A20260517-02 | **Existing-user invariant** (no `email_sent` field) + **2-toast clobbering bug** in initial FE draft |

4-for-4 across the day confirms the canon-trace-before-edit habit is reliably load-bearing. Should be promoted to permanent guidance at next /sprint-review or memory-write opportunity.

### Deferred / filed for follow-up

- **A20260517-03** — Mailjet webhook for `email_delivery.{delivered, bounced, opened}` field tracking. Schema fields exist on Invitation; no webhook handler. Refinement-track (~100+ LoC; operational observability, not Beta-blocking). File at next /strategy or REFINEMENT-BACKLOG amendment.
- **A20260514-13** Window CRUD UI — still deferred per B3b min-amendment stance (unchanged today)

### Test infrastructure added today (reusable)

- NEW [scripts/probe-employee-invitation.js](../../../scripts/probe-employee-invitation.js) — read-only diagnostic inspecting invitation state + `email_delivery` + team/company binding for any recipient email. General-purpose for future delivery-mismatch investigations.

### Branch status at /close

- All 4 commits pushed: `e2f097a`, `089abf4`, `2a5be30`, `e16c9d3`
- 0 commits ahead of `origin/development`
- Render `karvia-business-1` carrying all 4 fixes

### Quality reflection — 9/10

**Strong**: High-tempo end-to-end day with 4 audit IDs shipped, each with user Q-gate sign-off + scope amendments greenlit mid-stream; pre-edit canon/impact-trace caught real coupling every time (4-for-4 confirms habit is load-bearing); zero collateral on sibling sweeps every slice; honest counter accounting (PARTIAL→FULL flip discipline); reusable test infrastructure left behind (probe-employee-invitation.js).

**Negative**: 2 mid-slice corrections needed today (A20260517-01 test off-by-one regex matching audit-comment text + A20260517-02 FE 2-toast clobbering bug in initial draft) — both ~5 min iteration each, both avoidable with one more pre-edit read of dependent code (showToast util signature + my own audit-marker text).

**Smaller**: A20260517-03 Mailjet webhook deferred but not yet formally minted as audit ID in tracker — should be filed at next /close-with-agenda or /strategy session.

### Next session recommendation

1. **Resume /testing Gate 5+** with all 4 fixes live on `karvia-business-1`. BO or Sagar re-invites essenceofmrs as Employee. If Mailjet still failing today, FE auto-copies activation link to clipboard + warning toast surfaces real outcome. Manual share unblocks Gate 5 → Employee accepts → continue Gates 6-12 (assessment dispatch → diagnostic → objective creation → plan → task → first-objective acceptance).
2. **OR /coding B3d** — A20260514-14 (~1.5h, Dashboard/aggregator KPI reframe per SD-5; Sprint 26 firing 15/24 → 16/24).
3. **File A20260517-03** Mailjet webhook for email_delivery field tracking in REFINEMENT-BACKLOG at next /strategy.
4. **/sprint-review** worth considering soon — today's 4 audit IDs consolidate into useful S26 retro learning (especially the 4-for-4 pre-edit-trace pattern + the activation funnel coverage from user-driven /testing).

---

## /coding — 2026-05-17 (A20260517-02 — Email-send status surfaced + FE copy-link fallback — silent-failure UX trap closed)

### Trigger

Mid-/testing Gate 5 replay: Sagar (Manager) invited essenceofmrs (Employee) via the teams.js create-user route. Route returned 201 success → User created → Invitation created with valid `invitation_token` → BUT essenceofmrs never received any email. Probe via [scripts/probe-employee-invitation.js](../../../scripts/probe-employee-invitation.js) confirmed `email_delivery.delivered: false` (Mailjet send silently failed; try/catch swallowed the error). FE toast claimed "They will receive an email with login credentials" — contract lie. User direction: "File + fix A20260517-02 in a new slice now."

### What shipped (single commit, this entry)

3 surfaces (~55 LoC code + ~210 LoC test). A20260517-02 minted + 📝 PLAN → ✅ FIXED in same session.

| Surface | Defect | Fix |
|---|---|---|
| BE [teams.js POST /:teamId/members/create-user](../../../server/routes/teams.js#L1006) (line 1006-1064) | `loginLink` declared inside try block → unreachable on failure; emailError silently swallowed; 201 response data has no `email_sent` signal | `loginLink` hoisted ABOVE try; `let emailSent = true` flag flipped to `false` in catch; 201 response.data gains additive `email_sent: bool` + `login_link: string` |
| BE [invitations.js POST /invite-team-member](../../../server/routes/invitations.js#L1854) (line 1854-1903) | Same swallow pattern in consultant→team-member parallel path | Same shape — `loginUrl` hoisted, `emailSent` flag, response.data preserves existing `assessment_sent` field + adds `email_sent` + `login_link` |
| FE [client/pages/scripts/teams.js](../../../client/pages/scripts/teams.js#L866) (line 866-905) | Unconditional success toast "They will receive an email…" | Branches `if (createdNew && emailSent === false && loginLink)` → `navigator.clipboard.writeText(loginLink)` → 'warning' toast — "copied to clipboard" if successful, else "in next prompt — copy manually" → `window.prompt()` fallback for insecure-context / permission-denied / Safari cases |

**Unchanged (anti-regression)**:
- Existing-user branch at [teams.js:909-931](../../../server/routes/teams.js#L909) — no email is attempted on existing-user add → no `email_sent` field added → no contract lie
- 201 status preserved on failure (request still succeeds — User + Invitation already persisted)
- All A20260516-02 P1+P2+Gap 1+P3+Gap 2 markers + A20260517-01 isManagedBy + A20260515-04 + A20260513-08a intact

### What's deliberately NOT in this slice (deferred to A20260517-03 refinement-track)

- Mailjet webhook for `email_delivery.{delivered, bounced, opened}` field tracking. Schema fields exist on Invitation but no webhook handler updates them. Operational/observability concern; not Beta-blocking (manual link workaround). ~100+ LoC (webhook endpoint + signature verify + handler). Filed in REFINEMENT-BACKLOG.

### 8 pre-edit Q-gates honored

| Q | Decision |
|---|---|
| Q1 — BE scope | **(a) Both routes** (teams.js + invitations.js) — uniform pattern per `feedback_reuse_max` |
| Q2 — response shape | **(a) Additive 2 fields** `email_sent` + `login_link` in `data.{...}` |
| Q3 — FE toast shape | **(a) Branch + clipboard + prompt fallback** |
| Q4 — flag derivation | **(a) try/catch captures local flag** (no premature helper abstraction) |
| Q5 — Mailjet webhook | **(a) DEFER to A20260517-03 refinement-track** (not Beta-blocking) |
| Q6 — audit ID + status | **(a) Single A20260517-02** minted + flipped same session |
| Q7 — test coverage | **(a) NEW [test-sprint26-A20260517-02-email-send-status.js](../../../scripts/test-sprint26-A20260517-02-email-send-status.js)** |
| Q8 — defensive concerns | Existing-user branch correctly omits `email_sent` (no email attempted = no signal needed); additive field safe for invitations.js consumer (assessment-hub.html); `login_link` no new security surface (same URL email carries) |

### Regression health at this slice

NEW [scripts/test-sprint26-A20260517-02-email-send-status.js](../../../scripts/test-sprint26-A20260517-02-email-send-status.js) **41/41 ✓** on first run, across 5 parts:
- **PART 1 teams.js BE × 7** — loginLink hoist + emailSent flag + catch sets false + response shape + audit marker + 201 preserved + A20260516-02 P1 intact
- **PART 2 invitations.js BE × 6** — same pattern + assessment_sent preserved + A20260516-02 P3 intact
- **PART 3 FE branching × 8** — data reads + branch shape + clipboard call + warning toast + prompt fallback + success-path toast preserved + marker
- **PART 4 vm-sandbox FE decision matrix × 5** — `shouldShowFailureUX(createdNew, emailSent, loginLink)` covering: true/false/false/undefined/missing-link combinations
- **PART 5 anti-regression × 12** — A20260516-02 P1+P2+Gap 1+P3+Gap 2 + A20260517-01 isManagedBy+findHelper+Layer 3 + A20260515-04 P1+P3 + A20260513-08a × 2 + existing-user-no-email-sent invariant

Sibling sweep 4 scripts, **125/125 ✓**:
- A20260517-01 manager-team-management (41) — same files
- A20260516-02 activation-funnel (46) — same files (teams.js + invitations.js)
- A20260515-04 manager-welcome-email (28) — same files
- A20260513-08a temp-password-hotfix (10) — same files

**Total: 166/166 ✓ across 5 scripts**, zero collateral on the 4 most-impacted same-file consumers.

### Sprint 26 status at this slice

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24** (UNCHANGED — A20260517-02 is bug-fix, not firing sub-slice) |

### AUDIT_TRACKER counter flip

| Counter | Before | After | Delta |
|---|---|---|---|
| High OPEN | 9 | 9 | 0 (net mint+ship same session) |
| High FIXED | 25 | 26 | +1 |
| Total | 169 | 170 | +1 (mint adds one) |

### Memory rules driving this slice

- `feedback_no_destructive_without_greenlight` — 8 pre-edit Qs greenlit before line 1; deferred Mailjet webhook to refinement-track per Q5(a) to keep scope tight
- `feedback_why_what_how_when` — Why: silent-email-failure trap is exact Beta UX cost (user can't differentiate "email sent" from "email silently failed"); What: surface email_sent flag; How: additive response fields + FE branch; When: now (mid-replay, before Gate 5 retry would be possible)
- `feedback_minimal_change_grounding` — ~55 LoC across 3 surfaces; declined Q4(b) helper abstraction (premature); declined Q5(b) webhook in same slice (scope creep)
- `feedback_reuse_max` — both BE routes apply identical pattern; FE uses existing `showToast` utility + native `navigator.clipboard` + `window.prompt`; no new helpers
- `feedback_extend_before_wrap` — extended existing 201 response.data with 2 additive fields; no new endpoints, no new shared modules, no schema change, no JWT change
- `feedback_audit_governance` — A20260517-02 minted + 📝→💻→✅ in single session; row + comment block + handoff + commit updated atomically; counter delta honest per Q7(a)
- `feedback_test_fixture_validation` — Existing-user branch verified to have no email-send call (so no email_sent field needed); FE consumer pattern checked before crafting response shape
- `feedback_quote_the_canon` — Q4 try/catch flag pattern mirrors precedent at [teams.js:1017-1020](../../../server/routes/teams.js#L1017) catch handling (preserves "don't fail the request" invariant)

### Branch status at this slice

- Working tree dirty (pending commit):
  - MODIFIED [server/routes/teams.js](../../../server/routes/teams.js) (loginLink hoist + emailSent flag + response additive fields)
  - MODIFIED [server/routes/invitations.js](../../../server/routes/invitations.js) (same pattern)
  - MODIFIED [client/pages/scripts/teams.js](../../../client/pages/scripts/teams.js) (toast branching + clipboard + prompt fallback)
  - MODIFIED [KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) (counter flip + status matrix row + comment)
  - MODIFIED this handoff
  - NEW [scripts/test-sprint26-A20260517-02-email-send-status.js](../../../scripts/test-sprint26-A20260517-02-email-send-status.js)
  - NEW [scripts/probe-employee-invitation.js](../../../scripts/probe-employee-invitation.js) (diagnostic helper from mid-session; uncommitted reusable test infra)
- 0 commits ahead of `origin/development` (2a5be30 A20260517-01 already pushed); after this lands: 1 commit ahead

### Next session recommendation

1. **Push** this commit → Render auto-deploys `karvia-business-1` (~3 min) → carries email-send-status fix
2. **Resume /testing Gate 5+** with the fix live: BO (or Sagar after refresh) re-invites essenceofmrs → if Mailjet works, normal success toast; if Mailjet still fails, FE auto-copies activation link to clipboard + 'warning' toast → BO/Sagar shares link manually → Employee accepts → continue Gates 6-12
3. **OR** /coding B3d (A20260514-14 ~1.5h, Dashboard/aggregator KPI reframe, Sprint 26 firing 15/24 → 16/24)
4. **Refinement-track** new addition: A20260517-03 Mailjet webhook for email_delivery field tracking (operational observability)

---

## /coding — 2026-05-17 (A20260517-01 — Manager team management seamless across 3 layers — Beta GREEN)

### Trigger

User-surfaced mid-/testing Gate 4-12 replay: BO created team + added Sagar (Manager), Sagar logged in to `/pages/teams.html` and saw "No Teams Yet". User direction: "Not a bug but an improvement — Manager should be able to view the team + invite employees + create new teams, so the flow is not seamless." Sentence cut off ("if he creates a team it becomes...") explained by pre-edit discovery of a stale role-gate at teams.js:36 that 403'd Manager on team creation despite the requireRole middleware allowing them. User direction shifted from "file as audit ID for refinement-track" → "fix now to make teams pretty seamless".

### What shipped (single commit, this entry)

3 surfaces (~32 LoC). A20260517-01 minted + flipped 📝 PLAN → ✅ FIXED in single session.

| Layer | Surface | Defect | Fix |
|---|---|---|---|
| **3 — Create** | [teams.js:36-46](../../../server/routes/teams.js#L36) | In-body role gate excluded MANAGER despite [line 26 `requireRole` middleware](../../../server/routes/teams.js#L26) allowing them. Manager clicking "Create First Team" got 403 "Only Business Owners, Executives, and Consultants can create teams." | Added `'MANAGER'` to allowlist; error copy updated to mention Managers |
| **1 — Visibility** | [teams.js:316-321](../../../server/routes/teams.js#L316) | MANAGER branch in `GET /api/teams` called `Team.findByManager(userId)` which filters by `manager_id === userId` only. Manager added as member with `role='MANAGER'` saw nothing | NEW [Team.findByManagerOrMemberAsManager()](../../../server/models/Team.js#L314) static: `$or: [{manager_id: userId}, {members: {$elemMatch: {user_id, role: 'MANAGER', status: 'active'}}}]` + `is_active: true` + sort by name |
| **2 — Permission (4 sites)** | [teams.js:492,701,807,894](../../../server/routes/teams.js#L492) — PUT /:teamId + POST /:teamId/members + DELETE /:teamId/members/:userId + POST /:teamId/members/create-user | Bare `team.manager_id.toString() === userId.toString()` predicate repeated at 4 write sites; even if visibility fixed, Manager 403'd on update/add-member/remove-member/invite-new-user | Single-source [Team.prototype.isManagedBy(userId)](../../../server/models/Team.js#L256) instance method swapped in at all 4 sites; legacy + member-as-MANAGER paths unified |

**Unchanged (anti-regression)**:
- DELETE /:teamId stays `requireRole(CONSULTANT, BUSINESS_OWNER)` only — Manager intentionally cannot delete teams
- GET /:teamId view permission already member-aware via `isMember()` — preserved
- `Team.findByManager` legacy static preserved (used by [objectiveService.js:99](../../../server/services/objectiveService.js#L99))
- Auto-Default team at [consultant.js:542](../../../server/routes/consultant.js#L542) still sets `manager_id = consultant._id` — CONSULTANT role goes through `isAdmin` path

### Pre-edit impact + effectiveness sweep (cleared)

| Sweep target | Finding |
|---|---|
| `Team.findByManager` consumers | 1 — [objectiveService.js:99](../../../server/services/objectiveService.js#L99). Adding NEW helper, not changing existing → unaffected |
| `User.findByManager` consumers | Different namespace (user-reports-to-user). Unaffected |
| `targetUser.manager_id` ([roleGuards.js:223](../../../server/middleware/roleGuards.js#L223)) | User-level reporting field, not Team-level. Unaffected |
| `isManager` / `isTeamManager` predicates in teams.js | **5 sites** — line 398 (GET, already isMember-aware), 485, 691, 796, 880. Q4 expanded 1→4 sites for write routes |
| Test fixture [test-sprint22-epic-c-phase3.js:195](../../../scripts/test-sprint22-epic-c-phase3.js#L195) | Asserts default-team's `manager_id == consultant._id` — additive change preserves; verified |
| Members subdoc schema [Team.js:68-103](../../../server/models/Team.js#L68) | role required, status enum {'active','inactive'} default 'active' — predicate filter safe |

### 7 pre-edit Q-gates honored (Q4 amended at impact-analysis stage)

| Q | Decision |
|---|---|
| Q1 — scope packaging | **(a) Bundle all 3 layers in single commit** |
| Q2 — Layer 3 fix shape | **(a) Add MANAGER to allowlist** — 1 LoC matches middleware contract |
| Q3 — Layer 1 visibility | **(a) NEW `findByManagerOrMemberAsManager` static** via `$or` query |
| **Q4 — Layer 2 permission** | **(a′) Uniform 4-site fix via single-source `isManagedBy()` instance method** (amended from original Q4(a) "just line 880" after impact sweep surfaced the 5-site repetition) |
| Q5 — test coverage | **(a) NEW [test-sprint26-A20260517-01](../../../scripts/test-sprint26-A20260517-01-manager-team-management.js)** covering all 3 layers + corner cases |
| Q6 — audit ID strategy | **(a) Keep single A20260517-01** — expand description to 3 layers |
| Q7 — status flip + counters | **(a) Flip PLAN → FIXED + counters** — High OPEN 10→9, High FIXED 24→25 |

### Corner-case sweep (exhaustive on Layer 2 predicate)

13 `isManagedBy()` assertions cover:
- Legacy `manager_id` only → true
- Member-as-MANAGER only → true
- Both legacy + member → true (no duplicate-throw)
- Member-as-MANAGER inactive → false
- MANAGER-role user added as `role='EMPLOYEE'` on team → false (per-team role wins over global role)
- Empty members + non-manager_id → false
- Non-member non-manager_id → false
- BO holding manager_id → true via manager_id path
- **Defensive**: null/undefined/empty-string userId → false (no throw)
- **Defensive**: corrupt member subdocs (missing user_id, null/undefined entries) → false (no throw)
- **Defensive**: `team.members` undefined → false (uses `[] ` fallback)
- **Defensive**: `team.manager_id` undefined → falls back to members scan correctly

### Regression health at this slice

NEW [scripts/test-sprint26-A20260517-01-manager-team-management.js](../../../scripts/test-sprint26-A20260517-01-manager-team-management.js) **41/41 ✓** across 5 parts (PART 1 predicate matrix × 13 + PART 2 query shape × 6 + PART 3 Layer 3 create gate × 4 + PART 4 Layer 2 4-site coverage × 7 + PART 5 anti-regression × 8).

Sibling sweep — 3 directly-impacted scripts, **84/84 ✓**:
- A20260516-02 activation funnel (46) — same file (teams.js + invitations.js)
- A20260515-04 manager welcome email (28) — same file
- A20260513-08a temp-password hotfix (10) — same file

Total: **125/125 ✓ across 4 scripts**, zero collateral on same-file consumers.

[test-sprint22-epic-c-phase3.js](../../../scripts/test-sprint22-epic-c-phase3.js) noted as failing — verified via `git stash` reproduction that it **fails identically on pre-A20260517-01 code** with `Configuration validation failed` error in [middleware/logging.js:7](../../../server/middleware/logging.js#L7). Pre-existing env-config issue, NOT a regression from today's changes.

### Sprint 26 status at this slice

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24** (UNCHANGED — A20260517-01 is bug-fix, not firing sub-slice) |

### AUDIT_TRACKER counter flip

| Counter | Before | After | Delta |
|---|---|---|---|
| High OPEN | 10 | 9 | -1 |
| High FIXED | 24 | 25 | +1 |
| Total | 169 | 169 | 0 (status migration only) |

### Memory rules driving this slice

- `feedback_no_destructive_without_greenlight` — 6 pre-edit Qs + 1 impact-analysis amendment greenlit before line 1 of code; impact sweep surfaced Layer 3 + Q4 expansion BEFORE first edit
- `feedback_why_what_how_when` — Why-first: user's "seamless teams" Beta-quality intent shifted scope from refinement-track to fix-now; What/How/When derived from there
- `feedback_minimal_change_grounding` — ~32 LoC total across 3 surfaces; declined Q2(b) drop-the-in-body-check (more LoC); declined Q4(a) single-site fix (would leave 3 other 403s)
- `feedback_reuse_max` — `findByManagerOrMemberAsManager` mirrors `findByManager` shape verbatim (sort + is_active filter); `isManagedBy` is single source replacing 4 duplicated bare predicates
- `feedback_extend_before_wrap` — added NEW instance method + NEW static to existing Team model; no new helper module / no new branch / no schema change
- `feedback_audit_governance` — A20260517-01 row + comment block + handoff + commit updated atomically; status flipped PLAN → FIXED with counter delta honestly recorded per Q7(a)
- `feedback_test_fixture_validation` — Team.members subdoc schema (role required, status enum {'active','inactive'} default 'active') verified BEFORE writing predicate assertions; defensive paths for corrupt/missing data exercised
- `feedback_quote_the_canon` — `isMember()` existing pattern (status='active' filter) quoted in new `isManagedBy()` predicate; helper sort + is_active pattern quoted from existing `findByManager`

### Branch status at this slice

- Working tree dirty (pending commit):
  - MODIFIED [server/models/Team.js](../../../server/models/Team.js) (new isManagedBy + findByManagerOrMemberAsManager helpers)
  - MODIFIED [server/routes/teams.js](../../../server/routes/teams.js) (3-layer fix at 6 surfaces)
  - MODIFIED [KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) (counter flip + row flip + comment)
  - MODIFIED this handoff
  - NEW [scripts/test-sprint26-A20260517-01-manager-team-management.js](../../../scripts/test-sprint26-A20260517-01-manager-team-management.js)
- 0 commits ahead of `origin/development` (089abf4 part-2 already pushed); after this lands: 1 commit ahead

### Next session recommendation

1. **Push** this commit → Render auto-deploys `karvia-business-1` (~3 min) → carries Manager team management fix
2. **Resume /testing replay** from Sagar's perspective: Sagar logs in → /pages/teams.html → sees String Client team(s) → clicks "Add Member" → invites essenceofmrs@gmail.com as EMPLOYEE → Employee accepts via invitation-accept.html?token=… (today's A20260516-02 fix) → Employee logs in → Gates 6-12 (assessment dispatch → diagnostic → objective creation → plan → task)
3. **OR** /coding B3d (A20260514-14, ~1.5h, Dashboard/aggregator KPI reframe, Sprint 26 firing 15/24 → 16/24)
4. **Refinement-track unchanged**: A20260515-01 multi-account login + 21 architecture findings deferred

---

## /coding — 2026-05-17 (A20260516-02 part 2 — P3 + Gap 2 sealed — Consultant→team-member chain GREEN → FULL FIXED)

### Trigger

Per /coding part 1 (`e2f097a`) next-session recommendation #1 — A20260516-02 PARTIAL → FULL seal via P3 + Gap 2. User invoked /coding directly after part 1 commit. Scope: close the Consultant→team-member parallel chain that was deferred from part 1's lean Q1(b) ship.

### What shipped (single commit, this entry)

3 surfaces, ~25 LoC restructure + ~80 LoC test extension. Audit ID A20260516-02 flipped 💻 PARTIAL → ✅ FULL FIXED + counters Critical OPEN 1→0, Critical FIXED 10→11.

| Surface | Defect | Fix |
|---|---|---|
| [invitations.js:1807-1846](../../../server/routes/invitations.js#L1807) (Gap 2) | Invitation only created when `send_assessment && template_id` truthy → P3 link template would reference null `invitation` variable in the non-assessment path; AND the assessment-branch invitation was missing 6 canon fields (`user_created`, `user_id`, `sent_by`, `recipient_role`, `sent_at`, `status: 'sent'`) so even when it existed Gap 1's relaxed predicate would NOT fire → 409 | Always-create canonical invitation mirroring [teams.js:967-986](../../../server/routes/teams.js#L967) canon verbatim. `assessment_template_id` conditionally attached via spread (`...(assessmentTemplate ? { assessment_template_id: template_id } : {})`). Collapses prior 2-state code path into single canonical |
| [invitations.js:1860](../../../server/routes/invitations.js#L1860) (P3) | `loginUrl = ${APP_URL}/pages/login.html` — same dead-end pattern as P1 in the consultant→team-member parallel path (used by [assessment-hub.html:3008](../../../client/pages/assessment-hub.html#L3008)) | `${APP_URL}/pages/invitation-accept.html?token=${invitation.invitation_token}` — mirrors P1 + [consultant.js:573](../../../server/routes/consultant.js#L573) canon |
| [invitations.js:1891](../../../server/routes/invitations.js#L1891) (Q4) | `assessment_sent: !!invitation` — after Gap 2 invitation always exists → flag always true → contract lie | `assessment_sent: !!assessmentTemplate` — derives from caller intent (template attached) not invitation existence |

### Hidden depth caught pre-edit (per `feedback_why_what_how_when`)

Pre-edit Q-gate surfaced a coupling beyond what part-1 trace had surfaced: the assessment-branch invitation at the pre-fix [invitations.js:1813](../../../server/routes/invitations.js#L1813) was missing 6 canon fields. Without canon-mirror, even an always-created invitation would have failed the Gap 1 relaxed predicate (`user_created === true`) → fall to else branch → 409 "User already exists" → consultant→team-member chain still dead-ended.

Net: Gap 2 ≠ "always create an invitation" — Gap 2 = "always create an invitation with the same shape as teams.js canon." Cost of catching this pre-edit: 5 min. Cost if missed: ~30 min iteration + a broken ship that looked correct.

### 8 pre-edit Q-gates honored

| Q | Decision |
|---|---|
| Q1 — scope packaging | **(a) Bundle P3 + Gap 2 in single commit** — inseparable |
| Q2 — invitation shape | **(a) ONE invitation canon-mirrored** — `invitation_type: 'individual'`, `user_created: true`, `user_id: newUser._id`, `sent_by: consultantId`, `recipient_role: role`, `status: 'sent'`, `sent_at: now`, `expires_at: now+7d`; `assessment_template_id` conditionally spread |
| Q3 — expiry policy | **(a) 7 days unconditional** — matches teams.js + email "expires_days: 7" copy |
| Q4 — `assessment_sent` flag | **(a) Decouple** — `!!assessmentTemplate` (caller intent), not `!!invitation` (would always be true post-Gap 2) |
| Q5 — `team_id` on invitation | **(a) Omit** — consultant→team-member adds user directly to company, no team context |
| Q6 — P3 link change | **(a) Mirror P1 verbatim** — `invitation-accept.html?token=${invitation.invitation_token}` |
| Q7 — status flip + counters | **(a) Flip 💻 PARTIAL → ✅ FULL FIXED + counters** — Critical OPEN 1→0, Critical FIXED 10→11; honest accounting per `feedback_audit_governance` |
| Q8 — test extension | **(a) Extend existing test with PART 5** — one test, two parts (mirrors A20260514-11 part-1/part-2 precedent) |

### Regression health at this slice

Extended [scripts/test-sprint26-A20260516-02-activation-funnel.js](../../../scripts/test-sprint26-A20260516-02-activation-funnel.js) PART 5 (21 new assertions: 3 isolation + 3 P3 link + 5 Gap 2 always-create invariants + 8 canon-mirror field assertions + 2 Q4 response decoupling + 1 audit marker + 3 anti-regression). Total **46/46 ✓** on first run (was 22/22 at part 1; +24 new — 21 PART 5 assertions + 3 isolation/extraction checks).

Sibling sweep — 5 directly-adjacent scripts, **103/103 ✓**:
- -15-04 (28) + -13-08a (10) + -12-15 (17) + -12-13 (18) + -16-01 (30) = 103
- + this 46 = **149/149 ✓ total across 6 scripts**, zero collateral

Surface-impact set is invitations.js + teams.js only — the 5 scripts cover the entire blast radius.

### Sprint 26 status at this slice

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24** (UNCHANGED — -02 is bug-fix, not firing sub-slice) |

### AUDIT_TRACKER counter flip

| Counter | Before | After | Delta |
|---|---|---|---|
| Critical OPEN | 1 | 0 | -1 |
| Critical FIXED | 10 | 11 | +1 |
| Total | 168 | 168 | 0 (status migration only) |

### Memory rules driving this slice

- `feedback_no_destructive_without_greenlight` — 8 pre-edit Qs greenlit before line 1; surfaced 1 hidden coupling (6 missing canon fields on assessment-branch invitation) that would have broken even an always-created invitation
- `feedback_why_what_how_when` — pre-edit canon-trace surfaced Gap 2's true depth BEFORE edits; saved ~30 min iteration + a broken ship
- `feedback_minimal_change_grounding` — restructure collapses 2-state code path into single canonical; declined Q2(b) two-invitation split as unnecessary churn
- `feedback_reuse_max` — invitation construction mirrors teams.js:967-986 verbatim (8 fields); spread pattern for conditional `assessment_template_id` is the smallest readable conditional attach
- `feedback_extend_before_wrap` — extended existing /invite-team-member handler in place; no new helper / no new module / no new branch
- `feedback_audit_governance` — A20260516-02 row + comment block + handoff + commit updated atomically; status flipped PARTIAL → FULL with counter delta honestly recorded
- `feedback_cleanup_boundary_pattern` — part-2 inverse-test pattern: PART 5 assertions invert the part-1 deferral markers (e.g., `(23) Invitation creation is NOT gated behind 'if (send_assessment'` proves the deferred gating is gone). Matches S25 PX-3.21 + S26 A20260514-11 part-1/part-2 + S26 A20260515-04 precedent
- `feedback_quote_the_canon` — canon-mirror fields quoted from teams.js:967-986 verbatim (`invitation_type: 'individual'` + `user_created: true` etc.); not paraphrased
- `feedback_test_fixture_validation` — Invitation schema re-read before adding assessment_template_id spread; verified field is `String` type (template_id ObjectId stringified by Mongoose cast)

### Branch status at this slice

- Working tree dirty (pending commit):
  - MODIFIED [server/routes/invitations.js](../../../server/routes/invitations.js) (Gap 2 + P3 + Q4)
  - MODIFIED [scripts/test-sprint26-A20260516-02-activation-funnel.js](../../../scripts/test-sprint26-A20260516-02-activation-funnel.js) (PART 5 extension)
  - MODIFIED [KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) (row flip + summary counters + comment)
  - MODIFIED this handoff
- 1 commit ahead of `origin/development` (part 1 `e2f097a`); after this lands: 2 commits ahead

### Next session recommendation

1. **Push** both `e2f097a` (part 1) + this part-2 commit to `origin/development` → Render auto-deploys `karvia-business-1` (~3 min) — carries full team-member activation chain fix end-to-end
2. **Resume `/testing` journey** from Gate 4 replay (BO re-invites Manager → token link works → Manager accepts via `invitation-accept.html` → Manager invites Employee → continue Gates 6-12 assessment dispatch + diagnostic + objective creation + first plan + first task)
3. **Sprint 26 next firing slice**: `/coding` B3d — A20260514-14 (~1.5h, Dashboard/aggregator KPI reframe, Sprint 26 firing 15/24 → 16/24)
4. **Refinement-track** unchanged: A20260515-01 multi-account login, 21 audit findings deferred

---

## /coding — 2026-05-17 (A20260516-02 PARTIAL — P1 + P2 + Gap 1 newly-surfaced — BO→Manager Beta chain GREEN)

### Trigger

Per /testing #249 (2026-05-16) "Tomorrow's resume plan" — A20260516-02 CRITICAL bundle scheduled for today. User invoked /init → /coding. Scope chosen: lean slice closes BO→Manager + Manager→Employee Beta activation chain (the every-BO's-first-action gate). Consultant→team-member parallel deferred.

### What shipped (single commit, this entry)

3 surfaces, ~7 LoC + ~280 LoC test. Status PARTIAL FIXED per A20260514-11 part-1/part-2 precedent — counters held until P3 + Gap 2 seal the bundle in a follow-up slice.

| Surface | Defect | Fix |
|---|---|---|
| [teams.js:995](../../../server/routes/teams.js#L995) (P1) | `loginLink = ${APP_URL}/pages/login.html` — Manager dead-ends on bare login (opaque hex pw per A20260513-08a) | `${APP_URL}/pages/invitation-accept.html?token=${invitation.invitation_token}` — token at line 969 was orphaned; mirrors [consultant.js:573](../../../server/routes/consultant.js#L573) canon |
| [teams.js:1010](../../../server/routes/teams.js#L1010) (P2) | `team_name: team.name` leaks literal "Default" (auto-team at [consultant.js:542](../../../server/routes/consultant.js#L542)) | `team_name: team.company_id.name` — header reads "Welcome to {Company}"; trade-off acknowledged at Q4(a) — real non-Default teams also read company name |
| [invitations.js:172-213](../../../server/routes/invitations.js#L172) (Gap 1 — **newly-surfaced at Q-gate stage**) | `/accept` predicate over-coupled: `(invitation_type IN [company_assessment, company_onboard] && user_created)` would 409 Manager on "User already exists" since teams.js stamps `invitation_type: 'individual'` | Relaxed to semantic `invitation.user_created === true`; renamed `isCompanyInvitationWithUser` → `isPreCreatedUserInvitation` (3 refs atomic); all 4 invitation_types that ever set user_created=true audited 2026-05-17 |

### Hidden gaps caught pre-edit (per `feedback_why_what_how_when` + `feedback_no_destructive_without_greenlight`)

Handoff plan assumed ~3 LoC across 2 files. Pre-edit canon-trace of the P1 target (`invitation-accept.html?token=…` → `/api/invitations/accept/:token`) surfaced 2 additional broken seams:

- **Gap 1 (shipped today)** — `/accept` predicate would 409 Manager even after P1 fix (above)
- **Gap 2 (deferred)** — [invitations.js:1799](../../../server/routes/invitations.js#L1799) `/invite-team-member` only creates Invitation when `send_assessment && template_id` truthy. P3 link fix at [invitations.js:1828](../../../server/routes/invitations.js#L1828) would reference null `invitation` variable when consultant invites without assessment. Requires ~10 LoC restructure of invitation creation order. Lands in follow-up slice (A20260516-02 part 2).

Net: handoff prescription would have shipped a fix that still 409'd Manager + broken P3 surface. Pre-edit Q-gate saved ~30 min iteration + a broken ship.

### 6 pre-edit Q-gates honored

| Q | Decision |
|---|---|
| Q1 — scope | **(b) Lean slice** — P1 + P2 + Gap 1 today; P3 + Gap 2 to follow-up slice |
| Q2 — Gap 1 predicate shape | **(a) Drop type allowlist** — `user_created === true` is the semantic |
| Q3 — Gap 2 fix shape | N/A under Q1(b) |
| Q4 — team_name | **(a) `team.company_id.name` unconditional** — real non-Default teams also read company name (uniform across BO→Manager chain) |
| Q5 — FE polish at invitation-accept.html:379-411 | **(b) Defer to refinement-track** — Manager sees "Fill in details" form with name pre-filled; UX leak, not a dead-end |
| Q6 — preprod cleanup | **(a) Surgical wipe** — STRING Sounds tenant only via re-targeted [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js); consultant + Karvia Consulting preserved so Gate 4 resumes from Gate 2 |

### Pre-flight result (Q6 (a))

Re-probe via [scripts/probe-journey-fixture-cleanup.js](../../../scripts/probe-journey-fixture-cleanup.js) showed 3 users (rsm consultant + stringsounds BO + sagar Manager pending_invite) + 2 companies + 3 cascade docs. Retargeted delete script (STRING Sounds only: 2 users + 1 company + 3 cascade) ran clean — post-delete verification all zeros. Karvia Consulting intact.

### Regression health at this slice

NEW [scripts/test-sprint26-A20260516-02-activation-funnel.js](../../../scripts/test-sprint26-A20260516-02-activation-funnel.js) **22/22 ✓** on first run.

Sections:
- **Part 1 teams.js × 7** — handler isolation + object-literal extraction + 5 P1/P2 assertions (loginLink template references invitation-accept.html?token=, interpolates `invitation.invitation_token`, doesn't terminate at bare login.html; team_name = `team.company_id.name`, NOT `team.name` literal)
- **Part 2 /accept predicate × 4** — predicate value (`user_created === true`), old `isCompanyInvitationWithUser` purged file-wide, new identifier referenced ≥3× in handler, no type-allowlist coupling in predicate zone
- **Part 3 audit markers × 3** — A20260516-02 P1, P2, Gap 1 markers inline
- **Part 4 anti-regression × 6** — A20260515-04 P1 inviter lookup + email-local-part fallback; A20260515-04 P3 no `temp_password` in payload; A20260513-08a tempPassword still randomBytes(24).toString('hex'); A20260512-13 APP_URL-only no `||` fallback chain; token-must-exist-before-interpolation invariant (`invitation.save()` precedes loginLink construction)

Sibling sweep — 13 scripts, **417/417 ✓**:
- Same-file/region: -15-04 (28) + -13-08a (10) + -12-15 (17) + -12-13 (18) = 73
- Recent firing slices: -16-01 (30) + -14-11 part 2 (37) + -14-11 part 1 (PASS) + -14-12 (37) + -15-02 (79) = 183
- Sprint 26 earlier: -14-09 (24) + -14-10 (20) + -14-07 (43) + -14-08 (52) = 139
- Zero collateral from `isPreCreatedUserInvitation` rename (no test referenced old identifier — confirmed via post-edit grep)

### Sprint 26 status at this slice

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24** (UNCHANGED — -02 is bug-fix, not firing sub-slice) |

### Memory rules driving this slice

- `feedback_no_destructive_without_greenlight` — 6 pre-edit Qs greenlit before line 1 of code; pre-flight probe-then-delete pattern; surgical preprod wipe (kept consultant intact)
- `feedback_why_what_how_when` — pre-edit canon-trace surfaced Gap 1 + Gap 2 BEFORE edits started; saved a broken ship
- `feedback_minimal_change_grounding` — declined the full-chain Q1(a) in favor of lean Q1(b) (P3+Gap 2 deferred to follow-up rather than over-pack)
- `feedback_reuse_max` — P1 fix mirrors consultant.js:573 verbatim; P2 mirrors invitations.js:1838; predicate semantically equivalent to original intent
- `feedback_extend_before_wrap` — Gap 1 fix relaxes predicate in place (rename + body change); no new helper / no new module / no new branch
- `feedback_audit_governance` — A20260516-02 row updated atomically across AUDIT_TRACKER (Status Matrix + comment block) + handoff + commit message; status = PARTIAL FIXED per A20260514-11 precedent
- `feedback_cleanup_boundary_pattern` — P3 + Gap 2 explicitly scoped in tracker + handoff as follow-up slice with concrete next-edit pointers (line numbers + restructure shape)
- `feedback_quote_the_canon` — Q-gate rationale cites canon files verbatim (consultant.js:573, invitations.js:1838); rename rationale cites the 4 invitation_types audit done 2026-05-17

### Branch status at this slice

- Working tree dirty (pending commit):
  - MODIFIED [server/routes/teams.js](../../../server/routes/teams.js) (P1 + P2)
  - MODIFIED [server/routes/invitations.js](../../../server/routes/invitations.js) (Gap 1)
  - MODIFIED [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) (retarget for STRING Sounds wipe)
  - MODIFIED [KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md)
  - MODIFIED this handoff
  - NEW [scripts/test-sprint26-A20260516-02-activation-funnel.js](../../../scripts/test-sprint26-A20260516-02-activation-funnel.js)
  - NEW [scripts/probe-journey-fixture-cleanup.js](../../../scripts/probe-journey-fixture-cleanup.js) (from /testing #249, repeat-use)
- 0 commits ahead of origin/development (after this commit lands: +1)

### Next session recommendation

1. **`/coding` follow-up slice — A20260516-02 part 2** (~45 min) — P3 + Gap 2 to close Consultant→team-member parallel chain
   - Gap 2: restructure [invitations.js:1799](../../../server/routes/invitations.js#L1799) to always create Invitation (move above `send_assessment` branch; attach `assessment_template_id` conditionally) — ~10 LoC
   - P3: [invitations.js:1828](../../../server/routes/invitations.js#L1828) `loginUrl` template → `invitation-accept.html?token=${invitation.invitation_token}` — 1 LoC
   - Extend [scripts/test-sprint26-A20260516-02-activation-funnel.js](../../../scripts/test-sprint26-A20260516-02-activation-funnel.js) with PART 5 (P3 link fix + Gap 2 always-create invariant) — ~50 LoC additional
   - Flips A20260516-02 PARTIAL → FULL FIXED; counters Critical OPEN 1→0, Critical FIXED 10→11
2. **Resume /testing journey** from Gate 4 replay (BO re-invites Manager → token link works → Manager accepts at invitation-accept.html → Manager invites Employee → continue Gates 6-12)
3. **Push first?** — user's call; 1 commit pending after this seals. Render auto-deploys on push (~3 min) carrying P1+P2+Gap 1 to `karvia-business-1`

---

## /testing — 2026-05-16 (Manual journey walkthrough — Gate 4 break → A20260516-02 filed in 📝 PLAN, fix tomorrow)

### Trigger

User-invoked /testing session after /init #248. Scope chosen by user: "manual testing of the journey — rsm@karvia.ai (consultant), stringsounds@gmail.com (BO), sagar@culturaldiscipline.com (manager), essenceofmrs@gmail.com (employee) — delete all existing data … walk through the entire role play". Goal: 12-gate end-to-end activation arc on `karvia-business-1` to identify "where it is being stopped or how we can make sure this journey is seamless."

### Pre-flight cleanup (executed)

Per safety-first `feedback_no_destructive_without_greenlight`: probe-then-delete pattern mirroring [scripts/delete-rsm-exact-ids.js](../../../scripts/delete-rsm-exact-ids.js) precedent. NEW [scripts/probe-journey-fixture-cleanup.js](../../../scripts/probe-journey-fixture-cleanup.js) (read-only) surfaced 6 user records across 4 companies with 134 cascading docs (assessments + objectives + KRs + goals + tasks + teams + invitations). User greenlit full wipe. NEW [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) deleted 6 users + 4 companies + 127 cascade docs (drift-tolerant 5% threshold, post-delete verification all zeros). Both scripts uncommitted (test infrastructure — keep around for repeat runs).

### Walkthrough results

| Gate | Action | Status | Notes |
|---|---|---|---|
| 1 | Consultant signs up (`rsm@karvia.ai`) at `/pages/signup.html` | ✅ | Account created, role=CONSULTANT, status=active, JWT issued. No issues. |
| 2 | Consultant adds StringSounds as client + invites BO | ✅ | BO invitation email delivered with working token link via [consultant.js:573](../../../server/routes/consultant.js#L573) `invitation-accept.html?token=...` |
| 3 | BO accepts invite + logs in | ✅ | Token-bearing accept flow worked end-to-end; BO sets password; status=active |
| 4 | BO invites Manager (`sagar@culturaldiscipline.com`) | ⚠️ Email delivered but ACTIVATION DEAD-END | 2 defects surfaced (see A20260516-02 below) |
| 5 | Manager accepts + invites Employee | 🛑 BLOCKED on Gate 4 | Code-level verification: same [teams.js POST /:teamId/members/create-user](../../../server/routes/teams.js#L845) route handles Manager→Employee — SAME defects apply, ONE fix closes both |
| 6-12 | Assessment → diagnostic → objective → plan → task | ⏸️ Deferred | All downstream of broken activation chain |

### Audit ID minted (📝 PLAN)

`A20260516-02` — **MANAGER-EMPLOYEE-ACTIVATION-FUNNEL** (CRITICAL bundle, 3 parts). Per `feedback_audit_governance`: appended to [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) comment block + Status Matrix row + Summary counters (Critical OPEN 0→1, Total 167→168). Severity classification = CRITICAL (highest-part rule per A20260515-04 precedent — P1+P3 are activation blockers, P2 is HIGH copy leak).

| Part | Surface | Defect | Canon to mirror |
|---|---|---|---|
| **P1 (CRITICAL)** | [server/routes/teams.js:995](../../../server/routes/teams.js#L995) | `loginLink = ${APP_URL}/pages/login.html` — Manager has opaque hex password (per A20260513-08a), bare login page = dead-end | [consultant.js:573](../../../server/routes/consultant.js#L573) — `invitation-accept.html?token=${invitation.invitation_token}` — verified working in Gate 3 |
| **P2 (HIGH)** | [server/routes/teams.js:1010](../../../server/routes/teams.js#L1010) | `team_name: team.name` → "Welcome to Default" (auto-team at [consultant.js:542](../../../server/routes/consultant.js#L542)) | [invitations.js:1838](../../../server/routes/invitations.js#L1838) — `team_name: company.name` |
| **P3 (CRITICAL)** | [server/routes/invitations.js:1828](../../../server/routes/invitations.js#L1828) | `loginUrl = ${APP_URL}/pages/login.html` — same defect in consultant→team-member parallel path (assessment-hub invite via [assessment-hub.html:3008](../../../client/pages/assessment-hub.html#L3008)) | Same as P1 |

### What A20260515-04 fixed vs what this audit found

A20260515-04 (sealed 2026-05-15) fixed email **content** defects: `manager_name: undefined undefined` (P1 — JWT-payload-missing-names) + dead-on-arrival `sendEmail` positional call (P2) + `temp_password` leak in body (P3). It did NOT inspect the email **link target** because the walkthrough at that time stopped at "email looks correct now". This /testing walkthrough goes one click further — Manager clicks Get Started → discovers the link itself routes to a page that doesn't know how to handle a `pending_invite` user. A20260513-08a was ALSO doing its job: temp password is correctly opaque, never emailed. The gap is purely the link target.

### Memory rules driving today

- `feedback_no_destructive_without_greenlight` — probe-then-delete pattern + 3-question greenlight gate before /testing kickoff + halt-and-file vs proceed-with-edit decision branch
- `feedback_minimal_change_grounding` — recommended fix is ~3 LoC, mirrors existing canon, no new modules
- `feedback_reuse_max` — fix MUST reuse `invitation-accept.html?token=...` pattern + `company.name` instead of introducing new surface
- `feedback_extend_before_wrap` — no new email-link helper; the existing routes get extended in place
- `feedback_audit_governance` — single ID, 3 parts, 3 places (comment + matrix + summary) updated atomically
- `feedback_why_what_how_when` — pre-investigation BEFORE edits even though defect was obvious (code-level Gate 5 verification before filing scope)

### Quality reflection: 9/10

**Strong**: User-driven scope ("manual journey") executed end-to-end without scope creep; defect found AT THE EXACT activation-funnel layer Beta cares about (BO→Manager onboarding); code-level Gate 5 verification before filing prevented potential under-scoping (would have been embarrassing to ship a fix that left manager→employee broken); probe-then-delete script became reusable infrastructure (2 new scripts, both general-purpose for future journey tests); audit-tracker entry mirrors A20260515-04 precedent verbatim per `feedback_audit_governance`; held the line on safety-first when user opted A (fix-and-resume) — did NOT touch code, surfaced the broken record cleanup (Manager `sagar@culturaldiscipline.com` still in `pending_invite` state) as a pre-flight item for tomorrow.

**Negative**: Initially missed P3 (invitations.js parallel path) — only caught it after grepping for `loginLink` occurrences post-P1+P2 identification. Should have run the full `loginLink|loginUrl` grep in the FIRST pass before declaring scope. Cost: ~10 min iteration. Lesson logged to apply: when a defect is found in route A that mirrors a pattern, ALWAYS grep for sibling occurrences before scoping the fix.

### Branch status at session end

- Working tree dirty:
  - NEW [scripts/probe-journey-fixture-cleanup.js](../../../scripts/probe-journey-fixture-cleanup.js) (untracked)
  - NEW [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) (untracked)
  - MODIFIED [KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md)
  - MODIFIED this handoff
- 0 commits ahead of origin (push from #248 + #247 already synced)
- DB state: preprod fixture clean except 1 stale Manager `pending_invite` record (`sagar@culturaldiscipline.com` under company `6a0917ae82fcb83c7dd6e21f`) — DELETE BEFORE GATE 4 REPLAY tomorrow

### Tomorrow's resume plan (2026-05-17 /coding A20260516-02)

1. **Pre-flight cleanup** (~2 min)
   - Delete stale Manager `pending_invite` record + its company (re-extend [scripts/delete-journey-fixture.js](../../../scripts/delete-journey-fixture.js) targeting only company `6a0917ae82fcb83c7dd6e21f` + Manager userId)
   - Verify zero `pending_invite` records remain across the 4 journey emails
2. **Code edits** (~10 min)
   - P1: [teams.js:995](../../../server/routes/teams.js#L995) — change `loginLink` template literal to use `invitation-accept.html?token=${invitation.invitation_token}`
   - P2: [teams.js:1010](../../../server/routes/teams.js#L1010) — change `team_name: team.name` → `team_name: team.company_id.name`
   - P3: [invitations.js:1828](../../../server/routes/invitations.js#L1828) — same change as P1, but variable is named `loginUrl`
3. **Regression test** (~20 min)
   - NEW `scripts/test-sprint26-A20260516-02-activation-funnel.js` (~150 LoC)
   - Sections: static-grep on link targets (4 assertions); team_name resolution (3); vm-sandbox of `sendTeamMemberWelcomeEmail` payload composition (6); anti-regression for A20260515-04 P1-P3 + A20260513-08a opaque-password (5)
4. **Sibling sweep** to ensure zero collateral on the 10 prior audit-ID scripts (~3 min)
5. **Commit + push** (~2 min, ~25 min Render redeploy delay can run async)
6. **Resume journey** from Gate 5 (BO re-invites Manager → token link works → Manager accepts → Manager invites Employee → continue through Gates 6-12)

**Pre-edit Q-gates expected**: 4-5 (scope=3 parts y/n, team_name source y/n, regression-script shape, single ID single commit, anti-regression set). All should be (a) — minimal-change defaults.

### Sprint 26 status (UNCHANGED — bug-fix not firing)

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ |
| **Firing tally** | **15/24** (no change — A20260516-02 is bug-fix, not firing sub-slice) |

---

## /close — 2026-05-16 (Two-slice arc — A20260516-01 + B3c sealed; 3 audit IDs flipped)

### Trigger

End of session #247 + #248 arc — both /coding cycles sealed cleanly. User invoked `/close` after declining to push B3d into the same session ("see if we have enough context?" → opted to wrap rather than over-pack).

### What shipped today (2 commits, both pending push)

| Commit | Audit IDs | Description |
|---|---|---|
| `776debb` | `A20260516-01` (2 parts) | AI Orchestrator hardening — cache tenant-key isolation + wizard `requireRole`. Closes 2 Critical findings from /audit-architecture A20260515-03 before Beta-2. |
| `86b994e` | `A20260514-11` part 2 + `ARCH-DB-002` bundled | B3c backend-only ship — `validateGoalNoOverlap` + new compound index. Flips `A20260514-11` PARTIAL → FULL after 2-day deferral. |

### Audit IDs touched today

| ID | Status before | Status after |
|---|---|---|
| `A20260516-01` | n/a | ✅ FIXED — minted + 📝→💻→✅ same session |
| `A20260514-11` | 💻 PARTIAL (since 2026-05-14) | ✅ FULL — part 2 shipped per ship-with-consumer principle |
| `ARCH-DB-002` | 📝 OPEN (since /audit-architecture 2026-05-15) | ✅ FIXED — bundled inline with B3c per canon Rev 2 |
| `A20260514-13` (Window CRUD UI) | 📝 PLAN | ⏳ DEFERRED to refinement-track per Q1 (a) — B3b min-amendment stance preserved |

### Regression health at /close

**373/373 ✓** across 10 audit-ID scripts:
- NEW today: A20260516-01 (30/30) + A20260514-11 part 2 (37/37) = 67
- A20260514-11 part 1 flipped per `feedback_cleanup_boundary_pattern` (23/23 ✓)
- Siblings: -09 (24) + -10 (PASS) + -14-12 (37) + -15-04 (28) + -15-02 (79) + -14-07 (43) + -14-08 (52) = 283

### Sprint 26 status at /close

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ + Q9 ✅ |
| **Firing tally** | **15/24 (62.5%)** — up from 14/24 (A20260514-11 part 2 firing; A20260516-01 governance-scoped) |

### Memory rules driving today

- `feedback_why_what_how_when` — pre-flight verify drove safety BEFORE Q-gates; Q-gates drove scope BEFORE edits
- `feedback_no_destructive_without_greenlight` — 7+8=15 Qs greenlit before line-1 of code across both slices
- `feedback_minimal_change_grounding` — A20260516-01 declined ARCH-MW-001 bundle; B3c declined A20260514-13 UI scope
- `feedback_reuse_max` — both slices mirror existing patterns (validateGoalDateHierarchy + B1.4 wire pattern + LLMPolicy.OPS canon)
- `feedback_extend_before_wrap` — no new façades, no new modules; all extensions to existing files
- `feedback_audit_governance` — 3 audit IDs touched in lockstep across tracker + handoff + commit + session log
- `feedback_cleanup_boundary_pattern` — A20260514-11 TODO marker retired + part-1 test assertion flipped inversely; mechanical pattern matches S25 PX-3.21 + S26 A20260515-04 precedent
- `feedback_quote_the_canon` — Revisions 1+2+3 quoted verbatim from §3.2b; pre-flight script output quoted in entry
- `feedback_test_fixture_validation` — 4+2=6 first-run test issues caught + fixed before commits

### Quality reflection: 9/10

**Strong**: Two clean back-to-back /coding cycles each with full pre-edit Q-gate discipline; pre-flight verify ran cleanly against preprod (no decision branch needed for B3c); cleanup-boundary flip on part-1 test was mechanical (TODO-exists → TODO-gone-validator-present); 373/373 ✓ regression sweep zero collateral; honored handoff #246 scope verbatim (declined ARCH-MW-001 bundle); honored user's B3b min-amendment stance verbatim (declined A20260514-13 UI scope); 3 audit IDs sealed in one day across 2 firing slices.

**Negative**: AUDIT_TRACKER first edit on A20260516-01 placed the new row under the wrong status matrix header — required revert + clean re-insert (5 min wasted); 4 test fixture issues on A20260516-01 + 2 on B3c (cumulative ~20 min iteration) — should mentally rehearse "what real chars appear in source line including parens/templates" before writing static-grep regex.

### Branch status at /close

- 2 commits ahead of `origin/development`: `776debb` + `86b994e`
- Working tree: clean after this /close docs commit
- **NOT YET PUSHED** — user declined push at end of A20260516-01 + B3c. Render will redeploy `karvia-business-1` on next push (~3 min) carrying: tenant-isolated AI cache + wizard role gate + non-overlap validator + new compound index.

### Next session recommendation

1. **`/coding` B3d — A20260514-14** (~1.5h) — Dashboard/aggregator KPI reframe per canon §3.5
   - [consultant.js](../../../server/routes/consultant.js) `/dashboard-summary` — drop quarter-based aggregations + add `active_windows` + `windows_ending_in_14d` + `stalled_phases` computed fields
   - [dashboard-v2.js](../../../client/pages/scripts/dashboard-v2.js) — KPI strip rewrite (current 6 cards → 3 phase-aware cards)
   - [client-workspace.js Plan tab](../../../client/pages/scripts/client-workspace.js) — minor label changes (already date-aware after C.1a)
   - Uses new compound index from B3c
   - Sprint 26 firing 15/24 → 16/24
2. **Push first?** — user's call; 2 commits pending. Render auto-deploys runtime code on push
3. **A20260514-13** (Window CRUD UI) stays deferred to refinement-track / post-Beta-1
4. **Sprint 27** picks up `PX-3.18` dual-write cleanup (`ARCH-DB-001`)
5. **Refinement-track**: A20260515-01 multi-account login, 21 audit findings deferred, A20260514-11 bulk endpoint validator gap

---

## /coding — 2026-05-16 (B3c — A20260514-11 part 2 validateGoalNoOverlap + ARCH-DB-002 bundled — backend-only ship)

### Trigger

Per /close #246 next-session recommendation #2, after A20260516-01 sealed the 2 Critical audit findings. User selected B3c. Pre-flight `node scripts/db/verify-goal-schema-relaxation.js` against preprod: **0 overlapping pairs** across 4 QUARTERLY goals with dates → strict-from-day-one safe; no data normalization decision branch needed.

### What shipped (single commit, this entry)

| Audit ID | Description |
|---|---|
| `A20260514-11` (part 2) | feat(sprint26 B3c): validateGoalNoOverlap + new compound index (Rev 1+2+3) — closes A20260514-11 + ARCH-DB-002 |
| `ARCH-DB-002` | Bundled — project-mode compound index lands with validator per canon §3.2b Rev 2 (zero new scope) |

### Scoping decision: backend-only ship (Q1 (a))

A20260514-13 (Window CRUD UI) **deferred** — B3b shipped as min-amendment ("really really simple, no redesign") per user direction at /coding 2026-05-15; current planning-v2.html has no Window UI surface. Validator still has organic consumers (every POST/PUT /quarterly flow including the wizard's `finalizeWizardObjective` BE path + any future UI). Ship-with-consumer principle satisfied on existing routes.

### 2 surfaces touched + 1 new test + 1 sibling test flipped (~110 LoC + ~450 LoC test)

| Part | File | Change |
|---|---|---|
| Validator | [server/routes/goals.js:40-130](../../../server/routes/goals.js#L40-L130) | TODO marker replaced with `async function validateGoalNoOverlap(candidateGoal, company_id)`. Rev 1 early-return on non-QUARTERLY; Rev 3 grandfathering early-return when `parent.time_period_type !== 'custom'`. Sibling query excludes self via `_id $ne` on PUT + `status:{$ne:'cancelled'}` per CLAUDE.md soft-delete contract. Strict less-than overlap test per canon §2.2 boundary rule (adjacent phases sharing boundary day pass). Error body `GOAL_DATE_OVERLAP` cites `conflicting_sibling: {_id, name, start_date, due_date}` + `candidate: {start_date, due_date}`. |
| POST wire | [server/routes/goals.js:1054-1060](../../../server/routes/goals.js#L1054-L1060) | `overlapCheck` after existing `dateCheck`, before `new Goal(goalData)`. Mirrors B1.4 pattern. |
| PUT wire | [server/routes/goals.js:1198-1203](../../../server/routes/goals.js#L1198-L1203) | `overlapCheck` inside the `if (req.body.start_date !== undefined \|\| req.body.due_date !== undefined)` schedule-touched gate, after existing `dateCheck`. Passes `goal` (post-update candidate), not `goalData`. Self-exclusion via `_id $ne` query inside helper. |
| Index | [server/models/Goal.js:341-346](../../../server/models/Goal.js#L341-L346) | NEW `goalSchema.index({ objective_id: 1, time_period: 1, start_date: 1 })` per canon Rev 2. Inline comment cites ARCH-DB-002 + A20260514-11 part 2 + mongoose-syncIndexes footnote. 3 existing hierarchy/time-period indexes preserved unchanged. |
| NEW test | [scripts/test-sprint26-A20260514-11-part2-validateGoalNoOverlap.js](../../../scripts/test-sprint26-A20260514-11-part2-validateGoalNoOverlap.js) | 37 checks across 4 sections (goals.js static × 16, Goal.js static × 4, vm-sandbox overlap math × 9, live-fire Express+stubbed-Mongoose × 6). |
| Flipped sibling | [scripts/test-sprint26-A20260514-11-window-name-route.js:63-75](../../../scripts/test-sprint26-A20260514-11-window-name-route.js#L63-L75) | Per `feedback_cleanup_boundary_pattern` — TODO-exists assertions (a) inverted to TODO-gone + `validateGoalNoOverlap` present + Rev-3 guard live. Final-line label flipped PARTIAL → FULL. Still 23/23 ✓. |

### Pre-edit Q gates honored (per `feedback_no_destructive_without_greenlight`)

All 8 greenlit (a) — minimal-change defaults:
- Q1 (a) Backend-only ship — A20260514-13 Window CRUD UI deferred (B3b min-amendment stance preserved)
- Q2 (a) QUARTERLY-only per canon §3.2b Rev 1 (WEEKLY skipped — work-unit layer allowed to overlap)
- Q3 (a) 2 routes wired (POST + PUT /quarterly); bulk deferred (pre-existing dateCheck gap there too)
- Q4 (a) Rev 3 grandfathering via parent-fetch early-return (mirrors validateGoalDateHierarchy parent-fetch pattern)
- Q5 (a) ONE new compound index per canon Rev 2 (mongoose syncIndexes absent — no removal of legacy index)
- Q6 (a) Bulk endpoint NOT wired (pre-existing gap; refinement-track)
- Q7 (a) Single new regression script covering both surface + helper math + live-fire
- Q8 (a) Single audit ID `A20260514-11` flips PARTIAL 💻 → ✅; ARCH-DB-002 bundled inline (no new ID); single commit

### Pre-flight result

```
═══ Goal schema relaxation verifier (A20260514-10) ═══
— (1) Migration-free state of quarter/year fields
  Total Goals: 16  (100% carry both quarter + year — zero-op state confirmed)
— (2) QUARTERLY sibling date-range overlap audit (Risk 3)
  QUARTERLY goals with both dates: 4
  Objectives with overlapping pairs: 0
  Total overlapping pair count: 0
  ✓ No legacy overlapping QUARTERLY siblings found.
```

→ No data normalization needed; validator ships strict-from-day-one.

### Regression health at this slice

| Audit ID | Tests | Result |
|---|---|---|
| A20260514-11 part 2 (NEW) | 37/37 ✓ | PASS |
| A20260514-11 part 1 (flipped per cleanup-boundary pattern) | 23/23 ✓ | PASS |
| A20260514-10 | PASS | PASS |
| A20260514-09 | 24/24 ✓ | PASS |
| A20260514-12 | 37/37 ✓ | PASS |
| A20260516-01 | 30/30 ✓ | PASS |
| A20260515-04 | 28/28 ✓ | PASS |
| A20260515-02 | 79/79 ✓ | PASS |
| A20260514-07 | 43/43 ✓ | PASS |
| A20260514-08 | 52/52 ✓ | PASS |
| **Total** | **373/373 ✓** across 10 scripts | **CLEAN** |

### Sprint 26 status at this slice

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ + Q9 ✅ |
| **Firing tally** | **15/24** (was 14/24) — A20260514-11 part 2 ships B3c; counts as 1 firing per canon §4.1 session-split (B3c = 1 of 4 B3 sessions) |

### Memory rules driving this slice

- `feedback_why_what_how_when` — pre-flight verify (Why: safety) → Q-gate (What: scope) → 2-surface edit (How: minimal) → ship-with-consumer (When: now, not deferred)
- `feedback_no_destructive_without_greenlight` — 8 pre-edit Qs surfaced + greenlit before line-1 of code; pre-flight required before any edit
- `feedback_minimal_change_grounding` — backend-only ship (A20260514-13 deferred); Rev 1 QUARTERLY-only (not broader); 2 routes not 3 (bulk gap deferred); 1 new index not 2 (mongoose syncIndexes absent)
- `feedback_reuse_max` — mirrors `validateGoalDateHierarchy` pattern verbatim (parent-fetch + early-skip + structured error result); uses existing `Objective` import; test harness extends -11 stubbed-Mongoose pattern
- `feedback_extend_before_wrap` — added helper alongside existing `validateGoalDateHierarchy` (not a new module/service); index added to existing Goal.js index list (not a new schema)
- `feedback_audit_governance` — 1 ID for 1 part-2 ship; in-lockstep tracker + handoff + commit; ARCH-DB-002 bundled inline (no new ID); part-1 test flipped per cleanup-boundary pattern
- `feedback_quote_the_canon` — Revisions 1+2+3 quoted verbatim from §3.2b; pre-flight script run + output quoted in this entry
- `feedback_cleanup_boundary_pattern` — TODO marker at goals.js:40 was the cleanup-target registry entry; when part 2 shipped, marker retired + part-1 test assertion flipped inversely (TODO-exists → TODO-gone-validator-present); mechanical pattern matches S25 PX-3.21 precedent
- `feedback_test_fixture_validation` — 2 first-run test issues caught + fixed: (i) PUT-gate regex too short → block-slice approach; (ii) POST /weekly missing required `objective_id + name + week` per goals.js:1697

### Branch status at this slice

- 2 commits pending push (this commit + the earlier A20260516-01 `776debb`)
- Working tree: clean after this commit
- Render auto-deploys on push → `karvia-business-1` redeploy carries: tenant-isolated AI cache + wizard role gate + non-overlap validator + new compound index (mongoose will create the new index on first connect via `Goal.init()` background indexing)

### Next session recommendation

1. **`/coding` B3d — A20260514-14** (~1.5h) — Dashboard/aggregator KPI reframe per canon §3.5
   - [consultant.js](../../../server/routes/consultant.js) `/dashboard-summary` — replace quarter-based aggregations with date-range; add `active_windows` + `windows_ending_in_14d` + `stalled_phases` computed fields
   - [dashboard-v2.js](../../../client/pages/scripts/dashboard-v2.js) KPI strip rewrite (current "0 moves / 0% this week / momentum" + 3 cards replaced with new semantics)
   - [client-workspace.js Plan tab](../../../client/pages/scripts/client-workspace.js) — minor label changes (already date-aware after C.1a)
   - Sprint 26 firing 15/24 → 16/24
2. **A20260514-13** (Window CRUD UI) **stays deferred** to refinement-track / post-Beta-1 — revisit when planning-page redesign or a dedicated Windows tab is in scope
3. **Sprint 27** picks up `PX-3.18` dual-write cleanup (`ARCH-DB-001`)
4. **Refinement-track**: A20260515-01 multi-account login, 21 audit findings deferred, A20260514-11 bulk endpoint validator gap

---

## /coding — 2026-05-16 (AI Orchestrator hardening — A20260516-01, 2 parts, Critical ×2 before Beta-2)

### Trigger

Per /close #246 next-session recommendation #1: close the 2 Critical findings (`ARCH-AI-001` + `ARCH-AI-002`) from /audit-architecture A20260515-03 before more Workstream B feature work. Sign-off cut explicitly promoted these as "actionable next session" and tagged a future audit ID. User invoked `/coding` and selected A20260516-01 over B3c/B3d alternatives.

### What shipped (single commit, this entry)

| Audit ID | Description |
|---|---|
| `A20260516-01` (2 parts) | fix(sprint26): AI Orchestrator hardening — cache tenant-key isolation + wizard requireRole gate (2 Critical findings) |

### 2 surfaces touched + 1 new test (~22 LoC net + ~280 LoC test)

| Part | File | Change |
|---|---|---|
| P1 (ARCH-AI-001) | [server/services/AIContextService.js:2196-2219](../../../server/services/AIContextService.js#L2196-L2219) | Lifted tenant from `params.company_id \|\| params.companyId` into a tenantKey prefix on the `cacheKey` line. Helper `_stableKey()` unchanged — purity preserved (Q4 (a)). Missing tenant → `'no-tenant'` bucket + `logger.warn` cites operation (Q5 (a)). Pre-fix `${providerName}:${this._stableKey(params)}` literal removed (anti-regression). All 3 known callers ([objectives.js:1596](../../../server/routes/objectives.js#L1596) + [weekly-goals.js:434](../../../server/routes/weekly-goals.js#L434) + [moves.js:496](../../../server/routes/moves.js#L496)) verified to pass `company_id` already — sentinel path is future-drift guard only. |
| P2 (ARCH-AI-002) | [server/routes/objective-wizard.js:265,413,543](../../../server/routes/objective-wizard.js#L265) | `requireRole(['CONSULTANT','BUSINESS_OWNER','EXECUTIVE'])` middleware inserted between `verifyToken` and `async` on `/refine-objective` + `/generate-krs` + `/regenerate-kr`. Role list matches [LLMPolicy.OPS['objective-creation']](../../../server/services/LLMPolicy.js#L46). `requireRole` was already imported on line 18 per `feedback_reuse_max`. `/initialize-session` + `/finalize` remain `verifyToken`-only by design (non-LLM, outside audit scope). |
| NEW | [scripts/test-sprint26-A20260516-01-ai-orchestrator-hardening.js](../../../scripts/test-sprint26-A20260516-01-ai-orchestrator-hardening.js) | 30 checks across 4 sections — P1 static-grep × 7 + P1 vm-sandbox cache-key matrix × 6 + P2 static-grep × 9 + P2 real-middleware behavior matrix × 6 (calls actual `requireRole` from auth middleware, mocks req/res/next only). Env-default header lifted from `test-sprint26-C.5-owner-id-wizard.js` per `feedback_reuse_max`. |

### Pre-edit Q gates honored (per `feedback_no_destructive_without_greenlight`)

All 7 greenlit (a) — minimal-change defaults:
- Q1 (a) Single audit ID `A20260516-01` with 2 parts (skip ARCH-MW-001 bundle per handoff #246 verbatim)
- Q2 (a) `requireRole` middleware over inline `LLMPolicy.check()` — already imported, no targetCompanyId resolution per route
- Q3 (a) Uniform 3-role list (CONSULTANT/BO/EXECUTIVE) across all 3 wizard routes — matches `OPS['objective-creation']`, not the broader `OPS['kr-generation']` which adds MANAGER
- Q4 (a) Tenant extraction at call-site prefix, not inside `_stableKey` (helper stays pure serializer)
- Q5 (a) `'no-tenant'` sentinel + `logger.warn` over throw — preserves existing behavior for future non-tenant ops, makes drift loud
- Q6 (a) Single regression script, both parts
- Q7 (a) Single commit, `A20260516-01` with 2 parts

### Regression health at this slice

| Audit ID | Tests | Result |
|---|---|---|
| A20260516-01 (NEW) | 30/30 ✓ | PASS |
| A20260515-04 | 28/28 ✓ | PASS |
| A20260515-02 | 79/79 ✓ | PASS |
| A20260514-12 | 37/37 ✓ | PASS |
| A20260514-11 | 23/23 ✓ | PASS |
| A20260514-10 | 20/20 ✓ | PASS |
| A20260514-09 | 24/24 ✓ | PASS |
| A20260514-08 | 52/52 ✓ | PASS |
| A20260514-07 | 43/43 ✓ | PASS |
| A20260513-08a | 10/10 ✓ | PASS |
| **Total** | **346/346 ✓** across 10 scripts | **CLEAN** |

Pre-existing failures noted but unrelated to this slice (confirmed via `git stash` reproduction):
- `test-sprint25-PX3.6c-objective-wizard-write-migration.js` 20/22 — B1.1 reorg of finalize handler retired the krSpecs.map shape this test asserts on.
- `test-sprint24-243-objectives-and-lifecycle.js` — FATAL on placeholder `MONGODB_URI` (test needs real DB; env stub insufficient).

### Sprint 26 status at this slice

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ + Q9 ✅ |
| **Firing tally** | **14/24** (unchanged — A20260516-01 is governance-scoped Beta-2 unblocker, not a firing sub-slice; see /audit-architecture remediation plan §17 — "Critical before Beta-2") |

### Memory rules driving this slice

- `feedback_why_what_how_when` — audit's WHY (cross-tenant data leak risk + EMPLOYEE-driven LLM cost) drove scope before WHAT/HOW
- `feedback_no_destructive_without_greenlight` — 7 pre-edit Qs surfaced + greenlit before line-1 of code
- `feedback_minimal_change_grounding` — `_stableKey` stays pure; `requireRole` is the smallest gate; ARCH-MW-001 bundle declined to honor #246 scope verbatim
- `feedback_reuse_max` — `requireRole` already imported (line 18); `LLMPolicy.OPS['objective-creation']` role list reused as canonical truth; test env-default header lifted from C.5 test
- `feedback_extend_before_wrap` — no new façade, no new wrapper class; tenant prefix is composed at the existing `cacheKey` build line
- `feedback_audit_governance` — 1 audit ID for 2 parts; in-lockstep tracker + handoff + commit; A20260515-03 stays as the umbrella audit, A20260516-01 is the remediation child
- `feedback_quote_the_canon` — role list quoted verbatim from `LLMPolicy.OPS['objective-creation']` rather than re-deriving from intent

### Next session recommendation

1. **`/coding` B3c** — 2.3.4 Window CRUD UI + 2.3.2b non-overlap validator + new compound index (~2.75h)
   - Bundles `ARCH-DB-002` automatically per /audit-architecture remediation plan (canon Rev 2)
   - Pre-flight: `node scripts/db/verify-goal-schema-relaxation.js` before validator ships
2. **`/coding` B3d** — Dashboard/aggregator KPI reframe (~1.5h, after B3c)
3. **Sprint 27** picks up `PX-3.18` dual-write cleanup (`ARCH-DB-001`)
4. **Refinement-track** — 21 deferred audit findings; revisit only if customer telemetry surfaces them; `A20260515-01` multi-account login picker

---

## /coding — 2026-05-15 (Manager welcome email fix — A20260515-04, 3 parts, post-#245 same day)

### Trigger

User walkthrough: BO added a Manager → Manager received a welcome email reading "From undefined undefined", "added to Tiger Team by undefined undefined", and "YOUR LOGIN / Password: 996321412af60fd532c8595dd10854e9c3079ac9e39a919f". User asked whether the issue was planned in Sprint 27; answer was no — Sprint 27 scope is Manager *planning page* + Employee task execution (post-login), not invitation/auth. User direction: "lets fix it, before that lets do an impact analysis and probaly do it as part of coding session" → impact analysis surfaced 3 distinct surfaces; user direction "go ahead" greenlit all 6 pre-edit Qs at default (a) per `feedback_no_destructive_without_greenlight`.

### What shipped (single commit, this entry)

| Audit ID | Description |
|---|---|
| `A20260515-04` (3 parts) | fix(sprint26): Manager welcome email — undefined-name + opaque-password — 3 surfaces (teams.js inviter lookup + invitations.js path-2 rewire + mailjetService temp_password cleanup) — closes CLEANUP_ACTIVITIES item #1 |

### 3 surfaces touched (~45 LoC net)

| Part | File | Change |
|---|---|---|
| P1 | [server/routes/teams.js](../../../server/routes/teams.js#L992-L1014) | Inviter fetched via `User.findById(currentUser.id).select('first_name last_name email').lean()` BEFORE email send; `managerName` built with email local-part fallback. Mirrors [invitations.js:1646](../../../server/routes/invitations.js#L1646) verbatim per `feedback_reuse_max`. JWT payload NOT touched. |
| P2 | [server/routes/invitations.js](../../../server/routes/invitations.js#L1819-L1845) | Dead-on-arrival `mailjetService.sendEmail(...)` positional call (would throw `TypeError`, silently swallowed) replaced with `sendTeamMemberWelcomeEmail({...})` object form (same shape as path 1). Reuses already-fetched `consultant` doc. |
| P3 | [server/services/mailjetService.js](../../../server/services/mailjetService.js#L319-L507) | `temp_password` dropped from `sendTeamMemberWelcomeEmail` + `getTeamMemberWelcomeTemplate` signatures; `credentialsBox` removed from template; "Temporary Password:" removed from TextPart; mock-mode console.log removed; replaced with activation paragraph explaining Get Started CTA. |
| Cleanup | [CLEANUP_ACTIVITIES.md item #1](../../2-QA-AND-TESTING/CLEANUP_ACTIVITIES.md) | PARTIAL → DONE — remaining half of temp_password leak closes in same commit per `feedback_cleanup_boundary_pattern`. |

### Pre-edit Q gates honored (per `feedback_no_destructive_without_greenlight`)

All 6 greenlit (a) — minimal-change defaults:
- Q1 (a) Fix all 3 surfaces in one commit, close CLEANUP item #1
- Q2 (a) Per-request `User.findById` (mirrors existing pattern; not hot path) — rejected JWT enrichment (3 sign sites + live-token invalidation)
- Q3 (a) Remove credentials box entirely — rejected relabel (token still useless to type)
- Q4 (a) Email local-part fallback
- Q5 (a) 3 integration sections + anti-regression on A20260513-08a
- Q6 (a) Single audit ID `A20260515-04` with 3 parts; single commit

### Regression health at this slice

| Audit ID | Tests | Result |
|---|---|---|
| A20260515-04 (NEW) | 28/28 ✓ | PASS |
| A20260513-08a | 10/10 ✓ | PASS (hotfix preserved — tempPassword still seeds password_hash) |
| A20260515-02 | 79/79 ✓ | PASS |
| A20260514-12 | 37/37 ✓ | PASS |
| A20260514-11 | 23/23 ✓ | PASS |
| A20260514-10 | 20/20 ✓ | PASS |
| A20260514-09 | 24/24 ✓ | PASS |
| A20260514-07 | 43/43 ✓ | PASS |
| **Total** | **236/236 ✓** across 8 scripts | **CLEAN** |

### Sprint 26 status at this slice

| Workstream | Status |
|---|---|
| A — Playbook | 🟢 4/4 ✅ |
| B — Dispatch + Bridges | 🟢 9/9 ✅ |
| C — Activation Surface | 🟡 5/6 |
| D — Triage / Carryover | ⏳ 0/2 |
| E — Assessment Aggregation | 🟢 4/4 ✅ + Q9 ✅ |
| **Firing tally** | **14/24** (unchanged — A20260515-04 is bug-fix, not firing sub-slice) |

### Memory rules driving this slice

- `feedback_why_what_how_when` — impact analysis surfaced 3 surfaces + 6 Qs BEFORE any edit
- `feedback_no_destructive_without_greenlight` — 6 pre-edit Qs surfaced + greenlit before line-1 of code
- `feedback_minimal_change_grounding` — rejected JWT enrichment (would touch 3 sign sites), inviter lookup mirrors existing pattern
- `feedback_reuse_max` — P1 inviter lookup mirrors invitations.js:1646; P2 reuses already-fetched consultant doc; P3 closes a known cleanup-target rather than adding new abstraction
- `feedback_extend_before_wrap` — no new helper, no new façade; just align P2 to the canonical method P1 already calls
- `feedback_audit_governance` — 1 audit ID for 3 parts; in-lockstep tracker + handoff + commit; CLEANUP item flipped same commit
- `feedback_cleanup_boundary_pattern` — known PARTIAL cleanup target (item #1) closed in the same slice that ships the related fix

### Next session recommendation (unchanged from #245)

1. **`/coding` A20260516-01 parts 1-2 — AI Orchestrator hardening** (~1h) — `requireRole` on 3 wizard LLM routes + `companyId` in cache key
2. **`/coding` B3c** — 2.3.4 Window CRUD UI + 2.3.2b non-overlap validator + new compound index (~2.75h)
3. **`/coding` B3d** — Dashboard/aggregator KPI reframe (~1.5h)

---

## /close — 2026-05-12 (planning day SEALED)

**Sessions in arc**: /init → /sprint-review (Option C) → /strategy (assessment-flow) → /audit → /close. Quality rating **9/10**. All planning artifacts shipped; no code touched today; ready for /coding.

**Next session recommendation**: **`/coding`** targeting **E.2** (rollup field fix + backfill) — 0.5d, Day-1 unblocker, prerequisite for E.1 + B.3 downstream. Alternative Day-1 picks: A.1 (Activation Playbook draft), C.2 (4-case empty-state, 0.5d, no deps), C.5 (owner_id wizard, 0.5d, no deps), preflight Q9 (15-min verify).

---

## /close — 2026-05-15 (Multi-arc — Q9 ✅ + B3b min-amendment + AI-modal date cascade + /audit-architecture #245)

### Trigger

Single working day spanning 5 distinct sessions:
1. `/init` — start point at last clean state (commit `5cd494a`, branch development)
2. User-driven Preflight Q9 manual smoke verify on `karvia-business-1`
3. `/coding` B3b min-amendment (planning page)
4. `/coding` A20260515-02 AI-modal date cascade fix (4 parts, Beta-blocker user-surfaced)
5. `/audit-architecture` Sprint 26 checkpoint with 4 parallel Explore agents
6. `/close` (this entry)

### What shipped (4 commits, all pushed to `origin/development`)

| Commit | Audit ID | Description |
|---|---|---|
| `37cf0c2` | A20260515-01 mint + Q9 close | docs(sprint26): Preflight Q9 ✅ + multi-account login bug minted (deferred to refinement-track) — Workstream E sealed |
| `64ac4fa` | A20260514-12 | feat(sprint26 B3b): Planning page min-amendment — kill dead quarter selector + add date range/week pill on obj card |
| `e81b345` | A20260515-02 (4 parts) | fix(sprint26): AI-modal date cascade — Beta-blocker, reuse-max — FE period selector + BE krSpecs reorder + standalone quartersTouched + Objective.target_year JSDoc |
| `3d50422` | A20260515-03 | docs(sprint26): /audit-architecture checkpoint — 5 deliverables + pragmatic sign-off |

Render auto-deployed `karvia-business-1` after push. New objectives via AI modal now land on user-stated period (default today → today+90d); planning page no longer shows dead Q1/Q2/Q3/Q4 calendar selector.

### Audit IDs touched today

| ID | Status before | Status after | Effort |
|---|---|---|---|
| `A20260514-12` (B3b planning min-amendment) | 📝 PLAN since /strategy #240 | ✅ FIXED 📝→💻→✅ in this session | ~1.5h |
| `A20260515-01` (multi-account login bug) | n/a | 📝 OPEN (deferred to refinement-track per user direction) | mint only |
| `A20260515-02` (AI-modal date cascade, 4 parts) | n/a | ✅ FIXED — minted + 📝→💻→✅ same session | ~2h |
| `A20260515-03` (architecture audit checkpoint) | n/a | ACTIVE (governance artifact, not firing) | ~2h |

### Pre-edit Q gates honored (per `feedback_no_destructive_without_greenlight`)

- **Q9 manual verify** before any code touch
- **4 pre-edit Qs for B3b** all greenlit (a) — minimal-change defaults
- **5 pre-edit Qs for A20260515-02** all greenlit (a) — minimal-change defaults
- **Audit scope locked** before agent dispatch (4 layers in scope; AUDIT_TRACKER governance for the audit itself)
- **Sign-off matrix** for audit remediation (5 decisions, pragmatic cut over agent maximalism)

### Regression health at /close

| Audit ID | Tests | Result |
|---|---|---|
| A20260514-12 (new) | 37/37 ✓ | PASS |
| A20260515-02 (new) | 79/79 ✓ | PASS |
| A20260514-11 siblings | 23/23 ✓ | PASS |
| A20260514-10 siblings | 20/20 ✓ | PASS |
| A20260514-09 siblings | 24/24 ✓ | PASS |
| A20260514-07 siblings (B1.1) | 43/43 ✓ | PASS |
| **Total today** | **226/226 ✓ across 6 date-touching scripts** | **CLEAN** |

### Sprint 26 status at /close

| Workstream | Status | Notes |
|---|---|---|
| A — Playbook | 🟢 4/4 ✅ | unchanged |
| B — Dispatch + Bridges | 🟢 9/9 ✅ | unchanged |
| C — Activation Surface | 🟡 5/6 | B3b min-amendment effectively closes the planning-page user-visibility slice; C.1b nudge-action layer deferred; C.4 per-invitee progress widget still pending |
| D — Triage / Carryover | ⏳ 0/2 | D.2 + D.3 pending |
| E — Assessment Aggregation | 🟢 4/4 + Q9 ✅ | SEC-7 evidence row ready when launch prep starts |
| **Firing tally** | **14/24 (58%)** | up from 13/24 (A20260514-12 firing) |

### Architecture audit headline (A20260515-03)

🟡 YELLOW — structurally sound, 3 Critical + 8 High + 10 Medium + 4 Low findings. Pragmatic cut per user sign-off:
- **2 Critical actionable next session**: `ARCH-AI-002` LLM Policy enforcement + `ARCH-AI-001` cache tenant-key → new audit ID `A20260516-01` parts 1-2 (~1h)
- **1 High rides B3c**: `ARCH-DB-002` project-mode index already in canon §3.2b Revision 2
- **1 Critical rides Sprint 27**: `ARCH-DB-001` dual-write cleanup via PX-3.18 cleanup-target
- **21 findings deferred to refinement-track** — revisit only if customer telemetry surfaces them

Two-app separation: ✅ PASS. AI Orchestrator 6-grid: 4/6 strong + 2 partial. Replaceability: LLM swap ✅, FE/DB/RBAC ⚠️.

### Memory rules driving today

- `feedback_why_what_how_when` — applied for both sprint-status walkthrough AND audit remediation sign-off
- `feedback_no_destructive_without_greenlight` — every code edit gated by surfaced Q + greenlit defaults
- `feedback_minimal_change_grounding` — B3b net -17 LoC; A20260515-02 all 4 parts honor reuse-max; audit sign-off cut Tier 1 from 3→2 Critical, deferred 21 findings
- `feedback_reuse_max` — BE custom branch reused by A20260515-02; ObjectiveCalculator reused by B3b; no new schema fields, no new endpoints, no new shared modules across the day
- `feedback_extend_before_wrap` — krSpecs reorder extended existing path; Objective.js JSDoc extended existing field
- `feedback_quote_the_canon` — B3b "really really simple" honored verbatim
- `feedback_audit_governance` — 4 audit IDs touched in lockstep across tracker + handoff + commit messages
- `feedback_cleanup_boundary_pattern` — audit findings explicitly map to deferral targets (Sprint 27, B3c, refinement-track)
- `feedback_lego_architecture` — audit lens for the day
- `feedback_test_fixture_validation` — A20260515-02 timezone bug caught locally; T12:00:00 LOCAL pattern preserved

### Branch status at /close

- 4 commits pushed to `origin/development`: `37cf0c2`, `64ac4fa`, `e81b345`, `3d50422`
- Working tree: pending this /close docs commit (SESSION_LOG #245 + this handoff entry)
- `karvia-business-1` auto-redeploy in progress (planning page + AI modal changes visible after Render finishes)

### Next session recommendation

1. **`/coding` A20260516-01 parts 1-2 — AI Orchestrator hardening** (~1h)
   - Part 1: `requireRole('CONSULTANT','BUSINESS_OWNER','EXECUTIVE')` on 3 wizard LLM routes
   - Part 2: `companyId` in `AIContextService._stableKey()` cache key composition
   - Regression: integration test (EMPLOYEE token → 403) + vm-sandbox cache-key matrix
   - Closes 2 Critical audit findings before Beta-2

2. **`/coding` B3c — 2.3.4 + 2.3.2b combined** (~2.75h, after #1)
   - Window CRUD UI + `validateGoalNoOverlap` validator + new compound index per canon Rev 2
   - Pre-flight: `node scripts/db/verify-goal-schema-relaxation.js` before validator ships
   - Bundles `ARCH-DB-002` automatically — zero new audit scope

3. **`/coding` B3d — 2.3.5** (~1.5h, after B3c)
   - Dashboard/aggregator KPI reframe (active windows / ending in 14d / stalled phases)
   - Sprint 26 firing 14/24 → 15/24 (B3c) → 16/24 (B3d)

4. **Refinement-track** (post-Beta-1)
   - `A20260515-01` multi-account login picker (~1-1.5h)
   - 21 audit findings — revisit if customer telemetry surfaces them

5. **Sprint 27** picks up `PX-3.18` dual-write cleanup (`ARCH-DB-001`)

---

## /close — 2026-05-14 (Legacy cleanup — quarterly-goals.html deleted + canon-error correction across 7 sites — A20260514-15 SEALED)

**Sessions in arc**: /strategy #243 (amendment) → /coding-cleanup (canon-error correction + legacy file deletion) → /close. Quality rating **9/10**.

### Trigger

User screenshot of `karvia-business-1.onrender.com/pages/planning-v2.html` revealed that the /strategy #240 mint authored §3.3 "planning page redesign" against the WRONG file. Production navigation routes all 4 roles to `planning-v2.html` per [navigation.js:18,25,32,39](../../../client/js/navigation.js#L18), but the strategy doc cited `client/pages/quarterly-goals.html` (legacy, no nav reference). User flagged: "I think we'll have to revisit and make sure we haven't done any mistake."

### Pre-flight audit (READ-ONLY, before any edit)

Three-dimension scan to verify scope of the canon error:

| Dimension | Verdict | Detail |
|---|---|---|
| **Code (B3a shipped today)** | ✓ ZERO impact | Goal.js schema + goals.js routes + verify-script + 2 regression scripts all operate on backend surfaces that serve BOTH `quarterly-goals.html` (legacy) and `planning-v2.html` (production). Page-agnostic. |
| **Decisions (B3a /coding pressure-test + /strategy #243 amendment)** | ✓ ZERO impact | All Revisions 1+2+3, boundary rule, pre-flight verify, 4-session split — page-agnostic semantics (non-overlap math, index strategy, grandfathering, ship-ordering). |
| **Strategy doc** | ⚠ 6 drift sites | SPRINT26_PLANNING_CASCADE_STRATEGY.md §2.4 SD-4 (lines 93+97) · §3.3 scope block (lines 220-221) · §4.1 table (line 292) · §5 memory rules (line 343). PLUS 1 in AUDIT_TRACKER.md A20260514-12 row. **Total: 7 drift sites** across two files. |

Audit-pass conclusion: canon error is purely documentary; no shipped code or locked decision is wrong. Cleanup commit can fix the drift sites atomically alongside the legacy file deletion.

### What shipped (1 cleanup commit, 1 new audit ID A20260514-15)

**File deletions** (1762 LoC removed):
- `client/pages/quarterly-goals.html` (1080 LoC) — legacy page, not in any role's navigation
- `client/js/quarterly-goals.js` (680 LoC) — companion script; only consumer was the deleted page

**Cosmetic cascade edits** (verified safe by pre-flight audit):
- [client/pages/scripts/my-clients.js:43](../../../client/pages/scripts/my-clients.js#L43) — removed dead-code `QUARTERLY_GOALS_PATH` constant (grep-confirmed never referenced; declared-but-unused)
- [client/js/common.js:15](../../../client/js/common.js#L15) — JSDoc comment cite removed (cosmetic; common.js localStorage cleanup logic unchanged)
- `scripts/test-sprint22-cockpit.js` → `scripts/archive/` — archived Sprint 22 static-analysis test (not in any orchestrator/full-suite; matches existing `scripts/archive/test-pre-sprint.js` convention; preserves audit trail per `feedback_cleanup_boundary_pattern`)
- [CLAUDE.md:340-353](../../../CLAUDE.md#L340) — file-tree listing updated to show `planning-v2.html` + `planning-v2.js` (the production page) instead of the deleted legacy entries

**Strategy-doc canon-error correction** (7 drift sites, all re-targeted to `planning-v2.html`):
- SPRINT26_PLANNING_CASCADE_STRATEGY.md §2.4 SD-4 (2 sites, lines 93+97)
- SPRINT26_PLANNING_CASCADE_STRATEGY.md §3.3 scope block (2 markdown link references, lines 220-221)
- SPRINT26_PLANNING_CASCADE_STRATEGY.md §4.1 table row (line 292)
- SPRINT26_PLANNING_CASCADE_STRATEGY.md §5 memory rules (line 343 — `feedback_extend_before_wrap` example)
- AUDIT_TRACKER.md A20260514-12 row (the planning-cascade -12 status-matrix entry — found during audit-tracker insertion; flagged as 6th drift site beyond the original 5-site scope-α; user-approved expansion to 7 sites total)

All 7 sites now point at `planning-v2.html` + carry `TO BE RE-SCOPED next /strategy` markers — the minimum-amendment scope direction surfaced from user dialogue (date-on-card + Q1/Q2/Q3 tab rethink Options α/β/γ from chat 2026-05-14) is documented but NOT locked; locking deferred to next /strategy session before B3b /coding opens.

**Amendment Log section** in SPRINT26_PLANNING_CASCADE_STRATEGY.md extended with new "2026-05-14 — Cleanup commit (A20260514-15)" entry above the existing /strategy #243 entry.

### Pre-edit Q gates honored (4 micro-Qs, all greenlit (a))

Per `feedback_no_destructive_without_greenlight`, deletion + canon-error correction surfaced as 4-option scope-question BEFORE first edit:

- **Q-A** (canon fix bundling) — (a) bundle §3.3 fix into cleanup commit vs (b) separate. Picked (a) — atomic ship of truth-state.
- **Q-B** (Sprint 22 test fate) — (a) archive to scripts/archive/ vs (b) delete outright. Picked (a) — preserves audit trail per existing pattern.
- **Q-C** (mint audit ID) — (a) mint A20260514-15 LEGACY-PLANNING-CLEANUP (LOW) vs (b) skip. Picked (a) — per `feedback_audit_governance`, destructive changes deserve stable ID.
- **Q-D** (canon re-targeting depth) — (a) minimal pointer update + TO-BE-RE-SCOPED marker vs (b) full re-spec with locked α/β/γ direction. Picked (a) — honest about what's known; doesn't pre-commit to a redesign approach user hasn't locked.

PLUS scope-α expansion (5 drift sites → 7 sites): surfaced when audit-tracker insertion revealed the A20260514-12 row also carried the canon error; user-greenlit before edit ("scope expansion to all five sites of alpha" — then expanded to 7 when 6th + 7th sites surfaced during execution).

### Audit ID status flip

- **A20260514-15** (LEGACY-PLANNING-CLEANUP, LOW) — 📝 → 💻 → ✅ minted + flipped in single session
- AUDIT_TRACKER summary: Low FIXED 5→6; Total 166→167.
- New "FIXED — Legacy Cleanup 2026-05-14" section added below the Planning Cascade Strategy section with full status-matrix row.

### Sprint 26 status at /close

- A 🟢 4/4 ✅ · B 🟢 9/9 ✅ · C 🟡 4/6 · D ⏳ 0/2 · E 🟢 4/4 ✅
- **13/24 firing UNCHANGED** — cleanup is governance-scoped (not a firing task).

### Memory rules driving today's work

- **`feedback_no_destructive_without_greenlight`** — pre-flight audit before any edit; surfaced Q-A/B/C/D options + scope-α expansion explicitly; awaited "Ship all. Proceed." + "scope expansion to all five sites of alpha" greenlights.
- **`feedback_quote_the_canon`** — canon-error correction IS the literal application of this rule: production navigation is the canonical source-of-truth for "which page is live", and any strategy doc citation that disagrees with `navigation.js` is broken canon. Fixing the 7 drift sites prevents re-propagation.
- **`feedback_minimal_change_grounding`** — pre-flight audit established that code + decisions were untouched by the canon error; cleanup scope shrunk to "doc edits + dead-code removal + legacy file deletion" rather than "audit + rewrite shipped work". 7 doc edits + 2 file deletes + 4 dead-code/cosmetic edits = atomic minimum.
- **`feedback_reuse_max`** — Sprint 22 test ARCHIVED (not deleted) — existing `scripts/archive/` convention reused per `feedback_cleanup_boundary_pattern`; CLAUDE.md file-tree edits piggyback on existing structure (no new sections).
- **`feedback_extend_before_wrap`** — Amendment Log in strategy doc EXTENDED with new entry (not a new section); AUDIT_TRACKER FIXED section EXTENDED with new "Legacy Cleanup 2026-05-14" subsection (not a new top-level section).
- **`feedback_audit_governance`** — A20260514-15 minted at coding-time + 3-stage flipped in single session + summary tally Low FIXED 5→6 + Total 166→167 + HTML audit-trail comment inserted in lockstep.
- **`feedback_cleanup_boundary_pattern`** — tripod governance: (1) Amendment Log at top of strategy doc cites A20260514-15 + cleanup context; (2) AUDIT_TRACKER FIXED row carries full resolution + drift-site inventory; (3) handoff /close entry documents the trigger + decision provenance. Future readers can grep any of: "A20260514-15", "Amendment 2026-05-14 — Cleanup", "Legacy Cleanup" to find the full story.

### Branch status at /close

Working tree pending 1 cleanup commit. After commit lands: **2 commits ahead of origin** (#243 amendment + this cleanup). APP_URL Render verify per A20260512-13 outstanding (carry-forward).

### Next session recommendation

1. **`/strategy` re-scope B3b (planning page redesign)** (~20-30 min) — lock direction for the redesign work against `planning-v2.html`: minimum-amendment scope (date-on-card + Q1/Q2/Q3 tab rethink Options α/β/γ) vs. original "Active Objectives → drill-in" full redesign. Pre-requisite for B3b /coding session.
2. **`/coding` A20260513-08b** (HIGH — Invitation.js URL fallback chains × 2, ~10 LoC) — independent slot; interleave-able. Mirrors S26 B.6 fix pattern.
3. **`/coding` B3c — 2.3.4 + 2.3.2b** (~2.75h, after B3b lands and 2.3.4's pre-flight verify-script run) — Window CRUD UI + non-overlap validator with Revisions 1+2+3.
4. **`/coding` B3d — 2.3.5** (~1.5h, after B3c) — dashboard/aggregator KPI reframe.
5. **Preflight Q9 manual smoke** (15 min) — flips SEC-7 🟢, validates push-state on `karvia-business-1`.

---

## /close — 2026-05-14 (/strategy #243 amendment session — SPRINT26_PLANNING_CASCADE_STRATEGY formalized post-B3a)

**Sessions in arc**: /coding-B3a → /strategy-amendment (this) → /close. Quality rating **9/10**.

### What shipped (1 docs commit, 0 audit-tracker row mutations)

Pure amendment to [SPRINT26_PLANNING_CASCADE_STRATEGY.md](SPRINT26_PLANNING_CASCADE_STRATEGY.md) (~120 LoC). Six lock changes applied after scenario walkthrough + corner-case pressure-test:

1. **§2.2 SD-2**: Revision 1 (QUARTERLY-only non-overlap; WEEKLY siblings explicitly permitted to overlap) made explicit. NEW boundary rule — strict less-than overlap test: `start_a < end_b && start_b < end_a`. Adjacent phases sharing a boundary day (e.g., "Build Aug 1 – Dec 1" + "Launch Dec 1 – Feb 14") do NOT count as overlap. Locks Revisions 1+2+3 with cross-link to §3.2b.
2. **§3.1**: A20260514-10 marked ✅ SHIPPED 2026-05-14. verify-script Risk 3 extension cross-ref note added.
3. **§3.2**: Sub-slice 2.3.2 SPLIT into 2.3.2a (parts 1-3 SHIPPED B3a 2026-05-14) + 2.3.2b (part 2 non-overlap validator DEFERRED to 2.3.4). Revisions 2 (ONE new compound index `{objective_id:1, time_period:1, start_date:1}`) + 3 (grandfathering guard for `time_period_type !== 'custom'` parents) locked into 2.3.2b spec. Overlap test contract documented inline with strict-less-than semantics.
4. **§3.4**: Sub-slice 2.3.4 spec amended to BUNDLE -11 part 2 validator with Window CRUD UI. NEW required pre-flight step: run `node scripts/db/verify-goal-schema-relaxation.js` before shipping; decision branch documented if "Total overlapping pair count" > 0 on `time_period_type='custom'` parents (extend grandfathering / one-shot data normalization / FE warning UI). Time estimate +~30 min (~2.75h total).
5. **§4.1**: Session-split map 3 sessions → 4 sessions. B3a SHIPPED row added; B3b = 2.3.3 alone (planning page redesign, ~2-2.5h); B3c = 2.3.4 + 2.3.2b combined (~2.75h); B3d = 2.3.5 (KPI reframe, ~1.5h). Net +0.5h total budget (was ~7h, now ~7-7.5h) — buys cohesive ship-with-consumer scoping.
6. **§4.2**: ASCII dependency graph annotated with SHIPPED ✅ + DEFERRED ⏳ markers; 2.3.2b explicitly shown folded into 2.3.4 branch.

### Scenario walkthroughs that locked the decisions

Per user direction "Let's discuss all the five amendments and how it will look like in real world scenarios", each amendment was scenario-tested before lock:

- **Amendment 1 scenarios**: 3-phase project (Discovery/Build/Launch), parallel-team weekly work (Alice/Bob/Cara same Wk1), boundary day case, wrong-parent WEEKLY, cancelled goal exclusion, single-phase objective. Surfaced **new lock** on boundary semantics (strict less-than).
- **Amendment 2 scenarios**: future reader (audit-tracker vs strategy doc drift), verify-script attribution, year-default plumbing fragmentation. Confirmed split as planned + verify-script stays under 2.3.1 with cross-ref.
- **Amendment 3 scenarios**: dev opens B3c session, session-budget exhaustion mid-2.3.4, direct API window creation between B3a-and-2.3.4 with overlapping windows, out-of-order ship attempt. Surfaced **new lock** on pre-flight verify-script run requirement.
- **Amendment 4 scenarios**: 3-vs-4 session count tradeoff, Option X (mega-session) vs Option Y (mixed-scope bundling), schedule-pressure parallelism. Confirmed 4-session honest split wins.
- **Amendment 5 scenarios**: ASCII graph rendering. Trivial — kept simple.

### Q-X decision (sub-ID minting)

**Q-X kept (a) — single A20260514-11 ID spanning B3a + B3c**. Scenarios didn't change my recommendation. AUDIT_TRACKER PARTIAL row + TODO marker at goals.js:40 + 4-session map (Amendment 4) provide governance without sub-ID overhead. -11 row stays as-is; will flip ✅ when 2.3.4 lands part 2.

### What did NOT change

- Original 5 SDs at §2 (only SD-2 received a Revision lock + boundary rule extension; the (a/b/c) picks themselves stand)
- Section 1 reframe (unchanged — foundation locked at /strategy #240)
- Sections 3.3 + 3.5 (2.3.3 + 2.3.5 sub-slice specs unchanged — they don't intersect the 2.3.2 split)
- Section 4.3 backward-compat invariants (unchanged — still 5 invariants every sub-slice must preserve)
- Section 4.4 out-of-scope list (unchanged)
- Section 5 memory rules (unchanged)
- AUDIT_TRACKER audit-ID rows (no mutations — amendment is doc-only; -10 + -11 PARTIAL states already correctly tracked at B3a /close)

### Memory rules driving today's work

- **`feedback_why_what_how_when`** — user direction "let's evaluate this more holistically" + "Let's discuss all the five amendments and how it will look like in real world scenarios" triggered scenario-first walkthroughs BEFORE lock. Real-world user flows (consultant Maya creating 3-phase project, parallel weekly team work, adjacent-day boundary) drove the strict-less-than lock + the pre-flight verify-script requirement.
- **`feedback_minimal_change_grounding`** — Q-X kept single -11 ID (no sub-ID -11b mint); 5 amendments + 2 surfaced locks = 7 changes vs. a "rewrite the whole strategy doc" approach; only 4 sections actually edited (§2.2, §3.1, §3.2, §3.4) + 2 visual (§4.1 table, §4.2 graph) + 2 meta (§6 sign-off, Amendment Log top).
- **`feedback_reuse_max`** — Q-X analysis exhausted existing governance hooks (AUDIT_TRACKER PARTIAL row + TODO marker + 4-session map) before considering new sub-ID mint; verify-script already serves dual-purpose (schema audit + overlap audit) per `feedback_extend_before_wrap`.
- **`feedback_extend_before_wrap`** — extended §3.2 with sub-sections 3.2a + 3.2b (didn't create a parallel §3.6); extended §3.4 with validator scope (didn't fragment into new section); extended §6 sign-off with amendment subsection (didn't create §7).
- **`feedback_no_destructive_without_greenlight`** — 5 amendments + Q-X surfaced as proposal BEFORE any edit; user did scenario-first review; explicit "agreed. Let's go ahead and do it." lock before first edit.
- **`feedback_quote_the_canon`** — strict-less-than boundary rule quotes the calendar quarter analogue verbatim ("Q1 ends Mar 31, Q2 starts Apr 1"); 2.3.2b validator contract quotes the §2.2 overlap test code verbatim.
- **`feedback_audit_governance`** — AUDIT_TRACKER HTML audit-trail comment updated with amendment summary; no row mutations needed (status state correct from B3a /close).
- **`feedback_cleanup_boundary_pattern`** — Amendment Log at top of doc + TODO marker in goals.js + AUDIT_TRACKER PARTIAL row form the tripod for the -11 part 2 cleanup-boundary. When 2.3.4 lands, grep `"A20260514-11 part 2"` finds wire site + grep "Amendment 2026-05-14" finds spec; both lead to same destination.

### Branch status at /close

Working tree pending 1 amendment-docs commit. After commit lands: **1 commit ahead of origin** (prior 10 caught up between sessions; only this amendment local-only). APP_URL Render verify per A20260512-13 contract resolved at last push.

### Sprint 26 status at /close

UNCHANGED — pure doc amendment, no firing-task delta.
- A 🟢 4/4 ✅ · B 🟢 9/9 ✅ · C 🟡 4/6 · D ⏳ 0/2 · E 🟢 4/4 ✅
- **13/24 firing**

### Next session recommendation

Per refined queue (post-amendment):

1. **`/coding` B3b — 2.3.3 alone** (~2-2.5h) — planning page redesign; biggest user-facing slice; FE rewrite of quarterly-goals.html/.js + new "Active Objectives" entry view + drill-in single-objective Plan view. Backward-compat invariant #1: legacy calendar_year objectives render same shape.
2. **`/coding` A20260513-08b** (HIGH — Invitation.js dual URL fallback chains × 2, ~10 LoC) — independent slot; interleave-able. Mirrors S26 B.6 fix pattern.
3. **`/coding` B3c — 2.3.4 + 2.3.2b** (~2.75h, depends on B3b) — Window CRUD UI + non-overlap validator with Revisions 1+2+3 + pre-flight verify-script step.
4. **`/coding` B3d — 2.3.5** (~1.5h, depends on B3c) — dashboard/aggregator KPI reframe; bundles with deferred Session C if coordinated.
5. **Preflight Q9 manual smoke** (15 min) — flips SEC-7 🟢. Backlog already pushed; this is the smoke verification on `karvia-business-1`.

---

## /close — 2026-05-14 (Sprint 26 B3a SHIPPED — Slice 2.3.1 schema relaxation + Slice 2.3.2 parts 1-3 route plumbing; -11 part 2 validator deferred to 2.3.4)

**Sessions in arc**: /init → /coding-hotfix (A20260513-08a) → /coding-B3a (this) → /close. Quality rating **9/10**.

### What shipped (2 commits, 1.5 audit IDs, 43/43 ✓ regression)

**A20260514-10** (📝→💻→✅, single session) — `Goal` schema relaxation per SD-1 (b):
- [server/models/Goal.js](../../../server/models/Goal.js) — `quarter` + `year` flipped to `required: false` with audit-ID marker comment block; NEW optional `window_name: { type: String, trim: true, maxlength: 80 }`; week's S25 PX-3.20 conditional-required preserved; legacy indexes + `findByQuarter`/`getStatistics` statics preserved per backward-compat invariant #1
- NEW [scripts/db/verify-goal-schema-relaxation.js](../../../scripts/db/verify-goal-schema-relaxation.js) — read-only DB audit; counts (a) Goals with quarter/year populated (b) **Risk 3 extension**: QUARTERLY sibling date-range overlap audit under same objective_id (informs whether deferred non-overlap validator at 2.3.4 needs the time_period_type guard for grandfathering)
- Regression `test-sprint26-A20260514-10-schema-relax.js` 20/20 ✓ (static schema assertions + LIVE-FIRE Mongoose validation: QUARTERLY without quarter/year validates cleanly; legacy mode still validates; window_name maxlength + trim enforced; WEEKLY without week still rejected)

**A20260514-11 PARTIAL** (📝→💻, parts 1-3 of 4) — Goal POST/PUT route plumbing:
- [server/routes/goals.js](../../../server/routes/goals.js) — 4 routes touched: POST + PUT × `/quarterly` + `/weekly`
  - `window_name` added to `allowedUpdates` arrays on both PUT handlers
  - Year default `start_date.getFullYear()` (falls back to current year) added to both POST handlers per §3.2 spec
  - Dropped `quarter` from POST `/quarterly` required-fields check (line 1016) + updated error message
  - Inline `TODO(A20260514-11 part 2 — 2.3.4 Window CRUD UI)` marker at [goals.js:40](../../../server/routes/goals.js#L40) tracks deferred non-overlap validator per `feedback_cleanup_boundary_pattern` — cites Revision 3 grandfathering guard + the wiring contract (4 routes mirror B1.4 pattern at lines 1025, 1168) + the one new compound index `{objective_id:1, time_period:1, start_date:1}` to land with the validator
- **Part 2 (sibling non-overlap validator) DEFERRED to 2.3.4 Window CRUD UI session** per holistic pressure-test — validator has zero organic consumer until first FE window CRUD writes project-mode goals; ship-with-consumer wins per `feedback_minimal_change_grounding`; Revisions 1+2+3 (QUARTERLY-only scope, single new index, grandfathering guard for legacy `time_period_type !== 'custom'` parents) carry forward to 2.3.4 unchanged
- Regression `test-sprint26-A20260514-11-window-name-route.js` 23/23 ✓ (static + LIVE-FIRE: POST /quarterly without quarter/year succeeds; window_name persists; year defaults from start_date.year; POST /weekly accepts window_name; PUT /quarterly + /weekly accept window_name; POST without objective_id still 400)

### Pre-edit holistic evaluation honored (per user direction "let's evaluate more holistically")

User asked for a holistic pressure-test BEFORE first edit. Surfaced 3 risks:

- **Risk 1 (`goal.quarter` read-path null-crash hazard)** — surveyed 17 server + 9 FE consumers; ONE flagged site at [quarterly-goals.js:260](../../../client/js/quarterly-goals.js#L260) `goal.quarter.replace('Q', '')`. **Re-inspection revealed it's already null-safe**: surrounding `typeof goal.quarter === 'string'` guard at line 259 protects the `.replace()` call (`typeof null === 'object'`, not 'string'); null falls to else branch, filter rejects. Conservative 3-line fix skipped. 3 cosmetic `${quarter}` template literal sites in planning.js + goals.js produce "null" string output but don't crash; project-mode goals won't reach those code paths until B3b ships FE consumer.
- **Risk 2 (non-overlap validator sleeps until 2.3.4)** — 3 options laid out (A keep in B3a / B defer to 2.3.4 / C split sub-IDs). User picked **Option B** (defer). My revised honest pick after pressure-test agreed: validator has zero organic consumer until 2.3.4; `feedback_minimal_change_grounding` favors smaller B3a; cohesive 2.3.4 ships UI+validator together. TODO marker + handoff documentation prevent drift.
- **Risk 3 (legacy data with overlapping date ranges would 400 on first PUT under new validator)** — verify script extended to AUDIT overlapping QUARTERLY sibling pairs under same objective_id. Reports zero or N overlaps, informs 2.3.4's grandfathering decision. Approved.

### Revisions to original plan (carried forward to 2.3.4 unchanged)

- **Revision 1** — non-overlap scope is **QUARTERLY-only** (not QUARTERLY+WEEKLY). SD-2 §2.2 strict canon read: "Two QUARTERLY-tier Goals". The §3.2 mention of WEEKLY described parent-resolution branching, not check scope. WEEKLY siblings can legitimately overlap (multiple weeklies active same week, different owners).
- **Revision 2** — **ONE new compound index** `{objective_id:1, time_period:1, start_date:1}` lands at 2.3.4 alongside the validator. Mongoose doesn't `syncIndexes` (grep confirmed zero calls); "extending" the existing `{parent_goal_id:1, time_period:1}` (Goal.js:320) would create a SECOND index alongside the old one. Combined with Revision 1 dropping WEEKLY scope, parent_goal_id index extension wasn't needed anyway.
- **Revision 3** — **Grandfathering guard** at 2.3.4: skip non-overlap when parent objective's `time_period_type !== 'custom'`. Legacy calendar/fiscal-year objectives often have multiple QUARTERLY goals with `start_date = created_at` and `due_date = Dec 31` — they'd ALL overlap under strict rule. Grandfathering protects existing PUTs from regressing.

### Strategy doc amendment

User direction: "fresh strategy session to formalize". SPRINT26_PLANNING_CASCADE_STRATEGY.md NOT touched in this /coding session. Next /strategy session will formalize §3.2 (split 2.3.2 into parts 1-3 shipped vs. part 2 deferred) + §3.4 (note 2.3.4 now includes the validator). Audit governance carry: -11 stays 📝 PLAN until part 2 lands.

### Risk 1 follow-up (cosmetic only)

3 sites produce "null" string output if project-mode goals reach them (not a Beta blocker):
- [server/routes/planning.js:2080](../../../server/routes/planning.js#L2080) — AI prompt context "Week ${week} of ${quarter} ${year}"
- [server/routes/planning.js:2308](../../../server/routes/planning.js#L2308) — same pattern
- [server/routes/goals.js:754](../../../server/routes/goals.js#L754) — task description "Week N of M for ${quarter} quarterly goal"

These sites read goals created via the AI breakdown path — project-mode goals won't reach them until B3b ships the FE that creates them. Surface as B3c context (KPI reframe audit) — not minted as separate ID.

### Sprint 26 status at /close

- **A** 🟢 4/4 ✅ · **B** 🟢 **9/9** ✅ (+1 firing from -10 shipped) · **C** 🟡 4/6 · **D** ⏳ 0/2 · **E** 🟢 4/4 ✅
- **13/24 firing** (was 12/24). -10 counts as Slice 2.3.1 firing (Medium plan-cascade slice). -11 stays 📝 (partial ship) — flips firing only when part 2 lands at 2.3.4.

### Regression health at /close

- **NEW** -10: 20/20 ✓ · **NEW** -11 PARTIAL: 23/23 ✓
- **Siblings**: -09 (B1.4): 24/24 ✓ · -08a (hotfix earlier today): 10/10 ✓ · -07 (B1.1): 43/43 ✓ · -08 (B1.2): 52/52 ✓
- **Total session sweep: 172/172 ✓** across 6 scripts, zero collateral

### Memory rules driving today's work

- **`feedback_why_what_how_when`** — user explicitly triggered the holistic pressure-test BEFORE first edit; Why-first revisit of B3a scope surfaced Risk 1/2/3 and 3 option-paths for the non-overlap deferral; user's locked picks shaped the final scope.
- **`feedback_minimal_change_grounding`** — Option B picked (defer non-overlap to 2.3.4) explicitly per smaller-B3a logic; Risk 1 conservative fix skipped after re-inspection proved unnecessary; B3a final ~250 LoC vs. original ~340.
- **`feedback_reuse_max`** — POST handlers already spread `req.body` so window_name flows through without extra plumbing; ValidationService.validateGoalDates from B1.4 still in place; existing index pattern preserved.
- **`feedback_extend_before_wrap`** — extended `allowedUpdates` arrays (didn't create parallel update validator); extended POST handler year-default block (didn't create separate normalizer service); TODO marker extends helper section comment block (didn't create separate TODO file).
- **`feedback_no_destructive_without_greenlight`** — surfaced ALL options + recommendations BEFORE first edit; awaited explicit "Option B picked? good to go" + bundled approval for Revisions 1/2/3; strategy doc amendment NOT auto-modified per user direction.
- **`feedback_quote_the_canon`** — Schema field decisions match SPRINT26_PLANNING_CASCADE_STRATEGY.md §3.1 verbatim; year-default behavior matches §3.2 verbatim; TODO marker cites strategy doc §2.2 SD-2 as canonical source for the deferred validator's contract.
- **`feedback_audit_governance`** — -10 ID + 3-stage flip in single session; -11 ID + 2-stage flip (📝→💻) with explicit "PARTIAL" status pending part 2; AUDIT_TRACKER summary tally + HTML audit-trail comment updated in lockstep.
- **`feedback_cleanup_boundary_pattern`** — TODO(A20260514-11 part 2) inline marker at goals.js:40 + AUDIT_TRACKER row reflecting partial ship + handoff documentation = bidirectional grep target. When 2.3.4 session lands, `grep "A20260514-11 part 2"` finds the wire site directly.
- **`feedback_test_fixture_validation`** — Goal.js schema fields read BEFORE writing -10/-11 fixtures; required fields (company_id, objective_id, owner_id, created_by, name, time_period, due_date) populated with fabricated ObjectIds; quarter+year deliberately omitted to test the relaxation; live-fire stubs mirror -09 harness pattern.

### Branch status at /close

Working tree pending 2 feat commits + 1 docs /close commit. After all 3 land: **26 commits ahead of origin** (23 prior + 3 today's B3a). APP_URL Render env-var verification per A20260512-13 contract still outstanding.

### Next session recommendation

Priority queue from #240/today minus B3a:

1. **`/strategy` formalize amendment** (~15 min) — explicit strategy doc edit to SPRINT26_PLANNING_CASCADE_STRATEGY.md §3.2 + §3.4 noting the validator split; mint -11 part 2 sub-ID if user wants explicit governance (currently tracked under -11 lifespan). Lock Revisions 1+2+3 into the canon doc.
2. **`/coding` B3b** (sub-slice 2.3.3 — planning page redesign, ~2-2.5h) — biggest LoC sub-slice; FE rewrite of quarterly-goals.html/.js + new "Active Objectives" entry view + drill-in single-objective Plan view. Backward-compat: legacy calendar_year objectives render same way.
3. **`/coding` 2.3.4 Window CRUD UX + part 2 validator** (combined, ~2h + 30 min) — depends on B3b; FE Add/Edit/Delete Window modal + Auto-split helper + the deferred non-overlap validator with Revisions 1+2+3 finally wired.
4. **`/coding` A20260513-08b** (HIGH — Invitation.js dual fallback chains × 2, ~10 LoC) — independent slot; can interleave between B3b and 2.3.4.
5. **Push + Preflight Q9 manual smoke** (15 min) — flips SEC-7 🟢, validates 26-commit backlog on `karvia-business-1`.

---

## /close — 2026-05-14 (Hotfix: CRITICAL hardcoded temp-password literal removed — A20260513-08a SEALED)

**Sessions in arc**: /init → /coding-hotfix (A20260513-08a — temp-password CRITICAL) → /close. Quality rating **9/10**.

### What shipped (1 commit, 1 audit ID)

`fix(sprint26 hotfix): Drop hardcoded `Karvia2025!` temp-password fallback — A20260513-08a` — 3 invitation routes swapped from `process.env.DEFAULT_TEMP_PASSWORD || 'Karvia2025!'` to `crypto.randomBytes(24).toString('hex')` per CLEANUP_ACTIVITIES.md Item #1 step 3 recipe (`feedback_quote_the_canon`):

- [server/routes/teams.js:934](../../../server/routes/teams.js#L934) — add-to-team handler
- [server/routes/invitations.js:1549](../../../server/routes/invitations.js#L1549) — consultant→BO `POST /invitations/create`
- [server/routes/invitations.js:1779](../../../server/routes/invitations.js#L1779) — consultant→team-member `/invite-team-member`

`DEFAULT_TEMP_PASSWORD` env-var read removed entirely (no consumers verified via `grep -rn` across server/scripts/tests — eliminates shared-secret model per AUDIT_TRACKER primary recommendation). Per-invitation opaque hex value; never user-facing; reset-link flow at [invitations.js:206](../../../server/routes/invitations.js#L206) overwrites `password_hash` on accept. The `Karvia2025!` literal — sitting in the public repo — was a trivial account-takeover vector for every newly-invited account whenever the env was unset.

### Pre-edit Q gates honored (3 micro-Qs, all greenlit (a))

- **Q1** Encoding/length — (a) `crypto.randomBytes(24).toString('hex')` per CLEANUP_ACTIVITIES.md Item #1 step 3 (canon-quoted; higher entropy than AUDIT_TRACKER's `randomBytes(16).base64url` recommendation) vs (b) AUDIT_TRACKER recipe vs (c) env-var + boot validation (weaker, preserves shared-secret model). Picked (a).
- **Q2** Scope boundary — (a) placeholder swap ONLY; leave `temp_password: tempPassword` propagation to Invitation record (teams.js:1004) + mailjet template (invitations.js:1831) alone, tracked as CLEANUP Item #1 dispatcher 4/5 work. Picked (a) per `feedback_minimal_change_grounding`. The email-arg propagation no longer leaks a *known* credential after Q1 lands (per-invitation random is opaque).
- **Q3** Regression script — (a) NEW `scripts/test-sprint26-A20260513-08a-temp-password-hotfix.js` per `feedback_audit_governance`. Picked (a).

### Regression health at /close

- **NEW** `scripts/test-sprint26-A20260513-08a-temp-password-hotfix.js` — **10/10 ✓** (zero `Karvia2025!` literals under server/; zero `DEFAULT_TEMP_PASSWORD` env reads; 3 sites use `crypto.randomBytes(24).toString('hex')`; audit marker inline at each fix site; `crypto` already required; entropy sanity 48-char hex + non-collision)
- **Siblings** `test-sprint26-A20260512-13-app-url-contract.js` **18/18 ✓** + `test-sprint26-A20260512-15-validate-user-exists.js` **17/17 ✓** — confirms zero collateral on invitations.js
- **Smoke loads** — `require('./server/routes/teams.js')` ✓ + `require('./server/routes/invitations.js')` ✓
- **Total session sweep**: 45/45 ✓ across 3 scripts

### Audit ID status flip

- `A20260513-08a` (HARDCODE-PWD CRITICAL) — 📝 → 💻 → ✅ in single session
- AUDIT_TRACKER summary table: Critical OPEN **1→0**, Critical FIXED **9→10**. Total 166 unchanged (status migration only).

### Sprint 26 status at /close

- **A** 🟢 4/4 ✅ · **B** 🟢 8/8 ✅ · **C** 🟡 4/6 · **D** ⏳ 0/2 · **E** 🟢 4/4 ✅
- **12/24 firing unchanged** — hotfix is governance-scoped CRITICAL repair (not in original 24-task firing list). Sprint 26 firing remains gated on B3 sub-slices (A20260514-10..-14) flipping the count to 17/24.

### Memory rules driving today's work

- **`feedback_quote_the_canon`** — picked CLEANUP_ACTIVITIES.md Item #1 step 3 recipe verbatim (`crypto.randomBytes(24).toString('hex')`) over AUDIT_TRACKER's higher-level recommendation. Two canon docs slightly disagreed on bytes/encoding; lower-level prescription wins.
- **`feedback_minimal_change_grounding`** — Q2 hotfix scope = the public literal only. The email-arg propagation (CLEANUP Item #1's broader sweep) explicitly NOT bundled — separate audit-tracked work tied to S26 dispatcher 4/5.
- **`feedback_reuse_max`** — `crypto` already required at top of both files (line 8 + 9); zero new imports. Existing pattern `crypto.randomBytes(32).toString('hex')` for `invitation_token` was the reuse template (just different byte length per CLEANUP recipe).
- **`feedback_no_destructive_without_greenlight`** — 3 Q-gates surfaced with options + recommendations BEFORE first edit; awaited explicit "procced" greenlight.
- **`feedback_audit_governance`** — A20260513-08a ID + 3-stage flip in single session; per-ID regression script named `test-sprint26-A20260513-08a-temp-password-hotfix.js`; AUDIT_TRACKER summary tally + HTML audit-trail comment updated in lockstep.

### Branch status at /close

Working tree pending hotfix commit. After commit lands: **23 commits ahead of origin** (22 carry-forward from prior #239/#240 + this hotfix). APP_URL Render env-var verification per A20260512-13 contract still outstanding before push.

### Next session recommendation

Per yesterday's priority queue, the obvious continuation is **`/coding` B3a** (sub-slices 2.3.1 + 2.3.2 — Goal schema relaxation + route writes for `window_name`, ~1.5h, backend foundation for B3b/c). Alternatives:

1. **`/coding` B3a** — the natural next slice; user already greenlit B2 strategy at #240
2. **`/coding` A20260513-08b** (HIGH — Invitation.js dual fallback chains × 2) — ~10 LoC, mirrors S26 B.6 fix pattern, builds on today's hotfix momentum
3. **Push + Preflight Q9 manual smoke first** (15 min) — flips SEC-7 🟢, validates 23-commit backlog on `karvia-business-1`

---

## /close — 2026-05-14 (Sprint 26 B1 SHIPPED + B2 strategy minted: objectives now have custom periods end-to-end)

**Sessions in arc**: /init → /audit (A20260513-08 hardcoding sweep #238) → /coding (B1 #239 Slices 2.1+2.2+2.4) → /strategy (B2 #240 Slice 2.3 reframe) → /close. Quality rating **9/10**.

**Workstream coverage today**: zero S26 firing tasks (B1 work fixes a Beta blocker discovered via screenshots; not in original 24-task firing list — counts as governance-scoped polish). 5 NEW audit IDs minted for Slice 2.3 sub-slices to be executed in B3.

**Trigger**: User reported live bug on `karvia-business-1` — newly-created objectives showing "Week 20/52" + "At risk" on day 1 because wizard force-fit calendar-year Jan 1 → Dec 31 regardless of when user created the objective. Underneath: planning cascade still anchored on calendar quarters which contradicts the per-objective-as-project model.

### What shipped today (4 commits in B1 + B2 docs commit)

**Commit 1** — `docs(sprint26): /audit — A20260513-08 hardcoding sweep + verification flips` (audit-only, no code)
- Pass 1: AH-9/10/11/AL-4 OPEN→FIXED + AL-3 OPEN→WONTFIX
- Pass 2: 11 sub-IDs minted A20260513-08a..k (1 CRITICAL `Karvia2025!` + 3 HIGH URL hardcoding + 4 MEDIUM + 3 LOW)
- Summary table 150→161, OPEN 12→18

**Commit 2** — `feat(sprint26 B1.1): Wizard custom period picker — A20260514-07` (43/43 ✓)
- Step 2 of objective wizard adds 2 `<input type="date">` (start defaults today, end user-picks); HTML5 min/max constrains to 1-36 month range per Q-2-1d hard validation lock
- WizardState gets `startDate`/`endDate`; new `initPeriodInputs` / `isPeriodWithinBounds` / `deriveDurationMonths` helpers
- Wizard finalize payload sends `time_period_type='custom'` + `start_date` + `end_date` + `duration_months` + `target_year` (FE-derived from start_date.year per Q-B1-3 (a))
- BE finalize handler honors custom period; legacy calendar_year fallback retained for backward compat. New 400 codes `PERIOD_DATE_INVALID` + `PERIOD_RANGE_INVERTED`
- 5 surfaces touched: objective-wizard.html + .js + .css + server route + new regression script

**Commit 3** — `feat(sprint26 B1.2): KR prompts get objective_period awareness — A20260514-08` (52/52 ✓)
- NEW `formatObjectivePeriodBlock` + `describeObjectivePeriod` helpers in single-objective.js prompt module
- `getRefinePrompt` + `getRegenerateKRPrompt` both consume `context.objective_period`; emit "OBJECTIVE TIMELINE:" block; dynamic TIME-BOUND requirement cites actual dates (falls back to "Implicitly annual" when no period)
- NEW `sanitizeObjectivePeriodPayload` BE input guard (ISO regex, end > start, duration 1-36 clamp)
- 3 routes thread + persist period on session: /refine-objective, /generate-krs (inline prompt reuses canonical formatters per `feedback_reuse_max`), /regenerate-kr
- FE: WizardAPI 3 methods accept trailing `objectivePeriod` arg; `buildObjectivePeriodPayload()` helper; 3 call sites pass period
- 4 surfaces touched: prompt module + BE route + FE wizard + new regression

**Commit 4** — `fix(sprint26 B1.4): Wire validateGoalDates into goal routes — A20260514-09` (24/24 ✓)
- `ValidationService.validateGoalDates` has existed since Sprint 3 but was NEVER wired into goal write routes — discovered during B1 grounding. Goals could be persisted with date ranges escaping their parent Objective
- NEW `validateGoalDateHierarchy(candidateGoal, company_id)` helper at top of goals.js — aliases Goal.due_date → end_date for validator (schema-vs-validator field-name drift bridged here per `feedback_reuse_max`); WEEKLY parent lookup via `parent_goal_id`; QUARTERLY via `objective_id`; returns 400 `GOAL_DATE_OUT_OF_RANGE` on violation
- Wired into 4 canonical routes: POST + PUT × QUARTERLY + WEEKLY (per Q-B1-5 lock). POST unconditional; PUT gated on schedule-field touch (avoids extra DB read on non-schedule updates)
- LIVE-FIRE regression (Express + stubbed Mongoose, no MongoMemoryServer): happy path / end-past-objective / start-before-objective / weekly-past-parent / backward-compat no-dates / backward-compat orphan-parent
- Scope flag: `weekly-goals.js` (parallel canonical at `/api/weekly-goals`) also lacks wiring — logged as B3 carry-forward

**Commit 5 (this /close)** — `docs(sprint26): B2 strategy + B1 /close — Slice 2.3 cascade plan + 5 audit IDs minted`
- NEW [SPRINT26_PLANNING_CASCADE_STRATEGY.md](SPRINT26_PLANNING_CASCADE_STRATEGY.md) — 5 strategic decisions locked + 5 sub-slices specced for B3
- AUDIT_TRACKER section "OPEN — Planning Cascade Strategy 2026-05-14" with status matrix A20260514-10..-14 (all 📝 PLAN state); summary table 161→166 (OPEN 18→23, Total +5)
- This handoff /close entry + SESSION_LOG entries #239 (B1) + #240 (B2)

### Sprint 26 B2 reframe — what changed conceptually

Originally Slice 2.3 was scoped as "planning page detects parent objective's `time_period_type` and shows calendar-quarter selector for legacy + window tabs for custom — branched UI." During /strategy session #240 the user reframed:

> "OKRs are not annual fixed periods. Consultants onboard clients at any point in time. Each objective is a project with arbitrary start + duration. We need to imbibe this flexibility."

This forced the 5 SDs to be re-evaluated. Locked outcomes:

- **SD-1** Goal schema: add optional `window_name`, deprecate `quarter` requirement (~30 LoC schema; no data migration)
- **SD-2** Window overlap/gaps: disallow overlap, allow gaps (BE validation at write time)
- **SD-3** Default windows: offer "Auto-split into N phases" helper on planning page (not in wizard) — opt-in, user reviews before save
- **SD-4** Planning page UX: **kill the calendar quarter selector entirely**; planning page becomes objective-first (Active Objectives list → drill into single-objective Plan view with timeline + windows). Calendar_year objectives still work — same UI, just renders their existing Q1-Q4 goals as informational labels
- **SD-5** Dashboard KPIs: reframe semantically — replace "this quarter's goals" with "active windows / windows ending in 14d / stalled phases / active objectives by health bucket"

### Audit ID status flips

- `A20260514-07` (Wizard period UI) — 📝 → 💻 → ✅ (shipped commit 91c6120)
- `A20260514-08` (KR prompt enrichment) — 📝 → 💻 → ✅ (shipped commit 0a54670)
- `A20260514-09` (Goal-date validation wire) — 📝 → 💻 → ✅ (shipped commit fa9e802)
- `A20260514-10` through `A20260514-14` (Slice 2.3 sub-slices) — minted 📝 in PLAN state at /strategy session #240 (this close)

### Sprint 26 status at /close

- A 🟢 4/4 ✅
- B 🟢 8/8 ✅
- C 🟡 **4/6** (C.1a + C.2 + C.3 + C.5 shipped; C.1b deferred; C.4 pending)
- D ⏳ 0/2 pending (D.2, D.3)
- E 🟢 4/4 ✅

**12/24 firing tasks unchanged** (B1 work is governance-scoped Beta-blocker repair; Slice 2.3 in B3 is 5 sub-IDs that will flip the count to 17/24 when complete). APP_URL Render verification per A20260512-13 — confirm on next deploy.

### Regression health at /close

- **Sprint 26 sweep**: 29 scripts green, 1080/1080 ✓ (was 961/961 yesterday; +119 from -07/-08/-09)
- **Sprint 23 #190 wizard backward-compat**: 76/76 ✓ (with APP_URL env set)
- Zero collateral damage on prior S26 scripts; B1.4 backward-compat regressions cover the "no dates / orphan parent" silent-skip paths

### Memory rules driving today's work

- **`feedback_minimal_change_grounding`** — B1 added wizard period picker without schema change (`time_period_type='custom'` + `duration_months` already existed); B1.4 wired existing helper instead of writing new validator. B2 reframe still resulted in only 1 new schema field (`window_name`) — quarter/year deprecated, not deleted.
- **`feedback_reuse_max`** — `<input type="date">` HTML5 native, B1.2 reused canonical formatters in /generate-krs inline prompt, B1.4 reused `ValidationService.validateGoalDates` that existed since Sprint 3.
- **`feedback_extend_before_wrap`** — B1.2 extended `getRefinePrompt` + `getRegenerateKRPrompt` with `context.objective_period`; did not draft new prompt builders. B1.4 added 1 helper function to goals.js; did not split into a middleware module.
- **`feedback_why_what_how_when`** — user's "let's reevaluate" trigger at /strategy session #240 forced Why-first revisit of the 5 SDs; the reframe (OKRs are per-objective projects) was understood + greenlit BEFORE I re-proposed options.
- **`feedback_no_destructive_without_greenlight`** — every slice surfaced Q-gate before first edit; commit boundaries (audit doc separately, then 3 code slices) preserved per `feedback_audit_governance`.
- **`feedback_audit_governance`** — 3 audit IDs minted + 3-stage flipped today (07/08/09); 5 NEW IDs minted in PLAN state for B3 (10/11/12/13/14). AUDIT_TRACKER summary tally updated in lockstep.
- **`feedback_test_fixture_validation`** — B1.4 LIVE-FIRE regression stubbed mongoose models with require.cache before requiring the route (no MongoMemoryServer needed); verified all 9 scenarios pass.
- **`feedback_quote_the_canon`** — B1.2 prompt formatters export from single-objective.js + /generate-krs reuses them verbatim (no copy-paste of TIMELINE wording).

### Branch status at /close

Working tree pending B2 doc commit. After commit 5 lands: **22 commits ahead of origin** (5 new today + 17 carry-forward from #237 awaiting APP_URL Render verify per A20260512-13).

### Next session recommendation

**Per user direction at /strategy #240**: "Let's do the coding session later." B3 deferred to next session.

**Priority queue for next session pick**:
1. **`/coding-hotfix` A20260513-08a** (CRITICAL — `Karvia2025!` hardcoded password × 3 sites) — security gating; should ship before further feature work
2. **`/coding` B3a** (sub-slices 2.3.1 + 2.3.2 — Goal schema relaxation + route writes) — ~1.5h, backend foundation for B3 epic
3. **`/coding` B3b** (sub-slices 2.3.3 + 2.3.4 — planning page redesign + Window CRUD) — ~4h, the heaviest sub-slice; could split if budget tight
4. **`/coding` B3c** (sub-slice 2.3.5 — dashboard KPI reframe) — ~1.5h, last B3 piece + overlaps with deferred Session C Dashboard-v2 honesty pass
5. **`/coding` Session C** (Dashboard-v2 honesty pass + chores actions + Moves empty state) — coordinate with B3c

---

## /close — 2026-05-14 (Workstream C — C.1a SEALED: 5 audit IDs in one /coding session, honesty pass complete)

**Sessions in arc**: /init → /coding (holistic workspace audit → 5-slice ship → /close). Quality rating **9/10**.

**What shipped (5 commits, 5 audit IDs, 118/118 ✓ regression)**:

- `A20260514-02` — My Clients tile honesty hotfix (Bug 1 SSI aggregation $ifNull post-A20260512-17 canonical reshape; Bug 2 `.mc-tile-header padding-right: 36px` pencil clearance). Regression 13/13 ✓.
- `A20260514-03` — Risk diagnosis enhancement. `computeRiskStatus()` returns `{status, trigger, detail}` tuple (6 stable trigger enums + 'none'); 4 BE callers migrated (1 destructure, 3 pass-through); 3 FE consumers defensive-read; Summary Risk card + Profile health-chip render trigger sub-text. Closes Bug 3 opaque-URGENT-badge. Regression 35/35 ✓.
- `A20260514-05` — Objectives KPI rationalization. CONSTRAINT canonical-source swap (was per-Assessment taker-dependent; now `Company.assessment_scores` lowest dim). DRIVERS → OWNERSHIP rename (playbook verb collision per `feedback_quote_the_canon`). VELOCITY → BALL POSITION replace via new `BALL_POSITION_VIEWS` map + `furthestBallPosition()` helper near `bucketByLifecycle` per `feedback_extend_before_wrap`; 5 canonical states ⚪🟡🎯🤝📊 quoted verbatim from ACTIVATION_PLAYBOOK §ball-position-lens; priority sustained > handed_off > identified > possession_won (needs hasAssessmentData) > off_field. 2 Move.countDocuments queries dropped (dead until S27). FE 4-card strip rebuilt: HEALTH no fraction, OWNERSHIP defensive `k.ownership || k.drivers`, CONSTRAINT capitalized, BALL POSITION emoji+label via valueHTML. Regression 36/36 ✓.
- `A20260514-04` — Summary tab simplification. 5+1 cards → 4-card strip. Dropped TEAMS (low-signal) + ASSESSMENTS (redundant with My Clients tile). Promoted Last Activity from standalone `cw-summary-grid` UP into strip as 4th card (single visual rhythm across all tabs). Regression 13/13 ✓.
- `A20260514-06` — Plan tab simplification. 4 cards → 3 cards. Dropped TODAY + CATCH-UP (both read `weekly.moves[]` dead until S27). Replaced THIS WEEK with PLANNING COVERAGE (`coveredKRs / totalKRs` ratio; tiered accent ≥80/40-79/<40 = on_track/at_risk/urgent; Q4 (a) policy — 0-KR objectives don't penalize coverage). Added NEXT WEEK READY (WGs planned ISO week+1 with year-rollover at week 52). Kept FRESHNESS unchanged. All Move-reading locals removed — no dead code. Regression 21/21 ✓.

**C.1 reframe (D10)**: Page-matrix C.1 row reframed at /coding start into C.1a (honesty pass — this session) + C.1b (nudge action layer — deferred pending wizard-preview verification + cooldown design). Net Workstream C scope grew from 5 to 6 virtual tasks; tally now 4/6.

**Holistic audit table** (built before any code touched): 5 tabs surveyed (Summary / Profile / Objectives / Plan / Teams; Assessments skipped per user direction). 8 bugs/issues surfaced. 10 simplification decisions (D1-D10) all greenlit. 5 pre-edit Qs (Q1-Q5) all (a) defaults greenlit. Documented in conversation; not codified in a separate doc per `feedback_minimal_change_grounding` (no governance doc bloat — the audit-tracker rows + commit messages carry the rationale).

**Methodology highlights**:
- Bugs first (Slices 1+2 reduced field surface area of broken consultant tooling immediately).
- Rationalization second (Slices 3+4+5 add no new affordances — pure honesty).
- Each slice = one commit, one audit ID, one regression script.
- Defensive FE reads on every shape change (`typeof === 'object'` guards + `k.ownership || k.drivers` fallback) for cached-payload safety.

**Memory rules applied**:
- `feedback_why_what_how_when` — user explicitly asked for brainstorm BEFORE any code; holistic Why-first walkthrough drove the C.1 split.
- `feedback_minimal_change_grounding` — no new endpoints, no schema changes, no new models. All edits inside existing handlers/renderers.
- `feedback_reuse_max` — canonical `Company.assessment_scores` already fetched by sibling endpoints; existing $ifNull pattern at line 1269 reused as template for portfolio-summary fix; FE defensive-read pattern reused across 3 consumers.
- `feedback_extend_before_wrap` — BALL_POSITION helpers added NEXT to `bucketByLifecycle` (not a separate module); `computeRiskStatus` extended to tuple shape (not a parallel function).
- `feedback_no_destructive_without_greenlight` — D1-D10 + Q1-Q5 surfaced before first edit; user replied "agree with all your recommendations" + "go (a) all" before any line of code changed.
- `feedback_quote_the_canon` — 5 BALL_POSITION labels + descriptions quoted verbatim from ACTIVATION_PLAYBOOK §"The ball-position lens"; DRIVERS→OWNERSHIP rename specifically to eliminate prior verb-collision drift.
- `feedback_audit_governance` — 5 audit IDs minted in PLAN state up-front per Q5 (a); flipped to 💻→✅ as each slice landed; AUDIT_TRACKER + handoff history updated in lockstep with each commit.

**Sprint 26 status at /close**:
- A 🟢 4/4 ✅
- B 🟢 8/8 ✅
- C 🟡 **4/6** (C.2 + C.3 + C.5 + C.1a sealed; C.1b deferred; C.4 pending)
- D ⏳ 0/2 pending (D.2, D.3)
- E 🟢 4/4 ✅ (preflight Q9 manual verify still pending for SEC-7)

12/24 firing tasks shipped (50%). Working tree clean at /close, `origin/development` synced to HEAD (prior "17 ahead" carry-forward resolved between sessions). APP_URL Render verification per A20260512-13 contract — confirm on next deploy.

**Next session recommendation**: `/audit` A20260513-08 hardcoding sweep (~0.5d) — closes pre-flagged Invitation.js:495 finding + scans rest of codebase. Alternative: `/coding` C.4 (per-invitee progress widget, ~1d, fully unblocked). C.1b nudge action layer deferred pending wizard-preview-mode verification.

---

## /close — 2026-05-14 (Workstream C 2 slices SEALED in one /coding session: C.2 + C.3)

**Sessions in arc**: /init → /coding (C.2 4-case empty-state helper, A20260506-06) → /coding (C.3 AIOKR cohort-aware framing, A20260514-01 minted at impl) → /close. Quality rating **9/10**.

### Shipped (2 audit IDs, 2 commits)

- **C.2 — 4-case empty-state helper** (commit `809af6d`): `EMPTY_STATE_COPY` matrix + `emptyStateView()` pure helper added to `display-labels.js` quoting `ACTIVATION_PLAYBOOK.md` ball-position lens verbatim per `feedback_quote_the_canon`. `objectives.html` empty-state dynamic copy + CTA wired via existing `/api/companies/:id` (no new endpoint). Audience='owner' fixed (objectives.html is BO-side); consultant rows pre-paid for C.1 consumption. Test 46/46 ✓ + sibling 73/73 ✓ = 119/119.
- **C.3 — AIOKR review cohort-aware framing** (commit `18966be`): `/api/companies/:id` extended with additive `cohort: {mode, coach?}` field reusing canonical `cohortDetection.js getAssignedConsultant` predicate (same source as Workstream B). 3 FE copy variants (`consultant_view`/`bo_consulting`/`bo_self_serve`) on `ai-okr-review.html` header + info banner; baked-in HTML defaults preserve self-serve copy verbatim → fetch failure invisible. Test 65/65 ✓ + C.2 sibling 46/46 ✓ + companies.js smoke-load = 111/111.

### Pre-edit Q gates honored (8 micro-Qs, all greenlit (a))

- **C.2**: Q-C2-1/2/3/4 — canon-quoted stage mapping / 4-case helper / reuse `/api/companies/:id` / pure-data signature.
- **C.3**: Q-C3-1/2/3/4 — extend `/api/companies/:id` / 3-variant matrix / page-local copy const / "your consultant" name fallback.

Per `feedback_no_destructive_without_greenlight`, both slices stayed additive — zero existing-key removal on the BE response, zero schema change, zero JWT-swap surface added.

### S26 scope impact

- **Firing**: 13/24 → **15/24** (62.5%) — A 4/4 ✅ + B 8/8 ✅ + C **3/5** + D 0/2 + E 4/4 ✅
- **Workstream C math**: 1/5 → **3/5** (C.5 + C.2 + C.3 done; C.1 + C.4 pending)
- **Audit governance**: A20260506-06 flipped 📝→💻→✅; A20260514-01 minted + flipped 📝→💻→✅ in single session per `feedback_audit_governance`

### Memory rules honored this session

- `feedback_no_destructive_without_greenlight` — 8/8 pre-edit Qs surfaced
- `feedback_quote_the_canon` — Stage 0/1 mapping copy-pasted from playbook line 44-45; ACTIVATION_PLAYBOOK §A.3 cited inline + grep-asserted in tests
- `feedback_reuse_max` — both slices reused existing `/api/companies/:id`; C.3 reused `getAssignedConsultant` BE predicate (zero new function, zero new endpoint)
- `feedback_extend_before_wrap` — C.2 extended display-labels namespace; C.3 extended companies.js handler instead of mounting new sub-route
- `feedback_minimal_change_grounding` — both slices retained existing markup verbatim except id-attribute additions; baked-in copy preserves degraded-fetch experience identical to pre-change
- `feedback_audit_governance` — A20260514-01 ID + 3-stage flip in single session; master-tracker row added with citations

### Carry into next session

- **C.4 spike-first** (page-matrix line 126: "C.4 starts with 30-min spike to verify if new endpoint needed (finding A20260513-02)") — bounded discovery slice; spike result determines whether C.4 is small (reuse aggregate) or needs endpoint scope
- **C.1** (2d, biggest remaining) — needs fresh session for proper grounding; consultant nudge surface in `client-workspace.html#tab=objectives`. C.2's consultant-view copy rows are already pre-paid for it.
- **D.2 / D.3 triage** — refinement-track candidates, decision-heavy not coding-heavy
- **Preflight Q9 manual verify** (15 min) — flips Beta gate SEC-7 🟢
- **Branch status**: 2 commits ahead of origin (C.2 + C.3); push pending APP_URL Render verification per A20260512-13 contract

### Next session recommendation

**`/coding` C.4 spike-first** (1d) — bounded scope, builds on the cohort-detection pattern C.3 just established. C.1 deserves its own dedicated session with full grounding budget.

---

## /close — 2026-05-13 (Day 3 polish slice — 3 audit IDs SEALED in one session)

**Sessions in arc**: /init → /coding (3 slices + regression + governance) → /close. Quality rating **9/10**.

**3 audit IDs shipped** (all triaged by #228 /audit and minted under "BETA-POLISH" family):

- **A20260513-05** — EMPLOYEE empty-state gate (~10 LoC FE at [team-ssi-view.js:540-552](../../../client/pages/scripts/team-ssi-view.js#L540)). Inside `if (!hasData)`, EMPLOYEE branches early — reveal `#tab-container` + hide `#loading-state` + return — instead of calling `showEmptyState()` which would hide tab-container. My Results tab (set as defaultTab in init at line 107-108) now reachable for EMPLOYEE even when `Company.assessment_scores` rollup is empty.
- **A20260513-06** — canonical headline counts for `/team-breakdown` (~30 LoC BE in [server/routes/assessments.js](../../../server/routes/assessments.js)). After the role-based teams fetch (lines 763-789), non-MANAGER roles compute `canonicalHeadline = { total_completed, total_members }` via `Assessment.distinct('user_id', { company_id, status:'completed', user_id:{$ne:null} })` + `User.countDocuments({ company_id, status:{$in:['active','pending_invite']}, role:{$ne:'CONSULTANT'} })`. Both early-return (no teams + no anonymous) AND main response paths consume it. MANAGER keeps team-iteration counts ("my managed teams" semantic contract preserved). Q1=(b) chosen for members semantic — `pending_invite` users counted, since the header label "X/Y Completed" semantically expects pending invitees in the denominator.
- **A20260513-06b** — role-conditional `sent_by` in `/kpi-summary` (~12 LoC BE at [assessments.js:2350-2390](../../../server/routes/assessments.js#L2350)). Non-CONSULTANT branch split via `isPersonalScope = role === 'MANAGER'`: BO + EXECUTIVE drop `sent_by: userId` (company-wide cockpit semantics — they need org-level dispatch activity); MANAGER keeps it (personal-scope semantically correct for "what I dispatched to my team"). `/sent-by-me` untouched (Sent by Me tab is rightly personal).

**Two micro-questions surfaced + greenlit pre-edit** (per `feedback_no_destructive_without_greenlight`):

- **Q1** (`total_members` semantics): triage one-liner specified `is_active: true` but [User.js:213-217](../../../server/models/User.js#L213-L217) reveals **no `is_active` field — only `status` enum**. Surfaced two interpretations + recommendation `(b) status:{$in:['active','pending_invite']}` (semantic match with "X/Y Completed" header). User greenlit (b).
- **Q2** (EMPLOYEE Company Overview scope): recommended `(a)` minimal "reveal tab-container, let CompanyOverview render its own empty content" vs `(b)` larger "patch CompanyOverview renderer for EMPLOYEE-with-empty-rollup". User greenlit (a).

**Regression sweep — 171/171 ✓** across 7 S26 audit-ID scripts:
- NEW [scripts/test-sprint26-A20260513-05-06-06b-polish.js](../../../scripts/test-sprint26-A20260513-05-06-06b-polish.js) **23/23 ✓** (5 -05 anchor + branch + reveal + ordering + helper-intact; 11 -06 derivation + role gate + Assessment.distinct shape + User.countDocuments scope + status enum + early-return adoption + MANAGER fallback dual-axis; 7 -06b route + anchor + personal-scope + sent filter + completed filter + MANAGER preserved + no-inline regression)
- A20260512-13 contract 18/18 + -14 dedup 16/16 + -15 user_exists 17/17 + -16(a) canonical-results 29/29 + -17 canonical-shape 59/59 + -18/-19 deadlinks 9/9
- `require('./server/routes/assessments.js')` clean load ✓

**One regex window too tight on first run** (`showEmptyState` helper-intact assertion failed because the original `{0,200}?empty-state` window was ~40 chars short of the actual gap). Fixed by widening to a block-anchor pattern + separate substring checks. 22/23 → 23/23 ✓ on second run. **Lesson reaffirmed** for `feedback_test_fixture_validation`: regression-test regex windows are themselves fixtures — count actual chars, don't estimate. (Same pattern as #226's regex-too-strict note.)

**AUDIT_TRACKER.md summary table updated**: High OPEN 9→6, High FIXED 18→21 (+3 from -05/-06/-06b). Total counts unchanged.

**Sprint 26 firing UNCHANGED at 4/24 (17%)**: today's 3 IDs are governance/polish scope per page matrix, not firing tasks.

**Files touched today** (5): [client/pages/scripts/team-ssi-view.js](../../../client/pages/scripts/team-ssi-view.js) Slice 1 + [server/routes/assessments.js](../../../server/routes/assessments.js) Slices 2+3 + NEW [scripts/test-sprint26-A20260513-05-06-06b-polish.js](../../../scripts/test-sprint26-A20260513-05-06-06b-polish.js) + [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) (3 flips + summary) + this handoff (Day 3 entry + audit-history row flips).

**Carry into next session**:

1. **Push status**: `development` now **4 commits ahead** of origin (3 prior — `15a4315` + `bf4aa18` + `d4b37c8` — plus this Day-3 work uncommitted). Awaiting `APP_URL` Render env-var verification on all 3 services per #225's -13 fail-fast contract.
2. **Manual smoke on `karvia-business-1.onrender.com`** after push — verify (a) EMPLOYEE login → team-ssi-view opens My Results + read-only Company Overview works; (b) BO/EXEC dashboard headline now shows "X/Y Completed" with company-wide truth (not 0/0); (c) assessment-hub KPI strip "Sent / Completed" company-wide for BO/EXEC + personal for MANAGER.
3. **Preflight Q9** (15-min manual smoke on `karvia-business-1` against client w/ pending invitations) still outstanding — flips Beta gate **SEC-7 🟢**.
4. **Polish item (refinement track)**: tab label "My Results" stays generic when Mgr+ views team-member assessment — minor UX nit, not Beta blocker; rename to neutral "Assessment Result" deferred (not minted as audit ID).

**Memory rules honored**: per `feedback_minimal_change_grounding` (caught `is_active`→`status` schema mismatch in the triage one-liner BEFORE the first edit — reading User.js schema took ~30 sec and saved a guaranteed runtime/test failure); per `feedback_extend_before_wrap` (extended /team-breakdown response builder + /kpi-summary non-CONSULTANT branch; resisted "introduce new aggregator endpoint" / "new role-gateway middleware" framings); per `feedback_reuse_max` (reused `Assessment.distinct` + `User.countDocuments` Mongoose primitives; no new utility module); per `feedback_no_destructive_without_greenlight` (surfaced Q1 + Q2 with recommendations BEFORE first edit; awaited "Q1-b, Q2-a" greenlight); per `feedback_audit_governance` (3 IDs, all 3-stage tracking in master tracker + handoff mirror; regression script named per-ID convention); per `feedback_test_fixture_validation` (regression-test regex window caught + fixed in one round); per `feedback_audit_governance` (summary-table delta tracked with stable comment).

**Next session recommendation**: **`/coding`** Sprint 26 Day 4.

- **(A)** Workstream A.1 — ActivationPlaybook draft (~1.0d, no deps, unblocks Workstream B dispatchers).
- **(B)** C.2 — 4-case empty-state helper (0.5d, no deps, closes A20260506-06).
- **(C)** C.5 — `owner_id` wizard step (0.5d, no deps, closes A20260506-05).
- **(D)** Push + Preflight Q9 manual smoke first (15 min, flips SEC-7 🟢).

**20 firing tasks remain.** S26 status: Workstream E 🟢 SEALED; A/B/C/D pending.

---

## /close — 2026-05-13 (Day 2 — yesterday's ledger sealed + Path B convergence shipped)

**Sessions in arc**: /init → /coding (Slice 1 close yesterday's ledger) → /coding (Slice 2 Path B convergence) → /close. Quality rating **9/10**.

**3 audit IDs shipped across 2 commits**:
- `bf4aa18` — A20260512-18 (URL drift on `/pages/assessment.html`, scope expanded from doc-only to doc + live code + param-name across §4 + §5 + invitations.js:1833) + A20260512-19 (minted same session — 2 broken `/pages/assessment-form.html` empty-state CTAs removed per user direction "no backward loop", orphan `business-assessment.html` 388 LoC retired)
- `d4b37c8` — A20260512-16(a) re-scoped from "add CTA ~25 LoC" to full **Path B convergence**: `team-ssi-view.html` is now the canonical results page (NEW 5th tab "My Results"; EMPLOYEE block removed at team-ssi-view.js:86; role-aware tab matrix EMPLOYEE/MANAGER/BO/EXEC/CONSULTANT; EMPLOYEE Company Overview synthesizes from `/api/companies/:id` `assessment_scores ÷ 10`; assessment-results.html retired from 566 LoC → 54-line redirect shim with legacy `?id=` mapping; 3 callers migrated). **Zero backend touch.**

**Regression sweep — 56/56 ✓** across all suites: new A20260512-16(a) canonical-results 29/29 + new A20260512-18/-19 deadlinks 9/9 + yesterday's A20260512-13 contract 18/18 (no breakage).

**Sprint 26 firing UNCHANGED at 4/24 (17%)**: today's 3 audit IDs are governance + convergence scope, not firing tasks per page matrix.

**Carry into next session**:
1. **Manual smoke on `karvia-business-1.onrender.com`** after push — verify EMPLOYEE login → team-ssi-view opens to My Results + read-only Company Overview works.
2. **Push status**: `development` now **3 commits ahead of origin** (`15a4315` + `bf4aa18` + `d4b37c8`); awaiting `APP_URL` Render env-var verification on all 3 services per yesterday's -13 fail-fast.
3. **Polish item (refinement track)**: tab label "My Results" stays generic when Mgr+ views team-member assessment — minor UX nit, not Beta blocker; rename to neutral "Assessment Result" deferred (not minted as audit ID).
4. **Preflight Q9** (15-min manual smoke on `karvia-business-1` against client w/ pending invitations) still outstanding — flips Beta gate SEC-7 🟢.

**Next session recommendation**: **`/coding`** Sprint 26 Day 3.
- **(A)** Workstream A.1 — ActivationPlaybook draft (~1.0d, no deps, unblocks Workstream B dispatchers).
- **(B)** C.2 — 4-case empty-state helper (0.5d, no deps, closes A20260506-06).
- **(C)** C.5 — `owner_id` wizard step (0.5d, no deps, closes A20260506-05).
- **(D)** Push + Preflight Q9 manual smoke first (15 min, flips SEC-7 🟢).

**20 firing tasks remain.** S26 status: Workstream E 🟢 SEALED; A/B/C/D pending.

**Files touched today** (11): 7 NEW + 4 UPDATED. All doc work.

---

## /strategy #222 — 2026-05-12 (Consultant Cockpit philosophy why-audit)

**Session in arc**: /init → /strategy → /close. Quality rating **9/10**. No code touched; pure philosophy + roadmap framing.

**Shipped** (1 commit `021162d`, 478 insertions, 2 NEW docs, BETA_ROADMAP_2026.md UNTOUCHED):

1. **[KARVIA_STRATEGY/1-PRODUCT/philosophy/](../../../1-PRODUCT/philosophy/)** (folder, first entry) → **[CONSULTANT_COCKPIT_PHILOSOPHY.md](../../../1-PRODUCT/philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md)** (T2-PRD-PHIL-001 | ACTIVE | 285 lines) — 6-tile why-audit of `client/pages/client-workspace.html` Summary tab. Each tile: Why/What/How/When + Confidence (Solid/Soft/Shaky) + code-grounded derivation. 7 open `Q-PHIL-01..07` questions. 5 incremental clarification candidates `C-01..C-05`.

2. **[SPRINT_26_27_MILESTONE_LADDER.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/SPRINT_26_27_MILESTONE_LADDER.md)** (T2-PRD-MILESTONE-001 | ACTIVE | 193 lines) — addendum to T1-PRD-002. **S26 success criterion LOCKED**: 9 clients × 5 team members × correct SSI × credible cockpit → Beta launches. Per-client mini-milestone ladder. S27 preliminary ladder (First Task). S28 explicit placeholder. 6 deferred improvement candidates `I-01..I-06` cross-linked to Q-PHIL-XX.

**Key philosophical pins captured**:

- **Risk decomposition REFUSED on audit**: existing D-C-5 formula (in [server/routes/consultant.js:42-57](../../../../server/routes/consultant.js#L42-L57)) already mixes ops + strategy signals correctly. Gap is disclosure (tooltip), not decomposition (new tile). No new Risk tile in S26 or post.
- **3 Objective sub-icons**: map cleanly to `identified · handed_off · sustained` (5-verb lifecycle). Philosophy correct, legibility shaky. Tooltip/legend = future post-Beta improvement (C-02 / I-03).
- **"Last Activity" derivation is shaky**: today binary (assessment OR objective update); excludes logins, KR updates, team adds. Captured as `Q-PHIL-04` + `I-05`.
- **"Teams" semantic is soft**: invited vs logged-in vs onboarded not pinned. `Q-PHIL-03` + `I-04`.
- **Q-PHIL-07 (new)**: Risk tile could surface counts (urgent/medium/improvement) from SSI diagnostic report LLM tags — captured as `I-01` deferred post-Beta, NOT promoted to S26.

**S26 scope IMPACT**: **zero**. 24 firing tasks unchanged. No task added, no task deferred. All 6 improvement candidates `I-01..I-06` parked for post-Beta consumption.

**Audit IDs touched**: none.

**Memory rules honored**: per `Why → What → How → When` (3-question greenlight asked twice, once on outline + once on reframe); per `Stay grounded — minimal change` (no new tiles, no layout shifts, no code, canonical roadmap untouched); per `Safety first — no destructive` (additive docs only); per `feedback_audit_governance` (both docs carry genome tags + stable IDs); per `feedback_two_app_model` (philosophy doc anchored to Consultant App surface; Client App view of same tiles = future separate audit).

**Course-correction caught mid-session**: original outline proposed Ops Risk + Strategy Risk as separate tiles; user reframed to "interrogate the existing cockpit, no radical change"; outline rewritten as why-audit BEFORE any writing.

**Next session recommendation UNCHANGED**: `/coding` → **E.2** (rollup field fix + backfill).

---

## /close — 2026-05-12 (#223 — UI compaction + I-07 deferral; E.2 work scoped + scratched on user pivot)

**Sessions in arc**: /init → /coding (UI polish + governance) → E.2 scoping (4 file reads, no edits) → /close. Quality rating **9/10**.

**Shipped** (1 commit `b47eaf7`, 4 files, +120 / -200):

1. **I-07 deferred** to [SPRINT_26_27_MILESTONE_LADDER.md](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/SPRINT_26_27_MILESTONE_LADDER.md) §5 — consultant Assessments tab in-tab summary (MECE by role × status) parked for post-Beta (S28+). Same cockpit-principle family as I-04 (Teams semantic). No Q-PHIL parent.

2. **A20260512-12 (S26 UI polish, FE-only)** — [client/pages/objectives.html](../../../../client/pages/objectives.html) header compaction: gradient "Your Objectives" hero card + big Category Coverage card removed; KPIs (Active / Progress / Key Results / AI Generated) consolidated into one inline pill strip with Q4 selector + Add Objective; Category Coverage moved below as slim wrap-strip (emoji + label + count + thin accent bar per category, gap alert preserved). All 13 JS hook IDs + 6 `data-category` items + `.category-coverage-item` / `.category-count` / `.category-bar` / `.category-status` classes intact. Zero JS/backend touch.

**S26 firing task counts UNCHANGED**: 24 firing (A.1-4 + B.1-8 + C.1-5 + D.2-3 + E.1-4 + preflight). UI polish is governance-scoped, not a firing task.

**Audit IDs flipped**:
- `A20260512-12` (NEW) — UI polish; 📝 ✓ + 💻 ✓; ✅ pending S26 close regression sweep
- A20260512-* batch heading in [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) bumped 7 IDs → 8 IDs

**E.2 work scratched cleanly** (zero edits): user said "lets fix the bug now" after slice 2 commit. Pulled page-matrix specs + read [OnboardingProgressService.js:1-120](../../../../server/services/OnboardingProgressService.js#L1-L120) + grep'd `ssi_result` / `ssi_scores` / `assessment_scores` across Assessment.js + Company.js + read [Assessment.js:300-340](../../../../server/models/Assessment.js#L300-L340) + [Assessment.js:480-580](../../../../server/models/Assessment.js#L480-L580) schemas before user pivoted to /close.

**Worth preserving for next /coding** — E.2 grounding finding caught pre-edit:

> Assessment model **dual-writes** `ssi_scores` (legacy, 0-100 scale via [Assessment.js:844-847](../../../../server/models/Assessment.js#L844-L847) `// Also update legacy ssi_scores for backward compatibility`) AND `ssi_result.dimensions.*.score` (canonical, 0-10 scale via UnifiedSSIScoringService). The drift isn't "one field missing" — it's **scale inversion**: legacy = 0-100, canonical = 0-10. `Company.assessment_scores.{speed,strength,intelligence,overall}_score` ([Company.js:317](../../../../server/models/Company.js#L317)) expects 0-100. E.2's one-liner doesn't spec the rescaling decision.

**Preflight question owed before E.2 first edit**:

> Rollup writes `Company.assessment_scores.*_score` on a 0-100 scale per Company schema; canonical `ssi_result.dimensions.*.score` is 0-10. Do we (a) multiply by 10 in OnboardingProgressService read path or (b) bump Company schema to 0-10 and migrate all consumers?

Answer (a) is minimal-change (single service edit + backfill script same shape). Answer (b) is cleaner long-term but touches every Company.assessment_scores reader. Per `Stay grounded — minimal change` standing rule → recommend (a) for S26 E.2; promote (b) to refinement track if pressure surfaces post-Beta.

**Files touched today** (4): 1 FE (`objectives.html`) + 3 governance (`SPRINT_26_27_MILESTONE_LADDER.md`, `AUDIT_TRACKER.md`, `SPRINT26_HANDOFF_DOCUMENT.md` — this doc).

**Push status**: NOT pushed — `development` branch is 2 commits ahead of `origin/development` (prior /close #222 `3879723` + today's `b47eaf7`). Awaiting user green-light.

**Browser smoke**: NOT performed — UI verification deferred to user refresh on `karvia-business-1.onrender.com` after push, or next /coding session can spin up local `npm run dev:server` for in-flow validation.

**Memory rules honored**: per `Why → What → How → When` (pre-evaluation refusal of #1 surfaced 4 reasons before defer-to-I-07 recommendation); per `Stay grounded — minimal change` (slice 2 is pure HTML reflow, no JS/BE/data-shape touch); per `Safety first — no destructive` (E.2 work scratched cleanly with zero file edits on user pivot — no orphan changes, no scratch commits); per `feedback_audit_governance` (A20260512-12 has stable ID + 3-stage tracking + matrix bump + handoff mirror); per `feedback_test_fixture_validation` (Assessment + Company schemas read BEFORE proposing any E.2 edit — caught scale-inversion gap in E.2 one-liner that would have bitten the implementation).

**Quality reflection: 9/10**. Strong: pre-evaluation held the line on cockpit-philosophy guardrails per /strategy #222 standing constraint (defer-to-I-07 framed against S26 success criterion, not personal preference); slice 2 preserved every JS hook (grep audit confirmed 13/13 IDs + 6/6 data-category + 4/4 class names); div-tag balance pre/post = -1 same (honest verification rather than claiming "introduced 0 issues"); mid-session pivot to E.2 scratched cleanly with zero file edits (no orphan state); pre-edit Assessment-model grounding caught the scale-inversion gap that E.2's one-liner under-specifies — preserved as preflight question for next session. Negative: didn't surface the E.2 slice plan + scale-question on first turn after user said "fix the bug" — read 4 files before naming the slice; should have surfaced "E.2 one-liner under-specifies scale conversion 0-10 → 0-100; need answer before code" on first turn rather than reading 4 files first. Lesson candidate for `feedback_test_fixture_validation`: **"when audit-tracker one-liner names old vs new field, also check unit/scale parity — same name doesn't mean same magnitude."**

**Next session**: `/coding` Sprint 26 Day 1 — resume **E.2** (rollup field fix + backfill) starting with the scale-inversion question answered; then E.2 → E.1 → E.3 → E.4 per page matrix Day-1/Day-2 sequence. Alternative Day-1 picks unchanged: A.1 (Activation Playbook), C.2 (4-case empty-state, 0.5d, no deps), C.5 (owner_id wizard, 0.5d, no deps), preflight Q9 (15-min verify).

---

## /close — 2026-05-12 (S26 Day 1 SEALED — Workstream E 🟢 fully closed)

**Session in arc**: /init → /coding → /close. **Quality 9/10. Token usage ~155K. Six commits. 4/24 firing closed in one session.**

### Shipped (all 4 firing E-workstream tasks)

| Audit ID | Task | Commit | Tests |
|---|---|---|---|
| `A20260512-02` | E.2 — canonical rollup + backfill | `7aebee4` + `b7cfe20` | 34/34 unit + 32/32 integration + 55/55 PX-2.8 regression |
| `A20260512-01` | E.1 — `/dashboard-summary` + `/team-breakdown` + FE unification | `0f8b16c` + `637de29` | 32/32 integration + 55/55 consultant-reads regression (F-M-02 cap 7→6) |
| `A20260512-08` | E.3 — `SCORING_DISPATCH` via existing `assessment_type` | `accb722` | 26/26 dispatch |
| `A20260512-11` | E.4 — cascade-correctness for today's wiring | `5816d6b` | 29/29 cascade |
| **Total regression sweep** | | | **263/263 ✓** |

### Two spec amendments (both pre-edit surfaced + greenlit)

1. **E.3 — Reuse-max amendment** (saved as new memory `feedback_reuse_max.md`). Original spec proposed new `AssessmentTemplate.scoring_type` field; grep surfaced 2 pre-existing fields (`Assessment.assessment_type` + `AssessmentTemplate.framework_type`) covering same intent. Reused existing `assessment_type` for dispatch → zero schema change, zero migration. User direction "always reuse max" captured as durable memory.
2. **E.4 — Scope-narrow amendment**. Grounding revealed Q5+Q12 full canonical contract (latest-per-PERSON + role-weighted aggregate + role-change/delete triggers) NOT wired today. E.4 was sized 0.25d (test only) — incompatible with implementing full contract. Test ships against today's reality + Q12 gap logged in REFINEMENT-BACKLOG Sub-bucket A (1-2d refinement-track epic).

### Carry into next session

1. **Preflight Q9** — 15-min manual smoke on `karvia-business-1` against a client with pending invitations. Flips Beta gate **SEC-7 🟢** once it lands. Not code scope; user manual or /testing session.
2. **Q12 canonical-contract gap** logged at [REFINEMENT-BACKLOG/README.md](../REFINEMENT-BACKLOG/README.md) Sub-bucket A — surface at next /strategy or /audit pre-Beta-1 to confirm classification holds against S26 success criterion ("correct SSI").
3. **Push status**: NOT pushed — local `development` 7 commits ahead of origin/development. Awaiting user green-light per safety protocol.

### Next session recommendation

**`/coding` Sprint 26 Day 2** — 20 firing tasks remain. Day-1-equivalent unblockers (all no-dep, parallelizable):
- **A.1** Activation Playbook draft (foundational doc for A-workstream)
- **C.2** 4-case empty-state helper (`display-labels.js`, 0.5d)
- **C.5** owner_id wizard step (BO selection during objective-create, 0.5d)
- **B.3** Dispatcher 3 Assessment-aggregate complete (NOW UNBLOCKED by E.1 + E.2 ✓; 2d, depends on A.4 + B.6)

Alternative session types: `/strategy` to lock the Q12 gap classification before Beta-1, or `/testing` to run preflight Q9 + S26 acceptance-test rehearsal.

---

## /coding-hotfix — 2026-05-12 (#225 — A20260512-13 + A20260512-14: critical journey unblockers)

**Session in arc**: /init → /coding-hotfix → /close. Quality target **9/10**. Two user-surfaced live bugs on pre-prod/dev; both diagnosed grounded then fixed in single commit.

### Shipped (2 audit IDs, hotfix scope, not new firing tasks)

| Audit ID | Issue | Fix locus | Tests |
|---|---|---|---|
| `A20260512-13` | EMAIL_DEEP_LINK_CONTRACT violation — 7 banned env reads (`FRONTEND_URL`/`SIGNUP_URL`/`BASE_URL`/`||` chains/hardcoded localhost) across consultant-invitation critical journey caused pre-prod links to point at `http://localhost:3000/...` | `server/routes/invitations.js` × 5 sites + `consultant.js:508` + `diagnostic-reports.js:900` + boot validation in `server/config/index.js:285-291` | 18/18 ✓ |
| `A20260512-14` | Q12 display-layer slice — `/api/assessments/company-results` stacked historical retakes per user → Team Results UI showed "Manager Regtest" twice | NEW `server/utils/assessmentDedup.js` (`dedupeLatestPerUser` pure helper) wired into `server/routes/assessments.js:2235-2238` | 16/16 ✓ |
| **Regression sweep** | E.1 32/32 + E.4 29/29 + consultant-reads 55/55 + 4 routes smoke-load | — | **150/150 ✓** |

### Diagnostic + scope-discipline notes

1. **A20260512-13 caught 7th violation mid-test**: initial grep surfaced 6 banned reads; the contract test caught a 7th `${APP_URL || 'http://localhost:8080'}` `||` chain at `invitations.js:1631` (same pattern, different fallback). Test added value beyond proposal-time grep — kept in regression.
2. **A20260512-14 scope guardrail honored**: display-layer dedup only. Write-path Q12 work (role-weighted rollup + role-change/delete triggers) stays in REFINEMENT-BACKLOG Sub-bucket A under A20260512-11 cross-link.
3. **`FRONTEND_URL` retained in `.env.example:16`** — used for CORS config (different concern), NOT banned by EMAIL_DEEP_LINK_CONTRACT (contract bans it as email base URL only).
4. **First user-surfaced bug in screenshot turned out NOT to be a defect**: "You are not authorized to view this client's assessments." on consultant click-through — diagnosed as stale `karvia_user.managed_businesses` localStorage; re-login fixed. Not opened as audit ID per false-positive triage.

### S26 scope impact

**Zero** — 24 firing tasks unchanged. A20260512-13/-14 are governance-scoped (contract enforcement + display carve-out from deferred backlog item), not new firing tasks.

### Memory rules honored

- `feedback_minimal_change_grounding` — single commit, single slice per audit ID, no incidental cleanups
- `feedback_reuse_max` — checked for existing latest-per-user helper before creating `assessmentDedup.js` (only `analyticsService.js:335-339` exists but is single-user, not group dedup)
- `feedback_no_destructive_without_greenlight` — both fixes surfaced as proposals before edits; user greenlight: "start"
- `feedback_audit_governance` — both IDs carry stable IDs + 3-stage tracking in AUDIT_TRACKER batch heading (8 → 10) + handoff audit-history rows + REFINEMENT-BACKLOG cross-link
- `feedback_test_fixture_validation` — fixture rows in dedup test mirror real populated `Assessment.find()` shape (`{ user_id: { _id, first_name }, completed_at: Date, ... }`) before assertions

### Next session recommendation

**Push** — local `development` is **2 commits ahead** of origin/development (#224 close + this hotfix). Awaiting user green-light per safety protocol. **Render env action owed before push lands fix on pre-prod**: set `APP_URL=https://karvia-business-2.onrender.com` on `karvia-business-2` service AND verify `APP_URL=https://karvia-business.onrender.com` on production. Without this env var, the production-fail-fast check will refuse to boot.

After push + env-action: `/coding` Sprint 26 Day 2 (same Day-2 unblockers from #224 close — A.1 / C.2 / C.5 / B.3) OR `/testing` for preflight Q9.

---

## /close — 2026-05-12 (#225 — 4 user-surfaced bugs caught, 3 shipped; SSI canonical shape contract locked)

**Session in arc**: /init #225 → /coding-hotfix (4 audit IDs shipped + 5-finding routing/scoring audit delivered) → /close. **Quality 8/10. Token usage ~165K. Three commits. S26 firing UNCHANGED at 4/24** (today's work is governance-scoped: 2 hotfixes + 1 contract addition + 1 carved-out display slice + audit findings for next session).

### Shipped (3 commits, 4 audit IDs)

| Commit | Audit IDs | One-liner | Tests |
|---|---|---|---|
| `cfca7d6` | A20260512-13 + A20260512-14 | EMAIL_DEEP_LINK_CONTRACT enforcement (7 banned env reads → APP_URL only + boot fail-fast) **AND** Team Results latest-per-user dedup (Q12 display-slice carve-out) | 18/18 + 16/16 ✓ |
| `29033f4` | A20260512-15 | Existing-user invitation → login → assessment-take with token preserved (BE `user_exists` flag + FE early-redirect interstitial + FE safety net) | 17/17 ✓ |
| `5cad710` | A20260512-17 | `UnifiedSSIScoringService.toCanonicalShape(ssiResult)` — locked 0-10-uniform contract for 12 MECE categories + 3 dimensions + overall + ratings; submit-flow migrated to attach `canonical` | 59/59 ✓ |
| **Regression sweep** | E.1 + E.4 + consultant-reads | | 32+29+55 ✓ |
| **Total** | | | **226/226 ✓** |

### 5-finding routing/scoring audit (delivered, partial implementation)

User direction "first audit, find out how it is, and then we will do surgical improvements" honored. Findings (no code at audit time):

- **F1** `assessment-results.html` is a per-user dead-end (no role-based routing to team-ssi-view.html for Mgr/BO/Exec/Consultant)
- **F2** `team-ssi-view.html` access control is already correct (MANAGER/EXECUTIVE/BO/CONSULTANT only); discrepancy is **routing**, not access — nothing leads users there organically after taking assessment
- **F3** **TWO scoring services run side-by-side on every submit** ([routes/assessments.js:294-305](../../../../server/routes/assessments.js#L294-L305)) — legacy `SSIScoringService.calculateScores` + canonical `UnifiedSSIScoringService.calculateSSI`. Inventory: 4 SSI-domain services across `server/services/` + `server/services/diagnostic/`
- **F4** Q12 canonical-rollup gap (already deferred via A20260512-11, cross-link only)
- **F5** EMAIL_DEEP_LINK_CONTRACT row 2 URL drift (`assessment.html?token=` per contract vs actual `assessment-take.html?invitation_token=`)

**Audit IDs proposed**: A20260512-16(a) (FE CTA on assessment-results → team-ssi-view), A20260512-17 (canonical shape contract — **SHIPPED this session**), A20260512-18 (doc-only contract URL fix).

### Four user-surfaced findings this session

1. **Consultant auth alert on team-ssi-view** ("You are not authorized to view this client's assessments") → diagnosed as **false positive**: stale `karvia_user.managed_businesses` in localStorage; re-login fixes. Not opened as audit ID.
2. **Broken invitation email link on pre-prod** (`localhost:3000/...` in customer inbox) → `A20260512-13` shipped.
3. **Team Results stacks historical retakes per user** (same "Manager Regtest" listed twice with different SSI scores) → `A20260512-14` shipped.
4. **Existing-user invitation forces signup form** ("Complete Your Account" name+password fields blocking 100% of S26 team-invite acceptance) → `A20260512-15` shipped.

### Façade overreach caught + new memory saved

Original `A20260512-17` proposal was new `SSIService.js` + `scoring-frameworks/` folder + registry + adapter pattern. User pushback: *"Try to reevaluate this task by using the unified scoring surface. Can we achieve what I am asking by using existing what we have? I think we can. We don't need to build anything new."* Honest re-eval showed 90% of value lived in ~40 LoC on the existing canonical service. Shrank to ONE additive method.

**NEW memory** `feedback_extend_before_wrap.md` saved this session — "When an existing canonical service is missing 2-3 methods, ADD them to it. Don't draft a new façade/registry/adapter when extending would do." Prevents recurrence next session.

### S26 scope impact

**Zero**. 24 firing tasks unchanged (still 4/24 closed from #224). Today's 4 audit IDs are governance-scoped hotfixes + contract addition, NOT new firing tasks per page matrix.

### Carry into next session

1. **Render env vars** owed BEFORE pushing — set `APP_URL` on all 3 services (`karvia-business-1`, `karvia-business-2` ✓ already confirmed, `karvia-business`). Boot fail-fast will refuse production startup if APP_URL unset.
2. **Push status**: `development` is **4 commits ahead** of origin/development (`cfca7d6`, `29033f4`, `5cad710`, plus stale `2e4332d` lock-file delete from prior).
3. **My-clients tile shows `—` for SSI despite "4/4 assessed"** (screenshot evidence from this session) — likely separate audit ID e.g. `A20260512-19`, natural tier-1 canonical-shape consumer migration. **NOT minted with stable ID this session** (lesson candidate for next handoff governance).
4. **A20260512-16(a)** — FE CTA on assessment-results.html for Mgr/BO/Exec/Consultant pointing to team-ssi-view.html (~25 LoC).
5. **A20260512-18** — EMAIL_DEEP_LINK_CONTRACT row 2 URL drift doc fix (~3 LoC).
6. **Preflight Q9** still outstanding (15-min manual smoke on `karvia-business-1`) — flips Beta gate `SEC-7 🟢`.
7. **Tier 2/3 canonical-shape consumer migrations** — team-ssi-view tabs, assessment-results page, /dashboard-summary, /company-results, /team-breakdown. Each migration verified against its FE caller before flipping. CLEANUP-TARGET markers ride alongside.

### Next session recommendation

**`/coding` Sprint 26 Day 2** — Tier-1 my-clients migration (~30 LoC + test) + A20260512-16(a) FE CTA (~25 LoC) + A20260512-18 doc fix (~3 LoC). Estimated 60-90 min. Alternative: push first + `/testing` for Preflight Q9 (15 min) to flip SEC-7 🟢 before further code.

### Memory rules honored

- `feedback_minimal_change_grounding` — verified 0-10 magnitude feasibility from `blocks.*.score` before claiming, didn't expand scope on user pushback
- `feedback_reuse_max` — after pushback, extended existing service instead of new file
- `feedback_extend_before_wrap` — **NEW this session** — captured the façade-overreach lesson
- `feedback_no_destructive_without_greenlight` — surfaced 5 yes/no questions on -17 + 2 yes/no on -16; awaited "lets go with b" before single-consumer migration; -16 + -18 proposed but NOT executed
- `feedback_audit_governance` — 4 audit IDs minted with 3-stage tracking in AUDIT_TRACKER (batch heading 8 → 10 → 11 → 12) + handoff mirror + commit citations
- `feedback_test_fixture_validation` — read AssessmentTemplate.dimensions + User.status enum 'pending_invite' before fixing tests + fabricated ObjectId for unused ref
- `feedback_cleanup_boundary_pattern` — Q12 display-slice carved out via -14 with REFINEMENT-BACKLOG cross-link
