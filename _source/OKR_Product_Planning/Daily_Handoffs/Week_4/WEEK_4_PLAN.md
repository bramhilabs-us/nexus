# Week 4 Plan - AI OKR Generation

**Week**: Week 4 (Oct 26-Nov 1, 2025)
**Status**: 🎯 IN PROGRESS
**Previous Week**: Week 3 - Analytics & Insights ✅
**Next Week**: Week 5 - OKR Tracking & Progress Management

---

## 🎯 **Week 4 Objective**

Build AI-powered OKR generation system that analyzes assessment weak areas and automatically generates SMART objectives with key results, enabling users to quickly create actionable improvement plans based on their assessment insights.

**Customer Value**: "Take assessment → Get AI-generated improvement objectives → Review and approve → Start tracking progress"

**Payment Milestone**: $4,500 due Nov 1
**Demo**: Friday Nov 1 @ 3:00 PM

---

## 📋 **Week 4 Scope**

### **What's Included** ✅
1. AI service integration with OpenAI GPT-4
2. Weak area analysis and OKR generation
3. API endpoints for generating and managing AI OKRs
4. UI for reviewing/editing AI-generated objectives
5. Approval workflow (draft → approved → active)

### **What's Excluded** ❌
- OKR tracking dashboard (Week 5)
- Goal cascade to teams (Week 5)
- Progress updates and check-ins (Week 5)
- OKR templates library (Week 6)

---

## 🏗️ **Architecture Overview**

### **Integration Points**
```
Assessment (Week 1)
    ↓
Analytics Service (Week 3)
    ↓ getWeakAreas()
AI OKR Service (Week 4) ← OpenAI API
    ↓
Objective Model (exists)
    ↓
OKR Review UI (Week 4)
```

### **Data Flow**
1. User completes assessment → Assessment stored with scores
2. Analytics service identifies weak areas (score < 40)
3. AI service receives weak areas context
4. OpenAI generates 3-5 SMART objectives with key results
5. User reviews/edits in UI
6. User approves → Objectives saved to database
7. Ready for tracking (Week 5)

---

## 📅 **Daily Breakdown**

### **Day 1: AI Service Foundation** (6 hours)
**Goal**: Create AI service with OpenAI integration

**Tasks**:
- [ ] Verify OpenAI API key in .env
- [ ] Install `openai` npm package
- [ ] Create `server/services/aiOKRService.js`
  - OpenAI client setup
  - Prompt engineering for OKR generation
  - Response parsing and validation
- [ ] Create test script `server/scripts/testAIService.js`
- [ ] Test with sample weak areas data

**Deliverables**:
- `server/services/aiOKRService.js` (~400 lines)
- Test script demonstrating AI generation
- 3-5 sample OKRs generated from weak areas

**Dependencies**:
- Week 3: `analyticsService.getWeakAreas()`
- Existing: Objective model
- External: OpenAI API

---

### **Day 2: OKR Generation Logic** (6 hours)
**Goal**: Build comprehensive OKR generation with context awareness

**Tasks**:
- [ ] Enhance AI prompt with business context
- [ ] Add dimension-specific OKR templates
- [ ] Implement SMART criteria validation
- [ ] Add scoring and prioritization logic
- [ ] Create multiple generation strategies:
  - Single objective per weak dimension
  - Comprehensive 3-5 objectives covering all areas
  - Quick wins (low effort, high impact)

**Deliverables**:
- Enhanced `aiOKRService.js` with context-aware generation
- Test cases for different weak area scenarios
- Validation logic for generated OKRs

**API Methods**:
```javascript
generateOKRsFromAssessment(assessmentId, options)
generateOKRsFromWeakAreas(weakAreasData, businessContext)
validateGeneratedOKR(okrData)
prioritizeOKRs(okrs)
```

---

### **Day 3: API Routes** (5 hours)
**Goal**: Create REST API endpoints for OKR generation and management

**Tasks**:
- [ ] Create `server/routes/ai-okr.js`
- [ ] Implement endpoints:
  - POST `/api/ai-okr/generate/:assessmentId` - Generate from assessment
  - GET `/api/ai-okr/suggestions/:userId` - Get latest suggestions
  - POST `/api/ai-okr/approve` - Approve and save OKRs
  - PUT `/api/ai-okr/edit/:suggestionId` - Edit before approval
  - DELETE `/api/ai-okr/dismiss/:suggestionId` - Dismiss suggestion
- [ ] Add validation middleware
- [ ] Add authentication guards
- [ ] Create test script for all endpoints

**Deliverables**:
- `server/routes/ai-okr.js` (~600 lines, 5 endpoints)
- API test script with sample data
- Error handling for AI failures

