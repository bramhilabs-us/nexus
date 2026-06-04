# 🧠 Session Management System for Claude

**Purpose**: Optimize context handoffs between Claude sessions for maximum efficiency
**Created**: November 5, 2025
**Version**: 1.0

---

## 🎯 The Problem We're Solving

When Claude sessions end (context limit, timeout, or user break), we lose:
- Working context (which files, which lines)
- Task progress state
- Decision history
- Performance patterns

This system provides a **"state management" solution** for Claude sessions, similar to how React manages component state or how video games save progress.

---

## 🏗️ System Architecture

```
Session Management Hierarchy
│
├── 🔥 ACTIVE_SESSION.md (Hot State)
│   └── Current working context - CHECK THIS FIRST!
│
├── 📊 PERFORMANCE_METRICS.md (KPI Tracking)
│   └── Measure and improve efficiency
│
├── 📋 SESSION_TEMPLATE.md (New Session Setup)
│   └── Template for consistent handoffs
│
└── 📁 sessions/ (Historical Archive)
    └── Individual session records
```

---

## 🚀 How to Use This System

### For Claude Starting a New Session

#### Step 1: Check Active Session (ALWAYS FIRST!)
```bash
# First command Claude should run
cat /Users/sagarrs/Desktop/official_dev/karvia_business/KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/ACTIVE_SESSION.md
```

This tells you:
- What was being worked on
- Exact files and line numbers
- Current task progress
- Immediate next actions

#### Step 2: Verify Environment
```bash
# Second command
node .claude/verify-environment.js
```

#### Step 3: Continue Work
The ACTIVE_SESSION.md will have specific instructions like:
```bash
cd /Users/sagarrs/Desktop/official_dev/karvia_business/client/js
# Continue implementing weekly-goals.js starting at line 145
```

### For Claude Ending a Session

#### Step 1: Update Active Session
```markdown
1. Update completion percentages
2. Note exactly where you stopped
3. List any blockers
4. Provide next steps
```

#### Step 2: Calculate Metrics
```markdown
- Tasks completed vs planned
- Time taken vs estimated
- Tokens used (estimate)
- Errors encountered
```

#### Step 3: Create Session Archive
```bash
# Copy current session to archive
cp ACTIVE_SESSION.md sessions/2025-11-05-PM/SESSION_STATE.md
```

---

## 📊 The Four KPIs We Track

### 1. Context Efficiency Ratio (CER)
**Goal**: Use provided context effectively
```
Formula: (Context Actually Used / Context Loaded) × 100
Target: >85%
Current: 80%
```

**Why It Matters**: Loading unnecessary context wastes tokens and confuses focus.

**How to Improve**:
- Load ACTIVE_SESSION.md first
- Only load other docs when needed
- Use hierarchical loading (immediate → sprint → project)

### 2. Task Completion Velocity (TCV)
**Goal**: Complete tasks at estimated pace
```
Formula: (Tasks Completed / Tasks Attempted) × (Est Time / Actual Time)
Target: 0.9-1.1 (within 10% of estimate)
Current: 0.67 (taking longer than estimated)
```

**Why It Matters**: Better estimation = better planning = more value delivered.

**How to Improve**:
- Break large tasks into smaller chunks
- Use similar completed tasks as templates
- Account for testing and documentation time

### 3. Token Efficiency Score (TES)
**Goal**: Maximize value per token used
```
Formula: (Business Value Points / Tokens Used) × 1000
Target: >0.60
Current: 0.50
```

**Why It Matters**: Tokens = cost. Better efficiency = more features for same cost.

**How to Improve**:
- Use code templates (saves 40% tokens)
- Batch file operations (saves 15% tokens)
- Avoid reloading same context (saves 30% tokens)

### 4. Resolution Accuracy Index (RAI)
**Goal**: Get it right the first time
```
Formula: (First-Attempt Successes / Total Attempts) × 100
Target: >85%
Current: 84%
```

**Why It Matters**: Rework wastes time and tokens.

**How to Improve**:
- Check existing patterns before writing new code
- Test incrementally
- Use linting and validation

---

## 📋 Session State Hierarchy

### Level 1: Immediate Context (Leaf Nodes)
**What**: The exact work being done right now
```markdown
- Current file: weekly-goals.js
- Current function: renderCalendarView()
- Current line: 145-203
- Current task: Add drag-and-drop
```

**When to Load**: ALWAYS - This is your working memory

### Level 2: Sprint Context (Branch)
**What**: Current sprint goals and progress
```markdown
- Sprint goals
- Dependencies
- Blockers
- Team decisions
```

**When to Load**: When switching tasks or checking progress

### Level 3: Project Context (Root)
**What**: Overall system architecture
```markdown
- System design
- Business requirements
- Technical constraints
```

**When to Load**: Only when making architectural decisions

---

## 🔄 Session Lifecycle

