# 🤖 CLAUDE AI INTERACTION GUIDE FOR KARVIA STRATEGY

**Version**: 1.0.0
**Created**: 2025-10-24
**Purpose**: Guide for effectively using Claude AI to create, update, and maintain KARVIA strategy documentation

---

## 🎯 QUICK START FOR NEW CLAUDE SESSION

### 5-Minute Startup Checklist

1. **Check Current Status** (2 min)
   ```
   Read: MASTER_STRATEGY_DEV_TODO.md
   Look for: 🔴 CRITICAL missing documents
   Note: Current blockers and priorities
   ```

2. **Understand Context** (2 min)
   ```
   Read: 00_MASTER_STRATEGY.md (if exists) or README.md
   Understand: Product vision and technical architecture
   Review: 7 Blocks + 6 Engines architecture
   ```

3. **Create TODO List** (1 min)
   ```
   Use: TodoWrite tool
   Add: Priority 0 documentation tasks
   Mark: First task as "in_progress"
   ```

---

## 📋 PRIORITY DOCUMENTATION TASKS

### 🔴 Priority 0 - CRITICAL (Blocking Development)

These MUST be completed before any coding:

1. **Database Schema** (`2-TECHNICAL/3-DATA/database_schema.md`)
   ```
   Request: "Create complete database schema with:
   - All tables for 7 blocks architecture
   - Field definitions and data types
   - Primary/foreign keys and indexes
   - Multi-tenancy strategy (business_id)
   - Audit fields (created_at, updated_at, created_by)
   - Migration scripts"
   ```

2. **API Specification** (`2-TECHNICAL/2-APIS/openapi.yaml`)
   ```
   Request: "Create OpenAPI 3.0 specification with:
   - All endpoints from api_contracts.md
   - Request/response schemas
   - Authentication headers
   - Error response formats
   - Rate limiting rules"
   ```

3. **Data Models** (`2-TECHNICAL/3-DATA/data_models.md`)
   ```
   Request: "Create data models document with:
   - All entity definitions
   - Field validation rules
   - Business logic constraints
   - Computed fields
   - Relationships between models"
   ```

4. **Security Design** (`2-TECHNICAL/5-NON-FUNCTIONAL/security_design.md`)
   ```
   Request: "Create security design with:
   - JWT token structure and claims
   - RBAC permission matrix
   - Multi-tenancy isolation strategy
   - API key management
   - Data encryption approach"
   ```

---

## 🚀 EFFECTIVE PROMPTS FOR DOCUMENTATION

### For Creating New Documents

```
"Create [DOCUMENT_TYPE] for KARVIA platform following these requirements:
1. Use the document template from DOC_EDITING_RULES.md
2. Base it on the 7 Blocks + 6 Engines architecture from MVP_TECHNICAL_ARCHITECTURE_V5.md
3. Include all elements from the 12-week timeline in MASTER_DEV_LIST_V5.md
4. Follow naming convention: [APPROPRIATE_NAME].md
5. Place in folder: [CORRECT_FOLDER]/
6. Add link to MASTER_STRATEGY_DEV_TODO.md after creating"
```

### For Updating Existing Documents

```
"Update [DOCUMENT_NAME] with:
1. [Specific changes needed]
2. Increment version number appropriately (major/minor/patch)
3. Add changelog entry with date and description
4. Update 'Last Updated' date
5. Preserve all existing functionality (don't remove features)
6. Update any related documents that reference this"
```

### For Review and Audit

```
"Review [FOLDER_NAME]/ and:
1. Check all documents for completeness
2. Verify all internal links work
3. Identify any missing critical information
4. Check version numbers are current
5. Ensure consistent formatting per DOCUMENTATION_STANDARDS.md
6. Create audit report with findings"
```

---

## 📁 UNDERSTANDING KARVIA ARCHITECTURE

### Core Concepts to Remember

1. **7 Modular Blocks** (Feature Sets)
   - Block 1: Core Platform (Required - Auth, Settings, Navigation)
   - Block 2: Assessment Engine
   - Block 3: Goal Setting & Tracking
   - Block 4: Weekly/Daily Execution
   - Block 5: Analytics & Insights
   - Block 6: Reports & Dashboards
   - Block 7: Admin & Configuration

2. **6 Backend Microservice Engines**
   - IAM Engine (Identity & Access Management)
   - Assessment Engine (Dynamic assessments)
   - Planner Engine (OKR/Goal generation)
   - Scoring Engine (Performance calculation)
   - Observer Engine (Real-time monitoring)
   - Tracking Engine (Progress tracking)

3. **iBrain Integration**
   - External SaaS service (NOT delivered with platform)
   - Optional toggle per business
   - $30/user/month when enabled
   - Provides AI-powered insights and recommendations

4. **Multi-Tenancy Model**
   - Row-level security with business_id
   - Complete data isolation
   - Shared infrastructure, isolated data

---

## 🔄 DOCUMENT CREATION WORKFLOW

### Step 1: Check if Document Exists
```
Use: Glob tool
Pattern: "**/*[keyword]*.md"
Check: MASTER_STRATEGY_DEV_TODO.md for existing docs
```

### Step 2: Read Related Documents
```
Read: Related architecture docs
Read: User journeys if applicable
Read: Technical specifications
Understand: How new doc fits in system
```

### Step 3: Create Document
```
Use: Write tool
Follow: Template from DOC_EDITING_RULES.md
Include: All required sections
Version: Start at 1.0.0
```

### Step 4: Link Document
```
Update: MASTER_STRATEGY_DEV_TODO.md
Add: Link in appropriate section
Update: Parent folder README if exists
Verify: Link works correctly
```

