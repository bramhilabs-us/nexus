# 🎯 MASTER KARVIA BUSINESS DEVELOPMENT LIST

**Version**: 1.0
**Created**: October 1, 2025
**Product**: Karvia Business - Assessment-Driven OKR Platform
**Target Launch**: November 30, 2025 (8 weeks)

---

## 📊 PROGRESS OVERVIEW

### **MVP Progress**: ⬜⬜⬜⬜⬜⬜⬜⬜ 0/8 weeks (0%)
### **Backlog Items**: 47 items (Post-MVP features)
### **MVP Todo Items**: 156 tasks across 3 sprints

---

## 🚀 MVP TODOS (Nov 30, 2025 Launch)

### **SPRINT 1: ASSESSMENT FRAMEWORK & USER ONBOARDING** (Weeks 1-2)

#### **🔧 Backend Foundation** (Week 1)

**Database Schema Design:**
- [ ] Design `companies` collection schema
  - [ ] Fields: id, name, archetype (16 options), size, stage, revenueModel, createdAt
  - [ ] Indexes: id (primary), name (text search)
- [ ] Design `users` collection schema
  - [ ] Fields: id, email, passwordHash, role (5 roles), companyId[], profile, createdAt
  - [ ] Indexes: id (primary), email (unique), companyId (foreign key)
  - [ ] Support multi-company for consultants (companyId as array)
- [ ] Design `assessment_templates` collection schema
  - [ ] Fields: id, name, version, author, categories[], calculationFormula, isPublic, companyId
  - [ ] Nested: categories[{id, name, weight, questions[]}]
  - [ ] Nested: questions[{id, text, type, options[], weight, scoring}]
- [ ] Design `assessments` collection schema
  - [ ] Fields: id, templateId, userId, companyId, responses[], scores{}, completedAt
  - [ ] Calculated fields: categoryScores{}, overallScore
- [ ] Design `objectives` collection schema
  - [ ] Fields: id, title, rationale, companyId, ownerId, focusArea, difficulty, keyResults[]
  - [ ] Nested: keyResults[{id, description, metric, baseline, target, progress}]
- [ ] Design `tasks` collection schema
  - [ ] Fields: id, objectiveId, krId, title, description, assignedTo, dueDate, status, completedAt
- [ ] Create MongoDB connection module (`/server/db/connection.js`)
- [ ] Create Mongoose models for all schemas (`/server/models/`)
- [ ] Test database connections and CRUD operations

**IAM Engine Enhancement (Port 8081):**
- [ ] Update IAM for 5-role system
  - [ ] Super Admin, Company Admin, Manager, Employee, Consultant
  - [ ] Permission matrix implementation
- [ ] Multi-company support for Consultants
  - [ ] User can belong to multiple companies
  - [ ] Company switching logic
  - [ ] Scoped data access per company
- [ ] Invitation system
  - [ ] Generate unique invite tokens
  - [ ] Email sending integration (SendGrid or NodeMailer)
  - [ ] Token expiration (7 days)
  - [ ] Registration via invite link
- [ ] Role assignment API
  - [ ] POST `/api/iam/assign-role`
  - [ ] PUT `/api/iam/change-role`
  - [ ] GET `/api/iam/users/:companyId`

**Assessment Engine (Port 8082):**
- [ ] Template management APIs
  - [ ] GET `/api/assessment/templates` - List all templates
  - [ ] GET `/api/assessment/templates/:id` - Get template details
  - [ ] POST `/api/assessment/templates` - Create custom template
  - [ ] PUT `/api/assessment/templates/:id` - Update template
  - [ ] DELETE `/api/assessment/templates/:id` - Delete template
- [ ] Seed 6 pre-built templates
  - [ ] Speed/Strength/Intelligence (default)
  - [ ] McKinsey 7S Framework
  - [ ] Balanced Scorecard
  - [ ] Startup Health Check
  - [ ] Service Business Maturity
  - [ ] E-commerce Readiness
- [ ] Template builder logic
  - [ ] Category CRUD operations
  - [ ] Question CRUD operations
  - [ ] Weight validation (sum to 100%)
  - [ ] Formula editor (JavaScript eval with sandboxing)
- [ ] Assessment taking APIs
  - [ ] POST `/api/assessment/start` - Initialize assessment
  - [ ] PUT `/api/assessment/:id/answer` - Save answer
  - [ ] POST `/api/assessment/:id/submit` - Submit completed assessment
  - [ ] GET `/api/assessment/:id/results` - Get results
- [ ] Scoring calculation engine
  - [ ] Implement weighted average formula
  - [ ] Implement custom formula executor (safe eval)
  - [ ] Calculate category scores
  - [ ] Calculate overall score
  - [ ] Identify weakest areas (score <70)
- [ ] Results generation
  - [ ] Score visualization data (for charts)
  - [ ] AI-generated insights (mini OpenAI call)
  - [ ] Recommendations based on low scores

---

#### **🎨 Frontend Foundation** (Week 1-2)

