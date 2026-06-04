# BRAMHI Framework Master Plan

**Version**: 1.0.0
**Created**: January 7, 2026
**Status**: Active
**Purpose**: Enterprise-ready AI Development Agent standardization across all BRAMHI_LABS projects

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Jan 7, 2026 | BRAMHI_LABS | Initial plan from cross-repo analysis |

---

## Executive Summary

This document defines the **BRAMHI Framework** - a standardized `.claude` folder structure that ensures:
- **Portability**: Same structure works across any codebase
- **Measurability**: Universal KPIs track agent performance
- **Self-Correction**: Automated validation and quality gates
- **Enterprise-Readiness**: Governance, security, and audit compliance

---

## Cross-Repo Analysis Summary

### Current State Assessment

| Repository | Maturity | Governance | Metrics | Automation | Gap Score |
|------------|----------|------------|---------|------------|-----------|
| **iBrain** | 95% | Full | Implicit | Manual | Low |
| **KARVIA Business** | 75% | Partial | Explicit | Scripts | Medium |
| **Prodify** | 60% | Inherited | None | Manual | High |

### Gap Analysis

| Gap ID | Description | Impact | Priority |
|--------|-------------|--------|----------|
| **GAP-001** | No unified folder contract | Agent portability suffers | P0 |
| **GAP-002** | Mixed governance coverage | Inconsistent quality | P0 |
| **GAP-003** | Version drift risk | Auditing/handoffs weaker | P1 |
| **GAP-004** | Metrics not universal | No measurable improvement | P1 |
| **GAP-005** | Missing ops files in Prodify | Incomplete tracking | P1 |
| **GAP-006** | No automated validation | Manual enforcement | P2 |

---

## Canonical Structure Definition

### Required Files (ALL Repos)

```
.claude/                                    # Claude Command Center
│
├── README.md                               # [REQ] Project orientation
├── MASTER_GUIDE.md                         # [REQ] File placement rules
├── BEST_PRACTICES.md                       # [REQ] Quality standards
├── DOCUMENT_STANDARDS.md                   # [REQ] Doc governance + link verification
├── ACCESS_CONTROL.yaml                     # [REQ] Role-based permissions
├── project.yaml                            # [REQ] Project configuration
│
├── CODEBASE_STRUCTURE.md                   # [REQ] Code organization map
├── DATA_STRUCTURE.md                       # [REQ] Documentation organization
├── DOCUMENT_REGISTRY.md                    # [REQ] Document tracking
├── SESSION_LOG.md                          # [REQ] Session history
├── CHANGE_LOG.md                           # [REQ] Change tracking
│
├── QUICK_START.md                          # [REQ] Zero-context startup (5 files to read)
├── CLAUDE_CHECKLIST.md                     # [REQ] Unified quality gates
├── PERFORMANCE_METRICS.md                  # [REQ] KPI tracking
│
├── commands/                               # [REQ] Slash commands (10 standard)
│   ├── init.md                             # Session initialization
│   ├── bootstrap.md                        # Codebase discovery
│   ├── setup.md                            # New project scaffolding
│   ├── strategy.md                         # Planning sessions
│   ├── coding.md                           # Implementation sessions
│   ├── testing.md                          # Test execution
│   ├── audit.md                            # Code review
│   ├── general.md                          # Research/questions
│   ├── release-audit.md                    # Post-release audit
│   └── close.md                            # Session closure
│
├── templates/                              # [REQ] Document templates (13 standard)
│   ├── README_TEMPLATE.md
│   ├── MVG_TEMPLATE.md
│   ├── GENOME_TEMPLATE.md
│   ├── SESSION_SEAL_TEMPLATE.md
│   ├── STRATEGY_FULL_TEMPLATE.md
│   ├── STRATEGY_DERIVED_TEMPLATE.md
│   ├── WORKING_DOC_TEMPLATE.md
│   ├── OPERATIONAL_TEMPLATE.md
│   ├── COMMAND_TEMPLATE.md
│   ├── SESSION_TEMPLATE.md
│   ├── SPRINT_COMPACT_TEMPLATE.md
│   ├── MILESTONE_COMPACT_TEMPLATE.md
│   └── RELEASE_COMPACT_TEMPLATE.md
│
├── sessions/                               # [REQ] Session management
│   ├── SESSION_INDEX.md                    # Chronicle with aggregate metrics
│   ├── SESSION_PROTOCOL.md                 # Session management rules
│   └── handoffs/                           # Handoff documents
│
├── bramhi/                                 # [REQ] Framework management
│   ├── BRAMHI_MASTER_PLAN.md               # This file
│   ├── CANONICAL_STRUCTURE.md              # Structure definition
│   ├── UNIFIED_CHECKLIST.md                # All quality gates
│   ├── KPI_SCHEMA.md                       # Metrics framework
│   └── verify_claude.sh                    # Validation script
│
└── archives/                               # [OPT] Archived sessions
```

