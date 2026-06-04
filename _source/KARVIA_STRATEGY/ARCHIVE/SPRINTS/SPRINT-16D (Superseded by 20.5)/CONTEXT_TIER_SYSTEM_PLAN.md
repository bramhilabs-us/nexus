# Context Tier System Plan (Comprehensive)

**Version**: 2.0
**Created**: March 24, 2026
**Updated**: March 24, 2026
**Status**: COMPREHENSIVE PLAN
**Replaces**: Sprint 16D (147 pts) → Focused 50 pts

> **Quick Genome**: `META:TACTICAL:SPECIFICATION | T3:DERIVED | DOC | ACTIVE | HOT | R:0% | READ:DEEP`

---

## Executive Summary

This plan creates a **comprehensive document governance system** that:
1. Adds Document Genome metadata to **T0-T2** strategy docs (no orphan docs)
2. Implements Doc ID system for traceability and change tracking
3. Updates core strategy docs from OKR→Beta (YSELA) language
4. Creates smart context loading for faster Claude sessions

### Key Findings from Audit

| Finding | Current State | Target State |
|---------|---------------|--------------|
| **T0-T2 Metadata** | Basic version headers only | Full Document Genome |
| **Doc IDs** | None assigned | DOC-T[X]-[DOMAIN]-[SEQ] |
| **Strategy Language** | "OKR platform" | "YSELA Beta" |
| **Context Loading** | Manual "read these files" | Auto-load by session type |
| **Orphan Docs** | Many docs untracked | All T0-T2 in registry |

### Documents Requiring Metadata (T0-T2)

#### T0 Constitutional Documents (Always Loaded)

| Document | Path | Changes Needed | Priority |
|----------|------|----------------|----------|
| `CLAUDE.md` | `/CLAUDE.md` | Genome + Doc ID | CRITICAL |
| `DOCUMENT_STANDARDS.md` | `/.claude/` | Already has (verify) | LOW |
| `MVG_MINIMUM_VIABLE_GOVERNANCE.md` | `/.claude/` | Genome if exists | MEDIUM |

#### T1 Strategic Documents (Strategy Sessions)

| Document | Path | Changes Needed | Priority |
|----------|------|----------------|----------|
| `00_MASTER_STRATEGY.md` | `/KARVIA_STRATEGY/` | Genome + Beta language | HIGH |
| `PRODUCT_ARCHITECTURE.md` | `/KARVIA_STRATEGY/1-PRODUCT/` | Genome | MEDIUM |
| `SYSTEM_OVERVIEW.md` | `/KARVIA_STRATEGY/1-PRODUCT/` | Genome | MEDIUM |

#### T2 Canonical Documents (Domain-Specific)

| Document | Path | Changes Needed | Priority |
|----------|------|----------------|----------|
| `PRODUCT_VISION.md` | `/KARVIA_STRATEGY/1-PRODUCT/` | Genome + Beta language | HIGH |
| `PRODUCT_STRATEGY_MASTER.md` | `/KARVIA_STRATEGY/1-PRODUCT/strategy/` | Genome + Beta language | HIGH |
| `GO_TO_MARKET.md` | `/KARVIA_STRATEGY/1-PRODUCT/` | Genome | MEDIUM |
| `00_BETA_RELEASE_PROJECT_ROADMAP.md` | `/KARVIA_STRATEGY/.../BETA_RELEASE_PROJECT/` | Genome | HIGH |
| `06_YSELA_UX_PRINCIPLES.md` | `/KARVIA_STRATEGY/.../BETA_IMPLEMENTATION_PLAN/` | Genome | HIGH |
| `DESIGN_SYSTEM.md` | `/.claude/` | Genome | MEDIUM |
| `CONTEXT_REGISTRY.md` | `/.claude/` | Genome | MEDIUM |

### Point Breakdown

