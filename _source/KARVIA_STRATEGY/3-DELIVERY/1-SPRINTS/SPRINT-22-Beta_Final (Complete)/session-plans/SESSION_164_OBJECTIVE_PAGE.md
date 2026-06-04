# Session #164: Objective Page Finalization

<!-- @GENOME T3-SPR-022-S1 | ACTIVE | 2026-04-20 | parent:T3-SPR-022 | auto:/strategy | linked:/design -->

**Session Goal**: Finalize complete strategy for Objective Creation with all edge cases, validation rules, and integration points
**Duration**: 1 strategy session
**Status**: 📋 Planned
**Prerequisites**: OBJECTIVE_CREATION_STRATEGY.md complete ✅

---

## Session Objectives

### Primary Goal
Complete all remaining details for Objective Page so design and engineering teams can start work without ambiguity.

### Deliverables
1. ✅ Edge cases documented and resolved
2. ✅ Validation rules finalized
3. ✅ Error scenarios mapped with user messages
4. ✅ Integration touchpoints with other modules clear
5. ✅ Ready for design mockups (high-fidelity wireframes)

---

## Pre-Session Review

### Documents to Read Before Session
1. [OBJECTIVE_CREATION_STRATEGY.md](../../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md) - Complete 3-screen wizard spec
2. [BETA_FINAL_STRATEGY_2026.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) - Overall strategy context
3. [objective_kr_generation_prompt.md](../../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md) - LLM prompt template

### Current State Analysis
- ✅ 3-screen flow designed
- ✅ Data model extensions specified
- ✅ LLM prompt template created
- ⚠️ Edge cases need documentation
- ⚠️ Validation rules need finalization
- ⚠️ Error messages need UX writing

---

## Session Agenda

### Part 1: Edge Cases & Scenarios (30 min)

**Questions to Answer**:

1. **What if consultant creates objective WITHOUT running assessment?**
   - Can they still create objective?
   - How do we handle missing SSI scores?
   - What happens to auto-suggestion?

2. **What if company profile is incomplete?**
   - Missing industry → Impact on KR quality?
   - Missing priorities/challenges → Fallback behavior?
   - Should we block or warn?

3. **What if behaviors aren't seeded?**
   - Database seed failed → Block creation?
   - Empty behavior list → Show error or hide section?

4. **What if consultant selects 0 behaviors?**
   - Allow it? (Make optional)
   - Warn? ("Recommended to select 1-2")
   - Block? (Require at least 1)

5. **What if consultant selects all 9 behaviors?**
   - Allow it?
   - Show warning? ("Consider focusing on 1-2 behaviors for impact")
   - Dilutes focus - how to communicate?

6. **What if LLM returns 0 KRs or invalid format?**
   - Parsing error → Fallback?
   - Timeout → Retry UX?
   - Complete failure → Manual KR entry?

7. **What if consultant wants to edit objective after creation?**
   - Can they change behaviors?
   - Can they change SSI impact?
   - What happens to existing KRs?
   - What happens to AI guidance (historical record)?

8. **What if same objective title already exists?**
   - Block duplicate? (Probably not - different periods allowed)
   - Warn? ("Similar objective exists for Q1 2026")
   - Allow completely?

**Output**: Edge case matrix with decisions

---

### Part 2: Validation Rules & Business Logic (30 min)

**Screen 1 Validation**:
```
Title:
- Required: Yes
- Min length: 10 characters (force clarity)
- Max length: 200 characters
- Uniqueness: Warn if duplicate, don't block
- Special characters: Allow (but sanitize for XSS)

SSI Impact Area:
- Required: Yes
- Valid values: speed | strength | intelligence | employee_return
- Auto-suggested: Yes (from assessment constraint)
- Override: Allowed

SSI Sub-Dimension:
- Required: No (optional but recommended)
- Valid values: 12 sub-dimensions based on area selected
- Auto-suggested: Yes (from assessment constraint)
- Show info: "ℹ️ Be more specific for better KR suggestions"

Behaviors:
- Required: No (allow 0, but warn)
- Min recommended: 1
- Max recommended: 3
- Hard max: 9 (allow but warn if >3)
- Show count: "X behaviors selected (recommended: 1-3)"

Time Period:
- Required: Yes
- Valid values: quarter | calendar_year | fiscal_year | custom
- Dates: Auto-calculated from type + year

Owner:
- Required: Yes
- Valid values: Users with appropriate roles (CONSULTANT, BUSINESS_OWNER, EXECUTIVE, MANAGER)
- Default: Current user
```

