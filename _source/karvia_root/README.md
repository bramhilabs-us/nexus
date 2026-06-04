# 🏢 Karvia Business

<!-- @GENOME T0-NAV-001 | ACTIVE | 2026-03-31 | parent:ROOT | auto:- | linked:/init -->

## *Third-Party B2B OKR Management Platform*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/your-org/karvia-business)

> **📦 Production Branch**: This is the clean production-ready branch without internal planning documents. For full development context, see the `main` branch.

**Karvia Business** is a comprehensive B2B OKR (Objectives and Key Results) management platform designed specifically for small-medium service businesses (50-500 employees). This standalone, third-party deployable solution helps organizations create, cascade, track, and achieve their business objectives through intelligent goal management and team collaboration.

## 📍 Current Development Status

**Overall Completion**: 70% (as of November 2, 2025)
- **Backend**: 95% complete
- **Frontend**: 50% complete
- **Target Launch**: December 31, 2025

### 🚀 Quick Links
- **Development Tracking**: [MASTER_DEV_LIST.md](Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md)
- **Known Issues**: [MASTER_ISSUES_LIST.md](Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md)
- **Latest Audit**: [AUDIT_SUMMARY_2025_11_02.md](Karvia_OKR_Product_Planning/AUDIT_SUMMARY_2025_11_02.md)
- **For Claude AI**: [CLAUDE_ONBOARDING_GUIDE.md](Karvia_OKR_Product_Planning/CLAUDE_ONBOARDING_GUIDE.md)

## 🎯 Key Features

### **Business Assessment & Intelligence**
- **Speed/Strength/Intelligence Scoring**: Comprehensive business capability assessment
- **Industry-Specific Templates**: Pre-built OKR templates for various service industries
- **AI-Powered Insights**: OpenAI integration for intelligent business recommendations
- **Readiness Profiling**: Business maturity and goal-setting readiness evaluation

### **OKR Management**
- **Objective Cascade**: Seamless flow from yearly objectives to daily tasks
- **Multi-Level Hierarchy**: Business → Department → Team → Individual goals
- **Smart Goal Setting**: AI-assisted SMART goal creation and validation
- **Progress Tracking**: Real-time progress monitoring with visual dashboards

### **Team Collaboration**
- **Role-Based Access**: 5-tier permission system (Owner, Executive, Department Head, Team Lead, Employee)
- **Goal Sharing**: Collaborative goal setting and ownership assignment
- **Team Analytics**: Department and team performance insights
- **Communication Hub**: Integrated goal-focused communication tools

### **Third-Party Integration**
- **White-Label Ready**: Customizable branding and deployment
- **API-First Architecture**: Clean REST APIs for external integrations
- **Multi-Tenant Support**: Secure business data isolation
- **Enterprise Deployment**: Docker/Kubernetes ready infrastructure

## 🏗️ Architecture

Karvia Business uses a microservices architecture with six specialized engines:

```
karvia_business/
├── client/                 # React.js frontend application
├── server/                 # Main Express.js API server
├── engines/                # Microservice engines
│   ├── iam/               # Identity & Access Management
│   ├── assessment/        # Business Assessment Engine
│   ├── planner/           # OKR Planning & AI Integration
│   ├── scoring/           # Performance Scoring Engine
│   ├── observer/          # Behavioral Analytics Engine ✅ COMPLETE
│   └── tracking/          # Goal Progress Tracking Engine
├── docs/                  # Documentation & API specs
├── infrastructure/        # Docker & Kubernetes configs
└── templates/             # Industry OKR templates
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB >= 5.0
- Redis >= 6.0 (optional, for caching)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/karvia-business.git
   cd karvia-business
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- **Main App**: http://localhost:3000
- **API Server**: http://localhost:5000
- **Engine Services**: Ports 8081-8086

### **Docker Deployment**

```bash
# Build and start all services
npm run docker:up

# Stop all services
npm run docker:down
```

## 📋 Business Assessment

Karvia Business includes a comprehensive assessment system that evaluates businesses across three key dimensions:

### **Speed Score (0-100)**
- Market responsiveness and agility
- Decision-making velocity
- Implementation efficiency
- Customer service speed

### **Strength Score (0-100)**
- Financial stability and resources
- Team capabilities and expertise
- Operational excellence
- Competitive advantages

### **Intelligence Score (0-100)**
- Data-driven decision making
- Strategic planning maturity
- Technology adoption
- Innovation capabilities

## 🎯 OKR Cascade System

The platform implements a sophisticated OKR cascade system:

```
Business Objectives (4 yearly objectives)
    ↓
Department Goals (4 goals per objective)
    ↓
Team Goals (4 goals per department goal)
    ↓
Individual Tasks (Weekly/Daily breakdown)
```

## 👥 User Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **Business Owner** | Company leader | Full access, business settings, user management |
| **Executive** | C-level executives | Objective creation, department oversight, analytics |
| **Department Head** | Department leaders | Department goal management, team oversight |
| **Team Lead** | Team managers | Team goal assignment, progress tracking |
| **Employee** | Individual contributors | Task management, progress updates |

## 🔧 Configuration

### **Environment Variables**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/karvia_business
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# OpenAI Integration
OPENAI_API_KEY=[REDACTED]
OPENAI_MODEL=gpt-4

# Server Configuration
PORT=5000
NODE_ENV=production

# Third-Party Integrations
SLACK_WEBHOOK_URL=your-slack-webhook
TEAMS_WEBHOOK_URL=your-teams-webhook
```

## 📚 API Documentation

Comprehensive API documentation is available at `/docs/api/` after starting the server. Key endpoints include:

### **Business Management**
- `POST /api/businesses` - Create new business
- `GET /api/businesses/:id` - Get business details
- `PUT /api/businesses/:id` - Update business settings

