# README Template

<!--
DOC-META:
  id: K1-GUIDE-002
  version: 1.0.0
  created: 2026-03-06
  updated: 2026-03-06
  status: active
  tier: K1
  owner: claude
  parent: K1-GUIDE-001
  children: []
  related: [K1-GUIDE-003]
  tags: [template, readme, documentation]
-->

**Doc ID**: K1-GUIDE-002
**Version**: 1.0.0
**Last Updated**: 2026-03-06
**Status**: Active
**Tier**: K1 (Product)

---

> **HIERARCHY**:
> - **Parent**: [DOC_STANDARDS.md](./DOC_STANDARDS.md)
> - **Related**: [METADATA_HEADER_TEMPLATE.md](./METADATA_HEADER_TEMPLATE.md)

---

## Usage

Copy the template below when creating a new folder README. Replace all `[PLACEHOLDERS]` with actual values.

---

## Template

````markdown
# [Folder Name]

<!--
DOC-META:
  id: [K#-DIR-FOLDERNAME]
  type: directory
  created: [YYYY-MM-DD]
  updated: [YYYY-MM-DD]
  file_count: [N]
  subfolder_count: [N]
  parent: [K#-DIR-PARENT]
-->

> **Navigation**: [Root](../../../README.md) → [Grandparent](../../README.md) → [Parent](../README.md) → **[Folder Name]**

---

## Purpose

[1-2 sentences describing what this folder contains and why it exists.]

---

## Structure

| Item | Type | Description | Doc ID |
|------|------|-------------|--------|
| [subfolder/](./subfolder/) | Folder | [Brief description] | [K#-DIR-XXX] |
| [another-folder/](./another-folder/) | Folder | [Brief description] | [K#-DIR-XXX] |
| [document.md](./document.md) | File | [Brief description] | [K#-XXX-NNN] |
| [another-doc.md](./another-doc.md) | File | [Brief description] | [K#-XXX-NNN] |

---

## Quick Links

- **Most Used**: [Link to frequently accessed item](./path)
- **Latest**: [Link to most recent item](./path)

---

## Dependencies

### This folder depends on

| Dependency | Reason |
|------------|--------|
| [Folder/Doc Name](../path/) | [Why this folder needs it] |

### Folders that depend on this

| Dependent | Reason |
|-----------|--------|
| [Folder/Doc Name](../path/) | [Why they need this folder] |

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| [YYYY-MM-DD] | [What changed] | [Who] |

---

*Last updated: [YYYY-MM-DD]*
````

---

## Examples

### Example 1: Sprint Folder README

```markdown
# SPRINT-15A (In Progress)

<!--
DOC-META:
  id: K3-DIR-SPR15A
  type: directory
  created: 2026-03-06
  updated: 2026-03-06
  file_count: 8
  subfolder_count: 0
  parent: K3-DIR-SPRINTS
-->

> **Navigation**: [Root](../../../../README.md) → [KARVIA_STRATEGY](../../../README.md) → [3-DELIVERY](../../README.md) → [1-SPRINTS](../README.md) → **SPRINT-15A**

---

## Purpose

Sprint 15-A addresses LLM context intelligence, task email notifications, and documentation infrastructure. 85 story points over 1 week.

---

## Structure

| Item | Type | Description | Doc ID |
|------|------|-------------|--------|
| [SPRINT-15A-MASTER-PLAN.md](./SPRINT-15A-MASTER-PLAN.md) | File | Complete sprint specification | K3-SPR-015A |
| [SPRINT15A_HANDOFF_DOCUMENT.md](./SPRINT15A_HANDOFF_DOCUMENT.md) | File | Session progress tracking | K4-HAND-015A |
| [EPIC-T-TESTING-INFRASTRUCTURE.md](./EPIC-T-TESTING-INFRASTRUCTURE.md) | File | Epic T definition | K3-EPIC-015A-T |
| [EMAIL-DESIGN-SYSTEM.md](./EMAIL-DESIGN-SYSTEM.md) | File | Email template designs | K3-EPIC-015A-E |

---

## Quick Links

- **Master Plan**: [SPRINT-15A-MASTER-PLAN.md](./SPRINT-15A-MASTER-PLAN.md)
- **Current Progress**: [SPRINT15A_HANDOFF_DOCUMENT.md](./SPRINT15A_HANDOFF_DOCUMENT.md)

---

*Last updated: 2026-03-06*
```

### Example 2: Technical Folder README

```markdown
# server

<!--
DOC-META:
  id: K2-DIR-SERVER
  type: directory
  created: 2025-10-01
  updated: 2026-03-06
  file_count: 45
  subfolder_count: 12
  parent: K0-CORE-002
-->

> **Navigation**: [Root](../README.md) → **server**

---

## Purpose

Backend API server built with Express.js and MongoDB. Handles authentication, multi-tenant data isolation, and RESTful endpoints for the OKR management system.

---

## Structure

| Item | Type | Description | Doc ID |
|------|------|-------------|--------|
| [routes/](./routes/) | Folder | Express route handlers | K2-DIR-ROUTES |
| [models/](./models/) | Folder | Mongoose data models | K2-DIR-MODELS |
| [services/](./services/) | Folder | Business logic services | K2-DIR-SERVICES |
| [middleware/](./middleware/) | Folder | Express middleware | K2-DIR-MIDDLEWARE |
| [config/](./config/) | Folder | Configuration files | K2-DIR-CONFIG |
| [index.js](./index.js) | File | Server entry point | - |

---

## Key Files

| File | Purpose |
|------|---------|
| `index.js` | Main server entry, Express setup |
| `config/default.js` | Default configuration |
| `middleware/auth.js` | JWT authentication |

---

## Dependencies

### This folder depends on

| Dependency | Reason |
|------------|--------|
| MongoDB | Database storage |
| OpenAI API | AI-powered features |
| Mailjet | Email delivery |

### Folders that depend on this

| Dependent | Reason |
|-----------|--------|
| [client/](../client/) | Consumes API endpoints |
| [tests/](../tests/) | Tests server code |

---

*Last updated: 2026-03-06*
```

---

## Checklist for New READMEs

- [ ] Title matches folder name
- [ ] DOC-META block is valid YAML-like format
- [ ] Navigation breadcrumb links are correct
- [ ] Purpose is concise (1-2 sentences)
- [ ] Structure table includes all subfolders
- [ ] Structure table includes key files (not all)
- [ ] Doc IDs assigned to all items
- [ ] Dependencies section completed (if applicable)
- [ ] Last updated date is current

---

**Document Version**: 1.0.0
**Created**: 2026-03-06
**Author**: Claude Code