```
1. SESSION START
   ├── Load ACTIVE_SESSION.md
   ├── Verify environment
   ├── Continue from exact stopping point
   └── Track start time

2. DURING SESSION
   ├── Update metrics hourly
   ├── Commit frequently
   ├── Update task progress
   └── Note any blockers

3. SESSION END
   ├── Update ACTIVE_SESSION.md
   ├── Calculate final metrics
   ├── Archive session record
   └── Prepare handoff for next
```

---

## 📈 Performance Improvement Loop

```
Measure Performance → Identify Patterns → Optimize Process → Apply Learning
         ↑                                                            ↓
         ←←←←←←←←←←←←←← Continuous Improvement ←←←←←←←←←←←←←←←←←←←←
```

### Daily Improvement Goals
- Reduce context switches by 1
- Improve TCV by 0.05
- Reduce token usage by 5%
- Increase RAI by 2%

### Weekly Improvement Review
Every Friday, review:
1. Which patterns worked well?
2. Which patterns caused issues?
3. What can be standardized?
4. What should be avoided?

---

## 🎯 Best Practices

### DO's ✅
1. **Always start with ACTIVE_SESSION.md**
2. **Update progress every hour**
3. **Use existing code as templates**
4. **Batch similar operations**
5. **Commit completed work immediately**
6. **Test incrementally**
7. **Document decisions**

### DON'Ts ❌
1. **Don't reload full context repeatedly**
2. **Don't skip environment verification**
3. **Don't leave session without updating handoff**
4. **Don't work on multiple branches simultaneously**
5. **Don't ignore performance metrics**

---

## 🔧 Quick Reference Commands

### Session Start Commands
```bash
# 1. Check active session
cat KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/ACTIVE_SESSION.md

# 2. Verify environment
node .claude/verify-environment.js

# 3. Check server
curl http://localhost:8080/api/health

# 4. Navigate to work
cd /Users/sagarrs/Desktop/official_dev/karvia_business
```

### Session End Commands
```bash
# 1. Commit changes
git add .
git commit -m "Session: [description]"

# 2. Update metrics
# Edit ACTIVE_SESSION.md with final state

# 3. Archive session
DATE=$(date +%Y-%m-%d-%H%M)
cp ACTIVE_SESSION.md sessions/$DATE/SESSION_STATE.md
```

### Performance Check Commands
```bash
# Check current metrics
cat PERFORMANCE_METRICS.md | grep "Current"

# View task progress
cat ACTIVE_SESSION.md | grep "STATUS:"

# Check token usage (estimate)
# Count context loads and operations
```

---

## 📊 Metrics Dashboard Example

```json
{
  "current_session": {
    "id": "SESSION-2025-11-05-2100",
    "duration": "3h 15m",
    "status": "active",
    "sprint": "SPRINT-1",
    "day": 3
  },
  "performance": {
    "CER": {"value": 80, "target": 85, "trend": "↑"},
    "TCV": {"value": 0.67, "target": 0.90, "trend": "↓"},
    "TES": {"value": 0.50, "target": 0.60, "trend": "→"},
    "RAI": {"value": 84, "target": 85, "trend": "↑"}
  },
  "progress": {
    "tasks_completed": 8,
    "tasks_remaining": 4,
    "sprint_completion": "45%",
    "blockers": 0
  },
  "recommendations": [
    "Break tasks into smaller chunks",
    "Use quarterly-goals.js as template",
    "Batch file operations"
  ]
}
```

---

## 🏆 Success Metrics

### Session Success Criteria
- All primary goals completed
- Metrics within target range
- Clean handoff prepared
- No P0 bugs introduced

### Sprint Success Criteria
- 90% of planned tasks completed
- Average TCV > 0.85
- Average RAI > 85%
- Token usage within budget

### Project Success Criteria
- On-time delivery
- Quality standards met
- Efficient resource usage
- Knowledge transferred

---

## 🔄 Continuous Improvement

### After Each Session
1. Review what worked well
2. Identify what didn't work
3. Update best practices
4. Adjust estimates

### After Each Sprint
1. Analyze metric trends
2. Update templates
3. Refine processes
4. Share learnings

### Monthly Review
1. Overall efficiency trends
2. Cost per feature analysis
3. Quality metrics review
4. Process optimization

---

## 📚 Related Documents

- [ACTIVE_SESSION.md](./ACTIVE_SESSION.md) - Current state
- [PERFORMANCE_METRICS.md](./PERFORMANCE_METRICS.md) - KPI details
- [SESSION_TEMPLATE.md](./SESSION_TEMPLATE.md) - New session template
- [../PRE-SPRINT/](../PRE-SPRINT/) - Sprint handoffs
- [../../README.md](../../README.md) - Delivery overview

---

## 🎯 Remember

**The goal isn't just to complete tasks, but to continuously improve HOW we complete them.**

Each session should be:
- More efficient than the last
- Better documented
- Easier to hand off
- Higher quality output

---

**System Version**: 1.0
**Maintained By**: Development Team
**Review Frequency**: After each sprint

**KEY POINT**: Always start with ACTIVE_SESSION.md - it's your restore point!