# Sprint QA Packages

Every sprint must ship the following artefacts:
1. `test-plan.md` – scope, scenarios, environments, data, owners.
2. `issues/issues-log.md` – defects raised during the sprint (stored under `../../issues`).
3. Evidence folder (screenshots, logs, exports) referenced from plan + BST checklist.
4. Automation references (Playwright, Atlas) with command logs.

## Structure
```
sprints/
├── pre-sprint/            # legacy readiness checklist
├── sprint-01/             # historical example
├── sprint-02/             # latest sprint artefacts
├── templates/
│   ├── sprint-test-plan-template.md
│   └── weekly-test-plan.md
└── archive/
    ├── week-02/
    └── week-05/
```

## How To Use
1. Copy `templates/sprint-test-plan-template.md` into a new folder (e.g., `sprint-03/`).
2. Update metadata (dates, scope, owners) and link to Atlas scenarios + BST checklist.
3. Keep filenames consistent (`test-plan.md`, `detailed-test-cases.md`, etc.) so automation scripts can harvest data later.
4. When closing the sprint, archive any week-specific docs under `archive/` rather than deleting them.

> Historical docs (Week_2, Week_5, Pre_Sprint, Sprint_1/2) were moved here for easier navigation. Update references accordingly.
