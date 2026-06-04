# Sprint 16-D: Documentation Living System

<!--
DOC-META:
  id: K3-SPR-016D
  version: 1.0.0
  created: 2026-03-06
  updated: 2026-03-06
  status: draft
  tier: K3
  owner: claude
  parent: K0-CORE-002
  children: []
  related: [K3-SPR-015A]
  tags: [sprint, documentation, infrastructure]
-->

**Sprint**: 16-D (Documentation Living System)
**Duration**: 2 weeks (expanded scope)
**Status**: ON HOLD
**Total Points**: 147 pts
**Type**: Infrastructure (Documentation-Only, No Code Changes)
**Status Updated**: March 18, 2026
**Hold Reason**: P1/P2 findings require resolution (see SPRINT16D_OPTIMIZATION_REPORT.md)

---

## Executive Summary

This sprint creates a comprehensive **Documentation Living System** for the Karvia Business codebase:

1. **README Network** - Every folder has a README linking to parent/children
2. **Metadata System** - Standardized headers with Doc IDs, versions, status
3. **Document Registry** - Central JSON database of all documentation
4. **Dependency Tracking** - Automated flagging when changes affect related docs
5. **Zero Orphans** - Every file and folder is connected to the hierarchy

**Scope**: Documentation files only. No modifications to working code (`.js`, `.html`, `.css`).

---

## Problem Statement

### Current State

| Metric | Value | Target |
|--------|-------|--------|
| Total Directories | 421 | - |
| Existing READMEs | ~30 | 421 |
| README Coverage | 7% | 100% |
| Docs with Metadata | 0 | 75+ |
| Central Registry | None | 1 |
| Orphaned Files | Unknown | 0 |

### Pain Points

1. **Navigation Difficulty** - No clear path from root to any folder
2. **Unknown Dependencies** - Changes may break related docs without warning
3. **No Version Tracking** - Can't tell if a doc is current or outdated
4. **Manual Discovery** - Finding relevant docs requires search guessing
5. **Maintenance Burden** - No tools to validate or auto-generate

---

## Tier System (K0-K4)

```
K0 (Constitutional)   →  CLAUDE.md, root README - Immutable core
     ↓
K1 (Product)          →  Roadmap, user stories - Business approval
     ↓
K2 (Technical)        →  API specs, architecture - Technical review
     ↓
K3 (Sprint)           →  Sprint plans, epics - Claude can modify
     ↓
K4 (Session)          →  Logs, handoffs - Operational, auto-updated
```

### Document ID Convention

```
Pattern: K[TIER]-[DOMAIN]-[NUMBER]

Examples:
  K0-CORE-001   = CLAUDE.md
  K1-PROD-001   = PRODUCT_ROADMAP.md
  K2-API-001    = API_SPECIFICATION.md
  K3-SPR-015A   = Sprint 15A Master Plan
  K4-SESS-001   = SESSION_LOG.md
```

### Domain Codes

| Code | Domain | Examples |
|------|--------|----------|
| CORE | Core system | CLAUDE.md, root README |
| PROD | Product | Roadmap, user stories |
| ARCH | Architecture | System design docs |
| API | API Specification | Endpoint docs |
| DATA | Data Models | Schema definitions |
| SPR | Sprint Plans | Sprint master plans |
| EPIC | Epic Definitions | Epic breakdowns |
| TEST | Testing | Test plans, reports |
| SESS | Session Management | Session logs, handoffs |
| QA | Quality Assurance | QA processes |
| GUIDE | Guides | Tutorials, how-tos |

---

## Epic Overview

| Epic | Points | Scope |
|------|--------|-------|
| D0: Foundation | 8 | Standards, templates, specifications |
| D1: Core READMEs | 13 | Top-level folder READMEs (15 folders) |
| D2: KARVIA_STRATEGY READMEs | 20 | All strategy subfolders (45 folders) |
| D3: Metadata Headers | 15 | K0-K2 tier documents (75 docs) |
| D4: Tooling & Registry | 15 | Auto-generation tools |
| D5: Remaining Folders | 10 | Automated README generation (350+ folders) |
| D6: Root Folder Restructure | 20 | Relocate docs, merge legacy folders |
| **D7: Command System Update** | **16** | **Update all 13 slash commands** |
| **D8: Document Relevance System** | **12** | **R0-R3 tier classification** |
| **D9: Local Archive Strategy** | **18** | **Create .local/, migrate sprints** |
| **Total** | **147** | |

