# EPIC 1: Trust Score Foundation - Minimal API Integration

**Epic ID**: SPRINT-10-EPIC-1
**Created**: December 21, 2025
**Updated**: December 21, 2025
**Status**: Planning
**Priority**: P0
**Story Points**: 21 (reduced from 55)
**Sprints**: 10

---

## Executive Summary

This EPIC establishes the **minimal integration** between Karvia Business and iBrain using a **pure API-only approach**:

1. **Karvia stores ONLY ID mappings** (4 lines of model changes)
2. **All intelligence stays in iBrain** (scores, consent, profiles)
3. **Karvia fetches via API** (no local caching of scores)
4. **Single source of truth** in iBrain

**Design Philosophy**: Karvia = Frontend/UI, iBrain = Intelligence Backend. No data duplication.

---

## Architecture: API-Only Integration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KARVIA BUSINESS (Frontend)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │    Company       │    │      User        │    │   Assessment     │      │
│  │                  │    │                  │    │                  │      │
│  │ • ibrain_company │    │ • ibrain_member  │    │ • responses[]    │      │
│  │   _id (string)   │    │   _id (string)   │    │ • ssi_scores     │      │
│  │                  │    │                  │    │                  │      │
│  │ (2 lines only)   │    │ (2 lines only)   │    │ (NO CHANGES)     │      │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘      │
│           │                       │                       │                │
│           └───────────────────────┼───────────────────────┘                │
│                                   │                                        │
│                      ┌────────────▼────────────┐                           │
│                      │    iBrainClient.js      │                           │
│                      │    (~100 lines)         │                           │
│                      │                         │                           │
│                      │ • registerCompany()     │                           │
│                      │ • registerMember()      │                           │
│                      │ • submitAssessment()    │                           │
│                      │ • getTrustScore()       │                           │
│                      └────────────┬────────────┘                           │
│                                   │                                        │
└───────────────────────────────────┼────────────────────────────────────────┘
                                    │ HTTPS + API Key
                                    │
┌───────────────────────────────────▼────────────────────────────────────────┐
│                         iBRAIN (Intelligence Backend)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SINGLE SOURCE OF TRUTH                            │   │
│  │                                                                      │   │
│  │  • Company profiles & registration                                   │   │
│  │  • Member profiles & consent                                         │   │
│  │  • Trust Scores (T, F, C)                                           │   │
│  │  • Passion Profiles (IKIGAI)                                        │   │
│  │  • Execution Scores                                                  │   │
│  │  • Empathy Scores                                                    │   │
│  │  • Industry Benchmarks                                               │   │
│  │  • Action Plans                                                      │   │
│  │  • Nudge Rules                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Karvia Model Changes (4 Lines Total)

### Company Model
**File**: [server/models/Company.js](../../../../server/models/Company.js)
**Location**: After line 128 (after `assessment_scores`)

```javascript
// iBrain Universal Identity - ID mapping only
ibrain_company_id: {
  type: String,
  index: true,
  sparse: true,
  description: 'iBrain company ID (IB-CO-xxxxxxxx)'
},
ibrain_registered_at: {
  type: Date,
  description: 'When company was registered with iBrain'
}
```

### User Model
**File**: [server/models/User.js](../../../../server/models/User.js)
**Location**: After line 267 (before timestamps)

```javascript
// iBrain Universal Identity - ID mapping only
ibrain_member_id: {
  type: String,
  index: true,
  sparse: true,
  description: 'iBrain member ID (IB-MEM-xxxxxxxx)'
},
ibrain_registered_at: {
  type: Date,
  description: 'When user was registered with iBrain'
}
```

**That's it. No other model changes needed.**

---

## What Karvia Does NOT Store

| Data | Why Not | Access Method |
|------|---------|---------------|
| Trust Score | iBrain calculates & stores | `GET /scores/trust/:id` |
| Trust Score History | iBrain tracks trends | Included in API response |
| Consent Preferences | iBrain manages GDPR | `GET/PUT /identity/consent/:id` |
| Passion Profile | iBrain stores IKIGAI | `GET /profiles/passion/:id` |
| Passion Match Scores | iBrain calculates | `POST /intelligence/passion-match` |
| Industry Weights | iBrain benchmarks | Included in score response |
| Empathy Score | iBrain aggregates | `GET /scores/empathy/:id` |
| Action Plans | iBrain generates | `GET /intelligence/action-plan/:id` |