### File Count Requirements

| Category | Count | Status |
|----------|-------|--------|
| Core Documents | 12 | Required |
| Commands | 10 | Required |
| Templates | 13 | Required |
| Session Files | 3+ | Required |
| Bramhi Files | 5 | Required |
| **TOTAL** | **43+** | Minimum |

---

## Standardization Roadmap

### Phase 0: Foundation (This Session)
**Duration**: Immediate
**Owner**: Current Session

| Task | Status | Output |
|------|--------|--------|
| Create `.claude/bramhi/` folder | In Progress | Folder structure |
| Create BRAMHI_MASTER_PLAN.md | In Progress | This document |
| Create CANONICAL_STRUCTURE.md | Pending | Structure definition |
| Create UNIFIED_CHECKLIST.md | Pending | Quality gates |
| Create KPI_SCHEMA.md | Pending | Metrics framework |
| Create verify_claude.sh | Pending | Validation script |

### Phase 1: iBrain Baseline Enhancement
**Duration**: 1 session
**Owner**: Next Session

| Task | Priority | Description |
|------|----------|-------------|
| Add QUICK_START.md | P0 | Zero-context startup guide |
| Add CLAUDE_CHECKLIST.md | P0 | Unified quality gates |
| Add PERFORMANCE_METRICS.md | P0 | Port from KARVIA |
| Update close.md | P1 | Auto-update SESSION_LOG.md |
| Add verify_claude.sh | P1 | Validation script |

### Phase 2: Cross-Repo Sync
**Duration**: 2 sessions
**Owner**: Future Sessions

| Task | Target Repo | Description |
|------|-------------|-------------|
| Clone iBrain baseline | Prodify | Full .claude structure |
| Add missing ops files | Prodify | DATA_STRUCTURE, REGISTRY, LOGS |
| Merge KARVIA artifacts | iBrain | Performance metrics, zero-context |
| Normalize KARVIA structure | KARVIA | Align to canonical structure |
| Version alignment | All | Sync BEST_PRACTICES, standards |

### Phase 3: Automation Layer
**Duration**: 2 sessions
**Owner**: Future Sessions

| Task | Description | Source |
|------|-------------|--------|
| Port start-session.js | Auto context gathering | KARVIA |
| Port end-session.js | Auto handoff + KPI calc | KARVIA |
| Create verify_claude.sh | Required file validation | New |
| Add pre-commit hooks | Enforce checklist | New |

### Phase 4: Enterprise Features
**Duration**: Ongoing
**Owner**: Future Sessions

| Feature | Description |
|---------|-------------|
| BOOTLOADER.md | Mode auto-detection |
| MODE packages | Context per operation mode |
| SESSION_SNAPSHOT generator | Auto-focused context |
| MASTER_TREE files | Quick code/doc navigation |

---

## KPI Framework

### Universal Metrics (All Repos)

| Metric | Name | Formula | Target |
|--------|------|---------|--------|
| **CER** | Context Efficiency Ratio | (Docs Used / Docs Loaded) × 100 | 85-95% |
| **TCV** | Task Completion Velocity | (Tasks Completed / Tasks Planned) × (Est Time / Actual Time) | 0.9-1.1 |
| **TES** | Token Efficiency Score | Business Value / Tokens Used × 1000 | >0.60 |
| **RAI** | Resolution Accuracy Index | (First Attempts Success / Total Attempts) × 100 | 85-95% |
| **SGP** | Security Gate Pass Rate | (Gates Passed / Gates Required) × 100 | 100% |
| **HFI** | Handoff Freshness Index | Days since last SESSION_LOG update | <1 day |