**Project Setup:**
- [ ] Migrate design system from goaltracker
  - [ ] Copy `/design-system.css` → `/client/src/styles/karvia-design.css`
  - [ ] Adapt color palette (Karvia branding)
  - [ ] Component library (buttons, cards, forms, badges)
- [ ] Set up React Router
  - [ ] Route config for 22 screens
  - [ ] Protected routes (role-based)
  - [ ] Company switcher for consultants
- [ ] Global state management (Context API or Redux)
  - [ ] Auth context (current user, role, company)
  - [ ] Company context (current company for consultants)
  - [ ] Assessment context (current assessment state)
- [ ] Shared components
  - [ ] Navigation (role-aware, company switcher)
  - [ ] Progress bars
  - [ ] Score gauges (0-100 circular)
  - [ ] Modal dialogs
  - [ ] Form components (input, select, checkbox, radio)

---

**Admin Screens (3 screens):**

**1. `admin_01_assessment_templates.html`**
- [ ] UI: Template gallery (6 pre-built cards)
- [ ] UI: "+ Create Custom Template" button
- [ ] UI: Template cards show:
  - [ ] Name, description, author
  - [ ] Number of categories, total questions
  - [ ] Calculation method
  - [ ] "Preview" and "Use Template" buttons
- [ ] Feature: Search/filter templates
- [ ] Feature: Click template to see details
- [ ] API integration: GET `/api/assessment/templates`
- [ ] API integration: POST `/api/assessment/select-template/:id`

**2. `admin_02_template_builder.html`**
- [ ] UI: Template metadata form (name, description, version)
- [ ] UI: Category list (drag-drop reorder)
- [ ] UI: "+ Add Category" button
- [ ] UI: Per-category weight input (must sum to 100%)
- [ ] UI: Question builder modal
  - [ ] Question text input
  - [ ] Question type selector (scale, multiple choice, text, boolean)
  - [ ] Answer options editor
  - [ ] Scoring configuration
  - [ ] Weight input (% of category)
- [ ] UI: Formula editor
  - [ ] Dropdown: Weighted Average, Sum, Custom
  - [ ] Code editor for custom formula (Monaco or CodeMirror)
  - [ ] Formula validator
  - [ ] Test with sample data
- [ ] Feature: Drag-drop categories
- [ ] Feature: Duplicate questions
- [ ] Feature: Import from existing template
- [ ] API integration: POST `/api/assessment/templates`
- [ ] API integration: PUT `/api/assessment/templates/:id`
- [ ] Validation: Weight sums, formula syntax

**3. `admin_03_role_management.html`**
- [ ] UI: User table (name, email, role, company, actions)
- [ ] UI: Search/filter users
- [ ] UI: Bulk actions (change role, send assessment)
- [ ] UI: "Edit" button per user → modal
- [ ] UI: Edit modal:
  - [ ] Role selector (5 roles)
  - [ ] Function/department dropdown
  - [ ] Permissions checkboxes (read-only, based on role)
  - [ ] Save/Cancel buttons
- [ ] Feature: Paginated table (50 users/page)
- [ ] Feature: Sort by column (name, email, role)
- [ ] API integration: GET `/api/iam/users/:companyId`
- [ ] API integration: PUT `/api/iam/assign-role`
- [ ] Validation: Can't demote yourself if only admin

---

**Owner Workflow (5 screens):**

**4. `owner_01_signup_business_profile.html`**
- [ ] UI: Multi-step wizard (3 steps)
- [ ] Step 1: Account creation
  - [ ] Email, password, confirm password
  - [ ] "Sign Up" button
- [ ] Step 2: Company profile
  - [ ] Company name input
  - [ ] Industry dropdown (20+ industries)
  - [ ] **Business archetype selector (16 archetypes)**
    - [ ] Radio buttons or cards
    - [ ] Helper: "B2B or B2C?" → filter to 8 options
    - [ ] Description on hover
  - [ ] Company size radio buttons (5 options)
  - [ ] Growth stage radio buttons (3 options)
  - [ ] Revenue model checkboxes (multi-select)
- [ ] Step 3: Confirmation
  - [ ] Review entered data
  - [ ] "Complete Setup" button
- [ ] API integration: POST `/api/iam/signup`
- [ ] API integration: POST `/api/companies`
- [ ] Validation: Email uniqueness, password strength
- [ ] Redirect to: `owner_02_strategic_preferences.html`

**5. `owner_02_strategic_preferences.html`**
- [ ] UI: Introduction text ("Select your focus areas for OKR generation")
- [ ] UI: 6 category sections:
  - [ ] Growth & Revenue (4 options)
  - [ ] Operations & Delivery (4 options)
  - [ ] Team & Culture (4 options)
  - [ ] Product & Innovation (4 options)
  - [ ] Marketing & Brand (4 options)
  - [ ] Financial & Systems (4 options)
- [ ] UI: Per-option checkbox with toggle: Primary | Secondary | None
  - [ ] Visual indicator (star icon for Primary, dot for Secondary)
