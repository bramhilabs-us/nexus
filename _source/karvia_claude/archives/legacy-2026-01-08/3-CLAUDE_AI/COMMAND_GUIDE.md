# 📖 Claude Command Guide

> **Complete reference for all Claude commands and interactions**

## 🎯 Quick Reference Card

### Most Used Commands
```bash
# Session Management
"start session"     # Begin work
"end session"       # Save and close

# Mode Selection
"let's code"        # Enter coding mode
"let's test"        # Enter testing mode
"let's debug"       # Enter debug mode
"let's plan"        # Enter planning mode

# Quick Actions
"status"            # Current state
"help"             # Show commands
"next"             # Next task
```

---

## 📚 Complete Command Reference

### 🔄 Session Management Commands

| Command | Action | Context Loaded | When to Use |
|---------|--------|---------------|-------------|
| **start session** | Initialize Claude | Active session, git status, health | Beginning work |
| **start sprint** | Begin sprint cycle | Sprint goals, backlog, velocity | Sprint day 1 |
| **start project** | New project setup | Project template, structure | New initiative |
| **start feature** | Feature development | Feature spec, related code | New feature |
| **end session** | Close and handoff | Saves state, archives | Stopping work |
| **end sprint** | Sprint closure | Metrics, retrospective | Sprint day 10 |
| **end project** | Project archive | Documentation, handoff | Project complete |
| **end feature** | Feature complete | Tests, documentation | Feature done |

### 💻 Development Mode Commands

| Command | Mode | Focus | Context Package |
|---------|------|-------|-----------------|
| **let's code** | CODE | Implementation | Standards, tests, APIs |
| **let's test** | TEST | Quality assurance | Test suites, coverage |
| **let's debug** | DEBUG | Problem solving | Logs, errors, traces |
| **let's review** | REVIEW | Code review | PR, standards, checklist |
| **let's refactor** | REFACTOR | Code improvement | Metrics, patterns |
| **let's optimize** | OPTIMIZE | Performance | Profiler, benchmarks |

### 📋 Planning Commands

| Command | Mode | Output | Documents Loaded |
|---------|------|--------|------------------|
| **let's plan** | PLAN | Sprint plan | Backlog, velocity |
| **let's strategize** | STRATEGY | Long-term vision | Roadmap, OKRs |
| **let's estimate** | ESTIMATE | Story points | Historical data |
| **let's prioritize** | PRIORITIZE | Ordered backlog | Value matrix |
| **let's design** | DESIGN | Architecture | Patterns, diagrams |
| **let's brainstorm** | IDEATION | Ideas, solutions | Market research |

### 🚀 Operations Commands

| Command | Mode | Purpose | Checklist |
|---------|------|---------|-----------|
| **let's deploy** | DEPLOY | Production release | Deploy checklist |
| **let's release** | RELEASE | Version release | Release notes |
| **let's rollback** | ROLLBACK | Emergency revert | Rollback guide |
| **let's monitor** | MONITOR | System observation | Metrics, alerts |
| **let's scale** | SCALE | Capacity planning | Performance data |

### 📝 Documentation Commands

| Command | Purpose | Output | Templates |
|---------|---------|--------|-----------|
| **let's document** | Create documentation | Docs, README | Doc templates |
| **let's explain** | Explain code/concept | Explanation | Examples |
| **let's diagram** | Create diagrams | Flowcharts, ERD | Diagram tools |
| **let's comment** | Add code comments | Commented code | Comment standards |

---

## 🎮 Mode-Specific Commands

### 🧑‍💻 CODE MODE Commands
```bash
# Implementation
"implement [feature]"    # Start coding feature
"create [component]"     # New component
"add [endpoint]"        # New API endpoint
"integrate [service]"   # Third-party integration

# Code Quality
"lint"                  # Run linter
"format"                # Format code
"analyze"               # Static analysis
"secure"                # Security scan

# Git Operations
"commit"                # Commit changes
"push"                  # Push to remote
"pr"                    # Create pull request
"merge"                 # Merge branch
```

### 🧪 TEST MODE Commands
```bash
# Test Execution
"run tests"             # Run all tests
"run unit"              # Unit tests only
"run integration"       # Integration tests
"run e2e"               # End-to-end tests

# Test Creation
"write test"            # Create new test
"add scenario"          # New test scenario
"mock [service]"        # Create mock
"fixture [data]"        # Test fixtures

# Coverage
"coverage"              # Show coverage
"coverage report"       # Detailed report
"missing coverage"      # Uncovered code
"improve coverage"      # Add tests for gaps
```

### 🔍 DEBUG MODE Commands
```bash
# Investigation
"show error"            # Display error details
"trace"                 # Execution trace
"logs"                  # View logs
"stack"                 # Stack trace

# Analysis
"isolate"               # Find root cause
"reproduce"             # Recreate issue
"bisect"                # Git bisect
"profile"               # Performance profile

# Resolution
"fix"                   # Apply solution
"patch"                 # Quick fix
"workaround"            # Temporary solution
"verify"                # Confirm resolution
```

