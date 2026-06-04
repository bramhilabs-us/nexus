# iBrain Integration Model

**Document**: Complete iBrain architecture, toggle model, and business relationship
**Last Updated**: October 21, 2025
**Owner**: Technical Strategy + Product Strategy

---

## 🎯 Executive Summary

**iBrain** is an **optional premium AI add-on** for KARVIA Pro, NOT a core dependency.

**Key Principles**:
1. ✅ **KARVIA Pro works standalone** (all core features functional without iBrain)
2. ✅ **iBrain is toggle-controlled** (`business.ibrain_enabled` boolean, default: false)
3. ✅ **iBrain stays with BRAMHI Labs** (SaaS API, not handed over with codebase)
4. ✅ **Client chooses toggle state** at handover (on or off, based on budget + needs)
5. ✅ **Transparent pricing model** (KARVIA Pro $50-100/user + iBrain $30/user add-on)

---

## 🧠 What is iBrain?

### **Definition**
iBrain is BRAMHI Labs' proprietary AI platform that powers intelligent features across the BRAMHI product suite (KARVIA Pro, PM Career Accelerator, future products).

### **Technology Stack**
- **LLM**: OpenAI GPT-4 (via Azure OpenAI Service for enterprise compliance)
- **Orchestration**: Custom prompt engineering, chain-of-thought reasoning
- **Deployment**: BRAMHI Labs SaaS API (hosted on Azure, multi-tenant)
- **Security**: Tenant isolation, encrypted API keys, SOC2 compliant (V1)

### **Core Capabilities**
1. **AI OKR Generation**: Analyze assessment data → generate 3-5 SMART objectives
2. **Priority Analysis**: Score all objectives by risk, velocity, impact → surface top 4 focus areas
3. **Smart Insights**: Focus Area (what needs attention), Quick Win (fastest progress path), Forecast (predicted outcomes)
4. **Predictive Forecasting**: Early warning signals, trend analysis, resource recommendations
5. **Natural Language Q&A** (V1): "What are my at-risk objectives?" → AI-generated report
6. **Full 6-Engine Lattice** (V1): Identity, Memory, Reasoning, Planning, Execution, Learning engines

---

## 🏗️ Standalone KARVIA Pro Architecture (iBrain OFF)

### **Core Features (No iBrain Dependencies)**

```
┌─────────────────────────────────────────┐
│  KARVIA Pro Core (Standalone)           │
│                                         │
│  ✅ Assessment Framework                │
│     - Multi-level templates (org/team)  │
│     - 3-dimension scoring (SSI)         │
│     - Gap analysis (manual insights)    │
│                                         │
│  ✅ OKR Management (Manual)             │
│     - Create objectives (user-driven)   │
│     - Multi-level cascade (manual)      │
│     - Progress tracking (KR updates)    │
│                                         │
│  ✅ Progress Tracking                   │
│     - Auto-calculated progress %        │
│     - Status indicators (on-track, etc) │
│     - Week-by-week tracking             │
│                                         │
│  ✅ Team Analytics                      │
│     - Aggregated dashboards             │
│     - Filter by status, priority, team  │
│     - Trend charts, drill-down          │
│                                         │
│  ✅ Recognition System (Beta)           │
│     - Milestone celebrations            │
│     - Peer recognition                  │
│     - Achievement feed                  │
│                                         │
│  ✅ Reporting Engine                    │
│     - PDF/CSV exports                   │
│     - Custom report builder             │
│     - Scheduled delivery                │
│                                         │
│  Deployment: Standalone, no external    │
│  dependencies (except database, Redis)  │
└─────────────────────────────────────────┘
```

### **User Experience (iBrain OFF)**
1. **Assessment**: User completes assessment, gets SSI scores + gap analysis
2. **OKR Creation**: User manually creates 3-5 objectives based on assessment insights
3. **Progress Tracking**: User updates KRs weekly, dashboard shows progress
4. **Analytics**: User views dashboards, exports reports, recognizes team
5. **Outcome**: Full OKR workflow, 100% functional, no AI assistance

---

## 🤖 Integrated KARVIA Pro Architecture (iBrain ON)

### **Core + Premium Features**

