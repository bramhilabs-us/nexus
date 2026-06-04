# 📋 MASTER LISTS SYSTEM - Documentation

**Version**: 1.0
**Created**: October 13, 2025
**Purpose**: Single source of truth for all development, improvements, and issues

---

## 🎯 OVERVIEW

The Karvia Business project uses a **3-list system** to manage all work:

1. **[MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md)** ⭐ Single source of truth for Nov 30, 2025 release
2. **[MASTER_IMPROVEMENTS_LIST.md](./MASTER_IMPROVEMENTS_LIST.md)** 📝 Post-MVP enhancements & Beta features
3. **[MASTER_ISSUES_LIST.md](./MASTER_ISSUES_LIST.md)** 🐛 Known issues, bugs, technical debt

**Key Principle**: All 3 lists stay synchronized automatically via script.

---

## 📁 THE 3 LISTS

### 1. MASTER_DEV_LIST.md (Active Development)

**Purpose**: Active development for Nov 30, 2025 hard deadline
**Contains**:
- Week 0 (Oct 13-17): Foundation tasks (models, APIs)
- Weeks 4-10 (Oct 13 - Nov 28): Customer-facing deliverables
- 40 committed tasks with IDs (DEV-001 through DEV-040)
- Status tracking (not started/in progress/completed)
- Acceptance criteria for each task

**Who Uses It**:
- Engineering Lead (daily)
- Developers (active tasks)
- Product Manager (weekly demos)
- Customer (via weekly deliverables email)

**Updates**: Daily during active development

**Example Task ID**: `DEV-001: Create Goal Model`

---

### 2. MASTER_IMPROVEMENTS_LIST.md (Future Work)

**Purpose**: Post-MVP improvements, Beta features, nice-to-haves
**Contains**:
- 67 improvement items with IDs (IMP-001 through IMP-067)
- Beta features (Q1 2026)
- Phase 2 features (Q2 2026)
- Future enhancements (Q3+ 2026)
- Review comment suggestions (React migration, shared-models refactor)

**Categories**:
- Architecture (12 items)
- Frontend (8 items)
- Features (28 items)
- UX/UI (11 items)
- DevOps (5 items)
- Documentation (3 items)

