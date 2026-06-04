# KARVIA Pro API - Comprehensive Test Plan

## 📋 Document Information

**Version:** 1.0.0
**Date:** October 27, 2025
**API Version:** 1.0.0
**Total Endpoints:** 128
**Status:** Draft

---

## 🎯 Test Plan Overview

This comprehensive test plan covers all 128 endpoints across 14 API domains of the KARVIA Pro platform. The plan is organized by domain and includes functional, integration, security, and performance testing strategies.

### Test Objectives

1. **Functional Testing**: Verify each endpoint behaves according to specification
2. **Integration Testing**: Ensure endpoints work together correctly
3. **Security Testing**: Validate authentication, authorization, and data security
4. **Performance Testing**: Assess response times and system behavior under load
5. **Data Validation**: Confirm request/response schemas match OpenAPI spec
6. **Error Handling**: Verify proper error responses for invalid inputs

### Test Coverage Goals

- **Endpoint Coverage**: 100% (all 128 endpoints)
- **Method Coverage**: GET, POST, PUT, DELETE, PATCH
- **Response Code Coverage**: 2xx, 4xx, 5xx status codes
- **Security Coverage**: Auth, permissions, data validation
- **Edge Case Coverage**: Boundary conditions, invalid inputs

---

## 🏗️ Test Environment Setup

### Prerequisites

```bash
# 1. Install testing tools
npm install -g newman postman-to-openapi
npm install --save-dev jest supertest

# 2. Set up environment variables
export API_BASE_URL="https://api.karvia.pro"
export TEST_USER_EMAIL="test@example.com"
export TEST_USER_PASSWORD="Test123!"
export JWT_TOKEN=""  # Will be obtained during auth tests

# 3. Initialize test database
npm run db:seed:test
```

### Test Data Requirements

- **Users**: 10 test users with different roles
- **Companies**: 3 test companies (small, medium, large)
- **Teams**: 5 teams per company
- **Objectives**: 20 test objectives
- **Assessments**: 10 completed assessments
- **Test Files**: Sample PDFs, images for upload testing

---

## 📊 Test Organization by Domain

## Domain 1: Authentication (7 endpoints)

### Priority: **CRITICAL**

### Test Cases

#### 1.1 POST /api/auth/register
**Purpose**: User registration
**Priority**: P0

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid registration | Valid email, password | 201, user created | ⬜️ |
| Duplicate email | Existing email | 400, email exists error | ⬜️ |
| Invalid email format | "invalid-email" | 400, validation error | ⬜️ |
| Weak password | "123" | 400, password requirements | ⬜️ |
| Missing required fields | {} | 400, required field error | ⬜️ |

**Automated Test Script:**
```javascript
describe('POST /api/auth/register', () => {
  it('should register new user with valid data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        first_name: 'John',
        last_name: 'Doe'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('user_id');
  });

  it('should reject duplicate email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'existing@example.com',
        password: 'SecurePass123!'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('EMAIL_EXISTS');
  });
});
```

#### 1.2 POST /api/auth/login
**Purpose**: User authentication
**Priority**: P0

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid login | Correct email/password | 200, JWT token | ⬜️ |
| Invalid email | Non-existent email | 401, authentication failed | ⬜️ |
| Invalid password | Wrong password | 401, authentication failed | ⬜️ |
| Account suspended | Suspended user | 403, account suspended | ⬜️ |
| Rate limiting | 10+ failed attempts | 429, too many attempts | ⬜️ |

#### 1.3 GET /api/auth/me
**Purpose**: Get current user profile
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| With valid token | Bearer token | 200, user profile | ⬜️ |
| Without token | No auth header | 401, unauthorized | ⬜️ |
| With expired token | Expired JWT | 401, token expired | ⬜️ |
| With invalid token | Malformed JWT | 401, invalid token | ⬜️ |

#### 1.4 POST /api/auth/logout
**Purpose**: User logout
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid logout | Valid token | 200, logged out | ⬜️ |
| Already logged out | Invalidated token | 401, unauthorized | ⬜️ |

---

## Domain 2: Companies (8 endpoints)

### Priority: **HIGH**

### Test Cases

#### 2.1 GET /api/companies
**Purpose**: List all companies
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Default pagination | No params | 200, first 20 companies | ⬜️ |
| Custom pagination | page=2&limit=10 | 200, page 2 with 10 items | ⬜️ |
| Empty results | page=999 | 200, empty array | ⬜️ |
| As admin user | Admin token | 200, all companies | ⬜️ |
| As regular user | User token | 200, user's company only | ⬜️ |