**Response Format**:
```json
{
  "success": true,
  "data": {
    "suggestion_id": "123",
    "assessment_id": "abc",
    "generated_at": "2025-10-26T...",
    "status": "draft",
    "objectives": [
      {
        "title": "Improve Execution Speed",
        "description": "Enhance team response time...",
        "category": "operational",
        "priority": "high",
        "weak_area_reference": {
          "dimension": "speed",
          "category": "execution",
          "current_score": 32,
          "target_score": 65
        },
        "key_results": [
          {
            "title": "Reduce decision-making time",
            "metric_type": "percentage",
            "target_value": 50,
            "quarter": 1
          }
        ]
      }
    ]
  }
}
```

---

### **Day 4: OKR Review UI** (7 hours)
**Goal**: Build interactive UI for reviewing AI-generated OKRs

**Tasks**:
- [ ] Create `client/pages/ai-okr-review.html`
- [ ] Create `client/pages/scripts/ai-okr-review.js`
- [ ] Implement features:
  - Display generated objectives in cards
  - Show weak area context (before/after scores)
  - Editable fields (title, description, key results)
  - Priority and timeline selection
  - Approve/Dismiss actions
  - Bulk approve multiple objectives
- [ ] Add Chart.js visualization for score improvements
- [ ] Integrate with navigation

**Deliverables**:
- `client/pages/ai-okr-review.html` (~400 lines)
- `client/pages/scripts/ai-okr-review.js` (~500 lines)
- CSS styling for OKR cards
- Interactive approval workflow

**UI Components**:
- Assessment summary card (weak areas highlighted)
- Generated objectives list (expandable cards)
- Edit modal for each objective
- Score visualization (current → target)
- Action buttons (Approve, Edit, Dismiss, Regenerate)

---

### **Day 5: Integration & Testing** (6 hours)
**Goal**: End-to-end testing and polish

**Tasks**:
- [ ] Create comprehensive test script
- [ ] Test full flow:
  1. Complete assessment
  2. Generate OKRs from weak areas
  3. Review in UI
  4. Edit objectives
  5. Approve and save
  6. Verify saved in database
- [ ] Add error handling:
  - OpenAI API failures
  - No weak areas found
  - Invalid assessment ID
- [ ] Add loading states and feedback
- [ ] Performance testing (generation speed)
- [ ] Update navigation to include AI OKR page
- [ ] Create Week 4 handoff document

**Deliverables**:
- `server/scripts/testAIOKRFlow.js`
- Integration test results
- Performance benchmarks
- WEEK_4_HANDOFF.md

**Success Criteria**:
- Generate OKRs in < 10 seconds
- 90%+ valid SMART objectives
- Smooth approval workflow
- All generated OKRs properly linked to assessments

---

## 🔧 **Technical Implementation Details**

### **AI Service Design**

**File**: `server/services/aiOKRService.js`

**Core Methods**:
```javascript
class AIOKRService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.analyticsService = require('./analyticsService');
  }

  async generateOKRsFromAssessment(assessmentId, options = {}) {
    // 1. Get weak areas from analytics service
    const weakAreas = await this.analyticsService.getWeakAreas(
      assessmentId,
      options.threshold || 40
    );

    // 2. Get business context
    const assessment = await Assessment.findById(assessmentId)
      .populate('user_id')
      .populate('business_id');

    // 3. Build context for AI
    const context = this.buildContext(weakAreas, assessment);

    // 4. Generate OKRs via OpenAI
    const okrs = await this.generateWithAI(context, options);

    // 5. Validate and structure
    const validated = this.validateOKRs(okrs);

    // 6. Save as draft suggestions
    return this.saveSuggestions(assessmentId, validated);
  }

  buildContext(weakAreas, assessment) {
    return {
      business: {
        name: assessment.business_id.name,
        industry: assessment.business_id.industry,
        size: assessment.business_id.employee_count
      },
      user: {
        name: assessment.user_id.full_name,
        role: assessment.user_id.role
      },
      weakAreas: {
        dimensions: weakAreas.dimensions,
        categories: weakAreas.categories.slice(0, 5),
        questions: weakAreas.questions.slice(0, 10)
      },
      overallScores: assessment.ssi_scores
    };
  }

  async generateWithAI(context, options) {
    const prompt = this.buildPrompt(context, options);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business consultant specializing in OKR creation...'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return this.parseAIResponse(response.choices[0].message.content);
  }

  buildPrompt(context, options) {
    return `
Based on this business assessment analysis, generate ${options.count || 3-5} SMART objectives with key results:

Business Context:
- Industry: ${context.business.industry}
- Size: ${context.business.size} employees
- Role: ${context.user.role}

Weak Areas Identified (need improvement):
${context.weakAreas.dimensions.map(d =>
  `- ${d.dimension}: ${d.score}/100 (${d.description})`
).join('\n')}

Top Categories Needing Attention:
${context.weakAreas.categories.map(c =>
  `- ${c.category} (${c.dimension}): ${c.score}/100`
).join('\n')}

For each objective, provide:
1. Title (action-oriented, specific)
2. Description (why it matters, expected impact)
3. Category (revenue/operational/market/team/customer/product)
4. Priority (high/medium/low)
5. Timeline (target year, quarters)
6. 3 Key Results (measurable, time-bound)
7. Current score and target score improvement