### Step 5: Update TODO List
```
Use: TodoWrite tool
Mark: Current task as completed
Add: Any follow-up tasks identified
```

---

## ⚠️ COMMON PITFALLS TO AVOID

### 1. Creating Orphaned Documents
```
❌ WRONG: Create document without linking it anywhere
✅ CORRECT: Always link from MASTER_STRATEGY_DEV_TODO.md or parent document
```

### 2. Removing Existing Features
```
❌ WRONG: "This feature seems complex, I'll remove it"
✅ CORRECT: Keep all features, mark as "Future Enhancement" if needed
```

### 3. Hardcoding Values
```
❌ WRONG: "total_questions": 45 (hardcoded)
✅ CORRECT: "total_questions": configurable, default 45
```

### 4. Mixing iBrain with Core Platform
```
❌ WRONG: Show iBrain as required dependency
✅ CORRECT: Show as optional toggle with clear boundary
```

### 5. Inconsistent Formatting
```
❌ WRONG: Each document with different structure
✅ CORRECT: Follow template consistently
```

---

## 📊 DOCUMENT QUALITY CHECKLIST

Before completing any documentation task:

### Content
- [ ] Accurate based on existing architecture
- [ ] Complete with all required sections
- [ ] Consistent with other documents
- [ ] No duplicated information
- [ ] Clear separation of core vs optional features

### Structure
- [ ] Follows template from DOC_EDITING_RULES.md
- [ ] Proper version number and metadata
- [ ] Table of contents for long documents
- [ ] Changelog entry if updating
- [ ] Related documents section

### Integration
- [ ] Linked from parent document
- [ ] Cross-references are correct
- [ ] Added to MASTER_STRATEGY_DEV_TODO.md
- [ ] Placed in correct folder

### Technical Accuracy
- [ ] Aligns with 7 Blocks architecture
- [ ] Correctly references 6 Engines
- [ ] iBrain shown as optional
- [ ] Multi-tenancy considered
- [ ] Follows 12-week timeline

---

## 🎯 SPECIFIC DOCUMENTATION REQUESTS

### Database Schema
```
"Create database schema for KARVIA with tables for:
- Users, Businesses, Teams (multi-tenancy)
- Assessments (dynamic, template-based)
- OKRs (Objectives, Key Results)
- Goals and Tasks
- Analytics and Progress tracking
Include all foreign keys, indexes, and migration order"
```

### API Endpoints
```
"Create OpenAPI specification including:
- Authentication endpoints (JWT-based)
- Assessment CRUD operations
- OKR management (create, cascade, update)
- Team operations
- Real-time WebSocket events
Base on existing api_contracts.md"
```

### Frontend Architecture
```
"Create frontend architecture document with:
- State management approach (no framework, vanilla JS)
- Component structure
- Data flow patterns
- WebSocket integration
- Caching strategy with localStorage"
```

### Testing Strategy
```
"Create testing strategy covering:
- Unit tests for each engine
- Integration tests for API endpoints
- E2E tests for user journeys
- Performance benchmarks
- Security testing approach"
```

---

## 🔗 KEY DOCUMENTS TO REFERENCE

### Always Start With These
1. `MASTER_STRATEGY_DEV_TODO.md` - Current status and priorities
2. `MVP_TECHNICAL_ARCHITECTURE_V5.md` - System architecture
3. `MASTER_DEV_LIST_V5.md` - 12-week timeline
4. `MVP_STRATEGY_V5.md` - Product strategy

### For Technical Work
1. `backend_architecture.md` - Backend design
2. `api_contracts.md` - Existing API definitions
3. `ibrain_integration_model.md` - AI integration approach

### For Product Work
1. `MVP_USER_STORIES_V3.2.md` - All user stories
2. `*_JOURNEY.md` files - User journey documents
3. `PRODUCT_OVERVIEW_V4.md` - Product vision

---

## 💡 TIPS FOR SUCCESS

### 1. Use TodoWrite Extensively
- Create detailed task lists
- Update status as you work
- Mark completed immediately
- Add new tasks as discovered

### 2. Read Before Writing
- Always check if document exists
- Read related documents first
- Understand the full context
- Don't duplicate existing info

### 3. Test Your Links
- Verify all internal links work
- Use relative paths
- Include description with links
- Update broken links immediately

### 4. Version Properly
- Start new docs at 1.0.0
- Use semantic versioning
- Document what changed
- Archive old versions

### 5. Ask for Clarification
- When requirements unclear
- When multiple approaches possible
- Before removing features
- Before major structural changes

---

## 📞 WHEN YOU'RE STUCK

### Can't Find Information?
```
1. Check MASTER_STRATEGY_DEV_TODO.md
2. Use Glob to search: "**/*keyword*.md"
3. Check related journey documents
4. Look in archived versions
```

### Not Sure Where to Put Document?
```
1. Check DOC_EDITING_RULES.md decision tree
2. Look for similar documents
3. Default to root with link from MASTER_STRATEGY_DEV_TODO.md
```

### Document Already Exists?
```
1. Update existing rather than create new
2. Increment version number
3. Add changelog entry
4. Archive old version if major change
```

---

## 🚨 CRITICAL REMINDERS

1. **NEVER** remove existing features - mark as future if needed
2. **NEVER** hardcode values - make configurable
3. **NEVER** create documents without linking them
4. **ALWAYS** preserve user data and features
5. **ALWAYS** show iBrain as optional, not required
6. **ALWAYS** follow the 7 Blocks + 6 Engines architecture
7. **ALWAYS** consider multi-tenancy in all designs

---

**Last Updated**: 2025-10-24
**Version**: 1.0.0
**Maintained By**: KARVIA Documentation Team