#### 2.2 POST /api/companies
**Purpose**: Create new company
**Priority**: P0

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid company | Complete data | 201, company created | ⬜️ |
| Missing required fields | Incomplete data | 400, validation error | ⬜️ |
| Duplicate company name | Existing name | 400, name exists | ⬜️ |
| Invalid industry | "invalid_industry" | 400, invalid enum value | ⬜️ |
| Unauthorized user | Non-admin token | 403, insufficient permissions | ⬜️ |

#### 2.3 PUT /api/companies/{id}
**Purpose**: Update company details
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid update | Partial data | 200, company updated | ⬜️ |
| Non-existent company | Invalid ID | 404, company not found | ⬜️ |
| Unauthorized update | Different company user | 403, forbidden | ⬜️ |
| Update subscription | Upgrade plan | 200, plan updated | ⬜️ |

---

## Domain 3: Objectives (15 endpoints)

### Priority: **CRITICAL**

### Test Cases

#### 3.1 GET /api/objectives
**Purpose**: List objectives with filters
**Priority**: P0

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| All objectives | No filters | 200, paginated list | ⬜️ |
| By status filter | status=active | 200, active objectives only | ⬜️ |
| By date range | start_date, end_date | 200, objectives in range | ⬜️ |
| By owner | owner_id=123 | 200, user's objectives | ⬜️ |
| By team | team_id=456 | 200, team objectives | ⬜️ |
| Search by title | search="Q1 Goals" | 200, matching objectives | ⬜️ |

#### 3.2 POST /api/objectives
**Purpose**: Create new objective
**Priority**: P0

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| With key results | Complete OKR | 201, objective with KRs | ⬜️ |
| Without key results | Objective only | 201, objective created | ⬜️ |
| Invalid date range | end_date < start_date | 400, invalid dates | ⬜️ |
| Missing title | No title | 400, title required | ⬜️ |
| Exceed max objectives | 51st objective | 400, limit reached | ⬜️ |

#### 3.3 PUT /api/objectives/{id}/progress
**Purpose**: Update key result progress
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Update single KR | Valid progress data | 200, progress updated | ⬜️ |
| Update multiple KRs | Array of progress | 200, all KRs updated | ⬜️ |
| Progress > 100% | progress: 150 | 400, invalid progress | ⬜️ |
| Progress < 0% | progress: -10 | 400, invalid progress | ⬜️ |
| Non-owner update | Different user | 403, forbidden | ⬜️ |

#### 3.4 POST /api/objectives/{id}/cascade
**Purpose**: Cascade objective to teams/users
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Cascade to teams | Valid targets | 201, objectives created | ⬜️ |
| Circular dependency | Parent as child | 400, circular dependency | ⬜️ |
| Weight validation | Total weight > 100 | 400, invalid weights | ⬜️ |
| Auto weight distribution | Equal mode | 201, auto-calculated weights | ⬜️ |

---

## Domain 4: AI OKR Generation (10 endpoints)

### Priority: **MEDIUM**

### Test Cases

#### 4.1 POST /api/ai-okr/generate/{assessmentId}
**Purpose**: Generate OKR suggestions from assessment
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid assessment | Assessment ID | 200, AI suggestions | ⬜️ |
| Non-existent assessment | Invalid ID | 404, not found | ⬜️ |
| Low confidence threshold | threshold=0.6 | 200, more suggestions | ⬜️ |
| High confidence threshold | threshold=0.9 | 200, fewer suggestions | ⬜️ |
| Without AI feature | Standard plan | 403, feature not available | ⬜️ |
| Assessment not completed | Incomplete assessment | 400, assessment incomplete | ⬜️ |

#### 4.2 POST /api/ai-okr/suggestions/{id}/approve
**Purpose**: Approve and create objective from suggestion
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid approval | Suggestion ID | 200, objective created | ⬜️ |
| Already approved | Approved suggestion | 400, already approved | ⬜️ |
| With modifications | Edited suggestion | 200, modified objective | ⬜️ |

---

## Domain 5: Analytics (14 endpoints)

### Priority: **HIGH**

### Test Cases

#### 5.1 GET /api/analytics/dashboard
**Purpose**: Get analytics dashboard data
**Priority**: P1

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Company dashboard | company_id | 200, dashboard data | ⬜️ |
| Team dashboard | team_id | 200, team analytics | ⬜️ |
| Individual dashboard | user_id | 200, personal analytics | ⬜️ |
| Date range filter | start_date, end_date | 200, filtered data | ⬜️ |
| No data available | New company | 200, empty dashboard | ⬜️ |

