# 🔧 Pre-Sprint Technical Specifications

**Sprint**: PRE-SPRINT (Weeks 0-6)
**Date**: November 5, 2025
**Version**: 1.0

---

## 🏗️ Architecture Changes

### System Architecture
- **Type**: Monolithic with service separation preparation
- **Pattern**: MVC with Repository pattern
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **State Management**: Server-side sessions + localStorage

### Component Architecture
```
karvia_business/
├── server/                 # Backend (Node.js/Express)
│   ├── models/            # 11 Mongoose schemas
│   ├── routes/            # 14 route modules
│   ├── middleware/        # Auth, validation, error handling
│   ├── services/          # Business logic layer
│   └── utils/             # Helpers and utilities
├── client/                # Frontend (Vanilla JS)
│   ├── pages/            # 28 HTML pages
│   ├── js/               # 20+ JavaScript files
│   ├── css/              # 15+ CSS files
│   └── assets/           # Images, fonts
└── config/               # Configuration files
```

---

## 💾 Database Schema Updates

### Collections Created (11 total)

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: Enum ['BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'TEAM_MEMBER', 'ADMIN', 'CONSULTANT'],
  company_id: ObjectId,
  created_at: Date,
  updated_at: Date
}
```

#### 2. Companies Collection
```javascript
{
  _id: ObjectId,
  name: String,
  industry: String,
  size: Number,
  assessment_completed: Boolean,
  ssi_scores: {
    speed: Number,
    strength: Number,
    intelligence: Number
  },
  created_at: Date
}
```

#### 3. Objectives Collection
```javascript
{
  _id: ObjectId,
  company_id: ObjectId,
  title: String,
  description: String,
  quarter: Number,
  year: Number,
  status: Enum ['draft', 'active', 'completed'],
  progress: Number,
  owner_id: ObjectId,
  created_at: Date
}
```

#### 4. Goals Collection
```javascript
{
  _id: ObjectId,
  objective_id: ObjectId,
  title: String,
  target_value: Number,
  current_value: Number,
  unit: String,
  status: String,
  owner_id: ObjectId,
  quarter: Number,
  year: Number
}
```

### Indexes Created
- Users: email (unique), company_id
- Companies: name, industry
- Objectives: company_id, quarter, year
- Goals: objective_id, owner_id, quarter

---

## 🔌 API Endpoints (135+ total)

### Authentication Module (7 endpoints)
```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/refresh           - Refresh JWT token
GET    /api/auth/verify            - Verify token
POST   /api/auth/forgot-password   - Password reset request
POST   /api/auth/reset-password    - Password reset
```

### Assessment Module (10 endpoints)
```
GET    /api/assessments                    - List assessments
POST   /api/assessments                    - Create assessment
GET    /api/assessments/:id                - Get assessment
PUT    /api/assessments/:id                - Update assessment
POST   /api/assessments/:id/submit         - Submit assessment
GET    /api/assessments/:id/results        - Get results
GET    /api/assessment/questions           - Get questions
GET    /api/assessment/templates           - Get templates
POST   /api/assessment/calculate-ssi       - Calculate SSI scores
GET    /api/assessment/recommendations     - Get recommendations
```

### OKR Module (9 endpoints)
```
GET    /api/objectives                     - List objectives
POST   /api/objectives                     - Create objective
GET    /api/objectives/:id                 - Get objective
PUT    /api/objectives/:id                 - Update objective
DELETE /api/objectives/:id                 - Delete objective
GET    /api/objectives/:id/goals           - Get objective goals
POST   /api/objectives/:id/clone           - Clone for next quarter
GET    /api/objectives/quarterly           - Get by quarter
PUT    /api/objectives/:id/progress        - Update progress
```

### AI OKR Module (5 endpoints)
```
POST   /api/ai-okr/generate                - Generate OKRs
GET    /api/ai-okr/status                  - Service status
POST   /api/ai-okr/review                  - Review generated OKRs
POST   /api/ai-okr/refine                  - Refine suggestions
GET    /api/ai-okr/templates               - Get AI templates
```

### Goals Module (8 endpoints) 🆕
```
GET    /api/goals                          - List goals
POST   /api/goals                          - Create goal
GET    /api/goals/:id                      - Get goal
PUT    /api/goals/:id                      - Update goal
DELETE /api/goals/:id                      - Delete goal
GET    /api/goals/quarterly                - Get quarterly goals
GET    /api/goals/weekly                   - Get weekly goals
PUT    /api/goals/:id/progress             - Update progress
```

---

## 🎨 Frontend Components Created

### Pages (28 total, 3 new)

#### Authentication & Onboarding (5 pages)
- login.html
- registration.html
- forgot-password.html
- reset-password.html
- welcome.html

#### Assessment (8 pages)
- business-assessment.html
- assessment-hub.html
- assessment-take.html
- assessment-results.html
- assessment-review-launch.html
- assessment-invitations.html
- assessment-question-library.html
- assessment-step2-customize.html

#### OKR Management (7 pages)
- business-objectives.html
- okr-dashboard.html
- okr-creation-wizard.html
- objectives.html
- ai-okr-review.html
- ai-business-insights.html
- question-library.html

#### Goal Management (3 pages) 🆕
- **quarterly-goals.html** - Quarterly goal tracking
- **weekly-goals.html** - Weekly calendar view
- **goal-details.html** - Individual goal details

#### Team & Analytics (5 pages)
- executive-dashboard.html
- manager-dashboard.html
- team-structure.html
- team-members.html
- analytics-dashboard.html

### JavaScript Modules (20+ files)

#### Core Modules
- common.js - Shared utilities
- auth.js - Authentication handling
- api.js - API communication layer
- validation.js - Form validation

#### Feature Modules
- assessment.js - Assessment logic
- objectives.js - OKR management
- ai-okr.js - AI generation interface
- teams.js - Team management
- analytics.js - Analytics dashboard

#### New Modules 🆕
- **quarterly-goals.js** - Quarterly goal management
- weekly-goals.js (pending implementation)
- goal-details.js (pending implementation)

### CSS Files (15+ files)
- common.css - Global styles
- dashboard.css - Dashboard layouts
- assessment.css - Assessment styling
- objectives.css - OKR styling
- **quarterly-goals.css** - Quarterly view styles 🆕
- Additional component-specific CSS files

---

## 🔄 Integration Points

### External Services
1. **OpenAI GPT-4**
   - Purpose: AI OKR generation
   - Integration: REST API
   - Status: ✅ Operational

2. **Mailjet**
   - Purpose: Email notifications
   - Integration: API
   - Status: ⚠️ Configured but limited use

3. **MongoDB Atlas** (Production)
   - Purpose: Database hosting
   - Integration: Mongoose
   - Status: ✅ Ready

### Internal Integrations
1. **Assessment → AI OKR**
   - SSI scores feed into OKR generation
   - Context passed through API

2. **Objectives → Goals**
   - Goals linked to parent objectives
   - Progress rolls up

3. **Teams → Permissions**
   - Role-based access control
   - Team hierarchy affects visibility

---

## 📊 Performance Metrics

### Current Performance
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Page Load Time | 2-3s | <2s | ⚠️ Needs optimization |
| API Response Time | 100-500ms | <200ms | ⚠️ Variable |
| Database Queries | 5-10/page | <5/page | ⚠️ Needs optimization |
| Bundle Size | ~500KB | <300KB | ❌ Too large |
| Memory Usage | 150MB | <100MB | ⚠️ Acceptable |

### Optimization Opportunities
1. Implement caching layer (Redis)
2. Optimize database queries
3. Add pagination to lists
4. Implement lazy loading
5. Minify and bundle assets

---

## 🔒 Security Updates

### Implemented
- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (using ODM)
- ✅ XSS protection (basic)

### Pending
- ⚠️ Rate limiting
- ⚠️ CSRF protection
- ⚠️ Security headers
- ⚠️ API key management
- ⚠️ Audit logging
- ⚠️ Data encryption at rest

---

## 🏚️ Technical Debt

### High Priority
1. **Frontend Framework**: Using Vanilla JS instead of React
   - Impact: Slower development, harder maintenance
   - Resolution: Post-MVP migration

2. **No Test Coverage**: Only 20% coverage
   - Impact: Higher bug risk
   - Resolution: Add tests in Sprint 2

3. **Manual Deployment**: No CI/CD pipeline
   - Impact: Slow, error-prone deployments
   - Resolution: Implement in Week 9

### Medium Priority
1. Missing error boundaries
2. No request caching
3. Hardcoded configuration values
4. Limited logging
5. No monitoring/alerting

### Low Priority
1. Code duplication in some modules
2. Inconsistent naming conventions
3. Missing TypeScript
4. No API documentation generation

---

## 🔧 Development Environment

### Requirements
```json
{
  "node": ">=14.0.0",
  "npm": ">=6.0.0",
  "mongodb": ">=4.4",
  "git": ">=2.0.0"
}
```

### Key Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "axios": "^1.4.0",
  "dotenv": "^16.0.0",
  "cors": "^2.8.5",
  "openai": "^4.0.0"
}
```