| Category | Points | Stories |
|----------|--------|---------|
| **T0 Document Metadata** | 5 | DM-0 |
| **T1 Document Metadata** | 5 | DM-1 |
| **T2 Document Metadata** | 10 | DM-2 |
| **Context Auto-Loading** | 30 | CT-1 to CT-7 |
| **Total** | **50** | 11 stories |

---

## Part A: Document Metadata System (T0-T2)

### A1. Document Genome Format (from Prodify/iBrain Best Practices)

**Every T0-T2 document MUST include this header structure:**

```markdown
# Document Title

**Version**: X.Y.Z
**Last Updated**: [Date]
**Status**: Active | Update_Needed | Deprecated
**Doc ID**: DOC-T[0-2]-[DOMAIN]-[SEQ]
**Parent**: [Link to parent if T1/T2 references T0]
**Owner**: [Team or Role]

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| X.Y.Z | [Date] | [Author] | [Changes] |

---

## Document Genome

> **Quick Genome**: `[CLASS] | [TIER] | [DOMAIN] | [LIFECYCLE] | [FRESHNESS] | R:[X]% | [DIRECTIVE]`

| Dimension | Value | Notes |
|-----------|-------|-------|
| **Class** | `[CLASS]` | See A2 for values |
| **Topic Domain** | `[DOMAIN]` | See A3 for codes |
| **Authority** | `[TIER]` | T0/T1/T2 |
| **Canonical Source** | `SELF` or `→ [doc.md]` | Parent if derived |
| **Lifecycle** | `[STATE]` | ACTIVE/UPDATE_NEEDED/DEPRECATED |
| **Freshness** | `[LEVEL] ([N]d)` | HOT/WARM/COOL/COLD/FROZEN |
| **Redundancy** | `[X]%` | Overlap with other docs |
| **Claude Directive** | `[DIRECTIVE]` | READ:DEEP/READ:SKIM/SKIP |

---

[Document Content Starts Here]
```

### A2. Class Values by Tier

| Tier | Class Options |
|------|---------------|
| **T0** | `META:CONSTITUTIONAL:SUPREME` - Framework root |
| **T0** | `META:CONSTITUTIONAL:GOVERNANCE` - Rules & standards |
| **T1** | `META:STRATEGIC:AUTHORITATIVE` - Domain truth |
| **T1** | `META:STRATEGIC:MASTER` - Navigation/index |
| **T2** | `META:TACTICAL:ARCHITECTURE` - System design |
| **T2** | `META:TACTICAL:SPECIFICATION` - Detailed specs |
| **T2** | `META:TACTICAL:PATTERN` - Reusable patterns |

### A3. Domain Codes

| Code | Domain | Tier Range | Examples |
|------|--------|------------|----------|
| GOV | Governance | T0-T1 | CLAUDE.md, DOCUMENT_STANDARDS |
| PRD | Product | T1-T2 | Vision, Strategy, Roadmap |
| UX | User Experience | T2 | Design System, UX Principles |
| ARC | Architecture | T1-T2 | System Overview, Tech Specs |
| OPS | Operations | T2 | Deployment, Runbooks |
| TST | Testing | T2 | Test Strategy, QA Guides |

### A4. Doc ID Assignments for T0-T2

#### T0 Constitutional (Supreme)

| Document | Doc ID | Class |
|----------|--------|-------|
| CLAUDE.md | DOC-T0-GOV-001 | META:CONSTITUTIONAL:SUPREME |
| DOCUMENT_STANDARDS.md | DOC-T0-GOV-002 | META:CONSTITUTIONAL:GOVERNANCE |

#### T1 Strategic (Authoritative)

| Document | Doc ID | Class |
|----------|--------|-------|
| 00_MASTER_STRATEGY.md | DOC-T1-PRD-001 | META:STRATEGIC:AUTHORITATIVE |
| PRODUCT_ARCHITECTURE.md | DOC-T1-ARC-001 | META:STRATEGIC:AUTHORITATIVE |
| SYSTEM_OVERVIEW.md | DOC-T1-ARC-002 | META:STRATEGIC:AUTHORITATIVE |

