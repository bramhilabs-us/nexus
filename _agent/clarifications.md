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
**Answer**: (resolved)

<<<<<<< Updated upstream
=======
---

## C-002 — Karvia git history contains real MongoDB credentials

**Asked**: 2026-06-03 by tick N1-P1-01
**Context**: Tick N1-P1-01 scanned the Karvia doc snapshot for secrets and found 24 markdown files with hardcoded `mongodb+srv://user:pass@host` strings — including what look like real production credentials (`rsm_db_user:DcootoIfBIqL20uA@cluster0.lpzcrvy.mongodb.net`). These were redacted in `_source/` before committing to Nexus. **Nexus is safe.** But Karvia's own committed git history still contains these strings.

**Question**: Do you want a follow-up plan to clean Karvia's git history?

**Options the agent sees**:
- **a) Rotate creds, leave history** — fastest. Rotate the affected Mongo user passwords; the history strings become inert. Recommended unless the repo is public or shared externally.
- **b) Rotate + purge history** — invasive. Use `git filter-repo` to scrub the strings from every commit. Forces every collaborator to re-clone. Required if Karvia is or will be public.
- **c) Do nothing** — not recommended unless these credentials are already known-rotated and unused.

**Status**: ANSWERED — see DECISIONS.md 2026-06-03
**Answer**: (resolved)

>>>>>>> Stashed changes