**Screen 2 Validation**:
```
LLM Generation:
- Timeout: 30 seconds max
- Retry: Allow 1 retry
- Fallback: Manual KR entry if fails
- Loading: Show progress with educational content
```

**Screen 3 Validation**:
```
Key Results:
- Min KRs: 1 required
- Max KRs: 10 (soft limit, warn if >5)
- Each KR requires: metric, target, measurement_frequency
- Current baseline: Optional ("TBD - establish baseline" allowed)

Editing:
- Allow full editing of AI-generated KRs
- Allow deletion (min 1 KR must remain)
- Allow adding manual KRs
- Track: Flag ai_generated: true/false per KR for analytics
```

**Output**: Complete validation rules document

---

### Part 3: Error Messages & UX Writing (20 min)

**Error Scenarios**:

| Scenario | Error Message | Action |
|----------|---------------|--------|
| No behaviors seeded | "System configuration error. Please contact support." | Block creation, show support email |
| LLM timeout | "AI generation is taking longer than expected. Would you like to retry or create KRs manually?" | Show [Retry] [Create Manually] buttons |
| LLM parsing error | "We couldn't generate KRs automatically. Let's create them manually." | Auto-redirect to manual KR form |
| No assessment exists | "⚠️ No assessment found. We recommend running an SSI assessment first for better KR suggestions." | Show [Run Assessment] [Continue Anyway] |
| Company profile incomplete | "ℹ️ Complete your company profile for more relevant KR suggestions." | Show [Complete Profile] [Continue] |
| 0 behaviors selected | "💡 Tip: Selecting 1-2 behaviors helps track what your team is building." | Show as info, not error |
| >3 behaviors selected | "⚠️ Consider focusing on 1-2 behaviors for maximum impact." | Show as warning, allow continue |
| Duplicate title | "ℹ️ A similar objective exists: '[Title]' (Q1 2026). Continue anyway?" | Show as info with link to existing |
| No KRs on save | "At least 1 Key Result is required." | Block save, highlight section |

**Success Messages**:

| Action | Success Message | Next Action |
|--------|----------------|-------------|
| Objective created | "Objective created successfully! Ready to create quarterly goals?" | Redirect to objective detail page |
| KRs edited | "Changes saved." | Toast notification |
| Manual KR added | "Key Result added." | Refresh KR list |

**Output**: Complete error message catalog

---

### Part 4: Integration Touchpoints (20 min)

**Dependencies & Integration Points**:

```
┌─────────────────────────────────────────────────────────────────┐
│                  OBJECTIVE CREATION WIZARD                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DEPENDS ON (reads from):                                       │
│  ├─ Assessment Module                                           │
│  │  └─ Latest assessment for SSI scores + constraint            │
│  │     └─ If missing: Show warning, allow manual selection      │
│  │                                                               │
│  ├─ Behavior Model                                              │
│  │  └─ List of active behaviors (9 Disciplines)                 │
│  │     └─ If missing: Block creation (critical)                 │
│  │                                                               │
│  ├─ Company Profile                                             │
│  │  └─ Industry, size, priorities, challenges                   │
│  │     └─ If missing: Warn, KRs will be generic                 │
│  │                                                               │
│  ├─ User/RBAC                                                   │
│  │  └─ Current user role (for permissions)                      │
│  │     └─ Must be: CONSULTANT | BUSINESS_OWNER | EXECUTIVE      │
│  │                                                               │
│  └─ LLM Orchestration Service                                   │
│     └─ Context assembly + OpenAI API                            │
│        └─ If unavailable: Fallback to manual KR entry           │
│                                                                  │
│  WRITES TO (creates):                                           │
│  ├─ Objective record                                            │
│  │  └─ With ssi_impact, behavior_ids, ai_guidance               │
│  │                                                               │
│  └─ Embedded Key Results                                        │
│     └─ 3-5 KRs with metrics, targets, frequencies               │
│                                                                  │
│  TRIGGERS (after creation):                                     │
│  ├─ Analytics update                                            │
│  │  └─ Refresh SSI coverage, behavior distribution              │
│  │                                                               │
│  └─ Redirect to Objective Detail Page                           │
│     └─ Where consultant can create quarterly goals              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints Used**:

| Endpoint | Method | Purpose | Error Handling |
|----------|--------|---------|----------------|
| `/api/assessments/latest/:companyId` | GET | Fetch latest SSI scores | Return null if none, show warning |
| `/api/behaviors` | GET | List active behaviors | Throw error if empty (seed failure) |
| `/api/companies/:companyId` | GET | Fetch company profile | Return partial if incomplete |
| `/api/ai/generate-key-results` | POST | LLM KR generation | Timeout 30s, retry once, fallback |
| `/api/objectives` | POST | Create objective | Standard validation errors |

**Output**: Integration dependency map

---

### Part 5: Design Handoff Preparation (20 min)

**What Designers Need**:

1. **Wireframe Annotations**:
   - Exact field labels
   - Placeholder text
   - Help text / tooltips
   - Error message placements
   - Button labels and states

2. **Interaction States**:
   - Default state
   - Loading state (Screen 2)
   - Error state (for each error type)
   - Success state
   - Empty states (e.g., no behaviors loaded)

3. **Responsive Behavior**:
   - Desktop (primary)
   - Tablet (supported)
   - Mobile (discouraged but graceful)

4. **Accessibility Requirements**:
   - Keyboard navigation (tab order)
   - Screen reader labels
   - Focus indicators
   - Error announcements

5. **Visual Hierarchy**:
   - Primary actions (Continue, Create Objective)
   - Secondary actions (Back, Cancel)
   - Tertiary actions (Edit, Delete KR)
   - Info/warning indicators

**Output**: Design brief document

---

## Session Deliverables

### Must Complete in Session

1. **Edge Case Decision Matrix**
   - All scenarios documented
   - Decisions made on each
   - UX implications noted

2. **Complete Validation Rules**
   - Every field validated
   - Business logic documented
   - Error conditions mapped

3. **Error Message Catalog**
   - All error scenarios
   - All success messages
   - All warning/info messages
   - Tone: Helpful, not technical

4. **Integration Dependency Map**
   - Clear dependencies identified
   - Graceful degradation specified
   - API contracts defined

5. **Design Brief**
   - Ready for high-fidelity mockups
   - All interaction states documented
   - Accessibility requirements clear

---

## Post-Session Actions

### For Product Team
- [ ] Review and approve all decisions
- [ ] Share with stakeholders for feedback
- [ ] Create design tickets

### For Design Team
- [ ] Create high-fidelity mockups (3 screens)
- [ ] Design error states
- [ ] Design loading states
- [ ] Prepare prototype for user testing

### For Engineering Team
- [ ] Review integration dependencies
- [ ] Validate API contracts
- [ ] Estimate complexity
- [ ] Identify technical risks

---

## Success Criteria

**Session is successful if**:
- ✅ All edge cases have documented decisions
- ✅ Validation rules are complete and unambiguous
- ✅ Error messages are user-friendly and helpful
- ✅ Integration dependencies are clear with fallbacks
- ✅ Design team can start mockups immediately
- ✅ Engineering team has no open questions on logic

**Ready for next phase when**:
- Design mockups created and approved
- Engineering can start technical spec
- No ambiguity remains in requirements

---

## Related Documents

**Input Documents**:
- [OBJECTIVE_CREATION_STRATEGY.md](../../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md)
- [BETA_FINAL_STRATEGY_2026.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md)

**Output Documents** (to be created in session):
- Edge Case Decision Matrix
- Validation Rules Document
- Error Message Catalog
- Integration Dependency Map
- Design Brief

**Next Session**:
- [SESSION_165_COMPANY_PROFILE.md](./SESSION_165_COMPANY_PROFILE.md)

---

**Session Owner**: Product Team
**Created**: April 20, 2026
**Status**: Planned - Ready to Execute

