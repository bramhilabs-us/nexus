# EPIC: Trust Score - Human Element Intelligence System

**Epic ID**: SPRINT-10-EPIC-A
**Created**: December 21, 2025
**Status**: Planning
**Priority**: P0
**Story Points**: 45 (estimated)
**Dependencies**: iBrain Integration, Assessment System

---

## Executive Summary

The Trust Score system introduces a **Human Element Intelligence Layer** to Karvia Business, displayed as a **Triangle Icon** representing the weighted average of three core components: **Transparency**, **Feedback**, and **Culture**. This epic establishes Karvia Business as a **frontend data collection app** that submits behavioral and assessment data to **iBrain** (Intelligence Backend) for ML-powered scoring and analysis.

---

## Strategic Vision

```
            TRANSPARENCY
                 /\
                /  \
               / 🔺 \      Trust Score =
              /  TS  \     f(T × Wt + F × Wf + C × Wc)
             /________\
      FEEDBACK         CULTURE
```

### The Doctor Analogy

| Medical | Trust Score System |
|---------|-------------------|
| Blood Test | SSI Score (Speed, Strength, Intelligence) |
| Lifestyle Assessment | Trust Score (Transparency, Feedback, Culture) |
| Symptoms | Category KPIs (Growth, Ops, etc.) |
| Diagnosis | Combined analysis |
| Treatment Plan | 12-month Action Plan (LLM-generated) |

---

## Architecture: Karvia ↔ iBrain Separation

### Karvia Business (Frontend App)
- User Interface & Data Collection
- Consent Management
- Display Scores (received from iBrain)
- OKR Management (local business logic)
- Document Upload UI
- Nudge Display System

### iBrain (Intelligence Backend)
- Universal Identity (company_id, member_id)
- ML Score Calculations (SSI, Trust, Empathy)
- Industry Benchmarks Database
- LLM-Powered Analysis
- Action Plan Generation
- Qualitative Response Analysis

---

## User Stories

### Epic A.1: Universal Identity Integration

**US-A.1.1**: As a Karvia admin, I want to register my company with iBrain so that I receive a universal company_id for all future interactions.

**Acceptance Criteria**:
- [ ] POST to iBrain `/api/v1/identity/company/register` with company profile
- [ ] Receive `ibrain_company_id` (format: `IB-CO-xxxxxxxx`)
- [ ] Store mapping: `karvia_company_id` ↔ `ibrain_company_id`
- [ ] Company profile includes: industry, size, region, fiscal_year_start

**US-A.1.2**: As a Karvia user, I want my profile linked to iBrain so that my assessments contribute to company scores.

**Acceptance Criteria**:
- [ ] POST to iBrain `/api/v1/identity/member/register` with user profile
- [ ] Receive `ibrain_member_id` (format: `IB-MEM-xxxxxxxx`)
- [ ] Composite key: `IB-CO-xxx:IB-MEM-xxx` stored for reference
- [ ] Consent preferences captured and stored

**US-A.1.3**: As a user, I want to manage my consent preferences so that I control what data is shared.

**Acceptance Criteria**:
- [ ] UI to toggle: assessment_data, behavioral_tracking, aggregated_scoring
- [ ] Consent stored in iBrain via `/api/v1/identity/consent`
- [ ] Changes are audited with timestamps

---

### Epic A.2: Assessment Data Submission

**US-A.2.1**: As a Karvia system, I want to submit assessment responses to iBrain so that scores can be calculated.

**Acceptance Criteria**:
- [ ] POST to iBrain `/api/v1/ingest/assessment` with response batch
- [ ] Include: company_id, member_id, question_id, response_type, value, timestamp
- [ ] Both quantitative (%) and qualitative (text) responses supported
- [ ] Consent verification included in payload

**US-A.2.2**: As a Karvia system, I want to submit behavioral events so that engagement patterns are tracked.

**Acceptance Criteria**:
- [ ] POST to iBrain `/api/v1/ingest/native` (Universal Adapter)
- [ ] Events: login, view_dashboard, complete_goal, submit_assessment
- [ ] HMAC signature validation
- [ ] Batch event processing supported

**US-A.2.3**: As a Karvia admin, I want to upload documents as proof so that Trust Score has evidence backing.

