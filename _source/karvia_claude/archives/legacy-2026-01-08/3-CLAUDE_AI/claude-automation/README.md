# 🤖 Claude Automation Scripts

**Purpose**: Automated session management for Claude AI development sessions
**Created**: November 5, 2025
**Version**: 1.0

---

## 🎯 What This Does

These scripts automate the session handoff process for Claude, ensuring:
- **Consistent context loading** at session start
- **Comprehensive metrics tracking** during work
- **Complete handoff documentation** at session end
- **Performance improvement** over time

---

## 📋 The Two Key Scripts

### 1. `start-session.js` - Session Initialization
**When to run**: At the beginning of every Claude session

```bash
node .claude/claude-automation/start-session.js
```

**What it does**:
- ✅ Checks active session state
- ✅ Verifies environment setup
- ✅ Checks server status
- ✅ Reviews git status
- ✅ Loads appropriate context
- ✅ Shows performance targets
- ✅ Displays immediate next actions
- ✅ Generates session start report

### 2. `end-session.js` - Session Closure ⚡ **NEW: AUTO MODE!**
**When to run**: At the end of every Claude session

```bash
# Interactive mode (asks questions)
node .claude/3-CLAUDE_AI/claude-automation/end-session.js

# 🚀 AUTO MODE (zero input required!)
node .claude/3-CLAUDE_AI/claude-automation/end-session.js --auto
```

**What it does**:
- ✅ Collects task completion data (auto-detected from git!)
- ✅ Tracks file changes (auto-detected!)
- ✅ Calculates performance metrics (4 KPIs)
- ✅ Gathers next session priorities
- ✅ Updates ACTIVE_SESSION.md
- ✅ Archives session data
- ✅ Updates MASTER_TREE files (auto!)
- ✅ Optionally commits changes (auto!)
- ✅ Prepares complete handoff

**🆕 Auto Mode Features**:
- Detects duration from last session timestamp
- Extracts tasks from git commit messages
- Scans file changes automatically
- Estimates metrics based on work done
- One confirmation prompt, then done!

---

## 🔄 Session Lifecycle

```
1. START SESSION
   └── Run: node .claude/claude-automation/start-session.js
       ├── Load previous state
       ├── Check environment
       └── Show what to work on

2. DURING SESSION
   └── Work normally
       ├── Reference ACTIVE_SESSION.md
       ├── Update progress mentally
       └── Note any blockers

3. END SESSION
   └── Run: node .claude/claude-automation/end-session.js
       ├── Record accomplishments
       ├── Calculate metrics
       └── Prepare handoff
```

---

## 📊 The 4 KPIs Tracked

### 1. Context Efficiency Ratio (CER)
- **Measures**: How well context is utilized
- **Target**: >85%
- **Formula**: (Context Used / Context Loaded) × 100

### 2. Task Completion Velocity (TCV)
- **Measures**: Speed vs estimation accuracy
- **Target**: 0.9-1.1
- **Formula**: (Tasks Done / Tasks Planned) × (Est Time / Actual Time)

### 3. Token Efficiency Score (TES)
- **Measures**: Value per token consumed
- **Target**: >0.60
- **Formula**: (Business Value / Tokens Used) × 1000

### 4. Resolution Accuracy Index (RAI)
- **Measures**: First-attempt success rate
- **Target**: >85%
- **Formula**: (First Success / Total Attempts) × 100

---

## 🚀 Quick Start Guide

### First Time Setup
```bash
# Make scripts executable
chmod +x .claude/claude-automation/*.js

# Test the scripts
node .claude/claude-automation/start-session.js
```

### Daily Workflow

#### Morning Session Start
```bash
# 1. Start your session
node .claude/claude-automation/start-session.js

# 2. Review what shows up
# 3. Continue from ACTIVE_SESSION.md instructions
```

#### Evening Session End
```bash
# 1. Finish current task
# 2. Run end session
node .claude/claude-automation/end-session.js

# 3. Answer the prompts
# 4. Session archived and ready for handoff
```

---

## 📁 File Structure

```
.claude/claude-automation/
├── README.md (this file)
├── start-session.js - Initializes new session
├── end-session.js - Closes and archives session
├── package.json - NPM dependencies
└── [future scripts]
    ├── analyze-metrics.js (planned)
    ├── generate-reports.js (planned)
    └── optimize-context.js (planned)
```

---

## 🚀 Auto Mode - Zero Input Required!

### What is Auto Mode?
Auto mode uses **git-based detection** to automatically gather session data without asking you questions. It's perfect when you just want to wrap up and go!

### Quick Start with Auto Mode

#### Option 1: Command-Line Flag (Recommended)
```bash
# Zero input required - just one confirmation
node .claude/3-CLAUDE_AI/claude-automation/end-session.js --auto
```

#### Option 2: Config File (Set and Forget)
Create `.session-config.json` in project root:
```json
{
  "autoMode": true,
  "defaultCommit": true
}
```

Then just run:
```bash
node .claude/3-CLAUDE_AI/claude-automation/end-session.js
```

#### Option 3: Environment Variable
```bash
export SESSION_AUTO_MODE=true
node .claude/3-CLAUDE_AI/claude-automation/end-session.js
```

### What Auto Mode Detects