#### T2 Canonical (Domain Truth)

| Document | Doc ID | Class |
|----------|--------|-------|
| PRODUCT_VISION.md | DOC-T2-PRD-001 | META:TACTICAL:SPECIFICATION |
| PRODUCT_STRATEGY_MASTER.md | DOC-T2-PRD-002 | META:TACTICAL:SPECIFICATION |
| GO_TO_MARKET.md | DOC-T2-PRD-003 | META:TACTICAL:SPECIFICATION |
| 00_BETA_RELEASE_PROJECT_ROADMAP.md | DOC-T2-PRD-004 | META:TACTICAL:SPECIFICATION |
| 06_YSELA_UX_PRINCIPLES.md | DOC-T2-UX-001 | META:TACTICAL:PATTERN |
| DESIGN_SYSTEM.md | DOC-T2-UX-002 | META:TACTICAL:PATTERN |
| CONTEXT_REGISTRY.md | DOC-T2-GOV-001 | META:TACTICAL:SPECIFICATION |

### A5. OKR→Beta Language Updates

**Affected Documents**: 00_MASTER_STRATEGY.md, PRODUCT_VISION.md, PRODUCT_STRATEGY_MASTER.md

**Current (OKR-focused)**:
> "Karvia is a B2B OKR management platform that helps SMBs..."

**Target (YSELA Beta)**:
> "YSELA is a behavior-based team performance platform powered by the YSELA methodology (BBB + GRIT framework)"

**Key Terminology Migration**:

| Old Term | New Term | Context |
|----------|----------|---------|
| "OKR platform" | "YSELA Beta" | Product name |
| "OKR management" | "Team performance transformation" | Core function |
| "Task tracking" | "Next Moves & Handoffs" | Execution model |
| "Goal cascade" | "Behavior-based execution" | Philosophy |
| "Assessment" | "SSI (Speed-Strength-Intelligence)" | Methodology |
| "Generic OKR tool" | "Consultant-led transformation platform" | Positioning |

---

## Part B: Context Auto-Loading System

### The Problem

| Current State | Impact |
|---------------|--------|
| Commands say "read these files" | Claude may skip or miss context |
| No tier priority | All docs feel equal importance |
| No auto-loading | Manual context gathering each session |
| Design principles scattered | Inconsistent UI output |

### The Solution

| Tier | Name | When Loaded | Example Docs |
|------|------|-------------|--------------|
| **T0** | Constitutional | ALL sessions | CLAUDE.md, SESSION_LOG.md |
| **T1** | Strategic | `/strategy`, `/init` | Roadmap, architecture |
| **T2** | Operational | `/coding`, `/design` | DESIGN_SYSTEM, UX_PRINCIPLES |
| **T3** | Session-Specific | On demand | Sprint handoffs, epics |

---

## Implementation Stories: Document Metadata

### Story DM-0: Add Genome to T0 Constitutional Docs (5 pts)

**Purpose**: Ensure foundational documents have proper metadata for traceability.

**Documents to Update**:

| Document | Doc ID | Status |
|----------|--------|--------|
| CLAUDE.md | DOC-T0-GOV-001 | Add Genome header |
| DOCUMENT_STANDARDS.md | DOC-T0-GOV-002 | Verify/update Genome |

**Deliverable**: T0 docs with full Document Genome headers

**Acceptance Criteria**:
- [ ] CLAUDE.md has Quick Genome one-liner
- [ ] CLAUDE.md has Doc ID in header
- [ ] DOCUMENT_STANDARDS.md genome verified current
- [ ] No orphan T0 docs (all tracked in DOC_ID_REGISTRY)

---

### Story DM-1: Add Genome to T1 Strategic Docs (5 pts)

**Purpose**: Strategy documents must be traceable and clearly categorized.

**Documents to Update**:

| Document | Doc ID | Changes |
|----------|--------|---------|
| 00_MASTER_STRATEGY.md | DOC-T1-PRD-001 | Full Genome + OKR→Beta update |
| PRODUCT_ARCHITECTURE.md | DOC-T1-ARC-001 | Add Genome header |
| SYSTEM_OVERVIEW.md | DOC-T1-ARC-002 | Add Genome header |

**Deliverable**: T1 docs with Document Genome + updated language

**Acceptance Criteria**:
- [ ] All T1 docs have Quick Genome
- [ ] All T1 docs have Doc ID
- [ ] 00_MASTER_STRATEGY.md references YSELA/Beta (not just OKR)
- [ ] T1 docs registered in DOC_ID_REGISTRY

---

### Story DM-2: Add Genome to T2 Canonical Docs (10 pts)

**Purpose**: Domain-specific documents must be traceable and not orphaned.

**Documents to Update**:

| Document | Doc ID | Priority |
|----------|--------|----------|
| PRODUCT_VISION.md | DOC-T2-PRD-001 | HIGH (OKR→Beta) |
| PRODUCT_STRATEGY_MASTER.md | DOC-T2-PRD-002 | HIGH (OKR→Beta) |
| GO_TO_MARKET.md | DOC-T2-PRD-003 | MEDIUM |
| 00_BETA_RELEASE_PROJECT_ROADMAP.md | DOC-T2-PRD-004 | HIGH |
| 06_YSELA_UX_PRINCIPLES.md | DOC-T2-UX-001 | HIGH |
| DESIGN_SYSTEM.md | DOC-T2-UX-002 | MEDIUM |
| CONTEXT_REGISTRY.md | DOC-T2-GOV-001 | MEDIUM |

**Deliverable**: T2 docs with Document Genome + updated language where needed

**Acceptance Criteria**:
- [ ] All T2 docs have Quick Genome
- [ ] All T2 docs have Doc ID
- [ ] PRODUCT_VISION.md references YSELA methodology
- [ ] PRODUCT_STRATEGY_MASTER.md references BBB+GRIT framework
- [ ] All T2 docs registered in DOC_ID_REGISTRY
- [ ] No orphan T2 docs (verify with grep for untracked .md files)

---

### Story DM-3: Create/Update DOC_ID_REGISTRY (3 pts)

**Purpose**: Central registry to prevent orphan docs and track all T0-T2 documents.

**Location**: `/.claude/DOC_ID_REGISTRY.md`

**Contents**:
```markdown
# Doc ID Registry

| Doc ID | Document | Tier | Path | Last Updated | Status |
|--------|----------|------|------|--------------|--------|
| DOC-T0-GOV-001 | CLAUDE.md | T0 | /CLAUDE.md | [date] | Active |
| DOC-T0-GOV-002 | DOCUMENT_STANDARDS.md | T0 | /.claude/ | [date] | Active |
| DOC-T1-PRD-001 | 00_MASTER_STRATEGY.md | T1 | /KARVIA_STRATEGY/ | [date] | Active |
| ... | ... | ... | ... | ... | ... |
```

**Acceptance Criteria**:
- [ ] All T0-T2 docs listed
- [ ] No orphan docs (every .md in strategy folders either tracked or explicitly excluded)
- [ ] Status field shows ACTIVE, UPDATE_NEEDED, or DEPRECATED

---

## Implementation Stories: Context Auto-Loading

### Tier Definitions

### T0: Constitutional (Always Loaded)

**Purpose**: Core Claude instructions that apply to every session.

| Document | Path | Size | Load Priority |
|----------|------|------|---------------|
| CLAUDE.md | `/CLAUDE.md` | ~15KB | 1st |
| SESSION_LOG.md (last 50 lines) | `/.claude/SESSION_LOG.md` | ~2KB | 2nd |
| Current handoff | Dynamic | ~5KB | 3rd |

**Total T0 Context**: ~22KB

### T1: Strategic (Strategy Sessions)

**Purpose**: High-level planning, roadmap alignment, architecture decisions.

