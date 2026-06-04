# Karvia Documentation Standards

<!--
DOC-META:
  id: K1-GUIDE-001
  version: 1.0.0
  created: 2026-03-06
  updated: 2026-03-06
  status: active
  tier: K1
  owner: claude
  parent: K0-CORE-002
  children: [K1-GUIDE-002, K1-GUIDE-003]
  related: [K0-CORE-001]
  tags: [standards, documentation, meta]
-->

**Doc ID**: K1-GUIDE-001
**Version**: 1.0.0
**Last Updated**: 2026-03-06
**Status**: Active
**Tier**: K1 (Product - Requires Approval to Modify)

---

> **HIERARCHY**:
> - **Parent**: [Root README](../../../README.md)
> - **Children**: [README Template](./README_TEMPLATE.md), [Metadata Template](./METADATA_HEADER_TEMPLATE.md)

---

## Overview

This document defines the standards for all documentation in the Karvia Business codebase. Following these standards ensures:

1. **Navigability** - Any file reachable via README links from root
2. **Traceability** - Every document has a unique ID and version
3. **Dependency Awareness** - Changes flag affected documents
4. **Zero Orphans** - No disconnected files or folders

---

## 1. Tier System (K0-K4)

All documentation is classified into five tiers based on authority level:

### K0 - Constitutional (Immutable Core)

**Purpose**: Foundational documents that define the system itself.

| Characteristic | Value |
|----------------|-------|
| Modification | NEVER without explicit approval |
| Examples | `CLAUDE.md`, Root `README.md`, `CLAUDE_STRATEGY.md` |
| Approvers | Project owner only |
| Doc ID Pattern | `K0-CORE-NNN` |

### K1 - Product (Business Authority)

**Purpose**: Product requirements, roadmaps, and business specifications.

| Characteristic | Value |
|----------------|-------|
| Modification | Requires business/product approval |
| Examples | Product roadmap, user stories, personas |
| Approvers | Product team |
| Doc ID Pattern | `K1-[DOMAIN]-NNN` |

### K2 - Technical (Technical Authority)

**Purpose**: Technical specifications, architecture, API contracts.

| Characteristic | Value |
|----------------|-------|
| Modification | Requires technical review |
| Examples | API specs, architecture docs, data models |
| Approvers | Tech lead |
| Doc ID Pattern | `K2-[DOMAIN]-NNN` |

### K3 - Sprint (Execution Documents)

**Purpose**: Sprint plans, epic definitions, implementation specs.

| Characteristic | Value |
|----------------|-------|
| Modification | Claude can modify freely |
| Examples | Sprint master plans, epic breakdowns, test plans |
| Approvers | None required |
| Doc ID Pattern | `K3-[DOMAIN]-NNN` |

### K4 - Session (Operational)

**Purpose**: Session logs, handoffs, working documents.

| Characteristic | Value |
|----------------|-------|
| Modification | Auto-updated during sessions |
| Examples | SESSION_LOG.md, handoff docs, test reports |
| Approvers | None required |
| Doc ID Pattern | `K4-[DOMAIN]-NNN` |

---

## 2. Document ID Convention

### Pattern

```
K[TIER]-[DOMAIN]-[NUMBER]
```

### Domain Codes

| Code | Domain | Typical Tier | Examples |
|------|--------|--------------|----------|
| `CORE` | Core System | K0 | CLAUDE.md, root README |
| `PROD` | Product | K1 | Roadmap, user stories |
| `ARCH` | Architecture | K2 | System design, diagrams |
| `API` | API Specification | K2 | Endpoint docs, contracts |
| `DATA` | Data Models | K2 | Schema definitions |
| `SPR` | Sprint Plans | K3 | Sprint master plans |
| `EPIC` | Epic Definitions | K3 | Epic breakdowns |
| `TEST` | Testing | K3-K4 | Test plans, reports |
| `SESS` | Session Management | K4 | Logs, handoffs |
| `QA` | Quality Assurance | K3 | QA processes |
| `GUIDE` | Guides | K1-K2 | Tutorials, standards |
| `DIR` | Directory README | K0-K4 | Folder navigation |

### Examples

