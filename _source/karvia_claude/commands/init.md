# /init - Session Initialization

<!-- @GENOME T2-CMD-001 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/init | linked:- -->

**Aliases**: None
**Version**: 2.1.0
**Last Updated**: March 30, 2026
**Session Type**: INIT
**Token Budget**: ~1,200 AUTO
**Purpose**: Automated workflow for session startup, context restoration, and session verification

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| Continuity Manager | Session history | Previous context |
| Context Loader | State restoration | Current position |

---

## Document Context

### AUTO (Read at session start) - ~1,200 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| SESSION_LOG.md | T0-SES-001 | ~500 | Last 10 entries |
| Current sprint handoff | T3-SPR-xxx | ~400 | Full doc |
| Session break notes | T3-SES-xxx | ~300 | If exists |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| CLAUDE.md | T0-GOV-001 | Root directory |
| CONTEXT_REGISTRY.md | T2-ARC-001 | .claude/ |
| Sprint master plan | T3-SPR-xxx | Via handoff reference |

### AVAILABLE (Exists, request on demand)

- Previous sprint handoffs
- Technical implementation docs
- QA reports

---

## IMPORTANT: This is an AUTOMATED WORKFLOW

**Claude MUST execute each step sequentially. This command restores context from previous sessions and verifies session integrity.**

---

## Step 0: Session Seal Verification (PRE-FLIGHT CHECK)

> **Purpose**: Verify previous session closed properly. Detect and recover from incomplete closures.

### Step 0.1: Check Session Log for Latest Entry

**Read the session log and check for recent activity:**

```bash
# Get latest session entry from SESSION_LOG.md
grep -E "^\| [A-Z][a-z]+ [0-9]+" .claude/SESSION_LOG.md | tail -3
```

**Check for**:
- Last session date and type
- Quality rating (should be ≥8/10)
- Whether handoff document was updated

### Step 0.2: Verify Handoff Document Exists

**Find and read the current sprint handoff:**

```bash
# Find the current sprint folder (look for "In Progress")
ls -d KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/*"In Progress"* 2>/dev/null

# Check for handoff document
ls KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/*"In Progress"*/*HANDOFF*.md 2>/dev/null
```

**If handoff exists**: Previous session closed properly → Proceed to Step 1
**If no handoff or outdated**: Previous session may be incomplete

### Step 0.3: Recovery Protocol (If Mismatch Detected)

**If session seal verification fails:**

```markdown
⚠️ SESSION INTEGRITY WARNING

Previous session may not have completed /close properly.

**Recovery Actions:**
1. Check git status for uncommitted changes
2. Scan SESSION_LOG.md for incomplete entries
3. Ask user: "Previous session appears incomplete. Should I run recovery check? [Y/n]"

**If recovery needed:**
- Read last 50 lines of SESSION_LOG.md
- Check for uncommitted code changes
- Summarize incomplete work
```

---

## Step 1: Load Context Files (CRITICAL)

**Read these files in order to understand current state:**

### Primary Context (Always Read)

1. `.claude/SESSION_LOG.md` - Session history and current sprint progress
2. `.claude/CONTEXT_REGISTRY.md` - What to reference before creating files
3. Current sprint handoff document (found in Step 0.2)

### Sprint Context (Dynamic - Find Current)

```bash
# Find current sprint folder
CURRENT_SPRINT=$(ls -d KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/*"In Progress"* 2>/dev/null | head -1)

# Read handoff if exists
if [ -n "$CURRENT_SPRINT" ]; then
  ls "$CURRENT_SPRINT"/*HANDOFF*.md
fi
```

**Read from current sprint folder:**
- `*HANDOFF*.md` - Current progress and restart instructions
- `SESSION_BREAK_NOTES.md` - If exists, critical restart context
- `*MASTER-PLAN.md` - Sprint scope and epics

---

## Step 2: Understand the Platform

### Karvia Business Architecture Summary

**Karvia Business** is a B2B OKR management platform for SMBs (50-500 employees).