```
┌─────────────────────────────────────────┐
│  KARVIA Pro Core (Standalone)           │
│  ✅ Assessment Framework                │
│  ✅ OKR Management (Manual)             │
│  ✅ Progress Tracking                   │
│  ✅ Team Analytics                      │
│  ✅ Recognition System                  │
│  ✅ Reporting Engine                    │
└─────────────────────────────────────────┘
              ↓ Optional Toggle
┌─────────────────────────────────────────┐
│  iBrain Premium Add-On (SaaS)           │
│                                         │
│  🤖 AI OKR Generation                   │
│     - Analyze assessment weak areas     │
│     - Generate 3-5 SMART objectives     │
│     - User reviews/edits → approves     │
│                                         │
│  🤖 Priority Analysis                   │
│     - Score all objectives (risk/impact)│
│     - Surface top 4 focus areas         │
│     - Confidence scoring (0-100%)       │
│                                         │
│  🤖 Smart Insights                      │
│     - Focus Area (what needs attention) │
│     - Quick Win (fastest progress path) │
│     - Forecast (predicted outcomes)     │
│                                         │
│  🤖 Predictive Forecasting (V1)         │
│     - Early warning signals             │
│     - Trend analysis                    │
│     - Resource recommendations          │
│                                         │
│  Deployment: iBrain SaaS (BRAMHI Labs)  │
│  API Keys: Provided by BRAMHI           │
└─────────────────────────────────────────┘
```

### **User Experience (iBrain ON)**
1. **Assessment**: User completes assessment, gets SSI scores + gap analysis
2. **OKR Generation (AI)**: User clicks "Generate Objectives with AI" → iBrain creates 3-5 SMART objectives → user reviews/edits → approves → saved to database
3. **Priority Analysis (AI)**: iBrain scores all objectives → surfaces top 4 focus areas → user sees risk/impact scores
4. **Smart Insights (AI)**: Dashboard shows Focus Area, Quick Win, Forecast (AI-generated)
5. **Progress Tracking**: User updates KRs weekly, dashboard shows progress + AI insights
6. **Outcome**: Full OKR workflow + AI superpowers (10x faster OKR creation, data-driven prioritization)

---

## 🔧 Technical Implementation

### **Feature Toggle Architecture**

**Database Schema** (Business Model):
```javascript
// server/models/businessModel.js
const Business = sequelize.define('Business', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  ibrain_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Standalone by default
    comment: 'Feature toggle for iBrain premium features'
  },
  ibrain_api_key: {
    type: DataTypes.STRING,
    allowNull: true, // Only set if iBrain enabled
    comment: 'API key for iBrain SaaS (encrypted at rest)'
  },
  // ... other fields
});
```

**Backend Logic**:
```javascript
// server/routes/ai-okr.js
router.post('/generate-objectives', requireAuth, async (req, res) => {
  const business = await Business.findByPk(req.user.business_id);

  // Check iBrain toggle
  if (!business.ibrain_enabled) {
    return res.status(403).json({
      error: 'iBrain is not enabled for this business. Contact support to upgrade.'
    });
  }

  // iBrain enabled, proceed with AI generation
  const objectives = await ibrainService.generateObjectives({
    assessmentId: req.body.assessment_id,
    apiKey: business.ibrain_api_key
  });

  res.json({ objectives });
});
```

**Frontend Logic**:
```javascript
// client/pages/scripts/objective-detail.js
async function initializePage() {
  const business = await businessAPI.getCurrentBusiness();

  if (business.ibrainEnabled) {
    // Show iBrain features
    document.getElementById('ai-generate-btn').style.display = 'block';
    document.getElementById('priority-analysis-card').style.display = 'block';
    document.getElementById('smart-insights-card').style.display = 'block';
  } else {
    // Hide iBrain features, show manual workflows
    document.getElementById('ai-generate-btn').style.display = 'none';
    document.getElementById('manual-okr-form').style.display = 'block';
  }
}
```

### **iBrain API Integration**