---

## iBrainClient Service

**New File**: `server/services/iBrainClient.js` (~100 lines)

```javascript
/**
 * iBrain API Client - Thin wrapper for iBrain communication
 * All intelligence stays in iBrain, Karvia just displays
 */
const axios = require('axios');

class iBrainClient {
  static BASE_URL = process.env.IBRAIN_API_URL || 'http://localhost:8000';
  static API_KEY = process.env.IBRAIN_API_KEY;
  static APP_ID = 'APP-KARVIA-BIZ';

  static headers() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.API_KEY,
      'X-App-ID': this.APP_ID
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // IDENTITY REGISTRATION (One-time per company/user)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Register a company with iBrain
   * @param {Object} company - Karvia company document
   * @returns {Object} { ibrain_company_id, weights, registered_at }
   */
  static async registerCompany(company) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/identity/company/register`,
      {
        external_id: company._id.toString(),
        name: company.name,
        industry: company.industry,
        size_category: company.size_category,
        employee_count: company.employee_count,
        fiscal_year_start: company.settings?.fiscal_year_start || 1
      },
      { headers: this.headers() }
    );
    return response.data;
  }

  /**
   * Register a member with iBrain
   * @param {Object} user - Karvia user document
   * @param {String} ibrainCompanyId - iBrain company ID
   * @returns {Object} { ibrain_member_id, composite_key, registered_at }
   */
  static async registerMember(user, ibrainCompanyId) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/identity/member/register`,
      {
        external_id: user._id.toString(),
        ibrain_company_id: ibrainCompanyId,
        email: user.email,
        role: user.role,
        consent: {
          assessment_data: true,
          behavioral_tracking: true,
          aggregated_scoring: true
        }
      },
      { headers: this.headers() }
    );
    return response.data;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // DATA SUBMISSION (After assessments/events)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Submit assessment responses to iBrain
   * @param {String} ibrainCompanyId - iBrain company ID
   * @param {String} ibrainMemberId - iBrain member ID
   * @param {Object} assessment - Assessment document
   */
  static async submitAssessment(ibrainCompanyId, ibrainMemberId, assessment) {
    const response = await axios.post(
      `${this.BASE_URL}/api/v1/ingest/assessment`,
      {
        company_id: ibrainCompanyId,
        member_id: ibrainMemberId,
        assessment_type: assessment.assessment_type,
        ssi_scores: assessment.ssi_scores,
        dimension_scores: assessment.dimension_scores,
        responses: assessment.responses.map(r => ({
          question_id: r.question_id,
          dimension: r.dimension,
          response_value: r.response_value,
          normalized_value: r.normalized_value,
          answer_type: r.answer_type
        })),
        completed_at: assessment.completed_at
      },
      { headers: this.headers() }
    );
    return response.data;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SCORE RETRIEVAL (Display in Karvia UI)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get Trust Score for a company
   * Returns everything needed for dashboard display
   */
  static async getTrustScore(ibrainCompanyId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/scores/trust/${ibrainCompanyId}`,
      { headers: this.headers() }
    );
    return response.data;
    // Returns: { overall, transparency, feedback, culture, trend, alerts, weights }
  }

  /**
   * Get Category KPIs for a company
   */
  static async getCategoryKPIs(ibrainCompanyId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/scores/category-kpis/${ibrainCompanyId}`,
      { headers: this.headers() }
    );
    return response.data;
  }

  /**
   * Get Empathy Score (aggregate only)
   */
  static async getEmpathyScore(ibrainCompanyId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/scores/empathy/${ibrainCompanyId}`,
      { headers: this.headers() }
    );
    return response.data;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CONSENT MANAGEMENT (GDPR compliance)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Get consent preferences for a member
   */
  static async getConsent(ibrainMemberId) {
    const response = await axios.get(
      `${this.BASE_URL}/api/v1/identity/consent/${ibrainMemberId}`,
      { headers: this.headers() }
    );
    return response.data;
  }

  /**
   * Update consent preferences for a member
   */
  static async updateConsent(ibrainMemberId, consent) {
    const response = await axios.put(
      `${this.BASE_URL}/api/v1/identity/consent/${ibrainMemberId}`,
      { consent },
      { headers: this.headers() }
    );
    return response.data;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // FEATURE CHECK (Graceful degradation)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Check if iBrain is available
   */
  static async healthCheck() {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/health`,
        { headers: this.headers(), timeout: 2000 }
      );
      return response.data.status === 'healthy';
    } catch {
      return false;
    }
  }
}

module.exports = iBrainClient;
```

---

## User Stories

### US-1.1: Company Registration with iBrain
**As** a Karvia system
**I want** to register companies with iBrain when they complete their first SSI assessment
**So that** they get a universal iBrain company ID

**Acceptance Criteria**:
- [ ] On SSI assessment completion, check `company.ibrain_company_id`
- [ ] If null, call `iBrainClient.registerCompany(company)`
- [ ] Store returned `IB-CO-xxxxxxxx` in `company.ibrain_company_id`
- [ ] Store `ibrain_registered_at` timestamp
- [ ] Continue with normal assessment flow

**Implementation**:
```javascript
// In Assessment post-save hook (Assessment.js line 924)
assessmentSchema.post('save', async function(doc) {
  if (doc.status === 'completed' && doc.assessment_type === 'ssi') {
    const Company = mongoose.model('Company');
    const company = await Company.findById(doc.company_id);

    // Register with iBrain if not already
    if (!company.ibrain_company_id) {
      try {
        const result = await iBrainClient.registerCompany(company);
        company.ibrain_company_id = result.ibrain_company_id;
        company.ibrain_registered_at = new Date();
        await company.save();
      } catch (error) {
        console.error('iBrain registration failed:', error.message);
        // Graceful degradation - continue without iBrain
      }
    }

    // ... existing logic
  }
});
```

---

### US-1.2: Member Registration with iBrain
**As** a Karvia system
**I want** to register users with iBrain when they start an assessment
**So that** they get a universal iBrain member ID

**Acceptance Criteria**:
- [ ] On assessment start, check `user.ibrain_member_id`
- [ ] If null and company is registered, call `iBrainClient.registerMember()`
- [ ] Store returned `IB-MEM-xxxxxxxx` in `user.ibrain_member_id`
- [ ] Store `ibrain_registered_at` timestamp

**Implementation**:
```javascript
// In Assessment pre-save or route handler
if (!user.ibrain_member_id && company.ibrain_company_id) {
  try {
    const result = await iBrainClient.registerMember(user, company.ibrain_company_id);
    user.ibrain_member_id = result.ibrain_member_id;
    user.ibrain_registered_at = new Date();
    await user.save();
  } catch (error) {
    console.error('iBrain member registration failed:', error.message);
  }
}
```

---

### US-1.3: Assessment Data Submission
**As** a Karvia system
**I want** to submit completed assessment data to iBrain
**So that** iBrain can calculate Trust Score components

**Acceptance Criteria**:
- [ ] On assessment completion, call `iBrainClient.submitAssessment()`
- [ ] Include SSI scores, dimension scores, and responses
- [ ] Handle errors gracefully (don't block assessment completion)

**Implementation**:
```javascript
// In Assessment post-save hook, after registration
if (company.ibrain_company_id && user.ibrain_member_id) {
  try {
    await iBrainClient.submitAssessment(
      company.ibrain_company_id,
      user.ibrain_member_id,
      doc
    );
  } catch (error) {
    console.error('iBrain assessment submission failed:', error.message);
  }
}
```

---

### US-1.4: Trust Score Display Widget
**As** a business owner
**I want** to see the Trust Score on my dashboard
**So that** I understand team health at a glance

**Acceptance Criteria**:
- [ ] Dashboard fetches Trust Score from iBrain via API
- [ ] Display triangle widget with T/F/C breakdown
- [ ] Show trend indicator (↗️ ↘️ →)
- [ ] Handle iBrain unavailable gracefully (show SSI only)

**Frontend Implementation**:
```javascript
// client/js/trust-score-widget.js
async function loadTrustScore(companyId) {
  const company = await fetch(`/api/companies/${companyId}`).then(r => r.json());

  if (!company.ibrain_company_id) {
    // Not registered with iBrain yet - show SSI only
    return showSSIFallback(company.assessment_scores);
  }

  try {
    const trustScore = await fetch(`/api/ibrain/trust-score/${company.ibrain_company_id}`)
      .then(r => r.json());

    renderTrustTriangle(trustScore);
  } catch (error) {
    // iBrain unavailable - graceful degradation
    showSSIFallback(company.assessment_scores);
  }
}
```

---

### US-1.5: Consent Management UI
**As** a user
**I want** to manage my consent preferences
**So that** I control what data is shared with iBrain

**Acceptance Criteria**:
- [ ] Add consent toggles to user profile page
- [ ] Fetch current consent from iBrain API
- [ ] Update consent via iBrain API on toggle
- [ ] Show last updated timestamp

**Note**: Consent is stored in iBrain, not Karvia. Karvia UI just calls iBrain APIs.

---

## API Route (Proxy to iBrain)

**New File**: `server/routes/ibrain.js` (~50 lines)

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const iBrainClient = require('../services/iBrainClient');

// Proxy route for Trust Score
router.get('/trust-score/:ibrainCompanyId', authenticateToken, async (req, res) => {
  try {
    const score = await iBrainClient.getTrustScore(req.params.ibrainCompanyId);
    res.json(score);
  } catch (error) {
    res.status(503).json({
      error: 'iBrain unavailable',
      fallback: 'ssi_only'
    });
  }
});

// Proxy route for consent
router.get('/consent/:ibrainMemberId', authenticateToken, async (req, res) => {
  try {
    const consent = await iBrainClient.getConsent(req.params.ibrainMemberId);
    res.json(consent);
  } catch (error) {
    res.status(503).json({ error: 'iBrain unavailable' });
  }
});

router.put('/consent/:ibrainMemberId', authenticateToken, async (req, res) => {
  try {
    const result = await iBrainClient.updateConsent(
      req.params.ibrainMemberId,
      req.body.consent
    );
    res.json(result);
  } catch (error) {
    res.status(503).json({ error: 'iBrain unavailable' });
  }
});

module.exports = router;
```

---

## Environment Variables

```bash
# .env additions
IBRAIN_API_URL=http://localhost:8000
IBRAIN_API_KEY=kb_xxxxxxxxxxxxxxxx
FEATURE_IBRAIN_ENABLED=true
```

---

## Implementation Checklist

### Week 1: Core Integration
- [ ] Add 2 fields to Company model (ibrain_company_id, ibrain_registered_at)
- [ ] Add 2 fields to User model (ibrain_member_id, ibrain_registered_at)
- [ ] Create iBrainClient.js service (~100 lines)
- [ ] Create ibrain.js route file (~50 lines)
- [ ] Add environment variables

### Week 2: Triggers & UI
- [ ] Add registration trigger in Assessment post-save hook
- [ ] Add assessment submission trigger
- [ ] Create Trust Score widget component (~100 lines)
- [ ] Add consent UI to user profile (~50 lines)
- [ ] Add graceful degradation logic

---

## Code Metrics

| Component | Lines | Notes |
|-----------|-------|-------|
| Company model change | 2 | Two fields |
| User model change | 2 | Two fields |
| iBrainClient.js | ~100 | API wrapper |
| ibrain.js routes | ~50 | Proxy endpoints |
| Trust Score widget | ~100 | Frontend display |
| Consent UI | ~50 | Profile settings |
| **Total New Karvia Code** | **~304 lines** | |

---

## Dependencies

| Dependency | Status | Risk | Mitigation |
|------------|--------|------|------------|
| iBrain API | In development | Medium | Feature flag + fallback to SSI |
| Network | N/A | Low | Timeout handling |
| axios | Already installed | None | - |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Registration success rate | >99% | Companies/users registered |
| API response time | <500ms | Trust score fetch |
| Graceful degradation | 100% | Fallback works when iBrain down |
| Code changes | <350 lines | Minimal footprint |

---

## Related Documents

- [EPIC-2-TRUST-SCORE-CALCULATION.md](./EPIC-2-TRUST-SCORE-CALCULATION.md) - iBrain calculation layer
- [iBrain MVP Strategy](../../../../../iBrain/IBRAIN_STRATEGY/IBRAIN_MVP_STRATEGY_EXTERNAL_APPS.md)

---

**EPIC Owner**: Karvia Team
**Sprint Target**: Sprint 10
**Story Points**: 21