---

## Epic D0: Foundation (8 pts)

**Purpose**: Establish standards and templates before implementation.

| Story | Points | Deliverable |
|-------|--------|-------------|
| D0-1 | 2 | `DOC_STANDARDS.md` - Complete specification |
| D0-2 | 2 | `README_TEMPLATE.md` - Copy-paste template |
| D0-3 | 2 | `METADATA_HEADER_TEMPLATE.md` - Header specification |
| D0-4 | 2 | `.claude/DOC_REGISTRY_SCHEMA.json` - Registry JSON schema |

### D0-1: DOC_STANDARDS.md

Location: `KARVIA_STRATEGY/GUIDES/documentation-standards/DOC_STANDARDS.md`

Contents:
- Tier system explanation (K0-K4)
- Doc ID conventions
- Status values (Draft, Active, Deprecated, Archived)
- Version numbering (X.Y.Z semantic)
- Change log format
- Dependency declaration rules

### D0-2: README_TEMPLATE.md

```markdown
# [Folder Name]

<!--
DOC-META:
  id: [K#-DIR-NAME]
  type: directory
  parent: [K#-DIR-PARENT]
-->

> **Navigation**: [Root](../README.md) → **[Current]**

---

## Purpose
[1-2 sentences describing the folder's purpose]

## Structure
| Item | Type | Description |
|------|------|-------------|
| [folder/](./folder/) | Folder | Description |
| [file.md](./file.md) | File | Description |

## Dependencies
- Depends on: [Link to dependency]
- Depended by: [Link to dependent]

---
*Last updated: YYYY-MM-DD*
```

---

## Epic D1: Core READMEs (13 pts)

**Purpose**: Create READMEs for top-level folders (depth 1-2).

| Story | Points | Folder | Doc ID |
|-------|--------|--------|--------|
| D1-1 | 3 | `README.md` (root) | K0-CORE-002 |
| D1-2 | 2 | `server/README.md` | K2-DIR-SERVER |
| D1-3 | 2 | `client/README.md` | K2-DIR-CLIENT |
| D1-4 | 2 | `KARVIA_STRATEGY/README.md` | K1-DIR-STRATEGY |
| D1-5 | 2 | `.claude/README.md` | K4-DIR-CLAUDE |
| D1-6 | 2 | `tests/README.md` | K2-DIR-TESTS |

### D1-1: Root README.md (3 pts)

The root README becomes the **master navigation hub**:

```markdown
# Karvia Business

> B2B OKR Management Platform for Service Businesses

<!--
DOC-META:
  id: K0-CORE-002
  version: 2.0.0
  tier: K0
  status: active
-->

## Quick Navigation

### Core Directories

| Directory | Purpose | README |
|-----------|---------|--------|
| [server/](./server/) | Backend API (Express + MongoDB) | [README](./server/README.md) |
| [client/](./client/) | Frontend (HTML/JS/CSS) | [README](./client/README.md) |
| [tests/](./tests/) | Test suites | [README](./tests/README.md) |

### Documentation

| Directory | Purpose | README |
|-----------|---------|--------|
| [KARVIA_STRATEGY/](./KARVIA_STRATEGY/) | Product & delivery docs | [README](./KARVIA_STRATEGY/README.md) |
| [.claude/](./claude/) | AI session management | [README](./.claude/README.md) |
| [docs/](./docs/) | User & API guides | [README](./docs/README.md) |

### Key Documents

| Document | Doc ID | Description |
|----------|--------|-------------|
| [CLAUDE.md](./CLAUDE.md) | K0-CORE-001 | AI instructions |
| [CLAUDE_STRATEGY.md](./CLAUDE_STRATEGY.md) | K0-CORE-003 | Session framework |

## Document Registry

See [.claude/DOC_REGISTRY.json](./.claude/DOC_REGISTRY.json) for complete documentation index.

## Getting Started

[Existing quick start content...]
```

---

## Epic D2: KARVIA_STRATEGY READMEs (20 pts)