#### 5.2 GET /api/analytics/forecast
**Purpose**: Get predictive analytics
**Priority**: P2

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Valid forecast | entity_id, period | 200, predictions | ⬜️ |
| Insufficient data | < 3 months data | 400, insufficient data | ⬜️ |
| Multiple scenarios | scenario params | 200, scenario forecasts | ⬜️ |

---

## 🔒 Security Test Cases

### Authentication Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| No auth header | Request without Authorization | 401 Unauthorized | ⬜️ |
| Malformed token | Invalid JWT format | 401 Invalid token | ⬜️ |
| Expired token | Token past expiration | 401 Token expired | ⬜️ |
| Wrong signature | Tampered JWT | 401 Invalid signature | ⬜️ |
| Revoked token | Logged out user token | 401 Token revoked | ⬜️ |

### Authorization Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| Role-based access | Employee access admin endpoint | 403 Forbidden | ⬜️ |
| Resource ownership | User A access User B's data | 403 Forbidden | ⬜️ |
| Company boundaries | User access other company data | 403 Forbidden | ⬜️ |
| Team permissions | Non-member access team data | 403 Forbidden | ⬜️ |

### Input Validation Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| SQL injection | Malicious SQL in parameters | 400 Validation error | ⬜️ |
| XSS attacks | Script tags in text fields | 400 Sanitized input | ⬜️ |
| Path traversal | ../../../etc/passwd in paths | 400 Invalid path | ⬜️ |
| Oversized payload | Request > 10MB | 413 Payload too large | ⬜️ |
| Invalid JSON | Malformed JSON body | 400 Parse error | ⬜️ |

### Data Security Testing

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| Password storage | Check database | Passwords hashed | ⬜️ |
| Sensitive data in logs | Check application logs | No passwords/tokens logged | ⬜️ |
| HTTPS enforcement | HTTP request | Redirect to HTTPS | ⬜️ |
| CORS policy | Cross-origin request | Proper CORS headers | ⬜️ |

---

## ⚡ Performance Test Cases

### Load Testing

| Test Scenario | Concurrent Users | Duration | Target | Status |
|---------------|------------------|----------|--------|--------|
| Normal load | 50 | 5 min | < 500ms avg | ⬜️ |
| Peak load | 200 | 10 min | < 1s avg | ⬜️ |
| Stress test | 500 | 5 min | System stable | ⬜️ |

### Endpoint Performance Targets

| Endpoint Type | Target Response Time | Acceptable | Status |
|---------------|---------------------|------------|--------|
| GET (simple) | < 100ms | < 200ms | ⬜️ |
| GET (complex query) | < 300ms | < 500ms | ⬜️ |
| POST/PUT | < 200ms | < 400ms | ⬜️ |
| DELETE | < 100ms | < 200ms | ⬜️ |
| Analytics queries | < 1s | < 2s | ⬜️ |
| AI generation | < 5s | < 10s | ⬜️ |

### Performance Test Script

