# 🚀 Sprint 3 Updated Plan
**Branch**: SPRINT3
**Duration**: November 21 - December 4, 2025
**Total Story Points**: 71 (was 55)

---

## 🆕 New Features Added to Sprint 3

### Feature A: OKR Generation Control (3 Points)
**Priority**: P0 - CRITICAL
**Why**: Prevents duplicate OKR generation chaos

**Acceptance Criteria**:
- ✅ Once OKRs generated, button disabled in team-ssi-view.html
- ✅ Company tracks `okrs_generated` flag
- ✅ Shows "OKRs generated on [date]" message
- ✅ Executives directed to manual objective creation

**Technical Tasks**:
1. Add fields to Company model:
   ```javascript
   okrs_generated: { type: Boolean, default: false },
   okr_generation_date: { type: Date },
   okr_generation_count: { type: Number, default: 0 }
   ```

2. Update `/api/ai-okr/generate` endpoint:
   ```javascript
   // Check if already generated
   if (company.okrs_generated) {
     return res.status(400).json({
       error: 'OKRs already generated for this company',
       generated_date: company.okr_generation_date,
       message: 'Please create new objectives manually'
     });
   }
   ```

3. Update team-ssi-view.html:
   ```javascript
   // Check and disable button
   if (companyData.okrs_generated) {
     button.disabled = true;
     button.textContent = 'OKRs Already Generated';
     showMessage(`Generated on ${formatDate(companyData.okr_generation_date)}`);
   }
   ```

---

### Feature B: Manual Objective Creation (5 Points)
**Priority**: P0 - CRITICAL
**Why**: Allows continuous objective setting beyond initial generation

**UI Mock**:
```
┌─────────────────────────────────────────┐
│       Create New Objective              │
├─────────────────────────────────────────┤
│ Title: [_____________________________]  │
│                                         │
│ Category: [Dropdown: Revenue/Operations]│
│                                         │
│ Time Period:                           │
│ ○ Calendar Year (Jan-Dec)              │
│ ● Fiscal Year (Apr-Mar)                │
│ ○ Custom Period                        │
│                                         │
│ Start Date: [Apr 1, 2025]              │
│ End Date:   [Mar 31, 2026]             │
│                                         │
│ Key Results:                           │
│ 1. [_____________________________]     │
│    Target: [____] Type: [Number ▼]     │
│ 2. [_____________________________]     │
│    Target: [____] Type: [Percent ▼]    │
│ [+ Add Key Result]                     │
│                                         │
│ [Generate AI Plan] [Save Objective]    │
└─────────────────────────────────────────┘
```

**Implementation**:
1. Create `client/pages/objective-creation-modal.html`
2. Add form validation for all required fields
3. POST `/api/objectives/manual` endpoint
4. Integrate with DateService for date calculations

---

### Feature C: AI-Assisted Plan Generation (8 Points)
**Priority**: P0 - CRITICAL
**Why**: Provides intelligent guidance for manual objectives

**AI Context Package**:
```javascript
const aiContext = {
  company: {
    name: company.name,
    industry: company.industry,
    size: company.employee_count,
    ssi_scores: {
      speed: company.speed_score,
      strength: company.strength_score,
      intelligence: company.intelligence_score
    }
  },
  objective: {
    title: objectiveTitle,
    category: selectedCategory,
    time_period: timePeriod,
    duration_months: duration
  },
  existing_objectives: existingObjectives.map(o => ({
    title: o.title,
    progress: o.progress,
    status: o.status
  })),
  team_structure: teams.map(t => ({
    name: t.name,
    size: t.members.length,
    manager: t.manager_name
  }))
};
```

**OpenAI Prompt**:
```
Given this company context:
${JSON.stringify(aiContext)}

Generate a comprehensive implementation plan for the objective including:
1. 3-5 SMART key results with target values
2. Quarterly milestones for each key result
3. Suggested task types and estimated hours
4. Team/resource recommendations
5. Risk factors to consider
6. Success metrics

Format as structured JSON.
```