- [ ] UI: Counter: "5 Primary, 3 Secondary selected"
- [ ] UI: "Save Preferences" button
- [ ] Feature: No selection limit (unlimited)
- [ ] Feature: At least 1 Primary required (validation)
- [ ] API integration: POST `/api/companies/:id/preferences`
- [ ] Redirect to: `owner_03_take_assessment.html`

**6. `owner_03_take_assessment.html`**
- [ ] UI: Template selection (if not already chosen)
  - [ ] Show 6 pre-built templates
  - [ ] Highlight recommended template based on archetype
  - [ ] "Start Assessment" button
- [ ] UI: Assessment interface (after template selected)
  - [ ] Progress bar with time estimate
  - [ ] Current category indicator
  - [ ] Question counter (5 of 21)
  - [ ] Question text (large, readable)
  - [ ] Answer options (scale, multiple choice, etc.)
  - [ ] "Previous" and "Next" buttons
  - [ ] "Save & Continue Later" button
- [ ] Feature: Progressive disclosure (one question at a time)
- [ ] Feature: Auto-save every 3 questions
- [ ] Feature: Resume from where you left off
- [ ] API integration: POST `/api/assessment/start`
- [ ] API integration: PUT `/api/assessment/:id/answer`
- [ ] API integration: POST `/api/assessment/:id/submit`
- [ ] Redirect after submit: `owner_04_assessment_results.html`

**7. `owner_04_assessment_results.html`** ⭐
- [ ] UI: Hero section with overall score
  - [ ] Large circular gauge (0-100)
  - [ ] Score color coding (0-60 red, 60-80 yellow, 80-100 green)
  - [ ] "Your Business Health: 73/100"
- [ ] UI: Category scores (3 cards for Speed/Strength/Intelligence)
  - [ ] Circular gauge per category
  - [ ] Score + label
  - [ ] Status icon (✅🟡⚠️)
- [ ] UI: AI Insights section
  - [ ] "Key Findings" heading
  - [ ] 3-4 bullet points from OpenAI mini-analysis
  - [ ] Example: "Your Strength score (68) indicates moderate financial stability. Consider focusing on cash reserves and team capability."
- [ ] UI: Recommendations section
  - [ ] List of suggested focus areas
  - [ ] Based on lowest scores
- [ ] UI: **"Generate OKRs" CTA button** (prominent)
- [ ] UI: "Invite Team" secondary button
- [ ] Feature: Export results to PDF
- [ ] Feature: Comparison view (if retaking assessment)
- [ ] API integration: GET `/api/assessment/:id/results`
- [ ] API integration: POST `/api/openai/insights` (mini OpenAI call)

**8. `owner_05_invite_team.html`**
- [ ] UI: Form to invite team members
  - [ ] Email input (can add multiple, comma-separated)
  - [ ] Role selector per person (Manager | Employee)
  - [ ] Function dropdown per person (Sales, Marketing, Product, etc.)
  - [ ] Assessment checkboxes per person:
    - [ ] Speed Assessment
    - [ ] Strength Assessment
    - [ ] Intelligence Assessment
    - [ ] (Can assign all 3 or subset)
  - [ ] Optional: Personal message textarea
  - [ ] "Send Invitations" button
- [ ] UI: Invitation history table
  - [ ] Email, role, status (Pending | Accepted), date sent
  - [ ] "Resend" button for pending
- [ ] Feature: Bulk invite (upload CSV)
- [ ] Feature: Custom invitation email template
- [ ] API integration: POST `/api/iam/invite`
- [ ] Email sends with unique token link

---

**Employee Workflow (3 screens):**

**9. `employee_01_registration.html`**
- [ ] UI: Registration form (accessed via invite link)
  - [ ] Pre-filled: Email (from invite)
  - [ ] Password input
  - [ ] Confirm password
  - [ ] First name, last name
  - [ ] Optional: Profile photo upload
  - [ ] "Create Account" button
- [ ] UI: Company info display (read-only)
  - [ ] "You're joining: Acme Consulting"
  - [ ] "Role: Manager"
- [ ] Feature: Token validation (check if invite is valid/expired)
- [ ] Feature: Auto-login after registration
- [ ] API integration: POST `/api/iam/register-via-invite`
- [ ] Redirect to: `employee_02_take_assessment.html`

**10. `employee_02_take_assessment.html`**
- [ ] (Same UI as `owner_03_take_assessment.html`)
- [ ] UI: Shows only assigned assessments
  - [ ] "Your manager assigned you: Speed Assessment, Strength Assessment"
- [ ] Feature: Can take multiple assessments sequentially
- [ ] API integration: Same as owner assessment
- [ ] Redirect after completion: `employee_03_assessment_results.html`

**11. `employee_03_assessment_results.html`**
- [ ] UI: Personal results dashboard
  - [ ] Overall personal score (if applicable)
  - [ ] Category scores (Speed/Strength/Intelligence)
  - [ ] Visual gauges
- [ ] UI: "How you compare" section
  - [ ] Anonymous team average
  - [ ] "Your Speed: 78, Team Avg: 72" (+6 above average)
