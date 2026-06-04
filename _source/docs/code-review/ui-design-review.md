# UI Design Review — Assessment Template Experience

**Purpose:** Define the expected UX for Assessment setup so designers and engineers implement a consistent, shareable template flow for consultants, executives, and managers in organisations ranging from 10 to 200 employees.

## Entry Scenario
- User (consultant, executive, or manager) signs in and navigates to **Assessment**.
- System recognises org context (business units, teams, employees) and presents template options.

## Template Library Structure
1. **Category Selector:** Tabs/pills for Speed ⚡, Strength 🛡️, Intelligence 🧠.
2. **Role Bundles:** Within each category, curated questions sets for Consultant, Executive, Manager perspectives.
3. **Question Explorer:** Expandable cards showing sample questions, difficulty, estimated completion time.
4. **Customise:** Ability to drag/drop, duplicate, or author new questions; tagging by competency and org level.

## Sharing & Scope Controls
- **Distribution Targets:**
  - Team (e.g., Revenue Growth Team)
  - Business Unit / Department
  - Company-wide (all employees)
- **Role Visibility:** Option to send specific sections to executives/managers/employees while keeping core metrics consistent.
- **Scheduling:** Start/end dates, reminders, optional recurring cadence.

## Employee Context Mapping
- Each employee belongs to `Organisation → Business Unit → Team`.
- UI should display counts (e.g., “Marketing • 24 members”) and allow quick selection.
- Confirmation screen summarises recipients and S/S/I weightings.

## Key UX Requirements
- One-click preview of assessment as seen by employees.
- Progress indicator when responses start arriving (live status per team).
- Accessibility: keyboard navigation, readable contrast, screen reader labels.
- Responsive design for managers reviewing on tablets.

## Acceptance Criteria Summary
- Template list loads with S/S/I filters and role bundles.
- Sharing dialog supports team/company-wide targeting, with validation for empty groups.
- Post-launch dashboard reflects participation metrics and allows reassigning stragglers.
- No hard-coded questions; templates fetched from configuration service.

## References
- Mockups: `Karvia_OKR_Mockups/unified_design/manager/assessment.html`
- Product Plan: `Karvia_OKR_Product_Planning/product_plan_beta1.0.md`
- User Stories: `docs/Karvia_OKR_User_Stories.md`