| Data Point | How It's Detected |
|------------|-------------------|
| **Duration** | Time since last session (from ACTIVE_SESSION.md or last git commit) |
| **Tasks** | Extracted from git commit messages since last session |
| **Files Changed** | Scanned from `git status --short` |
| **Metrics** | Estimated based on files changed and tasks completed |
| **Next Priorities** | Auto-generated based on current work |

### CLI Options

```bash
# Auto mode
--auto, -a                  Enable auto mode

# Override detected duration
--duration 2.5, -d 2.5     Set duration to 2.5 hours

# Skip git commit
--skip-commit              Don't commit at the end

# Show help
--help, -h                 Display help message
```

### Examples

```bash
# Full auto mode
node .claude/3-CLAUDE_AI/claude-automation/end-session.js --auto

# Auto mode with custom duration
node .claude/3-CLAUDE_AI/claude-automation/end-session.js --auto --duration 1.5

# Auto mode, but skip commit (commit manually later)
node .claude/3-CLAUDE_AI/claude-automation/end-session.js --auto --skip-commit

# Show all options
node .claude/3-CLAUDE_AI/claude-automation/end-session.js --help
```

### How Accurate is Auto-Detection?

| Metric | Accuracy | Notes |
|--------|----------|-------|
| Duration | ⭐⭐⭐⭐ | Very accurate if sessions are regular |
| Tasks | ⭐⭐⭐⭐⭐ | Perfect if you commit frequently |
| Files | ⭐⭐⭐⭐⭐ | 100% accurate from git status |
| Metrics | ⭐⭐⭐ | Estimated but reasonable |

**Pro Tip**: Commit frequently with descriptive messages for best auto-detection results!

---

## 🔧 Configuration

The scripts use these paths:
```javascript
PROJECT_ROOT: /Users/sagarrs/Desktop/official_dev/karvia_business
SESSION_MGMT: KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT
ACTIVE_SESSION: SESSION_MANAGEMENT/ACTIVE_SESSION.md
CLAUDE_PATH: .claude/
```

To modify paths, edit the configuration section in each script.

---

## 📊 Output Files

### start-session.js creates:
```
SESSION_MANAGEMENT/CURRENT_SESSION_START.md - Session initialization report
```

### end-session.js creates:
```
SESSION_MANAGEMENT/ACTIVE_SESSION.md - Updated with latest state
SESSION_MANAGEMENT/sessions/{SESSION-ID}/ - Archived session data
  ├── SESSION_METRICS.json - Performance metrics
  └── SESSION_STATE.md - Final session state
```

---

## 💡 Best Practices

### DO's ✅
1. **Always run start-session.js** when beginning work
2. **Always run end-session.js** before stopping
3. **Answer prompts honestly** for accurate metrics
4. **Review metrics** to identify improvement areas
5. **Commit frequently** during work

### DON'Ts ❌
1. **Don't skip session scripts** - breaks continuity
2. **Don't estimate randomly** - skews metrics
3. **Don't forget blockers** - important for next session
4. **Don't rush end-session** - handoff quality matters

---

## 🐛 Troubleshooting

### Issue: Scripts won't run
```bash
# Check Node.js is installed
node --version

# Make sure you're in project root
pwd
# Should show: /Users/sagarrs/Desktop/official_dev/karvia_business
```

### Issue: Can't find active session
```bash
# Check if ACTIVE_SESSION.md exists
ls KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/

# If missing, create manually or run end-session first
```

### Issue: Git errors
```bash
# Scripts work best with clean git state
git status
git add .
git commit -m "Save work"
```

---

## 🔄 Integration with MCP (Future)

These scripts are designed to be MCP-ready. Future integration will allow:
- Automatic context loading based on task
- Real-time metrics tracking
- Intelligent context pruning
- Performance optimization suggestions

For now, they work as standalone Node.js scripts.

---

## 📈 Performance Tracking

After each session, review your metrics:

```bash
# View latest metrics
cat KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/ACTIVE_SESSION.md | grep -A 5 "Performance Scores"

# View historical metrics
ls KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/sessions/
```

Track trends over time:
- Is CER improving? (using context better)
- Is TCV stabilizing? (better estimation)
- Is TES increasing? (more efficient)
- Is RAI growing? (fewer errors)

---

## 🎯 Goals

### Short Term
- Reduce session handoff time by 50%
- Improve context efficiency to >85%
- Achieve consistent TCV of 0.9-1.1

### Long Term
- Fully automated context management
- Predictive task estimation
- Zero-friction handoffs
- Self-improving system

---

## 🔗 Related Documentation

- [Session Management README](../../KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/README.md)
- [Performance Metrics Guide](../../KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/PERFORMANCE_METRICS.md)
- [Handoff Guidelines](../HANDOFF_GUIDELINES.md)

---

## 📞 Support

If scripts fail or need modification:
1. Check error messages
2. Review this README
3. Check SESSION_MANAGEMENT/README.md
4. Modify scripts as needed (they're just JavaScript!)

---

**Remember**: These scripts are tools to improve efficiency. The goal is better handoffs, faster context loading, and continuous improvement of Claude's performance.

**Pro Tip**: Run `start-session.js` first thing, and `end-session.js` last thing. Make it a habit!