# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (mockups — first visible product)
**Task**: `N1-P2-08` — Six page mockups, session 1 of 2–3 (static HTML, token-first)
**Why it's next**: tokens landed (N1-P2-07 ✓, tick 2026-06-09-10) — the Path B queue ratified 2026-06-09 puts mockups next; they are the founder review checkpoint that feeds N1-P4-01 contracts and becomes the Night 3 build spec.

**Queue (Path B)**: this session (+1–2 more mockup sessions, founder review checkpoint) → resume Night 1 remainder (N1-P2-03 API surface, N1-P3-01, N1-P4-01 — all three technical inputs ready).

**Session 1 scope suggestion** (size M, 2–3 sessions total — don't chain past one PR):
- The shared shell: nav, account dropdown with the 5 secondary surfaces (Profile, Company Profile, Configuration, Settings, Feedback), page scaffold consuming `var(--nx-*)` only
- 2–3 Engagement-mode pages (e.g., My Clients, Dashboard) against their page contracts
- Later sessions: remaining pages + Builder variants, Profile player card, assessment flashcard deck (PQ-4)

**Cards to draw**:
- `client/css/tokens.css` — the only color/type/space source; zero inline hex (review-blocking)
- `NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md` — § Token table, component set (Tile, Card, Stage ribbon, CTA pair, Empty state, Score ring, Flashcard), minimalism rules
- `NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md` — page contracts (one dominant CTA, ≤4 tiles, empty states), § player cards, § assessment delivery experience
- `NEXUS_STRATEGY/1-PRODUCT/design/references/` — the two decks for feel (spacing, surface, restraint)

**Definition of done** (per BACKLOG N1-P2-08, this session's slice):
- Mockups in `NEXUS_STRATEGY/1-PRODUCT/design/mockups/`, consuming `var(--token)` only
- Each implements its page contract exactly
- Graph: if mockups/ gains a README or governed node, wire parents (DESIGN_LANGUAGE) and run validator

**Watch out for**:
- Throwaway quality NOT acceptable — these are the Night 3 spec (Karvia lesson #174-3)
- No inline hex, ever — `grep -rE '#[0-9a-fA-F]{3,6}' mockups/` must return nothing before commit
- Fonts: Inter for UI; Playfair Display display moments only; Cinzel/Cormorant never in app chrome (DESIGN_LANGUAGE § Token table)
- Level 0: open PR, don't merge; check `gh pr list` first — if this task's PR is already open and unmerged, skip to the next READY item without an open PR