**Service Layer** (KARVIA Pro calls iBrain SaaS):
```javascript
// server/services/ibrainService.js
const axios = require('axios');

const IBRAIN_API_BASE = process.env.IBRAIN_API_URL || 'https://ibrain.bramhilabs.com/api/v1';

async function generateObjectives({ assessmentId, apiKey }) {
  try {
    const response = await axios.post(`${IBRAIN_API_BASE}/okr/generate`, {
      assessment_id: assessmentId
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30s timeout
    });

    return response.data.objectives; // Array of SMART objectives
  } catch (error) {
    // Graceful degradation: iBrain down, show manual mode
    logger.error('iBrain API error:', error);
    throw new Error('iBrain service unavailable. Please create objectives manually.');
  }
}

module.exports = { generateObjectives, analyzePriorities, getInsights };
```

### **Graceful Degradation**

**Principle**: If iBrain is down, KARVIA Pro continues functioning (manual mode).

**Implementation**:
```javascript
// Frontend error handling
async function generateObjectivesWithAI(assessmentId) {
  try {
    const objectives = await aiOKRAPI.generateObjectives(assessmentId);
    displayAIGeneratedObjectives(objectives);
  } catch (error) {
    // iBrain unavailable, fall back to manual mode
    showToast('AI generation unavailable. Please create objectives manually.', 'warning');
    showManualOKRForm();
  }
}
```

---

## 💼 Business Model & Deployment Options

### **Deployment Model 1: KARVIA Pro SaaS (Standalone)**

**Who**: Customers who want core OKR features, no AI
**Pricing**: $50-100/user/year
**Toggle State**: `ibrain_enabled = false`
**iBrain Access**: None
**Best For**: Budget-conscious SMBs, simple OKR workflows

### **Deployment Model 2: KARVIA Pro SaaS + iBrain Premium**

**Who**: Customers who want AI superpowers
**Pricing**: $50-100/user/year (KARVIA Pro) + $30/user/year (iBrain)
**Toggle State**: `ibrain_enabled = true`
**iBrain Access**: API key provisioned by BRAMHI Labs
**Best For**: SMBs who want 10x faster OKR creation, data-driven prioritization

### **Deployment Model 3: Codebase Handover (Standalone)**

**Who**: Clients who purchase codebase for self-hosting
**Pricing**: One-time handover fee + annual KARVIA Pro license (no iBrain)
**Toggle State**: `ibrain_enabled = false` (iBrain not included in handover)
**iBrain Access**: None (unless separately contracted)
**Best For**: Clients who want full control, no ongoing SaaS dependency

### **Deployment Model 4: Codebase Handover + iBrain SaaS**

**Who**: Clients who purchase codebase but want iBrain add-on
**Pricing**: One-time handover fee + annual iBrain subscription ($30/user/year to BRAMHI)
**Toggle State**: `ibrain_enabled = true`
**iBrain Access**: API key provisioned, iBrain stays with BRAMHI (SaaS)
**Best For**: Clients who want autonomy (self-host KARVIA Pro) but AI assistance (iBrain SaaS)

---

## 🔑 API Key Management

### **Provisioning Flow**

1. **Customer Upgrades to iBrain**: Customer clicks "Upgrade to iBrain Premium" in KARVIA Pro settings
2. **BRAMHI Admin Provisions Key**: BRAMHI Labs admin generates API key in iBrain platform
3. **Key Stored in Database**: `business.ibrain_api_key` encrypted at rest (AES-256)
4. **Toggle Enabled**: `business.ibrain_enabled = true`
5. **Customer Access**: AI features immediately visible in KARVIA Pro UI

### **Security**

