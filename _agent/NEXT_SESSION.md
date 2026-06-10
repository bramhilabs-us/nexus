# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: coding (mockups — first visible product) — **with a Level-0 gate, read first**
**Task**: `N1-P2-08` — Six page mockups, session 1 of 2–3 (static HTML, token-first)
**Gate**: N1-P2-08 consumes `client/css/tokens.css`, which lives on **PR #14 (unmerged)**. Run `gh pr list` first:
- **#14 merged** → proceed with N1-P2-08 below.
- **#14 still open** → mockups are blocked on in-flight work; pick `N1-P2-05` — User journeys instead (READY, depends only on merged N1-P1-01; DoD: 4 journeys with numbered steps + Mermaid sequence diagrams in `NEXUS_STRATEGY/2-TECHNICAL/USER_JOURNEYS.md`; draw PRODUCT_STRATEGY journeys + page contracts, NOF.md, AI_CONSULTING_PLAYBOOK). Do NOT start mockups without tokens — inline hex is the exact failure SESSION_PRACTICES rule 3 exists to prevent.
- Also in-flight: PR for tick-11 (API_SURFACE) — N1-P4-01 cites its tables, so N1-P4-01 is blocked until that merges too.

**Queue (Path B)**: mockups (2–3 sessions, founder review checkpoint) → Night 1 remainder (N1-P3-01, N1-P4-01 — P4-01 needs API_SURFACE merged).

**N1-P2-08 session-1 scope** (when unblocked):
- The shared shell: nav, account dropdown with the 5 secondary surfaces (Profile, Company Profile, Configuration, Settings, Feedback), page scaffold consuming `var(--nx-*)` only
- 2–3 Engagement-mode pages (e.g., My Clients, Dashboard) against their page contracts
- Later sessions: remaining pages + Builder variants, Profile player card, assessment flashcard deck (PQ-4)

**Cards to draw (mockups)**:
- `client/css/tokens.css` — the only color/type/space source; zero inline hex (review-blocking)
- `NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md` — § Token table, component set, minimalism rules
- `NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md` — page contracts (one dominant CTA, ≤4 tiles, empty states), § player cards, § assessment delivery experience
- `NEXUS_STRATEGY/1-PRODUCT/design/references/` — the two decks for feel

**Definition of done (mockups slice)**:
- Mockups in `NEXUS_STRATEGY/1-PRODUCT/design/mockups/`, `var(--token)` only; each implements its page contract exactly
- `grep -rE '#[0-9a-fA-F]{3,6}' mockups/` returns nothing before commit
- Fonts: Inter UI; Playfair display moments only; Cinzel/Cormorant never in app chrome
- Graph: if mockups/ gains a governed node, wire parents (DESIGN_LANGUAGE) + validator green

**Watch out for**:
- Throwaway quality NOT acceptable — these are the Night 3 spec (Karvia lesson #174-3)
- Level 0: open PR, don't merge; never stack onto an unmerged branch
- Morning human TODO: merge PR #13 (settings), #14 (tokens), and the tick-11 API_SURFACE PR to unblock the queue
