# Lessons Learned

<!-- @GENOME T3-SES-LL1 | ACTIVE | 2026-04-28 | parent:T0-SES-001 | auto:/init,/strategy,/audit,/design | linked:/coding -->

**Purpose**: Cross-session insights worth carrying forward. Process patterns, anti-patterns, audit heuristics — not code recipes.
**Read at**: session start (especially before /strategy, /audit, /design — where the same mistakes repeat without these reminders).

---

## How to use this file

- Add a new section per session that produced a generalizable insight. Skip sessions where the lesson is project-specific or already in code.
- Each entry: **lesson**, **trigger** (what made the issue surface), **rule** (what to do next time), **counter-example** (when the rule does NOT apply).
- Keep entries terse. If a lesson hasn't paid off in 3 sessions, prune it.

---

## Session #174 — April 28, 2026 (Design / Pre-Sprint Cleanup)

### 1. Handoff brainstorm > Epic spec when they conflict

**Lesson**: Epic spec docs (`epics/EPIC_*.md`) can lag behind the canonical design decision recorded in the sprint handoff. In Session #174 the Add Client wizard had two contradicting source-of-truth docs:
- Epic C §5: 3-step manual form (stale, written first)
- Handoff lines 462, 482, 621, 627, 635-636: 2-step AI auto-fill (Session #167 brainstorm — actual decision)

**Trigger**: User asked "didn't we have add-client with much more features like pulling the company info from llm?" — caught a mockup built off the stale epic spec.

**Rule (apply during /audit, /design, /coding)**:
- Before treating an Epic §X as authoritative, grep the **sprint handoff** for the same feature name. The handoff records the decision; the epic file is the implementation translation that may not have been updated.
- If they differ, the handoff/brainstorm wins. Update the epic file, don't follow the stale version.
- Especially watch: wizard step counts, AI/LLM scope, field lists, redirect rules, modal vs page decisions — these change in design discussion and forget to propagate.

**Counter-example**: For backend-only items (data model shapes, API contracts), the epic spec is usually authoritative because backend decisions are made directly in the spec, not in handoff brainstorm tables.

---

### 2. Scope-drift via "fold" without budget update

**Lesson**: When an epic is "merged into" another (Sprint 22's *"Epic H merged into Epic G for scope efficiency"*), the master plan total often does not adjust correctly. Epic H's 5pts disappeared from the table while Epic D's 8pts also got dropped — total stayed at 61pts but actual work was 74pts. The scope was understated by 13pts entering implementation.

**Trigger**: Re-evaluation requested by user revealed master plan total of 61 didn't include Epic D (in scope per handoff + execution order) or Epic H (which had its own file).

**Rule (apply during /strategy, /init scope review)**:
- When a master plan says *"Epic X merged into Epic Y"*, verify three things:
  1. The combined points line in the table reflects both (e.g., G+H = 10, not just G = 5).
  2. The merged epic file is either deleted or carries an explicit *"budget billed under Epic Y"* note in its header.
  3. The sprint total = sum of the table rows (do the arithmetic, don't trust the labelled total).
- "Folded budget" is fine when documented; "silently dropped from total" is the failure mode.

**Counter-example**: Mid-sprint epic deletions (Epic cancelled, not merged) should reduce the total. Only "fold" requires this check.

---

### 3. Define design tokens BEFORE mockups reference them

**Lesson**: The mockups referenced `--s22-navy` and `--s22-gold` for weeks before those tokens existed in `client/css/s13-patterns.css`. Mockups rendered fine because authors hardcoded the hex inline as a fallback, but this defeated the point of CSS variables — there was no propagation guarantee, and the canonical value drifted (assessment-hub used `#1e3a5f` while planning used `#1F2937`).

**Trigger**: Verification grep across mockups showed inconsistent Navy hex values. Each mockup author had picked their own fallback.

**Rule (apply during /design)**:
- Step 1 of any new theme work: add the tokens to `client/css/s13-patterns.css` (purely additive — zero impact on live pages).
- Step 2: mockups link `<link rel="stylesheet" href="…/s13-patterns.css">` and use `var(--token-name)`. No inline hex except for one-off accents not worth a token.
- Step 3 (during the implementing /coding session): alias old tokens to new (`--karvia-primary: var(--s22-navy)`) so live pages adopt automatically.
- Tokens-then-mockups, never mockups-then-tokens.

**Counter-example**: Throwaway mockups for stakeholder review (one-off pitches that won't be implemented) can use inline hex — no token discipline needed.

---

## Session #175 — April 29, 2026 (Strategy / Epic 0 Pre-Work)

### 1. Stress-test specs against live code BEFORE /coding, not during

**Lesson**: Sprint 22 specs were internally consistent within themselves but referenced fictional methods (`AIContextService.buildContext()`), missing service methods (`enrichCompany()` despite being depended on), files that didn't exist (`assessment-hub.js` listed MODIFY), and files that already existed (`objective-wizard.html` listed CREATE). Each individual spec passed review. The **integration** with the live codebase was where the rot lived.

**Trigger**: User asked "evaluate Epic C — make sure we have everything required" and probing existing code revealed 10+ P0/P1 mismatches that would have caused multi-day rework if discovered during implementation.

**Rule (apply during /strategy at sprint planning + before any /coding kickoff)**:
- After every sprint plan finalizes, run a "pre-work pass" that grounds each epic against the actual repo — not just against other epics.
- For every "EXISTING METHODS" claim, grep the file. For every "MODIFY existing" claim, `ls` the file. For every "depends on" claim, verify the method/endpoint actually exists or has a defined home.
- This is what Epic 0 was — 13 pts of work that prevented 30+ pts of rework.
- Make Epic 0 a permanent prefix to every sprint that mixes new+existing code.

**Counter-example**: Greenfield sprints with no existing-code touch (rare in this project) can skip — but those don't exist in beta-stage work.

---

### 2. Resolve cross-epic decisions in one batch, not piecemeal

**Lesson**: 59 cross-epic decisions surfaced during Epic 0 (e.g. "embedded `key_results[]` vs separate KeyResult collection"). If we'd resolved them one-at-a-time during /coding, each would have re-litigated context the others depend on, and decisions would have drifted (Epic A picks one path, Epic E picks another). Batching them into a single `DECISIONS_LOG.md` with proposed resolutions, then a single "approve all" sign-off, locked consistency in one pass.

**Trigger**: After Phase 1-4 of Epic 0 surfaced 59 gaps, user approved all in one go — making Phase 8 (epic patches) deterministic.

**Rule (apply during /strategy, /audit when finding multiple cross-cutting issues)**:
- Don't fix gaps inline as you find them. Surface them all to one log with proposed resolutions, get a batch decision, then patch.
- Each decision in the log must be self-contained (you must be able to read just one row and act on it) — no "see other decision".
- Use Decision IDs (`D-A-1`, `D-C-3`) and reference them in epic-spec comments (`per D-C-3`) so future readers can trace the why.

**Counter-example**: A single isolated issue with no other ripples can be fixed inline. Batching is overkill for a one-decision question.

---

### 3. Per-epic Inventory file separates spec drift from code drift

**Lesson**: An `INVENTORY_EPIC_X.md` that lists "Capability | Status (✅ exists / 🔧 extend / 🆕 new / ⚠️ conflict) | Existing | Action" surfaces gaps in 5 minutes that would otherwise hide for the entire sprint. The act of filling out "Existing" with file:line references is what catches the fictional-method problem (Epic B had no `buildContext` method — the act of trying to grep for it was the catch).

**Trigger**: Filling out INVENTORY_EPIC_B.md required reading `AIContextService.js` line-by-line. The mismatch was immediately obvious and previously invisible.

**Rule (apply during /strategy and /audit)**:
- Use the 4-column reuse-first matrix per epic. Don't accept "✅ exists" without a file path + line range. Don't accept "🔧 extend" without naming the existing method/route.
- Conflict column is the most valuable — it's where you list things you *can't* answer and need a decision for.

**Counter-example**: Tiny epic touching one file doesn't need a separate inventory; just note it inline in the epic spec.

---

## Session #176-178 — April 29, 2026 (Coding / Epics A+B+F)

### 4. Spec "fictional method" claims need a grep before you trust them

**Lesson**: Epic 0's prework asserted that `buildContext()` and `getActiveObjectives()` did not exist on AIContextService (D-B-1). When extending the file in Session #177, a `grep` showed `buildContext()` exists at line 739. The prework wasn't wrong about the *spec* — Epic B's earlier draft had wrongly claimed those methods as the entry point — but the *current code* has both `buildObjectiveContext` (legacy) and `buildContext` (newer). Trusting the prework verbatim would have caused me to either skip a working method or worse, replace it.
**Trigger**: Reading the existing 2095-line AIContextService while wiring up `assembleContext` as a sibling entry point.
**Rule (apply during /coding when extending an existing service)**: Before adding methods that "replace" or "supersede" existing ones, grep the file and reconcile with the spec. If the spec calls a method fictional and grep finds it, the spec is the older artifact — adopt the new method as a *sibling*, not a replacement.
**Counter-example**: New files / new services where there's nothing to reconcile against.

---

### 5. Append-after-class is the most common file-level edit bug

**Lesson**: When extending a long class file with new methods at the bottom, it's easy to land them after the class's closing `}` instead of inside. Methods become orphan async-function declarations and Node throws `SyntaxError: Unexpected identifier` at the first one. Session #178 hit this when extending aiOKRService — the original file had `}` then `module.exports`, and my new_string contained another `}` after the methods, so they fell outside the class.
**Trigger**: Edit replaced `module.exports = new AIOKRService();` with `[methods]\n}\n[EnrichUnavailableError]\nmodule.exports = ...`. The original `}` from the class body was still there above.
**Rule (apply during /coding for any "add methods to existing class" edit)**: After every multi-method append, run `node -c <file>` immediately. The fix pattern is to anchor the Edit's `old_string` on the class's *last existing method*, not on `module.exports`.
**Counter-example**: Single-method additions are usually too small to slip — bug scales with method count.

---

### 6. Smoke-test cache + fallback paths with mocked dependencies, don't wait for the integration test

**Lesson**: Session #178 shipped `enrichCompany` with a 24h cache and a 3s timeout — both failure-prone and both historically deferred to "first real consumer test it". Instead I monkey-patched `ai.openai = { chat: ... }` with a counter and verified: (a) 2 calls = 1 underlying call (cache hit), (b) `AbortError` → `EnrichUnavailableError("timeout")`, (c) generic errors → `EnrichUnavailableError(message)`. Same approach for AIContextService stable-key cache in Session #177. Took ~5 minutes to write, would have taken 30+ to debug live.
**Trigger**: The instinct to "ship the service, test it via the route" was tempting, but cache + timeout logic is precisely the kind of thing that fails silently in integration tests.
**Rule (apply during /coding when adding cache, retry, timeout, or graceful-degradation logic)**: Inject a fake dependency with a call counter and assert *call counts* across happy-path, cache-hit, error, and timeout. A broken cache returns the right answer the wrong way — only the count tells you.
**Counter-example**: Pure transforms (parsers, validators) don't need this — they have no side effects to count.

---

## Session #198-202 — May 6-7, 2026 (Coding / Sprint 24 Sessions A-E)

### 7. Read model validation rules BEFORE seeding test fixtures, every time

**Lesson**: Five sprint-24 coding sessions (#198, #199, #200, #201, #202) each lost ~3-5 minutes to test seed data hitting model validation errors at runtime. The errors were never about logic — they were about not knowing the contract: required fields (`Team.manager_name`), enum values (`Assessment.status` does not include `'pending'`), minlengths (`User.password_hash` ≥ 6), required `metric_type` on `KeyResult` (not `metric`), missing `objective_id` on `WeeklyGoal` (uses `key_result_id` only). Each time the lesson was logged in the handoff; each subsequent session hit a different field on a different model.
**Trigger**: The instinct to write test seeds inline based on prior similar tests, then iterate via test-runner errors. Each model's validation surface is just different enough that prior fixtures don't transfer cleanly.
**Rule (apply during /coding before writing any new test fixture)**: When seeding a model in an in-memory mongo test, FIRST `grep -nE "required|enum|minlength" server/models/<Model>.js` and read the schema's actual contract. If the test needs a parent in a hierarchy you don't actually depend on (e.g. seeding Move and Move only needs `weekly_goal_id` for tenant scope), use a fabricated `new mongoose.Types.ObjectId()` instead of seeding the full Objective→KR→WG chain.
**Counter-example**: Tests that re-use an existing test's seed-helper don't need this — the helper has already paid the validation tax.

### 8. Pre-coding scan IS the work, every coding session

**Lesson**: Sessions #198 through #202 each surfaced 3-4 spec ↔ reality drifts BEFORE writing any code, just by reading the spec alongside the relevant files (model schemas, route handlers, frontend controllers, prior session outputs). In every case the discoveries reshaped the implementation: backend already shipped (#200/#201 — zero-line work), spec named the wrong model (#201 — Move not Task), spec referenced phantom enum values (#198), sequencing inverted (#199/#202), card count drift (#202), KPI data sources missing (#202). Without the scan, each would have become mid-implementation rework.
**Trigger**: The pull to "just start coding from the spec" is strongest when the spec looks complete. The fact that #194 strategy docs are 3-7 days stale by the time #197+ coding starts is the root cause — code shipped in C/D between strategy and current session is the moving target.
**Rule (apply at the start of every /coding session, before any Edit)**: Spend the first 10-15% of token budget reading: (a) the epic spec, (b) the file paths it names — verify they exist and match (the path drift in #201 was a 5-second grep), (c) prior session handoff entries for shipped work that overlaps, (d) the data shape the spec assumes (e.g. did the upstream endpoint actually return that field?). Surface the drifts as a numbered list to the user before locking the plan. Pattern: "Pre-coding scan caught N spec ↔ reality items: …"
**Counter-example**: One-line bug fixes or pure refactors don't need this — there's no spec.

### 9. F-M-* invariants survive only with explicit verification per session

**Lesson**: Sprint 22a locked F-M-02 (dashboard-summary 5-cap) and F-M-06 (one-endpoint-per-tab) as architectural invariants. In #202 both were directly threatened — extending dashboard-summary's response could have added a query, extending /clients/:id/teams's payload could have created a sibling endpoint. Both were preserved by deliberate technique: dashboard-summary just added `lifecycle_stage` to an existing `.select()` and bucketed in-memory; teams batched 4 new aggregations under the same `Promise.all`. The 184a F-M-02 spy test still passed (≤7 round-trips). Without consciously naming the invariant in pre-coding scan, either could have slipped — the spec didn't repeat them.
**Trigger**: Sprint 24's epics are far enough downstream of the F-M-* lock that the spec authors didn't restate them. The invariants survived only because Session #202 explicitly checked them in the scan and the implementation discipline.
**Rule (apply during /coding for any work touching `/api/consultant/*` or any tabbed cockpit)**: List the relevant F-M-* invariants in the pre-coding scan output. Pattern: "Touching /clients/:id/teams → F-M-06 lives here. Plan keeps it intact via [technique]." If the implementation route requires breaking one, escalate to the user before coding.
**Counter-example**: Frontend-only or unrelated-domain work doesn't trigger this.

---

## Format for future entries

```markdown
## Session #N — YYYY-MM-DD (Type / Brief)

### N. One-line lesson title

**Lesson**: 2-3 sentences explaining what was learned.
**Trigger**: What caused this to surface in the session.
**Rule (apply during /command1, /command2)**: Concrete action for next time.
**Counter-example**: When this rule does NOT apply.
```