| Document | Path | Size | When |
|----------|------|------|------|
| Beta Roadmap | `BETA_RELEASE_PROJECT/00_BETA_RELEASE_PROJECT_ROADMAP.md` | ~20KB | `/strategy` |
| Sprint Overview | `1-SPRINTS/README.md` | ~5KB | `/strategy` |
| Architecture Guide | `2-TECHNICAL/ARCHITECTURE.md` | ~10KB | `/strategy` |

**Total T1 Context**: ~35KB

### T2: Operational (Coding/Design Sessions)

**Purpose**: Implementation patterns, design rules, API contracts.

| Document | Path | Size | When |
|----------|------|------|------|
| DESIGN_SYSTEM.md | `/.claude/DESIGN_SYSTEM.md` | ~8KB | `/design` |
| UX_PRINCIPLES.md | `BETA_IMPLEMENTATION_PLAN/06_YSELA_UX_PRINCIPLES.md` | ~25KB | `/design` |
| CONTEXT_REGISTRY.md | `/.claude/CONTEXT_REGISTRY.md` | ~10KB | `/coding` |
| API Patterns | `server/routes/README.md` | ~5KB | `/coding` |

**Total T2 Context**: ~48KB

### T3: Session-Specific (On Demand)

**Purpose**: Current sprint details, specific epics, test reports.

| Document | When Loaded |
|----------|-------------|
| Sprint X Handoff | When working on Sprint X |
| Epic Y Spec | When implementing Epic Y |
| Test Report | When in `/testing` session |

**Size**: Variable (loaded only when needed)

---

## Implementation Stories

### Story CT-1: Create CONTEXT_TIERS.md (3 pts)

**Purpose**: Central reference defining all tiers and their documents.

**Deliverable**: `/.claude/CONTEXT_TIERS.md`

**Contents**:
- Tier definitions (T0-T3)
- Document assignments per tier
- Size budgets
- Load order

### Story CT-2: Update `/init` Command (5 pts)

**Purpose**: Make `/init` automatically summarize relevant T0 docs.

**Changes**:
- Add T0 context section to init output
- Show "Context Loaded" confirmation
- Recommend session type based on handoff

**Before**:
```
## Step 1: Load Context Files
Read these files in order...
```

**After**:
```
## T0 Context Auto-Loaded
✓ CLAUDE.md (15KB) - Core instructions
✓ SESSION_LOG.md - Last 5 sessions
✓ Sprint 20 Handoff - IMPLEMENTATION COMPLETE

Ready for session. Recommended: /design (Team Formation mockups)
```

### Story CT-3: Update `/design` Command (5 pts)

**Purpose**: Auto-load T2 design context.

**Changes**:
- Add T2 context loading at start
- Show design principles summary
- Reference DESIGN_SYSTEM colors/fonts
- Reference UX_PRINCIPLES patterns

**Before**:
```
Read these files before proceeding:
- DESIGN_SYSTEM.md
- UX_PRINCIPLES.md
```

**After**:
```
## T2 Design Context Loaded
✓ DESIGN_SYSTEM.md
  - Primary: #7C3AED (Purple)
  - SSI: #1e3a5f (Navy) + #c9a227 (Gold)
  - Font: Inter

✓ UX_PRINCIPLES.md
  - GRIT-UX Framework
  - Empty states required
  - Single CTA per screen
  - Coach voice for copy

✓ BETA_MOCKUPS folder structure
  - 01_TEAM_FORMATION (Pre-S21) ← Current Priority
  - 02_SINGLE_PRIORITY_VIEW (S22)
  ...

Now ready for design work.
```

### Story CT-4: Update `/coding` Command (5 pts)

**Purpose**: Auto-load T2 coding context.

**Changes**:
- Add CONTEXT_REGISTRY summary
- Show API patterns
- Reference model conventions
- Show current sprint focus

