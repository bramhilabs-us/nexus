# Epic B: AIContextService Extension

<!-- @GENOME T3-SPR-022-EB | ACTIVE | 2026-04-29 | parent:T3-SPR-022-MP | auto:/coding | linked:/strategy -->

**Sprint**: 22 - Beta_Final
**Epic**: B - AIContextService Extension
**Points**: 10
**Priority**: P0 (Foundation)
**Dependencies**: Epic 0 (Pre-Work), Epic A (Data Models & Disciplines)

---

## Session #172 Refactor

**Key Change**: EXTEND existing `AIContextService` instead of creating new `ContextAssemblyService`.

### Original Plan (Rejected)
- Create new `ContextAssemblyService.js`
- Create new `WorkflowService.js`
- Create new `PresentationService.js`

### Refactored Plan (Approved)
- EXTEND `server/services/AIContextService.js` with provider pattern
- Add `registerProvider()` method
- Add `assembleContext(operation, params)` method
- Keep existing methods working (backwards compatible)

**Rationale**: AIContextService already has `buildContext()`, `getCompanyProfile()`, `getLatestSSIScores()`. Don't duplicate.

---

## Overview

Extend the existing AIContextService with modular data providers for intelligent context assembly. This enables AI-powered features while maintaining LEGO-piece modularity.

**Existing Service**: [AIContextService.js](../../../../server/services/AIContextService.js)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 EXTENDED AIContextService                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │         AIContextService (EXISTING - EXTENDED)            │   │
│  │                                                            │   │
│  │  EXISTING METHODS (verified in code, keep as-is):         │   │
│  │  • buildObjectiveContext(companyId, objectiveData)        │   │
│  │  • getCompanyProfile(companyId)                           │   │
│  │  • extractBusinessContext(company)                        │   │
│  │  • identifyRiskIndicators(company)                        │   │
│  │  • getIndustryLabel(industryKey)                          │   │
│  │  • getLatestSSIScores(companyId)                          │   │
│  │  • getFullSSIScores(companyId, options)                   │   │
│  │  • getCompanyProfileSSIFallback(companyId)                │   │
│  │  • _getDimensionScore(assessment, dimension)              │   │
│  │                                                            │   │
│  │  NEW METHODS (Sprint 22 additions):                       │   │
│  │  • registerProvider(name, provider)                       │   │
│  │  • assembleContext(operation, params) ← operation-based   │   │
│  │  • getDisciplines() ← from config                         │   │
│  │  • initializeProviders() ← boot wiring                    │   │
│  │  • invalidateProviderCache(pattern) ← exported, unused S22│   │
│  │                                                            │   │
│  └────────────────────────────────────┬──────────────────────┘   │
│                                       │                           │
│                                       ▼                           │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    DATA PROVIDERS                          │   │
│  ├───────────────────────────────────────────────────────────┤   │
│  │ Company  │ Assessment │ Discipline │ KeyResult │ WeeklyGoal│   │
│  │ Provider │  Provider  │  Provider  │ Provider  │  Provider │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Key Insight**: AIContextService already has `buildObjectiveContext()`, `getCompanyProfile()`, `getLatestSSIScores()`, `getFullSSIScores()`. We EXTEND with modular providers — no duplication. (Spec self-correction: previous draft falsely claimed `buildContext()` and `getActiveObjectives()` existed; they do not — D-B-1.)

**Singleton vs class** (D-B-2): During implementation, verify `module.exports` shape of AIContextService. If class, convert to singleton OR ensure `initializeProviders()` is called on the same instance every route uses.

---

## AIContextService Extension

**File**: `server/services/AIContextService.js` (MODIFY existing file)

### New Methods to Add

