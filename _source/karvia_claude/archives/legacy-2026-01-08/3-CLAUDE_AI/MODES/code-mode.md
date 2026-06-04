# 🧑‍💻 CODE MODE

> **Optimized context and workflow for feature implementation**

## 🎯 Mode Purpose

CODE MODE is activated when you need to:
- Implement new features
- Write production code
- Create APIs
- Build components
- Integrate services

---

## 📦 Context Package

### 🔵 Framework Context (Always Loaded)
```yaml
Standards:
  - /2-DEVELOPMENT/STANDARDS/CODE_STANDARDS.md
  - /2-DEVELOPMENT/STANDARDS/API_DESIGN.md
  - /2-DEVELOPMENT/STANDARDS/DATABASE_SCHEMA.md

Best Practices:
  - Error handling patterns
  - Security guidelines
  - Performance optimization
  - Code organization

Tools:
  - Linter configuration
  - Formatter settings
  - Git workflow
```

### 🟠 Karvia-Specific Context
```yaml
Architecture:
  - /4-KNOWLEDGE_BASE/ARCHITECTURE/SYSTEM_DESIGN.md
  - /4-KNOWLEDGE_BASE/ARCHITECTURE/MICROSERVICES.md
  - Service communication patterns
  - Database schemas

Business Logic:
  - /4-KNOWLEDGE_BASE/BUSINESS_LOGIC/OKR_FRAMEWORK.md
  - /4-KNOWLEDGE_BASE/BUSINESS_LOGIC/SSI_METHODOLOGY.md
  - User journey flows
  - Business rules

Current Feature:
  - Feature specification
  - Related code files
  - Existing tests
  - API contracts
  - Database migrations
```

---

## 🔄 Workflow Process

### Step 1: Feature Understanding
```markdown
1. Load feature specification
2. Review acceptance criteria
3. Check existing implementations
4. Identify dependencies
5. Plan implementation approach
```

### Step 2: Implementation
```markdown
1. Create/modify files following structure
2. Write code following standards
3. Handle errors appropriately
4. Add logging and monitoring
5. Ensure security best practices
```

### Step 3: Testing
```markdown
1. Write unit tests first (TDD)
2. Add integration tests
3. Verify edge cases
4. Check error scenarios
5. Validate performance
```

### Step 4: Documentation
```markdown
1. Add code comments
2. Update API documentation
3. Document configuration
4. Update README if needed
5. Add to changelog
```

### Step 5: Review & Commit
```markdown
1. Self-review checklist
2. Run linter
3. Format code
4. Commit with message
5. Push to feature branch
```

---

## ✅ CODE MODE Checklist

### Before Starting
- [ ] Feature specification understood
- [ ] Acceptance criteria clear
- [ ] Dependencies identified
- [ ] Test approach planned
- [ ] Branch created from latest main

### During Implementation
- [ ] Following CODE_STANDARDS.md
- [ ] Writing tests alongside code
- [ ] Handling errors properly
- [ ] No hardcoded values
- [ ] No console.logs

### Before Committing
- [ ] All tests passing
- [ ] Code reviewed (self)
- [ ] Documentation updated
- [ ] Linter passing
- [ ] Security checked

### After Implementation
- [ ] PR created
- [ ] CI/CD passing
- [ ] Ready for review
- [ ] Changelog updated
- [ ] Feature documented

---

## 🎮 Available Commands

### Implementation Commands
```bash
"implement [feature]"    # Start feature coding
"create component"       # New component
"add endpoint"          # New API endpoint
"add model"             # Database model
"add service"           # Service layer
"add controller"        # Controller layer
```

### Code Quality Commands
```bash
"lint"                  # Run linter
"format"                # Auto-format code
"analyze"               # Static analysis
"complexity"            # Check complexity
"secure scan"           # Security check
"optimize"              # Performance check
```

