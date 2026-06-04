# Karvia QA & Testing Hub

This folder is the single source of truth for how we plan, automate, and sign off testing before a release. Pair it with `TESTING_GUIDE.md` for the quick-start workflow.

---

## 1. Navigation
| Area | Purpose | Start Here |
|------|---------|------------|
| `TESTING_GUIDE.md` | 5-minute orientation (pyramid, commands, gates) | Read first |
| `automation/atlas/` | Browser automation against MongoDB Atlas (Node + Playwright) | `ATLAS_AUTOMATION_GUIDE.md` |
| `BST/` | Before-Ship Testing flows & checklists | `BST/README.md` |
| `sprints/` | Sprint-specific plans, archives, and templates | `sprints/README.md` |
| `issues/` | Sprint QA issue logs + templates | `issues/README.md` |
| `AUDIT_REPORT_INDEX.md` | Historical QA audits | Reference |

---

## 2. Standard Workflow
1. **Plan the sprint:** Copy the template from `sprints/templates/`, fill scope, data, and Atlas/BST owners.
2. **Automate scenarios:** Add/extend Jest + Playwright coverage in the codebase and, when data integrity is needed, script Atlas UI steps under `automation/atlas/`.
3. **Track issues:** Log every defect in the sprint’s issue log (see `issues/`), link to Jira/GitHub, and tag severity.
4. **Run BST:** Before tagging a release, execute the checklist in `BST/bst-checklist.md` plus the Atlas automation suite.
5. **Archive:** Drop reports or summaries into the relevant sprint folder so future audits stay easy.

---

## 3. Tooling Snapshot
- **Unit & integration:** Jest, Supertest, Mongo Memory Server (see repo `tests/`).
- **E2E web:** Playwright (run via `npm run test:e2e`).
- **Atlas browser automation:** `automation/atlas/run-atlas-suite.js` (Chromium, launches https://account.mongodb.com/).
- **CI gates:** `./scripts/pre-deploy.sh` + optional Atlas automation (document evidence in sprint plan).

Optional installations for Atlas automation:
```bash
cd KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/automation/atlas
npm install
npm run atlas:test
```

---

## 4. Expectations
- **Coverage:** ≥80% overall, ≥95% for critical paths (auth, IAM, assessments, planner).
- **Documentation:** Every sprint must include (a) plan, (b) issues log, (c) BST checklist result, (d) automation evidence (logs/screenshots).
- **Ownership:** Each release has a named BST owner and an Atlas automation owner (document in sprint test plan).

---

## 5. Contributing
1. Use existing templates (test plans, Atlas scenarios, BST checklist) when adding docs.
2. Reference files by relative path (e.g., `sprints/sprint-02/test-plan.md`).
3. When adding automation, update `automation/atlas/ATLAS_AUTOMATION_GUIDE.md` with prerequisites or new scenarios.
4. Archive legacy material inside `sprints/archive/` rather than deleting.

Need help? Ping the QA lead or check `AUDIT_REPORT_INDEX.md` for historical investigation notes.
