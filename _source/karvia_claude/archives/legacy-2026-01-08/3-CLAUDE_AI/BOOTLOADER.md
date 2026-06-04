# 🚀 Claude Bootloader

> **Core initialization and mode management system for optimal Claude performance**

## 🔄 Boot Sequence (Automatic on Session Start)

```
┌─────────────────────────────────────────┐
│  1. CORE BOOT (5 seconds)               │
│     └─> Load minimal context            │
│  2. STATUS CHECK (10 seconds)           │
│     └─> Assess current state            │
│  3. MODE DETECTION (5 seconds)          │
│     └─> Auto-detect or ask user         │
│  4. MODE LOADING (10 seconds)           │
│     └─> Load mode-specific context      │
│  5. READY STATE                         │
│     └─> Optimized for specific work     │
└─────────────────────────────────────────┘
```

---

## 📊 Phase 1: CORE BOOT (Always Loaded)

### Minimal Context Package (~500 tokens)
```yaml
Always Load:
  - ACTIVE_SESSION.md          # Current state
  - Git status                  # What's changed
  - System health               # Services running
  - Last session metrics        # Performance data
  - Current sprint day          # Timeline context
```

### Boot Commands
```bash
# Check active session
cat KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/ACTIVE_SESSION.md

# Check git status
git status --short

# Check system health
./.claude/1-OPERATIONS/ENVIRONMENT/health-check.sh

# Check sprint progress
# Extract from MASTER_DEV_LIST.md
```

---

## 🔍 Phase 2: STATUS CHECK

### Auto-Detection Logic
```javascript
detectMode() {
  // Priority order for mode detection

  1. Check handoff document
     if (ACTIVE_SESSION.md contains "continue:")
       → Continue previous mode

  2. Check git branch
     if (branch.startsWith("feature/")) → CODE MODE
     if (branch.startsWith("fix/")) → DEBUG MODE
     if (branch.startsWith("test/")) → TEST MODE

  3. Check sprint progress
     if (sprintDay <= 2) → PLAN MODE
     if (sprintDay >= 8) → TEST MODE
     if (sprintDay === 10) → DEPLOY MODE

  4. Check system state
     if (testsFailure > 0) → DEBUG MODE
     if (PR.isOpen) → REVIEW MODE
     if (coverage < 80%) → TEST MODE

  5. Default: Ask user
     "What's the focus today?"
}
```

---

## 🎯 Phase 3: MODE SELECTION

### Available Modes

| Mode | Trigger Commands | Sprint Days | Auto-Detect |
|------|-----------------|-------------|-------------|
| 📋 PLAN | "let's plan", "start sprint" | 1-2 | Beginning of sprint |
| 🧑‍💻 CODE | "let's code", "implement" | 3-7 | Feature branches |
| 🧪 TEST | "let's test", "verify" | 6-9 | Low coverage |
| 🔍 DEBUG | "let's debug", "fix" | Any | Failing tests |
| 📝 REVIEW | "let's review", "check" | Any | Open PRs |
| 🚀 DEPLOY | "let's deploy", "release" | 9-10 | End of sprint |
| 🎯 STRATEGY | "let's strategize" | 1-2 | Planning phase |
| 📚 DOCUMENT | "let's document" | Any | Low documentation |

---

## 📦 Phase 4: MODE-SPECIFIC LOADING

### 🧑‍💻 CODE MODE Package (~2000 tokens)
```yaml
Context Loaded:
  Core:
    - Current feature specification
    - Related code files
    - Existing tests
    - API contracts

  Standards:
    - CODE_STANDARDS.md
    - API_DESIGN.md
    - DATABASE_SCHEMA.md

  Tools:
    - Linter configuration
    - Test runner setup
    - Git workflow

  Checklist:
    - [ ] Tests written
    - [ ] Code reviewed
    - [ ] Documentation updated
    - [ ] No console.logs
    - [ ] Security checked
```

### 🧪 TEST MODE Package (~1500 tokens)
```yaml
Context Loaded:
  Core:
    - Test suites
    - Coverage reports
    - CI/CD status
    - Test scenarios

  Standards:
    - TESTING_GUIDE.md
    - TEST_SCENARIOS.md
    - Coverage requirements

  Tools:
    - Test runner commands
    - Coverage tools
    - Mock data

  Checklist:
    - [ ] Unit tests complete
    - [ ] Integration tests pass
    - [ ] E2E scenarios covered
    - [ ] Coverage > 80%
    - [ ] Performance benchmarks
```

### 🔍 DEBUG MODE Package (~1800 tokens)
```yaml
Context Loaded:
  Core:
    - Error logs
    - Stack traces
    - Failing tests
    - Recent changes

  Standards:
    - TROUBLESHOOTING.md
    - DEBUG_GUIDE.md
    - COMMON_ERRORS.md

  Tools:
    - Debugger configuration
    - Log analysis
    - Performance profiler

  Process:
    1. Reproduce issue
    2. Isolate problem
    3. Write failing test
    4. Fix issue
    5. Verify fix
```

### 📋 PLAN MODE Package (~2500 tokens)
```yaml
Context Loaded:
  Core:
    - Sprint backlog
    - User stories
    - Velocity metrics
    - Roadmap

  Standards:
    - Planning templates
    - Estimation guide
    - Priority matrix

  Tools:
    - Task breakdown
    - Story points
    - Dependencies

  Output:
    - Sprint plan
    - Task assignments
    - Risk assessment
    - Success criteria
```

