# Sprint 20.5 - Pre-Beta Bridge: Context Tier System

**Version**: 2.0
**Created**: March 24, 2026
**Updated**: March 24, 2026
**Status**: APPROVED - READY FOR EXECUTION
**Type**: Pre-Beta Bridge Sprint
**Points**: 55
**Duration**: 1 week

> **Quick Genome**: `META:TACTICAL:SPECIFICATION | T3:DERIVED | OPS | ACTIVE | HOT | R:0% | READ:DEEP`

---

## Approved Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Product Name** | YSELA | Pure branding for Beta |
| **Terminology** | Frontend only | Zero backend risk |
| **Language Migration** | Gradual | Headers first, body later |
| **Dependency Tracking** | Full graph | Complete traceability |
| **Auto-Loading** | Hybrid | Summaries + links |
| **Archive Strategy** | .archive/ (careful) | Preserve history |
| **Philosophy Docs** | Separate pre-work | Not part of this sprint |
| **Sprint Position** | 20.5 (Bridge) | Before Beta sprints |

---

## Executive Summary

Sprint 20.5 establishes **zero-ambiguity documentation governance** before Beta launch. Every time Claude loads, it will know exactly:
- WHERE docs are (tier system)
- WHAT to read (auto-context by session type)
- HOW docs relate (dependency tracking)
- WHEN docs changed (impact tracking)

**Key Deliverable**: TERMINOLOGY_MAPPING.md created at `/.claude/TERMINOLOGY_MAPPING.md`

This sprint MUST complete before Beta implementation begins (Sprint 21).

---

## Part 1: Documentation Audit Findings

### Current State (165+ Active Docs)

| Category | Count | Governance Status |
|----------|-------|-------------------|
| **Strategic Docs** | 25 | No metadata, no Doc IDs |
| **Technical Docs** | 45+ | Partial metadata |
| **Governance (.claude/)** | 48 | Best organized |
| **Product/UX Docs** | 35+ | No metadata |
| **Operations** | 12 | Incomplete |
| **Legacy/Archive** | 40+ | Needs cleanup |

### Governance Gaps Identified

| Gap | Current State | Impact | Target State |
|-----|---------------|--------|--------------|
| **No Doc IDs** | Files identified by path only | Can't track across moves/renames | `DOC-T[0-2]-[DOMAIN]-[SEQ]` |
| **No Metadata** | Basic version headers | Claude can't assess freshness | Full Document Genome |
| **No Tier System** | All docs feel equal | Claude reads wrong docs | T0-T2 priority system |
| **No Dependency Graph** | Unknown doc relationships | Changes break unknowns | Explicit parent→child links |
| **No Change Tracking** | No audit trail | Can't trace decisions | Change log per doc |
| **No Auto-Loading** | Manual "read these files" | Context often missed | Session-based auto-load |
| **OKR Language** | Still says "OKR platform" | Misaligned with Beta | YSELA/BBB methodology |

---

## Part 2: The Zero-Ambiguity System

### 2.1 Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 1: DISCOVERY                           │
│         "Where is the doc and what does it do?"                 │
├─────────────────────────────────────────────────────────────────┤
│  DOC_ID_REGISTRY.md        CONTEXT_TIERS.md      MASTER_INDEX   │
│  - All T0-T2 docs listed   - Tier definitions    - Quick lookup │
│  - Path to every doc       - Load priority       - By topic     │
│  - Status tracking         - Session mapping     - By role      │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 2: GOVERNANCE                          │
│         "How is this doc controlled?"                           │
├─────────────────────────────────────────────────────────────────┤
│  DOCUMENT GENOME           DEPENDENCY GRAPH      CHANGE LOG     │
│  - Class/Tier/Domain       - Parent docs         - Who changed  │
│  - Freshness indicator     - Child docs          - What changed │
│  - Claude directive        - Impact scope        - Why changed  │
│  - Canonical source        - Breaking changes    - When changed │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 3: AUTO-LOADING                        │
│         "What should Claude read for this session?"             │
├─────────────────────────────────────────────────────────────────┤
│  /init         /strategy      /coding        /design            │
│  → T0 docs     → T0 + T1      → T0 + T2      → T0 + T2          │
│  → Handoff     → Roadmap      → API specs    → UX principles    │
│  → Sprint      → Architecture → Patterns     → Design system    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Document Tier System

