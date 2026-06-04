# Sprint 28 — Handoff Document

<!-- @GENOME T3-SPR-028-HANDOFF | DRAFT | 2026-06-02 | parent:T3-SPR-028-MP | auto:/init,/close | linked:/sprint-review -->
<!-- 2026-06-02 — Lean pivot. Cross-repo mirror (Workstream C) + factory seams + test uplift moved to Sprint 31 (folder created). S28 trimmed to Workstream A (brand chrome) + B (email+domain) + new B' (karvia-business-2 lean repurpose + brand smoke test). Sprint Window 17-28h → 4-6h. Footer copy simplified to "Powered by BRAMHI Labs". -->

**Status**: 🟢 READY-TO-EXECUTE (post-S27 close) — lean-pivoted 2026-06-02; brand-chrome only
**Sprint Goal**: First user-facing rebrand to Ysela on www.ysela.ai via repurposed karvia-business-2 Render service. No cross-repo work; no new infra. Factory work deferred to [Sprint 31](../SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md).
**Sprint Window**: ~1 week calendar / **4–6h focused work** + 24h DNS propagation

---

## Launch Gate

**Sprint 26 close (FIRST):** ✅ CLEARED 2026-05-30 — 5-verb continuation acceptance test passes; Sprint 26 sealed via /sprint-review #269.

**Sprint 27 close (SECOND):**
- [ ] Sprint 27 E.1a/b/c/d wizard restructure shipped (currently 17/23 firing; 5 user-gated on wizard fresh-review)
- [ ] Sprint 27 E.9 regression suite green
- [ ] Sprint 27 `/close` executed

**Sequence**: Sprint 27 close → Sprint 28 lean kickoff. No parallel work across sprint boundaries.

---

## Workstreams (lean S28, 2026-06-02 pivot)

| Workstream | Slices | Status |
|---|---|---|
| **A — Brand chrome** (Ysela visible) | L.0 + L.1 + L.1a + L.1.5 | ⏳ Pending |
| **B — Email + domain + Render rebind** | L.2 + L.3a + L.3b | ⏳ Pending |
| **B' — Brand-rendering regression + sanity** | L.3c + L.3d | ⏳ Pending |
| ~~C — New canonical repo + CI~~ | L.4 + L.4a + L.4b + L.4c + L.4d + L.4e | → **Sprint 31** ([SPRINT31_MASTER_PLAN.md](../SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md)) |
| ~~D — Factory seams~~ | L.5 | → **Sprint 31** |
| ~~E — Test coverage uplift~~ | L.4f / L.4g / L.4h / L.4i (~22h) | → **Sprint 31** (driven by [SPRINT28_IMPACT_ANALYSIS.md](SPRINT28_IMPACT_ANALYSIS.md)) |

---

## Acceptance Test — Lean S28

Sprint 28 (lean) closes when, from a clean recipient inbox + browser:

1. Open `https://www.ysela.ai` → Ysela logo + page titles + `Powered by BRAMHI Labs` footer render
2. Sign up new user → email lands with sender "Ysela" in inbox preview
3. Click email link → URL is `https://www.ysela.ai/...` → app opens, works end-to-end
4. Brand-rendering smoke test (L.3c) passes in workshop CI
5. Pre-flip sanity walk (L.3d) clean — no "Karvia" leaks in user-facing chrome
6. karvia-business-2 Render service deploys from `ysela` branch with correct env vars

**Deferred acceptance criteria → Sprint 31**:
- `bramhilabs-us/YSELA` populated + CI green
- Branch protection on mirror
- `brand-config.js` env-driven
- Comprehensive regression suite

---

## Prerequisites (user provides)

- [x] **Ysela logo asset** saved at `client/images/yselalogo.png` (796KB, confirmed 2026-05-28). SVG version deferred to Sprint 29+ polish (size optimization candidate).
- [x] **DNS access to ysela.ai** — confirmed 2026-05-28
- [x] **bramhilabs-us GitHub org** — confirmed 2026-05-28; private `YSELA` repo exists or to be created
- [ ] **Mailjet sender name update** — `Ysela` approved by Mailjet (may require sender verification step)
- [ ] **Render dashboard access** — for new service creation + DNS bind

---

## Architectural Invariants

