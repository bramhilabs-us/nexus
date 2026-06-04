# Week 1 Plan Review – Assessment System Focus

## High-Risk Observations
- **Day 1 scope is unworkable.** Seven tasks consume an estimated 14+ hours (question extraction, three new/updated models, seeding scripts). Updating `Invitation.js` (628 lines) and `Assessment.js` (712 lines) plus creating two new models in a single day is unrealistic and invites rushed, brittle code (`MASTER_DEV_LIST.md` Day 1 section).
- **Manual extraction from mockups is fragile.** DEV-W1-001 depends on copying 146 questions from static mockups. There is no source-of-truth JSON and no QA plan, so transcription errors or ID inconsistencies will silently cascade into scoring bugs.
- **Signup redesign conflicts with current IAM contract.** DEV-W1-008 expects on-the-fly business creation with just `business_name`, yet `Business.js` requires additional fields (e.g., `employee_count`, `industry`). Existing IAM `/api/auth/register` needs first/last name and an existing `business_id`, so the plan underestimates refactor effort (`engines/iam/index.js`, `server/models/Business.js`).
- **API surface explosion without shared utilities.** Assessment template, invitation, scoring, and results APIs add 10+ endpoints in the main server, but shared validation, auth guards, and service contracts are undefined. Given Week 0 blockers (no feature flags, shared models), this volume is risky.
- **Security holes in public assessment endpoints.** DEV-W1-013 introduces unauthenticated routes that create accounts and issue JWTs. Without throttling, captcha, or abuse checks, invitation tokens become an attack vector.
- **Frontend expectations exceed current stack.** Plan assumes a navigable, role-aware client with auth guards, dynamic data fetching, and polling. The repo still uses static HTML prototypes; there is no router, build step, or shared state management. Implementing five new pages plus end-to-end tests in two days is unlikely.
- **Testing is back-loaded.** Only DEV-W1-021 mentions E2E testing, but no unit/integration coverage is scheduled while refactoring large models and services. Regression risk is high.

## Dependencies / Overlooked Work
- Week 0 prerequisites (shared models package, feature flags, cache fallback) remain incomplete. New services rely on dynamic templates, invitation states, and scoring—none of which are validated without that groundwork.
- Business creation flow will also need onboarding defaults (subscription tier, assessment scores) and likely email templates or notification adjustments, none accounted for.
- Invitation auto-account creation requires password policies, welcome emails, and duplication checks for existing consultants—missing from the checklist.

## Recommendations
1. Re-scope Day 1 into at least two days: complete question library ingestion and new models first; defer model refactors until automated tests exist.
2. Generate the SSI question set programmatically from a structured artifact (CSV/JSON) and add validation scripts to catch mismatches.
3. Prototype multi-role signup separately. Define required business fields, migration path for existing users, and how consultants manage multiple tenants before rewriting IAM endpoints.
4. Introduce middleware/utilities for role-based filtering, rate limiting on public endpoints, and consistent error handling. Without these, the new APIs will be fragile.
5. Decide whether to invest in a real frontend framework now or limit Week 1 demo goals to API proofs + static walkthrough. Trying to ship dynamic pages without groundwork will slip the schedule.
6. Allocate time for automated tests (unit for scoring service, integration for invitation/assessment flows) before Day 5 to avoid demo-day regressions.
