# Karvia vs PRODIFY .claude Comparison Report

**Date**: March 6, 2026
**Purpose**: Identify best practices to adopt from each project
**Status**: Analysis Complete

---

## Executive Summary

| Metric | Karvia | PRODIFY | Winner |
|--------|--------|---------|--------|
| Total .claude files | 50+ | 45+ | Tie |
| Command count | 12 | 12 | Tie |
| Avg command size | 7KB | 12KB | PRODIFY |
| Context registry | None | Comprehensive | **PRODIFY** |
| Design system ref | None | Complete | **PRODIFY** |
| Session management | Basic | 3-tier system | **PRODIFY** |
| Sprint review | Yes | No | **Karvia** |
| Automation scripts | Yes | No | **Karvia** |
| Archives structure | Yes | No | **Karvia** |

---

## 1. What Karvia Should Adopt from PRODIFY

### 1.1 CONTEXT_REGISTRY.md (HIGH PRIORITY)

**What it is**: A lookup table telling Claude what to read BEFORE creating any file type.

**Why Karvia needs it**:
- Prevents Claude from creating docs without reading prerequisites
- Ensures consistency with existing patterns
- Reduces "reinventing the wheel" waste

**PRODIFY has**:
```markdown
| Creating | Primary Reference | Secondary References |
|----------|-------------------|---------------------|
| API endpoint | T1-004, API_CONTRACTS | T0-003, DATABASE_SCHEMA |
| Database model | DATABASE_SCHEMA | T1-014, T1-015 |
| UI mockup | DESIGN_SYSTEM | T1-006, Persona |
```

**Action for Karvia**: Create `.claude/CONTEXT_REGISTRY.md` with Karvia-specific mappings:

```markdown
| Creating | Primary Reference | Secondary References |
|----------|-------------------|---------------------|
| API endpoint | CLAUDE.md, server/routes/ | models/, ValidationService |
| Goal model | Goal.js, DateService | Objective.js |
| Frontend page | common.js, navigation.js | goals-api-client.js |
| Sprint plan | Previous sprint, DOC_STANDARDS | SESSION_LOG.md |
```

---

### 1.2 Session Seal Verification (HIGH PRIORITY)

**What it is**: Pre-flight check in `/init` to verify previous session closed properly.

**PRODIFY init.md Step 0**:
```markdown
## Step 0: Session Seal Verification (PRE-FLIGHT CHECK)

### Step 0.1: Check Session Index and Handoffs
### Step 0.2: Verify Counter Match
### Step 0.3: Recovery Protocol (If Mismatch Detected)

⚠️ SESSION SEAL MISMATCH DETECTED
Previous session may not have completed /close properly.
```

**Why Karvia needs it**:
- Detects incomplete sessions
- Prevents context loss
- Enables recovery from crashes

**Action for Karvia**: Add Step 0 to `.claude/commands/init.md`

---

### 1.3 /design Command (MEDIUM PRIORITY)

**What it is**: Dedicated command for design/mockup sessions with design system awareness.

**PRODIFY has**:
- `design.md` (270 lines, 6.6KB)
- Pre-design checklist
- Design authority hierarchy
- Context loading by design type
- Mockup document template
- Design quality gates

**Why Karvia needs it**:
- Karvia has mockups in `Karvia_OKR_Mockups/`
- No command to ensure design consistency
- Navy/Gold design system needs enforcement

**Action for Karvia**: Create `.claude/commands/design.md` with:
- Pre-design checklist
- Design tokens reference
- Mockup template
- Design quality gates

---

### 1.4 DESIGN_SYSTEM.md Quick Reference (MEDIUM PRIORITY)

**What it is**: Quick design reference for Claude to apply consistent styling.

**PRODIFY has** (193 lines):
- Brand identity (logo, tagline, font)
- Primary colors with hex codes
- Role-based themes
- CSS variables
- Component standards (button, card, navigation)
- Page layout structure

