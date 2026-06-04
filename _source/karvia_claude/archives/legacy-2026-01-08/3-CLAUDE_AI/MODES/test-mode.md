# 🧪 TEST MODE

> **Optimized context and workflow for quality assurance and testing**

## 🎯 Mode Purpose

TEST MODE is activated when you need to:
- Write comprehensive tests
- Improve code coverage
- Validate functionality
- Ensure quality standards
- Verify performance

---

## 📦 Context Package

### 🔵 Framework Context (Always Loaded)
```yaml
Standards:
  - /2-DEVELOPMENT/TESTING/TESTING_GUIDE.md
  - /2-DEVELOPMENT/TESTING/TEST_SCENARIOS.md
  - Test naming conventions
  - Assertion patterns
  - Mock strategies

Tools:
  - Test runner configuration
  - Coverage tools
  - Mock libraries
  - Performance benchmarks
  - CI/CD pipeline status
```

### 🟠 Karvia-Specific Context
```yaml
Test Suites:
  - Unit tests location
  - Integration tests
  - E2E test scenarios
  - Performance tests

Coverage Reports:
  - Current coverage: X%
  - Uncovered files
  - Critical paths
  - Coverage trends

Test Data:
  - Mock data sets
  - Test databases
  - API fixtures
  - User scenarios
```

---

## 🔄 Testing Workflow

### Step 1: Test Planning
```markdown
1. Identify what needs testing
2. Review requirements
3. Define test scenarios
4. Plan test data
5. Choose test strategy
```

### Step 2: Test Implementation
```markdown
1. Write failing test (Red)
2. Implement minimum code (Green)
3. Refactor if needed (Refactor)
4. Add edge cases
5. Add negative tests
```

### Step 3: Test Execution
```markdown
1. Run unit tests
2. Run integration tests
3. Check coverage
4. Run performance tests
5. Validate CI/CD
```

### Step 4: Coverage Analysis
```markdown
1. Review coverage report
2. Identify gaps
3. Prioritize critical paths
4. Add missing tests
5. Verify improvement
```

---

## ✅ TEST MODE Checklist

### Test Quality Checklist
- [ ] Tests are readable
- [ ] Tests are isolated
- [ ] Tests are repeatable
- [ ] Tests are fast
- [ ] Tests cover edge cases

### Coverage Checklist
- [ ] Unit test coverage > 80%
- [ ] Critical paths 100% covered
- [ ] Integration tests present
- [ ] E2E scenarios covered
- [ ] Performance benchmarks set

### Test Types Checklist
- [ ] Unit tests written
- [ ] Integration tests added
- [ ] E2E tests implemented
- [ ] Performance tests run
- [ ] Security tests passed

---

## 🎮 Available Commands

### Test Execution
```bash
"run tests"             # All tests
"run unit"              # Unit only
"run integration"       # Integration only
"run e2e"               # End-to-end
"run failed"            # Re-run failures
"run [file]"           # Specific file
```

### Test Creation
```bash
"write test"            # New test file
"add test"              # Add test case
"test this"             # Test current code
"mock [service]"        # Create mock
"stub [function]"       # Create stub
```

### Coverage Commands
```bash
"coverage"              # Show report
"coverage detail"       # Detailed view
"coverage [file]"       # File coverage
"missing coverage"      # Show gaps
"improve coverage"      # Suggest tests
```

### Analysis Commands
```bash
"test performance"      # Benchmark tests
"test security"         # Security scan
"test accessibility"    # A11y tests
"test compatibility"    # Cross-browser
```

---

## 📊 Testing Metrics

### Coverage Targets
```yaml
Overall Coverage: > 80%
Branch Coverage: > 75%
Function Coverage: > 85%
Line Coverage: > 80%

Critical Paths: 100%
API Endpoints: 100%
Error Handlers: 100%
Security Functions: 100%
```

### Performance Benchmarks
```yaml
Unit Test Suite: < 30 seconds
Integration Suite: < 2 minutes
E2E Suite: < 5 minutes
Single Test: < 100ms
Test Startup: < 2 seconds
```

---

## 🧪 Test Patterns

### Unit Test Pattern
```javascript
describe('UserService', () => {
  let service;
  let mockRepository;

  beforeEach(() => {
    mockRepository = createMock(UserRepository);
    service = new UserService(mockRepository);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, name: 'John' };
      mockRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await service.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw when user not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserById('999'))
        .rejects.toThrow('User not found');
    });
  });
});
```

