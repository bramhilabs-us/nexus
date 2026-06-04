# Backend Architecture

**Document**: Complete backend architecture documentation
**Last Updated**: October 21, 2025
**Owner**: Technical Lead

---

## 🏗️ Architecture Overview

### **Architecture Pattern**
KARVIA Pro uses a **3-tier layered architecture**:

```
┌──────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Client)                             │
│  • Vanilla JS + Bootstrap                                │
│  • Dynamic pages (dashboard, objectives, analytics)      │
│  • API client wrappers                                   │
└──────────────────────────────────────────────────────────┘
                      ↓ HTTPS (REST API)
┌──────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Node.js + Express)                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Routes (13 modules)                               │  │
│  │  • /api/auth, /api/objectives, /api/analytics...  │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Middleware                                        │  │
│  │  • auth, RBAC, validation, error handling         │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Services (15 modules)                             │  │
│  │  • aiOKRService, analyticsService, exportService  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                      ↓ SQL (ORM)
┌──────────────────────────────────────────────────────────┐
│  DATA LAYER (PostgreSQL + Redis)                         │
│  • PostgreSQL: Relational data (users, businesses, OKRs) │
│  • Sequelize ORM: Models, migrations, associations       │
│  • Redis: Session cache, rate limiting (Beta)            │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
server/
├── index.js                    # Main server entry point
├── config/
│   └── index.js                # Centralized config management
├── database/
│   └── index.js                # Database connection + health check
├── models/                     # Sequelize models (10 models)
│   ├── Business.js
│   ├── User.js
│   ├── Assessment.js
│   ├── AssessmentTemplate.js
│   ├── AssessmentQuestion.js
│   ├── Objective.js
│   ├── AIOKRSuggestion.js
│   ├── Invitation.js
│   ├── Goal.js (legacy)
│   └── Task.js (legacy)
├── routes/                     # API route handlers (13 modules)
│   ├── auth.js
│   ├── businesses.js
│   ├── assessments.js
│   ├── objectives.js
│   ├── ai-okr.js
│   ├── analytics.js
│   ├── invitations.js
│   └── ... (10 more)
├── services/                   # Business logic (15 services)
│   ├── aiOKRService.js
│   ├── iBrainService.js
│   ├── analyticsService.js
│   ├── calculatorService.js
│   ├── objectiveService.js
│   ├── exportService.js
│   └── ... (9 more)
├── middleware/                 # Express middleware
│   ├── auth.js                 # JWT authentication
│   ├── roleGuards.js           # RBAC authorization
│   ├── validate.js             # Joi schema validation
│   ├── errorHandler.js         # Centralized error handling
│   └── logging.js              # Winston logging
├── validators/                 # Joi validation schemas
│   ├── user.validator.js
│   ├── business.validator.js
│   └── ... (4 more)
├── utils/
│   ├── errors/                 # Custom error classes
│   │   ├── AppError.js
│   │   └── asyncHandler.js
│   ├── businessDefaults.js
│   ├── passwordValidator.js
│   └── emailValidator.js
├── seeds/                      # Database seeders
│   └── seedAssessmentQuestions.js
├── scripts/                    # Dev/test scripts
│   └── testAnalyticsService.js
└── test/                       # Jest tests
    ├── unit/
    └── integration/
```

---

## 🚀 Application Startup Flow

### **server/index.js** (Main Entry Point)

```javascript
// 1. Load environment variables
dotenv.config();

// 2. Initialize feature flags
const featureFlags = require('./services/feature-flags');
featureFlags.initialize();

// 3. Load configuration
const config = require('./config');

// 4. Setup global error handlers
setupGlobalErrorHandlers();

// 5. Create Express app
const app = express();

// 6. Security middleware
app.use(helmet({ /* CSP config */ }));
app.use(cors(config.get('security.cors')));

// 7. Body parsing + compression
app.use(express.json({ limit: '10mb' }));
app.use(compression());

// 8. HTTP request logging (Winston)
app.use(httpLogger);

// 9. Health check endpoint
app.get('/health', async (req, res) => { /* DB + service status */ });

// 10. Mount API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/objectives', require('./routes/objectives'));
// ... (11 more routes)

// 11. Serve static frontend (production)
app.use(express.static(path.join(__dirname, '../client')));
app.get('*', (req, res) => res.sendFile('index.html'));

// 12. Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// 13. Database connection
await database.connect();

// 14. Start server
const PORT = config.get('server.port');
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
```

