# 📐 KARVIA DOCUMENTATION STANDARDS

**Version**: 1.0.0
**Created**: 2025-10-24
**Purpose**: Comprehensive formatting, structure, and content standards for all KARVIA documentation

---

## 🎯 PURPOSE

Ensure all KARVIA documentation is:
- **Consistent** - Same format and structure across all docs
- **Professional** - Publication-ready quality
- **Discoverable** - Easy to find and navigate
- **Maintainable** - Simple to update and version
- **Actionable** - Clear next steps and implementation guidance

---

## 📋 STANDARD DOCUMENT TEMPLATE

```markdown
# [EMOJI] [DOCUMENT TITLE IN TITLE CASE]

**Version**: X.Y.Z
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Author**: [Name or Team]
**Status**: Draft | In Review | Approved | Deprecated
**Priority**: P0-Critical | P1-Important | P2-Helpful | P3-Nice-to-have

---

## 🎯 PURPOSE

[One paragraph (3-5 sentences) explaining what this document contains and why it exists]

---

## 📋 TABLE OF CONTENTS

1. [Section Name](#section-name)
2. [Section Name](#section-name)
3. [Section Name](#section-name)

---

## 🔑 KEY CONCEPTS

[If applicable - define important terms or concepts upfront]

---

## [MAIN CONTENT SECTIONS]

### [Section Name]

[Content with appropriate subsections]

---

## 📊 SUMMARY

[Key takeaways or conclusions]

---

## 🔗 RELATED DOCUMENTS

- [Document Name](./path/to/document.md) - Brief description
- [Document Name](./path/to/document.md) - Brief description

---

## 📝 CHANGE LOG

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | YYYY-MM-DD | [Name] | Initial version |

---

## 📞 QUESTIONS?

Contact: [Role or Team Name]
Slack: #channel-name
Email: contact@karvia.com
```

---

## 📝 FORMATTING GUIDELINES

### Headings

```markdown
# H1 - Document Title Only (ONE per document)
## H2 - Major Sections (with emoji prefix)
### H3 - Subsections (no emoji)
#### H4 - Sub-subsections (rarely used)
##### H5 - Avoid using
###### H6 - Never use
```

**Emoji Guide for H2 Sections:**
- 🎯 Purpose/Objectives/Goals
- 📋 Overview/Table of Contents/Lists
- 🔑 Key Concepts/Principles
- 📊 Data/Analytics/Metrics
- 🔧 Technical/Implementation
- 🚀 Deployment/Launch/Delivery
- 📁 Structure/Organization
- ✅ Success Criteria/Validation
- ⚠️ Warnings/Important Notes
- 🔄 Process/Workflow/Lifecycle
- 📝 Notes/Change Log/Documentation
- 🔗 References/Related/Links
- 📞 Support/Contact/Help
- 💡 Tips/Best Practices
- 🚨 Critical/Urgent/Blocking

### Lists

**Unordered Lists:**
```markdown
- First level item
  - Second level item (2 space indent)
    - Third level item (4 space indent)
```

**Ordered Lists:**
```markdown
1. First item
2. Second item
   1. Sub-item (3 space indent)
   2. Sub-item
3. Third item
```

**Task Lists:**
```markdown
- [ ] Incomplete task
- [x] Completed task
  - [ ] Sub-task
```

### Tables

**Standard Table:**
```markdown
| Column Header | Column Header | Column Header |
|---------------|---------------|---------------|
| Left-aligned | Center-aligned | Right-aligned |
| Data | Data | Data |
```

**Alignment:**
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| Text | Text | Number |
```

**Status Indicators in Tables:**
```markdown
| Feature | Status | Priority |
|---------|--------|----------|
| Feature A | ✅ Complete | P0 |
| Feature B | 🚧 In Progress | P1 |
| Feature C | ❌ Not Started | P2 |
| Feature D | ⚠️ Blocked | P0 |
```

### Code Blocks

**Inline Code:**
```markdown
Use `backticks` for inline code, commands, or file names
```

**Code Blocks with Language:**
````markdown
```javascript
// Always specify language for syntax highlighting
const example = "code";
```

```bash
# Shell commands
npm install
```

```sql
-- SQL queries
SELECT * FROM users WHERE active = true;
```

```yaml
# Configuration files
version: '3.8'
services:
  app:
    image: node:18
