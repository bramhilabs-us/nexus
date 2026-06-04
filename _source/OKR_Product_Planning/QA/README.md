# Karvia Business - QA & Testing Strategy

**Last Updated**: October 17, 2025
**Owner**: Engineering Team
**Philosophy**: Test-Driven Development (TDD) with pragmatic coverage goals

---

## 🎯 Testing Philosophy

### **Core Principles**

1. **Test First, Deploy Confidently**: Write tests alongside features, not after
2. **Pragmatic Coverage**: 80% overall coverage, 100% for critical paths
3. **Fast Feedback**: Unit tests run in < 30s, full suite in < 5 min
4. **Readable Tests**: Tests are documentation - write them clearly
5. **Minimal Maintenance**: Reusable templates, avoid documentation burden

---

## 📊 Test Pyramid Strategy

```
        /\
       /  \      E2E Tests (5%)
      /____\     - Critical user journeys only
     /      \    - Slowest, most expensive
    /________\
   /          \  Integration Tests (15%)
  /____________\ - API endpoints, DB interactions
 /              \
/________________\ Unit Tests (80%)
                   - Fast, isolated, comprehensive
```

### **Why This Distribution?**
- **Unit tests** (80%): Fast, catch bugs early, easy to maintain
- **Integration tests** (15%): Verify components work together
- **E2E tests** (5%): Validate critical user journeys work end-to-end

---

## 🎯 Coverage Requirements

### **Overall Target**: 80%
- **Critical paths**: 100% (auth, payments, data integrity)
- **Business logic**: 90% (scoring, calculations, validations)
- **Routes/Controllers**: 75% (error cases covered)
- **Utilities**: 85% (edge cases tested)

### **Coverage Gates**:
- Cannot commit if coverage drops below 75%
- Cannot deploy if critical paths < 95%
- Weekly coverage reports generated

---

## 🏗️ Testing Infrastructure

### **Frameworks**:
- **Unit & Integration**: Jest (fast, great DX, built-in coverage)
- **E2E**: Playwright (modern, fast, reliable)
- **API Testing**: Supertest (Express integration)
- **Validation**: Joi schemas (input validation)

### **Test Database**:
- **Development**: MongoDB Memory Server (isolated, fast)
- **CI/CD**: Containerized MongoDB (realistic)
- **Fixtures**: Reusable test data in `tests/fixtures/`

---

## 📁 Folder Structure

```
Karvia_OKR_Product_Planning/QA/
├── README.md                      # This file - Testing strategy
├── templates/
│   └── weekly-test-plan.md        # Reusable template (clone per week)
├── Week_1/
│   └── test-plan.md               # Week 1 test cases
├── Week_2/
│   └── test-plan.md               # Week 2 test cases
└── Week_X/
    └── test-plan.md               # Future weeks

karvia_business/tests/
├── unit/                          # Unit tests (80%)
│   ├── models/
│   ├── services/
│   ├── middleware/
│   └── utils/
├── integration/                   # Integration tests (15%)
│   ├── api/
│   └── flows/
├── e2e/                           # End-to-end tests (5%)
│   └── critical-paths/
├── fixtures/                      # Test data
├── helpers/                       # Test utilities
└── config/                        # Jest configuration
```

---

## 🔄 Testing Workflow

### **Development Cycle**:
```
1. Write test (Red)
   ↓
2. Implement feature (Green)
   ↓
3. Refactor code (Refactor)
   ↓
4. Run test suite (Validate)
   ↓
5. Commit with tests
```

### **Pre-Deployment**:
```bash
# Run all quality gates
./scripts/pre-deploy.sh

# What it checks:
✓ No uncommitted changes
✓ Linter passes (ESLint)
✓ Unit tests pass
✓ Integration tests pass
✓ Coverage ≥ 80%
✓ No exposed secrets
✓ Security audit clean
```

---

## 📝 Weekly Test Planning