### **OKR Management**
- `POST /api/objectives` - Create business objective
- `GET /api/objectives/:businessId` - Get all objectives
- `POST /api/goals` - Create goal (department/team)
- `GET /api/goals/:objectiveId` - Get objective goals

### **Assessment**
- `POST /api/assessments/business` - Conduct business assessment
- `GET /api/assessments/:businessId/results` - Get assessment results
- `POST /api/assessments/recommendations` - Get AI recommendations

## 👨‍💻 Development Workflow

### **Branch Strategy**

This repository uses a two-branch workflow optimized for clean production deployments:

#### **Main Branch** (Development)
- Full development environment with all context
- Includes code + planning documents + design mockups
- All feature development happens here
- Contains: `Karvia_OKR_Product_Planning/`, `Karvia_OKR_Mockups/`

#### **Production Branch** (Deployment)
- Clean, customer-facing code only
- No internal planning documents or mockups
- Connected to Render for auto-deployment
- Always deployment-ready

```
main branch (development)
├── All application code ✅
├── Karvia_OKR_Product_Planning/ ✅ (planning docs)
└── Karvia_OKR_Mockups/ ✅ (design mockups)

production branch (deployment)
├── All application code ✅
├── Karvia_OKR_Product_Planning/ ❌ (excluded)
└── Karvia_OKR_Mockups/ ❌ (excluded)
```

### **Daily Development Workflow**

```bash
# 1. Work on main branch (or feature branch)
git checkout main
# or: git checkout -b week-2-production-hardening

# 2. Make changes, reference planning docs
vim Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md  # Check tasks
# Write code, update docs, test locally

# 3. Commit changes (code + documentation together)
git add .
git commit -m "DEV-W2-001: Add production logger

- Implemented Winston logger with rotation
- Added request ID tracking
- Updated MASTER_DEV_LIST.md

✅ Acceptance criteria met"

# 4. Push to main
git push origin main
```

### **Deploying to Production**

When ready to deploy (end of day/week, or when features are complete):

```bash
# Automatic sync: code-only to production branch
./scripts/sync-production.sh

# This script automatically:
# 1. Merges main → production
# 2. Removes planning/mockup folders
# 3. Pushes to GitHub production branch
# 4. Triggers Render auto-deployment
```

**That's it!** Render watches the `production` branch and auto-deploys.

### **What the Sync Script Does**

```
┌─────────────────────────┐
│ Local: main branch      │
│ • All code              │
│ • All planning docs     │
│ • git push origin main  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Run sync script         │
│ ./scripts/sync-production.sh
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ GitHub: production      │
│ • Code only             │
│ • No planning docs      │
│ • Auto-synced           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Render                  │
│ • Auto-deploy           │
│ • Live in ~5 minutes    │
└─────────────────────────┘
```

### **Feature Branch Workflow (Optional)**

For larger features or multiple developers:

```bash
# Create feature branch
git checkout -b feature/analytics-dashboard

# Work on feature
# ... make changes ...

# Merge to main when complete
git checkout main
git merge feature/analytics-dashboard
git push origin main

# Deploy to production
./scripts/sync-production.sh
```

### **Sync Script Options**

```bash
# Sync from main (default)
./scripts/sync-production.sh

# Sync from specific branch
./scripts/sync-production.sh week-2-production-hardening

# The script provides:
# ✅ Safety checks (uncommitted changes)
# ✅ Conflict detection
# ✅ Automatic planning doc removal
# ✅ Colored output with status
# ✅ Detailed change statistics
```

### **Important Notes**

1. **Never commit secrets** - Use environment variables on Render
2. **Planning docs stay on main** - Only code goes to production
3. **Automatic deployment** - Production branch triggers Render
4. **Full context while developing** - All docs available on main
5. **Clean production** - Customers never see internal planning

### **Repository Structure**

```
karvia_business/
├── client/                    # Frontend code
├── server/                    # Backend API
├── engines/                   # Microservices
├── scripts/
│   └── sync-production.sh    # Auto-sync script ⭐
├── tests/                     # Test suites
├── Karvia_OKR_Product_Planning/  # Planning docs (main only)
└── Karvia_OKR_Mockups/          # Design files (main only)
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test -- --coverage
```

## 📦 Deployment

### **Pre-Deployment Checks**

Before deploying to production, run the pre-deployment script to catch common issues:

```bash
./scripts/pre-deploy.sh
```

This script performs the following checks:
- ✓ Uncommitted changes detection
- ✓ Test suite execution
- ✓ Test coverage analysis
- ✓ Exposed secrets scanning
- ✓ Required files verification

**Exit Codes:**
- `0`: All checks passed (ready to deploy)
- `1`: Critical errors found (do not deploy)

### **Production Deployment**

1. **Run pre-deployment checks**
   ```bash
   ./scripts/pre-deploy.sh
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Deploy with Docker**
   ```bash
   npm run docker:build
   npm run docker:up
   ```

4. **Configure reverse proxy** (nginx recommended)

### **White-Label Deployment**

Karvia Business supports white-label deployment for third-party organizations:

1. **Customize branding** in `/client/src/config/branding.js`
2. **Configure client settings** in `/config/client-config.json`
3. **Deploy with custom domain** and SSL certificates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: `/docs/`
- **API Reference**: `/docs/api/`
- **Issues**: [GitHub Issues](https://github.com/your-org/karvia-business/issues)
- **Email**: support@karvia-business.com

## 🙏 Acknowledgments

- Built with ❤️ for small-medium service businesses
- OpenAI for intelligent business insights
- MongoDB for flexible data storage
- React.js for modern user interface

---

**Karvia Business** - *Empowering businesses to set, track, and achieve ambitious objectives through intelligent OKR management.*