Format as JSON array of objectives.
`;
  }

  validateOKRs(okrs) {
    // Validate SMART criteria
    // Check required fields
    // Ensure measurable key results
    // Return validated OKRs
  }
}
```

---

### **Database Schema Addition**

**New Collection**: `ai_okr_suggestions`

```javascript
{
  _id: ObjectId,
  assessment_id: ObjectId, // Reference to assessment
  user_id: ObjectId,
  business_id: ObjectId,
  generated_at: Date,
  status: 'draft' | 'approved' | 'dismissed',
  objectives: [
    {
      title: String,
      description: String,
      category: String,
      priority: String,
      weak_area_reference: {
        dimension: String,
        category: String,
        current_score: Number,
        target_score: Number,
        questions_addressed: [String]
      },
      key_results: [
        {
          title: String,
          metric_type: String,
          target_value: Number,
          quarter: Number
        }
      ],
      edited: Boolean, // Track if user modified
      approved: Boolean
    }
  ],
  ai_metadata: {
    model: 'gpt-4',
    prompt_tokens: Number,
    completion_tokens: Number,
    generation_time_ms: Number
  }
}
```

---

## ✅ **Success Criteria**

**Functional Requirements**:
- [x] AI generates 3-5 relevant objectives from weak areas
- [x] Generated OKRs follow SMART criteria
- [x] Users can edit objectives before approval
- [x] Approved OKRs saved to Objective model
- [x] Weak area context preserved and displayed

**Quality Requirements**:
- [x] OKR generation < 10 seconds
- [x] 90%+ objectives are actionable
- [x] Key results are measurable
- [x] No duplicate or contradictory objectives
- [x] Graceful handling of API failures

**UX Requirements**:
- [x] Clear loading indicators during generation
- [x] Easy-to-understand weak area explanations
- [x] Simple approval workflow
- [x] Ability to regenerate if unsatisfied
- [x] Visual score improvement preview

---

## 🔗 **Dependencies**

### **From Previous Weeks**:
- ✅ Week 1: Assessment model with scores
- ✅ Week 3: `analyticsService.getWeakAreas()`
- ✅ Week 0: Objective model (already has `ai_generated` field)

### **External Services**:
- ⬜ OpenAI API (GPT-4 access required)
- ⬜ `.env` variable: `OPENAI_API_KEY`

### **NPM Packages**:
- ⬜ `openai` (^4.20.0) - Official OpenAI Node.js SDK

---

## 📊 **Testing Strategy**

### **Unit Tests**:
- AI service methods
- OKR validation logic
- Prompt building
- Response parsing

### **Integration Tests**:
- Full generation flow
- Database save/retrieve
- API endpoints

### **End-to-End Tests**:
- Assessment → Generation → Approval workflow
- UI interaction flow
- Error scenarios

### **Test Data**:
- Use Week 3 seeded assessments (25 samples)
- Test user: David Brown (low speed score = 56)
- Various weak area scenarios

---

## 📝 **Deliverables Checklist**

### **Code**:
- [ ] `server/services/aiOKRService.js` (~600 lines)
- [ ] `server/models/AIOKRSuggestion.js` (~200 lines)
- [ ] `server/routes/ai-okr.js` (~600 lines)
- [ ] `client/pages/ai-okr-review.html` (~400 lines)
- [ ] `client/pages/scripts/ai-okr-review.js` (~500 lines)

### **Tests**:
- [ ] `server/scripts/testAIService.js`
- [ ] `server/scripts/testAIOKRAPI.js`
- [ ] `server/scripts/testAIOKRFlow.js`

### **Documentation**:
- [ ] WEEK_4_PLAN.md (this file) ✅
- [ ] WEEK_4_HANDOFF.md
- [ ] API documentation for ai-okr routes
- [ ] AI service usage guide

---

## 🚀 **Week 4 → Week 5 Handoff**

**What Week 5 Will Build On**:
- Approved OKRs in Objective model
- Weak area linkage for tracking
- Foundation for progress updates
- Ready for goal cascade system

**Week 5 Preview**:
- OKR tracking dashboard
- Progress updates and check-ins
- Goal cascade to teams
- Timeline visualization

---

## 🎯 **Demo Script for Friday Nov 1**

**Flow**:
1. Show completed assessment with low scores
2. Click "Generate Improvement Objectives"
3. Watch AI generate 3-5 objectives in real-time
4. Review objectives with weak area context
5. Edit one objective to customize
6. Approve all objectives
7. Show saved objectives in database
8. Preview: "Next week, we'll track progress on these"

**Key Talking Points**:
- AI analyzes weak areas automatically
- Generates SMART, actionable objectives
- User retains full control (edit/approve)
- Direct link to assessment insights
- Ready to start tracking immediately

---

**END OF WEEK 4 PLAN**