- [ ] UI: Personal insights
  - [ ] AI-generated based on individual scores
  - [ ] Strengths and development areas
- [ ] UI: "Next Steps" section
  - [ ] "Your dashboard is ready" → link to daily dashboard
  - [ ] "Wait for manager to assign objectives"
- [ ] API integration: GET `/api/assessment/:id/results`
- [ ] API integration: GET `/api/assessment/team-average/:companyId`

---

### **SPRINT 2: OKR GENERATION & MANAGER PLANNING** (Weeks 3-4)

#### **🤖 OpenAI Integration** (Week 3)

**Planner Engine Enhancement (Port 8083):**
- [ ] Install OpenAI SDK (`npm install openai`)
- [ ] Configure API key (environment variable)
- [ ] Create OpenAI service module (`/server/services/openai.js`)
- [ ] Implement OKR generation endpoint
  - [ ] POST `/api/okr/generate`
  - [ ] Input: assessmentId, companyId
  - [ ] Fetch assessment results
  - [ ] Fetch company profile (archetype, preferences)
  - [ ] Build structured prompt
  - [ ] Call OpenAI GPT-4
  - [ ] Parse JSON response
  - [ ] Validate objectives structure
  - [ ] Return to frontend
- [ ] Implement caching layer
  - [ ] Redis or in-memory cache
  - [ ] Key: hash of (assessmentResults + archetype + preferences)
  - [ ] TTL: 24 hours
  - [ ] Reduces API costs for identical requests
- [ ] Implement fallback mechanism
  - [ ] If OpenAI fails, return template-based OKRs
  - [ ] Pre-written templates per archetype
  - [ ] Show user: "AI unavailable, showing template suggestions"
- [ ] Implement rate limiting
  - [ ] Max 10 OKR generations per company per day
  - [ ] Prevents abuse and cost overruns
- [ ] Error handling
  - [ ] OpenAI timeout (30 seconds)
  - [ ] Invalid API key
  - [ ] Malformed JSON response
  - [ ] Log errors for debugging

**OpenAI Prompt Engineering:**
- [ ] Create prompt template (`/server/prompts/okr-generation.js`)
- [ ] Include all context fields (see MVP_STRATEGY.md)
- [ ] Test with multiple archetypes
- [ ] Refine for quality objectives
- [ ] Ensure JSON output format consistency
- [ ] Add few-shot examples to prompt
- [ ] Temperature tuning (0.7 for balance)
- [ ] Max tokens tuning (2500 for 4-6 objectives)

---

**OKR Generation Screens (3 screens):**

**12. `okr_01_generate_objectives.html`** ⭐
- [ ] UI: Loading state ("Analyzing your business...")
  - [ ] Animated progress indicator
  - [ ] Status messages:
    - [ ] "Reading assessment results..."
    - [ ] "Identifying strategic gaps..."
    - [ ] "Generating objectives..."
    - [ ] "Crafting key results..."
- [ ] UI: Generation complete
  - [ ] Success message: "Generated 5 objectives tailored to your business"
  - [ ] "Review Objectives" button
- [ ] Feature: Generation triggered from assessment results page
- [ ] Feature: Can regenerate if not satisfied
- [ ] API integration: POST `/api/okr/generate`
- [ ] API integration: Shows loading for ~5-10 seconds (OpenAI processing)
- [ ] Redirect to: `okr_02_review_objectives.html`

**13. `okr_02_review_objectives.html`** ⭐
- [ ] UI: Objective cards (one per generated objective)
  - [ ] Title (editable inline)
  - [ ] Rationale (collapsible, shows assessment reference)
  - [ ] Focus area badge
  - [ ] Difficulty level indicator
  - [ ] Estimated effort (% of capacity)
  - [ ] Key Results list (editable):
    - [ ] Description, metric, baseline, target
    - [ ] "+ Add KR" button
    - [ ] Delete KR button
  - [ ] Actions: Approve ✅ | Edit ✏️ | Reject ❌
- [ ] UI: Bulk actions at bottom
  - [ ] "Approve All" button
  - [ ] "Regenerate All" button (calls OpenAI again)
  - [ ] "Save Draft" button
- [ ] Feature: Inline editing of titles, KR descriptions
- [ ] Feature: Drag-drop to reorder objectives by priority
- [ ] Feature: Reject objective → disappears from list
- [ ] Feature: Approve → adds to objective library
- [ ] API integration: GET `/api/okr/generated/:assessmentId`
- [ ] API integration: PUT `/api/okr/:id` (save edits)
- [ ] API integration: POST `/api/okr/approve/:id`
- [ ] API integration: DELETE `/api/okr/:id` (reject)
- [ ] Redirect after approve all: `okr_03_objective_library.html`

**14. `okr_03_objective_library.html`**
- [ ] UI: All company objectives in card grid
- [ ] UI: Filters:
  - [ ] Status: Draft | Active | Completed | Archived
  - [ ] Focus Area: Multi-select dropdown (24 options)
  - [ ] Assigned to: Owner | Manager | Unassigned
  - [ ] Timeframe: Q4 2024 | Q1 2025 | etc.