**Key Principles**:
- **Configuration-driven**: All settings in `config/index.js` (no hardcoded values)
- **Fail-fast**: Global error handlers catch unhandled rejections
- **Security-first**: Helmet CSP, CORS, rate limiting (Beta)
- **Stateless**: No session state in server (JWT-based auth)

---

## 🔌 Request Flow

### **Example: Create Objective API Call**

```
Client Request (POST /api/objectives)
           ↓
1. Middleware Stack:
   • httpLogger (log request)
   • authenticate() [middleware/auth.js]
      - Verify JWT token
      - Decode { userId, businessId, role }
      - Attach req.user
   • checkRole(['admin', 'manager']) [middleware/roleGuards.js]
      - Verify user role
   • validate(objectiveSchema) [middleware/validate.js]
      - Joi schema validation
           ↓
2. Route Handler [routes/objectives.js]:
   • POST /api/objectives → createObjective()
   • Extract request body (title, level, parent_id, key_results)
   • Call objectiveService.createObjective()
           ↓
3. Service Layer [services/objectiveService.js]:
   • Validate parent_id (if cascade)
   • Create Objective model instance
   • Calculate initial progress (0%)
   • Save to database (Sequelize)
   • Return created objective
           ↓
4. Database [models/Objective.js]:
   • Sequelize ORM executes SQL INSERT
   • Business_id scoped (multi-tenant security)
   • Returns objective with generated ID
           ↓
5. Response:
   • Service returns objective JSON
   • Route handler sends 201 Created
   • Middleware logs response
           ↓
Client receives JSON response
```

**Error Handling Path**:
```
Error thrown at any layer
           ↓
asyncHandler() catches error
           ↓
errorHandler middleware [middleware/errorHandler.js]
           ↓
Log error (Winston)
           ↓
Send JSON error response:
{
  "error": "Validation failed",
  "status": 400,
  "message": "Title is required"
}
```

---

## 🗄️ Data Access Layer

### **Sequelize ORM Configuration**

**database/index.js**:
```javascript
const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.get('database.name'),
  config.get('database.username'),
  config.get('database.password'),
  {
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: 'postgres',
    logging: config.isEnabled('database.logging') ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

async function connect() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: false }); // Don't auto-alter in production
  logger.info('Database connected');
}

async function healthCheck() {
  try {
    await sequelize.authenticate();
    return { status: 'healthy', overall: true };
  } catch (error) {
    return { status: 'unhealthy', overall: false, error: error.message };
  }
}

module.exports = { sequelize, connect, healthCheck };
```

### **Model Definition Pattern**

**models/Objective.js** (Example):
```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Objective = sequelize.define('Objective', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  business_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Businesses', key: 'id' }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 200] }
  },
  level: {
    type: DataTypes.ENUM('company', 'department', 'team', 'individual'),
    allowNull: false
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Objectives', key: 'id' }
  },
  key_results: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  progress: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('on-track', 'at-risk', 'behind', 'ahead'),
    defaultValue: 'on-track'
  }
}, {
  tableName: 'objectives',
  timestamps: true,
  defaultScope: {
    // Multi-tenant security: Auto-scope queries by business_id
    // This is applied in route handlers via req.user.business_id
  }
});

// Associations
Objective.belongsTo(Objective, { as: 'parent', foreignKey: 'parent_id' });
Objective.hasMany(Objective, { as: 'children', foreignKey: 'parent_id' });

module.exports = Objective;
```

---

## ⚙️ Service Layer Architecture

### **Service Responsibilities**

Services handle **business logic** and **orchestration**:
- Input validation (beyond schema validation)
- Business rules enforcement
- External API calls (iBrain, Mailjet)
- Complex calculations (SSI scoring, progress rollup)
- Transaction management (multi-step operations)

### **Example: aiOKRService.js**

```javascript
const { iBrainService } = require('./iBrainService');
const { Assessment } = require('../models/Assessment');
const { AIOKRSuggestion } = require('../models/AIOKRSuggestion');
const { logger } = require('./logger');

async function generateObjectives({ assessmentId, businessId }) {
  // 1. Validate assessment exists
  const assessment = await Assessment.findOne({
    where: { id: assessmentId, business_id: businessId }
  });
  if (!assessment) {
    throw new AppError('Assessment not found', 404);
  }

  // 2. Check iBrain toggle
  const business = await Business.findByPk(businessId);
  if (!business.ibrain_enabled) {
    throw new AppError('iBrain not enabled for this business', 403);
  }

  // 3. Call iBrain API
  try {
    const aiResponse = await iBrainService.generateObjectives({
      assessmentData: assessment.scores,
      weakAreas: assessment.insights.weak_areas,
      apiKey: business.ibrain_api_key
    });

    // 4. Save AI suggestions to database (pre-approval)
    const suggestions = await Promise.all(
      aiResponse.objectives.map(obj =>
        AIOKRSuggestion.create({
          assessment_id: assessmentId,
          business_id: businessId,
          objective_text: obj.title,
          key_results: obj.key_results,
          rationale: obj.rationale,
          status: 'pending' // User must review + approve
        })
      )
    );

    logger.info('AI objectives generated', {
      assessmentId,
      businessId,
      count: suggestions.length
    });

    return suggestions;

  } catch (error) {
    logger.error('iBrain API error', { error: error.message });
    throw new AppError('AI service unavailable. Please create objectives manually.', 503);
  }
}

module.exports = { generateObjectives };
```