**Acceptance Criteria**:
- [ ] Document upload UI (PDF, DOCX, TXT)
- [ ] POST to iBrain `/api/v1/ingest/document` with file reference
- [ ] iBrain extracts relevance proof via NLP
- [ ] Document linked to specific KPIs

---

### Epic A.3: Trust Score Display

**US-A.3.1**: As a business owner, I want to see the Trust Score triangle on my dashboard so that I understand team health at a glance.

**Acceptance Criteria**:
- [ ] GET from iBrain `/api/v1/scores/trust/{company_id}`
- [ ] Display triangle icon with T/F/C breakdown
- [ ] Show overall score (0-100) in center
- [ ] Color coding: Green (70+), Yellow (50-69), Red (<50)

**US-A.3.2**: As a manager, I want to see Trust Score trends so that I can track improvement over time.

**Acceptance Criteria**:
- [ ] Historical Trust Score data displayed (30/60/90 days)
- [ ] Trend indicator: ↗️ Up, → Stable, ↘️ Down
- [ ] Change delta shown (e.g., +5 from last month)

**US-A.3.3**: As a business owner, I want to see category-specific human element KPIs so that I know which areas need attention.

**Acceptance Criteria**:
- [ ] GET from iBrain `/api/v1/scores/category-kpis/{company_id}`
- [ ] Display per category: health_score, team_owner, direction
- [ ] KPIs: confidence_index, burnout_risk, collaboration_friction
- [ ] Alerts for declining categories

---

### Epic A.4: Empathy Score & Nudging

**US-A.4.1**: As a manager, I want to see team empathy scores (aggregate only) so that I can improve team dynamics.

**Acceptance Criteria**:
- [ ] GET from iBrain `/api/v1/scores/empathy/{company_id}`
- [ ] Aggregate only (no individual scores for privacy)
- [ ] Qualitative themes extracted (e.g., "communication_gaps")
- [ ] Minimum 4 responses required to display

**US-A.4.2**: As an admin, I want to configure nudge rules so that managers receive timely reminders.

**Acceptance Criteria**:
- [ ] Admin UI for nudge configuration
- [ ] Triggers: empathy_score < threshold, trust_score drop > X points
- [ ] Actions: notification, suggested conversation prompts
- [ ] Tone setting: supportive, direct, urgent

**US-A.4.3**: As a manager, I want to receive empathy-forward nudges so that I can address team concerns proactively.

**Acceptance Criteria**:
- [ ] Nudge messages displayed in-app
- [ ] Messages are positive-framed (not blame-focused)
- [ ] Includes specific, actionable suggestions
- [ ] Links to relevant resources

---

### Epic A.5: Action Plan Integration

**US-A.5.1**: As a business owner, I want to receive a 12-month action plan based on Trust Score so that I have a roadmap for improvement.

**Acceptance Criteria**:
- [ ] GET from iBrain `/api/v1/intelligence/action-plan/{company_id}`
- [ ] Quarterly breakdown with specific actions
- [ ] Aligned to lowest Trust Score component
- [ ] Expected impact shown per action

**US-A.5.2**: As a consultant, I want to review and adjust AI-generated action plans so that recommendations are validated.

**Acceptance Criteria**:
- [ ] Human-in-the-loop review gate for high-impact suggestions
- [ ] Approve/Reject/Modify options
- [ ] Feedback stored for LLM learning

---

## Technical Specifications

### API Integration Points (Karvia → iBrain)

| Endpoint | Method | Purpose | Engine |
|----------|--------|---------|--------|
| `/api/v1/identity/company/register` | POST | Register company | IAM |
| `/api/v1/identity/member/register` | POST | Register member | IAM |
| `/api/v1/identity/consent` | PUT | Update consent | IAM |
| `/api/v1/ingest/assessment` | POST | Submit assessments | Assessment |
| `/api/v1/ingest/native` | POST | Submit events | Universal Adapter |
| `/api/v1/ingest/document` | POST | Submit documents | Observer |
| `/api/v1/scores/ssi/{company_id}` | GET | Get SSI Score | Scoring |
| `/api/v1/scores/trust/{company_id}` | GET | Get Trust Score | Scoring |
| `/api/v1/scores/category-kpis/{company_id}` | GET | Get Category KPIs | Scoring |
| `/api/v1/scores/empathy/{company_id}` | GET | Get Empathy Score | Intelligence |
| `/api/v1/intelligence/action-plan/{company_id}` | GET | Get Action Plan | Intelligence |

