# Epic L: Planning Page Redesign

**Epic**: L - AI-Enhanced Planning Experience
**Created**: January 9, 2026
**Story Points**: 25 pts
**Priority**: P1
**Status**: READY FOR IMPLEMENTATION

---

## Executive Summary

Redesign the Planning page with a minimalist week-tile interface and enhanced AI context for smarter goal suggestions. This is primarily a **frontend + AI prompt enhancement** project - the backend data model remains unchanged.

**Key Principle**: Planning page is for PLANNING only. Task execution and tracking happens in Dashboard.

---

## Problem Statement

### Current Issues (from screenshot analysis)

| Issue | Impact |
|-------|--------|
| **Information overload** | All weeks listed vertically with full task details |
| **Mixed concerns** | Task completion UI on planning page |
| **No visual hierarchy** | Week 1 and Week 13 get equal prominence |
| **Limited AI context** | Weekly goal generation doesn't consider history |
| **Poor scannability** | Can't see quarter at a glance |

### User Feedback
- "Planning feels fragmented, not like a journey"
- "Hard to see the big picture of my quarter"
- "AI suggestions are too generic"

---

## Solution Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PLANNING PAGE REDESIGN                                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  BEFORE (Current)                    AFTER (Redesigned)                         │
│  ─────────────────                   ──────────────────                         │
│                                                                                 │
│  ┌─────────────────────┐             ┌─────────────────────────────────────┐   │
│  │ Week 1              │             │ Objective Header                    │   │
│  │ ├─ Goal title       │             ├─────────────────────────────────────┤   │
│  │ ├─ Task 1 [✓]       │             │ KRs (left)  │  Week Tiles (right)   │   │
│  │ ├─ Task 2 [✓]       │             │             │                       │   │
│  │ └─ Task 3 [ ]       │             │ ┌─────────┐ │ ┌───┐┌───┐┌───┐┌───┐ │   │
│  ├─────────────────────┤             │ │● KR 1   │ │ │W1 ││W2 ││W3 ││W4 │ │   │
│  │ Week 2              │             │ │  45→80  │ │ │✓  ││NOW││ + ││ + │ │   │
│  │ ├─ Goal title       │             │ └─────────┘ │ └───┘└───┘└───┘└───┘ │   │
│  │ ├─ Task 1 [ ]       │             │             │                       │   │
│  │ ├─ Task 2 [ ]       │             │ ┌─────────┐ │ ┌───┐┌───┐┌───┐┌───┐ │   │
│  │ └─ Task 3 [ ]       │             │ │○ KR 2   │ │ │W5 ││W6 ││W7 ││W8 │ │   │
│  ├─────────────────────┤             │ │  10→5%  │ │ │ + ││ + ││ + ││ + │ │   │
│  │ Week 3              │             │ └─────────┘ │ └───┘└───┘└───┘└───┘ │   │
│  │ ...                 │             │             │                       │   │
│  └─────────────────────┘             └─────────────┴───────────────────────┘   │
│                                                                                 │
│  Problems:                           Solutions:                                 │
│  • Vertical scroll forever           • See all weeks at glance                  │
│  • Task checkboxes (wrong place)     • No task completion UI                    │
│  • No context awareness              • Status from Dashboard data               │
│  • Generic AI suggestions            • Rich context to LLM                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture: No Backend Changes

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  DATA FLOW (UNCHANGED)                                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Objective                                                                      │
│      └── Key Result                                                             │
│              └── Quarterly Goal                                                 │
│                      └── Weekly Goal (Week 1, Week 2, ... Week N)               │
│                              └── Tasks                                          │
│                                                                                 │
│  ✓ Same models         - Goal.js, Task.js unchanged                            │
│  ✓ Same API endpoints  - /api/goals/*, /api/tasks/* unchanged                  │
│  ✓ Same relationships  - parent_goal_id, weekly goal nesting unchanged         │
│  ✓ Same Dashboard      - Task tracking stays in Dashboard                       │
│                                                                                 │
│  WHAT CHANGES:                                                                  │
│  • Planning page HTML/JS (frontend redesign)                                    │
│  • AI prompt context (richer data assembly)                                     │
│  • Week status display (calculated from existing task data)                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Design

### 1. Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Planning                                                    Q1 2026 ▼         │
│  Plan your weekly goals to achieve key results                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  ⚡ Enhance customer satisfaction and retention                              ││
│  │  4 Key Results · Q1 2026 (13 weeks)                                         ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
│  ┌────────────────────────┬────────────────────────────────────────────────────┐│
│  │                        │                                                    ││
│  │  KEY RESULTS           │  WEEKLY PLANNING                                   ││
│  │                        │                                                    ││
│  │  ┌──────────────────┐  │  Progress: 2 of 13 weeks planned                   ││
│  │  │ ● Increase CSAT  │  │                                                    ││
│  │  │   45 → 80        │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  ││
│  │  │   2/13 planned   │  │  │ W1  │ │ W2  │ │ W3  │ │ W4  │ │ W5  │ │ W6  │  ││
│  │  │   ████░░░░ 15%   │  │  │ ✓   │ │ NOW │ │  +  │ │  +  │ │  +  │ │  +  │  ││
│  │  └──────────────────┘  │  │100% │ │ 33% │ │     │ │     │ │     │ │     │  ││
│  │                        │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  ││
│  │  ┌──────────────────┐  │                                                    ││
│  │  │ ○ Reduce churn   │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  ││
│  │  │   10% → 5%       │  │  │ W7  │ │ W8  │ │ W9  │ │ W10 │ │ W11 │ │ W12 │  ││
│  │  │   Not started    │  │  │  +  │ │  +  │ │  +  │ │  +  │ │  +  │ │  +  │  ││
│  │  └──────────────────┘  │  │     │ │     │ │     │ │     │ │     │ │     │  ││
│  │                        │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  ││
│  │  ┌──────────────────┐  │                                                    ││
│  │  │ ○ Increase NPS   │  │  ┌─────┐                                           ││
│  │  │   30 → 50        │  │  │ W13 │                                           ││
│  │  │   Not started    │  │  │  +  │                                           ││
│  │  └──────────────────┘  │  │     │                                           ││
│  │                        │  └─────┘                                           ││
│  │                        │                                                    ││
│  └────────────────────────┴────────────────────────────────────────────────────┘│
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Week Tile States

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  WEEK TILE VISUAL STATES                                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐           │
│  │ PAST    │   │ CURRENT │   │ PLANNED │   │ EMPTY   │   │ FUTURE  │           │
│  │ (done)  │   │ (now)   │   │ (ready) │   │ (unset) │   │ (later) │           │
│  │         │   │         │   │         │   │         │   │         │           │
│  │   W1    │   │   W2    │   │   W3    │   │   W4    │   │   W8    │           │
│  │   ✓     │   │  NOW    │   │   ✓     │   │   +     │   │   ·     │           │
│  │  100%   │   │   33%   │   │ planned │   │  plan   │   │         │           │
│  │         │   │         │   │         │   │         │   │         │           │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘           │
│   Green bg      Purple       White bg      Dashed        Gray bg               │
│   Dimmed        border       Checkmark     border        Subtle                │
│   Read-only     Highlight    Editable      Clickable     Later                 │
│                                                                                 │
│  Status % = (completed tasks / total tasks) from Dashboard                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Week Expansion Panel

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  EXPANDED WEEK VIEW (when tile is clicked)                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  📅 WEEK 3: Jan 20-26, 2026                                    [× Close]    ││
│  │                                                                             ││
│  │  ┌───────────────────────────────────────────────────────────────────────┐  ││
│  │  │ 📊 Context (visible to AI)                                            │  ││
│  │  │                                                                       │  ││
│  │  │ • W1: ✓ 100% - Launched NPS survey                                    │  ││
│  │  │ • W2: 33% - Analyzing baseline (in progress)                          │  ││
│  │  │ • KR Progress: 45/80 (56%)                                            │  ││
│  │  │                                                                       │  ││
│  │  │ AI uses this context for better suggestions                           │  ││
│  │  └───────────────────────────────────────────────────────────────────────┘  ││
│  │                                                                             ││
│  │  Weekly Goal Title                                                          ││
│  │  ┌───────────────────────────────────────────────────────────────────────┐  ││
│  │  │ Address top customer complaint: response time                         │  ││
│  │  └───────────────────────────────────────────────────────────────────────┘  ││
│  │                                                                             ││
│  │  Tasks (created here, tracked in Dashboard)                                 ││
│  │  ┌───────────────────────────────────────────────────────────────────────┐  ││
│  │  │ • Implement ticket system                                             │  ││
│  │  │ • Set SLAs for response times                                         │  ││
│  │  │ • Train team on new process                                           │  ││
│  │  │                                                                       │  ││
│  │  │ [+ Add task]                                                          │  ││
│  │  └───────────────────────────────────────────────────────────────────────┘  ││
│  │                                                                             ││
│  │  Note: No checkboxes here - task completion happens in Dashboard            ││
│  │                                                                             ││
│  │  [✨ Get AI Suggestions]                              [Save Weekly Goal]    ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## AI Context Enhancement

### Context Assembly for Weekly Goal Suggestions

When user clicks "✨ Get AI Suggestions", assemble context from existing data:

```javascript
/**
 * Assemble AI context for weekly goal generation
 * Reads from existing models - no new storage needed
 */