**Purpose**: Create READMEs for all KARVIA_STRATEGY subfolders.

| Story | Points | Area | Folders |
|-------|--------|------|---------|
| D2-1 | 5 | `1-PRODUCT/` | 8 folders |
| D2-2 | 5 | `2-TECHNICAL/` | 6 folders |
| D2-3 | 5 | `3-DELIVERY/1-SPRINTS/` | 20 folders |
| D2-4 | 3 | `3-DELIVERY/2-QA-AND-TESTING/` | 8 folders |
| D2-5 | 2 | `GUIDES/`, `ARCHIVE/` | 5 folders |

### Sample: 1-SPRINTS/README.md

```markdown
# Sprints

<!--
DOC-META:
  id: K3-DIR-SPRINTS
  type: directory
  parent: K3-DIR-DELIVERY
  file_count: 45
  subfolder_count: 20
-->

> **Navigation**: [Root](../../../README.md) → [KARVIA_STRATEGY](../../README.md) → [3-DELIVERY](../README.md) → **1-SPRINTS**

---

## Purpose

Contains all sprint planning and execution documentation. Each sprint folder includes master plans, epic definitions, handoff documents, and session notes.

## Active Sprint

| Sprint | Status | Points | Focus |
|--------|--------|--------|-------|
| [Sprint 15-A](./SPRINT-15A%20(In%20Progress)/) | IN PROGRESS | 85 | LLM Context + Emails |

## Sprint History

| Sprint | Status | Points | Highlights |
|--------|--------|--------|------------|
| [Sprint 15](./SPRINT-15%20(Complete)/) | Complete | 26 | Seamless Onboarding |
| [Sprint 14](./SPRINT-14%20(Complete)/) | Complete | 27 | UI Polish |
| [Sprint 13](./SPRINT-13%20(Complete)/) | Complete | 72 | Unified Context |
| ... | ... | ... | ... |

## Planned Sprints

| Sprint | Status | Points | Focus |
|--------|--------|--------|-------|
| [Sprint 16-D](./SPRINT-16D%20(Planned)/) | PLANNED | 81 | Documentation Infrastructure |

---

*Last updated: 2026-03-06*
```

---

## Epic D3: Metadata Headers (15 pts)

**Purpose**: Add metadata headers to K0-K2 tier documents.

| Story | Points | Tier | Docs |
|-------|--------|------|------|
| D3-1 | 3 | K0 Constitutional | 3 files |
| D3-2 | 5 | K1 Product | ~30 files |
| D3-3 | 5 | K2 Technical | ~25 files |
| D3-4 | 2 | Validation | Ensure parseable |

### Metadata Header Format

```markdown
# [Document Title]

<!--
DOC-META:
  id: K1-PROD-001
  version: 1.2.0
  created: 2025-11-01
  updated: 2026-03-06
  status: active
  tier: K1
  owner: product-team
  parent: K0-CORE-002
  children: [K1-PROD-002, K1-PROD-003]
  related: [K2-ARCH-001]
  tags: [roadmap, product, planning]
-->

**Doc ID**: K1-PROD-001
**Version**: 1.2.0
**Last Updated**: 2026-03-06
**Status**: Active
**Tier**: K1 (Product)

---

> **HIERARCHY**:
> - **Parent**: [Root README](../../README.md)
> - **Related**: [Architecture](../2-TECHNICAL/ARCHITECTURE.md)

---

[Document content...]
```

---

## Epic D4: Tooling & Registry (15 pts)

**Purpose**: Create automation tools for registry management.

| Story | Points | Tool | Purpose |
|-------|--------|------|---------|
| D4-1 | 5 | `doc-registry-generator.js` | Parse all docs, build JSON |
| D4-2 | 3 | `dependency-checker.js` | Flag affected docs on change |
| D4-3 | 3 | `readme-validator.js` | Validate README structure |
| D4-4 | 2 | `orphan-detector.js` | Find unlinked files |
| D4-5 | 2 | npm scripts | `npm run docs:*` commands |

### D4-1: doc-registry-generator.js

Location: `.claude/tools/doc-registry-generator.js`

