# 🎓 CONSULTANT JOURNEY - Multi-Client Advisory & Template Management

**Version**: 3.0.0
**Created**: 2025-10-22
**Updated**: 2026-02-24
**Persona**: Consultant / External Advisor
**Primary Goals**: Advise multiple companies, create assessment templates, compare clients, provide strategic guidance

> **Sprint 15 Update**: Enhanced client onboarding flow with 2-step Add Client modal, value-driven emails, and streamlined first-time user experience.

---

## 📊 JOURNEY OVERVIEW

**North Star**: **Client Onboarding** → Template Creation → Multi-Client Assessment → Cross-Company Insights → Strategic Recommendations

**Frequency**: Quarterly assessments per client + Ongoing advisory + Template refinement
**Key Screens**: My Clients Tab, Assessment Hub, Template Creation, Analytics (multi-company view)
**Critical Story**: **CONS-001**: Onboard New Client Company (Week 0), **CONS-002**: Create Assessment Template (Week 1)

### Technical Architecture Alignment

**Primary Blocks Used**:
- **Block 1**: Core Multi-Tenancy Support (Required)
- **Block 2**: Assessment Template Management
- **Block 6**: AI-Powered OKR Generation (shared with clients)
- **Block 7**: Cross-Client Analytics

**Backend Engines**:
- **Assessment Engine**: Template creation and management
- **IAM Engine**: Multi-business access control
- **Scoring Engine**: Cross-client benchmarking
- **Planner Engine**: Multi-client OKR generation
- **Observer Engine**: Usage tracking and analytics

**Multi-Tenancy Model**:
- Consultant has access to multiple `business_id` contexts
- Row-level security enforces data isolation
- Context switching via JWT claims update

---

## 🗺️ END-TO-END JOURNEY WITH TECHNICAL INTEGRATION

### PHASE 0: CLIENT ONBOARDING (Week 0) - Sprint 15 Enhanced

> **Entry Point**: This is the FIRST interaction a consultant has when bringing a new client to Karvia.

#### Step 0A: Add New Client (Enhanced 2-Step Modal)
- **Story**: **CONS-019**: Add Client with Strategic Context
- **Screen**: `my-clients.html` → "Add New Client" button
- **API Endpoint**: `POST /api/companies/client-onboard`
- **Request**:
  ```json
  {
    "step1": {
      "company_name": "Acme Corporation",
      "industry": "technology",
      "employee_count": 50,
      "description": "SaaS platform for logistics companies"
    },
    "contact": {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john@acme.com"
    },
    "step2": {
      "primary_goal": "Expand to 3 new cities with profitable unit economics",
      "biggest_challenge": "operational_efficiency",
      "assessment_template_id": "template_quickstart",
      "send_assessment": true,
      "internal_notes": "Referred by Mike. Follow up in 2 weeks."
    }
  }
  ```
- **Backend Flow**:
  1. Create company with business_context populated
  2. Create user with BUSINESS_OWNER role
  3. Generate temporary password
  4. Create invitation with assessment template
  5. Send value-driven welcome email
  6. Store internal_notes (consultant-only)