async function assembleWeeklyGoalContext(companyId, keyResultId, targetWeek) {
  // Fetch existing data in parallel
  const [company, keyResult, weeklyGoals, tasks, ssiData] = await Promise.all([
    Company.findById(companyId).lean(),
    KeyResult.findById(keyResultId).populate('objective_id').lean(),
    Goal.find({
      key_result_id: keyResultId,
      time_period: 'WEEKLY'
    }).sort({ week_number: 1 }).lean(),
    Task.find({
      key_result_id: keyResultId
    }).lean(),
    getLatestSSIScores(companyId)
  ]);

  // Calculate task completion for each week
  const weekHistory = weeklyGoals.map(week => {
    const weekTasks = tasks.filter(t => t.weekly_goal_id?.toString() === week._id.toString());
    const completed = weekTasks.filter(t => t.status === 'completed').length;
    const total = weekTasks.length;

    return {
      week_number: week.week_number,
      title: week.title,
      tasks: weekTasks.map(t => ({
        title: t.title,
        status: t.status,
        blocker: t.blocker || null
      })),
      completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      is_past: new Date(week.end_date) < new Date()
    };
  });

  return {
    // Company context
    company: {
      name: company.name,
      industry: company.industry,
      industry_subtype: company.industry_subtype,
      business_metrics: company.business_metrics || {}
    },

    // SSI context
    ssi_scores: ssiData,

    // OKR hierarchy
    objective: {
      title: keyResult.objective_id.title,
      category: keyResult.objective_id.category
    },

    key_result: {
      title: keyResult.title,
      current_value: keyResult.current_value,
      target_value: keyResult.target_value,
      unit: keyResult.unit,
      progress_percent: Math.round((keyResult.current_value / keyResult.target_value) * 100)
    },

    // Historical context
    week_history: weekHistory,

    // Current request
    target_week: targetWeek,
    total_weeks_in_quarter: weeklyGoals.length || 13,

    // Analysis
    analysis: {
      weeks_planned: weekHistory.filter(w => w.title).length,
      avg_completion: Math.round(
        weekHistory.reduce((sum, w) => sum + w.completion_rate, 0) /
        Math.max(weekHistory.filter(w => w.is_past).length, 1)
      ),
      blockers: weekHistory.flatMap(w =>
        w.tasks.filter(t => t.blocker).map(t => ({ week: w.week_number, task: t.title, blocker: t.blocker }))
      )
    }
  };
}
```

### AI Prompt Structure

```javascript
const systemPrompt = `You are an OKR planning assistant. Generate a weekly goal and tasks based on the context provided.

RULES:
1. Weekly goal should be specific and achievable in one week
2. Generate 3-5 tasks that contribute to the goal
3. Consider previous weeks' progress and any blockers
4. Align with the key result target
5. Use language appropriate to the company's industry
6. If behind schedule, suggest catch-up activities
7. If ahead, suggest stretch goals or next-phase prep`;