```javascript
// Using k6 for load testing
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up
    { duration: '5m', target: 50 },   // Stay at 50
    { duration: '2m', target: 200 },  // Ramp to 200
    { duration: '5m', target: 200 },  // Stay at 200
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    http_req_failed: ['rate<0.01'],   // < 1% failures
  },
};

export default function () {
  const token = 'your-jwt-token';

  let response = http.get('https://api.karvia.pro/api/objectives', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

---

## 🔄 Integration Test Scenarios

### Scenario 1: Complete User Onboarding Flow

**Steps:**
1. POST /api/auth/register → Create account
2. POST /api/auth/login → Get JWT token
3. GET /api/auth/me → Verify user profile
4. POST /api/assessments/start → Begin assessment
5. POST /api/assessments/{id}/submit-responses → Complete assessment
6. POST /api/ai-okr/generate/{assessmentId} → Generate OKR suggestions
7. POST /api/ai-okr/suggestions/{id}/approve → Create first objective
8. GET /api/objectives → Verify objective created

**Expected Result**: Complete flow succeeds, user has 1 objective

### Scenario 2: Team OKR Management

**Steps:**
1. POST /api/teams → Create team
2. POST /api/teams/{id}/members → Add team members
3. POST /api/objectives → Create team objective
4. POST /api/objectives/{id}/cascade → Cascade to members
5. PUT /api/objectives/{childId}/progress → Update member progress
6. GET /api/analytics/team → View team analytics
7. GET /api/cascade/alignment-report → Check alignment

**Expected Result**: Team OKRs cascaded, progress tracked, analytics available

### Scenario 3: Full Assessment Cycle

**Steps:**
1. POST /api/assessment-templates → Create template
2. POST /api/invitations → Invite user
3. POST /api/invitations/accept/{token} → User accepts
4. POST /api/assessments/start → Start assessment
5. GET /api/assessments/questions → Get questions
6. POST /api/assessments/{id}/submit-responses → Submit answers
7. POST /api/assessments/{id}/calculate → Calculate SSI score
8. GET /api/assessments/{id}/results → View results
9. GET /api/analytics/progress → Track over time

**Expected Result**: Complete assessment workflow functional

---

## 🧪 Test Execution Strategy

### Phase 1: Smoke Testing (Week 1)
- Test 1 endpoint per domain
- Verify basic connectivity
- Validate authentication
- **Priority**: P0 endpoints

### Phase 2: Functional Testing (Week 2-3)
- Test all CRUD operations
- Validate request/response schemas
- Test error handling
- **Priority**: P0, P1 endpoints

### Phase 3: Integration Testing (Week 4)
- Execute end-to-end scenarios
- Test cross-domain workflows
- Validate data consistency
- **Priority**: All critical flows

### Phase 4: Security Testing (Week 5)
- Authentication/authorization tests
- Input validation tests
- Penetration testing
- **Priority**: All endpoints

### Phase 5: Performance Testing (Week 6)
- Load testing
- Stress testing
- Endurance testing
- **Priority**: High-traffic endpoints

### Phase 6: Regression Testing (Ongoing)
- Automated test suite
- CI/CD integration
- Daily smoke tests
- **Priority**: All tests

---

## 📝 Test Reporting

### Test Metrics to Track

- **Total Tests**: Planned vs Executed
- **Pass Rate**: Passed / Total * 100
- **Defect Density**: Defects / Endpoint
- **Coverage**: Endpoints tested / Total endpoints
- **Performance**: Avg response time per domain
- **Security**: Vulnerabilities found & fixed

### Test Report Template

```markdown
## Test Execution Report - [Date]

### Summary
- Total Endpoints: 128
- Endpoints Tested: X
- Tests Passed: Y
- Tests Failed: Z
- Pass Rate: Y/(Y+Z) * 100%

### By Domain
| Domain | Endpoints | Tests | Passed | Failed | Pass Rate |
|--------|-----------|-------|--------|--------|-----------|
| Auth   | 7         | 35    | 33     | 2      | 94.3%     |
| ...    | ...       | ...   | ...    | ...    | ...       |

### Critical Issues
1. Issue description
2. Issue description

### Performance Results
- Average response time: Xms
- P95 response time: Yms
- Failed requests: Z%

### Recommendations
- Action items
- Follow-up required
```

---

## 🛠️ Test Tools & Frameworks

### Recommended Tools

1. **Postman/Newman** - Manual & automated API testing
2. **Jest + Supertest** - Unit & integration testing
3. **k6** - Load & performance testing
4. **OWASP ZAP** - Security testing
5. **Swagger Inspector** - OpenAPI validation
6. **Dredd** - API contract testing

### CI/CD Integration

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Smoke Tests
        run: newman run tests/smoke.postman_collection.json
      - name: Run Integration Tests
        run: npm run test:integration
      - name: Run Security Tests
        run: npm run test:security
```

---

## ✅ Test Completion Checklist

### Pre-Testing
- [ ] Test environment set up
- [ ] Test data prepared
- [ ] Test tools configured
- [ ] OpenAPI spec validated
- [ ] Test plan reviewed & approved

### Testing Execution
- [ ] Smoke tests completed
- [ ] Functional tests completed
- [ ] Integration tests completed
- [ ] Security tests completed
- [ ] Performance tests completed
- [ ] Regression tests completed

### Post-Testing
- [ ] Defects logged & prioritized
- [ ] Test report generated
- [ ] Results reviewed with team
- [ ] Action items assigned
- [ ] Documentation updated

---

## 📞 Contact & Support

**QA Lead**: [Name]
**API Owner**: [Name]
**Security Lead**: [Name]

For questions or issues related to this test plan, please contact the QA team.

---

**Document Version**: 1.0.0
**Last Updated**: October 27, 2025
**Next Review**: November 27, 2025
