# 🔄 KARVIA DOCUMENTATION VERSION CONTROL GUIDE

**Version**: 1.0.0
**Created**: 2025-10-24
**Purpose**: Comprehensive guide for versioning, archiving, and maintaining documentation history

---

## 🎯 PURPOSE

Establish clear version control practices for KARVIA documentation to:
- Track changes over time
- Preserve historical context
- Enable rollback if needed
- Maintain audit trail
- Support parallel development

---

## 📋 TABLE OF CONTENTS

1. [Semantic Versioning](#semantic-versioning)
2. [Version Control Workflow](#version-control-workflow)
3. [Archiving Process](#archiving-process)
4. [Branch Strategy for Docs](#branch-strategy-for-docs)
5. [Change Documentation](#change-documentation)
6. [Recovery Procedures](#recovery-procedures)

---

## 🔢 SEMANTIC VERSIONING

### Version Format: X.Y.Z

```
X.Y.Z
│ │ └─── PATCH: Bug fixes, typos, minor clarifications
│ └───── MINOR: New features, sections, backwards-compatible changes
└─────── MAJOR: Breaking changes, restructures, incompatible updates
```

### When to Increment Versions

| Change Type | Version Change | Example | When to Use |
|-------------|---------------|---------|-------------|
| **Fix typo** | +0.0.1 | 1.0.0 → 1.0.1 | Spelling, grammar, formatting |
| **Clarify text** | +0.0.1 | 1.0.1 → 1.0.2 | Reword for clarity, no new info |
| **Update data** | +0.0.1 | 1.0.2 → 1.0.3 | Update numbers, dates, names |
| **Add example** | +0.1.0 | 1.0.3 → 1.1.0 | New examples, diagrams |
| **Add section** | +0.1.0 | 1.1.0 → 1.2.0 | New content section |
| **Add feature** | +0.1.0 | 1.2.0 → 1.3.0 | Document new functionality |
| **Restructure** | +1.0.0 | 1.3.0 → 2.0.0 | Reorganize document |
| **Change format** | +1.0.0 | 2.0.0 → 3.0.0 | Switch from MD to YAML, etc |
| **Breaking change** | +1.0.0 | 3.0.0 → 4.0.0 | Remove/change existing features |

### Version Numbering Rules

1. **Start at 1.0.0** for production-ready documents
2. **Use 0.x.y** for draft documents
3. **Never decrease** version numbers
4. **Reset minor/patch** when major increments
5. **Document reason** for major version changes

### Special Version Tags

```markdown
**Version**: 1.0.0-draft     # Work in progress
**Version**: 1.0.0-rc1        # Release candidate
**Version**: 1.0.0            # Stable release
**Version**: 1.0.0-deprecated # Marked for removal
```

---

## 🔄 VERSION CONTROL WORKFLOW

### Step 1: Before Making Changes

```bash
# 1. Check current version
grep "Version:" document.md

# 2. Create backup if major change
cp document.md ARCHIVE/document_V1_BACKUP.md

# 3. Create working copy
cp document.md document_WIP.md
```

### Step 2: During Changes

```markdown
# In document header:
**Version**: 1.1.0  # Increment from 1.0.0
**Last Updated**: 2025-10-24  # Update date
**Previous Version**: [1.0.0](./ARCHIVE/document_V1.0.0.md)  # Link to old

# In change log section:
| 1.1.0 | 2025-10-24 | Your Name | Added section on security |
```

### Step 3: After Changes

```bash
# 1. Review changes
diff document.md document_WIP.md

# 2. Replace original
mv document_WIP.md document.md

# 3. Commit with clear message
git add .
git commit -m "docs: Update document.md to v1.1.0 - Add security section"

# 4. Tag if major version
git tag -a "docs-v2.0.0" -m "Major restructure of documentation"
```

### Version Control Decision Tree

```
Is this a typo or formatting fix?
├─ YES → Increment PATCH (0.0.1)
└─ NO → Continue

Does it add new content?
├─ YES → Does it change existing behavior?
│        ├─ YES → Increment MAJOR (1.0.0)
│        └─ NO → Increment MINOR (0.1.0)
└─ NO → Continue

Does it remove or restructure content?
├─ YES → Increment MAJOR (1.0.0)
└─ NO → Increment PATCH (0.0.1)
```

---

## 📦 ARCHIVING PROCESS

### When to Archive

1. **Major version change** (1.x → 2.x)
2. **Document deprecation**
3. **Significant restructure**
4. **Before risky changes**
5. **End of quarter** (scheduled archive)

### Archive Naming Convention

```
Original: MVP_STRATEGY.md
Archive:  ARCHIVE/MVP_STRATEGY_V4_BACKUP.md
         ARCHIVE/MVP_STRATEGY_V4.2.1_2025-10-24.md
         ARCHIVE/MVP_STRATEGY_DEPRECATED.md
```

### Archive Folder Structure

```
ARCHIVE/
├── README.md                    # Index of archived files
├── 2025-Q4/                    # Quarterly archives
│   ├── MVP_STRATEGY_V4.md
│   └── API_SPEC_V2.md
├── deprecated/                  # Deprecated documents
│   └── OLD_ARCHITECTURE.md
└── major_versions/             # Major version backups
    ├── MVP_STRATEGY_V1.md
    ├── MVP_STRATEGY_V2.md
    └── MVP_STRATEGY_V3.md
```

### Archive Process Steps

```bash
# 1. Create archive directory if needed
mkdir -p ARCHIVE/2025-Q4

# 2. Copy with version and date
cp MVP_STRATEGY.md ARCHIVE/2025-Q4/MVP_STRATEGY_V4_2025-10-24.md

# 3. Update ARCHIVE/README.md
echo "- MVP_STRATEGY_V4_2025-10-24.md - Archived before v5 rewrite" >> ARCHIVE/README.md

# 4. Add deprecation notice to old file
echo "**DEPRECATED**: See [MVP_STRATEGY_V5.md](../MVP_STRATEGY.md)" >> ARCHIVE/MVP_STRATEGY_V4.md

# 5. Commit archive
git add ARCHIVE/
git commit -m "Archive MVP_STRATEGY v4 before major update"
```

---

## 🌳 BRANCH STRATEGY FOR DOCS

### Documentation Branches

```
main
├── docs/update-architecture    # Major documentation updates
├── docs/fix-typos             # Minor fixes
└── docs/add-api-spec          # New documentation
```

### Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| **New Docs** | `docs/add-{topic}` | `docs/add-security-guide` |
| **Updates** | `docs/update-{topic}` | `docs/update-api-spec` |
| **Fixes** | `docs/fix-{issue}` | `docs/fix-broken-links` |
| **Major** | `docs/v{X}-{description}` | `docs/v2-restructure` |

### Branch Workflow

```bash
# 1. Create branch for documentation work
git checkout -b docs/update-architecture

# 2. Make changes
vim MVP_TECHNICAL_ARCHITECTURE.md

# 3. Commit with conventional commits
git add .
git commit -m "docs: Update architecture to v5 with microservices"

# 4. Push branch
git push origin docs/update-architecture

# 5. Create PR with description
# Title: docs: Update Technical Architecture to v5
# Body:
# - Added microservices design
# - Updated API gateway pattern
# - Included new scaling approach
```

---

## 📝 CHANGE DOCUMENTATION

### Change Log Format

Every document should maintain a change log:

```markdown
## 📝 CHANGE LOG

| Version | Date | Author | Changes | Review |
|---------|------|--------|---------|--------|
| 1.0.0 | 2025-10-20 | John Doe | Initial version | Jane Smith |
| 1.0.1 | 2025-10-21 | Jane Smith | Fixed typos in section 3 | Self |
| 1.1.0 | 2025-10-22 | John Doe | Added security considerations | CTO |
| 2.0.0 | 2025-10-24 | Team | Complete restructure for v2 | Board |
```

### Commit Message Format

Use conventional commits for documentation:

```bash
docs: Add security guidelines to API documentation
docs: Fix broken links in architecture document
docs: Update version to 2.0.0 after restructure
chore: Archive old documentation versions
fix: Correct database schema in technical spec
```

### Pull Request Template for Docs

```markdown
## Documentation Update

**Document(s) Updated**:
- MVP_STRATEGY.md (v4.0.0 → v5.0.0)
- API_SPECIFICATION.md (v1.2.0 → v1.3.0)

**Type of Change**:
- [ ] Fix (typos, broken links)
- [ ] Update (new information, clarification)
- [ ] Addition (new section/document)
- [x] Major revision (restructure, breaking change)

**Summary of Changes**:
- Restructured MVP strategy for better clarity
- Added new API endpoints for v2 features
- Updated timeline to reflect current progress

**Checklist**:
- [x] Version numbers updated
- [x] Change log entry added
- [x] Old version archived
- [x] Links verified
- [x] Related docs updated

**Review Required By**: Product Manager, Tech Lead
```

---

## 🔧 RECOVERY PROCEDURES

### Recovering Old Versions

```bash
# 1. Find archived version
ls ARCHIVE/ | grep MVP_STRATEGY

# 2. Review old version
cat ARCHIVE/MVP_STRATEGY_V4.md

# 3. Restore if needed
cp ARCHIVE/MVP_STRATEGY_V4.md ./MVP_STRATEGY.md

# 4. Update version header
# Change version to indicate restoration
vim MVP_STRATEGY.md
# Version: 5.0.1-restored-from-v4
```

### Git History Recovery

```bash
# 1. Find commits affecting document
git log --oneline -- MVP_STRATEGY.md

# 2. View old version
git show <commit-hash>:MVP_STRATEGY.md

# 3. Restore specific version
git checkout <commit-hash> -- MVP_STRATEGY.md

# 4. Review and commit
git diff HEAD MVP_STRATEGY.md
git add MVP_STRATEGY.md
git commit -m "docs: Restore MVP_STRATEGY.md from commit <hash>"
```

### Emergency Rollback

```bash
# If latest changes broke documentation:

# 1. Immediate rollback to last known good
git revert HEAD

# 2. Or restore from archive
cp ARCHIVE/last_known_good.md ./current.md

# 3. Notify team
echo "ALERT: Documentation rolled back due to issues" | notify-team

# 4. Create incident report
vim ARCHIVE/incidents/2025-10-24_rollback.md
```

---

## 📊 VERSION TRACKING MATRIX

### Master Version Tracking

Maintain a central version registry:

```markdown
# DOCUMENT_VERSIONS.md

| Document | Current Version | Last Updated | Next Review | Owner |
|----------|----------------|--------------|-------------|--------|
| MVP_STRATEGY.md | 5.0.0 | 2025-10-24 | 2025-11-24 | Product |
| API_SPECIFICATION.md | 2.1.0 | 2025-10-23 | 2025-11-23 | Backend |
| DATABASE_SCHEMA.md | 1.0.0 | 2025-10-24 | 2025-11-24 | Backend |
| SECURITY_DESIGN.md | - | - | URGENT | Security |
```

---

## ⚠️ CRITICAL VERSION CONTROL RULES

### NEVER Do These:

1. **Delete old versions** without archiving
2. **Overwrite** without incrementing version
3. **Skip version numbers** (go from 1.0 to 1.2)
4. **Decrease** version numbers
5. **Change** published version history
6. **Mix** code and doc version numbers

### ALWAYS Do These:

1. **Archive** before major changes
2. **Document** what changed and why
3. **Test** links after moving files
4. **Review** major version changes
5. **Tag** important versions in git
6. **Backup** critical documentation

---

## 🎯 QUICK REFERENCE

### Version Increment Cheat Sheet

```
Typo fix           → +0.0.1 (PATCH)
Add example        → +0.1.0 (MINOR)
Add section        → +0.1.0 (MINOR)
Restructure        → +1.0.0 (MAJOR)
Remove feature     → +1.0.0 (MAJOR)
```

### Archive Command Reference

```bash
# Quick archive
./scripts/archive-doc.sh MVP_STRATEGY.md

# Manual archive
cp DOC.md ARCHIVE/DOC_V{X}_{DATE}.md

# Bulk archive
find . -name "*.md" -mtime +90 -exec mv {} ARCHIVE/ \;
```

### Recovery Command Reference

```bash
# From archive
cp ARCHIVE/DOC_V4.md ./DOC.md

# From git
git checkout <hash> -- DOC.md

# List versions
git log --oneline -- DOC.md
```

---

## 📞 SUPPORT

**Version Control Questions:**
- Check this guide first
- Ask in #documentation channel
- Contact: Documentation Team Lead

**Emergency Recovery:**
- Contact: DevOps Team
- Backup location: `/backups/docs/`
- Recovery SLA: 1 hour

---

**Last Updated**: 2025-10-24
**Version**: 1.0.0
**Status**: Active Standard
**Maintained By**: KARVIA Documentation Team