### Integration Test Pattern
```javascript
describe('API Integration', () => {
  let app;
  let database;

  beforeAll(async () => {
    database = await setupTestDatabase();
    app = await createApp(database);
  });

  afterAll(async () => {
    await database.cleanup();
  });

  describe('POST /users', () => {
    it('should create user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        ...userData
      });

      // Verify in database
      const user = await database.users.findById(response.body.id);
      expect(user).toBeTruthy();
    });
  });
});
```

### E2E Test Pattern
```javascript
describe('User Journey', () => {
  it('should complete registration flow', async () => {
    // Navigate to registration
    await page.goto('/register');

    // Fill form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');

    // Submit
    await page.click('[type="submit"]');

    // Verify redirect
    await expect(page).toHaveURL('/dashboard');

    // Verify welcome message
    await expect(page.locator('.welcome')).toContainText('Welcome');
  });
});
```

---

## 🔧 Mock Strategies

### Types of Test Doubles
```javascript
// Stub - Returns predefined values
const stub = sinon.stub(service, 'getUser')
  .returns({ id: 1, name: 'Test' });

// Mock - Verifies interactions
const mock = jest.fn();
mock.mockReturnValue('mocked');
expect(mock).toHaveBeenCalledWith('arg');

// Spy - Records calls
const spy = sinon.spy(console, 'log');
functionUnderTest();
assert(spy.calledOnce);

// Fake - Working implementation
class FakeDatabase {
  data = [];
  save(item) { this.data.push(item); }
  find(id) { return this.data.find(i => i.id === id); }
}
```

---

## 🚫 Testing Anti-Patterns

### Avoid These in TEST MODE
```javascript
// ❌ Testing implementation details
it('should call internal method', () => {
  // Tests how, not what
});

// ❌ Overly complex setup
beforeEach(() => {
  // 50 lines of setup
});

// ❌ Testing multiple things
it('should create, update, and delete user', () => {
  // Too much in one test
});

// ❌ Flaky tests
it('should work sometimes', async () => {
  await sleep(1000); // Timing dependent
});

// ❌ No assertion
it('should not throw', () => {
  functionUnderTest(); // No expect()
});
```

---

## 🎯 Success Criteria

TEST MODE is successful when:
1. ✅ All tests passing
2. ✅ Coverage targets met
3. ✅ No flaky tests
4. ✅ Performance benchmarks met
5. ✅ Critical paths covered
6. ✅ CI/CD green

---

## 🔄 Transition Points

### When to Switch Modes
```yaml
To CODE MODE:
  - Tests failing due to missing implementation
  - Need to add features
  - Refactoring required

To DEBUG MODE:
  - Unexpected test failures
  - Flaky tests
  - Performance issues

To DEPLOY MODE:
  - All tests passing
  - Coverage met
  - Ready for release

To PLAN MODE:
  - Need more test scenarios
  - Test strategy unclear
```

---

## 📈 Quality Metrics

### Tracked in TEST MODE
```yaml
Tests Written: Count of new tests
Coverage Delta: Coverage change
Test Duration: Execution time
Flaky Tests: Unreliable tests
Bug Detection: Bugs found by tests
Test Maintenance: Time updating tests
```

---

## 💡 Pro Tips for TEST MODE

1. **Test behavior, not implementation**
2. **One assertion per test** (when possible)
3. **Use descriptive test names**
4. **Keep tests fast** - mock external dependencies
5. **Test edge cases** - nulls, empties, errors
6. **Make tests readable** - they're documentation
7. **Maintain test hygiene** - refactor tests too

---

## 🔗 Quick References

### Test File Structure
```
__tests__/
├── unit/
│   ├── services/
│   ├── utils/
│   └── models/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   └── user-flows/
└── fixtures/
    ├── users.json
    └── mock-data.js
```

### Assertion Cheat Sheet
```javascript
// Equality
expect(actual).toBe(expected);
expect(actual).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Numbers
expect(number).toBeGreaterThan(3);
expect(number).toBeLessThanOrEqual(5);

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// Exceptions
expect(fn).toThrow();
expect(fn).toThrow('specific error');

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

**Mode:** TEST MODE 🧪
**Focus:** Quality Assurance
**Goal:** Bulletproof Code