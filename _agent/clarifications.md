# Clarifications

Questions from the agent to the human. When the agent hits ambiguity, it asks here instead of guessing.

Format:

```
## <ID> — <short title>
**Asked**: YYYY-MM-DD by <tick-id>
**Context**: what the agent was trying to do
**Question**: precise, answerable question
**Options the agent sees**: (optional) a, b, c
**Status**: OPEN | ANSWERED — see DECISIONS.md
**Answer**: (filled by human)
```

---

## C-001 — Nexus scope: narrow (consultant SaaS) or broad (transformation OS)?

**Asked**: 2026-06-03 by bootstrap
**Context**: Phase 3 of Night 1 writes positioning docs (0-BUSINESS, 1-PRODUCT). Two different scope framings are on the table:

**Question**: Which is canonical for Nexus v1 positioning?

**Options the agent sees**:
- **a) Narrow** (from conversation): "SaaS for consultants running AI Readiness & Transformation engagements." Consultant is the buyer + primary user; client orgs are tenants under the consultant.
- **b) Broad** (from GitHub repo description): "Multi-tenant AI-powered platform for organizations to assess AI readiness, govern transformation programs, manage strategic initiatives, capture institutional knowledge, drive accountability, and measure business outcomes." Organization is the buyer directly; no necessary consultant in the loop.
- **c) Both** (most likely intent): Consultant-led delivery is the primary GTM motion, but the platform itself can be sold direct to organizations. Positioning docs lead with consultants; capabilities docs describe both modes.

**Status**: ANSWERED — see DECISIONS.md 2026-06-03
**Answer**: Transformation OS (broad scope). Lego-block architecture is the reason.

---

## C-002 — Karvia git history contains real production credentials

**Asked**: 2026-06-03 by tick N1-P1-01
**Context**: Tick N1-P1-01 scanned the Karvia doc snapshot for secrets and found 26 files containing **live production credentials** in plain text: OpenAI service account key, Mailjet API key+secret, JWT_SECRET, SESSION_SECRET, and MongoDB connection strings. Redacted in `_source/` before commit to Nexus; Karvia's own files untouched but contain these in committed git history.

**Question**: Do you want a follow-up plan to clean Karvia's git history?

**Options the agent sees**:
- **a) Rotate creds, leave history** — fastest. Once rotated, the historical strings become inert.
- **b) Rotate + purge history** — invasive. `git filter-repo` to scrub every commit. Required if Karvia is or becomes public.
- **c) Do nothing** — not recommended unless creds are already known-rotated.

**Status**: ANSWERED — see DECISIONS.md 2026-06-03
**Answer**: Rotate credentials only; do not purge history. Owner: human (not the agent).

---

## C-003 — Consolidate engines into main server, or genuinely deploy them?

**Asked**: 2026-06-03 by tick N1-P2-01
**Context**: Karvia has 10 engines (separate Node processes locally) but Render only runs the main server + IAM sidecar. The other 8 engines are dead in production. Nexus must pick one path before Night 2's refactor.

**Question**: For Nexus v1, do we consolidate engines into the main server process (matching the actual Render deployment), or deploy them as real separate services?

**Options the agent sees**:
- **a) Consolidate** — single Express app with module boundaries enforced by TS contracts, not process boundaries. Lowest ops overhead. Recommended for v1.
- **b) Genuinely deploy** — each engine becomes its own Render service with its own URL. Higher cost, real service isolation, but premature for current load.
- **c) Hybrid** — main server + a few high-value sidecars (e.g., AI work, scheduled jobs) split out, rest consolidated.

**Status**: ANSWERED — see DECISIONS.md 2026-06-04
**Answer**: Consolidate. Single Express app; module boundaries enforced by TS contracts + ESLint, not process boundaries.

---

## C-004 — Move to TypeScript in Night 2, or stay JS?

**Asked**: 2026-06-03 by tick N1-P2-01
**Context**: Module contracts are the core of the lego-block architecture. TypeScript interfaces enforce them at compile time; JS + JSDoc enforces them by convention only. The TS migration has up-front cost.

