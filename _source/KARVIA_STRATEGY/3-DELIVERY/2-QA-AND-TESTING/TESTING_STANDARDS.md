# Karvia Business - Testing Standards

**Version**: 1.0
**Last Updated**: March 6, 2026
**Status**: Active

---

## 1. Test Naming Conventions

### File Naming
```
[module].[type].test.js

Examples:
- auth.unit.test.js
- goals-api.integration.test.js
- golden-path.e2e.test.js
- multi-tenant.security.test.js
```

### Test Description Format
```javascript
describe('[Module/Feature]', () => {
  describe('[Scenario/Method]', () => {
    test('[action] should [expected outcome]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Examples
```javascript
describe('GoalsAPI', () => {
  describe('POST /api/goals/quarterly', () => {
    test('creating goal should return 201 with goal data', async () => {
      // ...
    });

    test('creating goal without auth should return 401', async () => {
      // ...
    });
  });
});
```

---

## 2. Test Structure (AAA Pattern)

Every test should follow **Arrange-Act-Assert**:

```javascript
test('should calculate SSI score correctly', () => {
  // Arrange - Setup test data
  const responses = [
    { question_id: 'q1', value: 8 },
    { question_id: 'q2', value: 6 }
  ];

  // Act - Execute the function
  const result = calculateSSIScore(responses);

  // Assert - Verify outcome
  expect(result.speed).toBe(7);
  expect(result.overall).toBeGreaterThan(0);
});
```

---

## 3. Test Categories

### Unit Tests (`tests/unit/`)
- Test single functions/methods in isolation
- Mock all external dependencies
- Target: <50ms per test
- Coverage: 80% of business logic

```javascript
// Good: Isolated unit test
test('escapeHtml should escape < and > characters', () => {
  const input = '<script>alert("xss")</script>';
  const output = escapeHtml(input);
  expect(output).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
});
```

### Integration Tests (`tests/integration/`)
- Test API endpoints with real database
- Use test database (mongo-memory-server or test instance)
- Target: <500ms per test
- Coverage: All public API routes

```javascript
// Good: Integration test with real DB
test('POST /api/goals should create goal in database', async () => {
  const response = await request(app)
    .post('/api/goals/quarterly')
    .set('Authorization', `Bearer ${testToken}`)
    .send(validGoalData);

  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();

  // Verify in database
  const goal = await Goal.findById(response.body.id);
  expect(goal.title).toBe(validGoalData.title);
});
```

### E2E Tests (`tests/e2e/`)
- Test complete user journeys
- Use real or staging environment
- Target: <30s per journey
- Coverage: 5 critical paths

### Security Tests (`tests/security/`)
- Multi-tenant isolation
- Role-based access control
- Input validation
- XSS/injection prevention

---

## 4. Mocking Guidelines

### What to Mock
- External APIs (OpenAI, Mailjet)
- File system operations
- Time-sensitive operations (`Date.now()`)
- Third-party services

### What NOT to Mock
- Database operations (in integration tests)
- Internal business logic
- Your own services (unless testing in isolation)

### Mock Patterns

```javascript
// Mock external service
jest.mock('../../services/mailjetService', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true })
}));

// Mock time
jest.useFakeTimers();
jest.setSystemTime(new Date('2026-03-06'));

// Restore after test
afterEach(() => {
  jest.useRealTimers();
});
```

---

## 5. Test Data Management

### Fixtures Location
```
tests/
├── fixtures/
│   ├── users.json
│   ├── companies.json
│   ├── assessments.json
│   └── goals.json
├── helpers/
│   ├── testUtils.js
│   ├── dbHelper.js
│   └── authHelper.js
```

### Factory Functions

```javascript
// tests/helpers/factories.js
const createTestUser = (overrides = {}) => ({
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  role: 'EMPLOYEE',
  company_id: new ObjectId(),
  ...overrides
});

const createTestGoal = (overrides = {}) => ({
  title: 'Test Goal',
  time_period: 'QUARTERLY',
  target_value: 100,
  current_value: 0,
  ...overrides
});
```

### Database Cleanup

```javascript
// tests/setup.js
beforeEach(async () => {
  // Clear collections before each test
  await Promise.all([
    User.deleteMany({}),
    Goal.deleteMany({}),
    Assessment.deleteMany({})
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
});
```

---

## 6. Assertions Best Practices

### Be Specific
```javascript
// BAD: Too vague
expect(result).toBeTruthy();

// GOOD: Specific assertion
expect(result.status).toBe('completed');
expect(result.progress).toBe(100);
```

### Test Error Cases
```javascript
test('should throw error for invalid input', async () => {
  await expect(createGoal(invalidData))
    .rejects
    .toThrow('Invalid goal data');
});
```

### Snapshot Testing (Use Sparingly)
```javascript
// Only for stable, complex outputs
test('SSI report structure', () => {
  const report = generateSSIReport(mockData);
  expect(report).toMatchSnapshot();
});
```

---

## 7. Multi-Tenant Testing Standards

Every API endpoint test MUST include tenant isolation verification:

```javascript
describe('Multi-Tenant Isolation', () => {
  let companyA, companyB;

  beforeAll(async () => {
    companyA = await createTestCompany('A');
    companyB = await createTestCompany('B');
  });

  test('Company A cannot access Company B goals', async () => {
    const response = await request(app)
      .get(`/api/goals/${companyB.goalId}`)
      .set('Authorization', `Bearer ${companyA.token}`);

    expect(response.status).toBe(403);
  });

  test('GET /api/goals returns only own company data', async () => {
    const response = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${companyA.token}`);

    expect(response.body.every(g => g.company_id === companyA.id)).toBe(true);
  });
});
```

---

## 8. Coverage Requirements

| Category | Minimum | Target |
|----------|---------|--------|
| **Statements** | 70% | 80% |
| **Branches** | 65% | 75% |
| **Functions** | 75% | 85% |
| **Lines** | 70% | 80% |

### Critical Paths (100% Required)
- Authentication flow
- Payment processing (if any)
- Data mutations (create, update, delete)
- Multi-tenant data access

### Coverage Exceptions
Mark intentionally uncovered code:
```javascript
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

---

## 9. CI/CD Test Requirements

### Pull Request Checks
- All unit tests pass
- All integration tests pass
- Coverage ≥75%
- No lint errors

### Pre-Production (pre-prod branch)
- All above +
- Security tests pass
- E2E golden path passes

### Production (production branch)
- All above +
- CONSULTANT role suite passes
- Full regression suite passes

---

## 10. Test Review Checklist

Before merging test code:

- [ ] Tests follow AAA pattern
- [ ] Tests are independent (no order dependency)
- [ ] Tests clean up after themselves
- [ ] Mocks are reset between tests
- [ ] Error cases are tested
- [ ] Multi-tenant isolation is verified (for API tests)
- [ ] Test names are descriptive
- [ ] No hardcoded test data (use factories)
- [ ] No `console.log` statements
- [ ] No `.only` or `.skip` in committed code

---

**Document Version**: 1.0
**Owner**: QA Team