**Technology Stack**:
| Category | Technology |
|----------|------------|
| Backend | Node.js / Express 4.18 |
| Database | MongoDB / Mongoose |
| AI/LLM | OpenAI API |
| Frontend | HTML/CSS/JS |
| Email | Mailjet |

**Services**:
| Service | Port | Purpose |
|---------|------|---------|
| Main API Server | 5000 | Express API |
| IAM Engine | 8081 | Identity management |
| Assessment Engine | 8082 | SSI scoring |
| Planner Engine | 8083 | OKR planning |
| Scoring Engine | 8084 | Goal scoring |

### Key Concepts

- **Multi-tenancy**: All data filtered by company_id
- **Role hierarchy**: CONSULTANT > BUSINESS_OWNER > EXECUTIVE > MANAGER > EMPLOYEE
- **OKR Cascade**: Company → Objectives → Key Results → Goals → Tasks
- **SSI Framework**: Speed, Strength, Intelligence scoring

---

## Step 3: Provide Current State Summary

After reading context files, provide:

### 1. Session Status
```
Last Session: [#Date - Type - Summary]
Quality Rating: [X/10]
Trend: [Improving/Stable/Declining]
```

### 2. Sprint Status
```
Current Sprint: [Number - Name]
Progress: [X/Y points] ([Z%])
Status: [On track / Behind / Ahead]
Blockers: [None / List]
```

### 3. What Changed Recently
- List last 3 sessions from SESSION_LOG.md
- Note any blockers from handoff
- Highlight recommended next steps

### 4. Recommended Next Session
```
Type: [Strategy/Coding/Audit/Testing/General]
Focus: [From handoff's recommendations]
Estimated Size: [S/M/L/XL]
Token Budget: [X-YK]
```

---

## Step 4: Document Discovery Guide

**If you need to find specific information:**

| Looking For | Go To |
|-------------|-------|
| AI instructions | `CLAUDE.md` (root) |
| What to read before creating | `.claude/CONTEXT_REGISTRY.md` |
| Session history | `.claude/SESSION_LOG.md` |
| File placement rules | `.claude/MASTER_GUIDE.md` |
| Design system | `.claude/DESIGN_SYSTEM.md` |
| Sprint plans | `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/` |
| QA & Testing | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/` |
| Product roadmap | `KARVIA_STRATEGY/1-PRODUCT/roadmap/` |
| API routes | `server/routes/` |
| Data models | `server/models/` |
| Services | `server/services/` |
| Frontend pages | `client/pages/` |

---

## Step 5: Session Type Recommendation

Based on current state, recommend which session type to start:

| Condition | Recommended Command |
|-----------|---------------------|
| Sprint planning needed, architecture decisions | `/strategy` |
| Features ready to implement, specs complete | `/coding` |
| Code review needed, quality check required | `/audit` |
| Features implemented, validation needed | `/testing` |
| Questions to answer, research needed | `/general` |
| UI/mockup work needed | `/design` |

---

## Step 6: Ready to Start

After completing init, ask the user which session type they want:

- `/strategy` - Start strategy session
- `/coding` - Start coding session
- `/audit` - Start audit session
- `/testing` - Start testing session
- `/general` - Start general session
- `/design` - Start design session

**Or provide a ready-to-use starter prompt for the recommended session.**

---

## Quick Context Reference

### Key File Locations

```
.claude/                           # Session management hub
├── SESSION_LOG.md                 # Session chronicle
├── CONTEXT_REGISTRY.md            # What to read before creating
├── DESIGN_SYSTEM.md               # Navy/Gold design tokens
├── MASTER_GUIDE.md                # File placement rules
├── commands/                      # Slash commands
└── templates/                     # Document templates

KARVIA_STRATEGY/                   # Strategy & product docs
├── 1-PRODUCT/                     # Product strategy
├── 2-TECHNICAL/                   # Technical docs
├── 3-DELIVERY/
│   ├── 1-SPRINTS/                 # Sprint plans
│   └── 2-QA-AND-TESTING/          # QA docs
└── GUIDES/                        # Documentation standards

server/                            # Backend code
├── routes/                        # API endpoints
├── models/                        # Mongoose models
├── services/                      # Business logic
└── middleware/                    # Express middleware

