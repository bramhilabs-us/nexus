# 📝 KARVIA STRATEGY DOCUMENTATION EDITING RULES

**Version**: 1.0.0
**Created**: 2025-10-24
**Purpose**: Clear rules for creating, updating, and maintaining documentation in KARVIA_STRATEGY folder

---

## 🎯 CORE PRINCIPLES

1. **Single Source of Truth**: Each piece of information should exist in ONE place only
2. **Always Link**: Every document must be linked from at least one parent document
3. **Version Everything**: Use semantic versioning for all documents
4. **Track Changes**: Document what changed and why
5. **Maintain Consistency**: Follow the same format across all documents

---

## 📁 WHERE TO PUT DOCUMENTS

### Decision Tree for Document Placement

```
What type of document are you creating?

Business/Strategy Document?
  └─ YES → 0-BUSINESS/
     ├─ Vision/Mission → 0-VISION-POSITIONING/
     ├─ Market Analysis → 1-MARKET-INTEL/
     ├─ GTM Strategy → 2-GO-TO-MARKET/
     ├─ Presentations → 3-PITCH-DECKS/
     └─ Operations → 4-OPERATIONS/

Product/Design Document?
  └─ YES → 1-PRODUCT/
     ├─ Strategy → 0-STRATEGY/
     ├─ Roadmaps → 1-ROADMAPS/
     ├─ Research → 2-DISCOVERY/
     ├─ Specifications → 3-SPECS/
     └─ UX/Content → 4-UX-AND-CONTENT/

Technical Document?
  └─ YES → 2-TECHNICAL/
     ├─ Architecture → 0-SYSTEM-ARCHITECTURE/
     ├─ Service Design → 1-SERVICE-DESIGNS/
     ├─ API Specs → 2-APIS/
     ├─ Data Models → 3-DATA/
     └─ Security → 5-NON-FUNCTIONAL/

Delivery/Operations Document?
  └─ YES → 3-DELIVERY/
     ├─ Project Mgmt → 0-PROJECT-MGMT/
     ├─ Sprint Plans → 1-SPRINTS/
     ├─ Testing → 2-QA-AND-TESTING/
     └─ Deployment → 3-RELEASE-ENGINEERING/

Old/Deprecated Document?
  └─ YES → ARCHIVE/
```

---

## �� DOCUMENT NAMING CONVENTIONS

### Standard Naming Patterns

| Document Type | Pattern | Example |
|--------------|---------|---------|
| **Strategy Docs** | `{TOPIC}_STRATEGY_V{X}.md` | `MVP_STRATEGY_V5.md` |
| **Technical Specs** | `{component}_architecture.md` | `backend_architecture.md` |
| **User Journeys** | `{ROLE}_JOURNEY.md` | `EMPLOYEE_JOURNEY.md` |
| **API Specs** | `openapi.yaml` or `{service}_api.md` | `assessment_api.md` |
| **Data Models** | `{model}_schema.md` | `database_schema.md` |
| **Guides** | `{TOPIC}_GUIDE.md` | `DEPLOYMENT_GUIDE.md` |
| **Test Plans** | `{feature}_test_plan.md` | `assessment_test_plan.md` |
| **Meeting Notes** | `YYYY-MM-DD_{topic}.md` | `2025-10-24_architecture_review.md` |

### Version Naming
- **Current Version**: `DOCUMENT_NAME.md`
- **Archived Version**: `DOCUMENT_NAME_V{X.Y}_BACKUP.md`
- **Draft Version**: `DOCUMENT_NAME_DRAFT.md`

---

## 📋 DOCUMENT STRUCTURE TEMPLATE

Every document should follow this structure:

```markdown
# 📊 [DOCUMENT TITLE]

**Version**: X.Y.Z
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Author**: [Name/Team]
**Status**: Draft | In Review | Approved | Deprecated

---

## 🎯 PURPOSE

[One paragraph explaining what this document is for]

---

## 📋 TABLE OF CONTENTS

1. [Section 1](#section-1)
2. [Section 2](#section-2)
3. [Section 3](#section-3)

---

## [MAIN CONTENT]

---

## 📝 CHANGE LOG

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | YYYY-MM-DD | [Name] | Initial version |
| 1.1.0 | YYYY-MM-DD | [Name] | Added section X |

---

## 🔗 RELATED DOCUMENTS

- [Related Doc 1](./path/to/doc1.md) - Description
- [Related Doc 2](./path/to/doc2.md) - Description
```

---

## 🔄 VERSION CONTROL RULES

### Semantic Versioning (X.Y.Z)

- **X (Major)**: Breaking changes, complete rewrites, structural changes
- **Y (Minor)**: New sections, significant updates, feature additions
- **Z (Patch)**: Typos, formatting, small clarifications

### When to Version

| Action | Version Change | Example |
|--------|---------------|---------|
| Fix typo | Patch (+0.0.1) | 1.0.0 → 1.0.1 |
| Add new section | Minor (+0.1.0) | 1.0.1 → 1.1.0 |
| Restructure document | Major (+1.0.0) | 1.1.0 → 2.0.0 |
| Update data/numbers | Patch (+0.0.1) | 2.0.0 → 2.0.1 |
| Change core concept | Major (+1.0.0) | 2.0.1 → 3.0.0 |

### Backup Process

Before making major changes:

```bash
# 1. Create backup
cp MVP_STRATEGY.md ARCHIVE/MVP_STRATEGY_V4_BACKUP.md

# 2. Update version in new file
# Change "Version: 4.0.0" to "Version: 5.0.0"

# 3. Add to changelog
# Add entry explaining what changed
```

---

## ✅ QUALITY CHECKLIST

Before committing any document:

### Content Quality
- [ ] **Accurate**: Information is correct and up-to-date
- [ ] **Complete**: All necessary information is included
- [ ] **Clear**: Written in plain language, avoiding jargon
- [ ] **Concise**: No unnecessary repetition
- [ ] **Actionable**: Provides clear next steps where applicable

### Format Quality
- [ ] **Header**: Has version, date, author, status
- [ ] **Purpose**: Clearly states document purpose
- [ ] **Structure**: Uses consistent heading hierarchy
- [ ] **Links**: All internal links work
- [ ] **Tables**: Properly formatted with headers
- [ ] **Code Blocks**: Use appropriate language tags

### Integration Quality
- [ ] **Linked**: Document is linked from parent document
- [ ] **Cross-Referenced**: Related docs are linked
- [ ] **Indexed**: Added to MASTER_STRATEGY_DEV_TODO.md if new
- [ ] **Discoverable**: Can be found through navigation

---

## 🚨 CRITICAL RULES - MUST FOLLOW

### Rule 1: Never Orphan Documents
```
❌ WRONG:
Create new_feature_spec.md in 1-PRODUCT/3-SPECS/
Don't link it anywhere

✅ CORRECT:
Create new_feature_spec.md
Immediately add link to MASTER_STRATEGY_DEV_TODO.md
Add link to parent folder's README if exists
```

### Rule 2: Never Duplicate Information
```
❌ WRONG:
Copy database schema into 3 different documents

✅ CORRECT:
Create database_schema.md once
Link to it from other documents that need to reference it
```

### Rule 3: Always Track Changes
```
❌ WRONG:
Update document without noting what changed

✅ CORRECT:
Update version number
Add changelog entry with date and description
Commit with clear message
```

### Rule 4: Preserve History
```
❌ WRONG:
Delete old version when updating

✅ CORRECT:
Move old version to ARCHIVE/ with version suffix
Update link references to point to new version
```

---

## 📊 DOCUMENT TYPES AND THEIR RULES

### Strategy Documents (Business/Product)
- **Review Required**: Yes (by Product Manager or above)
- **Version Control**: Major versions only (1.0, 2.0)
- **Update Frequency**: Quarterly or on major pivots
- **Approval**: CEO/CTO for major changes

### Technical Specifications
- **Review Required**: Yes (by Tech Lead)
- **Version Control**: Full semantic versioning
- **Update Frequency**: With each sprint/implementation
- **Approval**: Tech Lead or CTO

### User Journeys/Stories
- **Review Required**: Yes (by Product Manager)
- **Version Control**: Minor versions (X.Y)
- **Update Frequency**: When features change
- **Approval**: Product Manager

### API Documentation
- **Review Required**: Yes (by Backend Lead)
- **Version Control**: Match API version
- **Update Frequency**: With each endpoint change
- **Approval**: Tech Lead

### Test Plans/Reports
- **Review Required**: No (informational)
- **Version Control**: Date-based
- **Update Frequency**: Per test cycle
- **Approval**: QA Lead

---

## 🔄 DOCUMENT LIFECYCLE

### 1. Creation
- Use appropriate template
- Place in correct folder
- Add header with metadata
- Link from parent document

### 2. Review
- Submit for review per document type rules
- Address feedback
- Update version after approval

### 3. Maintenance
- Regular reviews (quarterly minimum)
- Update when referenced items change
- Fix broken links immediately

### 4. Deprecation
- Mark as "Deprecated" in header
- Add deprecation notice with replacement
- Move to ARCHIVE/ after 30 days
- Update all references to point to new document

---

## 📝 FORMATTING STANDARDS

### Headers
```markdown
# H1 - Document Title Only (with emoji)
## H2 - Major Sections (with emoji)
### H3 - Subsections
#### H4 - Details (rarely used)
```

### Lists
- Use `-` for unordered lists
- Use `1.` for ordered lists
- Indent with 2 spaces for nested lists

### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data | Data | Data |
```

### Code Blocks
````markdown
```javascript
// Use language tags for syntax highlighting
const example = "code";
```
````

### Links
```markdown
[Display Text](./relative/path/to/file.md) - Description
```

---

## 🎯 PRIORITY LEVELS FOR DOCUMENTS

### Priority 0 - CRITICAL (Blocks Development)
- Database Schema
- API Specification
- Data Models
- Security Design

### Priority 1 - IMPORTANT (Needed for Development)
- Frontend Architecture
- Environment Setup
- Testing Strategy

### Priority 2 - HELPFUL (Improves Quality)
- Best Practices Guides
- Troubleshooting Docs
- Performance Guidelines

### Priority 3 - NICE TO HAVE
- Meeting Notes
- Research Documents
- Future Considerations

---

## 📞 GETTING HELP

### Questions About:
- **Document Placement**: Check decision tree above
- **Naming Conventions**: Check naming patterns table
- **Version Changes**: Follow semantic versioning rules
- **Review Process**: Check document type rules

### Still Unclear?
1. Check existing similar documents
2. Ask in team chat
3. Default to creating in root with link from MASTER_STRATEGY_DEV_TODO.md

---

**Last Updated**: 2025-10-24
**Version**: 1.0.0
**Status**: Active Documentation Standard