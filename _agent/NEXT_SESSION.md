# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (CSS tokens — first code artifact)
**Task**: `N1-P2-07` — Design tokens from the Brandguide (Path B)
**Why it's next**: module graph done (N1-P2-04 ✓, tick 2026-06-09-09) — Path B queue ratified 2026-06-09 says tokens come next, and SESSION_PRACTICES rule 3 (tokens before mockups) gates N1-P2-08 on this.

**Queue (Path B)**: this session → `N1-P2-08` six page mockups (2–3 sessions, founder review checkpoint) → resume Night 1 remainder (N1-P2-03 API surface, N1-P3-01, N1-P4-01 — which now has all three technical inputs).

**Cards to draw**:
- `NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md` — palette/typography rules + § Reference visuals (extracted deck cues) + the declared token-table placeholder
- `NEXUS_STRATEGY/1-PRODUCT/design/brand/` — Brandguide assets (source of truth for hex values)
- `NEXUS_STRATEGY/1-PRODUCT/design/references/` — the two investor decks (gradient near-white surfaces, purple-tinted shadows, slate text hierarchy, gold sparingly, 8px radius)

**Definition of done** (per BACKLOG N1-P2-07):
- `client/css/tokens.css` — semantic tokens (`--nx-primary`, `--nx-ink`, `--nx-surface`, type/spacing/radius scales) from Brandguide + reference cues
- Comfortaa vs Cinzel/Inter type question resolved and recorded
- Hex/scale table recorded in DESIGN_LANGUAGE.md (fills its placeholder)
- Zero inline hex from here on; tokens are the only color source
- Graph: client/README.md already a governed node — tokens.css needs no genome, but DESIGN_LANGUAGE's update bumps `updated:`; validator green

**Watch out for**:
- SESSION_PRACTICES rule 3 is the whole point: token first, reference second, no inline hex ever
- The brand assets are files, not docs — extract values, don't guess from memory
- If Comfortaa vs brand-fonts can't be resolved from the assets alone, it's a founder call → clarifications (PQ-style), pick sensible default, flag in PR
- Level 0: open PR, don't merge; check `gh pr list` first — if this task's PR is already open and unmerged, skip to the next READY item without an open PR
