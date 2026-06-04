# Before-Ship Testing (BST)

BST is the final manual + automated sweep that guarantees the most important Karvia flows still work before any release candidate is tagged.

## Scope
- **Mandatory flows:** login, company creation, IAM role switching, assessment creation & publish, AI OKR generation, OKR approval + assignment, dashboard rollups, invites + acceptance, permissions.
- **Environments:** Latest staging build + MongoDB Atlas project seeded with production-like data.
- **Participants:** QA owner (driver), feature engineer (observer), release manager (approver).

## Flow Map
| Flow | Description | Automation Support | Notes |
|------|-------------|--------------------|-------|
| Authentication | Login/logout, token refresh, password reset | Atlas script + Playwright e2e | Validate JWT + IAM fallback |
| Account / Company creation | Create company, assign owner, switch contexts | Manual + Atlas | Confirm multi-company data writes |
| Assessment builder | Build assessment, add custom dimensions/questions, publish | Atlas script for DB verification | Compare template vs rendered form |
| Assessment run | Send invitations, submit responses, view analytics | Manual UI + API checks | Ensure scoring + SSI calculations |
| AI OKR generation | Run planner, edit objectives, assign owners | Playwright e2e | Validate feature flags & fallback templates |
| Goal/Task management | Create/edit goals, cascade to teams, mark progress | Manual UI | Verify calculations + notifications |
| Invitations & IAM | Invite member, accept via email/token, confirm permissions | Manual + API script | Test business owner + consultant roles |
| Dashboard rollups | Validate totals on dashboard/observer views | Manual screenshot + metrics export | Compare with backend API totals |

## Execution Process
1. Clone `BST/bst-checklist.md` for the release (rename with date/tag).
2. Assign owners for each flow in the checklist.
3. Run Atlas automation (`automation/atlas/run-atlas-suite.js`) for DB verification steps.
4. Capture evidence (screenshots, terminal logs), link in checklist column.
5. File defects in `issues/` and block release until resolved.
6. Submit signed checklist + automation log in the sprint folder.

## Evidence Requirements
- Authentication screenshot (post-login dashboard) with timestamp.
- Atlas automation log containing scenario names + pass/fail.
- OKR planner output (JSON or screenshot) referencing current sprint objectives.
- Assessment results export verifying SSI/dimension totals.

Missing evidence = no release. Store everything under `sprints/<current>/evidence/` for auditability.
