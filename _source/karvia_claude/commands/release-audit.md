# /release-audit - Release Gate Review

<!-- @GENOME T2-CMD-008 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/release-audit | linked:- -->

**Aliases**: None
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: AUDIT
**Token Budget**: ~1,400 AUTO
**Purpose**: Final checks before deployment - GO/NO-GO decision

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Release Manager | Gate keeping | Release checklist |
| Security Officer | Production security | Sign-off |
| QA Lead | Quality gate | Coverage report |

---

## Document Context

### AUTO (Read at session start) - ~1,400 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| Release checklist | T2-OPS-001 | ~400 | Gate criteria |
| Sprint test report | T3-TST-xxx | ~400 | Quality evidence |
| Security audit summary | T3-TST-xxx | ~300 | Security status |
| Environment config | T2-OPS-002 | ~300 | Deployment settings |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| DEPLOYMENT_GUIDE.md | T2-OPS-003 | KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/ |
| Rollback procedure | - | Same location |
| Render env vars | - | Same location |
| Current sprint handoff | T3-SPR-xxx | Current sprint folder |

### AVAILABLE (Exists, request on demand)

- Full audit report
- Previous deployment logs
- Incident response playbook
- Session compaction archive

---

## IMPORTANT: This is an AUTOMATED WORKFLOW

**Claude MUST execute each phase sequentially. This command runs before deployments to verify release readiness.**

---

## WHEN TO RUN THIS COMMAND

Run `/release-audit` at these checkpoints:

| Checkpoint | Trigger | Compaction Level |
|------------|---------|------------------|
| **Sprint Kickoff** | Before starting new sprint | Compact previous sprint sessions |
| **Milestone Complete** | All sprints in milestone done | Compact sprint compacts to milestone |
| **Release Complete** | Release shipped | Compact milestone compacts to release |

---

## PHASE 1: CONTEXT DISCOVERY

### Step 1.1: Identify Current Phase

**Execute these commands:**

```bash
# Check current sprint status
ls -la IBRAIN_STRATEGY/3-DELIVERY/sprints/

# Check session folder (create if missing)
ls -la IBRAIN_STRATEGY/3-DELIVERY/4-SESSIONS/ 2>/dev/null || echo "Sessions folder needs creation"

# Check for existing compacted sessions
ls -la IBRAIN_STRATEGY/3-DELIVERY/4-SESSIONS/compacted/ 2>/dev/null || echo "No compacted sessions yet"
```

### Step 1.2: Determine Compaction Type

**Ask user or detect automatically:**

- [ ] **Sprint Compaction** - Compact sessions from a single sprint
- [ ] **Milestone Compaction** - Compact sprint compacts into milestone summary
- [ ] **Release Compaction** - Compact milestone compacts into release summary

---

## PHASE 2: SESSION COMPACTION

### Step 2.1: Session Compaction Rules

**What to KEEP in compacted sessions:**

| Keep | Description | Priority |
|------|-------------|----------|
| **Decisions** | All technical and strategic decisions made | P0 |
| **Action Items** | Tasks assigned and their outcomes | P0 |
| **Key Discussions** | Important debates and conclusions | P1 |
| **Architecture Changes** | Any structural changes to system | P1 |
| **Blockers Encountered** | Issues and resolutions | P2 |
| **Dependencies Identified** | Cross-team or external dependencies | P2 |

**What to ARCHIVE (remove from compact):**

| Archive | Description |
|---------|-------------|
| **Exploratory Discussion** | Back-and-forth exploration without conclusion |
| **Duplicate Information** | Same topic discussed across sessions |
| **Implementation Details** | Step-by-step coding that's in git |
| **Debug Sessions** | Troubleshooting that led to working code |
| **Meeting Logistics** | Scheduling, attendance, etc. |

### Step 2.2: Sprint Session Compaction

**Folder Structure:**

```
IBRAIN_STRATEGY/3-DELIVERY/4-SESSIONS/
├── active/                           # Current sprint active sessions
│   └── SESSION-{YYYYMMDD}-{TYPE}-{CODE}.md
├── compacted/
│   ├── sprints/                      # Sprint-level compacts
│   │   └── SPRINT_COMPACT_{SPRINT_ID}.md
│   ├── milestones/                   # Milestone-level compacts
│   │   └── MILESTONE_COMPACT_{MILESTONE_ID}.md
│   └── releases/                     # Release-level compacts
│       └── RELEASE_COMPACT_{VERSION}.md
├── archive/                          # Original sessions (post-compaction)
│   └── {SPRINT_ID}/
│       └── SESSION-{YYYYMMDD}-{TYPE}-{CODE}.md
└── SESSION_REGISTRY.md               # Master registry of all sessions
```

### Step 2.3: Session Naming Convention

**Format**: `SESSION-{YYYYMMDD}-{TYPE}-{CODE}`