```javascript
/**
 * Scans all .md files, extracts DOC-META comments, builds registry
 *
 * Usage: node .claude/tools/doc-registry-generator.js
 * Output: .claude/DOC_REGISTRY.json
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function extractMetadata(content) {
  const match = content.match(/<!--\s*DOC-META:\s*([\s\S]*?)-->/);
  if (!match) return null;
  // Parse YAML-like metadata
  return parseMetadata(match[1]);
}

function generateRegistry() {
  const docs = [];
  const directories = [];
  const orphans = [];

  // Scan all .md files
  const files = glob.sync('**/*.md', {
    ignore: ['node_modules/**', '.git/**']
  });

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const meta = extractMetadata(content);

    if (meta) {
      docs.push({ path: file, ...meta });
    } else {
      orphans.push(file);
    }
  }

  return {
    version: '1.0.0',
    generated: new Date().toISOString(),
    stats: {
      total_documents: docs.length,
      orphans: orphans.length
    },
    documents: docs,
    orphans: orphans
  };
}
```

### D4-2: dependency-checker.js

```javascript
/**
 * Given a changed document, identify all affected documents
 *
 * Usage: node .claude/tools/dependency-checker.js K2-ARCH-001
 */

function checkDependencies(docId) {
  const registry = require('../DOC_REGISTRY.json');
  const doc = registry.documents.find(d => d.id === docId);

  if (!doc) {
    console.error(`Document ${docId} not found`);
    return;
  }

  const affected = {
    direct: registry.documents.filter(d =>
      d.parent === docId ||
      d.related?.includes(docId)
    ),
    readmes: findAffectedReadmes(doc.path)
  };

  console.log(`\n⚠️  Document ${docId} modified\n`);
  console.log('AFFECTED DOCUMENTS:');
  affected.direct.forEach(d => console.log(`  - ${d.id}: ${d.path}`));
  console.log('\nREADMEs to update:');
  affected.readmes.forEach(r => console.log(`  - ${r}`));
}
```

### D4-5: npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "docs:generate": "node .claude/tools/doc-registry-generator.js",
    "docs:validate": "node .claude/tools/readme-validator.js",
    "docs:check-deps": "node .claude/tools/dependency-checker.js",
    "docs:find-orphans": "node .claude/tools/orphan-detector.js"
  }
}
```

---

## Epic D5: Remaining Folders (10 pts)

**Purpose**: Auto-generate READMEs for 350+ remaining folders.

| Story | Points | Scope |
|-------|--------|-------|
| D5-1 | 5 | `readme-generator.js` - Auto-generate from folder contents |
| D5-2 | 3 | Run on `tests/`, `server/`, `client/` trees |
| D5-3 | 2 | Manual review and fix outliers |

### D5-1: readme-generator.js

```javascript
/**
 * Generates README.md for a folder based on its contents
 *
 * Usage: node .claude/tools/readme-generator.js ./server/routes
 */

function generateReadme(folderPath) {
  const items = fs.readdirSync(folderPath, { withFileTypes: true });
  const folders = items.filter(i => i.isDirectory());
  const files = items.filter(i => i.isFile());

  const folderName = path.basename(folderPath);
  const parentPath = path.dirname(folderPath);

  return `# ${folderName}

<!--
DOC-META:
  id: K4-DIR-${folderName.toUpperCase()}
  type: directory
  generated: true
-->

> **Navigation**: [Parent](../README.md) → **${folderName}**

---

## Contents

| Item | Type | Description |
|------|------|-------------|
${folders.map(f => `| [${f.name}/](./${f.name}/) | Folder | - |`).join('\n')}
${files.map(f => `| [${f.name}](./${f.name}) | File | - |`).join('\n')}

---

*Auto-generated: ${new Date().toISOString().split('T')[0]}*
`;
}
```

---

## Epic D6: Root Folder Restructure (20 pts)

**Purpose**: Clean up root folder by relocating documentation to proper locations and merging legacy folders.

**Status**: PARTIALLY COMPLETE (14 files relocated on 2026-03-06)

### Completed Work (Session 2026-03-06)

| Task | Files | Destination |
|------|-------|-------------|
| Deployment docs | 7 files | `KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/1-DEPLOYMENT/` |
| Product docs | 4 files | `KARVIA_STRATEGY/1-PRODUCT/` |
| Testing guide | 1 file | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/` |
| Sprint tracking | 1 file | `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/` |
| Session framework | 1 file | `.claude/` |