**Who Uses It**:
- Product Manager (roadmap planning)
- Engineering Lead (technical debt planning)
- Stakeholders (what's coming next)

**Updates**: Weekly (add from reviews, customer feedback, team suggestions)

**Example Task ID**: `IMP-001: Shared-Models Package Migration`

---

### 3. MASTER_ISSUES_LIST.md (Problems & Debt)

**Purpose**: Track bugs, blockers, technical debt
**Contains**:
- 23 known issues with IDs (ISS-001 through ISS-023)
- Critical blockers (P0): 5 items
- High priority (P1): 11 items
- Medium priority (P2): 7 items
- Review comment critical gaps
- Architecture misalignments

**Categories**:
- Models Missing (4 issues)
- API Incomplete (1 issue)
- Architecture (5 issues)
- Dependencies (3 issues)
- Security (2 issues)
- Documentation (2 issues)
- Scope Management (2 issues)
- Configuration (3 issues)
- Product Strategy (2 issues)

**Who Uses It**:
- QA Lead (bug tracking)
- Engineering Lead (blocker management)
- Developers (fixing issues)

**Updates**: As discovered (daily during QA, weekly during development)

**Example Task ID**: `ISS-003: Goal Model Missing`

---

## 🔗 HOW LISTS WORK TOGETHER

### Cross-References (Automated)

Lists reference each other using IDs:

**Example 1: Issue → Dev Task**
```markdown
### ISS-003: Goal Model Missing
- **Priority**: P0 (BLOCKING)
- **Resolution**: DEV-001 (Create Goal Model) - Week 0, Day 1
```

**Example 2: Dev Task → Improvement**
```markdown
#### DEV-009: Feature Flags Service
- **Links**: IMP-005 (enhancement after MVP)
```

**Example 3: Issue → Improvement (Deferred)**
```markdown
### ISS-007: Shared-Models Package Doesn't Exist
- **Resolution**: IMP-001 (Shared-Models Migration) - Deferred to Beta
```

### Sync Rules

#### When MASTER_DEV_LIST updates:
1. ✅ **Completed items** → Stay in DEV list (for historical tracking)
2. ❌ **Blocked items** → Copy to MASTER_ISSUES_LIST with blocker details
3. 🔄 **Deferred items** → Move to MASTER_IMPROVEMENTS_LIST with "Deferred from Week X" note

#### When MASTER_IMPROVEMENTS_LIST updates:
1. 🎯 **Prioritized items** → Copy to MASTER_DEV_LIST if scope allows (rare, only if critical)
2. 📊 **Linked items** → Reference DEV tasks (e.g., "Depends on DEV-006")

#### When MASTER_ISSUES_LIST updates:
1. 🚨 **Critical blockers** → Copy to MASTER_DEV_LIST immediately (unblock priority)
2. ✅ **Resolved issues** → Mark resolved, keep for reference
3. 🔗 **Related improvements** → Link to MASTER_IMPROVEMENTS_LIST

---

## 🤖 AUTOMATED SYNC

### Sync Script

**File**: `scripts/sync-master-lists.js`
**Purpose**: Automatically sync timestamps and validate cross-references

**What it does**:
1. Extracts all task IDs (DEV-xxx, IMP-xxx, ISS-xxx)
2. Validates cross-references between lists
3. Updates "Last Updated" timestamps
4. Updates "Sync Status" sections
5. Generates sync report with stats

**How to run**:
```bash
# Manual run
node scripts/sync-master-lists.js

# Or via npm
npm run sync-lists
```

**Output**:
```
🔄 Starting Master Lists Sync...
✅ Found 40 DEV tasks
✅ Found 67 IMP improvements
✅ Found 23 ISS issues

🔍 Analyzing cross-references...
✅ All references valid

📝 Updating timestamps...
💾 Writing updated files...
✅ All files updated

📊 MASTER LISTS SYNC REPORT
============================================================
Sync Time: 2025-10-13 18:28:15

📋 Task Count:
  • MASTER_DEV_LIST: 40 tasks
  • MASTER_IMPROVEMENTS_LIST: 67 improvements
  • MASTER_ISSUES_LIST: 23 issues
  • TOTAL: 130 items

🔗 Cross-References:
  • DEV → IMP: 20 links
  • DEV → ISS: 11 links
  • IMP → DEV: 144 links
  • ISS → DEV: 121 links
  • TOTAL LINKS: 296

✅ Sync Complete!
```

### Automatic Sync (Git Hook)

**Optional**: Setup git pre-commit hook to auto-sync before commits

**Setup**:
```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🔄 Syncing Master Lists..."
node scripts/sync-master-lists.js
git add Karvia_OKR_Product_Planning/MASTER_*.md
echo "✅ Lists synchronized"
EOF

chmod +x .git/hooks/pre-commit
```

Now every `git commit` automatically syncs the lists!

---

## 📝 DAILY WORKFLOW

### For Developers

**Morning (9:00 AM)**:
1. Read yesterday's [Daily Handoff](./Daily_Handoffs/)
2. Check **MASTER_DEV_LIST.md** for today's tasks
3. Note any blockers in **MASTER_ISSUES_LIST.md**

**During Development**:
1. Update task status in **MASTER_DEV_LIST.md** (in progress → completed)
2. If blocked, add issue to **MASTER_ISSUES_LIST.md**
3. If discover improvement idea, add to **MASTER_IMPROVEMENTS_LIST.md**

**End of Day (5:00 PM)**:
1. Update **MASTER_DEV_LIST.md** with progress
2. Create [Daily Handoff document](./Daily_Handoffs/)
3. Run `node scripts/sync-master-lists.js`
4. Commit changes

### For Product Manager

**Weekly (Mondays)**:
1. Review **MASTER_DEV_LIST.md** progress
2. Prioritize **MASTER_IMPROVEMENTS_LIST.md** (top 5 for Beta)
3. Triage **MASTER_ISSUES_LIST.md** (critical blockers)

**Weekly (Fridays)**:
1. Prepare demo using **MASTER_DEV_LIST.md** completed tasks
2. Update customer-facing deliverables email
3. Plan next week's priorities

### For QA Lead

**Daily**:
1. Test completed tasks from **MASTER_DEV_LIST.md**
2. Add bugs to **MASTER_ISSUES_LIST.md**
3. Update issue statuses (open → resolved)

**Weekly**:
1. Bug triage meeting
2. Prioritize critical issues (P0/P1)
3. Regression testing plan

---

## 🎨 TASK ID CONVENTIONS

### Naming Pattern
- **DEV-XXX**: Development tasks (XXX = 001 to 999)
- **IMP-XXX**: Improvement items (XXX = 001 to 999)
- **ISS-XXX**: Issues & bugs (XXX = 001 to 999)

### Priority Levels
- **P0**: BLOCKING - Stops all work, must fix immediately
- **P1**: HIGH - Important for current sprint
- **P2**: MEDIUM - Can be deferred to next sprint
- **P3**: LOW - Nice-to-have, future consideration

### Status Values
- ✅ **Done**: Completed and tested
- 🔄 **In Progress**: Currently being worked on
- ⬜ **Not Started**: Planned but not started
- ⚠️ **Blocked**: Waiting on dependency
- ❌ **Cancelled**: Decided not to do

---

## 📊 METRICS & REPORTING

### Key Metrics Tracked

**In MASTER_DEV_LIST.md**:
- Total tasks: 40
- Completed: X (Y%)
- In progress: X
- Blocked: X
- On track for Nov 30: Yes/No

**In MASTER_IMPROVEMENTS_LIST.md**:
- Total improvements: 67
- Beta items (Q1 2026): 35
- Phase 2 items (Q2 2026): 20
- Future items: 12

**In MASTER_ISSUES_LIST.md**:
- Total issues: 23
- Critical (P0): 5
- High (P1): 11
- Resolved: X

### Weekly Report Format

**Generated every Friday**:
1. Tasks completed this week: X
2. Customer deliverable: [Week X Feature Name]
3. Blockers resolved: X
4. New issues discovered: X
5. Next week priorities: Top 3 tasks

---

## 🚀 QUICK REFERENCE

### Most Common Commands

```bash
# Sync lists manually
node scripts/sync-master-lists.js

# Search for a task ID
grep -r "DEV-001" Karvia_OKR_Product_Planning/MASTER_*.md

# Count completed tasks
grep -c "✅ Done" Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md

# Find all blockers
grep -A5 "BLOCKING" Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md

# View latest sync status
head -20 Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md | grep "Sync Status"
```

### Quick Links

- [Master Dev List](./MASTER_DEV_LIST.md) - Active development
- [Master Improvements List](./MASTER_IMPROVEMENTS_LIST.md) - Future work
- [Master Issues List](./MASTER_ISSUES_LIST.md) - Known issues
- [Implementation Status Report](./IMPLEMENTATION_STATUS_REPORT.md) - Current state
- [Customer Email](./CUSTOMER_EMAIL_SIMPLE.md) - Weekly deliverables
- [Daily Handoffs](./Daily_Handoffs/) - Daily progress docs

---

## ❓ FAQ

**Q: Which list do I update most often?**
A: **MASTER_DEV_LIST.md** - daily during active development.

**Q: Can I add tasks to MASTER_DEV_LIST.md mid-sprint?**
A: Only if critical blocker. Otherwise, add to MASTER_IMPROVEMENTS_LIST.md for next sprint.

**Q: What if I find a bug while developing?**
A: Add immediately to MASTER_ISSUES_LIST.md with ISS-XXX ID.

**Q: How do I know if a task is in the right list?**
A: Ask: "Is this for Nov 30 release?" → DEV list. "Is this broken?" → ISS list. "Is this future?" → IMP list.

**Q: Do I need to manually sync lists?**
A: If using git hook, no. Otherwise, run `node scripts/sync-master-lists.js` at end of day.

**Q: What if two people update lists simultaneously?**
A: Git will handle conflicts. Re-run sync script after resolving conflicts.

**Q: Can I change task IDs?**
A: No. IDs are permanent. If task cancelled, mark status but keep ID for tracking.

---

## 📞 SUPPORT

**Questions about the system**:
- Engineering Lead: [Name]
- Product Manager: [Name]

**Technical issues with sync script**:
- Check scripts/sync-master-lists.js
- Run with `node scripts/sync-master-lists.js` to see errors
- Check node.js version (needs 18+)

---

**Created**: October 13, 2025
**Last Updated**: 2025-10-13 18:30:00
**Version**: 1.0