client/                            # Frontend code
├── pages/                         # HTML pages
│   └── scripts/                   # Page-specific JS
├── js/                            # Shared JS
└── css/                           # Styles
```

---

## THE DANCE MOVE: /init ↔ /close

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION LIFECYCLE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    /init                                    /close           │
│      │                                         │             │
│      ▼                                         ▼             │
│  ┌─────────┐                            ┌──────────┐        │
│  │ Verify  │                            │ Update   │        │
│  │ Session │◄───── Work Session ───────►│ Handoff  │        │
│  │ Seal    │                            │ & Log    │        │
│  └─────────┘                            └──────────┘        │
│      │                                         │             │
│      │    ┌───────────────────────────┐       │             │
│      └───►│  SESSION MANAGEMENT       │◄──────┘             │
│           │  • SESSION_LOG.md         │                      │
│           │  • Sprint Handoff         │                      │
│           │  • Session Break Notes    │                      │
│           └───────────────────────────┘                      │
│                        │                                     │
│                        ▼                                     │
│              Context preserved for                           │
│              next Claude session                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**The session system captures:**
- **SESSION_LOG.md**: Chronicle of all sessions with metrics
- **Handoff Document**: Sprint progress and restart instructions
- **Session Break Notes**: Critical context for mid-session breaks

---

## WORKFLOW SUMMARY

```
/init
   │
   ├─► Step 0: Session Seal Verification (PRE-FLIGHT CHECK)
   │      └─► Check SESSION_LOG.md for latest session
   │      └─► Verify handoff document exists
   │      └─► If mismatch: Run recovery protocol
   │      └─► If match: Proceed normally
   │
   ├─► Step 1: Load context files (CRITICAL)
   │      └─► SESSION_LOG.md, CONTEXT_REGISTRY.md
   │      └─► Current sprint handoff
   │
   ├─► Step 2: Understand platform architecture
   │      └─► Karvia: B2B OKR platform
   │      └─► Node.js/Express, MongoDB, OpenAI
   │
   ├─► Step 3: Provide current state summary
   │      └─► Session status, sprint status
   │
   ├─► Step 4: Document discovery guide
   │      └─► Where to find information
   │
   ├─► Step 5: Session type recommendation
   │      └─► Based on handoff or current state
   │
   └─► Step 6: Ready to start
          └─► Begin work session
          └─► Remember to /close when done
```

---

## Step 7: Health Checks (ENHANCED)

### 7.1 Orphan Detection (Governed dirs only)
```bash
# Count .md files in governed directories
find .claude KARVIA_STRATEGY/1-PRODUCT KARVIA_STRATEGY/2-TECHNICAL -name "*.md" | wc -l

# Count genome tags
grep -r "@GENOME" --include="*.md" .claude/ KARVIA_STRATEGY/1-PRODUCT/ KARVIA_STRATEGY/2-TECHNICAL/ | wc -l

# If tags < 80% of files → Flag: "Orphan docs detected"
```

### 7.2 Stale Detection
```bash
# Find docs not updated in 90+ days
grep -r "@GENOME.*2025-" --include="*.md" .claude/ KARVIA_STRATEGY/
# If > 5 found → Flag: "Stale docs detected"
```

### 7.3 Status-Loading Validation
- Check if any AUTO doc has status: ARCHIVED
- Check if any AUTO doc has status: DRAFT
- If found → Flag: "WARNING: [command] loads ARCHIVED/DRAFT doc [ID]"

### 7.4 Token Budget Check
- Sum AUTO tokens for recommended session type
- If > 4,000 → Flag: "WARNING: AUTO exceeds token budget"

### 7.5 Action
- Flag only, don't block
- Suggest /audit if critical issues

---

## Exit Criteria

- [ ] Context restored from SESSION_LOG.md
- [ ] Current sprint identified
- [ ] Handoff document found and read
- [ ] Session type recommended
- [ ] Health flags reported (if any)

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*init" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

**After completing init, you're ready to begin work on Karvia Business.**

**Remember: Always run `/close` at the end of your session to preserve context!**