**Implementation Steps**:
1. Create `/api/ai-okr/generate-plan` endpoint
2. Build context aggregation service
3. Design prompt template
4. Parse and validate AI response
5. Display suggestions in UI

---

## 📊 Updated Sprint 3 Priorities

### Priority 0 - MUST HAVE (Production Blockers)
1. **Flexible Date Management** (21 points) ✅ Original
2. **Goal Management UI** (13 points) ✅ Original
3. **OKR Generation Control** (3 points) 🆕 NEW
4. **Manual Objective Creation** (5 points) 🆕 NEW
5. **AI-Assisted Planning** (8 points) 🆕 NEW
6. **Employee Dashboard** (8 points) ✅ Original
7. **Business API** (8 points) ✅ Original

### Priority 1 - SHOULD HAVE
8. **Task UI Completion** (5 points) ✅ Original

**Total**: 71 story points

---

## 📅 Revised Daily Plan

### Day 1-2: Date Foundation + OKR Control
- DateService implementation
- OKR generation lock feature
- Company model updates

### Day 3: Date UI + Manual Objective UI
- Date selector component
- Objective creation modal
- Form validation

### Day 4-5: Goal Management UI
- Quarterly goals page
- Weekly goals page
- Goal details page

### Day 6: AI Planning Integration
- Context aggregation
- OpenAI integration
- Response parsing

### Day 7-8: Employee Dashboard
- Daily task view
- Why Chain implementation
- Progress tracking

### Day 9: Business API
- Complete 6 endpoints
- Multi-tenant isolation

### Day 10: Integration & Testing
- End-to-end testing
- Bug fixes
- Documentation

---

## 🤔 Discussion Points

### 1. **OKR Regeneration Policy**
**Question**: Should we allow regeneration with approval?
**Options**:
- A) Never allow regeneration (current plan)
- B) Allow with "Reset OKRs" admin function
- C) Allow quarterly regeneration
**Recommendation**: Start with A, add B in Sprint 4 if needed

### 2. **AI Plan Caching**
**Question**: Should we cache AI-generated plans?
**Benefits**: Faster, cheaper, consistent
**Drawbacks**: May become stale
**Recommendation**: Cache for 7 days with refresh option

### 3. **Objective Limits**
**Question**: Max objectives per company?
**Options**:
- Unlimited (flexible but chaotic)
- 10 per year (focused)
- 5 active at a time (very focused)
**Recommendation**: 10 per year, 5 active

### 4. **Template Library Source**
**Question**: Where do templates come from?
**Options**:
- Hardcoded (fast to implement)
- Database-driven (flexible)
- AI-generated based on industry (smart)
**Recommendation**: Start hardcoded, move to DB in Sprint 4

### 5. **Feature Priority Trade-offs**
With 71 points (vs 55 planned), we need to either:
- Extend sprint by 2 days
- Defer some P1 items
- Simplify implementations
**Recommendation**: Defer Task UI to Sprint 4, focus on core objective features

---

## 🎯 Value Proposition

These new features create a complete objective management lifecycle:

1. **Initial Setup**: Assessment → AI generates first OKRs
2. **Ongoing Management**: Manually create new objectives as needed
3. **Intelligence**: AI assists even manual objectives
4. **Control**: No accidental regeneration
5. **Flexibility**: Fiscal year, custom periods, templates

This transforms Karvia from a "one-time OKR generator" to a "continuous objective management platform."

---

## ✅ Decision Needed

**Option A**: Include all 3 new features (71 points)
- Pros: Complete objective lifecycle
- Cons: Aggressive timeline

**Option B**: Include Features A & B only (63 points)
- Pros: More manageable
- Cons: Less AI intelligence

**Option C**: Defer to Sprint 4
- Pros: Sprint 3 stays on track
- Cons: Incomplete objective management

**Recommended**: Option A with Task UI deferred to Sprint 4

What do you think? Should we proceed with all three features?