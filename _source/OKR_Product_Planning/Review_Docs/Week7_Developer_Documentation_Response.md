# Week 7 Developer Documentation Response

**Date**: 2025-10-26  
**Prepared by**: CTO (Codex Support)  
**Reference**: Developer readiness review for Week 7 deliverables

---

## 1. Context
- Week 7 scope covers company onboarding, bulk invitations, invitation acceptance, and multi-company context switching.
- Lead developer reports adequate high-level architecture but lacks flow-level guidance, risking rework and inconsistent UX/security decisions.
- Goal: capture immediate documentation needs, map them to long-lived strategic artifacts, and route updates into the master strategy backlog.

---

## 2. Existing Assets (Reviewed)
- `KARVIA_STRATEGY/2-TECHNICAL/3-DATA/database_schema.md` — comprehensive schemas; terminology still uses `business_id`.
- `KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/MVP_TECHNICAL_ARCHITECTURE_V5.md` — system-wide architecture coverage is solid.
- `KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/PERMISSION_MATRIX.md` — RBAC definitions complete.
- `KARVIA_STRATEGY/1-PRODUCT/3-SPECS/MVP_PRD_V3.md` and role journey documents — provide narrative context but not implementation flows.

---

## 3. Gaps & Required Deliverables
1. **Company Setup Wizard UX Specification**
   - Needs staged flow (Create Company → Configure Details → Add Teams) with validation rules, error handling, archetype/strategic focus selection patterns, and analytics instrumentation notes.
   - Destination: `KARVIA_STRATEGY/1-PRODUCT/4-UX-AND-CONTENT/COMPANY_SETUP_WIZARD.md`.

2. **Bulk Invitation System Technical Design**
   - Must cover invitation modes (entire company, selected teams, CSV upload), query logic, CSV format, preview calculations, duplicate handling, and async email processing strategy.
   - Destination: `KARVIA_STRATEGY/2-TECHNICAL/1-SERVICE-DESIGNS/BULK_INVITATIONS_DESIGN.md`.

3. **Invitation Token Security & Acceptance Flow**
   - Define token generation format, storage (hashing/TTL), expiry/extension rules, API endpoints, UI flow after email click, auditing, and abuse prevention.
   - Destination: `KARVIA_STRATEGY/2-TECHNICAL/5-NON-FUNCTIONAL/INVITATION_SECURITY.md`.

4. **Multi-Company Context Switching Specification**
   - Clarify UX pattern (control placement, empty/error states), backend handling (persist `current_company_id`, JWT refresh, cache/state reset), permission recalculation, and consultant multi-company visibility.
   - Destination: `KARVIA_STRATEGY/1-PRODUCT/4-UX-AND-CONTENT/MULTI_COMPANY_SWITCHER.md`.

5. **Database Schema Terminology Alignment**
   - Replace `business_id` with `company_id`, note migration strategy, and sync downstream scripts/routes (`server/scripts/migrate-business-to-company.js`, `server/routes/companies.js` etc).
   - Destination: Update `KARVIA_STRATEGY/2-TECHNICAL/3-DATA/database_schema.md` + related migration documentation.

---

## 4. Action Plan
| Deliverable | Primary Owner | Reviewer | Target Completion | Notes |
|-------------|---------------|----------|-------------------|-------|
| Company Setup Wizard UX spec | Product Design Lead | CTO | 2025-10-28 | Reuse journey language; include figma link placeholders. |
| Bulk Invitation system design | Backend Lead | Tech Lead | 2025-10-29 | Incorporate queue vs async comparison + monitoring hooks. |
| Invitation security spec | Security/Backend Lead | CTO | 2025-10-29 | Mirror existing auth token patterns; document TTL index. |
| Multi-company switcher spec | Frontend Lead | Product Manager | 2025-10-30 | Align with navigation IA; ensure accessibility. |
| Schema terminology update | Backend Lead | Data Architect | 2025-10-27 | Update docs + run migration scripts; confirm tests. |

---

## 5. Risks & Mitigations
- **UX ambiguity** could trigger rework → Provide low-fidelity wireframes or references in the UX spec.
- **Security regression** if invitation handling guessed → Security review mandatory before development start.
- **Migration drift** between docs and code → Execute and document migration script alongside terminology update.
- **Email delivery load** for bulk invitations → Decide on queue strategy now; include rate-limit thresholds in design doc.

---

## 6. Next Steps
- Track progress via the Immediate Authoring backlog in `MASTER_STRATEGY_DEV_TODO.md`.
- Schedule mid-week sync (2025-10-29) to review drafts and unblock open questions.
- Roll completed deliverables into sprint planning and attach links in the master document upon approval.

--- 

**Distribution**: Product, Engineering, Security, Delivery leads  
**Storage**: Long-term archive under `Karvia_OKR_Product_Planning/Review_Docs/`