| Doc ID | Document | Tier |
|--------|----------|------|
| `K0-CORE-001` | CLAUDE.md | Constitutional |
| `K0-CORE-002` | Root README.md | Constitutional |
| `K1-PROD-001` | PRODUCT_ROADMAP.md | Product |
| `K2-API-001` | API_SPECIFICATION.md | Technical |
| `K2-DIR-SERVER` | server/README.md | Technical |
| `K3-SPR-015A` | Sprint 15A Master Plan | Sprint |
| `K3-EPIC-015A-01` | Epic A Definition | Sprint |
| `K4-SESS-001` | SESSION_LOG.md | Session |
| `K4-TEST-015A` | Sprint 15A Test Report | Session |

### Number Assignment

- **Sequential within domain**: K1-PROD-001, K1-PROD-002, ...
- **Sprint-suffixed**: K3-SPR-015A (Sprint 15A)
- **Epic-numbered**: K3-EPIC-015A-01 (Epic 1 of Sprint 15A)

---

## 3. Metadata Header Format

Every documentation file must include a metadata header:

### Full Header (K0-K3 Documents)

```markdown
# [Document Title]

<!--
DOC-META:
  id: K2-API-001
  version: 1.2.0
  created: 2025-11-01
  updated: 2026-03-06
  status: active
  tier: K2
  owner: tech-team
  parent: K0-CORE-002
  children: [K2-API-002, K2-API-003]
  related: [K2-ARCH-001, K3-SPR-015]
  tags: [api, specification, endpoints]
-->

**Doc ID**: K2-API-001
**Version**: 1.2.0
**Last Updated**: 2026-03-06
**Status**: Active
**Tier**: K2 (Technical)

---

> **HIERARCHY**:
> - **Parent**: [Root README](../../README.md)
> - **Children**: [Auth API](./API_AUTH.md), [Goals API](./API_GOALS.md)
> - **Related**: [Architecture](../architecture/ARCHITECTURE.md)

---

[Document content begins here...]
```

### Light Header (K4 Session Documents)

```markdown
# [Document Title]

<!--
DOC-META:
  id: K4-SESS-001
  updated: 2026-03-06
  status: active
-->

---

[Document content...]
```

### README Header (Directory READMEs)

```markdown
# [Folder Name]

<!--
DOC-META:
  id: K3-DIR-SPRINTS
  type: directory
  created: 2026-03-06
  updated: 2026-03-06
  file_count: 45
  subfolder_count: 20
  parent: K3-DIR-DELIVERY
-->

> **Navigation**: [Root](../README.md) → [Parent](../README.md) → **Current**

---

[Content...]
```

---

## 4. Status Values

| Status | Meaning | Visual |
|--------|---------|--------|
| `draft` | Work in progress, not authoritative | Draft |
| `active` | Current, authoritative version | Active |
| `deprecated` | Being phased out, avoid new references | Deprecated |
| `archived` | Historical reference only | Archived |

### Status Lifecycle

```
draft → active → deprecated → archived
          ↓
       (update creates new version, stays active)
```

---

## 5. Version Numbering

Semantic versioning: `MAJOR.MINOR.PATCH`

| Component | When to Increment | Example |
|-----------|-------------------|---------|
| **MAJOR** | Breaking changes, major restructure | 1.0.0 → 2.0.0 |
| **MINOR** | New sections, significant additions | 1.0.0 → 1.1.0 |
| **PATCH** | Typos, small fixes, clarifications | 1.0.0 → 1.0.1 |

### Examples

- `1.0.0` - Initial release
- `1.1.0` - Added new section
- `1.1.1` - Fixed typo
- `2.0.0` - Complete restructure

---

## 6. README Requirements

Every folder must have a `README.md` with:

### Required Sections

1. **Title** - Folder name as H1
2. **Metadata** - DOC-META comment block
3. **Navigation** - Breadcrumb to root
4. **Purpose** - 1-2 sentence description
5. **Structure** - Table of contents (folders and key files)

### Optional Sections

6. **Dependencies** - What this folder depends on
7. **Change Log** - Recent changes
8. **Quick Links** - Frequently accessed items

### Template

See [README_TEMPLATE.md](./README_TEMPLATE.md)

---

## 7. Hierarchy Rules

### Parent-Child Relationships

- Every document has **exactly one parent** (except K0-CORE-002, the root)
- The root README (K0-CORE-002) is the ultimate ancestor
- Children are listed in parent's `children` array
- Parent is referenced in child's `parent` field

### Related Documents