| Type Code | Session Type | Description |
|-----------|--------------|-------------|
| STR | Strategy | Planning and strategy discussions |
| DES | Design | System design sessions |
| ARC | Architecture | Architecture decisions |
| REV | Review | Code/doc review sessions |
| IMP | Implementation | Coding sessions |
| DBG | Debug | Debugging/troubleshooting |
| TST | Testing | Test planning/execution |
| DOC | Documentation | Documentation work |

**Examples:**
- `SESSION-20251221-STR-DM001` - Strategy session for decision DM-001
- `SESSION-20251222-ARC-TRUST` - Architecture session for Trust Engine
- `SESSION-20251223-IMP-M1S1` - Implementation for Milestone 1 Sprint 1

---

## PHASE 3: EXECUTE COMPACTION

### Step 3.1: For Sprint Compaction

**Read all session files from the sprint:**

```bash
# Example for MVP_1.0 Sprint 1
ls IBRAIN_STRATEGY/3-DELIVERY/4-SESSIONS/active/ | grep "M1S1"
```

**Create Sprint Compact using this template:**

```markdown
# Sprint Compact: {SPRINT_ID}

**Sprint**: {Sprint Name}
**Dates**: {Start Date} - {End Date}
**Sessions Compacted**: {Count}
**Compaction Date**: {Date}

---

## Sprint Summary

{2-3 paragraph summary of sprint outcomes}

---

## Key Decisions

| ID | Decision | Rationale | Impact | Session |
|----|----------|-----------|--------|---------|
| D1 | {Decision text} | {Why} | {High/Med/Low} | {Session ref} |

---

## Action Items Completed

| Item | Owner | Outcome | Session |
|------|-------|---------|---------|
| {Action} | {Owner} | {Result} | {Session ref} |

---

## Action Items Pending

| Item | Owner | Status | Blocker | Session |
|------|-------|--------|---------|---------|
| {Action} | {Owner} | {%} | {Blocker} | {Session ref} |

---

## Architecture Changes

| Change | Before | After | Rationale | Session |
|--------|--------|-------|-----------|---------|
| {Change} | {Old} | {New} | {Why} | {Session ref} |

---

## Key Discussions

### {Topic 1}

**Context**: {Brief context}
**Conclusion**: {What was decided}
**References**: {Links}

---

## Blockers & Resolutions

| Blocker | Resolution | Lesson Learned |
|---------|------------|----------------|
| {Issue} | {How fixed} | {What we learned} |

---

## Dependencies

| Dependency | Type | Status | Notes |
|------------|------|--------|-------|
| {Dep} | {Internal/External} | {Status} | {Notes} |

---

## Sprint Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Story Points | {X} | {Y} |
| Sessions | {X} | {Y} |
| Decisions Made | - | {N} |
| Blockers Hit | - | {N} |

---

## Sessions Archived

| Session ID | Date | Type | Summary |
|------------|------|------|---------|
| {ID} | {Date} | {Type} | {1-line} |

---

**Compacted By**: Claude
**Archive Location**: `4-SESSIONS/archive/{SPRINT_ID}/`
```

### Step 3.2: Move Originals to Archive

```bash
# After creating compact, move originals
mkdir -p IBRAIN_STRATEGY/3-DELIVERY/4-SESSIONS/archive/{SPRINT_ID}/
mv IBRAIN_STRATEGY/3-DELIVERY/4-SESSIONS/active/SESSION-*-M1S1*.md \
   IBRAIN_STRATEGY/3-DELIVERY/4-SESSIONS/archive/{SPRINT_ID}/
```

### Step 3.3: Update SESSION_REGISTRY.md

**Add compaction entry:**

```markdown
## Compaction Log

| Date | Type | Sessions In | Compact Out | Archived |
|------|------|-------------|-------------|----------|
| {Date} | Sprint | {N} | SPRINT_COMPACT_{ID}.md | {Archive path} |
```

---

## PHASE 4: RELEASE QUALITY AUDIT

### Step 4.1: Documentation Completeness

**Verify all required docs exist:**

```
Release Documentation:
[ ] Release notes created
[ ] API documentation updated
[ ] User guides current
[ ] Architecture docs match implementation
[ ] CHANGELOG updated
```

### Step 4.2: Audit Findings Check

**If AUDIT_FINDINGS.md exists, verify remediations:**

```
Audit Remediation:
[ ] All P0 findings resolved
[ ] All P1 findings resolved or tracked
[ ] No new CRITICAL issues introduced
[ ] Remediation story points completed
```

### Step 4.3: Cross-Reference Verification

**Check document consistency:**

```
Document Consistency:
[ ] MASTER_PLAN references are accurate
[ ] Milestone overviews match sprint work
[ ] Story points reconciled
[ ] Dependencies resolved
```

---

## PHASE 5: GENERATE REPORT