| Tier | Name | Purpose | Load When | Example Docs |
|------|------|---------|-----------|--------------|
| **T0** | Constitutional | Core rules, always applies | EVERY session | CLAUDE.md, DOCUMENT_STANDARDS |
| **T1** | Strategic | Business direction, architecture | /strategy, /init | MASTER_STRATEGY, PRODUCT_VISION, ROADMAP |
| **T2** | Canonical | Domain truth, patterns | /coding, /design | API specs, UX principles, data models |
| **T3** | Working | Sprint-specific, temporary | On demand | Handoffs, epics, test reports |

### 2.3 Document Genome (Every T0-T2 Doc)

```markdown
## Document Genome

> **Quick Genome**: `META:STRATEGIC:AUTHORITATIVE | T1 | PRD | ACTIVE | WARM (15d) | R:0% | READ:DEEP`

| Dimension | Value | Notes |
|-----------|-------|-------|
| **Doc ID** | DOC-T1-PRD-001 | Unique identifier |
| **Class** | META:STRATEGIC:AUTHORITATIVE | Document classification |
| **Tier** | T1 | Priority in hierarchy |
| **Domain** | PRD (Product) | Bounded context |
| **Lifecycle** | ACTIVE | ACTIVE/UPDATE_NEEDED/DEPRECATED |
| **Freshness** | WARM (15d) | Days since last update |
| **Parent** | SELF | Or → [parent doc] |
| **Children** | [list] | Docs that derive from this |
| **Impact Scope** | [HIGH/MED/LOW] | If this changes, what breaks? |
| **Claude Directive** | READ:DEEP | How Claude should process |
```

### 2.4 Dependency & Impact Tracking

Every T1-T2 doc declares:
```markdown
## Dependencies

### This Doc Depends On (Parents)
| Doc ID | Document | Relationship |
|--------|----------|--------------|
| DOC-T0-GOV-001 | CLAUDE.md | Constitutional reference |
| DOC-T1-PRD-001 | MASTER_STRATEGY | Strategic alignment |

### Docs That Depend On This (Children)
| Doc ID | Document | Impact if Changed |
|--------|----------|-------------------|
| DOC-T2-PRD-002 | PRODUCT_STRATEGY | HIGH - Must update |
| DOC-T2-UX-001 | UX_PRINCIPLES | MEDIUM - May need review |

### Change Impact Assessment
- **HIGH**: Changes here require updates to 3+ dependent docs
- **MEDIUM**: Changes may require review of dependent docs
- **LOW**: Changes are self-contained
```

---

## Part 3: Strategic Document Updates (OKR → Beta)

### Documents Requiring Language Migration

| Document | Current Language | Target Language | Priority |
|----------|------------------|-----------------|----------|
| `00_MASTER_STRATEGY.md` | "OKR management platform" | "YSELA Beta - behavior-based team performance" | HIGH |
| `PRODUCT_VISION.md` | "B2B OKR platform" | "YSELA methodology + consultant-led transformation" | HIGH |
| `PRODUCT_STRATEGY_MASTER.md` | "Task tracking, goal cascade" | "Next Moves, behavior-based execution, BBB+GRIT" | HIGH |
| `GO_TO_MARKET.md` | "OKR market" | "Team performance transformation market" | MEDIUM |

### Key Terminology Changes

| Old (OKR-focused) | New (YSELA Beta) | Context |
|-------------------|------------------|---------|
| "OKR platform" | "YSELA Beta" | Product name |
| "Task" | "Next Move" | Execution unit |
| "Task tracking" | "Behavior-based execution" | Philosophy |
| "Goal cascade" | "Team formation + handoffs" | Methodology |
| "Assessment" | "SSI (Speed-Strength-Intelligence)" | Framework |
| "Generic OKR tool" | "Consultant-led transformation" | Positioning |
| "Feature completeness" | "Behavior change outcomes" | Success metric |

---

## Part 4: Implementation Stories

### Epic A: Document Registry & Tiers (18 pts)

#### A-1: Create DOC_ID_REGISTRY.md (5 pts)
**Purpose**: Central registry of ALL T0-T2 documents with tracking

**Location**: `/.claude/DOC_ID_REGISTRY.md`

