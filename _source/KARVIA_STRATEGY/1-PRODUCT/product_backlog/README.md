# Product Backlog

<!-- @GENOME T3-NAV-001 | ACTIVE | 2026-04-01 | parent:T2-PRD-044 | auto:- | linked:/strategy -->

**Purpose**: Centralized product backlog management for YSELA/Karvia.

**Last Updated**: April 1, 2026

---

## Files

| File | Purpose | When to Use |
|------|---------|-------------|
| [IDEAS.md](IDEAS.md) | Raw ideas, research, explorations | Adding new ideas before validation |
| [MASTER_PRODUCT_BACKLOG.md](MASTER_PRODUCT_BACKLOG.md) | Validated features, tech debt, roadmap | Sprint planning, prioritization |
| [archive/](archive/) | Archived/stale files | Historical reference only |

---

## Workflow

```
┌──────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   IDEAS.md   │ ──► │ MASTER_PRODUCT_      │ ──► │   Sprint    │
│  (Raw ideas) │     │ BACKLOG.md           │     │   Plans     │
│              │     │ (Validated features) │     │             │
└──────────────┘     └──────────────────────┘     └─────────────┘
     NEW                   BACKLOG/PLANNED            IN_SPRINT
```

---

## Quick Reference

### Add a New Idea

1. Open [IDEAS.md](IDEAS.md)
2. Add under "Active Ideas" using the template
3. Set status to `NEW`

### Promote Idea to Backlog

1. Change idea status to `VALIDATED`
2. Add to [MASTER_PRODUCT_BACKLOG.md](MASTER_PRODUCT_BACKLOG.md) in appropriate priority section
3. Move idea to "Validated & Delivered" section

### Assign to Sprint

1. Update item status to `PLANNED` with sprint number
2. Create detailed specs in sprint folder

---

## Related Documents

| Document | Location |
|----------|----------|
| Beta Roadmap | `../roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md` |
| Issue Tracker | `../../3-DELIVERY/6-ISSUES/` |
| Sprint Plans | `../../3-DELIVERY/1-SPRINTS/` |

---

## Maintenance Schedule

| Frequency | Action |
|-----------|--------|
| Weekly | Triage user feedback → IDEAS.md |
| After Sprint | Move DONE items to Delivered section |
| Quarterly | Archive old items, clean up |