### Session Quality Rating

| Score | Rating | Criteria |
|-------|--------|----------|
| 9-10 | Excellent | All KPIs green, no blockers, comprehensive handoff |
| 7-8 | Good | Most KPIs green, minor issues documented |
| 5-6 | Acceptable | Some KPIs yellow, issues require attention |
| <5 | Needs Improvement | Red KPIs, missing documentation |

---

## Governance Integration

### Document Tier Alignment

| Tier | Documents | Access Level |
|------|-----------|--------------|
| T1 | ACCESS_CONTROL.yaml, project.yaml | Admin Only |
| T2 | DOCUMENT_STANDARDS.md, MASTER_GUIDE.md | Architect+ |
| T3 | Commands, Templates, Checklists | Developer+ |
| T4 | Session logs, Change logs, Registries | All |

### Required Headers (All Files)

```markdown
# Document Title

**Version**: X.Y.Z
**Last Updated**: YYYY-MM-DD
**Owner**: [Team/Role]
**Status**: [Draft|Active|Deprecated]
```

---

## Validation Requirements

### verify_claude.sh Checks

```bash
# Required files exist
[ ] README.md
[ ] MASTER_GUIDE.md
[ ] BEST_PRACTICES.md
[ ] DOCUMENT_STANDARDS.md
[ ] ACCESS_CONTROL.yaml
[ ] project.yaml
[ ] CODEBASE_STRUCTURE.md
[ ] DATA_STRUCTURE.md
[ ] DOCUMENT_REGISTRY.md
[ ] SESSION_LOG.md
[ ] CHANGE_LOG.md
[ ] QUICK_START.md
[ ] CLAUDE_CHECKLIST.md
[ ] PERFORMANCE_METRICS.md
[ ] commands/ (10 files)
[ ] templates/ (13 files)
[ ] sessions/SESSION_INDEX.md

# Version headers present
[ ] All .md files have Version header
[ ] All .md files have Last Updated header

# Freshness checks
[ ] SESSION_LOG.md updated within 7 days
[ ] CHANGE_LOG.md updated within 7 days
```

---

## Success Criteria

The BRAMHI Framework is successful when:

1. **Portability**: Any `.claude` folder can be copied to a new repo and work immediately
2. **Consistency**: All 3 repos (iBrain, Prodify, KARVIA) have identical structure
3. **Measurability**: KPIs tracked in every session
4. **Self-Correction**: verify_claude.sh catches 100% of missing/outdated files
5. **Agent Muscle Memory**: Claude operates identically across all repos

---

## Related Documents

- [CANONICAL_STRUCTURE.md](./CANONICAL_STRUCTURE.md) - Detailed structure definition
- [UNIFIED_CHECKLIST.md](./UNIFIED_CHECKLIST.md) - All quality gates
- [KPI_SCHEMA.md](./KPI_SCHEMA.md) - Metrics framework
- [verify_claude.sh](./verify_claude.sh) - Validation script
- [../DOCUMENT_STANDARDS.md](../DOCUMENT_STANDARDS.md) - Document governance

---

## Appendix: Cross-Repo Observations Source

### iBrain Strengths (Adopt Everywhere)
- ACCESS_CONTROL.yaml - Role-based permissions
- DOCUMENT_STANDARDS.md v2.0 - Link verification
- 13 templates - Comprehensive coverage
- SESSION_INDEX.md - Chronicle-style tracking
- 3-tier session management
- /bootstrap command

### KARVIA Business Strengths (Port to Others)
- start-session.js / end-session.js - Automation
- Claude_Performance_Key_Metrics.md - KPI framework
- ZERO_CONTEXT_ROADMAP.md - Token optimization
- BOOTLOADER.md - Mode detection
- Numbered folder structure

### Prodify Gaps (Must Fix)
- Missing: DATA_STRUCTURE.md
- Missing: DOCUMENT_REGISTRY.md
- Missing: CHANGE_LOG.md
- Missing: SESSION_LOG.md
- Missing: project.yaml

---

**Document Status**: Active planning document for BRAMHI Framework standardization.