### Data Models (Karvia Side)

```javascript
// Company iBrain Integration
{
  ibrain_integration: {
    company_id: String,        // IB-CO-xxxxxxxx
    registered_at: Date,
    last_sync: Date,
    consent_version: String
  }
}

// User iBrain Integration
{
  ibrain_integration: {
    member_id: String,         // IB-MEM-xxxxxxxx
    composite_key: String,     // IB-CO-xxx:IB-MEM-xxx
    consent: {
      assessment_data: Boolean,
      behavioral_tracking: Boolean,
      aggregated_scoring: Boolean
    }
  }
}
```

### UI Components Required

1. **Trust Score Triangle Widget**
   - SVG triangle with animated segments
   - Tooltips showing T/F/C breakdown
   - Click to expand details

2. **Category Coverage Enhancement**
   - Add "Team Health" indicator per category
   - Human Element Score badge
   - Direction arrow

3. **Consent Management Panel**
   - Toggle switches per consent type
   - Last updated timestamp
   - Clear privacy explanation

4. **Nudge Notification Component**
   - In-app notification banner
   - Empathy-forward messaging
   - Action buttons

5. **Admin Nudge Configuration**
   - Threshold sliders
   - Action checkboxes
   - Tone selector

---

## Dependencies

### iBrain Requirements (Must be completed first)

| Component | Current Status | Required for MVP |
|-----------|---------------|------------------|
| IAM Engine | 20% (Skeleton) | **50%** - Identity APIs |
| Scoring Engine | 100% (Production) | Add Trust Score calculation |
| Assessment Engine | 20% (Skeleton) | **60%** - Qualitative analysis |
| Universal Adapter | 100% (Production) | Karvia event mapping |
| Intelligence Service | 80% (Active) | Action plan generation |
| Observer Engine | 100% (Production) | Industry benchmarks |

### Karvia Requirements

| Component | Current Status | Required |
|-----------|---------------|----------|
| Assessment System | 100% | Integration with iBrain |
| Company Model | 100% | Add ibrain_integration field |
| User Model | 100% | Add ibrain_integration field |
| Dashboard | 90% | Add Trust Score widget |
| Objectives Page | 95% | Enhance Category Coverage |

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Add iBrain integration fields to Company/User models
- [ ] Create iBrain API client service
- [ ] Implement identity registration flow
- [ ] Consent management UI

### Phase 2: Data Submission (Week 3-4)
- [ ] Assessment response submission to iBrain
- [ ] Behavioral event tracking integration
- [ ] Document upload flow

### Phase 3: Score Display (Week 5-6)
- [ ] Trust Score triangle widget
- [ ] Category KPI enhancement
- [ ] Trend visualization

### Phase 4: Nudging & Actions (Week 7-8)
- [ ] Empathy score display
- [ ] Nudge configuration admin
- [ ] Action plan display
- [ ] Human review gate

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Identity Registration | 100% | All companies/users linked to iBrain |
| Assessment Sync | <500ms | Latency for score retrieval |
| Trust Score Adoption | 80% | Users viewing Trust Score weekly |
| Nudge Response Rate | 60% | Managers acting on nudges |
| Action Plan Completion | 40% | Q1 actions completed |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| iBrain IAM not ready | High | Fallback to mock data for dev |
| Privacy concerns | Medium | Clear consent UI, aggregate-only display |
| LLM hallucination | Medium | Human review gate for recommendations |
| API latency | Medium | Caching layer, async updates |

---

## Related Documents

- [iBrain MVP Strategy](../../../../../iBrain/IBRAIN_STRATEGY/IBRAIN_MVP_STRATEGY_KARVIA.md)
- [iBrain Universal Identity Strategy](../../../../../iBrain/IBRAIN_STRATEGY/1-PRODUCT/strategy/04-vision/UNIVERSAL_IDENTITY_STRATEGY.md)
- [Prodify Integration Guide](../../../../../iBrain/External_App_Integration/PRODIFY_IBRAIN_INTEGRATION_GUIDE.md)
- [Trust Score Discussion](#) - This planning session

---

**Epic Owner**: Product Team
**Technical Lead**: TBD
**iBrain Liaison**: TBD
**Sprint Target**: Sprint 10-12