**Why Karvia needs it**:
- Navy/Gold design system not documented in .claude
- Claude creates inconsistent UI
- No quick reference for colors/fonts

**Action for Karvia**: Create `.claude/DESIGN_SYSTEM.md` with Karvia's Navy/Gold system

---

### 1.5 Version Metadata in Commands (LOW PRIORITY)

**PRODIFY commands have**:
```markdown
**Version**: 4.1.0
**Last Updated**: January 15, 2026
**Status**: Active
**Purpose**: Automated workflow...
**Protocol**: [SESSION_PROTOCOL.md](../sessions/SESSION_PROTOCOL.md)
```

**Karvia commands have**:
```markdown
# Strategy Session Initialization

**Session Type**: STRATEGY
**Token Budget**: 40-60K
```

**Why it matters**:
- Track command evolution
- Know when commands were last updated
- Link to related protocols

**Action for Karvia**: Add version headers to all commands

---

### 1.6 Token Checkpoints (MEDIUM PRIORITY)

**PRODIFY strategy.md has**:
```markdown
## TOKEN CHECKPOINTS

- At 30K (15%): Context loading complete
- At 45K (22%): Analysis complete
- At 55K (27%): Documentation draft
- At 60K (30%): Finalize and prepare for /close
```

**Why Karvia needs it**:
- Better token budget management
- Clear milestones during sessions
- Prevents running out of tokens

**Action for Karvia**: Add token checkpoints to strategy.md, coding.md, audit.md

---

### 1.7 .claude/README.md Entry Point (LOW PRIORITY)

**PRODIFY has** (128 lines):
- Overview of .claude folder
- Quick start with command table
- Session management instructions
- File placement rules summary
- Key documents reference

**Why Karvia needs it**:
- No entry point for .claude folder
- New sessions start without orientation

**Action for Karvia**: Create `.claude/README.md`

---

## 2. What PRODIFY Should Adopt from Karvia

### 2.1 /sprint-review Command (HIGH PRIORITY)

**What Karvia has**: `sprint-review.md` (7.1KB)
- Sprint completion checklist
- Story point validation
- Quality gate verification
- Release preparation

**Why PRODIFY needs it**:
- No dedicated sprint review process
- `/audit` covers general audits but not sprint completion
- Missing sprint closure workflow

**Action for PRODIFY**: Copy and adapt Karvia's `sprint-review.md`

---

### 2.2 automation/ Folder (MEDIUM PRIORITY)

**What Karvia has**: `.claude/automation/`
- `README.md` with automation guide
- Potentially scripts for common tasks

**Why PRODIFY needs it**:
- No automation infrastructure
- Manual processes that could be scripted

**Action for PRODIFY**: Create `.claude/automation/` folder

---

### 2.3 archives/ Folder Structure (LOW PRIORITY)

**What Karvia has**: `.claude/archives/`
- Legacy session management (2026-01-08)
- Historical command versions
- Preserved context from migrations

**Why PRODIFY needs it**:
- No archive strategy
- Old files mixed with current

**Action for PRODIFY**: Create `.claude/archives/` for deprecated content

---

### 2.4 settings.local.json (LOW PRIORITY)

**What Karvia has**: `.claude/settings.local.json`
- Local configuration for Claude
- Per-user settings

**Why PRODIFY needs it**:
- No local settings mechanism
- All config is global

**Action for PRODIFY**: Consider adding local settings support

---

### 2.5 Hardcoded Sprint Paths (FIX NEEDED)

**Issue in Karvia**: Commands have hardcoded paths like:
```markdown
`KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-3/SPRINT3_HANDOFF_DOCUMENT.md`
```

**Issue in PRODIFY**: Similar hardcoded paths.

**Both projects need**:
- Dynamic current sprint detection
- Variable substitution for sprint paths
- Or clear instructions to update paths

---

## 3. Command Size Comparison