### 📋 PLAN MODE Commands
```bash
# Sprint Planning
"create sprint"         # New sprint plan
"add story"             # Add user story
"break down"            # Task breakdown
"estimate"              # Story points

# Backlog Management
"groom backlog"         # Refine stories
"prioritize"            # Order by value
"dependencies"          # Map dependencies
"capacity"              # Team capacity

# Tracking
"velocity"              # Sprint velocity
"burndown"              # Burndown chart
"risks"                 # Risk assessment
"blockers"              # Current blockers
```

---

## 🔄 Mode Switching Commands

### Switching Between Modes
```bash
# Direct Switch
"switch to code"        # Change to code mode
"switch to test"        # Change to test mode
"switch to debug"       # Change to debug mode
"switch to plan"        # Change to plan mode

# Context-Aware Switch
"need to test this"     # Auto-switch to test
"found a bug"           # Auto-switch to debug
"ready to deploy"       # Auto-switch to deploy
"let's plan next"       # Auto-switch to plan
```

---

## ⚡ Quick Action Commands

### Information Commands
```bash
"status"                # Current state overview
"context"               # Loaded documents
"tasks"                 # Active task list
"next"                  # Next priority item
"progress"              # Sprint/project progress
"metrics"               # Performance metrics
"health"                # System health check
```

### Navigation Commands
```bash
"show [file]"           # Display file
"find [term]"           # Search codebase
"goto [location]"       # Navigate to code
"list [items]"          # List resources
"tree"                  # Show structure
```

### Help Commands
```bash
"help"                  # General help
"help [command]"        # Command-specific help
"examples"              # Usage examples
"shortcuts"             # Available shortcuts
"modes"                 # Available modes
```

---

## 🎯 Command Patterns

### Natural Language Patterns
```bash
# Question Format
"what's the status?"    → status
"what's next?"          → next
"what modes available?" → modes
"what can I do?"        → help

# Action Format
"show me the logs"      → logs
"run the tests"         → run tests
"check the coverage"    → coverage
"create a new feature"  → start feature

# Contextual Format
"I need to debug this"  → switch to debug
"ready to deploy"       → switch to deploy
"time to plan"          → switch to plan
```

---

## 🔧 Command Modifiers

### Scope Modifiers
```bash
"run tests --unit"      # Unit tests only
"coverage --detailed"   # Detailed report
"status --verbose"      # Full status
"deploy --staging"      # Staging deploy
```

### Speed Modifiers
```bash
"quick test"            # Fast smoke test
"quick review"          # Brief review
"quick fix"             # Hotfix mode
"full test"             # Complete suite
```

---

## 📊 Command Responses

### Expected Response Format
```yaml
Command Executed: [command]
Mode: [current mode]
Context Loaded: [X documents, Y tokens]
Action Taken: [what happened]
Next Steps: [suggested actions]
```

### Example Interaction
```
User: "let's code"

Claude: 🧑‍💻 CODE MODE Activated
        ✅ Loaded: CODE_STANDARDS.md, current feature, tests
        📊 Context: 1,847 tokens
        🎯 Focus: Feature implementation
        📋 Checklist: 5 items

        Ready to code. What feature are we building?

User: "implement user authentication"

Claude: Starting implementation of user authentication...
        [Shows relevant code structure, suggests approach]
```

---

## 🚀 Power User Tips

### Command Chaining
```bash
"start session and show status"
"run tests then coverage"
"fix bug and verify"
"commit and push"
```

### Contextual Shortcuts
- During code mode: "test" → write test for current code
- During debug mode: "fix" → apply solution
- During plan mode: "estimate" → size current story
- During review mode: "approve" → mark as reviewed

### Smart Defaults
- Morning: Auto-suggests plan mode
- After commit: Auto-suggests test mode
- On errors: Auto-suggests debug mode
- End of sprint: Auto-suggests deploy mode

---

## 📝 Custom Commands (Project-Specific)

### Karvia-Specific Commands
```bash
"okr sync"              # Sync OKR data
"run engines"           # Start microservices
"check iam"             # Verify authentication
"assessment flow"       # Test assessment
"generate okrs"         # AI OKR generation
```

---

## 🎓 Learning Commands

### Tutorial Commands
```bash
"teach me [topic]"      # Educational mode
"explain [concept]"     # Detailed explanation
"show example"          # Code examples
"best practice"         # Best practices
"why [decision]"        # Reasoning explanation
```

---

## 🔒 Safety Commands

### Confirmation Required
```bash
"deploy production"     # Requires confirmation
"rollback"             # Requires confirmation
"delete"               # Requires confirmation
"force push"           # Requires confirmation
"drop database"        # Requires confirmation
```

---

## 📈 Command Analytics

Claude tracks command usage to:
- Suggest common next commands
- Optimize context loading
- Improve response time
- Learn user patterns

---

**Pro Tip:** Commands are flexible! Claude understands variations like "let's start coding" = "let's code" = "code mode" = "implement"