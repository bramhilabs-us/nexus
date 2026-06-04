# Multi-Assessment Tracking — Strategy Session Input

<!-- @GENOME T3-SPR-026-STRAT-INPUT-MAT | DRAFT | 2026-05-18 | parent:T3-SPR-026-MP | auto:/strategy | linked:/coding -->

**Purpose**: Prep doc for the next /strategy session — formalize the multi-assessment-dispatch tracking feature surfaced by /testing 2026-05-18 (user-driven). Companion to the already-resolved [ASSESSMENT_STRATEGY_SESSION_INPUT.md](ASSESSMENT_STRATEGY_SESSION_INPUT.md) (Q5-Q13 locked 2026-05-12).
**Status**: 📝 DRAFT (v2 — amended 2026-05-18 after user-correction on Survey terminology) — needs /strategy session to resolve open questions before /coding.
**Triggered by**: /testing 2026-05-18 — user sent 2nd dispatch of "Home Services Business Health" template to the same 4-member team; team-ssi-view still showed `3 Total Responses` and no per-dispatch breakdown. User direction: *"we need to have a very surgical and simple way to tag each assessment as one assessment as a whole."*
**Canonical reference**: [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) (T2-ARC-023).

---

## Terminology clarification (user-amendment 2026-05-18) — per `feedback_quote_the_canon`

> **User direction 2026-05-18 (verbatim)**: *"When I say surveys, initially when the consultant is sending the assessment as a link, the people who take the assessment via the link comes under surveys."*

**Translation**: "Survey" is NOT a separate model. It is the **anonymous public-link dispatch mode of the same Assessment+Invitation pipeline**. Canon verified 2026-05-18:

| Mode | Invitation flag | Assessment flag | Recipient surface |
|---|---|---|---|
| **Invite-mode** (today's default) | `is_public_link: false` (default) | `is_anonymous: false` | `/pages/assessment-take.html?invitation_token=...` — identified team member |
| **Survey-mode** (Sprint 9 wiring) | `is_public_link: true` ([Invitation.js:98](../../../server/models/Invitation.js#L98)) — generated via `Invitation.createPublicLink()` ([Invitation.js:500](../../../server/models/Invitation.js#L500)) | `is_anonymous: true` ([Assessment.js:88](../../../server/models/Assessment.js#L88)) + `anonymous_respondent: {name, role, collected_at}` subdoc ([Assessment.js:57](../../../server/models/Assessment.js#L57)) | `/pages/survey.html?token=...` — anonymous respondent provides name+role at start |

team-ssi-view already distinguishes the two via `total_completed` (invite-mode) and `total_anonymous` (Survey-mode) — see [team-ssi-view.js:692-697](../../../client/pages/scripts/team-ssi-view.js#L692-L697) where the header KPI renders both counts separately.

**What this means for this spec**: `dispatch_batch_id` applies uniformly to both modes — but the per-dispatch *counting semantics* differ:
- Invite-mode batch: 1 batch → N invitations sent → up to (N × retake_number) completed Assessments
- Survey-mode batch: 1 batch → 1 public-link Invitation → unlimited M anonymous Assessments over time

The data model already supports both; what's missing is the same `dispatch_batch_id` linking field + UI surfaces that respect the mode distinction.

---

## What's already settled (do not re-litigate)

Quoted verbatim from [ASSESSMENT_STRATEGY_SESSION_INPUT.md:18](ASSESSMENT_STRATEGY_SESSION_INPUT.md#L18) per `feedback_quote_the_canon`:

> **Q6**: **(b) Versioned attempt** — new Assessment row per re-take; latest wins display; history via existing `retake_number` field. No new collection.

So the **per-user retake** dimension is locked: every retake = new `Assessment` doc, distinguished by `retake_number`, latest wins for display. This spec does NOT touch that.

---

## The new gap

Q6 handles **same user, multiple takes** (`retake_number` distinguishes them). It does NOT handle **multiple users, one dispatch event** — i.e. when a consultant clicks "Launch Assessment" and N invitations fan out, those N invitations share no batch identifier today. The company-level rollup on team-ssi-view aggregates ALL completed Assessments for the company regardless of which dispatch they came from.

### Symptoms surfaced 2026-05-18

1. **Counter stuck**: After 2nd dispatch + 2 retakes, "Total Responses" stayed at `3` (because the rollup dedupes to latest-per-user per the 2026-05-12 A20260512-14 carve-out).
2. **No per-dispatch breakdown**: Consultant cannot answer "what did Speed look like on 18 May vs 19 May?" without manually correlating Assessment.created_at timestamps in the DB.
3. **No dispatch-naming**: Consultant cannot label a dispatch ("Pre-Q3 Pulse" vs "Post-training Check") for stakeholder narratives.
4. **Surveys parity**: Same gap applies to Surveys (if/when Survey model lands).

---

## What already exists (per `feedback_reuse_max` canon-check 2026-05-18)

| Field | Where | What it tells us |
|---|---|---|
| `Assessment.invitation_id` | [server/models/Assessment.js:50](../../../server/models/Assessment.js#L50) (indexed line 730) | Every Assessment links to the Invitation that triggered it |
| `Assessment.retake_number` | [server/models/Assessment.js:252](../../../server/models/Assessment.js#L252) | Sequence per user+template — settled by Q6 |
| `Invitation.sent_at` | [server/models/Invitation.js:251](../../../server/models/Invitation.js#L251) | When the dispatch hit |
| `Invitation.template_id` | (exists) | Which template was sent |

**Missing**: no field links the N invitations that went out together as one dispatch.

---

## Open questions for /strategy session

### Q-MAT-1 — Dispatch identifier source

**Options**:
- **(a) Add `Invitation.dispatch_batch_id: ObjectId` field** (sparse, indexed) populated by `createInvitations()` at dispatch-time. All invitations in the same `POST /api/invitations` call share the same fresh ObjectId. Assessment derives dispatch via `assessment.invitation_id → invitation.dispatch_batch_id`. **Single new field, extends existing models per `feedback_extend_before_wrap`. Recommended.**
- **(b) Derive dispatch from `Invitation.sent_at` time-window** (e.g. all invitations from same `sent_by` within ±60s = same dispatch). Zero new fields but brittle (clock skew, slow Mailjet sends, multi-process races).
- **(c) Introduce new `AssessmentDispatch` collection** with `{template_id, company_id, dispatched_by, dispatched_at, recipient_invitation_ids[]}`. Cleanest model but violates `feedback_extend_before_wrap` (new collection when 1 field would do).

### Q-MAT-2 — Dispatch label (human-readable)

**Options**:
- **(a) Add `Invitation.dispatch_label: String` (maxlength 80)** populated by consultant at launch-time (optional; defaults to `${template.name} — ${formatted sent_at date}`). All invitations in same dispatch share label. Used in UI tabs/dropdowns/filters.
- **(b) Defer labeling to post-Beta** — display dispatches by sent_at timestamp only ("Dispatch 2026-05-18 14:32"). Saves FE work; consultant has no narrative hook.
- **(c) Auto-generate label only** (no consultant input field) — `${template.name} #${dispatch_iteration}` where iteration = count of prior dispatches of same template to same company.

### Q-MAT-3 — UI surface scope (Beta-1 vs refinement-track)

Where to surface dispatch awareness:
- **team-ssi-view header**: "Company SSI Results" KPI card row — add "Dispatches: N" tile next to "Total Responses"
- **team-ssi-view Teams tab**: per-dispatch dropdown filter (default: "All dispatches"; alt: "18 May Pulse · 19 May Check")
- **team-ssi-view Trends graph**: each dispatch = one data point on timeline (already partially there — leverage `team.latest_assessment_id` pattern from [team-ssi-view.js:1703](../../../client/pages/scripts/team-ssi-view.js#L1703))
- **assessment-results page**: per-dispatch breakdown table
- **consultant my-clients tile**: "Last dispatch: 19 May (4/4)" badge

**Options**:
- **(a) Header + filter dropdown only in Beta-1**, rest deferred to refinement-track
- **(b) Full UI surface in Beta-1** — Trends graph + tile badge + assessment-results breakdown all ship
- **(c) Header KPI only** (single counter "X Dispatches") in Beta-1; everything else refinement-track

### Q-MAT-4 — Backfill of existing data

When Q-MAT-1(a) ships, existing Invitations have no `dispatch_batch_id`. Options:
- **(a) One-time backfill script** groups historical invitations by `(template_id, company_id, sent_by, time-bucket of sent_at within 5min)` → assigns synthetic batch IDs. Best-effort; not perfect for clock-skewed multi-process dispatches.
- **(b) Leave historical as null** — dispatch awareness only kicks in post-deploy. Old data falls into an "Untagged" bucket in UI.
- **(c) Backfill only post-Sprint-26 data** (rsm/testing fixture era) — production has none yet pre-Beta-1; symmetry comes for free once /testing fixture wiped + recreated post-deploy.

### Q-MAT-5 — Survey-mode (anonymous public-link) parity

⚠️ **Amended 2026-05-18** after user correction: Survey IS the anonymous public-link dispatch mode of Assessment+Invitation, NOT a separate model. Sprint 9 already shipped the data fields (`Invitation.is_public_link` + `Assessment.is_anonymous` + `anonymous_respondent` subdoc) — `dispatch_batch_id` extension applies uniformly to both modes.

**Open question is no longer "design generic" — it's how the per-dispatch counters render given the mode-dependent counting semantics.**

| Counter | Invite-mode batch | Survey-mode batch |
|---|---|---|
| "Invitations sent" | N (= recipient count) | 1 (= public link generated) |
| "Responses received" | up to (N × retake) | unlimited M anonymous over time |
| "Completion rate" | meaningful (responses/invited) | meaningless without a denominator |
| Per-respondent identity | known (User doc) | anonymous (`anonymous_respondent.name + role` only) |

**Options**:
- **(a) Single counter "Responses" + mode badge per dispatch** ("Dispatch 1 · 🔗 Survey · 12 responses" vs "Dispatch 2 · ✉️ Invite · 3/4 responses (75%)"). UI condition reads `invitation.is_public_link` on the batch's anchor invitation. **Smallest UI change. Recommended.**
- **(b) Separate dispatch list per mode** — two columns/sections in the dispatch dropdown: "Invite Dispatches" (3) and "Survey Links" (2). Larger UI footprint; clearer separation.
- **(c) Identical rendering for both modes** — show "Dispatch 1 · 12/—" with em-dash for survey-mode denominator. Confusing; loses the mode signal.

Anonymous-respondent role distribution within a Survey dispatch (which fraction of M responses were MANAGER vs EMPLOYEE) — already tracked via `Assessment.anonymous_respondent.role`; surface in per-dispatch detail view if Q-MAT-3 ships beyond header KPI.

### Q-MAT-6 — Sprint slot

- **(a) Slot into S26 refinement (Workstream C? D?)** — pre-Beta-1 polish if scope ≤1 day
- **(b) Slot into S27 (First Task) firing scope** — companion to objective/task cascade
- **(c) Refinement-track post-S27** — full feature as nice-after-Beta epic

### Q-MAT-7 — Audit-ID granularity

- **(a) Single audit ID** for the full multi-assessment-tracking feature (bundle precedent: A20260514-11 part-1/-2)
- **(b) Separate audit IDs** per Q (one per scope decision once resolved)
- **(c) No audit ID** — track via refinement-backlog epic file like `EPIC_2X-N_MULTI_ASSESSMENT_TRACKING.md`

---

## Recommended pre-resolution defaults (per memory rules)

Until /strategy session locks these, default lean:

| Q | Recommended default | Why |
|---|---|---|
| Q-MAT-1 | **(a)** `Invitation.dispatch_batch_id` field | `feedback_extend_before_wrap` — extend existing model; no new collection |
| Q-MAT-2 | **(c)** Auto-generate label only for Beta-1 | `feedback_minimal_change_grounding` — defer consultant-input UX to refinement |
| Q-MAT-3 | **(a)** Header KPI + dispatch dropdown filter only | Smallest UI scope that closes user's stated need ("number of assessments sent + responses per assessment") |
| Q-MAT-4 | **(b)** Leave historical null | Pre-Beta-1, no production data — wipe + recreate via /testing journey is acceptable |
| Q-MAT-5 | **(a)** Single "Responses" counter + mode badge (🔗 Survey / ✉️ Invite) per dispatch row | Smallest UI change; honors mode distinction; reads existing `invitation.is_public_link` flag |
| Q-MAT-6 | **(c)** Refinement-track post-S27 | Not Beta-1-blocking; the activation-execution-stitching journey ships first |
| Q-MAT-7 | **(a)** Single audit ID under refinement epic file | Matches REFINEMENT-BACKLOG convention; sub-parts mint at /coding time |

---

## Cross-references

- [ASSESSMENT_STRATEGY_SESSION_INPUT.md](ASSESSMENT_STRATEGY_SESSION_INPUT.md) — Q6 (per-user retake) settled; this doc extends to per-dispatch
- [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) — canonical assessment data flow
- [SPRINT26_HANDOFF_DOCUMENT.md](SPRINT26_HANDOFF_DOCUMENT.md) — /testing 2026-05-18 entry §"Future-track items captured"
- [REFINEMENT-BACKLOG/README.md](../REFINEMENT-BACKLOG/README.md) — add entry to Sub-bucket A once /strategy resolves
- Sibling future-track item: **journey-regression automation** (same /testing session) — independent scope

---

## Out of scope

- Survey-mode "what's behind the public link" lifecycle features (rotate token, revoke link, response cap) — exist in [Invitation.js:507-515](../../../server/models/Invitation.js#L507) `createPublicLink` already; not in this spec's scope
- Dispatch lifecycle events (cancel-dispatch, resend-to-subset, reminder-cadence) — these become reasonable AFTER `dispatch_batch_id` exists
- Multi-template-per-dispatch (sending SSI + GRIT in one click) — defer until single-template per-dispatch tracking works
- Anonymous respondent identity reconciliation (matching survey-mode anonymous responses to known users) — explicit anti-feature; Survey-mode is anonymous by design

---

**Decision deadline**: Next /strategy session (suggest 2026-05-19 same day as /coding burndown of A20260518-* audit IDs).