### Git Commands
```bash
"status"                # Git status
"diff"                  # Show changes
"commit"                # Commit changes
"push"                  # Push to remote
"pr"                    # Create PR
```

### Navigation Commands
```bash
"show [file]"           # Display file
"find [pattern]"        # Search code
"structure"             # Show architecture
"dependencies"          # Show deps
```

---

## 📊 Code Quality Metrics

### Target Metrics
```yaml
Code Coverage: > 80%
Cyclomatic Complexity: < 10
Duplication: < 3%
Technical Debt: < 5 days
Security Issues: 0
Linting Errors: 0
```

### Performance Targets
```yaml
API Response: < 200ms
Database Queries: < 100ms
Page Load: < 2s
Bundle Size: < 500KB
Memory Usage: < 512MB
```

---

## 🔗 Quick References

### File Structure
```
feature-name/
├── index.js            # Entry point
├── controller.js       # Request handling
├── service.js          # Business logic
├── model.js           # Data model
├── validator.js       # Input validation
├── routes.js          # API routes
└── tests/
    ├── unit.test.js
    └── integration.test.js
```

### Naming Conventions
```javascript
// Files: kebab-case
user-service.js
api-controller.js

// Functions: camelCase
function getUserById() {}
function calculateTotal() {}

// Classes: PascalCase
class UserService {}
class AuthController {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = '';

// Booleans: is/has/should prefix
const isActive = true;
const hasPermission = false;
```

### Error Handling Pattern
```javascript
// Consistent error handling
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context });

  if (error instanceof ValidationError) {
    return { success: false, error: error.message, code: 400 };
  }

  if (error instanceof NotFoundError) {
    return { success: false, error: 'Not found', code: 404 };
  }

  // Generic error
  return { success: false, error: 'Internal error', code: 500 };
}
```

---

## 🚫 Anti-Patterns to Avoid

### Never Do This in CODE MODE
```javascript
// ❌ Hardcoded credentials
const apiKey = "sk_live_[REDACTED]";

// ❌ Unhandled promises
someAsyncFunction(); // No await or .catch()

// ❌ Magic numbers
if (score > 75) { } // What is 75?

// ❌ Nested callbacks
getData((data) => {
  process(data, (result) => {
    save(result, (saved) => {
      // Callback hell
    });
  });
});

// ❌ Modifying parameters
function process(data) {
  data.modified = true; // Don't mutate
  return data;
}
```

---

## 🎯 Success Criteria

CODE MODE is successful when:
1. ✅ Feature implemented to spec
2. ✅ All tests passing
3. ✅ Code follows standards
4. ✅ Documentation complete
5. ✅ Performance targets met
6. ✅ Security validated
7. ✅ Ready for review

---

## 🔄 Transition Points

### When to Switch Modes
```yaml
To TEST MODE:
  - After implementation complete
  - When coverage < 80%
  - Before PR creation

To DEBUG MODE:
  - When tests fail
  - On unexpected behavior
  - Performance issues

To REVIEW MODE:
  - PR ready
  - Code complete
  - Tests passing

To DEPLOY MODE:
  - Feature approved
  - Sprint ending
  - Release ready
```

---

## 📈 Performance Tracking

### Metrics Collected in CODE MODE
```yaml
Lines of Code: Track productivity
Time to Complete: Feature velocity
Bugs Introduced: Quality measure
Review Feedback: Learning points
Rework Required: First-time quality
Test Coverage: Quality assurance
```

---

## 💡 Pro Tips for CODE MODE

1. **Write tests first** - TDD leads to better design
2. **Commit frequently** - Small, atomic commits
3. **Refactor continuously** - Clean as you go
4. **Document why, not what** - Code shows what, comments show why
5. **Think security first** - Easier than fixing later
6. **Optimize last** - Premature optimization is evil
7. **Review your own code** - Before others do

---

**Mode:** CODE MODE 🧑‍💻
**Focus:** Implementation Excellence
**Goal:** Production-Ready Code