**Files Relocated**:
- `DEPLOY_PREPROD_CHECKLIST.md` → `3-RELEASE-ENGINEERING/1-DEPLOYMENT/`
- `DEPLOYMENT_PACKAGE_SUMMARY.md` → `3-RELEASE-ENGINEERING/1-DEPLOYMENT/`
- `ENVIRONMENT_COMPARISON.md` → `3-RELEASE-ENGINEERING/1-DEPLOYMENT/`
- `PREPROD_DEPLOYMENT_GUIDE.md` → `3-RELEASE-ENGINEERING/1-DEPLOYMENT/`
- `RENDER_ENV_VARS_PREPROD.txt` → `3-RELEASE-ENGINEERING/1-DEPLOYMENT/`
- `RENDER_PREPROD_ENV_SETUP.md` → `3-RELEASE-ENGINEERING/1-DEPLOYMENT/`
- `SEED_PREPROD_DATABASE.md` → `3-RELEASE-ENGINEERING/1-DEPLOYMENT/`
- `KARVIA_PRODUCT_OVERVIEW.md` → `1-PRODUCT/`
- `KARVIA_SIMPLE_ONEPAGE.md` → `1-PRODUCT/`
- `KARVIA_USER_FLOW_SIMPLE.md` → `1-PRODUCT/user-journeys/`
- `ASSESSMENT_HUB_CONSULTANT_ANALYSIS.md` → `1-PRODUCT/strategy/`
- `LOCAL_TESTING_GUIDE.md` → `2-QA-AND-TESTING/`
- `STORY_POINTS_DELIVERED.md` → `1-SPRINTS/`
- `CLAUDE_SESSION_FRAMEWORK.md` → `.claude/`

### Remaining Stories

| Story | Points | Task | Status |
|-------|--------|------|--------|
| D6-1 | 5 | Merge `Karvia_OKR_Product_Planning/` into `KARVIA_STRATEGY/1-PRODUCT/` | Pending |
| D6-2 | 3 | Merge `Karvia_OKR_Mockups/` into `KARVIA_STRATEGY/1-PRODUCT/mockups/` | Pending |
| D6-3 | 5 | Review and merge `docs/` with `KARVIA_STRATEGY/` | Pending |
| D6-4 | 2 | Archive root `bramhi/` folder (if exists) | Pending |
| D6-5 | 5 | Update CLAUDE.md references after relocations | Pending |

### D6-1: Merge Karvia_OKR_Product_Planning (5 pts)

Current structure:
```
Karvia_OKR_Product_Planning/
├── MASTER_DEV_LIST.md
├── MASTER_ISSUES_LIST.md
└── ... (other planning docs)
```

Merge into:
```
KARVIA_STRATEGY/1-PRODUCT/
├── planning/
│   ├── MASTER_DEV_LIST.md
│   ├── MASTER_ISSUES_LIST.md
│   └── ...
```

### D6-2: Merge Karvia_OKR_Mockups (3 pts)

Move all mockup files to `KARVIA_STRATEGY/1-PRODUCT/mockups/`

### D6-3: Review docs/ Folder (5 pts)

Evaluate overlap with KARVIA_STRATEGY and consolidate.

---

## Epic D7: Command System Update (16 pts)

**Purpose**: Modernize all 13 slash commands with consistent formatting, updated references, and v2.0 standards.

| Story | Points | Task |
|-------|--------|------|
| D7-1 | 3 | Audit all 13 commands, document current state |
| D7-2 | 4 | Update `/init` and `/close` to v2.1 (core workflow) |
| D7-3 | 4 | Update `/coding`, `/strategy`, `/audit`, `/testing` |
| D7-4 | 3 | Update `/general`, `/design`, `/insights` |
| D7-5 | 2 | Create COMMANDS_REGISTRY.md with version tracking |

### D7-1: Command Audit (3 pts)

Audit each command file for:
- Outdated references (e.g., "Sprint 3" hardcoded)
- Stale file paths
- Missing Session Seal verification
- Inconsistent formatting

