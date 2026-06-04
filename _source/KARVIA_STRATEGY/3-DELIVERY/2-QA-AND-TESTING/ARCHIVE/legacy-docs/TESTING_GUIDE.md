# Karvia QA - Basic Testing Guide

**Audience:** Engineers & QA who need the quickest possible orientation before running tests.

---

## 1. Goals & Principles
- **Ship confidently:** Every feature has at least one automated test before leaving a branch.
- **Favour speed:** Keep fast feedback loops (unit < 30s, full suite < 5m).
- **Cover critical paths:** Authentication, assessments, IAM, OKR planning, and payments require 100% coverage.
- **Document only once:** Use templates in `sprints/templates/` so plans stay consistent.

---

## 2. Test Pyramid (Target Mix)
| Layer | Target % | Description | Primary Tools |
|-------|----------|-------------|---------------|
| Unit | 80% | Pure logic, validators, services, utilities | Jest + Mongo Memory Server |
| Integration | 15% | API routes, DB interactions, feature flags | Jest + Supertest |
| E2E | 5% | Critical journeys (login → assessment → OKR) | Playwright |

> Use this ratio as budgeting guidance for every sprint.

---

## 3. Coverage Gates
- **Global threshold:** 80% statements/functions/branches.
- **Critical paths:** ≥ 95% (Auth, IAM, Assessments, AI planner).
- **Blocking rules:**
  - CI fails if total coverage < 75%.
  - Release blocked if any critical path drops < 95%.
  - BST team can veto release if regression suite has gaps.

Run coverage locally:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## 4. Standard Commands
```bash
npm test                    # run everything
npm run test:unit           # fast feedback loop
npm run test:integration    # API & DB
npm run test:e2e            # Playwright journeys
./scripts/pre-deploy.sh     # lint + tests + smoke checks
```

> Need Atlas browser automation? See `automation/atlas/ATLAS_AUTOMATION_GUIDE.md`.

---

## 5. Workflow Snapshot
1. **Plan** – clone sprint template, define scope, data, BST owner.
2. **Design tests** – start with failing test, stub data factories.
3. **Automate** – add Playwright/Jest coverage + update sprint issue log.
4. **Review** – verify coverage gates, attach logs/screenshots.
5. **BST sign-off** – run `BST/bst-checklist.md` + Atlas automation before tagging releases.

---

## 6. Where To Next?
- Deep strategy & historical notes: `README.md`.
- Sprint-specific deliverables: `sprints/`.
- Atlas automation: `automation/atlas/`.
- Issues found during QA: `issues/`.
- Before-Ship Testing flows: `BST/`.
