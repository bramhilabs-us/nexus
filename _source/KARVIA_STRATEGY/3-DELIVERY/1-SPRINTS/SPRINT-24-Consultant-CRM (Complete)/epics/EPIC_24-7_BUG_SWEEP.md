# Epic 24.7 — Bug Sweep: KR Creation Audit + Enrich Endpoint Diagnosis

<!-- @GENOME T3-SPR-024-EPIC-7 | ACTIVE | 2026-05-04 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 2
**Priority**: P0 (discovery first — runs before Epic 24.3 to surface blockers)

---

## Goal

Discovery-first audit of two known/suspected bugs that could block Epic 24.3 and the Sprint 24 acceptance test:

1. **KR creation flow** — User raised concern that this might be broken; if so, the `identified → handed_off` ball-state trigger never fires naturally and the acceptance test (verb 5: hand-off) fails. Fix if found.
2. **Enrich endpoint** — S22 watch-item flagged `POST /api/consultant/clients/enrich` as broken on dev (karvia-business-1). S22a #184d only built the new `sendInvitationLinkEmail`; the enrich diagnosis itself was never recorded as resolved. Investigate + fix or document why fallback is acceptable.

## Locked Decisions

- Investigate-first: 1-2 hours of audit before writing any fix
- If clean (no bug): document the finding, close the epic at 0 fix-points (audit value still delivered)
- If bug found: scope the fix, fit it inside this epic if ≤ 2 pts, OR carve out a follow-up if larger

## Acceptance Criteria

### KR creation audit
- [ ] Verify `POST /api/key-results` works end-to-end on dev for both BUSINESS_OWNER and CONSULTANT-on-behalf paths
- [ ] Verify `POST /api/objectives` dual-write of embedded `key_results[]` from S23 #190 still produces standalone `KeyResult` documents
- [ ] Verify `Objective.virtual('key_results_v2')` returns the dual-written KRs
- [ ] Confirm KR creation surfaces correctly in:
  - `objective-wizard.html` flow (S23 #190)
  - `objectives.html` direct creation (if exists)
- [ ] If any path is broken: write fix, retest, document in handoff
- [ ] If all paths work: write a 1-paragraph "no-issue-found" note in epic-completion section of handoff

### Enrich endpoint diagnosis
- [ ] Reproduce the failure on dev (karvia-business-1) using a real consultant JWT + a known-clean Add-Client wizard payload
- [ ] Inspect server logs for the actual failure mode (timeout / 401 / 500 / OpenAI upstream)
- [ ] Identify root cause (likely candidates: missing OPENAI_API_KEY, LLMGateway misconfiguration, network timeout, web_search tool unavailable in current OpenAI tier)
- [ ] Fix if root cause is in our code; if root cause is upstream/config, document the workaround (the existing manual-fallback already gracefully degrades the wizard, so user-impact is bounded)
- [ ] Add a regression test if a fix is shipped

### Out of scope
- Welcome email feature (S22 D-C-8) — punted to S25+ if requested; not part of this epic
- Cost tracking (S22 D-F-7) — punted; not part of this epic
- Reaction badge (S22 D-G-3) — punted; not part of this epic
- Live browser smoke for My Clients — covered by `/testing` post-S24

## Implementation Notes

### Files likely touched (depending on findings)
- `server/routes/key-results.js`, `server/routes/objectives.js` — if KR creation has a bug
- `server/routes/consultant.js` (enrich endpoint), `server/services/aiOKRService.js`, `server/services/LLMGateway.js` — if enrich diagnosis points here
- `.env.example` — if a config gap is identified

### Surgical reuse
- ✅ `LLMGateway.js` from S22a Phase 2.1 — sole OpenAI chokepoint
- ✅ `requireManagedClient` middleware — should already gate enrich endpoint correctly
- ✅ S23 #190 dual-write KR pattern — verified, not changed in this epic

### What's net new
- Possibly nothing (if both audits return clean)
- Possibly: 1-2 small fixes
- Definitely: documented findings in handoff (epic deliverable even on no-bug)

## Tests

NEW `scripts/test-sprint24-247-bug-sweep.js`:
- KR creation happy path: BUSINESS_OWNER creates objective with KRs → both `Objective.key_results[]` and standalone `KeyResult` docs exist
- KR creation: CONSULTANT-on-behalf path (post-Epic 24.2 enabling consultant writes) → KRs created
- Objective.virtual('key_results_v2') returns dual-written KRs
- Wizard finalize path: S23 #190 stage transition still fires
- Enrich endpoint: returns 200 with payload OR 503 with documented graceful-fallback message (NEVER 500)
- Enrich endpoint: rate-limited per S22a #184d
- If a bug fix is shipped: regression test for the specific bug

Target: ~15-25 assertions (smaller if no bugs found, larger if fixes are shipped).
