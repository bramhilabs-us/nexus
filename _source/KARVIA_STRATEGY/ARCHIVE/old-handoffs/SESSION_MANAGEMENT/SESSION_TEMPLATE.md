# 📋 Claude Session Template

**Instructions**: Copy this template for each new session, fill in the sections
**Location**: Save as `sessions/YYYY-MM-DD-AMPM/SESSION_STATE.md`

---

## 🔄 Session Initialization

```markdown
Session ID: SESSION-[YYYY-MM-DD-HHMM]
Start Time: [ISO timestamp]
Previous Session: [Link to previous session]
Sprint: [Current sprint name]
Day: [Sprint day X of Y]
```

---

## 🎯 Session Objectives

### Primary Goals (Must Complete)
1. [ ] Goal 1
2. [ ] Goal 2
3. [ ] Goal 3

### Secondary Goals (If Time Permits)
1. [ ] Goal 4
2. [ ] Goal 5

### Success Criteria
- [ ] All primary goals completed
- [ ] No P0 bugs introduced
- [ ] Tests written for new code
- [ ] Documentation updated

---

## 🌿 Context Loading

### Immediate Context (Load First)
```markdown
1. ACTIVE_SESSION.md - Current state
2. [Specific file being worked on]
3. [Related test file]
```

### Sprint Context (Load if Needed)
```markdown
1. MASTER_DEV_LIST.md#current-week
2. Current sprint goals
3. Dependencies and blockers
```

### Project Context (Reference Only)
```markdown
1. SYSTEM_OVERVIEW.md
2. PRODUCT_ARCHITECTURE.md
3. FEATURE_CATALOG.md
```

---

## 💻 Working Context

### Files to Modify
```javascript
// List files with specific line numbers
1. File: [path/to/file]
   Lines: [XXX-YYY]
   Task: [What to do]

2. File: [path/to/file2]
   Lines: [XXX-YYY]
   Task: [What to do]
```

### New Files to Create
```markdown
1. [path/to/newfile] - [Purpose] - [Est. lines]
2. [path/to/newfile2] - [Purpose] - [Est. lines]
```

### Tests to Write
```markdown
1. Test for: [Feature/Function]
   Type: [Unit/Integration/E2E]
   Coverage Target: [X%]
```

---

## 📊 Session Metrics (Fill During Session)

### Task Tracking
| Task | Estimated | Started | Completed | Actual Time | Notes |
|------|-----------|---------|-----------|-------------|--------|
| Task 1 | 30 min | HH:MM | HH:MM | XX min | |
| Task 2 | 45 min | HH:MM | HH:MM | XX min | |

### Performance Tracking
```json
{
  "tasks_attempted": 0,
  "tasks_completed": 0,
  "files_created": 0,
  "files_modified": 0,
  "lines_added": 0,
  "lines_deleted": 0,
  "tests_written": 0,
  "tests_passing": 0,
  "errors_encountered": 0,
  "context_switches": 0
}
```

---

## 🔥 Hot Issues (Track During Session)

### Blockers Encountered
1. Issue: [Description]
   Status: [Resolved/Pending]
   Workaround: [If applicable]

### Decisions Made
1. Decision: [What was decided]
   Rationale: [Why]
   Impact: [What it affects]

---

## 📝 Session Notes

### What's Working Well
- [Positive observation 1]
- [Positive observation 2]

### What's Not Working
- [Issue 1]
- [Issue 2]

### Ideas for Improvement
- [Idea 1]
- [Idea 2]

---

## 🔄 Handoff Preparation (Fill at Session End)

### Completed in This Session
- ✅ [Completed task 1]
- ✅ [Completed task 2]
- ⚠️ [Partially completed task]
- ❌ [Not started task]

### Next Session Should Start With
1. [Most important task]
2. [Second priority]
3. [Third priority]

### Critical Information for Next Session
```markdown
IMPORTANT: [Any critical info]
WARNING: [Any warnings]
TODO: [Immediate todos]
```

---

## 📊 Session Metrics Summary (Calculate at End)

### KPI Scores
- **CER** (Context Efficiency): X%
- **TCV** (Task Velocity): X.XX
- **TES** (Token Efficiency): X.XX
- **RAI** (Resolution Accuracy): X%

### Session Statistics
- Duration: X hours Y minutes
- Productivity Score: X/10
- Token Usage Estimate: ~XXX,XXX
- Error Rate: X%

---

## 🎯 Recommendations for Next Session

### Do More Of
- [Successful pattern 1]
- [Successful pattern 2]

### Do Less Of
- [Inefficient pattern 1]
- [Inefficient pattern 2]

### Try Next Time
- [New approach 1]
- [New approach 2]

---

## 🔗 Quick Commands for Next Session

```bash
# Environment check
node .claude/verify-environment.js

# Continue work
cd [working directory]
[specific command]

# Run tests
npm test [specific test]

# Check status
cat ACTIVE_SESSION.md
```

---

## ✅ Session Closure Checklist

- [ ] All changes committed
- [ ] ACTIVE_SESSION.md updated
- [ ] Session metrics calculated
- [ ] Handoff notes complete
- [ ] Next session priorities set
- [ ] Any blockers documented
- [ ] Performance metrics updated

---

**Session End Time**: [ISO timestamp]
**Next Session Scheduled**: [When]
**Handoff Status**: [Complete/Partial]