| Command | Karvia | PRODIFY | Diff | Notes |
|---------|--------|---------|------|-------|
| `init.md` | 2.1KB | 12.4KB | **+488%** | PRODIFY has 3-tier verification |
| `strategy.md` | 4.3KB | 12.3KB | **+186%** | PRODIFY has context loading matrix |
| `coding.md` | 7.7KB | 10.4KB | +35% | PRODIFY slightly more detailed |
| `general.md` | 8.5KB | 5.6KB | -34% | Karvia more detailed |
| `audit.md` | 5.7KB | 15.1KB | **+165%** | PRODIFY has T0-T4 audit framework |
| `testing.md` | 10.9KB | 14.2KB | +30% | PRODIFY more comprehensive |
| `close.md` | 8.7KB | 17.3KB | **+99%** | PRODIFY has 3-tier handoff |
| `bootstrap.md` | 15.9KB | 15.9KB | 0% | Identical (shared origin) |
| `setup.md` | 12.7KB | 12.7KB | 0% | Identical (shared origin) |
| `release-audit.md` | 12.1KB | 12.1KB | 0% | Identical (shared origin) |

**Observation**: PRODIFY's init, strategy, audit, and close commands are significantly larger due to:
- Session Seal Verification
- 3-tier session management
- Context loading matrices
- Document authority hierarchy

---

## 4. Structural Differences

### 4.1 Session Management

| Aspect | Karvia | PRODIFY |
|--------|--------|---------|
| Session tracking | SESSION_LOG.md (table) | 3-tier: Index + Session + Handoff |
| Handoff format | Inline in sprint docs | Dedicated handoff folder |
| Session verification | None | Pre-flight check |
| Recovery protocol | None | Mismatch detection |

**Recommendation for Karvia**: Consider adopting 3-tier system for better context preservation.

### 4.2 Document Hierarchy

| Aspect | Karvia | PRODIFY |
|--------|--------|---------|
| Tier system | K0-K4 (new, Sprint 16-D) | T0-T4 (mature) |
| Doc IDs | K#-DOMAIN-NNN (planned) | T#-NNN (implemented) |
| Access control | None | ACCESS_CONTROL.yaml |
| Authority pyramid | Visual (in DOC_STANDARDS) | Visual + enforced |

**Observation**: Karvia's Sprint 16-D is designing a similar system (K0-K4). PRODIFY's is already implemented.

---

## 5. Priority Action Items

### For Karvia (This Week)

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| **P0** | Create CONTEXT_REGISTRY.md | 2h | High - prevents reinvention |
| **P1** | Add Session Seal to init.md | 1h | High - catches incomplete sessions |
| **P2** | Create DESIGN_SYSTEM.md | 2h | Medium - ensures UI consistency |
| **P3** | Add version headers to commands | 1h | Low - improves traceability |
| **P4** | Create .claude/README.md | 1h | Low - better orientation |

### For PRODIFY (This Week)

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| **P0** | Create sprint-review.md | 1h | High - sprint closure process |
| **P1** | Create archives/ folder | 0.5h | Medium - clean structure |
| **P2** | Fix hardcoded sprint paths | 1h | Medium - maintainability |
| **P3** | Create automation/ folder | 1h | Low - future scripting |

---

## 6. Shared Best Practices (Already in Both)

| Feature | Status |
|---------|--------|
| `/init` and `/close` workflow | Both have |
| Token budget awareness | Both have |
| Session logging | Both have |
| Quality rating system | Both have |
| Template folder | Both have |
| Bramhi/unified structure | Both have |

---

## 7. Conclusion

**PRODIFY is stronger in**:
- Session management (3-tier system)
- Context loading (matrices, registries)
- Design system enforcement
- Document authority hierarchy

**Karvia is stronger in**:
- Sprint review process
- Automation infrastructure
- Archive management
- Sprint-specific tooling

**Recommended sync approach**:
1. Karvia adopts PRODIFY's context registry pattern
2. Karvia adopts PRODIFY's session seal verification
3. PRODIFY adopts Karvia's sprint-review command
4. Both fix hardcoded sprint paths

---

**Report Version**: 1.0.0
**Generated**: March 6, 2026
