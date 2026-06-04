# 📝 DOCUMENTATION GUIDELINES - Where to Put New Files

**Version**: 1.0.0
**Created**: 2025-10-22
**Purpose**: Clear rules for Claude on where to create/save any new document

---

## 🎯 CORE PRINCIPLE

**Every document must be linked from at least one entry point document:**
1. [CLAUDE_ONBOARDING_GUIDE.md](./CLAUDE_ONBOARDING_GUIDE.md)
2. [MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md)
3. [README.md](./README.md)
4. [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

**Rule**: If you create a file, immediately add a link to it in the appropriate parent document.

---

## 📁 DOCUMENT PLACEMENT RULES

### 🔴 **WEEKLY IMPLEMENTATION DOCUMENTS**

#### When: During weekly implementation (Monday-Friday)

**Location**: `/Daily_Handoffs/Week_X/`

| Document Type | Filename Pattern | Created When | Link From |
|--------------|------------------|--------------|-----------|
| **Weekly Plan** | `WEEK_X_PLAN.md` | Friday before week starts | MASTER_DEV_LIST (Week X section) |
| **Code References** | `WEEK_X_CODE_REFERENCES.md` | Friday end of week | MASTER_DEV_LIST (Week X section) |
| **Handoff Summary** | `WEEK_X_HANDOFF_SUMMARY.md` | Friday end of week | MASTER_DEV_LIST (Week X section) |
| **Daily Handoff** | `DAY_X_HANDOFF.md` | End of each day (optional) | WEEK_X_HANDOFF_SUMMARY |
| **Issue Tracker** | `WEEK_X_ISSUES.md` | As issues found | WEEK_X_HANDOFF_SUMMARY |
| **Weekly README** | `README.md` | If week has 5+ docs | MASTER_DEV_LIST (Week X section) |

**Example**:
```
Daily_Handoffs/Week_5/
├── WEEK_5_PLAN.md              ← Link from MASTER_DEV_LIST line 229
├── WEEK_5_CODE_REFERENCES.md   ← Create Friday, link from MASTER_DEV_LIST
├── WEEK_5_HANDOFF_SUMMARY.md   ← Create Friday, link from MASTER_DEV_LIST
├── WEEK_5_ISSUES.md            ← If issues found, link from summary
└── README.md                   ← If 5+ files, index them here
```

**Immediate Action After Creating**:
```markdown
// In MASTER_DEV_LIST.md, Week 5 section:
**Detailed Plan**: [Daily_Handoffs/Week_5/WEEK_5_PLAN.md](./Daily_Handoffs/Week_5/WEEK_5_PLAN.md)
**Code References**: [Daily_Handoffs/Week_5/WEEK_5_CODE_REFERENCES.md](./Daily_Handoffs/Week_5/WEEK_5_CODE_REFERENCES.md)
**Handoff Summary**: [Daily_Handoffs/Week_5/WEEK_5_HANDOFF_SUMMARY.md](./Daily_Handoffs/Week_5/WEEK_5_HANDOFF_SUMMARY.md)
```

---

### 🔵 **TESTING & QA DOCUMENTS**

#### When: Creating test plans, test reports, QA docs

**Location**: `/QA/Week_X/`

| Document Type | Filename Pattern | Created When | Link From |
|--------------|------------------|--------------|-----------|
| **Test Plan** | `test-plan.md` | Before testing phase | MASTER_DEV_LIST (Week X section) |
| **Test Report** | `test-report.md` | After testing complete | WEEK_X_HANDOFF_SUMMARY |
| **Bug Report** | `bug-report.md` | When bugs found | MASTER_ISSUES_LIST |
| **Integration Tests** | `integration-test-results.md` | After Week 5 Day 5, Week 10 | WEEK_X_HANDOFF_SUMMARY |

**Example**:
```
QA/Week_5/
├── test-plan.md           ← Link from MASTER_DEV_LIST Week 5
└── test-report.md         ← Link from WEEK_5_HANDOFF_SUMMARY
```

**Immediate Action After Creating**:
```markdown
// In MASTER_DEV_LIST.md, Week 5 section:
**Testing**: [QA/Week_5/test-plan.md](./QA/Week_5/test-plan.md)

// In WEEK_5_HANDOFF_SUMMARY.md:
**Test Results**: [QA/Week_5/test-report.md](./QA/Week_5/test-report.md)
```

---

### 🟢 **AUDIT & REVIEW DOCUMENTS**

#### When: Conducting audits, reviews, assessments

**Location**: `/Karvia_OKR_Product_Planning/` (root)

| Document Type | Filename Pattern | Created When | Link From |
|--------------|------------------|--------------|-----------|
| **Audit Report** | `*_AUDIT_REPORT.md` | After audit complete | CLAUDE_ONBOARDING_GUIDE → Related Documentation |
| **Review Document** | `*_REVIEW.md` | After review session | COMPLETE_RESTRUCTURE_SUMMARY or Weekly Summary |
| **Verification** | `*_VERIFICATION.md` | After verification | Related parent document |

**Example**:
```
/Karvia_OKR_Product_Planning/
├── DOCUMENTATION_AUDIT_REPORT.md   ← Link from CLAUDE_ONBOARDING_GUIDE
├── ORPHANED_FILES_REPORT.md        ← Link from CLAUDE_ONBOARDING_GUIDE
└── CODE_QUALITY_AUDIT.md           ← Link from CLAUDE_ONBOARDING_GUIDE
```

**Immediate Action After Creating**:
```markdown
// In CLAUDE_ONBOARDING_GUIDE.md, Related Documentation section:
- [DOCUMENTATION_AUDIT_REPORT.md](./DOCUMENTATION_AUDIT_REPORT.md) - Complete link audit
- [YOUR_NEW_AUDIT.md](./YOUR_NEW_AUDIT.md) - Description here
```

---

### 🟡 **USER STORIES & REQUIREMENTS**

#### When: Writing user stories, requirements, specifications

**Location**: `/01_MVP/` or `/02_Beta/`

| Document Type | Filename Pattern | Created When | Link From |
|--------------|------------------|--------------|-----------|
| **User Stories** | `MVP_USER_STORIES.md` | ✅ Already exists | README, MASTER_DEV_LIST |
| **Requirements** | `*_REQUIREMENTS.md` | New feature set | 01_MVP/README.md |
| **Specifications** | `*_SPEC.md` | Detailed feature spec | 01_MVP/README.md |
| **API Docs** | `*_API_SPEC.md` | New API design | 01_MVP/README.md |

**Example**:
```
01_MVP/
├── MVP_USER_STORIES.md         ← ✅ Linked from README
├── NOTIFICATIONS_SPEC.md       ← New feature, link from 01_MVP/README.md
└── ANALYTICS_API_SPEC.md       ← New API, link from 01_MVP/README.md
```

**Immediate Action After Creating**:
```markdown
// In 01_MVP/README.md:
### Feature Specifications
- [MVP_USER_STORIES.md](./MVP_USER_STORIES.md) - All user stories
- [NOTIFICATIONS_SPEC.md](./NOTIFICATIONS_SPEC.md) - Notification system spec
```

---

### 🟣 **TECHNICAL GUIDES & WORKFLOWS**

#### When: Creating technical guides, workflow docs, setup instructions

**Location**: `/Karvia_OKR_Product_Planning/` (root)

| Document Type | Filename Pattern | Created When | Link From |
|--------------|------------------|--------------|-----------|
| **Testing Guide** | `*_TESTING_GUIDE.md` | Setup testing workflow | CLAUDE_ONBOARDING_GUIDE |
| **Branch Guide** | `*_BRANCH_GUIDE.md` | Git workflow rules | CLAUDE_ONBOARDING_GUIDE → Critical Rules |
| **Deployment Guide** | `*_DEPLOYMENT_GUIDE.md` | Deployment process | README → Quick Start |
| **Integration Guide** | `*_INTEGRATION_GUIDE.md` | Integration steps | CLAUDE_ONBOARDING_GUIDE |

**Example**:
```
/Karvia_OKR_Product_Planning/
├── INTEGRATION_TESTING_GUIDE.md   ← ✅ Linked from ONBOARDING
├── PRODUCTION_BRANCH_GUIDE.md     ← ✅ Linked from ONBOARDING
└── DATABASE_MIGRATION_GUIDE.md    ← Link from ONBOARDING or README
```

**Immediate Action After Creating**:
```markdown
// In CLAUDE_ONBOARDING_GUIDE.md:
## 🧪 TESTING WORKFLOW
- [INTEGRATION_TESTING_GUIDE.md](./INTEGRATION_TESTING_GUIDE.md) - E2E testing
- [YOUR_NEW_GUIDE.md](./YOUR_NEW_GUIDE.md) - Description
```

---

### 🟠 **ARCHITECTURE & DESIGN DOCUMENTS**

#### When: Creating architecture docs, design decisions, technical RFCs

**Location**: `/03_Product_Foundation/` or `/Review_Docs/`

| Document Type | Filename Pattern | Created When | Link From |
|--------------|------------------|--------------|-----------|
| **Architecture** | `architecture_*.md` | System design | 03_Product_Foundation/README or Review_Docs/ |
| **Design Decision** | `design_decision_*.md` | Major design choice | Review_Docs/ |
| **RFC** | `rfc_*.md` | Technical proposal | Review_Docs/ |

**Example**:
```
03_Product_Foundation/
├── product_overview.md           ← ✅ Linked from README
├── architecture_microservices.md ← New doc, link from README
```

**Immediate Action After Creating**:
```markdown
// In README.md, section 03_Product_Foundation:
- [architecture_microservices.md](./03_Product_Foundation/architecture_microservices.md) - Microservices architecture
```

---

## 🚨 **CRITICAL RULES - MUST FOLLOW**

### Rule 1: **Link Immediately After Creating**
```
❌ WRONG:
1. Create new file WEEK_6_PLAN.md
2. Write content
3. Save file
4. (Forget to link it)

✅ CORRECT:
1. Create new file WEEK_6_PLAN.md
2. Write content
3. Save file
4. IMMEDIATELY edit MASTER_DEV_LIST.md
5. Add link: [WEEK_6_PLAN.md](./Daily_Handoffs/Week_6/WEEK_6_PLAN.md)
```

---

### Rule 2: **Use Templates When Available**
```
Before creating new doc:
1. Check: Daily_Handoffs/Templates/
2. If template exists → Copy and modify
3. If no template → Create from scratch, then create template for future use
```

**Available Templates**:
- [Daily_Handoffs/Templates/DAILY_HANDOFF_TEMPLATE.md](./Daily_Handoffs/Templates/DAILY_HANDOFF_TEMPLATE.md)
- [Daily_Handoffs/WEEK_X_HANDOFF_TEMPLATE.md](./Daily_Handoffs/WEEK_X_HANDOFF_TEMPLATE.md)

---

### Rule 3: **Naming Conventions**

| Document Type | Naming Pattern | Example |
|--------------|----------------|---------|
| Weekly Plans | `WEEK_X_PLAN.md` | `WEEK_5_PLAN.md` |
| Code References | `WEEK_X_CODE_REFERENCES.md` | `WEEK_5_CODE_REFERENCES.md` |
| Audit Reports | `*_AUDIT_REPORT.md` | `SECURITY_AUDIT_REPORT.md` |
| Test Plans | `test-plan.md` (in QA/Week_X/) | `QA/Week_5/test-plan.md` |
| Technical Guides | `*_GUIDE.md` | `DEPLOYMENT_GUIDE.md` |
| Backups | `*_v{version}_BACKUP.md` | `MASTER_DEV_LIST_v3.0.0_BACKUP.md` |

---

### Rule 4: **Versioning Master Documents**

When updating core docs (MASTER_DEV_LIST, MASTER_ISSUES_LIST, etc.):
```
1. Backup old version:
   cp MASTER_DEV_LIST.md MASTER_DEV_LIST_v4.0.0_BACKUP.md

2. Update version in header:
   **Version**: 5.0.0 (increment major for big changes)

3. Add changelog entry:
   ### v5.0.0 (2025-10-23)
   - Added Week 6-8 detailed plans
```

---

### Rule 5: **Archive Old Files**

When files become obsolete:
```
1. Don't delete → Move to Archive/
   mv old_document.md Archive/old_document.md

2. Add to Archive/README.md:
   - old_document.md - Replaced by new_document.md (2025-10-22)

3. Remove link from active navigation documents
```

---

## 📋 **DECISION TREE: "WHERE SHOULD I PUT THIS FILE?"**

### Step 1: What type of document is this?

```
Is it about a specific week's implementation?
  ├─ YES → Go to: Daily_Handoffs/Week_X/
  │         Link from: MASTER_DEV_LIST (Week X section)
  └─ NO  → Continue to Step 2

Is it a test plan or QA document?
  ├─ YES → Go to: QA/Week_X/ or QA/
  │         Link from: MASTER_DEV_LIST or WEEK_X_HANDOFF
  └─ NO  → Continue to Step 3

Is it user stories, requirements, or feature specs?
  ├─ YES → Go to: 01_MVP/ or 02_Beta/
  │         Link from: README or 01_MVP/README.md
  └─ NO  → Continue to Step 4

Is it a technical guide or workflow?
  ├─ YES → Go to: /Karvia_OKR_Product_Planning/ (root)
  │         Link from: CLAUDE_ONBOARDING_GUIDE or README
  └─ NO  → Continue to Step 5

Is it an audit, review, or verification report?
  ├─ YES → Go to: /Karvia_OKR_Product_Planning/ (root)
  │         Link from: CLAUDE_ONBOARDING_GUIDE (Related Docs)
  └─ NO  → Continue to Step 6

Is it architecture or design documentation?
  ├─ YES → Go to: 03_Product_Foundation/ or Review_Docs/
  │         Link from: README or 03_Product_Foundation/README
  └─ NO  → Continue to Step 7

Is it a backup or obsolete file?
  ├─ YES → Go to: Archive/ (with _BACKUP suffix or date)
  │         DON'T link (intentionally orphaned)
  └─ NO  → Ask user where to put it
```

---

## 🎯 **QUICK REFERENCE CHEAT SHEET**

| I'm Creating... | Put It Here | Link From |
|----------------|-------------|-----------|
| Weekly implementation plan | `Daily_Handoffs/Week_X/WEEK_X_PLAN.md` | MASTER_DEV_LIST |
| Code reference for week | `Daily_Handoffs/Week_X/WEEK_X_CODE_REFERENCES.md` | MASTER_DEV_LIST |
| Test plan | `QA/Week_X/test-plan.md` | MASTER_DEV_LIST |
| Audit report | `*_AUDIT_REPORT.md` (root) | CLAUDE_ONBOARDING_GUIDE |
| User stories | `01_MVP/*_USER_STORIES.md` | README, 01_MVP/README |
| Technical guide | `*_GUIDE.md` (root) | CLAUDE_ONBOARDING_GUIDE |
| API specification | `Daily_Handoffs/Week_X/*_API_SPEC.md` | WEEK_X_PLAN |
| Bug report | Add to `MASTER_ISSUES_LIST.md` | Always linked |
| Feature request | Add to `MASTER_IMPROVEMENTS_LIST.md` | Always linked |

---

## ✅ **VALIDATION CHECKLIST**

After creating any new document, verify:

```
[ ] File has clear filename following naming convention
[ ] File has version and date in header
[ ] File is in correct folder per guidelines above
[ ] File is linked from at least ONE entry point document
[ ] Link is verified to work (relative path correct)
[ ] Parent document updated with link description
[ ] If weekly doc: MASTER_DEV_LIST updated
[ ] If audit/guide: CLAUDE_ONBOARDING_GUIDE updated
[ ] If user-facing: README updated
```

---

## 🔗 **ENTRY POINT DOCUMENTS (START HERE)**

New Claude session? Update these 4 files when adding new docs:

1. **[CLAUDE_ONBOARDING_GUIDE.md](./CLAUDE_ONBOARDING_GUIDE.md)** - For guides, audits, workflows
2. **[MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md)** - For weekly plans, implementations
3. **[README.md](./README.md)** - For user stories, architecture, high-level docs
4. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - For folder structure changes

---

## 📞 **WHEN IN DOUBT**

If unclear where a document should go:
1. Ask user: "I'm creating [doc type]. Should this go in [suggested location]?"
2. Reference this guide's decision tree
3. Check similar existing documents
4. Default to root (`/Karvia_OKR_Product_Planning/`) + link from CLAUDE_ONBOARDING_GUIDE

---

**Last Updated**: 2025-10-22
**Version**: 1.0.0
**Status**: ✅ Active Documentation Standard