- [ ] UI: Per-objective card:
  - [ ] Title, focus area, difficulty
  - [ ] Progress bar (% complete based on KRs)
  - [ ] Assigned managers count ("2 managers working on this")
  - [ ] "View Details" button → expand card
  - [ ] Actions: Edit | Delete | Duplicate
- [ ] UI: "+ Create Custom Objective" button
  - [ ] Opens manual objective creation form
- [ ] Feature: Search objectives by keyword
- [ ] Feature: Sort by progress, difficulty, focus area
- [ ] API integration: GET `/api/okr/:companyId`
- [ ] API integration: POST `/api/okr` (create custom)
- [ ] API integration: PUT `/api/okr/:id`
- [ ] API integration: DELETE `/api/okr/:id`

---

**Manager Planning Screens (3 screens):**

**15. `manager_01_planning_dashboard.html`** ⭐
- [ ] UI: Three-column layout

  **Left Column: Available OKRs**
  - [ ] List of company objectives (from owner)
  - [ ] Checkbox per objective
  - [ ] "Select for my team" action
  - [ ] Filter by focus area
  - [ ] Shows: Title, rationale summary, KRs count

  **Center Column: My Team's OKRs**
  - [ ] Selected objectives
  - [ ] Per-objective:
    - [ ] Title
    - [ ] Key Results with task breakdown
    - [ ] Assign tasks to team members (dropdown)
    - [ ] Set due dates
    - [ ] "+ AI Suggest Tasks" button (calls OpenAI)

  **Right Column: My Team**
  - [ ] Team member cards
  - [ ] Shows: Name, role, capacity indicator
  - [ ] Current task count
  - [ ] "+ Add Team Member" button

- [ ] Feature: Drag-drop OKRs from Available to My Team
- [ ] Feature: AI task suggestion per KR
  - [ ] Calls OpenAI: "Break down this KR into 5-7 tasks"
  - [ ] Manager can edit suggestions
- [ ] Feature: Capacity warning if over-assigning
  - [ ] "John is assigned 8 tasks (80% capacity)"
- [ ] API integration: GET `/api/okr/:companyId` (available objectives)
- [ ] API integration: POST `/api/manager/select-okr`
- [ ] API integration: POST `/api/tasks` (create tasks)
- [ ] API integration: GET `/api/manager/team/:managerId`

**16. `manager_02_add_team_member.html`**
- [ ] UI: Form to add team member
  - [ ] Email input
  - [ ] Role: Employee (default) | Manager (sub-manager)
  - [ ] Function dropdown (Sales, Marketing, etc.)
  - [ ] Skills/expertise (optional multi-select)
  - [ ] "Send Invitation" button
- [ ] UI: Or: Select from existing company users
  - [ ] Dropdown of users not yet on this team
  - [ ] "Add to Team" button (no email needed)
- [ ] Feature: Bulk add (CSV upload)
- [ ] API integration: POST `/api/manager/add-member`
- [ ] Redirect to: `manager_01_planning_dashboard.html`

**17. `manager_03_task_assignment.html`**
- [ ] UI: Detailed task assignment interface
- [ ] UI: Per-KR section:
  - [ ] KR description, baseline, target
  - [ ] Task list (editable table)
    - [ ] Columns: Task, Assigned To, Due Date, Status
    - [ ] "+ Add Task" row
    - [ ] AI suggestions displayed as draft tasks
- [ ] UI: Gantt chart view (optional, nice-to-have)
  - [ ] Timeline visualization
  - [ ] Dependencies between tasks
- [ ] Feature: Template library for common tasks
  - [ ] "Hire someone" → generates typical hiring tasks
  - [ ] "Launch marketing campaign" → generates campaign tasks
- [ ] API integration: GET `/api/okr/:id/tasks`
- [ ] API integration: POST `/api/tasks`
- [ ] API integration: PUT `/api/tasks/:id`
- [ ] API integration: DELETE `/api/tasks/:id`

---

### **SPRINT 3: EXECUTION DASHBOARDS & TASK MANAGEMENT** (Weeks 5-6)

**Daily Dashboard Screens (3 screens):**

**18. `dashboard_owner.html`** ⭐
- [ ] UI: Hero section - Business Health
  - [ ] 3 large gauges: Speed, Strength, Intelligence
  - [ ] Trend arrows (↗️↘️) compared to last assessment
  - [ ] Overall health score
  - [ ] "Retake Assessment" button
- [ ] UI: OKR Progress section
  - [ ] Grid of active objectives
  - [ ] Progress bars per objective
  - [ ] At-risk indicators (⚠️ if <50% progress and <30 days left)
  - [ ] "2 objectives need attention" alert
- [ ] UI: Team Overview section
  - [ ] Function breakdown (Sales 78%, Marketing 65%, Product 82%)
  - [ ] Top performers recognition
  - [ ] Team health indicator