### Step 5.1: Release Audit Report

**Create report at**: `IBRAIN_STRATEGY/3-DELIVERY/releases/{VERSION}/RELEASE_AUDIT_REPORT.md`

```markdown
# Release Audit Report: {VERSION}

**Audit Date**: {Date}
**Release Date**: {Date}
**Auditor**: Claude

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Sessions Compacted** | {N} |
| **Decisions Made** | {N} |
| **Story Points Delivered** | {N} |
| **Audit Findings Resolved** | {N}/{Total} |
| **Documentation Status** | {Complete/Partial} |

---

## Session Compaction Summary

| Level | Input Count | Output | Status |
|-------|-------------|--------|--------|
| Sprints | {N sessions} | {N compacts} | Done |
| Milestones | {N sprints} | {N compacts} | Done |
| Release | {N milestones} | 1 compact | Done |

---

## Quality Assessment

| Area | Score | Notes |
|------|-------|-------|
| Code Quality | {X/10} | {Notes} |
| Documentation | {X/10} | {Notes} |
| Test Coverage | {X/10} | {Notes} |
| Architecture | {X/10} | {Notes} |
| **Overall** | **{X/10}** | {Summary} |

---

## Outstanding Items

### Must Fix Before Next Release

| Item | Severity | Owner | Status |
|------|----------|-------|--------|
| {Item} | {Sev} | {Owner} | {Status} |

### Carried to Next Release

| Item | Reason | Priority |
|------|--------|----------|
| {Item} | {Why} | {P0/P1/P2} |

---

## Recommendations

1. {Recommendation 1}
2. {Recommendation 2}

---

**Next Audit**: After {Next Release Version}
```

---

## PHASE 6: FINAL VERIFICATION

### Step 6.1: Execute Checklist

```
SESSION COMPACTION
[ ] All sprint sessions compacted (if sprint complete)
[ ] All sprint compacts → milestone compact (if milestone complete)
[ ] All milestone compacts → release compact (if release complete)
[ ] Original sessions archived with correct paths
[ ] SESSION_REGISTRY.md updated with compaction log

DOCUMENTATION
[ ] AUDIT_FINDINGS.md remediation status updated
[ ] MASTER_PLAN.md release status updated
[ ] All milestone overviews updated

QUALITY
[ ] No P0 findings outstanding
[ ] All dependencies resolved
[ ] Cross-references verified

CLEANUP
[ ] No orphaned session files
[ ] Archive structure correct
[ ] Compact files follow template
```

---

## WORKFLOW DIAGRAM

```
/release-audit
   │
   ├─► PHASE 1: Context Discovery
   │      └─► Identify sprint/milestone/release level
   │      └─► Determine compaction type needed
   │
   ├─► PHASE 2: Session Compaction Rules
   │      └─► Define what to keep vs archive
   │      └─► Validate session naming
   │
   ├─► PHASE 3: Execute Compaction
   │      └─► Read active sessions
   │      └─► Extract decisions, actions, discussions
   │      └─► Create compact document
   │      └─► Archive originals
   │      └─► Update SESSION_REGISTRY.md
   │
   ├─► PHASE 4: Release Quality Audit
   │      └─► Check documentation completeness
   │      └─► Verify audit findings resolved
   │      └─► Cross-reference verification
   │
   ├─► PHASE 5: Generate Report
   │      └─► Create release audit report
   │      └─► Document outstanding items
   │
   └─► PHASE 6: Final Verification
          └─► Execute checklist
          └─► Fix any issues
          └─► Report to user
```

---

## Exit Criteria

- [ ] All gate criteria verified (security, testing, docs)
- [ ] Release decision made (GO / NO-GO)
- [ ] If GO: Ready for /deploy
- [ ] If NO-GO: Blockers documented with owners
- [ ] Session compaction complete (if applicable)
- [ ] Release audit report generated
- [ ] No outstanding P0 items
- [ ] Session rating ≥8/10

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*release-audit" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

## SUCCESS CRITERIA

This release audit is successful when:

- [ ] All active sessions compacted to appropriate level
- [ ] Original sessions properly archived
- [ ] SESSION_REGISTRY.md fully updated
- [ ] Audit findings status verified
- [ ] Release audit report generated
- [ ] No outstanding P0 items
- [ ] Session rating >= 8/10

---

## RATE THIS SESSION (1-10)

| Rating | Quality Level |
|--------|---------------|
| 10 | Complete compaction, full audit, actionable report |
| 9 | Thorough, minor details may be missing |
| 8 | Adequate coverage (MINIMUM TARGET) |
| 7 | Basic compaction done |
| <= 6 | Incomplete or issues found |

**My Rating**: [X/10]

---

**NOW BEGIN RELEASE AUDIT**

Start with Phase 1: Context Discovery. Identify what level of compaction is needed and proceed systematically.