const userPrompt = `Generate Week ${context.target_week} plan:

COMPANY: ${context.company.name} (${context.company.industry})
${context.company.industry_subtype ? `Specialization: ${context.company.industry_subtype}` : ''}

KEY RESULT: ${context.key_result.title}
Progress: ${context.key_result.current_value}/${context.key_result.target_value} (${context.key_result.progress_percent}%)

PREVIOUS WEEKS:
${context.week_history
  .filter(w => w.week_number < context.target_week)
  .map(w => `Week ${w.week_number}: "${w.title || 'Not planned'}" - ${w.completion_rate}% complete${w.tasks.some(t => t.blocker) ? ' (had blockers)' : ''}`)
  .join('\n')}

${context.analysis.blockers.length > 0 ? `
ACTIVE BLOCKERS:
${context.analysis.blockers.map(b => `- Week ${b.week}: ${b.task} - "${b.blocker}"`).join('\n')}
` : ''}

SSI CONTEXT:
- Speed: ${context.ssi_scores?.speed || 'N/A'}
- Strength: ${context.ssi_scores?.strength || 'N/A'}
- Intelligence: ${context.ssi_scores?.intelligence || 'N/A'}

Generate a JSON response:
{
  "weekly_goal": {
    "title": "Clear, actionable weekly goal",
    "rationale": "Why this goal for this week"
  },
  "tasks": [
    { "title": "Task 1", "priority": "high|medium|low" },
    { "title": "Task 2", "priority": "high|medium|low" },
    { "title": "Task 3", "priority": "high|medium|low" }
  ],
  "notes": "Any observations about progress or suggestions"
}`;
```

---

## User Stories

### Story L1: Week Tiles Grid Layout (5 pts)
**As a** planning user
**I want** to see all weeks as clickable tiles in a grid
**So that** I can see my entire quarter at a glance

**Acceptance Criteria:**
- [ ] Weeks displayed as tiles (6 columns max)
- [ ] Tiles show: week number, status indicator, completion %
- [ ] Current week has purple border highlight
- [ ] Past weeks are dimmed (read-only visual)
- [ ] Future unplanned weeks show "+" icon
- [ ] Responsive: 6 cols on desktop, 4 on tablet, 2 on mobile

**Technical Notes:**
- File: `client/pages/planning.html`
- New CSS for tile grid layout
- Fetch weeks from existing `/api/goals/weekly/:quarterlyGoalId`

---

### Story L2: KR Sidebar Selection (3 pts)
**As a** planning user
**I want** to select a Key Result from a sidebar
**So that** the week tiles update to show that KR's weekly goals

**Acceptance Criteria:**
- [ ] Left sidebar shows all KRs for selected objective
- [ ] KR cards show: title, target, progress bar
- [ ] Clicking KR updates the week tiles panel
- [ ] Selected KR has visual highlight
- [ ] KR progress calculated from current/target values

**Technical Notes:**
- Reuse existing KR fetch from `/api/key-results/:objectiveId`
- Store selected KR in component state

---

### Story L3: Week Expansion Panel (5 pts)
**As a** planning user
**I want** to click a week tile and see/edit the weekly goal
**So that** I can plan my week without leaving the page

**Acceptance Criteria:**
- [ ] Click tile → panel expands below tiles
- [ ] Panel shows: week dates, goal title, tasks list
- [ ] Can edit goal title (inline edit)
- [ ] Can add/remove tasks (no checkboxes)
- [ ] "Save" button persists changes
- [ ] "Close" button collapses panel
- [ ] Only one week expanded at a time

**Technical Notes:**
- Uses existing `/api/goals/weekly` POST/PUT
- Uses existing `/api/tasks` POST/DELETE
- No task status updates here (Dashboard only)

---

### Story L4: Week Status from Tasks (3 pts)
**As a** planning user
**I want** to see task completion % on each week tile
**So that** I know my progress without going to Dashboard

**Acceptance Criteria:**
- [ ] Each tile shows completion percentage
- [ ] % calculated from: completed tasks / total tasks
- [ ] Color coding: green (>80%), yellow (50-80%), gray (<50%)
- [ ] "NOW" badge on current week
- [ ] Tooltip shows: "3 of 5 tasks completed"
- [ ] Status updates when page loads (not real-time)

**Technical Notes:**
- Fetch tasks per week from existing `/api/tasks?weekly_goal_id=X`
- Calculate completion client-side
- Cache calculation to avoid re-fetching

---

### Story L5: AI Context Assembly (5 pts)
**As a** system
**I want** to assemble rich context for AI suggestions
**So that** generated goals are relevant to user's progress

**Acceptance Criteria:**
- [ ] Context includes: company profile, SSI scores
- [ ] Context includes: objective, KR, progress
- [ ] Context includes: all previous weeks' goals and completion
- [ ] Context includes: any logged blockers
- [ ] Context assembles in <500ms
- [ ] Context sent when "Get AI Suggestions" clicked

**Technical Notes:**
- New service: `client/js/planning-ai-context.js`
- Aggregates from existing API endpoints
- No new backend endpoints needed

---

### Story L6: AI Suggestions UI (4 pts)
**As a** planning user
**I want** to click "Get AI Suggestions" and see generated goal/tasks
**So that** I can quickly create effective weekly plans

**Acceptance Criteria:**
- [ ] "✨ Get AI Suggestions" button in expansion panel
- [ ] Shows loading state while generating
- [ ] Displays: suggested goal title, 3-5 tasks
- [ ] Shows AI rationale/notes
- [ ] "Accept" populates the form fields
- [ ] "Regenerate" gets new suggestions
- [ ] User can edit before saving

**Technical Notes:**
- Calls existing `/api/ai-goals/generate` with enhanced context
- May need to add endpoint parameter for "weekly" mode

---

## Optional Enhancement Stories

### Story L7: Roadmap Overview (Optional - 3 pts)
**As a** planning user
**I want** to see a high-level roadmap for the quarter
**So that** I understand the overall journey

**Acceptance Criteria:**
- [ ] "View Roadmap" button shows modal
- [ ] Modal shows 4 phases (Weeks 1-3, 4-6, 7-9, 10-13)
- [ ] Each phase has theme and milestone
- [ ] AI generates roadmap on first KR planning
- [ ] Roadmap stored on quarterly goal (new field)

**Technical Notes:**
- Optional: Can defer to future sprint
- Would need small schema addition to store roadmap

---

## Implementation Order

### Phase 1: Core Layout (Day 1-2)
| Story | Points | Focus |
|-------|--------|-------|
| L1 | 5 | Week tiles grid |
| L2 | 3 | KR sidebar |
| **Subtotal** | **8** | **Layout complete** |

### Phase 2: Interaction (Day 3-4)
| Story | Points | Focus |
|-------|--------|-------|
| L3 | 5 | Week expansion panel |
| L4 | 3 | Status calculation |
| **Subtotal** | **8** | **Interaction complete** |

### Phase 3: AI Enhancement (Day 5)
| Story | Points | Focus |
|-------|--------|-------|
| L5 | 5 | Context assembly |
| L6 | 4 | AI suggestions UI |
| **Subtotal** | **9** | **AI complete** |

**Total: 25 points (~5 development days)**

---

## Files to Modify

| File | Changes | Est. Lines |
|------|---------|------------|
| `client/pages/planning.html` | Complete redesign | ~400 |
| `client/js/planning.js` | New tile logic, expansion panel | ~350 |
| `client/js/planning-ai-context.js` | New context assembly | ~150 |
| `client/css/planning.css` | Tile grid styles | ~100 |

**No backend changes required.**

---

## Testing Requirements

### Unit Tests
- [ ] Week status calculation
- [ ] AI context assembly
- [ ] Tile state determination

### Integration Tests
- [ ] KR selection updates tiles
- [ ] Week expansion loads correct data
- [ ] Save persists weekly goal

### E2E Tests
- [ ] Full flow: Select KR → Click week → AI suggest → Save
- [ ] Status reflects Dashboard task completion
- [ ] Mobile responsive layout

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Time to create weekly goal | ~3 min | <1 min |
| AI suggestion acceptance rate | N/A | >60% |
| Weeks planned per session | 1-2 | 3-4 |
| Page load time | - | <2s |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI context too slow | Medium | Parallel fetches, caching |
| Mobile tile layout | Low | Responsive grid, tested on devices |
| User confusion (no checkboxes) | Medium | Clear "track in Dashboard" messaging |

---

## Definition of Done

- [ ] All 6 stories completed
- [ ] No task completion UI on planning page
- [ ] AI context includes full history
- [ ] Week status calculated from Dashboard data
- [ ] Mobile responsive
- [ ] No backend schema changes
- [ ] Existing weekly goal API unchanged

---

## Related Documents

- [planning.html](../../../../client/pages/planning.html) - Current planning page
- [Goal.js](../../../../server/models/Goal.js) - Weekly goal model
- [Task.js](../../../../server/models/Task.js) - Task model
- [ai-okr.js](../../../../server/routes/ai-okr.js) - AI generation routes

---

**Epic Owner**: Product Team
**Technical Lead**: TBD
**Sprint Target**: Sprint 11 (February 2026)