```javascript
// Add to existing AIContextService class

/**
 * Sprint 22: Provider registry for modular context assembly
 */
this.providers = new Map();
this.providerCache = new Map();
this.providerCacheTimeout = 5 * 60 * 1000; // 5 minutes

/**
 * Sprint 22: Register a context provider
 * @param {String} name - Provider name (e.g., 'discipline', 'keyResult')
 * @param {Object} provider - Provider with getData(params) method
 */
registerProvider(name, provider) {
  if (!provider.getData || typeof provider.getData !== 'function') {
    throw new Error(`Provider ${name} must have getData() method`);
  }
  this.providers.set(name, provider);
  logger.info(`[AIContextService] Registered provider: ${name}`);
}

/**
 * Sprint 22: Assemble context for a specific operation
 * Uses operation config to determine which providers to call
 *
 * @param {String} operation - Operation name (e.g., 'objective-creation', 'kr-generation')
 * @param {Object} params - Parameters to pass to providers
 * @returns {Object} Assembled context from all required providers
 */
async assembleContext(operation, params) {
  const operationConfigs = {
    'objective-creation': {
      providers: ['company', 'assessment', 'discipline'],
      cache_ttl: 300
    },
    'kr-generation': {
      providers: ['company', 'assessment', 'discipline', 'objective'],
      cache_ttl: 300
    },
    'weekly-goal-creation': {
      providers: ['company', 'keyResult', 'discipline'],
      cache_ttl: 180
    },
    'move-generation': {
      providers: ['company', 'weeklyGoal', 'discipline'],
      cache_ttl: 120
    }
  };

  const config = operationConfigs[operation];
  if (!config) {
    throw new Error(`Unknown operation: ${operation}`);
  }

  const context = {};
  const errors = [];

  for (const providerName of config.providers) {
    const provider = this.providers.get(providerName);
    if (!provider) {
      logger.warn(`[AIContextService] Provider ${providerName} not registered, skipping`);
      continue;
    }

    try {
      const cacheKey = `${providerName}:${JSON.stringify(params)}`;
      let data = this._getProviderCache(cacheKey);

      if (!data) {
        data = await provider.getData(params);
        this._setProviderCache(cacheKey, data, config.cache_ttl);
      }

      context[providerName] = data;
    } catch (error) {
      logger.error(`[AIContextService] Provider ${providerName} failed:`, error);
      errors.push({ provider: providerName, error: error.message });

      // Use fallback if available
      if (provider.getFallback) {
        context[providerName] = provider.getFallback();
      } else {
        context[providerName] = null;
      }
    }
  }

  // Add metadata
  context._meta = {
    operation,
    timestamp: new Date(),
    errors: errors.length > 0 ? errors : undefined
  };

  return context;
}

/**
 * Sprint 22: Get disciplines from config (D-B-3 unified API)
 * @returns {Array} Discipline definitions
 */
getDisciplines() {
  return require('../config/disciplines').getAll();
}

/**
 * Sprint 22: Initialize providers on startup
 */
async initializeProviders() {
  // Import providers
  const CompanyProvider = require('./providers/CompanyProvider');
  const AssessmentProvider = require('./providers/AssessmentProvider');
  const DisciplineProvider = require('./providers/DisciplineProvider');
  const ObjectiveProvider = require('./providers/ObjectiveProvider');
  const KeyResultProvider = require('./providers/KeyResultProvider');
  const WeeklyGoalProvider = require('./providers/WeeklyGoalProvider');

  // Register all providers
  this.registerProvider('company', new CompanyProvider());
  this.registerProvider('assessment', new AssessmentProvider());
  this.registerProvider('discipline', new DisciplineProvider());
  this.registerProvider('objective', new ObjectiveProvider());
  this.registerProvider('keyResult', new KeyResultProvider());
  this.registerProvider('weeklyGoal', new WeeklyGoalProvider());

  logger.info('[AIContextService] All providers initialized');
}

// Provider cache helpers
_getProviderCache(key) {
  const cached = this.providerCache.get(key);
  if (cached && Date.now() - cached.timestamp < (cached.ttl || this.providerCacheTimeout)) {
    return cached.data;
  }
  return null;
}

_setProviderCache(key, data, ttl) {
  this.providerCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttl * 1000 // Convert seconds to ms
  });
}

invalidateProviderCache(pattern) {
  for (const key of this.providerCache.keys()) {
    if (key.includes(pattern)) {
      this.providerCache.delete(key);
    }
  }
}
```

### Server Initialization Update

**File**: `server/index.js` (add to startup)

```javascript
const AIContextService = require('./services/AIContextService');

// In startup sequence after DB connection
await AIContextService.initializeProviders();
console.log('✓ AIContextService providers initialized');
```

---

## Data Providers