**After**:
```
## T2 Coding Context Loaded
✓ CONTEXT_REGISTRY.md
  - Backend: multi-tenant, soft delete, RESTful
  - Frontend: escapeHtml, karvia_auth_token

✓ API Patterns
  - Response: { success: true, data: result }
  - Error: { success: false, error: message }
  - Always filter by company_id

✓ Current Sprint Focus
  - Sprint 21 (Apr 1-14): Philosophy + Governance
  - UX-001: FTUE Welcome Flow (3pts)
  - UX-002: Empty States (2pts)

Ready for coding session.
```

### Story CT-5: Update `/strategy` Command (5 pts)

**Purpose**: Auto-load T1 strategic context.

**Changes**:
- Load Beta roadmap summary
- Show sprint status overview
- Reference architecture decisions
- Show roadmap progress

**After**:
```
## T1 Strategic Context Loaded
✓ BETA ROADMAP 2026
  - Philosophy: BBB + GRIT + YSELA
  - Target: Q2 2026 Launch
  - Progress: 0/127 pts (0%)

✓ Sprint Status
  | Sprint | Points | Status |
  | 21 | 26 | Not Started |
  | 22 | 24 | Not Started |
  | ... | ... | ... |

✓ Key Decisions
  - GRIT-UX Framework approved (Mar 24)
  - Objective Wizard complete (Mar 23)

Ready for strategy session.
```

### Story CT-6: Create T2 Operations Quick Reference (5 pts)

**Purpose**: Consolidated operations patterns doc.

**Deliverable**: `/.claude/OPERATIONS_QUICKREF.md`

**Contents**:
- Backend patterns (multi-tenant, RBAC, soft delete)
- Frontend patterns (auth, escapeHtml, fetch)
- API contracts (response format, error handling)
- Common pitfalls

**Size Target**: <10KB (designed for fast loading)

### Story CT-7: Integration & Validation (2 pts)

**Purpose**: Test all commands with new context loading.

**Tasks**:
- Run each command, verify context appears
- Measure token overhead
- Validate docs exist and are current
- Update any stale references

---

## Implementation Schedule

### Phase 1: Document Metadata (Days 1-3)

| Day | Story | Points | Deliverable |
|-----|-------|--------|-------------|
| 1 | DM-0 | 5 | T0 docs with Genome |
| 2 | DM-1 | 5 | T1 docs with Genome + Beta language |
| 3 | DM-2 | 10 | T2 docs with Genome + Beta language |
| 3 | DM-3 | 3 | DOC_ID_REGISTRY.md |
| **Subtotal** | | **23** | All T0-T2 traceable |

### Phase 2: Context Auto-Loading (Days 4-6)

| Day | Story | Points | Deliverable |
|-----|-------|--------|-------------|
| 4 | CT-1 | 3 | CONTEXT_TIERS.md |
| 4 | CT-2 | 5 | /init v2.2 |
| 5 | CT-3 | 5 | /design v2.1 |
| 5 | CT-4 | 5 | /coding v1.1 |
| 6 | CT-5 | 5 | /strategy v1.1 |
| 6 | CT-6 | 5 | OPERATIONS_QUICKREF.md |
| 6 | CT-7 | 2 | Integration tests |
| **Subtotal** | | **30** | Commands auto-load context |

### Total

| Phase | Points | Duration |
|-------|--------|----------|
| Document Metadata | 23 | 3 days |
| Context Auto-Loading | 30 | 3 days |
| **TOTAL** | **53** | **6 days** |

---

## Success Criteria

### Quantitative

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Context load time | <5 seconds | Command output timing |
| Token overhead | <15K per session | Count context tokens |
| Command coverage | 5/5 commands updated | Checklist |
| Doc coverage | 10+ docs tiered | CONTEXT_TIERS.md |

### Qualitative

| Criterion | How to Verify |
|-----------|---------------|
| Claude knows design principles without asking | Start /design, check if colors mentioned |
| Claude understands API patterns without reading | Start /coding, ask about response format |
| Strategic alignment automatic | Start /strategy, check if roadmap referenced |

---

## Comparison: Sprint 16D vs Context Tier System

