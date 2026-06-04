# Sprint 14 Master Plan: iBrain Visual Identity & Growth Foundation

**Sprint Duration**: TBD (post-Sprint 13 completion)
**Total Points**: 53 pts (estimated)
**Focus**: iBrain visual standardization, dashboard enhancement, and marketing foundation

---

## Sprint 14 Overview

Sprint 14 establishes the visual and strategic foundation for Karvia's Intelligence-as-a-Service (IQaaS) layer, branded as **iBrain**. This sprint connects all AI-powered touchpoints under a unified visual identity and creates the documentation needed for marketing and user onboarding.

### Strategic Goals

1. **Visual Consistency**: Standardize all iBrain-powered buttons/features with navy (#1e3a5f) + lightning bolt
2. **Dashboard Enhancement**: Add signals header and iBrain footer to existing dashboard
3. **User Education**: Help users recognize and trust AI-powered features
4. **Marketing Foundation**: Create assets for product marketing and onboarding
5. **Dashboard Intelligence**: Add iBrain-powered suggestions to daily workflow

---

## Epic I: iBrain Visual Identity System (15 pts)

> Standardize all AI-powered touchpoints with consistent visual identity

### I1: Create iBrain Design System Component (3 pts)

**Description**: Create reusable CSS/component for iBrain buttons and indicators

**Acceptance Criteria**:
- [ ] Create \`ibrain-button\` CSS class in design system
- [ ] Create \`ibrain-badge\` for AI-generated content markers
- [ ] Document usage guidelines in style guide
- [ ] Include hover, loading, and disabled states

**Files to Create/Modify**:
- \`client/css/ibrain-components.css\` (new)
- \`client/css/s14-patterns.css\` (new)
- Add to common.js as reusable component

**Visual Spec**:
\`\`\`css
.ibrain-button {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.ibrain-button::before {
  content: "⚡";
}

.ibrain-button:hover {
  background: linear-gradient(135deg, #2d5a87 0%, #1e3a5f 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.4);
}

.ibrain-badge {
  background: rgba(30, 58, 95, 0.1);
  color: #1e3a5f;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
}
\`\`\`

### I2: Retrofit Existing iBrain Touchpoints (5 pts)

**Description**: Update all existing AI-powered buttons to use new iBrain visual identity

**Current Touchpoints to Update**:

| Page | Element | Current Style | New Style |
|------|---------|---------------|-----------|
| \`team-ssi-view.html\` | Generate OKRs button | Purple/custom | iBrain navy |
| \`team-ssi-view.html\` | Refresh Narratives button | Outline | iBrain outline |
| \`team-ssi-view.html\` | Export PDF button | Outline | iBrain outline |
| \`objectives.html\` | Generate with AI dropdown | Blue | iBrain navy |
| \`objectives.html\` | AI Generated badge | Blue | iBrain badge |
| \`planning-v2.html\` | Generate Weekly Goals | Navy (correct) | Verify standards |
| \`planning.html\` | Generate AI Plan | Custom | iBrain navy |
| \`assessment-results.html\` | Generate AI OKRs | Custom | iBrain navy |
| \`ai-business-insights.html\` | Generate Insights | Custom | iBrain navy |

**Files to Modify**:
- \`client/pages/team-ssi-view.html\`
- \`client/pages/objectives.html\`
- \`client/pages/planning.html\`
- \`client/pages/planning-v2.html\`
- \`client/pages/assessment-results.html\`
- \`client/pages/ai-business-insights.html\`
- \`client/css/s13-patterns.css\` (update)

### I3: Add iBrain Tooltip/Education Layer (3 pts)

**Description**: Add subtle tooltips explaining what iBrain does for each feature

**Acceptance Criteria**:
- [ ] Hover tooltip on iBrain buttons showing brief explanation
- [ ] "Powered by iBrain" footer text on AI-generated content
- [ ] Consistent iconography (lightning bolt) across all touchpoints

**Example Tooltips**:
- Generate Weekly Goals: "iBrain analyzes your KRs and SSI scores to suggest actionable weekly tasks"
- Generate OKRs: "iBrain creates objectives based on your company's Speed, Strength, and Intelligence gaps"
- Diagnostic Report: "iBrain synthesizes assessment data into executive-ready insights"

### I4: iBrain Loading States & Feedback (4 pts)

**Description**: Standardize loading states and success feedback for iBrain operations

**Acceptance Criteria**:
- [ ] Consistent loading spinner with "iBrain is thinking..." text
- [ ] Progress indicator for longer operations
- [ ] Success toast with iBrain branding
- [ ] Error state with helpful retry messaging

**Visual States**:
\`\`\`
Loading: Navy spinner + "iBrain is analyzing..."
Success: Green check + "iBrain generated 5 weekly goals"
Error: Red alert + "iBrain couldn't complete this request. Try again?"
\`\`\`

---

## Epic M: Marketing & Onboarding Documentation (15 pts)

> Create documentation for product marketing and user education

### M1: iBrain Feature Overview Page (4 pts)

**Description**: Create \`/pages/ibrain-overview.html\` explaining iBrain to users

**Content Sections**:
1. What is iBrain?
2. How it learns about your company
3. Feature tour (all touchpoints)
4. Privacy & data handling
5. Getting the most from iBrain

**Acceptance Criteria**:
- [ ] Accessible from help menu and onboarding flow
- [ ] Mobile-responsive design
- [ ] Screenshots/animations of each feature
- [ ] FAQ section

### M2: Onboarding Flow Enhancement (5 pts)

**Description**: Add iBrain introduction to new user onboarding

**Acceptance Criteria**:
- [ ] Step in onboarding explaining iBrain
- [ ] "Try it now" CTA leading to first AI generation
- [ ] Explain the navy button visual cue
- [ ] Set expectations for AI suggestions

**Flow**:
\`\`\`
Step 1: Welcome to Karvia
Step 2: Meet iBrain (NEW) ← introduces AI layer
Step 3: Complete your first assessment
Step 4: Generate your first objectives with iBrain
Step 5: Set up your team
\`\`\`

### M3: Marketing Asset Creation (3 pts)

**Description**: Create reusable marketing assets for iBrain

**Deliverables**:
- [ ] iBrain logo/icon (lightning bolt + brain)
- [ ] Feature comparison table (with/without iBrain)
- [ ] Value proposition one-pager
- [ ] Social media graphics (3 variants)

**Marketing Copy**:
\`\`\`
Headline: "Your Company's Intelligence Layer"
Subhead: "iBrain analyzes your SSI scores to tell you exactly what to work on"
CTA: "See iBrain in Action"
\`\`\`

### M4: Product Documentation Update (3 pts)

**Description**: Update all product documentation to reference iBrain

**Files to Update**:
- [ ] \`README.md\` - Add iBrain overview
- [ ] \`CLAUDE.md\` - Technical iBrain context
- [ ] \`product_philosophy.md\` - Already updated ✅
- [ ] API documentation - Add iBrain endpoints

---

## Epic S: Dashboard Enhancement (8 pts)

> Add signals header and iBrain section to existing dashboard (UI-only, no backend changes)

### Design Philosophy

Keep existing Tasks and Weekly Goals sections unchanged. Add two new sections:
- **Signals header** at top (objective circles + task counts)
- **iBrain suggestion** at bottom (single, minimalistic)

### Full Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SIGNALS HEADER (NEW)                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  📊 Objectives: ● ● ● ● ● ● ● ● ● ●     📋 🔴 3  🟡 5  🟢 2   📅 12/20     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ EXISTING TASKS SECTION - UNCHANGED ]                                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ EXISTING WEEKLY GOALS SECTION - UNCHANGED ]                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  iBRAIN SECTION (NEW)                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ⚡ Focus on "Q1 Revenue Target" - 2 days behind          [View] [Dismiss]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### S1: Signals Header Bar (4 pts)

**Description**: Compact header with objective status circles and task counts

**Visual Design**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 Objectives                          📋 Tasks              📅 Weekly     │
│  ● ● ● ● ● ● ● ● ● ●                   🔴 3 🟡 5 🟢 2        12/20         │
│  🟢 On Track  🟡 At Risk  🔴 Behind                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Objective status circles (color = status, click → navigate)
- [ ] Task count badges (Overdue/Today/Tomorrow)
- [ ] Weekly goals progress counter
- [ ] All in single compact row (desktop)
- [ ] Stacks vertically on mobile

**CSS Spec**:
```css
.signals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 20px;
  gap: 24px;
}