**Location**: `server/services/providers/` (new directory)

### CompanyProvider

**File**: `server/services/providers/CompanyProvider.js`

```javascript
const Company = require('../../models/Company');

class CompanyProvider {
  /**
   * Get AI-relevant company context
   */
  async getData({ company_id }) {
    const company = await Company.findById(company_id)
      .select('name industry size employee_count business_context')
      .lean();

    if (!company) return null;

    return {
      name: company.name,
      industry: company.industry,
      size: company.size,
      employee_count: company.employee_count,
      business_model: company.business_context?.profile?.business_model,
      value_proposition: company.business_context?.profile?.value_proposition,
      target_market: company.business_context?.profile?.client_profile,
      key_challenges: company.business_context?.challenges,
      strategic_vision: company.business_context?.strategic_vision
    };
  }

  getFallback() {
    return {
      name: 'Unknown Company',
      industry: 'general',
      size: 'unknown'
    };
  }
}

module.exports = CompanyProvider;
```

### DisciplineProvider

**File**: `server/services/providers/DisciplineProvider.js`

```javascript
const disciplines = require('../../config/disciplines');

class DisciplineProvider {
  /**
   * Get all disciplines from config (not DB)
   */
  async getData() {
    return disciplines.getAll();
  }

  /**
   * Get discipline by ID
   */
  async getById(disciplineId) {
    return disciplines.getById(disciplineId);
  }

  getFallback() {
    return [];
  }
}

module.exports = DisciplineProvider;
```

### AssessmentProvider

**File**: `server/services/providers/AssessmentProvider.js`

```javascript
const Assessment = require('../../models/Assessment');

class AssessmentProvider {
  // D-B-4: prefer ssi_result.* paths; fall back to ssi_scores.* for older docs
  async getData({ company_id, team_id }) {
    const query = { company_id, status: 'completed' };
    if (team_id) query.team_id = team_id;

    const assessment = await Assessment.findOne(query)
      .sort({ completed_at: -1 })
      .select('ssi_result ssi_scores')
      .lean();

    if (!assessment) return null;

    const fromResult = assessment.ssi_result;
    const fromScores = assessment.ssi_scores;

    return {
      overall: fromResult?.overall?.score ?? fromResult?.overall ?? null,
      dimensions: {
        speed:        fromResult?.dimensions?.speed?.score        ?? fromScores?.speed?.score        ?? null,
        strength:     fromResult?.dimensions?.strength?.score     ?? fromScores?.strength?.score     ?? null,
        intelligence: fromResult?.dimensions?.intelligence?.score ?? fromScores?.intelligence?.score ?? null
      },
      constraint: fromResult?.constraint || null,         // Epic D adds this field
      sub_dimensions: fromResult?.sub_dimensions || null  // Epic D adds this field
    };
  }

  getFallback() {
    return null;
  }
}

module.exports = AssessmentProvider;
```

### ObjectiveProvider

**File**: `server/services/providers/ObjectiveProvider.js`

```javascript
const Objective = require('../../models/Objective');

class ObjectiveProvider {
  async getData({ company_id, objective_id }) {
    if (objective_id) {
      return await Objective.findById(objective_id)
        .select('title category status ssi_impact discipline_ids')
        .lean();
    }

    // Get active objectives for company
    return await Objective.find({
      company_id,
      status: { $in: ['active', 'in_progress'] }
    })
      .select('title category status ssi_impact discipline_ids')
      .lean();
  }

  getFallback() {
    return [];
  }
}

module.exports = ObjectiveProvider;
```

### KeyResultProvider

**File**: `server/services/providers/KeyResultProvider.js`

```javascript
const KeyResult = require('../../models/KeyResult');

class KeyResultProvider {
  async getData({ company_id, objective_id, key_result_id }) {
    if (key_result_id) {
      return await KeyResult.findById(key_result_id)
        .select('title metric_type target_value current_value quarters status')
        .lean();
    }

    const query = { company_id };
    if (objective_id) query.objective_id = objective_id;

    return await KeyResult.find(query)
      .select('title metric_type target_value current_value quarters status objective_id')
      .lean();
  }

  getFallback() {
    return [];
  }
}

module.exports = KeyResultProvider;
```