- [ ] UI: My Tasks Today (if owner has personal tasks)
  - [ ] Top 3 tasks
  - [ ] Quick complete checkboxes
- [ ] Feature: Date range selector (This Week | This Month | This Quarter)
- [ ] Feature: Export dashboard to PDF
- [ ] API integration: GET `/api/dashboard/owner/:companyId`
- [ ] API integration: GET `/api/assessment/latest/:companyId`
- [ ] API integration: GET `/api/okr/:companyId/progress`

**19. `dashboard_manager.html`** ⭐
- [ ] UI: My Team Progress section
  - [ ] Overall team completion rate (78%)
  - [ ] Velocity trend chart (tasks completed per week)
  - [ ] Team morale indicator
- [ ] UI: Action Queue (top priority)
  - [ ] "5 items need your attention"
  - [ ] List:
    - [ ] "Approve Sarah's completed task"
    - [ ] "Check in with John (task overdue)"
    - [ ] "Assign new tasks for next sprint"
  - [ ] Quick action buttons per item
- [ ] UI: My Tasks Today
  - [ ] Top 3 tasks for manager
  - [ ] Mix of personal work + team management tasks
- [ ] UI: Team Member Status Cards
  - [ ] Per-person mini-card
  - [ ] Name, current task, progress indicator
  - [ ] Capacity utilization (🟢🟡🔴)
  - [ ] Click to see details
- [ ] Feature: Filter team by function
- [ ] Feature: Sort by "Needs attention" first
- [ ] API integration: GET `/api/dashboard/manager/:managerId`
- [ ] API integration: GET `/api/manager/team/:managerId/progress`
- [ ] API integration: GET `/api/manager/action-queue/:managerId`

**20. `dashboard_employee.html`** ⭐
- [ ] UI: My 3 Tasks Today (primary focus)
  - [ ] Large, prominent cards
  - [ ] Per-task:
    - [ ] Title, description
    - [ ] Why it matters (KR context)
    - [ ] Linked to which objective
    - [ ] Due date
    - [ ] Estimated time
    - [ ] "Mark Complete" button
    - [ ] "Request Help" button
- [ ] UI: My Progress section
  - [ ] Tasks completed this week (8 of 10)
  - [ ] Contributing to 2 objectives
  - [ ] Personal velocity chart
- [ ] UI: Recognition section
  - [ ] Recent achievements
  - [ ] Badges/awards (if applicable)
  - [ ] 🏆 "Fast Delivery" recognition
- [ ] UI: Upcoming section
  - [ ] Next week's tasks preview
  - [ ] Deadlines calendar view
- [ ] Feature: Task prioritization (drag-drop your 3 tasks)
- [ ] Feature: Time tracking (start timer when working)
- [ ] API integration: GET `/api/dashboard/employee/:userId`
- [ ] API integration: GET `/api/tasks/my-tasks/:userId`
- [ ] API integration: PUT `/api/tasks/:id/complete`

---

**Task Management Screens (2 screens):**

**21. `my_objectives.html`**
- [ ] UI: All my assigned objectives
- [ ] UI: Per-objective card:
  - [ ] Title, focus area, difficulty
  - [ ] Progress bar (KRs completion)
  - [ ] Timeline: Start date → Target date
  - [ ] My role: Owner | Contributor
  - [ ] Key Results list:
    - [ ] Description, metric, baseline, target, current progress
    - [ ] My tasks under this KR
  - [ ] Expand/collapse for details
- [ ] UI: Filters:
  - [ ] Status: Active | Completed | At Risk
  - [ ] My role: Owner | Contributor
  - [ ] Timeframe: This Quarter | Next Quarter
- [ ] Feature: Search by keyword
- [ ] Feature: Sort by progress, deadline
- [ ] API integration: GET `/api/objectives/my-objectives/:userId`
- [ ] API integration: GET `/api/objectives/:id/details`

**22. `task_detail.html`**
- [ ] UI: Task details page
  - [ ] Title (large)
  - [ ] Description (rich text)
  - [ ] Context section:
    - [ ] "This task contributes to:"
    - [ ] KR: "Hire 3 senior specialists" (50% progress)
    - [ ] Objective: "Build High-Performance Team"
    - [ ] Business Impact: "Addresses team capability gap (62/100 score)"
  - [ ] Metadata:
    - [ ] Assigned to: Me
    - [ ] Created by: Sarah (Manager)
    - [ ] Due date: Oct 25, 2025
    - [ ] Estimated time: 3 hours
    - [ ] Status: In Progress
  - [ ] Attachments/links section
  - [ ] Comments thread (team collaboration)
- [ ] UI: Actions:
  - [ ] "Mark Complete" button (primary)
  - [ ] "Request Help" button
  - [ ] "Defer" button (reschedule)
  - [ ] "Add Comment" button
- [ ] UI: Impact visualization
  - [ ] "Completing this will move KR to 60% progress"
  - [ ] "2 other team members waiting on this"