**Question**: Server-side language for Nexus modules?

**Options the agent sees**:
- **a) TypeScript** — adds setup cost in Night 2 but enforces contracts mechanically. Strongly recommended for an autonomous-agent codebase (the agent makes type errors humans wouldn't).
- **b) JS + strict JSDoc** — lower migration cost, weaker enforcement, agent will drift.
- **c) Gradual** — TS for new modules (governance, knowledge, ai-readiness), JS for lifted Karvia modules until they're touched.

**Status**: ANSWERED — see DECISIONS.md 2026-06-04
**Answer**: TypeScript in strict mode for all server code. Client stays vanilla JS for v1. `pnpm` for workspaces.

---

## C-005 — Introduce `Program` as a new top-level tenant key?

**Asked**: 2026-06-03 by tick N1-P2-01
**Context**: Karvia's tenancy is `Company → User → Objective`. To support Transformation OS (multiple transformation programs per org running concurrently), Nexus likely needs `Company → Program → Objective`. This is a non-trivial data model change touching every domain model.

**Question**: Add `Program` as a first-class entity, with `Objective.program_id`, `Assessment.program_id`, etc.?

**Options the agent sees**:
- **a) Yes — add Program** — proper modeling for the multi-program-per-org case. Required for the Transformation OS positioning to be real, not aspirational.
- **b) Defer** — start with one implicit program per org, retrofit later. Faster v1 but locks in a single-program assumption.
- **c) Tag, not entity** — use a `program: string` field on existing models, no separate collection. Lightest weight, fragile.

**Status**: ANSWERED — see DECISIONS.md 2026-06-04
**Answer**: Yes. `Program` is a first-class top-level entity. `Company → Program → Objective`. Every domain doc gains `program_id`. Users get `program_memberships[]`.


---

## C-008 — Goal (quarterly) and Move layers: lift, fold, or drop?

**Asked**: 2026-06-09 by session N1-P2-02 (data models catalogue)
**Context**: Karvia's code-truth hierarchy is `Objective → KeyResult → Goal (quarterly, self-nesting) → WeeklyGoal → Move`, and `Task` requires `goal_id` (Task hangs off Goal, parallel to the WeeklyGoal branch). But the Nexus strategy docs (TECH_STRATEGY roll-up engine, PRODUCT_STRATEGY value chain) describe the compressed chain `Task → WeeklyGoal/Milestone → KR → Objective` — no Goal, no Move. IMPROVEMENT_PLAN's parking lot says "don't redesign the domain," which cuts both ways.

**Question**: For Nexus v1, what happens to the Goal (quarterly) and Move (habit) layers?

**Options the agent sees**:
- **a) Fold** — Goal's quarterly grouping becomes a property of WeeklyGoal/planning (quarter tags on KRs already exist: `KeyResult.quarters[]`); Task re-parents to WeeklyGoal; Move folds into Task (move_type/frequency become Task fields). Matches the strategy docs; one migration; simpler roll-up. **Recommended.**
- **b) Lift all** — keep Goal + Move as Nexus modules/fields; update TECH_STRATEGY's roll-up chain to 6 levels. Most faithful to "don't redesign the domain," but adds a layer the 6-page UI never surfaces.
- **c) Defer Move only** — fold Goal (a), park Move as a post-beta habit feature.

**Status**: ANSWERED — see DECISIONS.md 2026-06-09 (C-008/NOF)
**Answer**: Neither lift nor simple fold — the **Nexus Objective Framework (NOF)**: Objective → KRs → **Milestones (~1 week, objective-relative)** → Tasks. Goal and Move are dropped; all calendar coupling (ISO weeks, quarters[]) removed; objectives start/end any day, 6–7 self-rolling per org. KRs measure progress; an **outcome record** at objective close measures outcomes. Full spec: `NEXUS_STRATEGY/1-PRODUCT/NOF.md`.