### Environment Variables
```bash
# Server
NODE_ENV=development
PORT=8080

# Database
MONGODB_URI=mongodb://localhost:27017/karvia

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# OpenAI
OPENAI_API_KEY=[REDACTED]

# Email
MAILJET_API_KEY=...
MAILJET_SECRET_KEY=...
```

---

## 📈 Code Statistics

### Lines of Code
- Backend: ~15,000 lines
- Frontend: ~10,000 lines
- Tests: ~2,000 lines
- Configuration: ~500 lines
- **Total**: ~27,500 lines

### File Count
- JavaScript: 50+ files
- HTML: 28 files
- CSS: 15+ files
- JSON: 10+ files
- Markdown: 30+ files

---

## 🎯 Technical Recommendations

### Immediate (Sprint 1)
1. Complete Goal Management JS implementation
2. Add error handling to all API calls
3. Implement loading states
4. Add input validation on frontend

### Short-term (Sprint 2-3)
1. Add comprehensive test suite
2. Implement caching layer
3. Set up CI/CD pipeline
4. Add monitoring

### Long-term (Post-MVP)
1. Migrate to React/Next.js
2. Implement microservices
3. Add real-time features (WebSockets)
4. Implement GraphQL API

---

**Document Version**: 1.0
**Last Updated**: November 5, 2025
**Next Review**: End of Sprint 1