.status-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.status-circle:hover { transform: scale(1.3); }
.status-on-track { background: #22c55e; }
.status-at-risk { background: #eab308; }
.status-behind { background: #ef4444; }
.status-not-started { background: #e5e7eb; border: 2px solid #d1d5db; }

.task-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
}

.badge-overdue { background: #fef2f2; color: #dc2626; }
.badge-today { background: #fefce8; color: #ca8a04; }
.badge-tomorrow { background: #f0fdf4; color: #16a34a; }
```

### S2: iBrain Suggestion Footer (4 pts)

**Description**: Single minimalistic iBrain suggestion at bottom of dashboard

**Visual Design**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚡ iBrain suggests: Focus on "Q1 Revenue" - 2 days behind    [View] [Skip] │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Single line suggestion (not a card, just a bar)
- [ ] Navy gradient background
- [ ] Lightning bolt icon
- [ ] "View" button → navigates to relevant page
- [ ] "Skip" button → dismisses and shows next suggestion
- [ ] Remembers dismissals (localStorage)

**CSS Spec**:
```css
.ibrain-footer {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  color: white;
  border-radius: 10px;
  padding: 12px 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ibrain-footer-text {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ibrain-footer-actions {
  display: flex;
  gap: 8px;
}

.ibrain-footer-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.ibrain-footer-btn:hover {
  background: rgba(255,255,255,0.3);
}
```

### Mobile Layout

```
┌─────────────────────────┐
│ 📊 ● ● ● ● ● ● ● ● ● ●  │
│ 📋 🔴 3 🟡 5 🟢 2       │
│ 📅 12/20 complete       │
├─────────────────────────┤
│ [Existing Tasks]        │
├─────────────────────────┤
│ [Existing Weekly Goals] │
├─────────────────────────┤
│ ⚡ Focus on Q1 Revenue  │
│ [View] [Skip]           │
└─────────────────────────┘
```

**Mobile CSS**:
```css
@media (max-width: 768px) {
  .signals-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .ibrain-footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .ibrain-footer-actions {
    width: 100%;
    justify-content: center;
  }
}
```

### Files to Modify

- `client/pages/dashboard.html` - Add signals header and iBrain footer
- `client/pages/scripts/dashboard.js` - Render new sections
- `client/css/s14-patterns.css` - New component styles

---

## Epic D: Dashboard iBrain Intelligence (15 pts)

> Add iBrain-powered suggestions to daily dashboard workflow

### D1: Today's Focus Suggestions (5 pts)

**Description**: iBrain suggests 3 priority tasks based on context

**Backend**:
- Endpoint: \`GET /api/ibrain/daily-focus\`
- Uses AIContextService to analyze:
  - Overdue goals
  - Upcoming deadlines
  - Low-scoring SSI blocks
  - Recent activity patterns

**Frontend**:
- "iBrain Suggests" card on dashboard
- 3 priority items with rationale
- One-click to mark complete or dismiss

**UI Mock**:
\`\`\`
┌─────────────────────────────────────────────────────┐
│ ⚡ iBrain Suggests for Today                        │
├─────────────────────────────────────────────────────┤
│ 1. Review Q1 financial KR (2 days overdue)          │
│    → Speed score at 5.2, needs attention            │
│                                                     │
│ 2. Schedule team check-in for Project Alpha         │
│    → People block scored low this week              │
│                                                     │
│ 3. Update delivery timeline for Client X            │
│    → Deadline in 3 days, 40% complete               │
└─────────────────────────────────────────────────────┘
\`\`\`

### D2: KR Focus Recommendations (5 pts)

**Description**: iBrain highlights which KRs need attention

**Logic**:
- KRs behind schedule
- KRs with recent activity decline
- KRs linked to low SSI blocks
- Priority based on deadline proximity

**Endpoint**: \`GET /api/ibrain/kr-recommendations\`

**Frontend**:
- KR cards with iBrain badge showing why
- Quick actions: "Update Progress", "Add Task", "Reassign"

### D3: Number Guidance (5 pts)

**Description**: iBrain suggests target numbers based on trends

**Examples**:
- "Aim for 85% task completion this week (you did 72% last week)"
- "Try to reduce response time to 4 hours (currently 6)"
- "Target 3 new client meetings this month"

**Backend**:
- Analyze historical patterns
- Calculate achievable stretch goals
- Connect to SSI improvement targets

---

## Dependencies & Prerequisites

### From Sprint 13 (Must Complete First)
- [x] Epic X: Unified LLM Context Service (42 pts)
- [x] Epic O: SSI Intelligence Enhancements (12 pts)
- [ ] Epic T: Design System Finalization (5 pts)
- [ ] Epic BF: Bug Fixes (2 pts)

### Technical Prerequisites
- AIContextService fully operational
- 12-block SSI data flowing correctly
- Company context building working

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| UI inconsistency during retrofit | Medium | Do I2 all at once, not incrementally |
| User confusion about iBrain | Medium | Clear onboarding (M2) and tooltips (I3) |
| Performance impact of suggestions | High | Cache recommendations, async loading |
| Marketing assets not aligned | Low | Create brand guide first (M3) |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Visual consistency | 100% | Audit all iBrain buttons |
| User recognition | 80% | Survey: "What does the navy button mean?" |
| Feature adoption | +20% | AI feature usage after identity launch |
| Onboarding completion | +15% | Users completing iBrain intro step |

---

## Sprint 14 Backlog Summary

| Epic | Points | Priority | Dependencies |
|------|--------|----------|--------------|
| I - iBrain Visual Identity | 15 | P0 | Sprint 13 complete |
| S - Dashboard Enhancement | 8 | P0 | None (UI only) |
| M - Marketing & Onboarding | 15 | P1 | Epic I complete |
| D - Dashboard Intelligence | 15 | P2 | Epic I + S complete |
| **Total** | **53** | | |

---

## Related Documentation

- Product Philosophy: \`KARVIA_STRATEGY/1-PRODUCT/strategy/product_philosophy.md\`
- Technical Foundation: \`server/services/AIContextService.js\`
- Sprint 13 Context: \`KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-13 (Planned)/\`
- Design System: \`client/css/s13-patterns.css\`

---

**Last Updated**: February 22, 2026
**Author**: Product Strategy Team