- **Encryption**: API keys encrypted at rest (AES-256), decrypted only at API call time
- **Rotation**: Keys rotated every 90 days (automated)
- **Revocation**: Admin can revoke key instantly (customer loses iBrain access)
- **Tenant Isolation**: iBrain enforces business-level data isolation (customer A cannot see customer B's data)

---

## 📊 Feature Comparison Matrix

| Feature | KARVIA Pro Standalone | KARVIA Pro + iBrain | iBrain Exclusive? |
|---------|-----------------------|---------------------|-------------------|
| **Assessment Framework** | ✅ Full | ✅ Full | ❌ No (core feature) |
| **Manual OKR Creation** | ✅ Full | ✅ Full | ❌ No (core feature) |
| **AI OKR Generation** | ❌ Not available | ✅ Full | ✅ Yes (iBrain only) |
| **Progress Tracking** | ✅ Full | ✅ Full | ❌ No (core feature) |
| **Team Analytics** | ✅ Full | ✅ Full | ❌ No (core feature) |
| **Priority Analysis (AI)** | ❌ Not available | ✅ Full | ✅ Yes (iBrain only) |
| **Smart Insights (AI)** | ❌ Not available | ✅ Full | ✅ Yes (iBrain only) |
| **Predictive Forecasting** | ❌ Not available | ✅ V1 feature | ✅ Yes (iBrain only) |
| **Recognition System** | ✅ Full | ✅ Full | ❌ No (core feature) |
| **Export Engine** | ✅ Full | ✅ Full | ❌ No (core feature) |

---

## 🗓️ Integration Timeline

### **MVP (Weeks 1-4) - ✅ COMPLETE**
- ✅ AI OKR Generation service built (`server/services/aiOKRService.js`)
- ✅ iBrain API integration (`ibrainService.js`)
- ✅ Feature toggle architecture (`business.ibrain_enabled`)
- ✅ Frontend toggle logic (show/hide AI features)
- ✅ Error handling (graceful degradation)

### **Beta (Weeks 5-12) - ⏳ IN PROGRESS**
- ⏳ **Week 5-6**: Integration testing (iBrain API live testing)
- ⏳ **Week 7-8**: Priority analysis service (top 4 focus areas)
- ⏳ **Week 9-10**: Smart insights service (Focus Area, Quick Win, Forecast)
- ⏳ **Week 11-12**: UX polish (AI loading states, error messages)

### **V1 (Weeks 13+) - 📋 PLANNED**
- 📋 Predictive forecasting (early warning signals)
- 📋 Natural language Q&A ("What are my at-risk objectives?")
- 📋 Full 6-engine lattice (Identity, Memory, Reasoning, Planning, Execution, Learning)
- 📋 SOC2 compliance (iBrain SaaS)

---

## ⚠️ Risks & Mitigations

### **Risk 1: iBrain API Downtime**
**Impact**: Customers with `ibrain_enabled = true` cannot generate AI objectives
**Probability**: Medium (SaaS dependency)
**Mitigation**:
- Graceful degradation (show manual mode)
- Cache AI results for 24 hours (fallback data)
- SLA monitoring with alerts (99.5% uptime target)
- Customer communication (status page, downtime alerts)

### **Risk 2: iBrain Pricing Changes**
**Impact**: BRAMHI Labs increases iBrain API costs, KARVIA Pro margins shrink
**Probability**: Low (controlled by BRAMHI)
**Mitigation**:
- Annual pricing lock with BRAMHI Labs
- Pass-through pricing model (customer pays BRAMHI directly)
- Fallback: Disable iBrain toggle, refund customers

### **Risk 3: Customer Confusion (Standalone vs iBrain)**
**Impact**: Customers expect AI features but didn't purchase iBrain
**Probability**: Medium (new toggle model)
**Mitigation**:
- Clear pricing page (Core vs Premium features)
- In-app upgrade prompts ("Unlock AI features with iBrain")
- Onboarding wizard explains toggle model
- FAQ documentation

### **Risk 4: Handover Complexity (iBrain Toggle)**
**Impact**: Client handover, unsure if iBrain stays on or off
**Probability**: High (handover hasn't happened yet)
**Mitigation**:
- Handover checklist (explicitly ask: "Do you want iBrain enabled?")
- Documentation: "iBrain SaaS Model" explainer
- Annual iBrain contract (separate from codebase handover)

---

## 📚 References

- **iBrain Platform Documentation**: `/BRAMHI_STRATEGY/ibrain_platform_overview.md` (BRAMHI Labs internal)
- **Feature Toggle Pattern**: Martin Fowler - Feature Toggles
- **API Security Best Practices**: OWASP API Security Top 10
- **SaaS Pricing Models**: OpenView Partners - SaaS Pricing Benchmarks 2024

---

## 🔗 Related Documents

- [KARVIA Pro Master Strategy](../00_MASTER_STRATEGY.md)
- [Value Proposition](./value_proposition.md) - Pricing model details
- [Product Overview Deck](./product_overview.html) - Slide 10 (iBrain Integration Model)
- [Technical Architecture](../02_TECHNICAL_OVERVIEW/backend_architecture.md) - iBrain service layer

---

**END OF DOCUMENT**