**Deliverable**: `COMMAND_AUDIT_RESULTS.md`

### D7-2: Core Workflow Commands (4 pts)

Update `/init` and `/close` with:
- Dynamic sprint detection (no hardcoded sprint numbers)
- Updated file path references
- Consistent Session Seal format
- Version bump to 2.1.0

### D7-3: Session Type Commands (4 pts)

Update `/coding`, `/strategy`, `/audit`, `/testing` with:
- Aligned quality gates
- Consistent token budgets
- Updated handoff references
- Version bump to 1.1.0

### D7-4: Utility Commands (3 pts)

Update `/general`, `/design`, `/insights` with:
- Consistent structure
- Updated references
- Version bump to 1.1.0

### D7-5: Commands Registry (2 pts)

Create `.claude/COMMANDS_REGISTRY.md`:

```markdown
# Commands Registry

| Command | Version | Last Updated | Status |
|---------|---------|--------------|--------|
| /init | 2.1.0 | 2026-03-18 | Active |
| /close | 2.1.0 | 2026-03-18 | Active |
| ... | ... | ... | ... |
```

---

## Epic D8: Document Relevance System (12 pts)

**Purpose**: Implement R0-R3 tier classification for document lifecycle management.

| Story | Points | Task |
|-------|--------|------|
| D8-1 | 3 | Define R0-R3 tier system specification |
| D8-2 | 4 | Tag all .claude docs with relevance tier |
| D8-3 | 3 | Create relevance-checker.js tool |
| D8-4 | 2 | Update DOC_REGISTRY schema with tier field |

### D8-1: Tier System Specification (3 pts)

Define 4-tier relevance system:

```markdown
## Relevance Tiers

| Tier | Label | Retention | Git Status | Example |
|------|-------|-----------|------------|---------|
| R0 | Constitutional | Forever | Always in Git | CLAUDE.md, SESSION_LOG.md |
| R1 | Active | Until superseded | In Git | Current sprint plans, commands |
| R2 | Historical | Archive folder | Git archive | Completed sprints (S3-S17) |
| R3 | Local-Only | Never commit | .gitignore | One-time analysis, scratch |
```

**Transition Rules**:
- R1 → R2: When sprint completes or doc is superseded
- R2 → R3: Manual decision (storage optimization)
- R0 never transitions

### D8-2: Tag All Documents (4 pts)

Add relevance tier to each doc's metadata header:

```markdown
<!--
DOC-META:
  id: K3-SPR-020
  relevance: R1
  archive_date: null
-->
```

**Documents to tag**: ~46 in .claude/

### D8-3: Relevance Checker Tool (3 pts)

Create `.claude/tools/relevance-checker.js`:

```javascript
/**
 * Scans all docs, validates relevance tiers, suggests transitions
 *
 * Usage: node .claude/tools/relevance-checker.js
 */

function checkRelevance() {
  // Find docs with missing relevance tier
  // Find R1 docs older than 90 days
  // Suggest R1→R2 transitions for completed sprints
  // Flag R3 files that are in Git
}
```

### D8-4: Update Registry Schema (2 pts)

Add `relevance` field to `DOC_REGISTRY_SCHEMA.json`:

```json
{
  "relevance": {
    "type": "string",
    "enum": ["R0", "R1", "R2", "R3"]
  },
  "archive_date": {
    "type": "string",
    "format": "date"
  }
}
```

---

## Epic D9: Local Archive Strategy (18 pts)

**Purpose**: Create `.local/` folder structure, migrate completed sprints from Git.

| Story | Points | Task |
|-------|--------|------|
| D9-1 | 3 | Create `.local/` folder structure |
| D9-2 | 2 | Update `.gitignore` for local files |
| D9-3 | 4 | Create archive-manager.js tool |
| D9-4 | 5 | Migrate completed sprints (S3-S17) to local |
| D9-5 | 2 | Create ARCHIVE_POLICY.md |
| D9-6 | 2 | Verify Git size reduction |

### D9-1: Local Folder Structure (3 pts)

Create `.local/` hierarchy:

```
.local/                          # .gitignored
├── README.md                    # Explains what's here
├── sprints/                     # Archived sprint folders
│   ├── SPRINT-3 (Complete)/
│   ├── SPRINT-5 (Complete)/
│   └── ...
├── audits/                      # Historical audit reports
├── comparisons/                 # One-time comparison docs
├── scratch/                     # Temporary working files
└── backups/                     # Auto-backup of key files
```

### D9-2: Gitignore Update (2 pts)

Add to `.gitignore`:

```gitignore
# Local-only documentation (not tracked in Git)
.local/

# Large generated files
*.zip
**/*-archive-*.tar.gz

# Temporary scratch files
**/scratch/
**/.scratch/
```

### D9-3: Archive Manager Tool (4 pts)

Create `.claude/tools/archive-manager.js`:

```javascript
/**
 * Manages document archival between Git and local
 *
 * Usage:
 *   node archive-manager.js archive SPRINT-5   # Move to .local/
 *   node archive-manager.js restore SPRINT-5   # Restore from .local/
 *   node archive-manager.js list               # Show archived items
 *   node archive-manager.js size               # Show Git vs local sizes
 */

async function archiveSprint(sprintName) {
  // 1. Verify sprint exists in Git
  // 2. Copy to .local/sprints/
  // 3. Remove from Git (git rm -r)
  // 4. Update ARCHIVE_MANIFEST.json
  // 5. Commit removal
}

async function restoreSprint(sprintName) {
  // 1. Verify sprint exists in .local/
  // 2. Copy back to KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/
  // 3. Remove from .local/ (optional)
  // 4. Update manifest
}
```

### D9-4: Migrate Completed Sprints (5 pts)

Move these completed sprints to `.local/sprints/`:

| Sprint | Status | Size | Action |
|--------|--------|------|--------|
| SPRINT-3 (Complete) | ✅ | ~200KB | Archive |
| SPRINT-5 (Complete) | ✅ | ~150KB | Archive |
| SPRINT-7 (Complete) | ✅ | ~180KB | Archive |
| SPRINT-8 (Complete) | ✅ | ~200KB | Archive |
| SPRINT-9 (Complete) | ✅ | ~170KB | Archive |
| SPRINT-10 (Complete) | ✅ | ~190KB | Archive |
| SPRINT-11 (Complete) | ✅ | ~220KB | Archive |
| SPRINT-12 (Complete) | ✅ | ~180KB | Archive |
| SPRINT-13 (Complete) | ✅ | ~210KB | Archive |
| SPRINT-15 (Complete) | ✅ | ~160KB | Archive |
| SPRINT-15A (Complete) | ✅ | ~140KB | Archive |
| SPRINT-16 (Complete) | ✅ | ~150KB | Archive |
| SPRINT-17 (Complete) | ✅ | ~130KB | Archive |

**Total estimated size**: ~2.3MB removed from Git

### D9-5: Archive Policy Document (2 pts)

Create `.local/ARCHIVE_POLICY.md`:

```markdown
# Local Archive Policy

## What Gets Archived

| Category | Criteria | Destination |
|----------|----------|-------------|
| Completed Sprints | Status = Complete, Age > 90 days | .local/sprints/ |
| Audit Reports | Merged into AUDIT_TRACKER | .local/audits/ |
| One-time Analysis | Non-recurring documents | .local/comparisons/ |

## Retention

- **Sprints**: Keep forever locally
- **Audits**: Keep 1 year, then delete
- **Comparisons**: Keep 6 months

## Restore Process

```bash
node .claude/tools/archive-manager.js restore SPRINT-5
```
```

### D9-6: Verify Git Reduction (2 pts)

Run before/after Git size check:

```bash
# Before
git count-objects -vH

# After migration
git count-objects -vH

# Expected reduction: ~2-3MB
```

---

## Implementation Schedule