### WeeklyGoalProvider

**File**: `server/services/providers/WeeklyGoalProvider.js`

```javascript
const WeeklyGoal = require('../../models/WeeklyGoal');

class WeeklyGoalProvider {
  async getData({ company_id, key_result_id, weekly_goal_id }) {
    if (weekly_goal_id) {
      return await WeeklyGoal.findById(weekly_goal_id)
        .select('title frequency target_week completions')
        .lean();
    }

    const query = { company_id };
    if (key_result_id) query.key_result_id = key_result_id;

    return await WeeklyGoal.find(query)
      .select('title frequency target_week completions key_result_id')
      .lean();
  }

  getFallback() {
    return [];
  }
}

module.exports = WeeklyGoalProvider;
```

---

## Configuration Files

### disciplines.js

**File**: `server/config/disciplines.js` — owned and defined by Epic A; this section in Epic B describes consumption only. The canonical config block is in Epic A. (D-A-5 / D-B-3)

```javascript
// Reference only — see Epic A for the canonical config
const DISCIPLINES = [
  {
    id: 'truth',
    name: 'Truth',
    description: 'Honesty and transparency in all dealings',
    icon: 'shield-check',
    order: 1,
    category: 'foundation'
  },
  {
    id: 'ownership',
    name: 'Ownership',
    description: 'Full responsibility for outcomes',
    icon: 'user-check',
    order: 2,
    category: 'foundation'
  },
  {
    id: 'follow_through',
    name: 'Follow-through',
    description: 'Completing commitments consistently',
    icon: 'check-circle',
    order: 3,
    category: 'execution'
  },
  {
    id: 'alignment',
    name: 'Alignment',
    description: 'Ensuring actions match intentions and values',
    icon: 'target',
    order: 4,
    category: 'execution'
  },
  {
    id: 'foresight',
    name: 'Foresight',
    description: 'Anticipating and preparing for future needs',
    icon: 'eye',
    order: 5,
    category: 'strategy'
  },
  {
    id: 'energy_stewardship',
    name: 'Energy Stewardship',
    description: 'Managing personal and team energy effectively',
    icon: 'battery-charging',
    order: 6,
    category: 'wellbeing'
  },
  {
    id: 'handoffs',
    name: 'Handoffs',
    description: 'Clean transitions of responsibility',
    icon: 'refresh-cw',
    order: 7,
    category: 'collaboration'
  },
  {
    id: 'formation',
    name: 'Formation',
    description: 'Building and shaping teams and processes',
    icon: 'users',
    order: 8,
    category: 'leadership'
  },
  {
    id: 'consistency',
    name: 'Consistency',
    description: 'Reliable, repeatable behaviors over time',
    icon: 'repeat',
    order: 9,
    category: 'execution'
  }
];

module.exports = {
  getAll: () => DISCIPLINES,
  getById: (id) => DISCIPLINES.find(d => d.id === id),
  getByCategory: (category) => DISCIPLINES.filter(d => d.category === category),
  getIds: () => DISCIPLINES.map(d => d.id),
  isValid: (id) => DISCIPLINES.some(d => d.id === id)
};
```

### Provider Index

**File**: `server/services/providers/index.js`

```javascript
/**
 * Sprint 22: Provider registry
 * Exports all providers for AIContextService initialization
 */

module.exports = {
  CompanyProvider: require('./CompanyProvider'),
  AssessmentProvider: require('./AssessmentProvider'),
  DisciplineProvider: require('./DisciplineProvider'),
  ObjectiveProvider: require('./ObjectiveProvider'),
  KeyResultProvider: require('./KeyResultProvider'),
  WeeklyGoalProvider: require('./WeeklyGoalProvider')
};
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `server/services/AIContextService.js` | MODIFY | Add registerProvider(), assembleContext(), initializeProviders() |
| `server/config/disciplines.js` | CREATE | Discipline definitions (from Epic A) |
| `server/services/providers/index.js` | CREATE | Provider exports |
| `server/services/providers/CompanyProvider.js` | CREATE | Company context data |
| `server/services/providers/AssessmentProvider.js` | CREATE | Assessment/SSI data |
| `server/services/providers/DisciplineProvider.js` | CREATE | Discipline config data |
| `server/services/providers/ObjectiveProvider.js` | CREATE | Objective context data |
| `server/services/providers/KeyResultProvider.js` | CREATE | Key result context data |
| `server/services/providers/WeeklyGoalProvider.js` | CREATE | Weekly goal context data |
| `server/index.js` | MODIFY | Add AIContextService.initializeProviders() call |

---

## Usage Example

```javascript
const AIContextService = require('./services/AIContextService');

