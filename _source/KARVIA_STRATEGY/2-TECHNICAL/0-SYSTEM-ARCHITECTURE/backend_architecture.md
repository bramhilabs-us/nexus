# Backend Architecture

<!-- @GENOME T2-ARC-008 | ACTIVE | 2026-04-05 | parent:T1-KRV-001 | auto:/coding | linked:/strategy -->

> **Part of KARVIA Engine** - See [KARVIA_ENGINE_VISION.md](../../1-VISION/KARVIA_ENGINE_VISION.md) for engine overview.

**Document**: Complete backend architecture documentation
**Last Updated**: October 24, 2025
**Owner**: Technical Lead
**Status**: ⚠️ MIGRATED TO MONGODB - This document reflects the legacy PostgreSQL architecture. See [database_schema.md](../3-DATA/database_schema.md) for current MongoDB implementation.

---

## ⚠️ IMPORTANT NOTICE

**This document describes the legacy PostgreSQL + Sequelize architecture.**

**Current Production Stack**: MongoDB 7.x + Mongoose ORM

For the current database architecture, please refer to:
- [Database Schema (MongoDB)](../3-DATA/database_schema.md) - Complete MongoDB schema documentation
- [MVP Technical Architecture V5](./MVP_TECHNICAL_ARCHITECTURE_V5.md) - Full system architecture with MongoDB

This document is retained for historical reference only.

---

## 🏗️ Architecture Overview (LEGACY)

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
                      ↓ MongoDB (NOT SQL!)
┌──────────────────────────────────────────────────────────┐
│  DATA LAYER (MongoDB + Redis)                            │
│  • MongoDB 7.x: Document database (users, businesses,    │
│    objectives, assessments, teams)                       │
│  • Mongoose 7.5.0: ODM (Object Document Mapping)         │
│  • Redis: Session cache, rate limiting                   │
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
├── seeds/                      # Industry-template seeders (asmt/template seeders moved to scripts/db/ in S24 #198)
│   └── seedFinancialServicesTemplate.js
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

## 🗄️ Data Access Layer (LEGACY - MIGRATED TO MONGODB)

### **⚠️ DEPRECATED: Sequelize ORM Configuration**

**This section describes the legacy PostgreSQL setup. Current implementation uses MongoDB + Mongoose.**

See [database_schema.md](../3-DATA/database_schema.md) for current MongoDB configuration.

**Legacy database/index.js** (PostgreSQL):
```javascript
// DEPRECATED - Now using MongoDB
const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.get('database.name'),
  config.get('database.username'),
  config.get('database.password'),
  {
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: 'postgres', // DEPRECATED
    logging: config.isEnabled('database.logging') ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
```

### **Current MongoDB Configuration**

**database/index.js** (MongoDB):
```javascript
const mongoose = require('mongoose');
const config = require('../config');

async function connect() {
  await mongoose.connect(config.get('database.mongoUri'), {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    autoIndex: false,  // Indexes created manually
    autoCreate: false  // Collections created via migrations
  });
  console.log('MongoDB connected');
}

async function healthCheck() {
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', overall: true };
  } catch (error) {
    return { status: 'unhealthy', overall: false, error: error.message };
  }
}

module.exports = { connect, healthCheck };
```

### **⚠️ DEPRECATED: Model Definition Pattern (Sequelize)**

**Legacy models/Objective.js** (Sequelize):
```javascript
// DEPRECATED - Now using Mongoose schemas
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Objective = sequelize.define('Objective', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // ... fields ...
});
```

### **Current Mongoose Schema Pattern**

**models/Objective.js** (Mongoose):
```javascript
const mongoose = require('mongoose');

const ObjectiveSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  level: {
    type: String,
    enum: ['company', 'department', 'team', 'individual']
  },
  parent_objective_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Objective'
  },
  key_results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KeyResult'
  }],
  progress_percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'paused', 'cancelled', 'at_risk'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Objective', ObjectiveSchema);
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