### **Process**:
1. Clone `templates/weekly-test-plan.md` to `Week_X/test-plan.md`
2. Document test cases for each task
3. Write tests alongside implementation
4. Update test plan with results
5. Generate weekly coverage report

### **Test Case Format**:
```markdown
### TC-WX-XXX: Feature Name
- **Priority**: P0/P1/P2
- **Type**: Unit/Integration/E2E
- **Test File**: path/to/test.js
- **Description**: What is being tested
- **Steps**: How to test
- **Expected**: What should happen
- **Actual**: What happened
- **Status**: ✅ Pass / ❌ Fail / ⏸️ Skip
```

---

## 🎯 What to Test

### **Always Test**:
- ✅ Authentication & authorization
- ✅ Input validation (happy path + edge cases)
- ✅ Business logic calculations
- ✅ Database operations (CRUD)
- ✅ Error handling (expected errors)
- ✅ Critical user flows (signup → assessment → results)

### **Sometimes Test**:
- Utility functions (if complex)
- Middleware (if custom logic)
- Routes (integration tests preferred)

### **Rarely Test**:
- Third-party library wrappers (unless complex)
- Simple getters/setters
- Constants/config files

---

## 🚀 Running Tests

### **Commands**:
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Run in watch mode (TDD)
npm run test:watch

# Run specific test file
npm test -- path/to/test.js

# Run pre-deployment checks
./scripts/pre-deploy.sh
```

---

## 📊 Coverage Reporting

### **When Generated**:
- Automatically on every test run (if `--coverage` flag)
- Weekly: Friday end-of-day
- Pre-deployment: Always

### **Where to Find**:
- Terminal: Summary table
- HTML Report: `coverage/lcov-report/index.html`
- JSON Report: `coverage/coverage-final.json`
- QA Reports: `QA/reports/Week_X/coverage/`

---

## 🔧 Test Utilities

### **Fixtures** (`tests/fixtures/`):
Predefined test data for consistency:
- `users.fixture.js` - Sample users (all 5 roles)
- `businesses.fixture.js` - Sample businesses
- `templates.fixture.js` - Sample templates
- `assessments.fixture.js` - Sample assessments

### **Factories** (`tests/helpers/factories.js`):
Generate test data on-the-fly:
```javascript
const user = createUser({ role: 'MANAGER' });
const business = createBusiness({ employee_count: 50 });
```

### **Mocks** (`tests/helpers/mocks.js`):
Mock external services:
- Mailjet API
- OpenAI API
- Payment gateways (future)

---

## ✅ Best Practices

### **DO**:
- ✅ Write tests first (TDD)
- ✅ Test one thing per test
- ✅ Use descriptive test names
- ✅ Mock external dependencies
- ✅ Clean up after tests (teardown)
- ✅ Use factories for test data
- ✅ Test error cases, not just happy path

### **DON'T**:
- ❌ Skip tests to "save time" (they save time later!)
- ❌ Test implementation details (test behavior)
- ❌ Copy-paste tests (use factories)
- ❌ Leave failing tests ("will fix later")
- ❌ Test third-party code
- ❌ Hard-code test data (use fixtures)

---

## 📈 Success Metrics

### **Quality Indicators**:
- Test suite runs in < 5 minutes
- Coverage stays ≥ 80%
- < 5% flaky tests
- Zero critical paths untested
- Tests caught bugs before production

### **Velocity Indicators**:
- Time to add new test: < 5 minutes
- Time to run full suite: < 5 minutes
- Time to debug failing test: < 15 minutes
- Tests written per feature: 3-5 on average

---

## 🔗 Resources

- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Playwright Docs**: https://playwright.dev/
- **Supertest Docs**: https://github.com/visionmedia/supertest
- **Testing Best Practices**: https://testingjavascript.com/

---

**Status**: Infrastructure established (Week 2 Day 2.5)
**Next**: Write tests for Week 2 Day 1 work (SecretsManager, Logger, Error Handling)