**Contents**:
```markdown
# Doc ID Registry

## Quick Stats
- **T0 Docs**: 3
- **T1 Docs**: 5
- **T2 Docs**: 15
- **Total Tracked**: 23
- **Last Updated**: [date]

## Registry

| Doc ID | Document | Tier | Domain | Path | Status | Freshness | Dependencies |
|--------|----------|------|--------|------|--------|-----------|--------------|
| DOC-T0-GOV-001 | CLAUDE.md | T0 | GOV | /CLAUDE.md | ACTIVE | HOT | 0 parents, 15 children |
| DOC-T0-GOV-002 | DOCUMENT_STANDARDS.md | T0 | GOV | /.claude/ | ACTIVE | WARM | 0 parents, 10 children |
| ... | ... | ... | ... | ... | ... | ... | ... |

## Orphan Check (Last Run: [date])
- Untracked .md files in strategy folders: 0
- Files needing Doc ID: [list]
```

**Acceptance Criteria**:
- [ ] All T0-T2 docs listed
- [ ] No orphan docs (verified by grep)
- [ ] Quick stats accurate
- [ ] Dependency counts included

---

#### A-2: Create CONTEXT_TIERS.md (5 pts)
**Purpose**: Define tier system and auto-loading rules

**Location**: `/.claude/CONTEXT_TIERS.md`

**Contents**:
- Tier definitions (T0-T3)
- What gets loaded per session type
- Size budgets (token limits)
- Priority order

---

#### A-3: Create DEPENDENCY_GRAPH.md (5 pts)
**Purpose**: Visual map of document relationships

**Location**: `/.claude/DEPENDENCY_GRAPH.md`

**Contents**:
```markdown
# Document Dependency Graph

## T0 → T1 Dependencies
```
CLAUDE.md (T0)
├── MASTER_STRATEGY.md (T1)
├── PRODUCT_VISION.md (T1)
└── PRODUCT_ARCHITECTURE.md (T1)

DOCUMENT_STANDARDS.md (T0)
├── All T1-T2 docs (governance)
└── Templates
```

## T1 → T2 Dependencies
```
MASTER_STRATEGY.md (T1)
├── PRODUCT_STRATEGY_MASTER.md (T2)
├── GO_TO_MARKET.md (T2)
└── BETA_ROADMAP.md (T2)

PRODUCT_VISION.md (T1)
├── FEATURE_CATALOG.md (T2)
├── USER_JOURNEYS.md (T2)
└── UX_PRINCIPLES.md (T2)
```

## Impact Matrix
| If This Changes | These Must Update | Impact Level |
|-----------------|-------------------|--------------|
| CLAUDE.md | All T1 docs | HIGH |
| MASTER_STRATEGY | All T2 PRD docs | HIGH |
| UX_PRINCIPLES | Design mockups | MEDIUM |
```

---

#### A-4: Create MASTER_DOC_INDEX.md (3 pts)
**Purpose**: Quick lookup for developers by topic/role

**Location**: `/.claude/MASTER_DOC_INDEX.md`

**Contents**:
- By Topic (Strategy, Tech, UX, Ops)
- By Role (New Developer, Feature Dev, API Dev, Claude)
- By Sprint Activity
- By Document Type

---

### Epic B: Add Genome to T0-T2 Docs (20 pts)

#### B-1: T0 Constitutional Docs (5 pts)
- Add Genome to CLAUDE.md
- Add Genome to DOCUMENT_STANDARDS.md
- Add Doc ID headers

#### B-2: T1 Strategic Docs (5 pts)
- Add Genome to 00_MASTER_STRATEGY.md + OKR→Beta language
- Add Genome to PRODUCT_VISION.md + OKR→Beta language
- Add Genome to PRODUCT_ARCHITECTURE.md
- Add Genome to SYSTEM_OVERVIEW.md

#### B-3: T2 Canonical Docs (10 pts)
- Add Genome to PRODUCT_STRATEGY_MASTER.md + OKR→Beta language
- Add Genome to GO_TO_MARKET.md
- Add Genome to BETA_ROADMAP.md
- Add Genome to UX_PRINCIPLES.md
- Add Genome to DESIGN_SYSTEM.md
- Add Genome to CONTEXT_REGISTRY.md
- Add Genome to FEATURE_CATALOG.md

---

### Epic C: Command Auto-Loading (15 pts)

#### C-1: Update /init command (3 pts)
- Auto-load T0 context
- Show "Context Loaded" confirmation
- Recommend session type based on handoff

#### C-2: Update /strategy command (3 pts)
- Auto-load T0 + T1 context
- Show roadmap summary
- Show sprint status

