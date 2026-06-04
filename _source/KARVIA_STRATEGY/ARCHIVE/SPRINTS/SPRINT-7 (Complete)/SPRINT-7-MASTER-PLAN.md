# Sprint 7 Master Plan

**Sprint**: 7
**Duration**: December 2025 (TBD exact dates)
**Goal**: Consultant Dashboard + Weekly Goals Calendar + VALUE Assessment Framework
**Total Story Points**: ~40 pts (estimated)

---

## Sprint 7 Scope

### Deferred from Sprint 6
| Epic | Points | Reason for Deferral |
|------|--------|---------------------|
| Epic 3: Consultant Dashboard | 13 pts | Prioritized P0 bug fixes and OKR consolidation first |
| Epic 4: Weekly Goals Calendar | 13 pts | Originally deferred from Sprint 6 |

### New Epics
| Epic | Points | Description |
|------|--------|-------------|
| Epic 8: VALUE Assessment Framework | ~14 pts | 78 questions, 7 pillars (designed Dec 1) |

---

## Sprint 7 Epics

### Epic 3: Consultant Dashboard (13 pts)
**Priority**: P1 - HIGH
**Estimated Hours**: 8h (70% routes already exist in businesses.js)
**Status**: Deferred from Sprint 6

#### Audit Findings (Nov 26)
- ✅ 70% of backend routes already exist in `businesses.js`
- ✅ Company management endpoints working
- ⏳ Need: Dashboard UI, company list view, quick actions

#### Tasks:
1. **Dashboard UI** (3h)
   - Company list with SSI status indicators
   - Quick action buttons
   - Search and filter functionality

2. **Company Detail View** (2h)
   - Full company profile display
   - Team overview
   - Assessment status

3. **Multi-Company Management** (2h)
   - Switch between companies
   - Bulk actions
   - Notifications

4. **Testing** (1h)
   - E2E tests for consultant flows
   - Permission validation

---

### Epic 4: Weekly Goals Calendar (13 pts)
**Priority**: P1 - HIGH
**Estimated Hours**: 10h
**Status**: Deferred from Sprint 6

#### Tasks:
1. Calendar View Component (4h)
2. Goal Assignment UI (3h)
3. Status Management (2h)
4. Testing (1h)

---

### Epic 8: VALUE Assessment Framework (14 pts)
**Priority**: P1 - HIGH
**Estimated Hours**: 14h
**Status**: Design Complete (Dec 1)

#### Design Summary
**See**: VALUE Assessment Framework Design (Dec 1 Strategy Session)

**Framework**:
- 78 questions across 7 VALUE pillars
- V: Vision & Strategy (12 questions)
- A: Agility & Speed (11 questions)
- L: Leadership & Strength (11 questions)
- U: Understanding & Intelligence (11 questions)
- E: Execution & Operations (11 questions)
- T: Team & Culture (11 questions)
- I: Innovation & Growth (11 questions)

#### Tasks:
1. **Question Bank Implementation** (4h)
   - Create VALUE question models
   - Seed 78 questions to database
   - Category/pillar mappings

2. **Assessment Flow** (4h)
   - Multi-pillar assessment UI
   - Progress tracking
   - Response validation

3. **Scoring Engine** (3h)
   - Pillar-level scoring
   - Overall VALUE score calculation
   - Diagnostic recommendations

4. **Integration** (2h)
   - Connect to OKR generation
   - Dashboard display
   - Reports

5. **Testing** (1h)
   - Unit tests for scoring
   - E2E assessment flow

---

## Sprint 7 Schedule (Tentative)

| Week | Focus | Epics |
|------|-------|-------|
| Week 1 | Consultant Dashboard | Epic 3 |
| Week 2 | Weekly Goals + VALUE Start | Epic 4, Epic 8 Phase 1 |
| Week 3 | VALUE Assessment | Epic 8 Phases 2-4 |
| Week 4 | Testing & Polish | All epics testing |

---

## Dependencies

| Epic | Depends On | Status |
|------|-----------|--------|
| Epic 3 | Businesses API | ✅ Ready (70% complete) |
| Epic 4 | Goals API | ✅ Ready |
| Epic 8 | Assessment Models | ✅ Ready |

---

## Success Criteria

- [ ] Consultant can view and manage multiple companies
- [ ] Weekly goals calendar functional
- [ ] VALUE assessment complete with 78 questions
- [ ] VALUE scores integrate with OKR generation
- [ ] All features tested and documented

---

*Created: December 1, 2025*
*Status: Planning*