| Day | Focus | Points | Deliverables |
|-----|-------|--------|--------------|
| 1 | D0: Foundation | 8 | Standards, templates |
| 2 | D1: Core READMEs | 13 | Root, server, client, strategy |
| 3 | D2-1, D2-2: Product & Technical | 10 | 14 READMEs |
| 4 | D2-3: Sprints tree | 5 | 20 READMEs |
| 5 | D2-4, D2-5: QA & Guides | 5 | 13 READMEs |
| 6 | D3: Metadata headers | 15 | 75 docs updated |
| 7 | D4: Tooling | 15 | 4 tools + npm scripts |
| 8 | D5: Auto-generation | 10 | 350+ READMEs |
| 9 | D6: Root cleanup | 20 | Folder merges, reference updates |
| **10** | **D7: Command System Update** | **16** | **13 commands v2.0, registry** |
| **11** | **D8: Document Relevance** | **12** | **R0-R3 system, checker tool** |
| **12** | **D9: Local Archive** | **18** | **.local/ created, 13 sprints migrated** |

---

## Success Criteria

### Quantitative

- [ ] 421/421 folders have README.md (100%)
- [ ] 75+ high-value docs have metadata headers
- [ ] 0 orphaned files in registry
- [ ] 4 automation tools functional
- [ ] `npm run docs:validate` passes
- [ ] **All 13 commands updated to v2.0+**
- [ ] **All docs tagged with R0-R3 tier**
- [ ] **13 completed sprints moved to .local/**
- [ ] **Git size reduced by ~2MB**

### Qualitative

- [ ] Can navigate from root to any folder via README links
- [ ] Any doc change triggers dependency alert
- [ ] New contributors can understand structure in <5 minutes
- [ ] Registry JSON is machine-parseable
- [ ] **Commands have no hardcoded sprint references**
- [ ] **Clear separation between Git and local-only files**

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Scope creep to code files | Strict boundary: .md files only |
| Link rot (broken links) | `readme-validator.js` detects broken links |
| Registry out of sync | `docs:generate` in CI/CD or pre-commit |
| Metadata format errors | Validation in generator tool |

---

## Post-Sprint Maintenance

After Sprint 16-D, the system is self-maintaining via:

1. **Pre-commit hook**: Run `npm run docs:validate`
2. **New folder**: Copy `README_TEMPLATE.md`, fill in
3. **Doc changes**: Run `npm run docs:check-deps [doc-id]`
4. **Weekly**: Run `npm run docs:generate` to refresh registry

---

## Files to Create

### Original (D0-D6)

| File | Location | Purpose |
|------|----------|---------|
| `DOC_STANDARDS.md` | `KARVIA_STRATEGY/GUIDES/documentation-standards/` | Master spec |
| `README_TEMPLATE.md` | `KARVIA_STRATEGY/GUIDES/documentation-standards/` | Folder template |
| `METADATA_HEADER_TEMPLATE.md` | `KARVIA_STRATEGY/GUIDES/documentation-standards/` | Header template |
| `DOC_REGISTRY_SCHEMA.json` | `.claude/` | JSON schema |
| `DOC_REGISTRY.json` | `.claude/` | Generated registry |
| `doc-registry-generator.js` | `.claude/tools/` | Generator tool |
| `dependency-checker.js` | `.claude/tools/` | Dependency tool |
| `readme-validator.js` | `.claude/tools/` | Validation tool |
| `orphan-detector.js` | `.claude/tools/` | Orphan finder |
| `readme-generator.js` | `.claude/tools/` | Auto-generator |

### New (D7-D9)

| File | Location | Purpose |
|------|----------|---------|
| `COMMANDS_REGISTRY.md` | `.claude/` | Command version tracking |
| `COMMAND_AUDIT_RESULTS.md` | `.claude/` | Audit findings |
| `RELEVANCE_TIERS.md` | `.claude/` | R0-R3 specification |
| `relevance-checker.js` | `.claude/tools/` | Tier validation tool |
| `archive-manager.js` | `.claude/tools/` | Local archive tool |
| `ARCHIVE_POLICY.md` | `.local/` | Archive rules |
| `ARCHIVE_MANIFEST.json` | `.local/` | Archived items index |

---

**Document Version**: 2.0.0
**Created**: 2026-03-06
**Updated**: 2026-03-18
**Author**: Claude Code

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-03-18 | Added Epics D7, D8, D9 (+46 pts): Command System Update, Document Relevance, Local Archive Strategy |
| 1.1.0 | 2026-03-06 | Added Epic D6: Root Folder Restructure (20 pts), relocated 14 docs |
| 1.0.0 | 2026-03-06 | Initial sprint plan with Epics D0-D5 (81 pts) |
