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