#### C-3: Update /coding command (3 pts)
- Auto-load T0 + T2 (tech) context
- Show API patterns
- Show current sprint focus

#### C-4: Update /design command (3 pts)
- Auto-load T0 + T2 (UX) context
- Show design principles summary
- Show mockup locations

#### C-5: Integration Testing (3 pts)
- Test all commands load correct context
- Measure token overhead
- Validate docs exist

---

### Epic D: Legacy Cleanup (2 pts)

#### D-1: Archive Old Planning Docs (2 pts)
- Move Karvia_OKR_Product_Planning/ contents to archive
- Keep only MASTER_DEV_LIST and MASTER_ISSUES_LIST references
- Update any broken links

---

## Part 5: Sprint Summary

### Point Breakdown

| Epic | Points | Deliverables |
|------|--------|--------------|
| **A: Registry & Tiers** | 18 | DOC_ID_REGISTRY, CONTEXT_TIERS, DEPENDENCY_GRAPH, MASTER_INDEX |
| **B: Add Genome** | 20 | T0-T2 docs with metadata |
| **C: Command Auto-Loading** | 15 | 5 updated commands |
| **D: Legacy Cleanup** | 2 | Archived old docs |
| **Total** | **55** | Zero-ambiguity system |

### Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Orphan docs** | 0 | Grep for .md files not in registry |
| **T0-T2 with Genome** | 100% | Registry check |
| **Commands auto-loading** | 5/5 | Manual test |
| **OKR→Beta updated** | 4 key docs | Content review |
| **Dependency coverage** | All T1-T2 | Graph completeness |

---

## Part 6: Discussion Points Before Execution

### Strategic Questions

1. **Scope Check**: Is 55 points achievable in 1 week before Beta sprints?
   - Alternative: Split into 21A (Registry/Tiers) and 21B (Genome/Commands)

2. **OKR→Beta Language**: How aggressive should the terminology migration be?
   - Option A: Full rewrite of strategic docs (HIGH effort, HIGH alignment)
   - Option B: Add "YSELA Beta" section, keep OKR history (MEDIUM effort)
   - Option C: Just update headers/summary, leave body as-is (LOW effort)

3. **Dependency Tracking**: What level of detail?
   - Option A: Full graph with automated checks (HIGH effort)
   - Option B: Manual parent/child declarations in each doc (MEDIUM effort)
   - Option C: Central DEPENDENCY_GRAPH.md only (LOW effort)

4. **Auto-Loading**: Should commands actually READ files or just REFERENCE them?
   - Option A: Commands inject file content into context (uses tokens)
   - Option B: Commands list "must read" with links (Claude reads)
   - Option C: Hybrid - inject summaries, link full docs

5. **Archive Strategy**: What happens to Karvia_OKR_Product_Planning/?
   - Option A: Delete entirely (aggressive)
   - Option B: Move to .archive/ folder (preserve)
   - Option C: Leave as-is, just deprecate (minimal effort)

### Pre-Beta Alignment

Before Sprint 21 executes, confirm:

- [ ] Beta roadmap (Sprints 21-25) is finalized
- [ ] YSELA methodology terminology is agreed
- [ ] BBB + GRIT philosophy is documented
- [ ] UX principles are complete
- [ ] Target launch date is confirmed

---

## Part 7: Comparison to Sprint 16D

| Aspect | Sprint 16D (On Hold) | Sprint 21 (Proposed) |
|--------|----------------------|----------------------|
| **Points** | 147 | 55 |
| **Duration** | 2 weeks | 1 week |
| **Focus** | 421 READMEs | T0-T2 governance |
| **Outcome** | Volume | Zero ambiguity |
| **Risk** | HIGH (breaks refs) | LOW (enhances existing) |
| **OKR→Beta** | Not addressed | Included |
| **Dependency tracking** | None | Full graph |
| **Auto-loading** | None | Per-command |

**Recommendation**: Execute Sprint 21 instead of Sprint 16D. Mark 16D as "Superseded".

---

## Next Steps

1. **Discuss** this plan (current step)
2. **Approve** scope and answer discussion questions
3. **Create** sprint folder structure
4. **Execute** Epic A first (Registry/Tiers)
5. **Then** Epic B (Genome) → Epic C (Commands) → Epic D (Cleanup)

---

**Document Owner**: Claude
**Created**: March 24, 2026
**Status**: Awaiting Discussion
