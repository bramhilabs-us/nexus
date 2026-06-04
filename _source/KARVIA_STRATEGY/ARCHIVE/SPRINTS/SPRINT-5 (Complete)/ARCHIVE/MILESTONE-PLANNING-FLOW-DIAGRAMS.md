# Milestone-Based Planning - Visual Flow Diagrams
**Date**: November 25, 2025
**Epic**: Sprint 5 - Epic 0
**Purpose**: Complete visual specification of user flows, data flows, and system architecture

---

## 📊 Table of Contents
1. [User Journey Flow](#1-user-journey-flow)
2. [Screen-by-Screen Wireframes](#2-screen-by-screen-wireframes)
3. [Data Flow Diagram](#3-data-flow-diagram)
4. [API Flow Sequence](#4-api-flow-sequence)
5. [State Transition Diagram](#5-state-transition-diagram)
6. [Component Hierarchy](#6-component-hierarchy)
7. [Database Schema Visualization](#7-database-schema-visualization)

---

## 1. User Journey Flow

### Complete End-to-End Flow
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY: CREATE MILESTONE PLAN                  │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: Navigate to Planning Page
┌──────────────────────────┐
│  User clicks "Planning"  │
│  in main navigation      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│  Planning Page Loads                                      │
│  • Shows all objectives in tabs                          │
│  • First objective auto-selected                         │
│  • Shows Key Results for selected objective              │
│  • Milestones section hidden (no KR selected yet)        │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 2: Select Objective
┌──────────────────────────────────────────────────────────┐
│  Objective Tabs                                          │
│  ┌──────────────────────────────────────────┐           │
│  │ [📈 Foster Culture] [⚡ Boost Speed] ... │           │
│  └──────────────────────────────────────────┘           │
│  User clicks on desired objective tab                    │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 3: View Key Results for Objective
┌──────────────────────────────────────────────────────────┐
│  Key Results Grid                                        │
│  ┌─────────────────────────────────────────┐            │
│  │ KR 1.1: Enroll in 1 online course      │            │
│  │ Progress: 0/1 | Status: Not Planned    │            │
│  │ 0 milestones                            │            │
│  └─────────────────────────────────────────┘            │
│  ┌─────────────────────────────────────────┐            │
│  │ KR 1.2: Share 3 key learnings          │            │
│  │ Progress: 1/3 | Status: In Progress    │            │
│  │ 2 milestones                            │            │
│  └─────────────────────────────────────────┘            │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 4: Select Key Result
┌──────────────────────────────────────────────────────────┐
│  User clicks on KR 1.1 card                              │
│  • Card gets highlighted border (blue glow)              │
│  • Scroll animation to milestones section               │
│  • Milestones section becomes visible                    │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 5: Milestones Section Appears
┌──────────────────────────────────────────────────────────┐
│  📍 Milestones for: Enroll in 1 online course by Q1     │
│  ┌────────────────────────────────────────────┐         │
│  │  No milestones yet                         │         │
│  │  📅 Click "Create New Plan" to get started │         │
│  └────────────────────────────────────────────┘         │
│  [✨ Create New Plan]                                    │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 6: Open Planning Modal
┌──────────────────────────────────────────────────────────┐
│  Modal: Create Milestone Plan                           │
│  ┌────────────────────────────────────────────┐         │
│  │ Generate AI-powered weekly milestones      │         │
│  │ for: Enroll in 1 online course by Q1       │         │
│  │                                             │         │
│  │ How many weeks? [3] ▼                      │         │
│  │ (Choose 1-12 weeks)                        │         │
│  │                                             │         │
│  │ Start Date: [2025-01-01] 📅               │         │
│  │                                             │         │
│  │ [Cancel] [✨ Generate Plan]                │         │
│  └────────────────────────────────────────────┘         │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 7: User Configures Plan
┌──────────────────────────────────────────────────────────┐
│  User selects:                                           │
│  • Weeks: 3 weeks                                        │
│  • Start: January 1, 2025                               │
│  • Clicks "Generate Plan"                                │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 8: AI Generation (Loading State)
┌──────────────────────────────────────────────────────────┐
│  Loading Overlay                                         │
│  ┌────────────────────────────────────────────┐         │
│  │  ⏳ Generating your plan with AI...        │         │
│  │  [████████████░░░░░░] 70%                  │         │
│  │                                             │         │
│  │  Analyzing Key Result...                   │         │
│  │  Generating milestones...                  │         │
│  │  Creating action items...                  │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  Backend Process:                                        │
│  1. Fetch KR and Objective details                      │
│  2. Build company context (SSI, teams, etc.)            │
│  3. Call OpenAI API with structured prompt              │
│  4. Parse AI response                                    │
│  5. Calculate date ranges                               │
│  6. Save to database                                     │
│  Time: 2-5 seconds                                       │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 9: Plan Generated Successfully
┌──────────────────────────────────────────────────────────┐
│  Success Toast                                           │
│  ✅ 3 milestones created successfully!                   │
│                                                          │
│  Modal closes automatically                              │
│  Page scrolls to show milestone cards                    │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 10: View Generated Milestones
┌──────────────────────────────────────────────────────────────────────┐
│  📍 Milestones for: Enroll in 1 online course by Q1                 │
│  3-week plan to achieve this Key Result                             │
│                                                                      │
│  ┌─────────────────────────────────────────────────────┐            │
│  │ Week 1 | Research and select suitable online course │            │
│  │ Jan 1 - Jan 7, 2025                                 │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ ☐ Research top 5 online learning platforms          │            │
│  │ ☐ Compare course options in target skill area       │            │
│  │ ☐ Read reviews and check instructor credentials     │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ Progress: 0/3 | Status: Not Started | [Edit] [Del]  │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                      │
│  ┌─────────────────────────────────────────────────────┐            │
│  │ Week 2 | Complete enrollment and initial setup      │            │
│  │ Jan 8 - Jan 14, 2025                                │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ ☐ Purchase selected course                          │            │
│  │ ☐ Set up learning schedule                          │            │
│  │ ☐ Complete profile and onboarding                   │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ Progress: 0/3 | Status: Not Started | [Edit] [Del]  │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                      │
│  ┌─────────────────────────────────────────────────────┐            │
│  │ Week 3 | Begin coursework and establish routine     │            │
│  │ Jan 15 - Jan 21, 2025                               │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ ☐ Complete first module                             │            │
│  │ ☐ Join course community/forum                       │            │
│  │ ☐ Schedule weekly study blocks                      │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ Progress: 0/3 | Status: Not Started | [Edit] [Del]  │            │
│  └─────────────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────────────┘
             │
             ▼
Step 11: Track Progress (Week 1 - User working on tasks)
┌──────────────────────────────────────────────────────────────────────┐
│  Week 1 Milestone                                                    │
│  ┌─────────────────────────────────────────────────────┐            │
│  │ Week 1 | Research and select suitable online course │            │
│  │ Jan 1 - Jan 7, 2025                                 │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ ✅ Research top 5 online learning platforms [DONE]  │            │
│  │ ☐ Compare course options in target skill area       │            │
│  │ ☐ Read reviews and check instructor credentials     │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ Progress: 1/3 (33%) | Status: In Progress 🟠        │            │
│  │ [████████░░░░░░░░░░░░░░░░] 33%                      │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                      │
│  User clicks checkbox → Action item marked complete                 │
│  • Checkmark appears                                                │
│  • Progress bar updates                                             │
│  • Status changes to "In Progress"                                  │
│  • Backend updates database                                         │
└──────────────────────────────────────────────────────────────────────┘
             │
             ▼
Step 12: Complete All Tasks (Week 1 Complete)
┌──────────────────────────────────────────────────────────────────────┐
│  Week 1 Milestone - COMPLETED                                       │
│  ┌─────────────────────────────────────────────────────┐            │
│  │ Week 1 | Research and select suitable online course │            │
│  │ Jan 1 - Jan 7, 2025                                 │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ ✅ Research top 5 online learning platforms ✓       │            │
│  │ ✅ Compare course options in target skill area ✓    │            │
│  │ ✅ Read reviews and check instructor credentials ✓  │            │
│  │ ─────────────────────────────────────────────────── │            │
│  │ Progress: 3/3 (100%) | Status: Completed ✅         │            │
│  │ [████████████████████████] 100%                     │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                      │
│  All tasks checked → Milestone auto-completes                       │
│  • Green background                                                 │
│  • Completed badge                                                  │
│  • KR progress updates (0% → 33%)                                   │
└──────────────────────────────────────────────────────────────────────┘
             │
             ▼
Step 13: Edit Milestone (Optional)
┌──────────────────────────────────────────────────────────┐
│  User clicks [Edit] button on Week 2 milestone           │
│  • Modal opens with current values                       │
│  • User can update milestone title                       │
│  • User can add/remove/edit action items                │
│  • User can change dates                                 │
│  • Saves changes to database                             │
└────────────┬─────────────────────────────────────────────┘
             │
             ▼
Step 14: Delete Milestone (Optional)
┌──────────────────────────────────────────────────────────┐
│  User clicks [Delete] button on Week 3 milestone         │
│  ┌────────────────────────────────────────────┐         │
│  │ ⚠️  Delete Milestone?                      │         │
│  │                                             │         │
│  │ This will permanently delete Week 3        │         │
│  │ milestone and all its action items.        │         │
│  │                                             │         │
│  │ [Cancel] [Delete]                          │         │
│  └────────────────────────────────────────────┘         │
│  • User confirms deletion                                │
│  • Milestone soft-deleted (status='cancelled')          │
│  • Card disappears from view                            │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              JOURNEY COMPLETE                                │
│  User has successfully created, tracked, and managed milestone-based plan   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Screen-by-Screen Wireframes

### Screen 1: Planning Page - Initial State (No KR Selected)
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  KARVIA Business - Planning                                      [👤 User] ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  [Dashboard] [Objectives] [Assessments] [Teams] [Planning]                ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  SELECT YOUR OBJECTIVE                                                │ ║
║  │  ┌────────────────┬────────────────┬────────────────┬──────────────┐ │ ║
║  │  │ 📈 Foster      │ ⚡ Boost       │ 👥 Enhance    │ 📊 Improve   │ │ ║
║  │  │ Culture of     │ Operational   │ Team          │ Operational  │ │ ║
║  │  │ Learning       │ Speed         │ Intelligence  │ Strength     │ │ ║
║  │  │ [SELECTED]     │               │               │              │ │ ║
║  │  └────────────────┴────────────────┴────────────────┴──────────────┘ │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  KEY RESULTS FOR: 📈 Foster Culture of Continuous Learning           │ ║
║  │                                                                       │ ║
║  │  ┌───────────────────────────────────────────────────────────────┐  │ ║
║  │  │  KR 1.1                                                        │  │ ║
║  │  │  Enroll in 1 online course by Q1                              │  │ ║
║  │  │  ────────────────────────────────────────────────────────────  │  │ ║
║  │  │  Current: 0 | Target: 1                                       │  │ ║
║  │  │  [░░░░░░░░░░░░░░░░░░░░] 0%                                    │  │ ║
║  │  │  Status: 🔵 Not Planned | 0 milestones                        │  │ ║
║  │  │                                           [Click to select →] │  │ ║
║  │  └───────────────────────────────────────────────────────────────┘  │ ║
║  │                                                                       │ ║
║  │  ┌───────────────────────────────────────────────────────────────┐  │ ║
║  │  │  KR 1.2                                                        │  │ ║
║  │  │  Share 3 key learnings with the team by Q2                    │  │ ║
║  │  │  ────────────────────────────────────────────────────────────  │  │ ║
║  │  │  Current: 1 | Target: 3                                       │  │ ║
║  │  │  [████████░░░░░░░░░░░░] 33%                                   │  │ ║
║  │  │  Status: 🟠 In Progress | 2 milestones                        │  │ ║
║  │  │                                           [Click to select →] │  │ ║
║  │  └───────────────────────────────────────────────────────────────┘  │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  📍 MILESTONES                                                        │ ║
║  │  Select a Key Result above to view or create milestones              │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Screen 2: Planning Page - KR Selected (Shows Milestones)
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  KARVIA Business - Planning                                      [👤 User] ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  KEY RESULTS FOR: 📈 Foster Culture of Continuous Learning           │ ║
║  │                                                                       │ ║
║  │  ┌───────────────────────────────────────────────────────────────┐  │ ║
║  │  │  KR 1.1                                      [SELECTED ✓]     │  │ ║
║  │  │  Enroll in 1 online course by Q1                              │  │ ║
║  │  │  ────────────────────────────────────────────────────────────  │  │ ║
║  │  │  Current: 0 | Target: 1                                       │  │ ║
║  │  │  [░░░░░░░░░░░░░░░░░░░░] 0%                                    │  │ ║
║  │  │  Status: 🔵 Not Planned | 0 milestones                        │  │ ║
║  │  └───────────────────────────────────────────────────────────────┘  │ ║
║  │  ▲ Selected - Blue glow border                                      │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  📍 MILESTONES FOR: Enroll in 1 online course by Q1                  │ ║
║  │  Plan weekly milestones to achieve this Key Result                   │ ║
║  │                                                      [✨ Create Plan] │ ║
║  │  ────────────────────────────────────────────────────────────────    │ ║
║  │                                                                       │ ║
║  │  ┌────────────────────────────────────────────────────────────────┐ │ ║
║  │  │              📅 No milestones yet                              │ │ ║
║  │  │                                                                │ │ ║
║  │  │     Click "Create Plan" above to generate AI-powered          │ │ ║
║  │  │     weekly milestones for this Key Result                     │ │ ║
║  │  │                                                                │ │ ║
║  │  └────────────────────────────────────────────────────────────────┘ │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Screen 3: Planning Modal - Create Plan
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                       [Darkened Background]                                ║
║                                                                            ║
║         ┌────────────────────────────────────────────────────┐            ║
║         │  CREATE MILESTONE PLAN                        [×]  │            ║
║         ├────────────────────────────────────────────────────┤            ║
║         │                                                     │            ║
║         │  Generate AI-powered weekly milestones for:        │            ║
║         │  ┌───────────────────────────────────────────────┐ │            ║
║         │  │ 📌 Enroll in 1 online course by Q1           │ │            ║
║         │  └───────────────────────────────────────────────┘ │            ║
║         │                                                     │            ║
║         │  How many weeks do you need?                       │            ║
║         │  ┌─────────┐                                       │            ║
║         │  │    3    │ ▼  weeks                             │            ║
║         │  └─────────┘                                       │            ║
║         │  💡 Choose 1-12 weeks based on how long this KR   │            ║
║         │     will take to achieve                           │            ║
║         │                                                     │            ║
║         │  When should the plan start?                       │            ║
║         │  ┌──────────────────┐                             │            ║
║         │  │  2025-01-01  📅  │                             │            ║
║         │  └──────────────────┘                             │            ║
║         │                                                     │            ║
║         │  Preview:                                          │            ║
║         │  Week 1: Jan 1 - Jan 7, 2025                      │            ║
║         │  Week 2: Jan 8 - Jan 14, 2025                     │            ║
║         │  Week 3: Jan 15 - Jan 21, 2025                    │            ║
║         │                                                     │            ║
║         │  ┌───────────────────┐  ┌─────────────────────┐  │            ║
║         │  │     Cancel        │  │  ✨ Generate Plan   │  │            ║
║         │  └───────────────────┘  └─────────────────────┘  │            ║
║         └────────────────────────────────────────────────────┘            ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Screen 4: Loading State - AI Generation
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                       [Darkened Background]                                ║
║                                                                            ║
║         ┌────────────────────────────────────────────────────┐            ║
║         │  GENERATING YOUR PLAN                              │            ║
║         ├────────────────────────────────────────────────────┤            ║
║         │                                                     │            ║
║         │              ⏳ Please wait...                      │            ║
║         │                                                     │            ║
║         │  Analyzing your Key Result...                      │            ║
║         │  [████████████████████░░░░░] 80%                   │            ║
║         │                                                     │            ║
║         │  ✅ Context gathered                               │            ║
║         │  ✅ Company profile analyzed                       │            ║
║         │  ✅ SSI scores considered                          │            ║
║         │  🔄 Generating milestones with AI...               │            ║
║         │  ⏳ Creating action items...                       │            ║
║         │                                                     │            ║
║         │  This may take 3-5 seconds                         │            ║
║         │                                                     │            ║
║         └────────────────────────────────────────────────────┘            ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Screen 5: Planning Page - With Generated Milestones
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  KARVIA Business - Planning                                      [👤 User] ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  📍 MILESTONES FOR: Enroll in 1 online course by Q1                  │ ║
║  │  3-week plan to achieve this Key Result          [✨ Create Plan]    │ ║
║  │  ────────────────────────────────────────────────────────────────    │ ║
║  │                                                                       │ ║
║  │  ┌──────────────────────────────────────────────────────────────┐   │ ║
║  │  │ [Week 1]  Research and select suitable online course    [⚙️][🗑] │ ║
║  │  │ Jan 1 - Jan 7, 2025                                          │   │ ║
║  │  │ ──────────────────────────────────────────────────────────── │   │ ║
║  │  │ ☐  Research top 5 online learning platforms                 │   │ ║
║  │  │ ☐  Compare course options in target skill area              │   │ ║
║  │  │ ☐  Read reviews and check instructor credentials            │   │ ║
║  │  │ ──────────────────────────────────────────────────────────── │   │ ║
║  │  │ Progress: 0/3 | [░░░░░░░░░░░░░░░░░░░░] 0%                   │   │ ║
║  │  │ Status: 🔵 Not Started                                       │   │ ║
║  │  └──────────────────────────────────────────────────────────────┘   │ ║
║  │                                                                       │ ║
║  │  ┌──────────────────────────────────────────────────────────────┐   │ ║
║  │  │ [Week 2]  Complete enrollment and initial setup         [⚙️][🗑] │ ║
║  │  │ Jan 8 - Jan 14, 2025                                         │   │ ║
║  │  │ ──────────────────────────────────────────────────────────── │   │ ║
║  │  │ ☐  Purchase selected course                                  │   │ ║
║  │  │ ☐  Set up learning schedule                                  │   │ ║
║  │  │ ☐  Complete profile and onboarding                           │   │ ║
║  │  │ ──────────────────────────────────────────────────────────── │   │ ║
║  │  │ Progress: 0/3 | [░░░░░░░░░░░░░░░░░░░░] 0%                   │   │ ║
║  │  │ Status: 🔵 Not Started                                       │   │ ║
║  │  └──────────────────────────────────────────────────────────────┘   │ ║
║  │                                                                       │ ║
║  │  ┌──────────────────────────────────────────────────────────────┐   │ ║
║  │  │ [Week 3]  Begin coursework and establish routine        [⚙️][🗑] │ ║
║  │  │ Jan 15 - Jan 21, 2025                                        │   │ ║
║  │  │ ──────────────────────────────────────────────────────────── │   │ ║
║  │  │ ☐  Complete first module                                     │   │ ║
║  │  │ ☐  Join course community/forum                               │   │ ║
║  │  │ ☐  Schedule weekly study blocks                              │   │ ║
║  │  │ ──────────────────────────────────────────────────────────── │   │ ║
║  │  │ Progress: 0/3 | [░░░░░░░░░░░░░░░░░░░░] 0%                   │   │ ║
║  │  │ Status: 🔵 Not Started                                       │   │ ║
║  │  └──────────────────────────────────────────────────────────────┘   │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Screen 6: Progress Tracking - Week 1 In Progress
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ┌──────────────────────────────────────────────────────────────┐         ║
║  │ [Week 1]  Research and select suitable online course    [⚙️][🗑]       ║
║  │ Jan 1 - Jan 7, 2025                                          │         ║
║  │ ──────────────────────────────────────────────────────────── │         ║
║  │ ✅  Research top 5 online learning platforms           ✓     │         ║
║  │ ☐  Compare course options in target skill area              │         ║
║  │ ☐  Read reviews and check instructor credentials            │         ║
║  │ ──────────────────────────────────────────────────────────── │         ║
║  │ Progress: 1/3 | [████████░░░░░░░░░░░░] 33%                  │         ║
║  │ Status: 🟠 In Progress                                       │         ║
║  └──────────────────────────────────────────────────────────────┘         ║
║                                                                            ║
║  User clicked checkbox → Action item marked complete                      ║
║  • Item crossed out with checkmark                                        ║
║  • Progress bar updates to 33%                                            ║
║  • Status changes from "Not Started" to "In Progress"                     ║
║  • Backend API call: PUT /api/milestones/:id/action-items/0               ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### Screen 7: Milestone Completed
```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ┌──────────────────────────────────────────────────────────────┐         ║
║  │ [Week 1]  Research and select suitable online course    [⚙️][🗑]       ║
║  │ Jan 1 - Jan 7, 2025                                          │         ║
║  │ ──────────────────────────────────────────────────────────── │         ║
║  │ ✅  Research top 5 online learning platforms           ✓     │         ║
║  │ ✅  Compare course options in target skill area        ✓     │         ║
║  │ ✅  Read reviews and check instructor credentials      ✓     │         ║
║  │ ──────────────────────────────────────────────────────────── │         ║
║  │ Progress: 3/3 | [████████████████████████] 100%             │         ║
║  │ Status: ✅ Completed                                         │         ║
║  └──────────────────────────────────────────────────────────────┘         ║
║                                                                            ║
║  All tasks checked → Milestone auto-completes                             ║
║  • Green background/border                                                ║
║  • Completed badge (✅)                                                   ║
║  • KR progress updates on parent view                                     ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 3. Data Flow Diagram

### Complete System Data Flow
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MILESTONE PLANNING SYSTEM                          │
│                              DATA FLOW DIAGRAM                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   BROWSER    │
│   (Client)   │
└──────┬───────┘
       │
       │ 1. User clicks "Create Plan" on selected KR
       │    { key_result_id, weeks_count: 3, start_date }
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  API ENDPOINT: POST /api/milestones/generate                 │
│  • Authenticates user (JWT token)                            │
│  • Validates input (weeks 1-12, valid dates)                 │
│  • Checks RBAC (MANAGER+ role)                               │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 2. Calls MilestonePlannerService.generateMilestonePlan()
       │    { key_result_id, weeks_count, company_id, start_date }
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  MilestonePlannerService.generateMilestonePlan()             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Step 1: Fetch KR and Objective from database          │  │
│  │  → KeyResult.findById(key_result_id)                  │  │
│  │  → Objective.findById(keyResult.objective_id)         │  │
│  └────────────────────────────────────────────────────────┘  │
│                         │                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Step 2: Build context with company data               │  │
│  │  → Company.findById(company_id)                        │  │
│  │  → Assessment.find({ company_id })                     │  │
│  │  → Get SSI scores                                      │  │
│  │  → Get existing objectives                             │  │
│  │  → Get team structure                                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                         │                                     │
│                         ▼                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Step 3: Generate with AI or Template                  │  │
│  │                                                        │  │
│  │  IF FEATURE_OPENAI_ENABLED:                           │  │
│  │    ┌──────────────────────────────────────┐           │  │
│  │    │ OpenAI API Call                      │           │  │
│  │    │ Model: gpt-4o-mini                   │           │  │
│  │    │ Input: Structured prompt with:       │           │  │
│  │    │  • Company context                   │           │  │
│  │    │  • Objective title                   │           │  │
│  │    │  • KR title & target                 │           │  │
│  │    │  • SSI scores                        │           │  │
│  │    │  • Weeks count                       │           │  │
│  │    │ Output: JSON with milestones         │           │  │
│  │    └──────────────────────────────────────┘           │  │
│  │  ELSE:                                                 │  │
│  │    Use template-based generation                      │  │
│  └────────────────────────────────────────────────────────┘  │
│                         │                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Step 4: Calculate date ranges for each week           │  │
│  │  Week 1: start_date → start_date + 6 days             │  │
│  │  Week 2: start_date + 7 → start_date + 13 days        │  │
│  │  Week 3: start_date + 14 → start_date + 20 days       │  │
│  └────────────────────────────────────────────────────────┘  │
│                         │                                     │
│                         ▼                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Returns:                                               │  │
│  │ {                                                      │  │
│  │   milestones: [                                        │  │
│  │     {                                                  │  │
│  │       week: 1,                                         │  │
│  │       milestone: "Research and select course",         │  │
│  │       action_items: [...],                             │  │
│  │       dates: { start: Date, end: Date }                │  │
│  │     }                                                  │  │
│  │   ]                                                    │  │
│  │ }                                                      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 3. Returns plan to API endpoint
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  API ENDPOINT: Returns to client                             │
│  Response: { success: true, plan: {...} }                    │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 4. Client receives plan, displays in modal for review
       │
       ▼
┌──────────────┐
│   BROWSER    │
│   Shows plan │
└──────┬───────┘
       │
       │ 5. User clicks "Save Plan"
       │    POST /api/milestones/save
       │    { key_result_id, milestones: [...] }
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  API ENDPOINT: POST /api/milestones/save                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ For each milestone in array:                          │  │
│  │   const goal = new Goal({                             │  │
│  │     time_period: 'MILESTONE',                         │  │
│  │     key_result_id,                                    │  │
│  │     milestone_week: milestone.week,                   │  │
│  │     milestone_title: milestone.milestone,             │  │
│  │     action_items: milestone.action_items.map(...)     │  │
│  │     start_date: milestone.dates.start,                │  │
│  │     end_date: milestone.dates.end,                    │  │
│  │     company_id, owner_id, status: 'not_started'       │  │
│  │   });                                                 │  │
│  │   await goal.save();                                  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 6. Returns saved milestones
       │
       ▼
┌──────────────┐
│   BROWSER    │
│  Displays    │
│  milestones  │
└──────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       PROGRESS TRACKING DATA FLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

User checks action item checkbox
       │
       ▼
PUT /api/milestones/:id/action-items/:itemIndex
{ status: 'completed' }
       │
       ▼
Database Update:
Goal.findById(milestoneId)
milestone.action_items[itemIndex].status = 'completed'
milestone.action_items[itemIndex].completed_at = Date.now()
milestone.save()
       │
       ▼
Response: { success: true, milestone: {...} }
       │
       ▼
Frontend updates UI:
• Checkbox checked
• Progress bar updates
• Status badge updates
• If all items complete → milestone status = 'completed'
```

---

## 4. API Flow Sequence

### Sequence Diagram: Generate & Save Milestone Plan
```
User          Frontend        API Gateway      MilestonePlanner     OpenAI      Database
 │                │                │                   │              │            │
 │ Clicks        │                │                   │              │            │
 │ "Create Plan" │                │                   │              │            │
 │───────────────>│                │                   │              │            │
 │                │                │                   │              │            │
 │                │ Opens modal    │                   │              │            │
 │                │ User enters:   │                   │              │            │
 │                │ - 3 weeks      │                   │              │            │
 │                │ - start date   │                   │              │            │
 │                │                │                   │              │            │
 │ Clicks         │                │                   │              │            │
 │ "Generate"     │                │                   │              │            │
 │───────────────>│                │                   │              │            │
 │                │                │                   │              │            │
 │                │ POST /api/     │                   │              │            │
 │                │ milestones/    │                   │              │            │
 │                │ generate       │                   │              │            │
 │                │───────────────>│                   │              │            │
 │                │                │                   │              │            │
 │                │                │ Validate JWT      │              │            │
 │                │                │ Check RBAC        │              │            │
 │                │                │                   │              │            │
 │                │                │ Call service      │              │            │
 │                │                │──────────────────>│              │            │
 │                │                │                   │              │            │
 │                │                │                   │ Fetch KR     │            │
 │                │                │                   │──────────────────────────>│
 │                │                │                   │              │            │
 │                │                │                   │<─────────────────────────│
 │                │                │                   │   KR data    │            │
 │                │                │                   │              │            │
 │                │                │                   │ Fetch        │            │
 │                │                │                   │ Objective    │            │
 │                │                │                   │──────────────────────────>│
 │                │                │                   │              │            │
 │                │                │                   │<─────────────────────────│
 │                │                │                   │ Objective    │            │
 │                │                │                   │              │            │
 │                │                │                   │ Fetch        │            │
 │                │                │                   │ Company      │            │
 │                │                │                   │──────────────────────────>│
 │                │                │                   │              │            │
 │                │                │                   │<─────────────────────────│
 │                │                │                   │ Company data │            │
 │                │                │                   │              │            │
 │                │                │                   │ Build prompt │            │
 │                │                │                   │ with context │            │
 │                │                │                   │              │            │
 │                │                │                   │ Call OpenAI  │            │
 │                │                │                   │─────────────>│            │
 │                │                │                   │              │            │
 │                │                │                   │              │ Generate   │
 │                │                │                   │              │ milestones │
 │                │                │                   │              │ (2-5s)     │
 │                │                │                   │              │            │
 │                │                │                   │<─────────────│            │
 │                │                │                   │ AI response  │            │
 │                │                │                   │              │            │
 │                │                │                   │ Parse &      │            │
 │                │                │                   │ validate     │            │
 │                │                │                   │              │            │
 │                │                │                   │ Calculate    │            │
 │                │                │                   │ date ranges  │            │
 │                │                │                   │              │            │
 │                │                │<─────────────────│              │            │
 │                │                │ Return plan       │              │            │
 │                │                │                   │              │            │
 │                │<───────────────│                   │              │            │
 │                │ Plan JSON      │                   │              │            │
 │                │                │                   │              │            │
 │<───────────────│                │                   │              │            │
 │ Display plan   │                │                   │              │            │
 │                │                │                   │              │            │
 │ Reviews plan   │                │                   │              │            │
 │ Clicks "Save"  │                │                   │              │            │
 │───────────────>│                │                   │              │            │
 │                │                │                   │              │            │
 │                │ POST /api/     │                   │              │            │
 │                │ milestones/    │                   │              │            │
 │                │ save           │                   │              │            │
 │                │───────────────>│                   │              │            │
 │                │                │                   │              │            │
 │                │                │ For each          │              │            │
 │                │                │ milestone:        │              │            │
 │                │                │ Create Goal       │              │            │
 │                │                │──────────────────────────────────────────────>│
 │                │                │                   │              │ Save Goal  │
 │                │                │                   │              │            │
 │                │                │<─────────────────────────────────────────────│
 │                │                │                   │              │ Saved      │
 │                │                │                   │              │            │
 │                │<───────────────│                   │              │            │
 │                │ Success        │                   │              │            │
 │                │                │                   │              │            │
 │<───────────────│                │                   │              │            │
 │ Show success   │                │                   │              │            │
 │ Reload page    │                │                   │              │            │
 │                │                │                   │              │            │
 │                │ GET /api/      │                   │              │            │
 │                │ milestones/:kr │                   │              │            │
 │                │───────────────>│                   │              │            │
 │                │                │                   │              │            │
 │                │                │ Fetch milestones  │              │            │
 │                │                │──────────────────────────────────────────────>│
 │                │                │                   │              │            │
 │                │                │<─────────────────────────────────────────────│
 │                │                │                   │              │ Milestones │
 │                │                │                   │              │            │
 │                │<───────────────│                   │              │            │
 │                │ Milestones     │                   │              │            │
 │                │                │                   │              │            │
 │<───────────────│                │                   │              │            │
 │ Display        │                │                   │              │            │
 │ milestone      │                │                   │              │            │
 │ cards          │                │                   │              │            │
```

---

## 5. State Transition Diagram

### Milestone Status State Machine
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MILESTONE STATUS STATE MACHINE                           │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   NOT_STARTED    │ ◄────── Initial state after creation
                    │   (Blue badge)   │
                    └────────┬─────────┘
                             │
                             │ User checks first action item
                             │
                             ▼
                    ┌──────────────────┐
            ┌──────►│  IN_PROGRESS     │
            │       │  (Orange badge)  │
            │       └────────┬─────────┘
            │                │
            │                │ User checks another item
            │                │ (not all complete)
            │                │
            └────────────────┘
                             │
                             │ User checks LAST item
                             │ (all action items complete)
                             │
                             ▼
                    ┌──────────────────┐
                    │   COMPLETED      │ ◄────── Terminal state
                    │   (Green badge)  │          (can be uncompleted)
                    └────────┬─────────┘
                             │
                             │ User unchecks an item
                             │
                             ▼
                    ┌──────────────────┐
                    │  IN_PROGRESS     │
                    │  (Orange badge)  │
                    └──────────────────┘

Any state can transition to:
                    ┌──────────────────┐
                    │   CANCELLED      │ ◄────── Soft delete
                    │   (Hidden)       │          (user deletes milestone)
                    └──────────────────┘

State Determination Logic:
┌───────────────────────────────────────────────────────────────┐
│ if (all action items completed) → COMPLETED                   │
│ else if (any action item in_progress OR completed) → IN_PROGRESS
│ else → NOT_STARTED                                            │
└───────────────────────────────────────────────────────────────┘
```

### Action Item Status State Machine
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   ACTION ITEM STATUS STATE MACHINE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │     PENDING      │ ◄────── Initial state
                    │   (Unchecked)    │
                    └────────┬─────────┘
                             │
                             │ User checks checkbox
                             │
                             ▼
                    ┌──────────────────┐
            ┌──────►│   IN_PROGRESS    │ (optional state)
            │       │   (Partial done) │
            │       └────────┬─────────┘
            │                │
            │                │ Mark as done
            │                │
            │                ▼
            │       ┌──────────────────┐
            │       │    COMPLETED     │ ◄────── Terminal state
            │       │   (Checked ✓)    │
            │       └────────┬─────────┘
            │                │
            │                │ User unchecks checkbox
            │                │
            └────────────────┘

Simple Toggle Logic:
┌───────────────────────────────────────────────────────────────┐
│ if (checkbox checked) → COMPLETED                             │
│ else → PENDING                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 6. Component Hierarchy

### Frontend Component Tree
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PLANNING PAGE COMPONENT TREE                         │
└─────────────────────────────────────────────────────────────────────────────┘

PlanningPage
│
├─ Header
│  ├─ Breadcrumb
│  ├─ Page Title
│  └─ User Menu
│
├─ ObjectiveTabs
│  ├─ ObjectiveTab (foreach objective)
│  │  ├─ Icon
│  │  ├─ Title
│  │  └─ Selected State
│  └─ onClick → selectObjective()
│
├─ KeyResultsSection
│  ├─ Section Header
│  │  ├─ Title
│  │  └─ Subtitle
│  │
│  └─ KeyResultGrid
│     ├─ KeyResultCard (foreach KR)
│     │  ├─ KR Number (1.1, 1.2, etc.)
│     │  ├─ KR Title
│     │  ├─ Progress Bar
│     │  │  ├─ Progress Fill (dynamic width)
│     │  │  └─ Progress Text (0/1, 1/3, etc.)
│     │  ├─ Status Badge
│     │  │  └─ Status Text (Not Planned, In Progress, Completed)
│     │  ├─ Milestone Count
│     │  │  └─ Text: "X milestones"
│     │  └─ onClick → selectKR()
│     │
│     └─ State Management
│        ├─ selected (boolean)
│        └─ highlighted (CSS class)
│
├─ MilestonesSection (conditional: if KR selected)
│  ├─ Section Header
│  │  ├─ Title (shows selected KR title)
│  │  ├─ Subtitle
│  │  └─ CreatePlanButton
│  │     └─ onClick → openPlanningModal()
│  │
│  ├─ EmptyState (if no milestones)
│  │  ├─ Icon
│  │  ├─ Message
│  │  └─ CTA Text
│  │
│  └─ MilestoneGrid (if milestones exist)
│     └─ MilestoneCard (foreach milestone)
│        ├─ MilestoneHeader
│        │  ├─ WeekBadge (Week 1, 2, 3, etc.)
│        │  ├─ MilestoneTitle
│        │  ├─ DateRange (Jan 1-7, 2025)
│        │  └─ ActionButtons
│        │     ├─ EditButton → editMilestone()
│        │     └─ DeleteButton → deleteMilestone()
│        │
│        ├─ ActionItemsList
│        │  └─ ActionItem (foreach action item)
│        │     ├─ Checkbox
│        │     │  └─ onChange → toggleActionItem()
│        │     ├─ ItemText
│        │     └─ StatusBadge (✅ if completed)
│        │
│        └─ MilestoneFooter
│           ├─ ProgressInfo
│           │  ├─ ProgressBar
│           │  │  └─ ProgressFill (dynamic width)
│           │  └─ ProgressText (1/3 completed)
│           └─ StatusBadge
│              └─ Status Text (Not Started, In Progress, Completed)
│
├─ PlanningModal (overlay)
│  ├─ Modal Header
│  │  ├─ Title
│  │  └─ Close Button
│  │
│  ├─ Modal Body
│  │  ├─ KR Display (selected KR title)
│  │  ├─ WeeksInput
│  │  │  ├─ Label
│  │  │  ├─ Number Input (1-12)
│  │  │  └─ Help Text
│  │  ├─ StartDateInput
│  │  │  ├─ Label
│  │  │  └─ Date Picker
│  │  └─ PreviewSection
│  │     └─ Week Ranges (calculated)
│  │
│  └─ Modal Footer
│     ├─ CancelButton → closePlanningModal()
│     └─ GenerateButton → generatePlan()
│
└─ LoadingOverlay (during AI generation)
   ├─ LoadingSpinner
   ├─ LoadingMessage
   ├─ ProgressBar
   └─ Status Steps
      ├─ Step 1: Analyzing KR
      ├─ Step 2: Generating milestones
      └─ Step 3: Creating action items
```

### State Management Structure
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION STATE TREE                             │
└─────────────────────────────────────────────────────────────────────────────┘

milestonePlanner (global)
│
├─ state
│  ├─ objectives: Array<Objective>
│  ├─ selectedObjective: Objective | null
│  ├─ selectedKR: KeyResult | null
│  ├─ milestones: Array<Milestone>
│  ├─ loading: boolean
│  └─ error: string | null
│
├─ methods
│  ├─ loadObjectives()
│  ├─ selectObjective(id)
│  ├─ selectKR(id)
│  ├─ loadMilestones(krId)
│  ├─ openPlanningModal()
│  ├─ closePlanningModal()
│  ├─ generatePlan(weeks, startDate)
│  ├─ toggleActionItem(milestoneId, itemIndex)
│  ├─ editMilestone(id)
│  ├─ deleteMilestone(id)
│  └─ renderMilestones()
│
└─ helpers
   ├─ calculateProgress(milestone)
   ├─ getCompletedCount(milestone)
   ├─ getStatusColor(milestone)
   ├─ getStatusLabel(milestone)
   ├─ formatDateRange(start, end)
   └─ escapeHtml(text)
```

---

## 7. Database Schema Visualization

### Enhanced Goal Model
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GOAL (Milestone) MODEL                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  goals (collection)                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  _id: ObjectId                             [PRIMARY KEY]          │
│  time_period: String                       [ENUM: MILESTONE]      │
│  company_id: ObjectId ──────────┐          [REQUIRED, INDEXED]   │
│  key_result_id: ObjectId ───────┼─────┐    [REQUIRED, INDEXED]   │
│  milestone_week: Number         │     │    [REQUIRED]             │
│  milestone_title: String        │     │    [REQUIRED]             │
│  start_date: Date               │     │    [REQUIRED]             │
│  end_date: Date                 │     │    [REQUIRED]             │
│  owner_id: ObjectId ────────┐   │     │    [REQUIRED]             │
│  status: String              │   │     │    [ENUM: not_started,   │
│                              │   │     │     in_progress,         │
│                              │   │     │     completed,           │
│                              │   │     │     cancelled]           │
│                              │   │     │                          │
│  action_items: [             │   │     │    [ARRAY]               │
│    {                         │   │     │                          │
│      title: String,          │   │     │                          │
│      status: String,         │   │     │    [ENUM: pending,       │
│                              │   │     │     in_progress,         │
│                              │   │     │     completed]           │
│      estimated_hours: Number,│   │     │                          │
│      completed_at: Date,     │   │     │                          │
│      assigned_to: ObjectId   │   │     │                          │
│    }                         │   │     │                          │
│  ]                           │   │     │                          │
│                              │   │     │                          │
│  created_at: Date            │   │     │                          │
│  updated_at: Date            │   │     │                          │
│                              │   │     │                          │
└──────────────────────────────┼───┼─────┼──────────────────────────┘
                               │   │     │
                    ┌──────────┘   │     └──────────┐
                    │              │                │
                    ▼              ▼                ▼
         ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
         │   users      │  │  companies   │  │ key_results │
         ├─────────────┤  ├──────────────┤  ├─────────────┤
         │ _id         │  │ _id          │  │ _id         │
         │ name        │  │ name         │  │ title       │
         │ email       │  │ industry     │  │ target      │
         │ role        │  │ ...          │  │ ...         │
         └─────────────┘  └──────────────┘  └─────────────┘
```

### Relationship Diagram
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA MODEL RELATIONSHIPS                             │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌─────────────┐
     │  Company    │
     │  (Root)     │
     └──────┬──────┘
            │ 1
            │
            │ N
     ┌──────▼──────┐
     │  Objective  │
     │  (Annual)   │
     └──────┬──────┘
            │ 1
            │
            │ N (3-5)
     ┌──────▼──────┐
     │ Key Result  │
     │ (Measurable)│
     └──────┬──────┘
            │ 1
            │
            │ N (1-12 weeks)
     ┌──────▼─────────┐
     │  Milestone     │  ◄─── NEW: Goal with time_period='MILESTONE'
     │  (Weekly Plan) │
     └──────┬─────────┘
            │ 1
            │
            │ N (3-5)
     ┌──────▼──────────┐
     │  Action Item    │  ◄─── Embedded in Milestone.action_items array
     │  (Daily Task)   │
     └─────────────────┘

Cascade Rules:
═════════════
Objective → KR → Milestone → Action Item

Date Constraints:
═════════════════
Objective.start_date ≤ KR.start_date ≤ Milestone.start_date
Milestone.end_date ≤ KR.end_date ≤ Objective.end_date

Multi-Tenancy:
═════════════
All queries MUST filter by company_id
```

### Indexes for Performance
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MONGODB INDEXES                                    │
└─────────────────────────────────────────────────────────────────────────────┘

goals collection:
═════════════════
1. { company_id: 1 }                                    [Multi-tenant isolation]
2. { key_result_id: 1, milestone_week: 1 }              [Milestone lookup]
3. { company_id: 1, time_period: 1 }                    [Filter by type]
4. { owner_id: 1, status: 1 }                           [User's milestones]
5. { start_date: 1 }                                    [Date range queries]
6. { company_id: 1, key_result_id: 1, status: 1 }       [Compound query]

Query Patterns:
═══════════════
// Get all milestones for a KR
Goal.find({
  key_result_id: krId,
  time_period: 'MILESTONE',
  company_id: companyId,
  status: { $ne: 'cancelled' }
}).sort({ milestone_week: 1 });

// Get milestones for current week
const startOfWeek = getStartOfWeek(new Date());
const endOfWeek = getEndOfWeek(new Date());

Goal.find({
  company_id: companyId,
  time_period: 'MILESTONE',
  start_date: { $lte: endOfWeek },
  end_date: { $gte: startOfWeek },
  status: { $ne: 'cancelled' }
});

// Update action item status
Goal.findOneAndUpdate(
  {
    _id: milestoneId,
    company_id: companyId,
    'action_items._id': actionItemId
  },
  {
    $set: {
      'action_items.$.status': 'completed',
      'action_items.$.completed_at': new Date()
    }
  },
  { new: true }
);
```

---

## 8. Error Handling & Edge Cases

### Error Flow Diagram
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ERROR HANDLING FLOWS                               │
└─────────────────────────────────────────────────────────────────────────────┘

Scenario 1: OpenAI API Failure
═══════════════════════════════
User generates plan → OpenAI call fails
                             │
                             ▼
                    MilestonePlannerService
                    catches error
                             │
                             ▼
                    Falls back to
                    template generation
                             │
                             ▼
                    Returns template plan
                    with metadata: { method: 'template' }
                             │
                             ▼
                    Frontend shows badge:
                    "📝 Template Mode" instead of "✨ AI-Powered"


Scenario 2: Invalid Date Range
════════════════════════════════
User requests 4-week plan
But quarter only has 2 weeks left
                             │
                             ▼
                    ValidationService
                    checks dates
                             │
                             ▼
                    Returns 400 error:
                    {
                      error: 'Invalid date range',
                      message: 'Quarter only has 2 weeks remaining. Please choose 1-2 weeks or wait for next quarter.'
                    }
                             │
                             ▼
                    Frontend shows error modal
                    with suggested fix


Scenario 3: Duplicate Plan Creation
════════════════════════════════════
User tries to create plan
But KR already has milestones
                             │
                             ▼
                    Check existing milestones
                             │
                             ▼
                    Show confirmation:
                    "This KR already has a plan. Do you want to:
                     • Replace existing plan
                     • Add to existing plan
                     • Cancel"


Scenario 4: Network Timeout
═════════════════════════════
User generates plan
OpenAI takes >30 seconds
                             │
                             ▼
                    Request times out
                             │
                             ▼
                    Frontend shows:
                    "Request timed out. Try again with fewer weeks
                     or during off-peak hours."
                             │
                             ▼
                    Retry button available


Scenario 5: Missing Permissions
════════════════════════════════
EMPLOYEE tries to create plan
                             │
                             ▼
                    RBAC middleware
                    blocks request
                             │
                             ▼
                    Returns 403 Forbidden:
                    {
                      error: 'Insufficient permissions',
                      message: 'Only Managers and above can create milestone plans'
                    }
                             │
                             ▼
                    Frontend hides "Create Plan" button
                    for EMPLOYEE role
```

---

## 9. Performance Optimization

### Caching Strategy
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CACHING ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌────────────────┐
                    │  User Request  │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Check Redis    │
                    │ Cache          │
                    └────────┬───────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
              Cache HIT          Cache MISS
                   │                   │
                   ▼                   ▼
          ┌────────────┐      ┌───────────────┐
          │ Return     │      │ Call OpenAI   │
          │ Cached     │      │ Generate      │
          │ Plan       │      │ Fresh Plan    │
          └────────────┘      └───────┬───────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Store in      │
                              │ Redis         │
                              │ TTL: 7 days   │
                              └───────┬───────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Return Plan   │
                              └───────────────┘

Cache Key Pattern:
══════════════════
ai_plan:{company_id}:{key_result_id}:{weeks_count}:{start_date}

Example:
ai_plan:123:456:3:2025-01-01

Invalidation:
═════════════
• After 7 days (TTL expires)
• When user regenerates plan (manual bypass)
• When KR is updated (title, target changes)
• When objective dates change
```

---

## Summary

This comprehensive flow visualization covers:
1. ✅ **User Journey**: Step-by-step walkthrough
2. ✅ **Screen Wireframes**: 7 detailed mockups
3. ✅ **Data Flow**: Complete system diagram
4. ✅ **API Sequences**: Request/response flows
5. ✅ **State Machines**: Status transitions
6. ✅ **Component Tree**: Frontend architecture
7. ✅ **Database Schema**: Data relationships
8. ✅ **Error Handling**: Edge case flows
9. ✅ **Performance**: Caching strategy

**Ready for Implementation!** 🚀