- [ ] Feature: Task timer (track time spent)
- [ ] Feature: File upload (attach deliverables)
- [ ] API integration: GET `/api/tasks/:id`
- [ ] API integration: PUT `/api/tasks/:id/complete`
- [ ] API integration: POST `/api/tasks/:id/comments`
- [ ] API integration: POST `/api/tasks/:id/request-help`

---

### **SPRINT 4: INTEGRATION & TESTING** (Week 7)

**End-to-End Testing:**
- [ ] Owner flow: Signup → Assessment → OKR generation → Invite team
- [ ] Manager flow: Register → Assessment → Select OKRs → Assign tasks
- [ ] Employee flow: Register → Assessment → View tasks → Complete tasks
- [ ] Consultant flow: Add company → Customize template → View progress
- [ ] Cross-role interactions: Owner invites manager, manager assigns to employee
- [ ] Multi-company switching (consultant)

**Bug Fixes:**
- [ ] Fix any UI/UX issues found in testing
- [ ] Fix API errors or edge cases
- [ ] Performance optimization (slow queries, large data loads)
- [ ] Security audit (authentication, authorization, data access)

**Data Migration:**
- [ ] Migrate any existing goaltracker data (if applicable)
- [ ] Seed production database with 6 assessment templates
- [ ] Create sample companies for demo purposes

**Documentation:**
- [ ] User guides for each role (Owner, Manager, Employee, Consultant)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide (Docker, environment variables)
- [ ] Troubleshooting guide

---

### **SPRINT 5: LAUNCH PREPARATION** (Week 8)

**Beta User Onboarding:**
- [ ] Identify 10 beta companies
- [ ] Onboard 3 consultants with multi-company access
- [ ] Provide onboarding support (video calls, documentation)
- [ ] Collect feedback and prioritize fixes

**Marketing Materials:**
- [ ] Landing page with product video
- [ ] Feature comparison chart (vs. competitors)
- [ ] Case studies (beta companies)
- [ ] Blog post: "Introducing Karvia Business"

**Production Deployment:**
- [ ] Set up production environment (AWS/GCP/Render)
- [ ] Configure domain and SSL certificate
- [ ] Set up monitoring (Sentry for errors, Google Analytics for usage)
- [ ] Backup strategy (automated daily backups)
- [ ] Disaster recovery plan

**Go-Live:**
- [ ] Soft launch (invite-only for beta users)
- [ ] Monitor for critical bugs (first 48 hours)
- [ ] Public launch announcement (Nov 30, 2025)
- [ ] Post-launch support (dedicated Slack channel)

---

## 📚 BACKLOG TODOS (Post-MVP Features)

### **🔬 ADVANCED ASSESSMENT FEATURES**

**Template Marketplace:**
- [ ] Design template marketplace UI
- [ ] Implement consultant template publishing
- [ ] Rating and review system for templates
- [ ] Revenue sharing model (80/20 split)
- [ ] Payment integration (Stripe)
- [ ] Template versioning and updates
- [ ] Template categories and tags
- [ ] Featured templates section

**Assessment Enhancements:**
- [ ] Assessment comparison over time (trend charts)
- [ ] Export assessment results to PDF
- [ ] Scheduled recurring assessments (quarterly auto-send)
- [ ] Team assessment vs. individual assessment comparison
- [ ] Anonymous assessment option (for sensitive topics)
- [ ] Assessment branching logic (conditional questions)
- [ ] Multimedia questions (images, videos)

---

### **🤖 AI & INTELLIGENCE**

**Advanced OKR Generation:**
- [ ] Multi-objective dependency detection
- [ ] Scenario planning (what-if analysis)
- [ ] Competitive benchmarking (industry data)
- [ ] OKR quality scoring (are these good OKRs?)
- [ ] Historical performance prediction (likelihood of success)

**AI Copilot Features:**
- [ ] Daily AI briefing (what to focus on today)
- [ ] AI-powered task prioritization
- [ ] Meeting agenda generator (based on OKRs)
- [ ] Weekly recap email (AI-written)
- [ ] Risk prediction (which OKRs are at risk?)

---

### **📊 ANALYTICS & REPORTING**

**Executive Analytics Dashboard:**
- [ ] Business health trends over time
- [ ] OKR velocity (completion rate)
- [ ] Team performance by function
- [ ] Custom report builder
- [ ] Export to Excel/PowerPoint
- [ ] Scheduled email reports (weekly digest)

**Manager Analytics:**
- [ ] Team capacity planning
- [ ] Burnout risk detection
- [ ] Individual contributor performance
- [ ] Team collaboration metrics
- [ ] Task completion velocity

**Company-Wide Reports:**
- [ ] Quarterly OKR review reports
- [ ] Alignment score (how aligned is the company?)
- [ ] Focus area progress (which areas improved most?)
- [ ] Investment ROI (effort vs. impact)

---

### **🔗 INTEGRATIONS**

**Communication Tools:**
- [ ] Slack integration (daily task reminders)
- [ ] Microsoft Teams integration
- [ ] Email notifications (customizable)
- [ ] Push notifications (mobile app)