### 🚀 DEPLOY MODE Package (~2000 tokens)
```yaml
Context Loaded:
  Core:
    - Deployment checklist
    - Environment configs
    - Release notes
    - Rollback plan

  Standards:
    - PRODUCTION_GUIDE.md
    - ROLLBACK_GUIDE.md
    - Security checklist

  Tools:
    - CI/CD pipeline
    - Health checks
    - Monitoring setup

  Verification:
    - [ ] All tests pass
    - [ ] Security scan clean
    - [ ] Performance validated
    - [ ] Rollback tested
    - [ ] Team notified
```

---

## 🔄 Phase 5: READY STATE

### Mode Confirmation
```markdown
Claude: "[MODE] Mode Active - Context Loaded"
        "✅ Loaded: [list of loaded docs]"
        "🎯 Focus: [mode description]"
        "📋 Checklist: [X items to complete]"

        "Ready. What would you like to do?"

Commands available in this mode:
- [mode-specific commands]
- "switch to [mode]" - Change mode
- "status" - Current state
- "help" - Show commands
```

---

## 💫 Mode Switching

### Mid-Session Mode Change
```yaml
Command: "switch to test"

Process:
  1. Save current mode state
  2. Unload unnecessary context
  3. Load new mode context
  4. Confirm switch complete

Example:
  User: "switch to test"
  Claude: "Switching from CODE to TEST mode..."
          "Saving code context..."
          "Loading test suites..."
          "✅ TEST Mode active"
```

### Context Preservation
- Previous mode context saved to memory
- Can switch back without reloading
- Maximum 3 modes in memory
- LRU (Least Recently Used) eviction

---

## 🎮 Quick Commands by Mode

### Universal Commands (All Modes)
```bash
"status"          # Current state
"help"            # Available commands
"switch to X"     # Change mode
"context"         # What's loaded
"tasks"           # Active tasks
"next"            # Next priority
```

### Mode-Specific Commands
```bash
CODE MODE:
  "implement"     # Start coding
  "test first"    # TDD approach
  "refactor"      # Improve code
  "commit"        # Save changes

TEST MODE:
  "run tests"     # Execute suite
  "coverage"      # Check coverage
  "add test"      # Write new test
  "mock data"     # Generate mocks

DEBUG MODE:
  "trace"         # Follow execution
  "isolate"       # Find root cause
  "fix"           # Apply solution
  "verify"        # Confirm fixed

PLAN MODE:
  "estimate"      # Size tasks
  "prioritize"    # Order backlog
  "assign"        # Distribute work
  "timeline"      # Create schedule
```

---

## 📈 Mode Performance Metrics

### Tracking Success per Mode
```yaml
CODE MODE:
  - Lines written per hour
  - Test coverage maintained
  - Code quality score
  - Review feedback incorporated

TEST MODE:
  - Tests written
  - Coverage increased
  - Bugs found
  - Test execution time

DEBUG MODE:
  - Time to resolution
  - Root cause accuracy
  - Fix effectiveness
  - Regression prevention

PLAN MODE:
  - Estimation accuracy
  - Task completion rate
  - Sprint velocity
  - Risk mitigation
```

---

## 🔧 Configuration

### Mode Preferences (customizable)
```javascript
// .claude/3-CLAUDE_AI/mode-config.json
{
  "autoDetect": true,
  "defaultMode": "code",
  "contextLimit": 5000,
  "preserveContext": true,
  "modes": {
    "code": {
      "autoLoadTests": true,
      "enforceStandards": true,
      "requireTests": true
    },
    "test": {
      "coverageTarget": 80,
      "runOnSave": true,
      "mockAutoGenerate": true
    }
  }
}
```

---

## 🚦 Mode Indicators

### Visual Feedback
```
[PLAN MODE] 📋 Planning Sprint 6
[CODE MODE] 🧑‍💻 Feature: user-auth
[TEST MODE] 🧪 Coverage: 78%
[DEBUG MODE] 🔍 Fixing: login-error
[DEPLOY MODE] 🚀 Releasing: v1.2.0
```

---

## 📚 Mode Documentation Links

### Each Mode References:
```yaml
CODE MODE → Links to:
  - /2-DEVELOPMENT/STANDARDS/
  - /4-KNOWLEDGE_BASE/ARCHITECTURE/
  - Current feature docs

TEST MODE → Links to:
  - /2-DEVELOPMENT/TESTING/
  - Test plan documents
  - Coverage requirements

DEBUG MODE → Links to:
  - /5-TROUBLESHOOTING/
  - /1-OPERATIONS/MONITORING/
  - Error documentation

PLAN MODE → Links to:
  - /KARVIA_STRATEGY/3-DELIVERY/
  - Sprint planning docs
  - Velocity metrics

DEPLOY MODE → Links to:
  - /1-OPERATIONS/DEPLOYMENT/
  - Release procedures
  - Rollback plans
```

---

## 🎯 Success Criteria

### Bootloader is successful when:
1. ✅ Mode detected in < 20 seconds
2. ✅ Relevant context loaded
3. ✅ No unnecessary files loaded
4. ✅ Token usage optimized
5. ✅ User can start work immediately
6. ✅ Mode switching is seamless

---

**Remember:** The goal is to have Claude operating at peak efficiency in each mode by having exactly the right context, tools, and processes loaded for the task at hand.