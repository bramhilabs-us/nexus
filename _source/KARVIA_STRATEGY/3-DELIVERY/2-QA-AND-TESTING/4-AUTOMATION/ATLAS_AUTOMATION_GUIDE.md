# Atlas Automation Guide

Use this harness when you need high-confidence validation that Atlas data, clusters, and collections backing Karvia are healthy before release.

## 1. Setup
```bash
cd KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/automation/atlas
cp .env.example .env   # fill in Atlas credentials + targets
npm install
```

### Required Env Vars
| Variable | Description |
|----------|-------------|
| `ATLAS_EMAIL`, `ATLAS_PASSWORD` | Atlas login (service account recommended) |
| `ATLAS_PROJECT_NAME` | Project text to assert on landing |
| `ATLAS_CLUSTER_NAME` | Cluster to open for metrics & Data Explorer |
| `ATLAS_DATABASE_NAME` / `ATLAS_COLLECTION_NAME` | Collection to inspect in Data Explorer |
| `ATLAS_HEADLESS` | `true` for CI, `false` to watch locally |
| `ATLAS_TIMEOUT_MS` | Optional override (ms) |

## 2. Running the Suite
```bash
npm run atlas:test                 # headless (CI default)
npm run atlas:test:headed          # see the browser
node run-atlas-suite.js --scenario=project-dashboard,data-explorer
```

Outputs:
- JSON summary per run in `automation/atlas/reports/`.
- Failure screenshots in the same folder (per scenario).

## 3. Scenarios (Default)
| ID | Description |
|----|-------------|
| `project-dashboard` | Verifies projects/cluster landing page loads |
| `cluster-health` | Opens desired cluster + metrics panel |
| `data-explorer` | Opens Data Explorer tab |
| `collection-view` | Opens target collection inside Data Explorer |

Add new scenarios by extending the array in `run-atlas-suite.js`. Keep selectors close to the DOM and document any changes here.

## 4. CI Integration
1. Ensure Atlas credentials are stored in your secrets manager (GitHub Actions, Render, etc.).
2. Add a job step: `node KARVIA_STRATEGY/.../run-atlas-suite.js`.
3. Upload `automation/atlas/reports/*.json` as artifacts for audit purposes.
4. Fail the build on non-zero exit status (script already handles this).

## 5. Troubleshooting
- **Login loops**: Make sure the account does not require MFA. Use a dedicated QA user.
- **Selectors change**: Update selectors inside `run-atlas-suite.js`, re-run, and mention change in this guide.
- **Timeouts**: Increase `ATLAS_TIMEOUT_MS` if projects take longer than 45s to load.
- **CI headless differences**: Set `ATLAS_HEADLESS=false` locally to reproduce.

## 6. Linking to BST & Sprints
- Reference the JSON report path inside your sprint test plan + BST checklist.
- Attach failure screenshots to the sprint’s `evidence/` folder and link from the issue log.