**Productivity Tools:**
- [ ] Google Workspace (Calendar, Drive)
- [ ] Microsoft 365 (Outlook, OneDrive)
- [ ] Notion (sync OKRs to Notion)
- [ ] Asana/Jira (task sync)

**Data & BI Tools:**
- [ ] Tableau connector
- [ ] Power BI integration
- [ ] Google Data Studio
- [ ] Custom API webhooks

---

### **📱 MOBILE EXPERIENCE**

**Mobile Apps:**
- [ ] React Native setup
- [ ] iOS app development
- [ ] Android app development
- [ ] Push notifications
- [ ] Offline mode (sync when online)
- [ ] Mobile-optimized dashboards
- [ ] Quick task completion (swipe gestures)

**Progressive Web App:**
- [ ] PWA configuration
- [ ] Install prompt
- [ ] Offline support
- [ ] Home screen icon

---

### **🎨 UX ENHANCEMENTS**

**Personalization:**
- [ ] Dark mode
- [ ] Custom themes (company branding)
- [ ] Dashboard layout customization
- [ ] Keyboard shortcuts
- [ ] Quick actions menu (Cmd+K)

**Collaboration Features:**
- [ ] Real-time collaboration (multiple users editing)
- [ ] Comments on objectives and tasks
- [ ] @mentions and notifications
- [ ] Activity feed (what's happening across the company)
- [ ] Kudos/recognition system

**Gamification:**
- [ ] Achievement badges
- [ ] Leaderboards (team performance)
- [ ] Streak tracking (consecutive days working)
- [ ] Points system
- [ ] Rewards/incentives

---

### **🔐 SECURITY & COMPLIANCE**

**Advanced Security:**
- [ ] Two-factor authentication (2FA)
- [ ] Single Sign-On (SSO) - SAML/OAuth
- [ ] IP whitelisting
- [ ] Session management
- [ ] Audit logs (who did what, when)

**Compliance:**
- [ ] GDPR compliance (data export, deletion)
- [ ] SOC 2 certification
- [ ] HIPAA compliance (healthcare clients)
- [ ] Data residency options (EU, US, Asia)

---

### **💼 ENTERPRISE FEATURES**

**Multi-Tenant Management:**
- [ ] Dedicated consultant portal
- [ ] White-label configuration (logo, colors)
- [ ] Custom domain per company
- [ ] Advanced permissions (custom roles)
- [ ] Organizational hierarchy (departments, divisions)

**Billing & Subscriptions:**
- [ ] Subscription plans (Starter, Professional, Enterprise)
- [ ] Usage-based pricing (per assessment, per OKR generation)
- [ ] Invoicing system
- [ ] Payment portal
- [ ] Free trial (14 days)

**Support & Success:**
- [ ] In-app chat support
- [ ] Dedicated account manager (Enterprise)
- [ ] Onboarding concierge service
- [ ] Training webinars
- [ ] Help center with articles/videos

---

### **🌍 INTERNATIONALIZATION**

**Multi-Language Support:**
- [ ] Spanish translation
- [ ] French translation
- [ ] German translation
- [ ] Chinese translation
- [ ] Right-to-left language support (Arabic, Hebrew)
- [ ] Language selector in settings

**Localization:**
- [ ] Regional date/time formats
- [ ] Currency localization
- [ ] Cultural adaptations (examples, templates)

---

## 🎯 BACKLOG PRIORITIZATION (Post-MVP)

### **High Priority (Weeks 9-12):**
1. Executive Analytics Dashboard (2 weeks)
2. Slack + Teams Integration (2 weeks)
3. Template Marketplace MVP (2 weeks)
4. Mobile-Responsive Improvements (1 week)

### **Medium Priority (Weeks 13-20):**
1. Mobile Native Apps (4 weeks)
2. Advanced AI Copilot Features (2 weeks)
3. White-Label Configuration (2 weeks)

### **Low Priority (Weeks 21+):**
1. Gamification System
2. Multi-Language Support
3. Advanced Compliance (HIPAA, SOC 2)

---

## 📅 KEY MILESTONES

- **Week 2**: Sprint 1 Complete (Assessment framework + user onboarding)
- **Week 4**: Sprint 2 Complete (OKR generation + manager planning)
- **Week 6**: Sprint 3 Complete (Dashboards + task management)
- **Week 7**: Integration & Testing Complete
- **Week 8**: Launch Preparation Complete
- **Nov 30, 2025**: 🚀 **MVP LAUNCH**
- **Dec 31, 2025**: 10 paying companies + 3 consultants

---

## ✅ DEFINITION OF DONE (Per Feature)

**A feature is "Done" when:**
- [ ] Code is written and peer-reviewed
- [ ] Unit tests pass (80%+ coverage)
- [ ] Integration tests pass
- [ ] UI is responsive (desktop + mobile)
- [ ] API documentation updated
- [ ] User guide section written
- [ ] Deployed to staging and tested
- [ ] Product owner approval
- [ ] No critical bugs

---

**Document Owner**: Development Team
**Last Updated**: October 1, 2025
**Next Review**: Weekly during sprints