| Aspect | Sprint 16D | Context Tier System |
|--------|------------|---------------------|
| Points | 147 | 53 |
| Duration | 2 weeks | 6 days |
| Focus | 421 READMEs | T0-T2 metadata + 5 commands |
| Value | Volume | Traceability + Speed |
| Risk | High (breaks references) | Low (enhances existing) |
| Outcome | More files | No orphan docs + Faster sessions |
| Metadata | None | Full Document Genome |
| Tracking | None | DOC_ID_REGISTRY |
| OKR→Beta | Not addressed | Included |

---

## Files to Create

| File | Location | Purpose |
|------|----------|---------|
| CONTEXT_TIERS.md | /.claude/ | Tier definitions |
| DOC_ID_REGISTRY.md | /.claude/ | Central doc tracking |
| OPERATIONS_QUICKREF.md | /.claude/ | T2 operations patterns |

## Files to Modify (Metadata)

| File | Changes | Story |
|------|---------|-------|
| CLAUDE.md | Add Doc ID + Quick Genome | DM-0 |
| DOCUMENT_STANDARDS.md | Verify/update Genome | DM-0 |
| 00_MASTER_STRATEGY.md | Genome + OKR→Beta language | DM-1 |
| PRODUCT_VISION.md | Genome + OKR→Beta language | DM-2 |
| PRODUCT_STRATEGY_MASTER.md | Genome + OKR→Beta language | DM-2 |
| GO_TO_MARKET.md | Add Genome | DM-2 |
| 00_BETA_RELEASE_PROJECT_ROADMAP.md | Add Genome | DM-2 |
| 06_YSELA_UX_PRINCIPLES.md | Add Genome | DM-2 |
| DESIGN_SYSTEM.md | Add Genome | DM-2 |
| CONTEXT_REGISTRY.md | Add Genome | DM-2 |

## Files to Modify (Commands)

| File | Changes | Story |
|------|---------|-------|
| /.claude/commands/init.md | Add T0 context loading | CT-2 |
| /.claude/commands/design.md | Add T2 design context | CT-3 |
| /.claude/commands/coding.md | Add T2 coding context | CT-4 |
| /.claude/commands/strategy.md | Add T1 strategic context | CT-5 |
| /.claude/commands/testing.md | Add T3 test context | CT-7 |

---

## Decision

**Recommendation**: Execute this 53-point Context Tier System instead of Sprint 16D (147 pts).

**Rationale**:
1. **No orphan docs**: All T0-T2 tracked in DOC_ID_REGISTRY
2. **Full traceability**: Document Genome on every strategic doc
3. **OKR→Beta migration**: Updates language to YSELA methodology
4. **Faster Claude**: Auto-loading context by session type
5. **64% less effort**: 53 pts vs 147 pts
6. **Low risk**: Enhances existing docs, no folder restructuring

---

## Execution Order (One-by-One)

### Recommended Start: DM-0 (T0 Metadata)

**Why**: Foundation - CLAUDE.md is loaded every session. Adding Genome here sets the pattern.

**Steps**:
1. Read CLAUDE.md
2. Add Doc ID header: `DOC-T0-GOV-001`
3. Add Quick Genome one-liner
4. Verify DOCUMENT_STANDARDS.md genome is current
5. Create DOC_ID_REGISTRY.md with initial T0 entries

### Then: DM-1 → DM-2 → DM-3 → CT-1 → CT-2 → ... → CT-7

---

## Success Metrics

| Category | Metric | Target |
|----------|--------|--------|
| **Traceability** | T0-T2 docs with Genome | 100% |
| **Traceability** | Orphan docs | 0 |
| **Traceability** | Doc IDs assigned | All T0-T2 |
| **Speed** | Context auto-loaded | 5/5 commands |
| **Consistency** | OKR→Beta language updated | 3 key docs |

---

**Document Owner**: Claude
**Last Updated**: March 24, 2026
**Status**: Ready for Execution