See [SPRINT28_MASTER_PLAN.md §Architectural Invariants](SPRINT28_MASTER_PLAN.md#architectural-invariants).

---

## Open Questions (resolve at lean S28 kickoff)

1. Mailjet sender name "Ysela" — does it need re-verification or is it auto-approved under existing domain?
2. ~~Render blue-green pattern~~ — N/A in lean S28 (karvia-business-2 lean repurpose, not new service)
3. ~~Mirror Action trigger~~ — N/A in lean S28 → S31
4. ~~`BRANDING.md` placement~~ — N/A in lean S28 → S31
5. ~~CI integration test secrets~~ — N/A in lean S28 (workshop CI unchanged) → S31
6. **L.3b old URL redirect** — does Render UI trivially support 301 from karvia-business-2.onrender.com → www.ysela.ai? If yes, ship; if not, leave URL serving Ysela content (acceptable per user 2026-06-02).
7. **L.3a env var swap timing** — change `MAILJET_FROM_NAME` + `APP_URL` BEFORE branch flip or AFTER? Recommend AFTER (avoid email weirdness during DNS propagation window).
8. **L.3d sanity walk fixtures** — use existing pre-prod Mongo fixtures (shared accepted tradeoff) or seed a fresh test account?

**S31 open questions** carried to [SPRINT31_HANDOFF_DOCUMENT.md](../SPRINT-31-Canonical-Mirror/SPRINT31_HANDOFF_DOCUMENT.md) (12 questions consolidated).

---

## Carry-Forward from Sprint 27

To be populated at Sprint 27 close:
- E.1 wizard restructure final state (any post-ship refinements)
- B.4 dispatcher migration state (already complete per S27 ledger)
- ActivationPlaybook canonical state (for future product wrappers — does playbook reference Karvia or Ysela?)

---

## Audit History

No audit IDs assigned yet — Sprint 28 is greenfield. Audit IDs will be minted as L.4c security gates run and surface findings on the initial code-subset push.

| ID | Source | One-liner | 📝 | 💻 | ✅ |
|---|---|---|---|---|---|
| _(none yet — populate at sprint kickoff)_ | | | | | |

---

## Deferrals (owned by this sprint, won't ship in S28)

**Out-of-scope (per Master Plan):**
- **L.6** Cultural Discipline + Chief AI brand cleanup — user explicitly deferred 2026-05-28
- Brand palette migration (Ysela blue+orange → replace navy+gold tokens)
- Email body content sweep (sender name only this sprint; bodies retain "Karvia" mentions per 2026-06-02 user direction)
- `MAILJET_FROM_EMAIL` domain change (requires SPF/DKIM on ysela.ai mail)
- JS/CSS comment + console.log "karvia" mentions (~830 occurrences — non-user-facing)

**Deferred to Sprint 31** (2026-06-02 lean pivot — full carry-forward in [SPRINT31_MASTER_PLAN.md](../SPRINT-31-Canonical-Mirror/SPRINT31_MASTER_PLAN.md)):
- Cross-repo mirror to bramhilabs-us/YSELA (L.4 + L.4a–e)
- Factory seams: brand-config.js + BRANDING.md (L.5)
- Test coverage uplift ~22h (L.4f / L.4g / L.4h / L.4i per [SPRINT28_IMPACT_ANALYSIS.md](SPRINT28_IMPACT_ANALYSIS.md))
- New MongoDB + new Render service for mirror surface
- Branch protection + CODEOWNERS on mirror

See [REFINEMENT-BACKLOG/](../REFINEMENT-BACKLOG/) for cross-sprint deferrals.

---

## Sign-off

Sprint 28 handoff lean-pivoted 2026-06-02 via /strategy session. Cross-repo + factory work + comprehensive regression all moved to Sprint 31 (placeholder folder created same date). Lean scope locks at brand chrome + Mailjet sender + Render rebind of karvia-business-2 → `ysela` branch + brand-rendering smoke + sanity walk.

**5 user-locked decisions (2026-06-02)** that drove this lean pivot:
1. Footer: `Powered by BRAMHI Labs` (supersedes 2026-05-28 three-tier; memory updated)
2. Email bodies: leave "Karvia" mentions in place for soft launch
3. Shared pre-prod Mongo: accepted tradeoff (saves migration; revisit at user-count scale)
4. Engine identifiers stay `karvia` (per existing invariant #1)
5. Old URL: 301 redirect karvia-business-2.onrender.com → www.ysela.ai if Render UI supports trivially; else leave as-is

**Next session recommendation** (immediate): close Sprint 27 first (`/coding` E.1a-d + E.9 — user-gated on wizard fresh-review).

**Then** (after Sprint 27 closes):
- `/coding` lean S28 in one focused 4–6h session
- Workstream A first (L.0 + L.1 + L.1a + L.1.5 — brand chrome on `ysela` branch)
- Workstream B' next (L.3c brand-rendering smoke test — pre-commit gate)
- Workstream B (L.2 + L.3a + L.3b + L.3d — env vars + branch swap + DNS + sanity walk)
- Final manual smoke + acceptance per §Acceptance Test