// In objective creation route
router.post('/objectives/generate-krs', async (req, res) => {
  const { company_id, objective_title, discipline_ids } = req.body;

  // Assemble context using extended AIContextService
  const context = await AIContextService.assembleContext(
    'kr-generation',
    { company_id }
  );

  // Context now contains:
  // - company: { name, industry, business_model, ... }
  // - assessment: { overall, dimensions, constraint, ... }
  // - discipline: [{ id, name, description, ... }]
  // - objective: [{ title, category, ... }]

  // Pass to LLM service (Epic F - aiOKRService extension)
  const krs = await aiOKRService.generateKRs({
    title: objective_title,
    discipline_ids,
    context
  });

  res.json({ success: true, data: krs });
});

// In weekly goal generation route
router.post('/weekly-goals/generate', async (req, res) => {
  const { company_id, key_result_id, target_week } = req.body;

  const context = await AIContextService.assembleContext(
    'weekly-goal-creation',
    { company_id, key_result_id }
  );

  const goals = await aiOKRService.generateWeeklyGoals({
    key_result_id,
    target_week,
    context
  });

  res.json({ success: true, data: goals });
});
```

---

## Initialization

**Server startup** (`server/index.js`):

```javascript
const AIContextService = require('./services/AIContextService');

// In startup sequence, after database connection
async function initializeServices() {
  // ... other initializations

  // Initialize AIContextService providers
  await AIContextService.initializeProviders();
  console.log('✓ AIContextService providers initialized');
}

// Call during startup
mongoose.connection.once('open', async () => {
  await initializeServices();
  // ... rest of startup
});
```

---

## Backwards Compatibility (D-B-1 corrected)

All actually-existing methods remain unchanged:

```javascript
// EXISTING (continue to work)
await AIContextService.buildObjectiveContext(companyId, objectiveData);
await AIContextService.getCompanyProfile(companyId);
await AIContextService.getLatestSSIScores(companyId);
await AIContextService.getFullSSIScores(companyId, options);

// NEW (Sprint 22 — operation-based)
await AIContextService.assembleContext('kr-generation', { company_id: companyId });
```

**Key Difference**:
- `buildObjectiveContext()` — objective-specific context structure (existing)
- `assembleContext()` — operation-based, returns provider-specific data (new)

---

## Acceptance Criteria

- [ ] AIContextService extended with `registerProvider()`, `assembleContext()`, `initializeProviders()`, `getDisciplines()`, cache helpers
- [ ] All 6 providers implemented (Company, Assessment, Discipline, Objective, KeyResult, WeeklyGoal) using D-B-3 unified config API and D-B-4 score path priority
- [ ] disciplines.js config consumed by DisciplineProvider (config owned by Epic A — D-A-5)
- [ ] 5-minute provider caching functional; cache hit returns no-DB-call
- [ ] Graceful degradation on provider failure (`getFallback()` used; `_meta.errors` populated)
- [ ] Auto-registration on server startup; singleton instance verified (D-B-2)
- [ ] All 9 actually-existing AIContextService methods continue to work (D-B-1 — no fictional refs)
- [ ] Operation configs work for: objective-creation, kr-generation, weekly-goal-creation, move-generation
- [ ] `invalidateProviderCache(pattern)` exported but unused in S22 — documented as future-only (D-B-5)
- [ ] Tests per `prework/TEST_PLAN_STUBS.md` pass

---

## Story Points Breakdown

| Task | Points |
|------|--------|
| AIContextService extension (registerProvider, assembleContext) | 3 |
| 6 Data Providers | 3 |
| disciplines.js config | 1 |
| Provider caching | 1 |
| Integration & initialization | 1 |
| Testing | 1 |
| **Total** | **10** |

---

**Created**: April 21, 2026 (Session #171)
**Status**: Ready for implementation
