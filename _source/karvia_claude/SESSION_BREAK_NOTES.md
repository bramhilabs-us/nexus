# Session Break Notes — 2026-05-30 → next session

**Created**: 2026-05-30 (end of /strategy session on BRAMHI Engineering KPIs)
**Read by**: `/init` at next session start (per CLAUDE.md `.claude/` discovery)
**Delete after**: action item below is closed.

---

## 🔔 Top reminder for next session

**Review the BRAMHI Engineering KPIs white-paper draft (doc 01).**

- File: [YSELA/RESEARCH/white-papers/bramhi-engineering-kpis/01-evaluation-of-bramhi-kpis.md](../YSELA/RESEARCH/white-papers/bramhi-engineering-kpis/01-evaluation-of-bramhi-kpis.md)
- Status: drafted, awaiting user review
- Length: 302 lines · ~3,500 words
- Why deferred: user wanted to read it carefully tomorrow rather than mid-session.

**Action sequence**:
1. User reads doc 01 top-to-bottom
2. User flags edits (tone, citation choices, DORA critique sharpness, anything missing)
3. Apply edits
4. Then draft companion **doc 02** (`02-bramhi-engineering-kpi-framework-v2.md`) — the corrected framework with formulas, falsifiability conditions per metric, Replication Kit, worked example, honest limitations
5. Commit + push both docs together (development → optional merge to main if we want them on GH Pages later)

---

## Uncommitted working-tree state (carry-forward)

On `development` branch:

```
M  .gitignore                                                       — added BRAMHI exceptions (docs/ + YSELA white-papers/)
?? YSELA/RESEARCH/white-papers/bramhi-engineering-kpis/             — new folder + doc 01 (untracked, exception working)
```

These two changes belong together — commit them as one when doc 01 is approved (and ideally as part of the doc 01 + doc 02 bundle commit).

`.gitignore` exception added at lines 127–130 (development branch):
```
!docs/bramhi-*.html
!YSELA/RESEARCH/white-papers/bramhi-*/
!YSELA/RESEARCH/white-papers/bramhi-*/**
```

(Same pattern as `main` branch — `main` only has the `docs/` line because that's all it needed for the live page.)

---

## What was shipped this session (already committed + pushed)

**Branch**: `main` · **Commit**: `897e007` · **Pushed to**: `origin/main` (auto-deploys to GH Pages)

BRAMHI KPI framework v2 restructure on the live roadmap:
- 4 dimension blocks: Velocity · Quality · Knowledge · Meta
- 11 KPIs (was 8) — added MCR, ACL, MOR; CCS reframed as infrastructure proxy
- New TOR basis: $14.80/audit-ID (subscription paid ~$1,850)
- Direction badges ▲ ▼ ◆ + neutral range styling for "no baseline yet"
- Unit-disambiguated values (0.46 audit-IDs/session, 5.23 references/ID, etc.)
- Brand: KARVIA · MEASURED → BRAMHI · MEASURED (top-brand consistency)
- Karvia/Ysela provenance line added
- New glossary page: `docs/bramhi-kpi-glossary.html` (plain-English per-KPI definitions)

**Live URLs** (verify after first /init tomorrow):
- https://myrhydm.github.io/karvia-business/production-readiness-roadmap.html
- https://myrhydm.github.io/karvia-business/bramhi-kpi-glossary.html

---

## Context for tomorrow's session

**This session was**: `/strategy` on engineering-KPI architecture — per user direction at /close of #269 ("focus on some architectural discussion on the KPI's to measure tokens"). The conversation evolved from token-cost measurement into a full framework critique and rebuild.

**Memory rules that drove the session** (cite by name if continuing the same thread):
- `feedback_why_what_how_when` — Why before What; surfaced the measurement paradox before defining metrics
- `feedback_minimal_change_grounding` — kept fixes incremental; didn't redesign BRAMHI v1, audited and patched it
- `feedback_reuse_max` — Knowledge dimension metrics (MCR, ACL) use signals Karvia already produces (SESSION_LOG citations, AUDIT_TRACKER references), no new instrumentation
- `feedback_quote_the_canon` — direct verbatim quotes from Goodhart, Strathern, DeMarco 2009, SPACE paper in white paper
- `feedback_no_destructive_without_greenlight` — every page edit and .gitignore change presented for greenlight before applying
- `project_bramhi_labs_factory_model` — brand stack BRAMHI → Karvia → Ysela honored in page text

**Suspended / deprioritized** (per session-start direction):
- S27 Phase 2 coding (A20260530-03..-06)
- E.1a wizard fresh-review
- 6-gate /testing re-walk

All remain ready to resume after the KPI white-paper work completes.

---

## Suggested /init opening for tomorrow

After standard /init pre-flight, surface this banner near the top of the state summary:

> 🔔 **Carry-over from yesterday**: BRAMHI Engineering KPIs white-paper doc 01 awaits review. File: `YSELA/RESEARCH/white-papers/bramhi-engineering-kpis/01-evaluation-of-bramhi-kpis.md`. Once reviewed and edits applied, draft doc 02 (framework v2) and commit both together.