- Use `related` for cross-references that aren't hierarchical
- Both documents should reference each other
- Example: Architecture doc ↔ API spec (peers, not parent-child)

### Dependency Declaration

```markdown
## Dependencies

| This document depends on | Reason |
|-------------------------|--------|
| [K2-ARCH-001](../ARCHITECTURE.md) | References system design |

| Depends on this document | Reason |
|-------------------------|--------|
| [K3-SPR-015A](../sprints/SPRINT-15A.md) | Implements this spec |
```

---

## 8. Change Tracking

### Document Change Log

Every K0-K2 document should include a change log:

```markdown
## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.2.0 | 2026-03-06 | Claude | Added email notification section |
| 1.1.0 | 2026-02-20 | Claude | Restructured API endpoints |
| 1.0.0 | 2025-11-01 | Claude | Initial creation |
```

### Dependency Flagging

When a document changes, the dependency checker should flag:

1. **Direct dependents** - Documents that reference this one
2. **READMEs** - Parent folder README needs update
3. **Registry** - DOC_REGISTRY.json needs regeneration

---

## 9. File Organization

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Sprint folders | `SPRINT-XX (Status)/` | `SPRINT-15A (In Progress)/` |
| Master plans | `SPRINT-XX-MASTER-PLAN.md` | `SPRINT-15A-MASTER-PLAN.md` |
| Epic docs | `EPIC-[LETTER]-[NAME].md` | `EPIC-A-CONTEXT-INTEGRATION.md` |
| Handoffs | `SPRINTXX_HANDOFF_DOCUMENT.md` | `SPRINT15A_HANDOFF_DOCUMENT.md` |
| READMEs | `README.md` (always) | `README.md` |

### Folder Depth

- Prefer flat over deep nesting
- Maximum recommended depth: 5 levels from root
- Archive old content rather than deeply nesting

---

## 10. Automation Tools

### Available Tools

| Tool | Command | Purpose |
|------|---------|---------|
| Registry Generator | `npm run docs:generate` | Rebuild DOC_REGISTRY.json |
| Validator | `npm run docs:validate` | Check README structure, links |
| Dependency Checker | `npm run docs:check-deps [id]` | Find affected docs |
| Orphan Detector | `npm run docs:find-orphans` | Find unlinked files |

### When to Run

| Event | Run |
|-------|-----|
| After creating new doc | `docs:generate` |
| Before commit (pre-hook) | `docs:validate` |
| After modifying K0-K2 doc | `docs:check-deps [id]` |
| Weekly maintenance | `docs:find-orphans` |

---

## 11. Exclusions

### Files That DON'T Get Metadata

| File Type | Reason |
|-----------|--------|
| `.js`, `.ts` | Code files use JSDoc |
| `.html`, `.css` | Markup/style files |
| `.json`, `.yaml` | Config files |
| `.env`, `.gitignore` | System files |
| Images, PDFs | Binary files |

### Folders That DON'T Need README

| Folder | Reason |
|--------|--------|
| `node_modules/` | External dependencies |
| `.git/` | Version control |
| `dist/`, `build/` | Build artifacts |

---

## 12. Maintenance Checklist

### Weekly

- [ ] Run `npm run docs:find-orphans`
- [ ] Review deprecated documents for archival
- [ ] Check registry stats for anomalies

### Per Sprint

- [ ] Update sprint folder README
- [ ] Ensure all epic docs have headers
- [ ] Verify parent-child links

### Per Session

- [ ] Update SESSION_LOG.md
- [ ] Create/update handoff document
- [ ] Run `npm run docs:validate`

---

## Quick Reference

### Creating a New Document

1. Copy appropriate template
2. Assign Doc ID: `K[TIER]-[DOMAIN]-[NUMBER]`
3. Fill metadata header
4. Add to parent's `children` list
5. Run `npm run docs:generate`

### Modifying an Existing Document

1. Update `version` (MAJOR.MINOR.PATCH)
2. Update `updated` date
3. Add to change log
4. Run `npm run docs:check-deps [id]`
5. Update flagged documents

### Creating a New Folder

1. Create `README.md` using template
2. Assign Doc ID: `K[TIER]-DIR-[NAME]`
3. Add to parent folder's README
4. Run `npm run docs:generate`

---

**Document Version**: 1.0.0
**Created**: 2026-03-06
**Author**: Claude Code
