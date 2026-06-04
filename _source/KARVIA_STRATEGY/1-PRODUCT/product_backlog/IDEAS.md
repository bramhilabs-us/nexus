# Ideas Backlog

<!-- @GENOME T2-PRD-045 | ACTIVE | 2026-04-01 | parent:T2-PRD-044 | auto:/strategy | linked:/general -->

**Purpose**: Capture raw ideas, research questions, user feedback, and strategic explorations before validation.

**Last Updated**: April 1, 2026

---

## How Ideas Flow

```
NEW ──► RESEARCHING ──► VALIDATED ──► [MASTER_PRODUCT_BACKLOG.md]
  │                          │
  └──► PARKED               └──► Rejected (with reason)
```

**Promotion Criteria**:
- Clear problem statement
- Estimated value/impact
- Technical feasibility assessed
- Aligns with current roadmap phase

---

## Quick Add Idea

```markdown
### IDEA-XXX: [Title]
**Status**: NEW
**Source**: [User feedback / Internal / Competitor / Research]
**Date**: YYYY-MM-DD
**Priority**: Low | Medium | High

**Problem**: [What problem does this solve?]

**Research Questions**:
- [ ] Question 1?
- [ ] Question 2?

**Next Action**: [What needs to happen?]
```

---

## Active Ideas

### IDEA-003: Real-Time Pulse Surveys
**Status**: `RESEARCHING`
**Source**: Competitor analysis
**Date**: 2025-12-15
**Priority**: Medium

**Problem**: Full SSI assessments are infrequent. Teams need lightweight check-ins between assessments.

**Research Questions**:
- [ ] What's the ideal frequency? (Weekly vs bi-weekly)
- [ ] How many questions per pulse? (3-5 suggested)
- [ ] How to prevent survey fatigue?
- [ ] How do pulse trends predict full assessment scores?

**Potential Value**: Earlier detection of issues, higher engagement, trend visualization

**Next Action**: Evaluate after beta - collect feedback on assessment frequency

---

### IDEA-004: Industry Benchmarking
**Status**: `NEW`
**Source**: Sales conversations
**Date**: 2025-11-20
**Priority**: Medium

**Problem**: Companies want to compare their SSI scores against industry averages.

**Research Questions**:
- [ ] How many customers needed for valid benchmarks? (Min 30 per industry?)
- [ ] Privacy concerns with aggregated data?
- [ ] How to handle outliers?
- [ ] Regional vs national benchmarks?

**Privacy Considerations**: All data anonymized, minimum sample size, opt-in

**Next Action**: Requires significant customer base - post-beta consideration

---

### IDEA-006: Manager Coaching Recommendations
**Status**: `NEW`
**Source**: Internal brainstorming
**Date**: 2025-12-15
**Priority**: Low

**Problem**: Managers don't know how to address team SSI gaps.

**Concept**:
- If team scores low on "Decision Speed" → Suggest delegation training
- If team scores low on "Learning Culture" → Suggest knowledge sharing sessions

**Next Action**: Part of iBrain layer - future roadmap

---

### IDEA-008: External Stakeholder Assessments
**Status**: `PARKED`
**Source**: Consultant request
**Date**: 2025-12-20
**Priority**: Low

**Problem**: Want customers/vendors to provide external perspective on business health.

**Reason Parked**: Complex identity verification, privacy implications, limited beta value

**Revisit**: Post-beta if consultants request frequently

---

### IDEA-009: YSELA Mobile Companion
**Status**: `NEW`
**Source**: Product vision
**Date**: 2026-03-15
**Priority**: Medium

**Problem**: Team members need quick access to daily tasks and check-ins on mobile.

**Research Questions**:
- [ ] PWA vs native app?
- [ ] Which features mobile-critical?
- [ ] Offline requirements?

**Next Action**: Evaluate after beta feedback on access patterns

---

### IDEA-007: Behavior Gamification
**Status**: `PARKED`
**Source**: User feedback
**Date**: 2025-11-15
**Priority**: Low

**Problem**: Want badges, streaks, leaderboards to encourage engagement.

**Reason Parked**: May conflict with psychological safety needed for honest responses. GRIT framework emphasizes intrinsic motivation over extrinsic rewards.

**Revisit**: Research gamification in behavior change contexts

---

## User Feedback Queue

*Items from beta user feedback - to be triaged into Ideas*

| Date | Source | Feedback | Triaged |
|------|--------|----------|---------|
| - | - | Pre-beta (launching April 10) | - |

---

## Validated & Delivered

*Ideas that were promoted to backlog and have shipped*

| ID | Title | Validated | Delivered | Sprint |
|----|-------|-----------|-----------|--------|
| IDEA-001 | SSI Framework Validation | 2025-12 | 2026-01 | Sprint 9 |
| IDEA-002 | Industry Question Variants | 2025-12 | 2026-01 | Sprint 11 |
| IDEA-005 | AI-Powered Insights | 2025-11 | 2026-02 | Sprint 13 (AIContextService) |

---

## Rejected Ideas

### REJ-001: Anonymous Feedback Chat
**Rejected**: 2025-12-01
**Reason**: High risk of misuse, moderation complexity, doesn't align with GRIT transparency principles

### REJ-002: Public Company Profiles
**Rejected**: 2026-01-15
**Reason**: Privacy concerns, competitive sensitivity, no clear customer demand

---

## Metrics

| Status | Count |
|--------|-------|
| NEW | 3 |
| RESEARCHING | 1 |
| PARKED | 2 |
| Delivered | 3 |
| Rejected | 2 |

---

## Maintenance

**Weekly**: Triage user feedback queue
**After Sprint**: Review RESEARCHING items for progress
**Quarterly**: Archive old PARKED items, clean up rejected list
