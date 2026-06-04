# Documentation Standards

<!--
DOC-META:
  id: K1-DIR-DOCSTD
  type: directory
  created: 2025-10-24
  updated: 2026-03-06
  file_count: 8
  subfolder_count: 0
  parent: K1-DIR-GUIDES
-->

> **Navigation**: [Root](../../../../README.md) → [KARVIA_STRATEGY](../../../README.md) → [GUIDES](../README.md) → **documentation-standards**

---

## Purpose

Documentation about the documentation system itself - standards, editing rules, version control, templates, and structural guidelines. This is the authoritative source for how to create and maintain documentation in Karvia Business.

---

## Structure

| Item | Type | Description | Doc ID |
|------|------|-------------|--------|
| [DOC_STANDARDS.md](./DOC_STANDARDS.md) | File | **NEW** Master spec: K0-K4 tiers, Doc IDs, metadata | K1-GUIDE-001 |
| [README_TEMPLATE.md](./README_TEMPLATE.md) | File | **NEW** Copy-paste template for folder READMEs | K1-GUIDE-002 |
| [DOCUMENTATION_STANDARDS.md](./DOCUMENTATION_STANDARDS.md) | File | Legacy standards (pre-Sprint 16-D) | - |
| [DOC_EDITING_RULES.md](./DOC_EDITING_RULES.md) | File | Rules for editing existing docs | - |
| [VERSION_CONTROL_GUIDE.md](./VERSION_CONTROL_GUIDE.md) | File | Git workflow for documentation | - |
| [STRUCTURE_PROPOSAL.md](./STRUCTURE_PROPOSAL.md) | File | Folder structure rationale | - |
| [DOCUMENTATION_MIGRATION_AUDIT_REPORT.md](./DOCUMENTATION_MIGRATION_AUDIT_REPORT.md) | File | Oct 2025 migration audit | - |

---

## Quick Start

### Creating a New Folder README

1. Copy template from [README_TEMPLATE.md](./README_TEMPLATE.md)
2. Replace all `[PLACEHOLDERS]`
3. Assign Doc ID following `K[TIER]-DIR-[NAME]` pattern
4. Update parent folder's README

### Adding Metadata to Existing Document

1. Read [DOC_STANDARDS.md](./DOC_STANDARDS.md) for full specification
2. Add DOC-META comment block at top of file
3. Assign Doc ID following `K[TIER]-[DOMAIN]-[NUMBER]` pattern
4. Run `npm run docs:generate` to update registry

### Writing New Documentation

Read [DOCUMENTATION_STANDARDS.md](./DOCUMENTATION_STANDARDS.md) for writing guidelines.

### Editing Existing Documentation

Read [DOC_EDITING_RULES.md](./DOC_EDITING_RULES.md) for editing rules.

### Git Workflow for Docs

Read [VERSION_CONTROL_GUIDE.md](./VERSION_CONTROL_GUIDE.md) for commit conventions.

---

## Related Documents

- [Sprint 16-D Master Plan](../../../3-DELIVERY/1-SPRINTS/SPRINT-16D%20(Planned)/SPRINT-16D-MASTER-PLAN.md) - Implementation sprint
- [CLAUDE.md](../../../../CLAUDE.md) - AI instructions
- [AI Guides](../ai-guides/) - Claude AI interaction guides
- [Quick Start](../quick-start/) - Onboarding guides

---

*Last updated: 2026-03-06*
