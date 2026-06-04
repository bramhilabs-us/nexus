# `_source/` — Frozen Karvia Reference

**Status**: Frozen reference. Do not edit. Do not write to.
**Origin**: `/Users/sagarrs/Desktop/official_dev/karvia_business`
**Snapshot taken**: 2026-06-03 (tick N1-P1-01)
**Karvia commit at snapshot**: see Karvia's own git log; not tracked here.

---

## What's in here

| Folder | Origin |
|---|---|
| `KARVIA_STRATEGY/` | `karvia_business/KARVIA_STRATEGY/` |
| `karvia_claude/` | `karvia_business/.claude/` (excluding `settings.local.json`) |
| `docs/` | `karvia_business/docs/` (files > 500KB excluded) |
| `OKR_Product_Planning/` | `karvia_business/Karvia_OKR_Product_Planning/` |
| `iBRAIN_Integration/` | `karvia_business/iBRAIN_Integration/` |
| `karvia_root/` | top-level MDs: README, CLAUDE, CLAUDE_STRATEGY, ECOSYSTEM_ARCHITECTURE, DEPLOYMENT_RUNBOOK |

## What was excluded

- `.env`, `.env.preprod`, `.env.production`, `.env.example`, `.env.production.example` (potential secrets)
- `node_modules/`, `logs/`, `.snapshots/`, `test-results/`, `playwright-report/`
- `.git/`
- `YSELA/`, `bramhi/`, `Karvia_OKR_Mockups/` (ecosystem cross-content unrelated to Nexus)
- `.DS_Store` files
- Files larger than 500KB inside `docs/`

## Security redactions applied

The snapshot tick scanned for credential patterns and redacted matches **in this `_source/` copy only**. Karvia's original files are bit-identical and untouched.

Pattern redacted: `mongodb+srv://[REDACTED]:[REDACTED]@HOST` → `mongodb+srv://[REDACTED]:[REDACTED]@HOST`

Affected files: 24 (mostly archived sprint docs in `KARVIA_STRATEGY/ARCHIVE/SPRINTS/SPRINT-2/` and `OKR_Product_Planning/`).

### ⚠️ Action recommended for Karvia separately

The original Karvia repository has these credentials in its committed git history. Rotate the affected MongoDB credentials and consider purging them from Karvia's history (BFG repo-cleaner or `git filter-repo`). This is independent of Nexus and tracked in `_agent/clarifications.md` C-002.

## How Nexus uses `_source/`

- `NEXUS_STRATEGY/` docs are written by reading `_source/` and adapting for Nexus's positioning.
- `_source/` is the source of truth for "what did Karvia say about X" — `NEXUS_STRATEGY/` is the source of truth for "what does Nexus say about X."
- When a Nexus doc adapts a Karvia doc, link the source: `[Karvia equivalent](../../_source/path/to/file.md)`.