**Design Patterns**:
- **Service Facade**: Hide iBrain API complexity from routes
- **Error Translation**: Convert iBrain errors to user-friendly messages
- **Graceful Degradation**: If iBrain fails, suggest manual mode
- **Audit Logging**: Log all AI operations for debugging

---

## 🔐 Authentication & Authorization

### **JWT Authentication Flow**

**routes/auth.js** (Login):
```javascript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 2. Verify password (bcrypt)
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 3. Generate JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      businessId: user.business_id,
      role: user.role,
      email: user.email
    },
    config.get('security.jwtSecret'),
    { expiresIn: '15m' } // 15-minute expiry
  );

  // 4. Return token + user data
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      businessId: user.business_id
    }
  });
});
```

**middleware/auth.js** (JWT Verification):
```javascript
function authenticate(req, res, next) {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  // 2. Verify JWT
  try {
    const decoded = jwt.verify(token, config.get('security.jwtSecret'));

    // 3. Attach user data to request
    req.user = {
      userId: decoded.userId,
      businessId: decoded.businessId,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

**middleware/roleGuards.js** (RBAC):
```javascript
function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Usage in routes:
router.post('/objectives',
  authenticate,
  checkRole(['admin', 'manager']), // Only admins and managers
  createObjective
);
```

---

## 🛡️ Multi-Tenant Security

### **Business-Level Data Isolation**

All queries are scoped by `business_id`:

```javascript
// ❌ WRONG (exposes all businesses' data)
const objectives = await Objective.findAll();

// ✅ CORRECT (scoped by business_id)
const objectives = await Objective.findAll({
  where: { business_id: req.user.businessId }
});
```

**Sequelize Scopes** (Automatic Scoping):
```javascript
// Define default scope in model
Objective.addScope('defaultScope', {
  where: {
    // This would require passing business_id context
    // For now, we scope in route handlers
  }
}, { override: true });
```

**Route Handler Pattern**:
```javascript
router.get('/objectives', authenticate, async (req, res) => {
  // req.user.businessId comes from JWT
  const objectives = await Objective.findAll({
    where: { business_id: req.user.businessId }
  });
  res.json({ objectives });
});
```

---

## 📊 Logging & Monitoring

### **Winston Logger Configuration**

**services/logger.js**:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'karvia-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = { logger };
```

**Usage in Services**:
```javascript
const { logger } = require('./logger');

logger.info('User logged in', { userId: user.id, businessId: user.business_id });
logger.error('iBrain API error', { error: error.message, stack: error.stack });
logger.warn('High DB query time', { query: 'SELECT * FROM objectives', duration: 850 });
```

---

## 🔧 Configuration Management

### **config/index.js** (Centralized Config)

```javascript
const dotenv = require('dotenv');
dotenv.config();

const config = {
  server: {
    port: process.env.PORT || 8081,
    env: process.env.NODE_ENV || 'development',
    bodyLimit: '10mb',
    compression: true,
    trustProxy: process.env.NODE_ENV === 'production'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'karvia_business',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    logging: process.env.DB_LOGGING === 'true'
  },
  security: {
    jwtSecret: process.env.JWT_SECRET,
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    }
  },
  ibrain: {
    apiUrl: process.env.IBRAIN_API_URL || 'https://ibrain.bramhilabs.com/api/v1',
    timeout: 30000
  }
};

function get(key) {
  const keys = key.split('.');
  return keys.reduce((obj, k) => obj?.[k], config);
}

function isEnabled(key) {
  return get(key) === true || get(key) === 'true';
}

module.exports = { get, isEnabled };
```

---

## 📚 References

- **Express.js Documentation**: https://expressjs.com
- **Sequelize ORM**: https://sequelize.org
- **Winston Logging**: https://github.com/winstonjs/winston
- **JWT Best Practices**: https://tools.ietf.org/html/rfc7519

---

**END OF DOCUMENT**