- **Modal Flow**:
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │ Add New Client                                        [1/2] │
  ├─────────────────────────────────────────────────────────────┤
  │ COMPANY                                                     │
  │ • Company Name *                                            │
  │ • Industry * (dropdown)                                     │
  │ • Company Size * (dropdown)                                 │
  │ • What does this company do? * (textarea)                   │
  │                                                             │
  │ PRIMARY CONTACT (Business Owner)                            │
  │ • First Name * / Last Name *                                │
  │ • Email Address *                                           │
  │                                                             │
  │                               [Cancel]  [Next: Strategy →] │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ Add New Client                                        [2/2] │
  ├─────────────────────────────────────────────────────────────┤
  │ STRATEGIC CONTEXT (Optional but recommended)                │
  │ • Primary 12-month goal (textarea)                          │
  │ • Biggest challenge (radio: Market, Operations, Team,       │
  │   Product, Funding, Other)                                  │
  │                                                             │
  │ ASSESSMENT                                                  │
  │ ☑️ Send SSI Assessment to Business Owner                   │
  │   Template: [Quick Start SSI ▼]                             │
  │   📧 Preview: John will receive...                          │
  │                                                             │
  │ PRIVATE NOTE (Only visible to you)                          │
  │ [Consultant's internal reference]                           │
  │                                                             │
  │                       [← Back]  [Cancel]  [Add Client ✓]   │
  └─────────────────────────────────────────────────────────────┘
  ```
- **Data Models**: `Company`, `User`, `Invitation`, `ConsultantNote`
- **Outcome**: Client created with strategic context; value-driven email sent

#### Step 0B: Value-Driven Welcome Email Sent
- **Story**: **CONS-020**: Value-Driven Client Welcome
- **Trigger**: Automatic after client creation
- **Email Content**:
  ```
  Subject: [Consultant Name] has set up your OKR workspace

  Hi John,

  [Consultant] from [Consultant Company] has created your
  Cultural Discipline workspace for Acme Corporation.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  YOUR FIRST STEP (10-15 minutes)

  Complete your SSI Assessment to discover:

  ⚡ SPEED - How fast your company executes
  🛡️ STRENGTH - How well you handle challenges
  🧠 INTELLIGENCE - How smartly you adapt

  [Complete Your Assessment →]

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  WHAT'S WAITING FOR YOU:
  ✓ Your company's SSI Score
  ✓ Personalized objectives based on your industry
  ✓ Clear weekly goals for your team
  ✓ Progress tracking on what matters most
  ```
- **Backend Flow**:
  1. Email service (Mailjet) sends value-driven template
  2. Tracks open/click rates
  3. Auto-reminder at 48h if not completed
- **Data Models**: `EmailLog`, `InvitationStatus`
- **Outcome**: Business owner receives compelling email with clear value proposition

#### Step 0C: Track Client Onboarding Progress
- **Story**: **CONS-021**: Track Client Onboarding Journey
- **Screen**: `my-clients.html` → Client card status indicators
- **API Endpoint**: `GET /api/clients/onboarding-status`
- **Response**:
  ```json
  {
    "clients": [
      {
        "company_id": "company_acme",
        "company_name": "Acme Corporation",
        "onboarding_stage": "assessment_pending",
        "email_status": "sent",
        "email_opened": true,
        "assessment_progress": 0,
        "days_since_invite": 2,
        "next_action": "Send reminder"
      }
    ]
  }
  ```
- **Card States**:
  - `invited` - Email sent, not opened
  - `email_opened` - Email opened, assessment not started
  - `assessment_in_progress` - Assessment partially complete
  - `assessment_complete` - Ready for OKR generation
  - `active` - Fully onboarded
- **Data Models**: `OnboardingProgress`, `EmailTracking`
- **Outcome**: Consultant has visibility into client onboarding funnel

#### Step 0D: Invite Team Members for Client
- **Story**: **CONS-022**: Consultant Invites Client Team
- **Screen**: `my-clients.html` → Client card → "Invite Team" button
- **API Endpoint**: `POST /api/invitations/team-bulk`
- **Request**:
  ```json
  {
    "company_id": "company_acme",
    "inviter_id": "consultant_001",
    "invitations": [
      {"email": "sarah@acme.com", "role": "MANAGER"},
      {"email": "mike@acme.com", "role": "EMPLOYEE"}
    ],
    "send_assessment": true,
    "message": "Optional custom message"
  }
  ```
- **Backend Flow**:
  1. Create invitations for each email
  2. Send team member welcome emails (role-specific)
  3. Notify business owner of invitations sent
  4. Log activity for consultant
- **Data Models**: `Invitation`, `TeamMemberInvite`
- **Outcome**: Consultant can accelerate client team onboarding

---

### PHASE 1: TEMPLATE CREATION (Week 1)

#### Step 1: Create Assessment Template
- **Story**: **CONS-001**: Create Assessment Template
- **Screen**: `assessment-creation-flow.html` (4-step wizard)
- **API Endpoint**: `POST /api/assessment-templates`
- **Request**:
  ```json
  {
    "name": "Tech Startup SSI v2.0",
    "description": "Customized for early-stage tech companies",
    "scope": "global",
    "consultant_id": "cons_001",
    "settings": {
      "total_questions": 45,  // Configurable, not hardcoded
      "min_questions": 20,    // Minimum allowed
      "max_questions": 100,   // Maximum allowed
      "questions_per_dimension": "dynamic" // Can be equal or weighted
    },
    "dimensions": {
      "speed": {"weight": 40, "question_count": 15},
      "strength": {"weight": 30, "question_count": 15},
      "intelligence": {"weight": 30, "question_count": 15}
    },
    "questions": [
      {"id": "q_001", "dimension": "speed", "text": "How quickly do you make decisions?"},
      {"id": "q_002", "dimension": "strength", "text": "What is your cash runway?"}
      // ... dynamically selected questions
    ]
  }
  ```
- **Backend Flow**:
  1. Assessment Engine validates template structure
  2. Verify weights sum to 100%
  3. Validate question count within min/max limits
  4. Ensure question distribution matches settings
  5. Generate unique template UUID
  6. Store in PostgreSQL with versioning
- **Dynamic Configuration**:
  ```javascript
  // Template configuration is fully dynamic
  const templateConfig = {
    questionCount: userSettings.totalQuestions || DEFAULT_QUESTION_COUNT,
    distribution: userSettings.distribution || 'equal',
    allowCustomQuestions: true,
    questionLibrarySize: 500+ // Expandable library
  };
  ```
- **Data Models**: `AssessmentTemplate`, `Question`, `Dimension`, `TemplateSettings`
- **Outcome**: Template saved with custom configuration

#### Step 2: View Assessment Templates
- **Story**: **CONS-002**: View Assessment Templates
- **Screen**: `assessment-hub.html` → "My Templates" tab
- **API Endpoint**: `GET /api/assessment-templates?consultant_id={cons_id}`
- **Response**:
  ```json
  {
    "templates": [
      {
        "id": "template_001",
        "name": "Tech Startup SSI v2.0",
        "settings": {
          "total_questions": 45,  // Shows actual configured value
          "questions_per_dimension": {
            "speed": 15,
            "strength": 15,
            "intelligence": 15
          }
        },
        "dimensions": {"speed": 40, "strength": 30, "intelligence": 30},
        "usage_stats": {
          "total_uses": 15,
          "unique_clients": 8,
          "avg_completion_time": "25 minutes"
        },
        "created_date": "2025-10-01",
        "version": "2.0"
      },
      {
        "id": "template_002",
        "name": "Enterprise Assessment",
        "settings": {
          "total_questions": 75,  // Different template, different count
          "questions_per_dimension": {
            "speed": 20,
            "strength": 30,
            "intelligence": 25
          }
        }
      }
    ],
    "total": 5
  }
  ```
- **Backend Flow**:
  1. IAM Engine validates consultant access
  2. Fetch all templates with their custom settings
  3. Observer Engine provides usage statistics
  4. Include version history
- **Data Models**: `AssessmentTemplate`, `TemplateSettings`, `UsageStats`
- **Outcome**: Complete template library with varied configurations

---

### PHASE 2: CLIENT ASSESSMENT (Week 1-4)

#### Step 3: Send Assessment Invitation to Client
- **Story**: **CONS-003**: Send Assessment Invitation
- **Screen**: `assessment-hub.html` → "Send Invitation" button
- **API Endpoint**: `POST /api/assessments/invitations/multi-client`
- **Request**:
  ```json
  {
    "template_id": "template_001",
    "consultant_id": "cons_001",
    "business_id": "client_a",
    "recipients": [
      {"email": "john@client-a.com", "role": "executive"},
      {"email": "sarah@client-a.com", "role": "manager"},
      {"email": "mike@client-a.com", "role": "employee"}
    ],
    "settings": {
      "due_date": "2025-10-31",
      "allow_partial_completion": true,
      "min_questions_required": 20,  // Can complete partially
      "reminder_frequency": "3_days"
    },
    "message": "Please complete this assessment for Q4 planning"
  }
  ```
- **Backend Flow**:
  1. IAM Engine validates consultant has access to client
  2. Assessment Engine creates assessment instances
  3. Apply template settings to each instance
  4. Generate unique tokens for each recipient
  5. Email service (Mailjet) sends invitations
  6. Observer Engine logs invitation event
- **Flexible Assessment Configuration**:
  ```javascript
  // Each assessment can have custom settings
  async function createAssessmentInstance(template, clientSettings) {
    const assessment = {
      template_id: template.id,
      question_count: clientSettings.questionCount || template.settings.total_questions,
      required_questions: clientSettings.minRequired || template.settings.min_questions,
      time_limit: clientSettings.timeLimit || null,
      allow_save_progress: clientSettings.allowSave !== false
    };
    return await db.assessments.create(assessment);
  }
  ```
- **Data Models**: `AssessmentInvitation`, `ClientAssessment`, `AssessmentSettings`
- **Outcome**: Invitations sent with flexible configuration

#### Step 4: Track Invitation Status
- **Story**: **CONS-004**: Track Invitation Status
- **Screen**: `assessment-hub.html` → "Sent" tab
- **API Endpoint**: `GET /api/assessments/invitations/status?consultant_id={cons_id}`
- **Response**:
  ```json
  {
    "clients": [
      {
        "business_id": "client_a",
        "business_name": "Client A Inc",
        "assessment_config": {
          "template_name": "Tech Startup SSI v2.0",
          "total_questions": 45,
          "required_completion": 20
        },
        "invitations": {
          "total": 3,
          "completed": 2,
          "pending": 1,
          "completion_details": {
            "john@client-a.com": {"questions_answered": 45, "status": "complete"},
            "sarah@client-a.com": {"questions_answered": 30, "status": "partial"},
            "mike@client-a.com": {"questions_answered": 0, "status": "not_started"}
          }
        }
      }
    ]
  }
  ```
- **Real-time Updates via WebSocket**:
  ```javascript
  // Track progress with configurable thresholds
  socket.on('assessment.progress', (data) => {
    const completionPercentage = (data.answered / data.total_questions) * 100;
    const meetsMinimum = data.answered >= data.min_required;

    updateClientStatus({
      ...data,
      completionPercentage,
      meetsMinimum
    });
  });
  ```
- **Data Models**: `InvitationStatus`, `ProgressTracking`, `CompletionMetrics`
- **Outcome**: Real-time tracking with flexible completion criteria

---

### PHASE 3: AI OKR GENERATION (Week 4)

#### Step 6: Generate Client OKRs
- **Story**: **CONS-006**: Generate Client OKRs
- **Screen**: `assessment-results.html` → "Generate OKRs" button
- **API Endpoint**: `POST /api/okrs/generate-for-client`
- **Request**:
  ```json
  {
    "consultant_id": "cons_001",
    "business_id": "client_a",
    "assessment_id": "assess_001",
    "generation_settings": {
      "okr_count": 5,  // Configurable number of OKRs
      "key_results_per_objective": 3,  // Configurable KRs
      "time_horizon": "yearly",
      "focus_areas": ["financial_strength", "operational_efficiency"]
    },
    "context": {
      "industry": "technology",
      "company_size": "startup",
      "assessment_completion": {
        "questions_answered": 45,
        "response_quality": "high"
      }
    }
  }
  ```
- **iBrain Integration with Dynamic Settings**:
  ```json
  {
    "model": "consultant-okr-generator-v2",
    "input": {
      "ssi_scores": {"speed": 7.2, "strength": 5.5, "intelligence": 8.1},
      "assessment_metadata": {
        "questions_answered": 45,
        "confidence_level": 0.95  // Based on completion rate
      },
      "generation_params": {
        "num_objectives": 5,  // Not hardcoded
        "num_key_results": 3,  // Configurable
        "optimization_for": ["achievability", "impact"]
      }
    }
  }
  ```
- **Backend Flow**:
  1. Assessment Engine retrieves results based on actual answers
  2. Calculate confidence based on completion rate
  3. iBrain generates OKRs with specified count
  4. Planner Engine creates draft OKRs
- **Data Models**: `ClientOKR`, `OKRGenerationSettings`, `ConfidenceScore`
- **Outcome**: Customizable AI-generated OKRs

---

### PHASE 4: MULTI-CLIENT INSIGHTS (Week 6)

#### Step 7: View Multi-Company Stats
- **Story**: **CONS-007**: View Multi-Company Stats
- **Screen**: `assessment-hub.html` → "Client Comparison" tab
- **API Endpoint**: `GET /api/analytics/multi-client-comparison`
- **Response**:
  ```json
  {
    "comparison": [
      {
        "business_id": "client_a",
        "name": "Client A",
        "assessment_details": {
          "template": "Tech Startup SSI v2.0",
          "questions_completed": 45,
          "completion_rate": 100
        },
        "scores": {"speed": 7.2, "strength": 5.5, "intelligence": 8.1},
        "confidence_level": "high"  // Based on completion
      },
      {
        "business_id": "client_b",
        "name": "Client B",
        "assessment_details": {
          "template": "Enterprise Assessment",
          "questions_completed": 60,  // Different template
          "completion_rate": 80
        },
        "scores": {"speed": 6.8, "strength": 7.0, "intelligence": 7.2},
        "confidence_level": "medium"  // Lower completion
      }
    ],
    "comparison_validity": {
      "comparable": true,
      "notes": "Different templates used - scores normalized"
    }
  }
  ```
- **Normalization for Different Templates**:
  ```javascript
  // Normalize scores across different assessment configurations
  function normalizeScores(assessments) {
    return assessments.map(assessment => {
      const weightedScore = calculateWeightedScore(
        assessment.raw_scores,
        assessment.question_count,
        assessment.template_weights
      );

      return {
        ...assessment,
        normalized_scores: weightedScore,
        confidence: assessment.completion_rate * 0.01
      };
    });
  }
  ```
- **Data Models**: `ClientComparison`, `NormalizedScores`, `TemplateMapping`
- **Outcome**: Fair comparison across different assessment configurations

#### Step 8: View Team SSI Breakdown (Heatmap)
- **Story**: **CONS-007B**: View Team SSI Breakdown
- **Screen**: `assessment-hub.html` → "Team Insights" tab
- **API Endpoint**: `GET /api/analytics/team-heatmap`
- **Request**:
  ```json
  {
    "consultant_id": "cons_001",
    "business_id": "client_a",
    "view": "heatmap",
    "settings": {
      "min_responses_for_team": 3,  // Configurable threshold
      "include_partial": true,
      "confidence_threshold": 0.7
    }
  }
  ```
- **Response**:
  ```json
  {
    "heatmap_data": {
      "teams": ["Engineering", "Sales", "Marketing"],
      "dimensions": ["speed", "strength", "intelligence"],
      "scores": [
        [7.5, 6.2, 8.0],  // Engineering (15 members, 100% completion)
        [6.8, 5.8, 5.8],  // Sales (8 members, 75% completion)
        [7.2, 6.5, 7.5]   // Marketing (5 members, 80% completion)
      ],
      "metadata": {
        "Engineering": {"responses": 15, "avg_questions": 45},
        "Sales": {"responses": 6, "avg_questions": 34},
        "Marketing": {"responses": 4, "avg_questions": 36}
      },
      "confidence_scores": [1.0, 0.75, 0.8]
    }
  }
  ```
- **Data Models**: `TeamMetrics`, `HeatmapData`, `ResponseMetadata`
- **Outcome**: Team analysis with transparency on data quality

---

### PHASE 5: COLLABORATIVE REVIEW (Week 10 BETA)

#### Step 11: Collaborative OKR Review
- **Story**: **CONS-009B**: Collaborative OKR Review (BETA)
- **Screen**: `ai-okr-review.html` → "Collaborative Mode"
- **Collaboration Settings**:
  ```json
  {
    "session_config": {
      "max_participants": 10,  // Configurable
      "edit_permissions": "all",  // or "consultant_only"
      "auto_save_interval": 30,  // seconds
      "session_timeout": 3600,  // 1 hour
      "conflict_resolution": "last_write_wins"
    }
  }
  ```
- **WebSocket Real-time Collaboration**:
  ```javascript
  // Configurable collaboration settings
  const collaborationRoom = {
    id: `okr_review_${sessionId}`,
    settings: {
      maxParticipants: config.maxParticipants,
      editRights: config.editPermissions,
      autoSave: config.autoSaveInterval > 0,
      versioning: true
    }
  };

  socket.on('okr.edit', (data) => {
    if (hasEditPermission(data.user_id, collaborationRoom.settings)) {
      applyEdit(data);
      broadcastChange(data);
    }
  });
  ```
- **Data Models**: `CollaborationSession`, `SessionSettings`, `EditHistory`
- **Outcome**: Flexible collaborative editing with configurable permissions

---

### PHASE 6: CLIENT REPORTING (Week 9-11)

#### Step 13: Export Planning Reports
- **Story**: **CONS-011**: Export Planning Reports
- **Screen**: Analytics → "Export" button
- **API Endpoint**: `POST /api/reports/generate-consultant-report`
- **Request**:
  ```json
  {
    "consultant_id": "cons_001",
    "business_id": "client_a",
    "report_config": {
      "type": "quarterly_progress",
      "sections": {
        "assessment_summary": {
          "include": true,
          "show_completion_details": true,
          "show_confidence_scores": true
        },
        "okr_progress": {
          "include": true,
          "detail_level": "high"  // low, medium, high
        },
        "team_analysis": {
          "include": true,
          "min_team_size": 3  // Don't show teams with fewer members
        },
        "recommendations": {
          "include": true,
          "max_recommendations": 10  // Configurable
        }
      }
    },
    "format_options": {
      "format": "pdf",
      "page_size": "A4",
      "include_appendix": true
    }
  }
  ```
- **Dynamic Report Generation**:
  ```javascript
  async function generateReport(config) {
    const report = new ReportBuilder(config);

    // Add sections based on configuration
    if (config.sections.assessment_summary.include) {
      report.addSection('assessment', {
        showDetails: config.sections.assessment_summary.show_completion_details,
        confidenceThreshold: config.min_confidence || 0.7
      });
    }

    // Generate with configured settings
    return await report.generate(config.format_options);
  }
  ```
- **Data Models**: `ReportConfig`, `ReportSection`, `FormatOptions`
- **Outcome**: Fully customizable professional reports

---

## 🔗 MULTI-CLIENT ARCHITECTURE

### Dynamic Configuration System

**Template Configuration Management**:
```javascript
class TemplateConfigManager {
  constructor() {
    this.defaults = {
      min_questions: 20,
      max_questions: 200,
      default_questions: 45,
      allow_custom_questions: true,
      dimension_weights_must_sum_100: true
    };
  }

  async createTemplate(config) {
    // Merge user config with defaults
    const finalConfig = {
      ...this.defaults,
      ...config,
      total_questions: config.total_questions || this.defaults.default_questions
    };

    // Validate configuration
    this.validateConfig(finalConfig);

    // Store template with full configuration
    return await db.templates.create({
      ...finalConfig,
      created_at: new Date(),
      version: '1.0'
    });
  }

  validateConfig(config) {
    if (config.total_questions < config.min_questions) {
      throw new Error(`Total questions must be at least ${config.min_questions}`);
    }
    if (config.total_questions > config.max_questions) {
      throw new Error(`Total questions cannot exceed ${config.max_questions}`);
    }
    // Additional validation...
  }
}
```

**Assessment Flexibility**:
```javascript
// No hardcoded values - everything configurable
const AssessmentEngine = {
  getQuestionCount: (template) => template.settings.total_questions,
  getMinRequired: (template) => template.settings.min_questions_required || Math.floor(template.settings.total_questions * 0.5),
  getTimeLimit: (template) => template.settings.time_limit || null,
  getDimensions: (template) => Object.keys(template.dimensions),
  getWeights: (template) => template.dimensions
};
```

---

## 🚨 CRITICAL TECHNICAL INTEGRATIONS

### Dynamic Template System
```javascript
// All values are configurable, no hardcoding
const DEFAULT_CONFIG = {
  questions: {
    min: 10,
    max: 500,
    default: 45,
    distribution: 'flexible'
  },
  dimensions: {
    count: 'variable',  // Can have 2-10 dimensions
    weights: 'flexible'  // Must sum to 100
  },
  completion: {
    required_percentage: 50,  // Configurable
    allow_partial: true,
    save_progress: true
  }
};

// Template creation with full flexibility
async function createAssessmentTemplate(userConfig) {
  const config = deepMerge(DEFAULT_CONFIG, userConfig);
  return await templateEngine.create(config);
}
```

---

## 📊 USER STORIES BY WEEK WITH TECHNICAL COMPLEXITY

### Week 0: Client Onboarding (Sprint 15)
- ⬜ **CONS-019: Add Client with Strategic Context** [API: High - 2-step modal]
- ⬜ **CONS-020: Value-Driven Client Welcome** [Email: Medium - templates]
- ⬜ **CONS-021: Track Client Onboarding Journey** [API: Medium - status tracking]
- ⬜ **CONS-022: Consultant Invites Client Team** [API: Medium - bulk invitations]

### Week 1-4: Assessment System
- ✅ CONS-001: Create Assessment Template [API: High - dynamic configuration]
- ✅ CONS-002: View Assessment Templates [API: Low]
- ✅ CONS-003: Send Assessment Invitation [API: Medium - flexible settings]
- ✅ CONS-004: Track Invitation Status [WebSocket: Medium]
- ✅ CONS-005: View Template Usage Stats [API: Medium - analytics]
- ✅ CONS-006: Generate Client OKRs [API: High - AI with dynamic params]

### Week 6: Multi-Client Insights
- ⬜ CONS-007: View Multi-Company Stats [API: High - normalization]
- ⬜ **CONS-007B: View Team SSI Breakdown** [API: High - visualization]

### Week 9: Planning Advisory
- ⬜ CONS-008: Multi-Company Planning View [API: High - complex queries]
- ⬜ CONS-009: Template Planning Workflows [API: Medium]
- ⬜ CONS-010: Compare Client Plans [API: High - comparison logic]
- ⬜ CONS-011: Export Planning Reports [API: Medium - dynamic generation]

### Week 10: Collaboration (BETA)
- ⬜ **CONS-009B: Collaborative OKR Review** [WebSocket: High - real-time]

**Total Consultant Stories**: 17 (6 complete, 11 not started)
**Technical Complexity**: 9 High, 7 Medium, 1 Low

---

## 🔧 TECHNICAL REQUIREMENTS

### Configuration Requirements
- No hardcoded limits or values
- All thresholds configurable
- Template versioning support
- Dynamic question libraries
- Flexible scoring algorithms

### Performance Requirements
- Template creation: < 3 seconds
- Multi-client dashboard: < 2 seconds
- Cross-client analytics: < 5 seconds
- Report generation: < 10 seconds
- Real-time collaboration: < 200ms latency

### Data Requirements
- Support 100+ clients per consultant
- Handle 1000+ templates with varying configurations
- Store 5 years of client history
- Real-time sync for collaboration

---

## 🔗 RELATED DOCUMENTATION

- [MVP_TECHNICAL_ARCHITECTURE_V5.md](../../KARVIA_STRATEGY/02_TECHNICAL_OVERVIEW/MVP_TECHNICAL_ARCHITECTURE_V5.md)
- [MASTER_DEV_LIST_V5.md](../../KARVIA_STRATEGY/03_DEVELOPMENT_ROADMAP/MASTER_DEV_LIST_V5.md)
- [Multi-Tenancy Design](../../multi_tenancy_design.md)
- [API Documentation](../../api_docs.md)

---

**Version**: 3.0.0
**Last Updated**: 2026-02-24
**Status**: ✅ Technical Architecture Added + Sprint 15 Enhanced Onboarding - Ready for implementation (No hardcoding)