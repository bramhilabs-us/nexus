# Orchestrator Architecture

<!-- @GENOME T2-ARC-020 | ACTIVE | 2026-04-20 | parent:T2-ARC-001 | auto:/coding,/strategy | linked:/design -->

**Version**: 1.0
**Created**: April 20, 2026 (Session #165)
**Purpose**: Define the intelligent orchestration layer for LEGO piece integration
**Status**: ACTIVE - Sprint 22 Foundation
**Audience**: Engineering, Architecture, Product

---

## Executive Summary

The **Orchestrator** is the intelligent middleware layer that connects independent LEGO pieces (modules) and enables the "play" between User and LLM. It provides:

1. **Context Assembly** - Knows what data to collect from which modules
2. **Workflow Management** - Knows what should happen next
3. **Presentation Formatting** - Knows how to display data to users

**Key Principles**:
- Configuration-driven (no hardcoding)
- Plugin architecture (scalable modules)
- Event-driven (loose coupling)
- Zero impact on existing code

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [The Three Services](#the-three-services)
3. [LEGO Pieces (Data Providers)](#lego-pieces-data-providers)
4. [Configuration Files](#configuration-files)
5. [The Play: User ↔ LLM](#the-play-user--llm)
6. [Implementation Guide](#implementation-guide)
7. [File Structure](#file-structure)

---

## Architecture Overview

### Mental Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                              ┌───────────┐                                  │
│                              │   USER    │                                  │
│                              └─────┬─────┘                                  │
│                                    │                                         │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                          UI LAYER (7 Pages)                           │   │
│  │  Dashboard │ Objectives │ Assessments │ Teams │ Planning │ Profiles  │   │
│  └──────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    INTELLIGENT LAYER (Orchestrator)                   │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │   │
│  │  │    Context     │  │    Workflow    │  │  Presentation  │         │   │
│  │  │   Assembly     │  │    Service     │  │    Service     │         │   │
│  │  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘         │   │
│  │          │                   │                   │                   │   │
│  │          └───────────────────┼───────────────────┘                   │   │
│  │                              │                                        │   │
│  │                              ▼                                        │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │                    LLM ORCHESTRATOR                             │  │   │
│  │  │   Assembles context → Calls LLM → Returns structured response  │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────┬───────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    DATA LAYER (7 LEGO Pieces)                         │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐          │   │
│  │  │COMPANY │ │ PERSON │ │  TEAM  │ │ASSESSMENT│ │OBJECTIVE│          │   │
│  │  └────────┘ └────────┘ └────────┘ └──────────┘ └─────────┘          │   │
│  │  ┌─────────┐ ┌─────────┐                                             │   │
│  │  │PLANNING │ │BEHAVIOR │                                             │   │
│  │  └─────────┘ └─────────┘                                             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│                              ┌─────────────┐                                │
│                              │  DATABASE   │                                │
│                              │  (MongoDB)  │                                │
│                              └─────────────┘                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Configuration-Driven** | No hardcoding rules in code | All rules in JSON config files |
| **Plugin Architecture** | Modules register themselves | DataProvider interface + auto-registration |
| **Event-Driven** | Loose coupling between pieces | WorkflowService listens to events |
| **Graceful Degradation** | Works with missing pieces | Fallbacks defined in config |
| **Zero Impact** | Existing code unchanged | New services alongside existing |

---

## The Three Services

### 1. Context Assembly Service

**Purpose**: Knows what data to collect from which LEGO pieces for each action.

```javascript
// server/services/orchestrator/ContextAssemblyService.js

const contextRules = require('./config/context-rules.json');

class ContextAssemblyService {
  constructor() {
    this.providers = new Map();
  }

  /**
   * Register a LEGO piece as data provider
   * Called automatically by each module on startup
   */
  registerProvider(name, provider) {
    this.providers.set(name, provider);
    console.log(`[Orchestrator] Registered provider: ${name}`);
  }

  /**
   * Assemble context for an action
   * @param {string} action - e.g., 'CREATE_OBJECTIVE', 'GENERATE_KRS'
   * @param {object} params - e.g., { company_id, user_id }
   * @returns {object} Assembled context for LLM or UI
   */
  async assembleContext(action, params) {
    const rules = contextRules[action];

    if (!rules) {
      return { _metadata: { action, status: 'no_rules' } };
    }

    const context = {
      _metadata: {
        action,
        assembled_at: new Date().toISOString(),
        completeness: {}
      }
    };

    for (const requirement of rules.requires) {
      const { provider, fields, priority, fallback } = requirement;

      try {
        if (this.providers.has(provider)) {
          const data = await this.providers.get(provider).getData(params, fields);
          context[provider] = data;
          context._metadata.completeness[provider] = data ? 'complete' : 'empty';
        } else {
          context[provider] = fallback || null;
          context._metadata.completeness[provider] = 'missing_provider';
        }
      } catch (error) {
        context[provider] = fallback || null;
        context._metadata.completeness[provider] = 'error';
      }
    }

    context._metadata.overall_completeness = this.calculateCompleteness(context);
    return context;
  }

  calculateCompleteness(context) {
    const statuses = Object.values(context._metadata.completeness);
    const complete = statuses.filter(s => s === 'complete').length;
    return Math.round((complete / statuses.length) * 100);
  }
}

module.exports = new ContextAssemblyService();
```

---

### 2. Workflow Service

**Purpose**: Knows what should happen next based on events.

```javascript
// server/services/orchestrator/WorkflowService.js

const workflowRules = require('./config/workflow-rules.json');

class WorkflowService {
  constructor() {
    this.eventHandlers = new Map();
  }

  /**
   * Register event handler
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * Emit an event and get suggestions for next steps
   * @param {string} event - e.g., 'company.created', 'assessment.completed'
   * @param {object} data - Event data
   * @returns {object} Suggestions for next steps
   */
  async emit(event, data) {
    console.log(`[Workflow] Event: ${event}`);

    // Execute registered handlers
    const handlers = this.eventHandlers.get(event) || [];
    for (const handler of handlers) {
      await handler(data);
    }

    // Get suggestions from config
    return this.getSuggestions(event, data);
  }

  getSuggestions(event, data) {
    const rules = workflowRules[event];
    if (!rules) return { suggestions: [] };

    const suggestions = [];

    for (const rule of rules.next_steps) {
      if (this.evaluateConditions(rule.conditions, data)) {
        suggestions.push({
          action: rule.action,
          label: rule.label,
          priority: rule.priority,
          route: this.interpolate(rule.route, data)
        });
      }
    }

    return {
      event,
      suggestions: suggestions.sort((a, b) => b.priority - a.priority)
    };
  }

  evaluateConditions(conditions, data) {
    if (!conditions) return true;
    for (const [key, expected] of Object.entries(conditions)) {
      const actual = key.split('.').reduce((o, k) => o?.[k], data);
      if (actual !== expected) return false;
    }
    return true;
  }

  interpolate(template, data) {
    if (!template) return '';
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
  }
}

module.exports = new WorkflowService();
```

---

### 3. Presentation Service

**Purpose**: Knows how to format data for UI components.

```javascript
// server/services/orchestrator/PresentationService.js

const presentationRules = require('./config/presentation-rules.json');

class PresentationService {
  /**
   * Format data for a specific UI component
   * @param {string} component - e.g., 'CLIENT_CARD', 'SSI_MINIBAR'
   * @param {object} rawData - Data from context assembly
   * @returns {object} Formatted data for UI
   */
  format(component, rawData) {
    const rules = presentationRules[component];
    if (!rules) return rawData;

    const formatted = {};

    // Extract and transform fields
    for (const [field, rule] of Object.entries(rules.fields)) {
      const value = this.extractValue(rawData, rule.source);
      formatted[field] = this.applyTransform(value, rule.transform, rule.fallback);
    }

    // Add computed fields
    if (rules.computed) {
      for (const [field, computation] of Object.entries(rules.computed)) {
        formatted[field] = this.compute(computation, formatted, rawData);
      }
    }

    return formatted;
  }

  extractValue(data, source) {
    return source.split('.').reduce((o, k) => o?.[k], data);
  }

  applyTransform(value, transform, fallback) {
    if (value === null || value === undefined) return fallback;

    const transforms = {
      capitalize: v => String(v).charAt(0).toUpperCase() + String(v).slice(1),
      percentage: v => `${v}%`,
      count: v => Array.isArray(v) ? v.length : v,
      boolean_to_badge: v => v ? 'complete' : 'incomplete'
    };

    return transforms[transform] ? transforms[transform](value) : value;
  }

  compute(computation, formatted, rawData) {
    switch (computation.type) {
      case 'threshold':
        return formatted[computation.field] >= computation.threshold
          ? computation.above
          : computation.below;

      case 'ssi_color':
        const score = formatted[computation.field];
        if (score === null) return 'gray';
        if (score >= 70) return 'green';
        if (score >= 50) return 'yellow';
        return 'red';

      case 'ai_ready':
        return formatted.profile_completion >= 70;

      default:
        return null;
    }
  }
}

module.exports = new PresentationService();
```

---

## LEGO Pieces (Data Providers)

### Base Interface

All LEGO pieces implement this interface to register with the orchestrator.

```javascript
// server/services/orchestrator/interfaces/DataProvider.js

class DataProvider {
  constructor(name) {
    this.name = name;
  }

  /**
   * Register with orchestrator on startup
   */
  register(orchestrator) {
    orchestrator.contextAssembly.registerProvider(this.name, this);
  }

  /**
   * Get data for context assembly
   * @param {object} params - Query parameters
   * @param {array} fields - Requested fields
   * @returns {object} Provider data
   */
  async getData(params, fields) {
    throw new Error('getData() must be implemented');
  }

  /**
   * Store data
   * @param {object} data - Data to store
   * @returns {object} Stored record
   */
  async storeData(data) {
    throw new Error('storeData() must be implemented');
  }

  /**
   * Emit event to workflow service
   */
  async emitEvent(event, data) {
    const WorkflowService = require('../WorkflowService');
    return WorkflowService.emit(`${this.name}.${event}`, data);
  }
}

module.exports = DataProvider;
```

---

### The 7 LEGO Pieces

| Piece | Model | Collects | Provides |
|-------|-------|----------|----------|
| **COMPANY** | Company | Profile, metrics, vision | Business context for LLM |
| **PERSON** | User | Personal info, preferences | User identity, permissions |
| **TEAM** | Team | Members, groupings | Team structure |
| **ASSESSMENT** | Assessment | Responses, scores | SSI scores, constraints |
| **OBJECTIVE** | Objective | OKRs, behaviors | Direction, goals |
| **PLANNING** | Goal, Task | Breakdown, execution | Weekly plans, tasks |
| **BEHAVIOR** | Behavior | 9 Disciplines | YSELA framework |

---

### Auto-Registration

Providers auto-register on startup:

```javascript
// server/services/orchestrator/index.js

const ContextAssemblyService = require('./ContextAssemblyService');
const WorkflowService = require('./WorkflowService');
const PresentationService = require('./PresentationService');

// Auto-register all providers
const providers = [
  require('../providers/CompanyProvider'),
  require('../providers/PersonProvider'),
  require('../providers/TeamProvider'),
  require('../providers/AssessmentProvider'),
  require('../providers/ObjectiveProvider'),
  require('../providers/PlanningProvider'),
  require('../providers/BehaviorProvider')
];

const orchestrator = {
  contextAssembly: ContextAssemblyService,
  workflow: WorkflowService,
  presentation: PresentationService
};

// Register each provider
providers.forEach(provider => {
  provider.register(orchestrator);
});

module.exports = orchestrator;
```

---

## Configuration Files

### Context Rules (context-rules.json)

Defines what data is needed for each action:

```json
{
  "CREATE_OBJECTIVE": {
    "description": "Context for creating a new objective",
    "requires": [
      {
        "provider": "company",
        "fields": ["name", "industry", "employee_count", "business_context"],
        "priority": "required",
        "fallback": { "name": "Unknown Company" }
      },
      {
        "provider": "assessment",
        "fields": ["ssi_scores", "constraint_area", "sub_dimensions"],
        "priority": "recommended",
        "fallback": { "ssi_scores": { "speed": 50, "strength": 50, "intelligence": 50 } }
      },
      {
        "provider": "behavior",
        "fields": ["disciplines", "foundations"],
        "priority": "required",
        "fallback": null
      }
    ]
  },

  "GENERATE_KRS": {
    "description": "Context for generating Key Results",
    "requires": [
      {
        "provider": "company",
        "fields": ["business_context.profile", "business_context.strategic_vision"],
        "priority": "high_value",
        "fallback": {}
      },
      {
        "provider": "assessment",
        "fields": ["ssi_scores", "constraint_area"],
        "priority": "recommended",
        "fallback": null
      },
      {
        "provider": "objective",
        "fields": ["title", "category", "behaviors", "ssi_impact"],
        "priority": "required",
        "fallback": null
      }
    ]
  },

  "SHOW_CLIENT_CARD": {
    "description": "Context for enhanced client card display",
    "requires": [
      {
        "provider": "company",
        "fields": ["name", "industry", "employee_count", "profile_completion"],
        "priority": "required",
        "fallback": null
      },
      {
        "provider": "team",
        "fields": ["count"],
        "priority": "required",
        "fallback": { "count": 0 }
      },
      {
        "provider": "assessment",
        "fields": ["ssi_scores", "response_count", "last_completed"],
        "priority": "optional",
        "fallback": null
      }
    ]
  },

  "SHOW_PERSONAL_PROFILE": {
    "description": "Context for personal profile page",
    "requires": [
      {
        "provider": "person",
        "fields": ["name", "email", "role", "preferences", "teams"],
        "priority": "required",
        "fallback": null
      },
      {
        "provider": "company",
        "fields": ["name", "industry"],
        "priority": "optional",
        "fallback": null
      }
    ]
  }
}
```

---

### Workflow Rules (workflow-rules.json)

Defines what should happen next:

```json
{
  "company.created": {
    "description": "When a new company is added",
    "next_steps": [
      {
        "action": "COMPLETE_PROFILE",
        "label": "Complete company profile for better AI recommendations",
        "priority": 10,
        "route": "/pages/company-profile.html?id={{company_id}}",
        "conditions": { "profile_completion_low": true }
      },
      {
        "action": "CREATE_TEAM",
        "label": "Add a team to this company",
        "priority": 8,
        "route": "/pages/teams.html?company_id={{company_id}}&action=create"
      },
      {
        "action": "SEND_ASSESSMENT",
        "label": "Send assessment to measure organizational health",
        "priority": 7,
        "route": "/pages/assessment-hub.html?tab=templates"
      }
    ]
  },

  "company.profile_updated": {
    "description": "When company profile is updated",
    "next_steps": [
      {
        "action": "CREATE_OBJECTIVE",
        "label": "Create objectives with updated context",
        "priority": 8,
        "route": "/pages/objectives.html?action=create&company_id={{company_id}}",
        "conditions": { "has_assessment": true }
      }
    ]
  },

  "assessment.completed": {
    "description": "When assessment responses are submitted",
    "next_steps": [
      {
        "action": "VIEW_RESULTS",
        "label": "View SSI scores and insights",
        "priority": 10,
        "route": "/pages/team-ssi-view.html?company_id={{company_id}}"
      },
      {
        "action": "CREATE_OBJECTIVE",
        "label": "Create objective based on SSI constraint",
        "priority": 9,
        "route": "/pages/objectives.html?action=create&company_id={{company_id}}"
      }
    ]
  },

  "objective.created": {
    "description": "When an objective is created",
    "next_steps": [
      {
        "action": "ADD_KRS",
        "label": "Generate Key Results with AI",
        "priority": 10,
        "route": "/pages/objectives.html?id={{objective_id}}&step=2"
      }
    ]
  },

  "person.updated": {
    "description": "When personal profile is updated",
    "next_steps": []
  }
}
```

---

### Presentation Rules (presentation-rules.json)

Defines how to format data for UI:

```json
{
  "CLIENT_CARD": {
    "description": "Enhanced client card in My Clients tab",
    "fields": {
      "name": {
        "source": "company.name",
        "fallback": "Unknown Company"
      },
      "industry": {
        "source": "company.industry",
        "transform": "capitalize",
        "fallback": "Not specified"
      },
      "employee_count": {
        "source": "company.employee_count",
        "fallback": null
      },
      "profile_completion": {
        "source": "company.profile_completion.percentage",
        "fallback": 0
      },
      "team_count": {
        "source": "team.count",
        "fallback": 0
      },
      "response_count": {
        "source": "assessment.response_count",
        "fallback": 0
      },
      "ssi_speed": {
        "source": "assessment.ssi_scores.speed",
        "fallback": null
      },
      "ssi_strength": {
        "source": "assessment.ssi_scores.strength",
        "fallback": null
      },
      "ssi_intelligence": {
        "source": "assessment.ssi_scores.intelligence",
        "fallback": null
      }
    },
    "computed": {
      "ai_ready": { "type": "ai_ready" },
      "has_assessment": {
        "type": "threshold",
        "field": "response_count",
        "threshold": 1,
        "above": true,
        "below": false
      },
      "ssi_speed_color": { "type": "ssi_color", "field": "ssi_speed" },
      "ssi_strength_color": { "type": "ssi_color", "field": "ssi_strength" },
      "ssi_intelligence_color": { "type": "ssi_color", "field": "ssi_intelligence" }
    }
  },

  "PERSONAL_PROFILE": {
    "description": "Personal profile page",
    "fields": {
      "name": { "source": "person.name", "fallback": "User" },
      "email": { "source": "person.email", "fallback": null },
      "role": { "source": "person.role", "transform": "capitalize", "fallback": "Employee" },
      "company_name": { "source": "company.name", "fallback": null },
      "team_count": { "source": "person.teams", "transform": "count", "fallback": 0 },
      "timezone": { "source": "person.preferences.timezone", "fallback": "America/New_York" }
    },
    "computed": {
      "profile_complete": {
        "type": "threshold",
        "field": "name",
        "threshold": 0,
        "above": true,
        "below": false
      }
    }
  },

  "SSI_MINIBAR": {
    "description": "Compact SSI display for cards",
    "fields": {
      "speed": { "source": "assessment.ssi_scores.speed", "fallback": null },
      "strength": { "source": "assessment.ssi_scores.strength", "fallback": null },
      "intelligence": { "source": "assessment.ssi_scores.intelligence", "fallback": null }
    },
    "computed": {
      "has_data": {
        "type": "threshold",
        "field": "speed",
        "threshold": 0,
        "above": true,
        "below": false
      },
      "speed_color": { "type": "ssi_color", "field": "speed" },
      "strength_color": { "type": "ssi_color", "field": "strength" },
      "intelligence_color": { "type": "ssi_color", "field": "intelligence" }
    }
  }
}
```

---

## The Play: User ↔ LLM

### Conversation Flow

```
USER                        ORCHESTRATOR                         LLM
 │                               │                                │
 │  "Create objective"           │                                │
 │ ─────────────────────────►    │                                │
 │                               │                                │
 │                               │  1. assembleContext('CREATE_OBJECTIVE')
 │                               │     ├─ CompanyProvider.getData()
 │                               │     ├─ AssessmentProvider.getData()
 │                               │     └─ BehaviorProvider.getData()
 │                               │                                │
 │                               │  2. Format context for LLM     │
 │                               │ ─────────────────────────────► │
 │                               │                                │
 │                               │                                │  3. Generate
 │                               │                                │     response
 │                               │                                │
 │                               │  4. Parse structured response  │
 │                               │ ◄───────────────────────────── │
 │                               │                                │
 │  5. presentation.format()     │                                │
 │ ◄──────────────────────────── │                                │
 │                                                                │
 │  6. User reviews, adjusts     │                                │
 │ ─────────────────────────►    │                                │
 │                               │                                │
 │                               │  7. Refine with context        │
 │                               │ ─────────────────────────────► │
 │                               │                                │
 │                               │  ... conversation continues    │
 │                                                                │
 │  8. "Save objective"          │                                │
 │ ─────────────────────────►    │                                │
 │                               │                                │
 │                               │  9. ObjectiveProvider.storeData()
 │                               │     └─ emitEvent('created')
 │                               │                                │
 │                               │  10. workflow.getSuggestions()
 │  11. "Add KRs" suggestion     │                                │
 │ ◄──────────────────────────── │                                │
```

---

## Implementation Guide

### Adding a New LEGO Piece

1. **Create the provider**:
```javascript
// server/services/providers/NewModuleProvider.js
const DataProvider = require('../orchestrator/interfaces/DataProvider');

class NewModuleProvider extends DataProvider {
  constructor() {
    super('newmodule');
  }

  async getData(params, fields) {
    // Implement data retrieval
  }

  async storeData(data) {
    // Implement data storage
    await this.emitEvent('created', data);
  }
}

module.exports = new NewModuleProvider();
```

2. **Add to auto-registration**:
```javascript
// server/services/orchestrator/index.js
const providers = [
  // ... existing providers
  require('../providers/NewModuleProvider')
];
```

3. **Add context rules**:
```json
// config/context-rules.json
{
  "USE_NEW_MODULE": {
    "requires": [
      { "provider": "newmodule", "fields": ["..."], "priority": "required" }
    ]
  }
}
```

### Adding a New UI Component

1. **Add presentation rules**:
```json
// config/presentation-rules.json
{
  "NEW_COMPONENT": {
    "fields": { ... },
    "computed": { ... }
  }
}
```

2. **Use in frontend**:
```javascript
const formatted = await fetch(`/api/orchestrator/present?component=NEW_COMPONENT&company_id=${id}`);
```

---

## File Structure

```
server/
├── services/
│   ├── orchestrator/
│   │   ├── index.js                     # Main entry, auto-registration
│   │   ├── ContextAssemblyService.js    # What data to collect
│   │   ├── WorkflowService.js           # What to do next
│   │   ├── PresentationService.js       # How to display
│   │   │
│   │   ├── config/
│   │   │   ├── context-rules.json       # Context assembly rules
│   │   │   ├── workflow-rules.json      # Workflow rules
│   │   │   └── presentation-rules.json  # Presentation rules
│   │   │
│   │   └── interfaces/
│   │       └── DataProvider.js          # Base class for providers
│   │
│   └── providers/
│       ├── CompanyProvider.js
│       ├── PersonProvider.js
│       ├── TeamProvider.js
│       ├── AssessmentProvider.js
│       ├── ObjectiveProvider.js
│       ├── PlanningProvider.js
│       └── BehaviorProvider.js
│
├── routes/
│   └── orchestrator.js                  # API endpoints for orchestrator
```

---

## API Endpoints

```javascript
// server/routes/orchestrator.js

router.get('/context/:action', async (req, res) => {
  const context = await orchestrator.contextAssembly.assembleContext(
    req.params.action,
    req.query
  );
  res.json(context);
});

router.get('/present/:component', async (req, res) => {
  const context = await orchestrator.contextAssembly.assembleContext(
    `SHOW_${req.params.component.toUpperCase()}`,
    req.query
  );
  const formatted = orchestrator.presentation.format(req.params.component, context);
  res.json(formatted);
});

router.post('/event', async (req, res) => {
  const { event, data } = req.body;
  const suggestions = await orchestrator.workflow.emit(event, data);
  res.json(suggestions);
});
```

---

## Feature Flag

```javascript
// server/config/feature-flags.js

module.exports = {
  FEATURE_ORCHESTRATOR_ENABLED: process.env.FEATURE_ORCHESTRATOR_ENABLED === 'true' || false
};
```

**Usage**:
```javascript
const { FEATURE_ORCHESTRATOR_ENABLED } = require('../config/feature-flags');

if (FEATURE_ORCHESTRATOR_ENABLED) {
  // Use orchestrator
} else {
  // Use existing direct calls
}
```

---

## Scalability

### Adding New Actions

Just add to `context-rules.json`:
```json
{
  "NEW_ACTION": {
    "requires": [...]
  }
}
```

### Adding New Events

Just add to `workflow-rules.json`:
```json
{
  "module.new_event": {
    "next_steps": [...]
  }
}
```

### Adding New Components

Just add to `presentation-rules.json`:
```json
{
  "NEW_COMPONENT": {
    "fields": {...},
    "computed": {...}
  }
}
```

**No code changes required for any of these!**

---

## Related Documents

- [COMPANY_PROFILE_STRATEGY.md](../1-PRODUCT/features/COMPANY_PROFILE_STRATEGY.md) - Company profile requirements
- [objective_kr_generation_prompt.md](./AI-PROMPTS/objective_kr_generation_prompt.md) - LLM prompt template
- [BETA_FINAL_STRATEGY_2026.md](../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) - Sprint 22 strategy

---

**Document Owner**: Engineering Team
**Created**: April 20, 2026 (Session #165)
**Status**: Active - Ready for Implementation (Sprint 22)