```
````

### Links

**Internal Links (Preferred):**
```markdown
[Display Text](./relative/path/to/file.md) - Description of link
[Section Link](#section-header) - Links to section in same document
```

**External Links:**
```markdown
[External Resource](https://example.com) - Description
```

**Reference Style Links:**
```markdown
[Link text][reference-key]
[Another link][reference-key]

[reference-key]: https://example.com "Optional Title"
```

### Emphasis

```markdown
**Bold text** for strong emphasis
*Italic text* for emphasis
***Bold and italic*** for very strong emphasis
~~Strikethrough~~ for deprecated content
```

### Blockquotes

```markdown
> Single line quote

> Multi-line quote continues here
> and here with proper formatting
>
> > Nested quotes if needed
```

### Horizontal Rules

```markdown
---
(Use sparingly, only between major sections)
```

---

## 📊 CONTENT STANDARDS

### Writing Style

**Voice and Tone:**
- **Professional** but approachable
- **Active voice** preferred
- **Present tense** for current state
- **Future tense** for plans
- **Imperative** for instructions

**Clarity Rules:**
- One idea per sentence
- Short paragraphs (3-5 sentences)
- Bullet points for lists > 3 items
- Define acronyms on first use
- Avoid jargon without explanation

### Technical Specifications

**API Documentation:**
```markdown
### POST /api/resource

**Purpose**: Create a new resource

**Authentication**: Bearer token required

**Request Body**:
```json
{
  "field1": "string",
  "field2": 123
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "field1": "string",
  "field2": 123,
  "created_at": "2025-10-24T00:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `409 Conflict` - Resource already exists
```

**Database Schema:**
```markdown
### Table: users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | User identifier |
| business_id | UUID | FK, NOT NULL | Business association |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes**:
- `idx_users_business_id` on (business_id)
- `idx_users_email` on (email)

**Foreign Keys**:
- `business_id` references `businesses(id)` ON DELETE CASCADE
```

### User Stories Format

```markdown
### Story ID: [WEEK]-[BLOCK]-[NUMBER]

**As a** [role]
**I want to** [action/feature]
**So that** [benefit/value]

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Technical Requirements**:
- API endpoints needed
- Database changes
- Frontend components

**Dependencies**:
- Requires [STORY-ID] completion
- Blocked by [ISSUE-ID]
```

---

## 📁 FILE AND FOLDER NAMING

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Strategies** | `{TOPIC}_STRATEGY_V{N}.md` | `MVP_STRATEGY_V5.md` |
| **Specifications** | `{feature}_spec.md` | `assessment_spec.md` |
| **Architectures** | `{component}_architecture.md` | `backend_architecture.md` |
| **Journeys** | `{ROLE}_JOURNEY.md` | `EMPLOYEE_JOURNEY.md` |
| **Guides** | `{TOPIC}_GUIDE.md` | `DEPLOYMENT_GUIDE.md` |
| **APIs** | `{service}_api.md` or `openapi.yaml` | `auth_api.md` |
| **Schemas** | `{model}_schema.md` | `database_schema.md` |
| **Reports** | `{TOPIC}_REPORT_{DATE}.md` | `AUDIT_REPORT_2025-10-24.md` |
| **Meeting Notes** | `{DATE}_{TOPIC}.md` | `2025-10-24_ARCHITECTURE_REVIEW.md` |

### Folder Structure

```
KARVIA_STRATEGY/
├── 0-BUSINESS/           # Business documentation
├── 1-PRODUCT/            # Product documentation
├── 2-TECHNICAL/          # Technical documentation
├── 3-DELIVERY/           # Delivery documentation
└── ARCHIVE/              # Deprecated documents
```

**Subfolder Numbering:**
- Use 0-based indexing
- Prefix with number for ordering
- Use UPPERCASE with hyphens
- Be descriptive but concise

---

## 🔄 VERSIONING STANDARDS

### Semantic Versioning (X.Y.Z)

| Version Part | When to Increment | Example Change |
|--------------|-------------------|----------------|
| **X (Major)** | Breaking changes | Complete restructure, format change |
| **Y (Minor)** | New content/sections | Add new feature documentation |
| **Z (Patch)** | Fixes/clarifications | Typo fixes, minor updates |

### Version Header Format

```markdown
**Version**: 1.0.0
**Created**: 2025-10-24
**Last Updated**: 2025-10-24
**Previous Version**: [0.9.0](./ARCHIVE/DOCUMENT_V0.9.md) (if applicable)
```

### Change Log Format

```markdown
## 📝 CHANGE LOG

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-24 | John Doe | Initial version |
| 1.0.1 | 2025-10-25 | Jane Smith | Fixed typos in section 3 |
| 1.1.0 | 2025-10-26 | John Doe | Added security considerations |
| 2.0.0 | 2025-10-27 | Team | Complete restructure for v2 architecture |
```

---

## ✅ QUALITY CHECKLIST

### Before Publishing Any Document

**Content Quality:**
- [ ] Purpose clearly stated
- [ ] All sections complete
- [ ] No placeholder text
- [ ] Technically accurate
- [ ] No sensitive information

**Format Quality:**
- [ ] Follows template structure
- [ ] Consistent heading hierarchy
- [ ] Tables properly formatted
- [ ] Code blocks have language tags
- [ ] Links are relative and working

**Metadata Quality:**
- [ ] Version number correct
- [ ] Dates accurate
- [ ] Author identified
- [ ] Status appropriate
- [ ] Priority assigned

**Integration Quality:**
- [ ] Linked from parent doc
- [ ] Related docs referenced
- [ ] Added to index/inventory
- [ ] Changelog updated

---

## 📊 DOCUMENT LENGTH GUIDELINES

| Document Type | Target Length | Maximum Length |
|---------------|---------------|----------------|
| **Strategy Doc** | 5-10 pages | 20 pages |
| **Technical Spec** | 10-15 pages | 30 pages |
| **User Journey** | 8-12 pages | 20 pages |
| **API Documentation** | As needed | No limit |
| **Guide/Tutorial** | 3-5 pages | 10 pages |
| **Meeting Notes** | 1-2 pages | 3 pages |
| **Report** | 2-5 pages | 10 pages |

**Page = ~50 lines of markdown**

---

## 🚨 COMMON MISTAKES TO AVOID

### 1. Inconsistent Headers
```markdown
❌ WRONG:
## Overview
### DETAILS
## summary

✅ CORRECT:
## Overview
### Details
## Summary
```

### 2. Missing Metadata
```markdown
❌ WRONG:
# Document Title
[Content starts immediately]

✅ CORRECT:
# Document Title
**Version**: 1.0.0
**Created**: 2025-10-24
[etc...]
```

### 3. Broken Links
```markdown
❌ WRONG:
[See documentation](../../../docs/file.md)

✅ CORRECT:
[See documentation](./relative/path/file.md)
```

### 4. Unformatted Code
```markdown
❌ WRONG:
```
const code = "example";
```

✅ CORRECT:
```javascript
const code = "example";
```
```

### 5. Wall of Text
```markdown
❌ WRONG:
This is a very long paragraph that continues for many lines without any breaks or formatting making it very difficult to read and understand the key points being made in the documentation...

✅ CORRECT:
This document covers three key points:
- Point one with explanation
- Point two with details
- Point three with examples

Each point is clearly separated and easy to scan.
```

---

## 💡 BEST PRACTICES

### 1. Start with an Outline
- Create section headers first
- Fill in content progressively
- Review structure before writing

### 2. Use Visual Hierarchy
- Important info in tables
- Key points in bullet lists
- Examples in code blocks
- Warnings in blockquotes

### 3. Be Consistent
- Same terminology throughout
- Consistent formatting
- Matching style across docs

### 4. Think of the Reader
- Who will read this?
- What do they need to know?
- What actions should they take?

### 5. Review Before Publishing
- Read entire document
- Check all links
- Verify code examples
- Test any instructions

---

## 📞 HELP AND SUPPORT

**Questions about standards?**
- Check this document first
- Review [DOC_EDITING_RULES.md](./DOC_EDITING_RULES.md)
- Ask in #documentation channel

**Need a template?**
- Use standard template above
- Check similar existing documents
- Ask documentation team for help

---

**Last Updated**: 2025-10-24
**Version**: 1.0.0
**Status**: Active Standard
**Maintained By**: KARVIA Documentation Team