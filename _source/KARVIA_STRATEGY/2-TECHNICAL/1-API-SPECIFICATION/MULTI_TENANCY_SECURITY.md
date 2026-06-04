# KARVIA Pro API - Multi-Tenancy Security

<!-- @GENOME T2-ARC-016 | ACTIVE | 2026-04-05 | parent:T1-KRV-001 | auto:/coding | linked:/audit -->

> **Part of KARVIA Engine** - See [KARVIA_ENGINE_VISION.md](../../1-VISION/KARVIA_ENGINE_VISION.md) for engine overview.

## Table of Contents

- [Overview](#overview)
- [Tenancy Architecture](#tenancy-architecture)
- [Data Isolation Strategies](#data-isolation-strategies)
- [Database Schema Design](#database-schema-design)
- [Query-Level Isolation](#query-level-isolation)
- [Cross-Tenant Protection](#cross-tenant-protection)
- [Tenant Context Management](#tenant-context-management)
- [Shared Resources](#shared-resources)
- [Tenant Provisioning](#tenant-provisioning)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Compliance](#monitoring--compliance)
- [Backup & Recovery](#backup--recovery)

---

## Overview

KARVIA Pro implements a **single-database, row-level multi-tenancy** architecture where multiple companies (tenants) share the same database infrastructure while maintaining complete data isolation and security.

### Multi-Tenancy Model

```
┌─────────────────────────────────────────────────────────┐
│                  KARVIA Pro Platform                    │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                     │
│            (Tenant Context Middleware)                  │
├─────────────────────────────────────────────────────────┤
│                    Database Layer                       │
│         (PostgreSQL with Row-Level Security)            │
├─────────────────────────────────────────────────────────┤
│  Company A Data  │  Company B Data  │  Company C Data  │
│  (tenant_id: 1)  │  (tenant_id: 2)  │  (tenant_id: 3)  │
└─────────────────────────────────────────────────────────┘
```

### Key Features

- **Row-Level Data Isolation**: Every record tagged with `company_id`
- **Automatic Filtering**: Middleware enforces tenant context
- **Cross-Tenant Protection**: Multiple layers prevent data leakage
- **Shared Infrastructure**: Cost-effective single database
- **Scalable Design**: Supports thousands of tenants
- **CONSULTANT Override**: Platform admins can access all tenants

### Tenancy Types Comparison

| Feature | Single-Tenant | Multi-Tenant (DB-per-tenant) | Multi-Tenant (Row-Level) |
|---------|---------------|------------------------------|-------------------------|
| **Data Isolation** | ✅ Complete | ✅ Complete | ⚠️ Application-enforced |
| **Cost Efficiency** | ❌ Low | ⚠️ Medium | ✅ High |
| **Scalability** | ❌ Complex | ⚠️ Medium | ✅ Excellent |
| **Customization** | ✅ Unlimited | ✅ High | ⚠️ Limited |
| **Maintenance** | ❌ Complex | ❌ Very Complex | ✅ Simple |
| **Performance** | ✅ Excellent | ✅ Excellent | ⚠️ Good (with proper indexing) |
| **KARVIA Choice** | ❌ | ❌ | ✅ Selected |

**Why Row-Level Multi-Tenancy for KARVIA Pro:**
1. **Cost-effective** for SaaS model with many small-medium businesses
2. **Simple maintenance** - single schema, single codebase
3. **Efficient resource usage** - shared database connections
4. **Fast tenant provisioning** - just create company record
5. **Easy upgrades** - deploy once, all tenants benefit

---

## Tenancy Architecture

### Tenant Identification

```typescript
// Primary tenant identifier
interface Company {
  id: string;                    // UUID - Primary tenant identifier
  name: string;
  subdomain: string;             // e.g., "acme" → acme.karvia.pro
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  created_at: Date;
  deleted_at?: Date;
}

// Tenant resolution methods
enum TenantResolutionMethod {
  SUBDOMAIN = 'subdomain',       // acme.karvia.pro
  JWT_CLAIM = 'jwt_claim',       // companyId in token
  HEADER = 'header',             // X-Tenant-ID header
  QUERY_PARAM = 'query_param'    // ?tenantId=xxx
}
```

### Tenant Resolution Flow

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ↓
┌──────────────────────────────┐
│ 1. Extract Tenant Identifier │
│    • Subdomain                │
│    • JWT companyId            │
│    • X-Tenant-ID header       │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ 2. Validate Tenant           │
│    • Check tenant exists     │
│    • Check tenant is active  │
│    • Verify user belongs     │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ 3. Set Tenant Context        │
│    • Attach to request       │
│    • Store in async context  │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ 4. Enforce in Queries        │
│    • Auto-add WHERE filters  │
│    • Validate results        │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ 5. Response                  │
│    • Only tenant data        │
└──────────────────────────────┘
```

---

## Data Isolation Strategies

### 1. Application-Level Isolation (Primary)

Every table includes `company_id` foreign key with automatic filtering.

```typescript
// ✅ CORRECT - Always include company_id filter
async function getObjectives(companyId: string): Promise<Objective[]> {
  return db('objectives')
    .where({ company_id: companyId, deleted_at: null })
    .select('*');
}

// ❌ WRONG - Missing company_id filter (data leak!)
async function getObjectives(): Promise<Objective[]> {
  return db('objectives')
    .where({ deleted_at: null })
    .select('*');
}
```

### 2. Middleware Enforcement (Secondary)

Automatic tenant context injection.

```typescript
// src/middleware/tenant-context.ts
import { AsyncLocalStorage } from 'async_hooks';

interface TenantContext {
  companyId: string;
  companyName: string;
  plan: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantContext>();

export function tenantContextMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    });
  }

  // CONSULTANT role can operate without tenant context
  if (req.user.role === UserRole.CONSULTANT) {
    // Allow explicit tenant selection via query param
    const targetCompanyId = req.query.companyId as string;
    if (targetCompanyId) {
      const company = await getCompanyById(targetCompanyId);
      if (company) {
        const context: TenantContext = {
          companyId: company.id,
          companyName: company.name,
          plan: company.plan
        };
        return tenantStorage.run(context, () => next());
      }
    }
    // No tenant context for CONSULTANT - can access all
    return next();
  }

  // Regular users - enforce their company context
  const context: TenantContext = {
    companyId: req.user.companyId,
    companyName: req.user.companyName,
    plan: req.user.companyPlan
  };

  // Run rest of request in tenant context
  tenantStorage.run(context, () => next());
}

// Helper to get current tenant
export function getCurrentTenant(): TenantContext | undefined {
  return tenantStorage.getStore();
}
```

### 3. Database Query Wrapper (Tertiary)

Automatic tenant filtering at query level.

```typescript
// src/database/tenant-query.ts
import Knex from 'knex';
import { getCurrentTenant } from '../middleware/tenant-context';

/**
 * Tenant-aware query builder
 */
export function tenantQuery(tableName: string): Knex.QueryBuilder {
  const baseQuery = db(tableName);
  const tenant = getCurrentTenant();

  // If no tenant context, return base query (for CONSULTANT)
  if (!tenant) {
    return baseQuery;
  }

  // Automatically add company_id filter
  return baseQuery.where(`${tableName}.company_id`, tenant.companyId);
}

// Usage
async function getObjectives(): Promise<Objective[]> {
  // Automatically includes company_id filter from context
  return tenantQuery('objectives')
    .where({ deleted_at: null })
    .select('*');
}
```

### 4. Row-Level Security (Database Level)

PostgreSQL policies for defense in depth.

```sql
-- Enable Row-Level Security on tables
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY tenant_isolation_policy ON objectives
  USING (
    company_id = current_setting('app.current_tenant_id', true)::uuid
    OR
    current_setting('app.current_user_role', true) = 'CONSULTANT'
  );

CREATE POLICY tenant_isolation_policy ON goals
  USING (
    company_id = current_setting('app.current_tenant_id', true)::uuid
    OR
    current_setting('app.current_user_role', true) = 'CONSULTANT'
  );

CREATE POLICY tenant_isolation_policy ON tasks
  USING (
    company_id = current_setting('app.current_tenant_id', true)::uuid
    OR
    current_setting('app.current_user_role', true) = 'CONSULTANT'
  );

-- Set tenant context at transaction start
-- This is set by application before each query
SET LOCAL app.current_tenant_id = '550e8400-e29b-41d4-a716-446655440000';
SET LOCAL app.current_user_role = 'MANAGER';
```

```typescript
// Set RLS context before queries
export async function withTenantContext<T>(
  companyId: string,
  userRole: UserRole,
  callback: () => Promise<T>
): Promise<T> {
  return db.transaction(async (trx) => {
    // Set PostgreSQL session variables for RLS
    await trx.raw(`SET LOCAL app.current_tenant_id = ?`, [companyId]);
    await trx.raw(`SET LOCAL app.current_user_role = ?`, [userRole]);

    // Execute callback with tenant context
    return callback();
  });
}
```

---

## Database Schema Design

### Tenant-Aware Table Structure

```sql
-- Companies table (tenant definition)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) NOT NULL UNIQUE,
  plan VARCHAR(50) NOT NULL DEFAULT 'starter',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  limits JSONB DEFAULT '{
    "max_users": 50,
    "max_objectives": 500,
    "max_storage_gb": 10
  }',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  CONSTRAINT valid_plan CHECK (plan IN ('starter', 'professional', 'enterprise')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'suspended', 'trial', 'cancelled'))
);

CREATE INDEX idx_companies_subdomain ON companies(subdomain) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_status ON companies(status) WHERE deleted_at IS NULL;
```

### Multi-Tenant Data Tables

**Pattern: Every tenant data table includes `company_id` FK**

```sql
-- Users table (tenant-specific)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  -- Unique email per company (not globally unique)
  CONSTRAINT unique_email_per_company UNIQUE (company_id, email, deleted_at),
  CONSTRAINT valid_role CHECK (role IN ('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'EMPLOYEE'))
);

-- Indexes for multi-tenancy
CREATE INDEX idx_users_company ON users(company_id, deleted_at);
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;

-- Objectives table (tenant-specific)
CREATE TABLE objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  progress DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  parent_id UUID REFERENCES objectives(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  -- Ensure owner belongs to same company
  CONSTRAINT owner_in_company CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = owner_id
      AND users.company_id = objectives.company_id
    )
  )
);

-- Compound indexes for tenant queries
CREATE INDEX idx_objectives_company_owner ON objectives(company_id, owner_id, deleted_at);
CREATE INDEX idx_objectives_company_status ON objectives(company_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_objectives_company_dates ON objectives(company_id, start_date, end_date) WHERE deleted_at IS NULL;

-- Goals table (tenant-specific)
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,

  -- Ensure all entities belong to same company
  CONSTRAINT entities_in_same_company CHECK (
    EXISTS (
      SELECT 1 FROM objectives
      WHERE objectives.id = objective_id
      AND objectives.company_id = goals.company_id
    )
  )
);

CREATE INDEX idx_goals_company_objective ON goals(company_id, objective_id, deleted_at);
CREATE INDEX idx_goals_company_owner ON goals(company_id, owner_id, deleted_at);

-- Assessments table (tenant-specific)
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL,
  score DECIMAL(5,2),
  responses JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_assessments_company_user ON assessments(company_id, user_id, deleted_at);
CREATE INDEX idx_assessments_company_type ON assessments(company_id, assessment_type) WHERE deleted_at IS NULL;
```

### Referential Integrity for Multi-Tenancy

```sql
-- Function to validate cross-tenant references
CREATE OR REPLACE FUNCTION validate_tenant_reference()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if referenced record belongs to same company
  IF NEW.company_id IS NOT NULL THEN
    -- Validate owner_id
    IF NEW.owner_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM users
        WHERE id = NEW.owner_id
        AND company_id = NEW.company_id
        AND deleted_at IS NULL
      ) THEN
        RAISE EXCEPTION 'Referenced user does not belong to the same company';
      END IF;
    END IF;

    -- Validate objective_id (for goals/tasks)
    IF NEW.objective_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM objectives
        WHERE id = NEW.objective_id
        AND company_id = NEW.company_id
        AND deleted_at IS NULL
      ) THEN
        RAISE EXCEPTION 'Referenced objective does not belong to the same company';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tenant tables
CREATE TRIGGER validate_objectives_tenant
  BEFORE INSERT OR UPDATE ON objectives
  FOR EACH ROW
  EXECUTE FUNCTION validate_tenant_reference();

CREATE TRIGGER validate_goals_tenant
  BEFORE INSERT OR UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION validate_tenant_reference();

CREATE TRIGGER validate_tasks_tenant
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION validate_tenant_reference();
```

---

## Query-Level Isolation

### Automatic Query Filtering

```typescript
// src/database/query-builder.ts

/**
 * Base repository class with automatic tenant filtering
 */
export class TenantRepository<T> {
  constructor(
    private tableName: string,
    private db: Knex
  ) {}

  /**
   * Get query builder with automatic tenant filter
   */
  private query(): Knex.QueryBuilder {
    const tenant = getCurrentTenant();
    const baseQuery = this.db(this.tableName);

    if (tenant) {
      return baseQuery.where(`${this.tableName}.company_id`, tenant.companyId);
    }

    return baseQuery;
  }

  /**
   * Find all records for current tenant
   */
  async findAll(filters: Partial<T> = {}): Promise<T[]> {
    return this.query()
      .where(filters)
      .where({ deleted_at: null })
      .select('*');
  }

  /**
   * Find by ID with tenant check
   */
  async findById(id: string): Promise<T | null> {
    const result = await this.query()
      .where({ id, deleted_at: null })
      .first();

    return result || null;
  }

  /**
   * Create with automatic company_id
   */
  async create(data: Partial<T>): Promise<T> {
    const tenant = getCurrentTenant();

    if (!tenant) {
      throw new Error('Tenant context required for create operation');
    }

    const record = {
      ...data,
      company_id: tenant.companyId,
      created_at: new Date(),
      updated_at: new Date()
    };

    const [created] = await this.db(this.tableName)
      .insert(record)
      .returning('*');

    return created;
  }

  /**
   * Update with tenant validation
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    const updates = {
      ...data,
      updated_at: new Date()
    };

    // Remove company_id from updates (immutable)
    delete updates['company_id'];

    const [updated] = await this.query()
      .where({ id })
      .update(updates)
      .returning('*');

    return updated || null;
  }

  /**
   * Soft delete with tenant validation
   */
  async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id);

    if (!existing) {
      return false;
    }

    await this.query()
      .where({ id })
      .update({
        deleted_at: new Date(),
        updated_at: new Date()
      });

    return true;
  }
}
```

### Repository Usage

```typescript
// src/repositories/objectives.repository.ts
import { TenantRepository } from '../database/query-builder';
import { Objective } from '../types';

class ObjectivesRepository extends TenantRepository<Objective> {
  constructor() {
    super('objectives', db);
  }

  /**
   * Find objectives by owner
   */
  async findByOwner(ownerId: string): Promise<Objective[]> {
    // Automatically includes company_id filter
    return this.findAll({ owner_id: ownerId });
  }

  /**
   * Find objectives by status
   */
  async findByStatus(status: string): Promise<Objective[]> {
    return this.findAll({ status });
  }

  /**
   * Find child objectives
   */
  async findChildren(parentId: string): Promise<Objective[]> {
    return this.findAll({ parent_id: parentId });
  }

  /**
   * Find objectives with goals count
   */
  async findWithGoalsCount(): Promise<Array<Objective & { goals_count: number }>> {
    const tenant = getCurrentTenant();

    if (!tenant) {
      throw new Error('Tenant context required');
    }

    return db('objectives')
      .where({ 'objectives.company_id': tenant.companyId, 'objectives.deleted_at': null })
      .leftJoin('goals', function() {
        this.on('goals.objective_id', '=', 'objectives.id')
          .andOn('goals.deleted_at', 'is', db.raw('null'));
      })
      .groupBy('objectives.id')
      .select('objectives.*')
      .count('goals.id as goals_count');
  }
}

export default new ObjectivesRepository();
```

### Complex Tenant-Aware Queries

```typescript
// src/services/analytics.service.ts

class AnalyticsService {
  /**
   * Get company-wide progress dashboard
   */
  async getCompanyDashboard(companyId: string): Promise<DashboardData> {
    // Verify user has access to this company
    const tenant = getCurrentTenant();
    if (tenant && tenant.companyId !== companyId) {
      throw new Error('Cross-tenant access denied');
    }

    // All queries automatically scoped to company
    const [objectivesStats, usersStats, assessmentsStats] = await Promise.all([
      // Objectives statistics
      db('objectives')
        .where({ company_id: companyId, deleted_at: null })
        .select(
          db.raw('COUNT(*) as total'),
          db.raw('AVG(progress) as avg_progress'),
          db.raw('COUNT(*) FILTER (WHERE status = ?) as active_count', ['active']),
          db.raw('COUNT(*) FILTER (WHERE status = ?) as completed_count', ['completed'])
        )
        .first(),

      // Users statistics
      db('users')
        .where({ company_id: companyId, deleted_at: null })
        .select(
          db.raw('COUNT(*) as total'),
          db.raw('COUNT(*) FILTER (WHERE status = ?) as active_count', ['active'])
        )
        .first(),

      // Assessments statistics
      db('assessments')
        .where({ company_id: companyId, deleted_at: null })
        .select(
          db.raw('COUNT(*) as total'),
          db.raw('AVG(score) as avg_score')
        )
        .first()
    ]);

    return {
      objectives: objectivesStats,
      users: usersStats,
      assessments: assessmentsStats
    };
  }

  /**
   * Get top performers in company
   */
  async getTopPerformers(limit: number = 10): Promise<PerformerData[]> {
    const tenant = getCurrentTenant();

    if (!tenant) {
      throw new Error('Tenant context required');
    }

    return db('users')
      .where({ 'users.company_id': tenant.companyId, 'users.deleted_at': null })
      .leftJoin('objectives', function() {
        this.on('objectives.owner_id', '=', 'users.id')
          .andOn('objectives.deleted_at', 'is', db.raw('null'));
      })
      .groupBy('users.id')
      .orderBy('avg_progress', 'desc')
      .limit(limit)
      .select(
        'users.id',
        'users.first_name',
        'users.last_name',
        db.raw('COUNT(objectives.id) as objectives_count'),
        db.raw('AVG(objectives.progress) as avg_progress')
      );
  }
}

export default new AnalyticsService();
```

---

## Cross-Tenant Protection

### Validation Layers

```typescript
// src/middleware/cross-tenant-protection.ts

/**
 * Layer 1: Request validation
 * Prevent cross-tenant resource access via URL manipulation
 */
export function validateTenantAccess(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user!;
  const tenant = getCurrentTenant();

  // CONSULTANT can access any tenant
  if (user.role === UserRole.CONSULTANT) {
    return next();
  }

  // Verify tenant context matches user's company
  if (tenant && tenant.companyId !== user.companyId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CROSS_TENANT_ACCESS_DENIED',
        message: 'You do not have access to this company',
        details: {
          userCompany: user.companyId,
          requestedCompany: tenant.companyId
        }
      }
    });
  }

  // Check for companyId in request body/query
  const bodyCompanyId = req.body?.company_id || req.body?.companyId;
  const queryCompanyId = req.query?.company_id || req.query?.companyId;
  const paramsCompanyId = req.params?.companyId;

  const requestedCompanyId = bodyCompanyId || queryCompanyId || paramsCompanyId;

  if (requestedCompanyId && requestedCompanyId !== user.companyId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CROSS_TENANT_ACCESS_DENIED',
        message: 'You do not have access to this company',
        details: {
          userCompany: user.companyId,
          requestedCompany: requestedCompanyId
        }
      }
    });
  }

  next();
}

/**
 * Layer 2: Resource validation
 * Verify fetched resources belong to user's company
 */
export function validateResourceTenant<T extends { company_id: string }>(
  resource: T | null,
  user: AccessTokenPayload
): void {
  if (!resource) {
    throw new Error('Resource not found');
  }

  // CONSULTANT can access any resource
  if (user.role === UserRole.CONSULTANT) {
    return;
  }

  // Verify resource belongs to user's company
  if (resource.company_id !== user.companyId) {
    throw new Error('Cross-tenant access denied');
  }
}

/**
 * Layer 3: Response sanitization
 * Remove resources from other tenants in responses
 */
export function sanitizeResponseData<T extends { company_id: string }>(
  data: T | T[],
  user: AccessTokenPayload
): T | T[] {
  // CONSULTANT sees all data
  if (user.role === UserRole.CONSULTANT) {
    return data;
  }

  // Filter array responses
  if (Array.isArray(data)) {
    return data.filter(item => item.company_id === user.companyId);
  }

  // Validate single resource
  if (data.company_id !== user.companyId) {
    throw new Error('Cross-tenant access denied');
  }

  return data;
}
```

### Cross-Tenant Attack Scenarios & Mitigations

#### Scenario 1: Direct ID Access

**Attack:**
```
GET /api/objectives/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <user_from_company_A>

// Trying to access objective from Company B
```

**Mitigation:**
```typescript
export async function getObjective(req: AuthenticatedRequest, res: Response) {
  const objectiveId = req.params.id;

  // Query automatically includes company_id filter
  const objective = await objectivesRepository.findById(objectiveId);

  if (!objective) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Objective not found' }
    });
  }

  // Additional validation
  validateResourceTenant(objective, req.user!);

  res.json({ success: true, data: objective });
}
```

#### Scenario 2: Body Parameter Injection

**Attack:**
```json
POST /api/objectives
{
  "title": "Steal data",
  "company_id": "other-company-uuid",  // Trying to create in different company
  "owner_id": "user-from-other-company"
}
```

**Mitigation:**
```typescript
export async function createObjective(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;
  const data = req.body;

  // Explicitly reject company_id in request
  if (data.company_id && data.company_id !== user.companyId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'INVALID_COMPANY_ID',
        message: 'Cannot create resource for different company'
      }
    });
  }

  // Force user's company_id
  const objectiveData = {
    ...data,
    company_id: user.companyId,  // Override with user's company
  };

  // Validate owner belongs to same company
  if (objectiveData.owner_id) {
    const owner = await usersRepository.findById(objectiveData.owner_id);
    if (!owner || owner.company_id !== user.companyId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OWNER',
          message: 'Owner must belong to your company'
        }
      });
    }
  }

  const objective = await objectivesRepository.create(objectiveData);
  res.status(201).json({ success: true, data: objective });
}
```

#### Scenario 3: JOIN Query Leakage

**Attack:**
```sql
-- Malicious query attempting cross-tenant JOIN
SELECT objectives.*, users.email, users.password_hash
FROM objectives
LEFT JOIN users ON users.company_id != objectives.company_id
WHERE objectives.id = '...'
```

**Mitigation:**
```typescript
// Always include company_id in JOIN conditions
async function getObjectivesWithOwners(): Promise<any[]> {
  const tenant = getCurrentTenant();

  if (!tenant) {
    throw new Error('Tenant context required');
  }

  return db('objectives')
    .where({ 'objectives.company_id': tenant.companyId })
    .join('users', function() {
      this.on('users.id', '=', 'objectives.owner_id')
        .andOn('users.company_id', '=', 'objectives.company_id')  // ← Critical!
        .andOn('users.deleted_at', 'is', db.raw('null'));
    })
    .where({ 'objectives.deleted_at': null })
    .select(
      'objectives.*',
      'users.first_name',
      'users.last_name',
      'users.email'
    );
}
```

#### Scenario 4: Cascade Reference Manipulation

**Attack:**
```json
POST /api/objectives/my-objective-id/cascade
{
  "cascadeTargets": [
    {
      "targetType": "user",
      "targetId": "user-from-other-company"  // Trying to cascade to other company
    }
  ]
}
```

**Mitigation:**
```typescript
export async function cascadeObjective(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;
  const objectiveId = req.params.id;
  const { cascadeTargets } = req.body;

  // Verify source objective ownership
  const sourceObjective = await objectivesRepository.findById(objectiveId);
  if (!sourceObjective) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Objective not found' }
    });
  }

  // Validate all target users belong to same company
  for (const target of cascadeTargets) {
    if (target.targetType === 'user') {
      const targetUser = await usersRepository.findById(target.targetId);

      if (!targetUser) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TARGET',
            message: `User ${target.targetId} not found`
          }
        });
      }

      // Critical: Verify same company
      if (targetUser.company_id !== user.companyId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'CROSS_TENANT_CASCADE',
            message: 'Cannot cascade to users from other companies',
            details: {
              targetUserId: target.targetId,
              targetCompany: targetUser.company_id,
              yourCompany: user.companyId
            }
          }
        });
      }
    }
  }

  // Proceed with cascade...
  const cascadedObjectives = await cascadeService.create(
    sourceObjective,
    cascadeTargets
  );

  res.status(201).json({ success: true, data: cascadedObjectives });
}
```

---

## Tenant Context Management

### Tenant Context Storage

```typescript
// src/context/tenant-context.ts
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  companyId: string;
  companyName: string;
  companyPlan: 'starter' | 'professional' | 'enterprise';
  companyStatus: 'active' | 'suspended' | 'trial';
  limits: {
    maxUsers: number;
    maxObjectives: number;
    maxStorageGb: number;
  };
}

// Async local storage for tenant context
export const tenantStorage = new AsyncLocalStorage<TenantContext>();

/**
 * Get current tenant context
 */
export function getCurrentTenant(): TenantContext | undefined {
  return tenantStorage.getStore();
}

/**
 * Get current tenant ID
 */
export function getCurrentTenantId(): string | undefined {
  return tenantStorage.getStore()?.companyId;
}

/**
 * Require tenant context (throw if missing)
 */
export function requireTenant(): TenantContext {
  const tenant = getCurrentTenant();
  if (!tenant) {
    throw new Error('Tenant context required but not available');
  }
  return tenant;
}

/**
 * Check if tenant has feature based on plan
 */
export function hasTenantFeature(feature: string): boolean {
  const tenant = getCurrentTenant();
  if (!tenant) return false;

  const featureMatrix = {
    ai_generation: ['professional', 'enterprise'],
    advanced_analytics: ['professional', 'enterprise'],
    custom_branding: ['enterprise'],
    sso: ['enterprise'],
    api_access: ['professional', 'enterprise']
  };

  const allowedPlans = featureMatrix[feature] || [];
  return allowedPlans.includes(tenant.companyPlan);
}

/**
 * Check if tenant is within limits
 */
export async function checkTenantLimit(
  limitType: 'users' | 'objectives' | 'storage'
): Promise<{ withinLimit: boolean; current: number; max: number }> {
  const tenant = requireTenant();

  let current: number;
  let max: number;

  switch (limitType) {
    case 'users':
      current = await db('users')
        .where({ company_id: tenant.companyId, deleted_at: null })
        .count('* as count')
        .first()
        .then(r => parseInt(r.count));
      max = tenant.limits.maxUsers;
      break;

    case 'objectives':
      current = await db('objectives')
        .where({ company_id: tenant.companyId, deleted_at: null })
        .count('* as count')
        .first()
        .then(r => parseInt(r.count));
      max = tenant.limits.maxObjectives;
      break;

    case 'storage':
      // Calculate storage usage
      current = 0; // Implement based on file storage
      max = tenant.limits.maxStorageGb;
      break;
  }

  return {
    withinLimit: current < max,
    current,
    max
  };
}
```

### Tenant Context Middleware

```typescript
// src/middleware/tenant.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { tenantStorage, TenantContext } from '../context/tenant-context';

/**
 * Initialize tenant context from authenticated user
 */
export async function initializeTenantContext(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    });
  }

  // CONSULTANT can operate without tenant context
  if (req.user.role === UserRole.CONSULTANT) {
    // Check if targeting specific company via query
    const targetCompanyId = req.query.companyId as string;

    if (targetCompanyId) {
      const company = await getCompanyById(targetCompanyId);

      if (!company) {
        return res.status(404).json({
          success: false,
          error: { code: 'COMPANY_NOT_FOUND', message: 'Company not found' }
        });
      }

      if (company.deleted_at) {
        return res.status(410).json({
          success: false,
          error: { code: 'COMPANY_DELETED', message: 'Company has been deleted' }
        });
      }

      const context: TenantContext = {
        companyId: company.id,
        companyName: company.name,
        companyPlan: company.plan,
        companyStatus: company.status,
        limits: company.limits
      };

      return tenantStorage.run(context, () => next());
    }

    // No specific company - allow unrestricted access
    return next();
  }

  // Regular users - load their company context
  const company = await getCompanyById(req.user.companyId);

  if (!company) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'COMPANY_NOT_FOUND',
        message: 'Your company was not found'
      }
    });
  }

  // Check company status
  if (company.status === 'suspended') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'COMPANY_SUSPENDED',
        message: 'Your company account has been suspended. Please contact support.'
      }
    });
  }

  if (company.status === 'cancelled') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'COMPANY_CANCELLED',
        message: 'Your company account has been cancelled.'
      }
    });
  }

  const context: TenantContext = {
    companyId: company.id,
    companyName: company.name,
    companyPlan: company.plan,
    companyStatus: company.status,
    limits: company.limits
  };

  // Run rest of request with tenant context
  tenantStorage.run(context, () => next());
}

/**
 * Require specific tenant plan
 */
export function requirePlan(plans: Array<'starter' | 'professional' | 'enterprise'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tenant = getCurrentTenant();

    if (!tenant) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'TENANT_CONTEXT_MISSING',
          message: 'Tenant context required'
        }
      });
    }

    if (!plans.includes(tenant.companyPlan)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PLAN_UPGRADE_REQUIRED',
          message: `This feature requires ${plans.join(' or ')} plan`,
          details: {
            currentPlan: tenant.companyPlan,
            requiredPlans: plans
          }
        }
      });
    }

    next();
  };
}
```

---

## Shared Resources

Some resources are shared across all tenants (not company-specific).

### Shared Tables

```sql
-- Assessment Templates (shared across all companies)
CREATE TABLE assessment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- No company_id - shared across all tenants
CREATE INDEX idx_assessment_templates_active ON assessment_templates(is_active) WHERE deleted_at IS NULL;

-- Notification Templates (shared)
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- System Configuration (shared)
CREATE TABLE system_config (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Accessing Shared Resources

```typescript
// src/repositories/shared.repository.ts

/**
 * Base repository for shared resources (no tenant filtering)
 */
export class SharedRepository<T> {
  constructor(
    private tableName: string,
    private db: Knex
  ) {}

  async findAll(): Promise<T[]> {
    return this.db(this.tableName)
      .where({ deleted_at: null })
      .select('*');
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.db(this.tableName)
      .where({ id, deleted_at: null })
      .first();

    return result || null;
  }
}

// Assessment Templates Repository
class AssessmentTemplatesRepository extends SharedRepository<AssessmentTemplate> {
  constructor() {
    super('assessment_templates', db);
  }

  async findActive(): Promise<AssessmentTemplate[]> {
    return this.db('assessment_templates')
      .where({ is_active: true, deleted_at: null })
      .select('*');
  }
}

export default new AssessmentTemplatesRepository();
```

---

## Tenant Provisioning

### New Tenant Onboarding Flow

```typescript
// src/services/tenant-provisioning.service.ts

interface TenantProvisioningData {
  companyName: string;
  subdomain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  adminUser: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };
}

class TenantProvisioningService {
  /**
   * Create new tenant (company) with admin user
   */
  async provisionTenant(data: TenantProvisioningData): Promise<{
    company: Company;
    adminUser: User;
  }> {
    return db.transaction(async (trx) => {
      // 1. Validate subdomain availability
      const existingCompany = await trx('companies')
        .where({ subdomain: data.subdomain })
        .whereNull('deleted_at')
        .first();

      if (existingCompany) {
        throw new Error('Subdomain already taken');
      }

      // 2. Create company
      const [company] = await trx('companies')
        .insert({
          id: uuidv4(),
          name: data.companyName,
          subdomain: data.subdomain,
          plan: data.plan,
          status: 'trial',
          limits: this.getPlanLimits(data.plan),
          settings: this.getDefaultSettings(),
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');

      // 3. Create admin user
      const passwordHash = await bcrypt.hash(data.adminUser.password, 10);

      const [adminUser] = await trx('users')
        .insert({
          id: uuidv4(),
          company_id: company.id,
          email: data.adminUser.email,
          password_hash: passwordHash,
          first_name: data.adminUser.firstName,
          last_name: data.adminUser.lastName,
          role: UserRole.BUSINESS_OWNER,
          status: 'active',
          email_verified: false,
          token_version: 1,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');

      // 4. Create default team
      await trx('teams').insert({
        id: uuidv4(),
        company_id: company.id,
        name: 'Default Team',
        description: 'Default team for your organization',
        created_at: new Date(),
        updated_at: new Date()
      });

      // 5. Send welcome email
      await this.sendWelcomeEmail(adminUser, company);

      // 6. Initialize sample data (optional)
      if (data.plan === 'trial') {
        await this.createSampleData(trx, company.id, adminUser.id);
      }

      return { company, adminUser };
    });
  }

  /**
   * Get plan limits
   */
  private getPlanLimits(plan: string): any {
    const limits = {
      starter: {
        maxUsers: 10,
        maxObjectives: 100,
        maxStorageGb: 5
      },
      professional: {
        maxUsers: 50,
        maxObjectives: 500,
        maxStorageGb: 25
      },
      enterprise: {
        maxUsers: -1,  // Unlimited
        maxObjectives: -1,
        maxStorageGb: 100
      }
    };

    return limits[plan] || limits.starter;
  }

  /**
   * Get default company settings
   */
  private getDefaultSettings(): any {
    return {
      branding: {
        primaryColor: '#667eea',
        logo: null
      },
      notifications: {
        emailEnabled: true,
        slackEnabled: false
      },
      features: {
        aiEnabled: true,
        assessmentsEnabled: true,
        cascadeEnabled: true
      }
    };
  }

  /**
   * Create sample data for trial
   */
  private async createSampleData(
    trx: Knex.Transaction,
    companyId: string,
    userId: string
  ): Promise<void> {
    // Create sample objective
    const [objective] = await trx('objectives').insert({
      id: uuidv4(),
      company_id: companyId,
      owner_id: userId,
      title: 'Sample Objective: Increase Revenue',
      description: 'This is a sample objective to help you get started',
      start_date: new Date(),
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      progress: 0,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }).returning('*');

    // Create sample goals
    await trx('goals').insert([
      {
        id: uuidv4(),
        company_id: companyId,
        objective_id: objective.id,
        owner_id: userId,
        title: 'Improve conversion rate by 15%',
        progress: 0,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        company_id: companyId,
        objective_id: objective.id,
        owner_id: userId,
        title: 'Launch 3 new products',
        progress: 0,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  }

  /**
   * Decommission tenant (soft delete)
   */
  async decommissionTenant(companyId: string): Promise<void> {
    await db.transaction(async (trx) => {
      const now = new Date();

      // Soft delete company
      await trx('companies')
        .where({ id: companyId })
        .update({
          status: 'cancelled',
          deleted_at: now,
          updated_at: now
        });

      // Soft delete all users
      await trx('users')
        .where({ company_id: companyId })
        .update({ deleted_at: now, updated_at: now });

      // Soft delete all data
      await trx('objectives')
        .where({ company_id: companyId })
        .update({ deleted_at: now, updated_at: now });

      await trx('goals')
        .where({ company_id: companyId })
        .update({ deleted_at: now, updated_at: now });

      await trx('tasks')
        .where({ company_id: companyId })
        .update({ deleted_at: now, updated_at: now });

      await trx('assessments')
        .where({ company_id: companyId })
        .update({ deleted_at: now, updated_at: now });
    });
  }
}

export default new TenantProvisioningService();
```

---

## Performance Optimization

### Indexing Strategy for Multi-Tenancy

```sql
-- Compound indexes with company_id as leading column
CREATE INDEX idx_users_company_role ON users(company_id, role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_company_status ON users(company_id, status) WHERE deleted_at IS NULL;

CREATE INDEX idx_objectives_company_owner ON objectives(company_id, owner_id, deleted_at);
CREATE INDEX idx_objectives_company_status ON objectives(company_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_objectives_company_dates ON objectives(company_id, start_date, end_date) WHERE deleted_at IS NULL;

CREATE INDEX idx_goals_company_objective ON goals(company_id, objective_id, deleted_at);
CREATE INDEX idx_goals_company_status ON goals(company_id, status) WHERE deleted_at IS NULL;

CREATE INDEX idx_tasks_company_goal ON tasks(company_id, goal_id, deleted_at);
CREATE INDEX idx_tasks_company_owner ON tasks(company_id, owner_id, deleted_at);

CREATE INDEX idx_assessments_company_user ON assessments(company_id, user_id, deleted_at);
CREATE INDEX idx_assessments_company_type ON assessments(company_id, assessment_type) WHERE deleted_at IS NULL;

-- Partial indexes for common queries
CREATE INDEX idx_objectives_active ON objectives(company_id, owner_id)
  WHERE status = 'active' AND deleted_at IS NULL;

CREATE INDEX idx_users_active ON users(company_id, role)
  WHERE status = 'active' AND deleted_at IS NULL;
```

### Query Optimization

```typescript
// src/services/performance.service.ts

/**
 * Batch load related data to avoid N+1 queries
 */
class PerformanceService {
  /**
   * Load objectives with related data efficiently
   */
  async loadObjectivesWithRelations(
    companyId: string,
    objectiveIds: string[]
  ): Promise<Map<string, ObjectiveWithRelations>> {
    // Single query to load all objectives
    const objectives = await db('objectives')
      .where({ company_id: companyId })
      .whereIn('id', objectiveIds)
      .where({ deleted_at: null })
      .select('*');

    // Single query to load all goals
    const goals = await db('goals')
      .where({ company_id: companyId })
      .whereIn('objective_id', objectiveIds)
      .where({ deleted_at: null })
      .select('*');

    // Single query to load all owners
    const ownerIds = [...new Set(objectives.map(o => o.owner_id))];
    const owners = await db('users')
      .where({ company_id: companyId })
      .whereIn('id', ownerIds)
      .where({ deleted_at: null })
      .select('id', 'first_name', 'last_name', 'email');

    // Map data
    const ownerMap = new Map(owners.map(o => [o.id, o]));
    const goalsMap = new Map<string, Goal[]>();

    goals.forEach(goal => {
      const list = goalsMap.get(goal.objective_id) || [];
      list.push(goal);
      goalsMap.set(goal.objective_id, list);
    });

    // Combine
    const result = new Map<string, ObjectiveWithRelations>();

    objectives.forEach(objective => {
      result.set(objective.id, {
        ...objective,
        owner: ownerMap.get(objective.owner_id),
        goals: goalsMap.get(objective.id) || []
      });
    });

    return result;
  }

  /**
   * Use database views for complex queries
   */
  async getObjectivesSummaryView(companyId: string): Promise<any[]> {
    // Pre-computed view for performance
    return db('objectives_summary_view')
      .where({ company_id: companyId })
      .select('*');
  }
}

// Database view
/*
CREATE VIEW objectives_summary_view AS
SELECT
  o.id,
  o.company_id,
  o.title,
  o.progress,
  o.status,
  o.start_date,
  o.end_date,
  u.first_name || ' ' || u.last_name as owner_name,
  COUNT(DISTINCT g.id) as goals_count,
  COUNT(DISTINCT t.id) as tasks_count,
  AVG(g.progress) as avg_goal_progress
FROM objectives o
LEFT JOIN users u ON u.id = o.owner_id AND u.deleted_at IS NULL
LEFT JOIN goals g ON g.objective_id = o.id AND g.deleted_at IS NULL
LEFT JOIN tasks t ON t.goal_id = g.id AND t.deleted_at IS NULL
WHERE o.deleted_at IS NULL
GROUP BY o.id, o.company_id, o.title, o.progress, o.status, o.start_date, o.end_date, u.first_name, u.last_name;
*/

export default new PerformanceService();
```

### Caching Strategy

```typescript
// src/services/tenant-cache.service.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

class TenantCacheService {
  /**
   * Cache tenant data
   */
  async getTenantData(companyId: string): Promise<TenantContext | null> {
    const cacheKey = `tenant:${companyId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Load from database
    const company = await getCompanyById(companyId);

    if (!company) {
      return null;
    }

    const tenantData: TenantContext = {
      companyId: company.id,
      companyName: company.name,
      companyPlan: company.plan,
      companyStatus: company.status,
      limits: company.limits
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(tenantData));

    return tenantData;
  }

  /**
   * Invalidate tenant cache
   */
  async invalidateTenant(companyId: string): Promise<void> {
    await redis.del(`tenant:${companyId}`);
  }

  /**
   * Cache query results per tenant
   */
  async cacheQuery<T>(
    companyId: string,
    queryKey: string,
    ttl: number,
    queryFn: () => Promise<T>
  ): Promise<T> {
    const cacheKey = `tenant:${companyId}:${queryKey}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const result = await queryFn();
    await redis.setex(cacheKey, ttl, JSON.stringify(result));

    return result;
  }
}

export default new TenantCacheService();
```

---

## Monitoring & Compliance

### Tenant Activity Monitoring

```typescript
// src/services/tenant-monitoring.service.ts

class TenantMonitoringService {
  /**
   * Track tenant usage metrics
   */
  async trackUsage(companyId: string, metric: string, value: number): Promise<void> {
    await db('tenant_usage_metrics').insert({
      id: uuidv4(),
      company_id: companyId,
      metric_name: metric,
      metric_value: value,
      timestamp: new Date()
    });
  }

  /**
   * Get tenant activity summary
   */
  async getActivitySummary(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<TenantActivitySummary> {
    const [apiCalls, activeUsers, dataCreated] = await Promise.all([
      // API calls
      db('audit_logs')
        .where({ company_id: companyId })
        .whereBetween('timestamp', [startDate, endDate])
        .count('* as count')
        .first(),

      // Active users
      db('users')
        .where({ company_id: companyId, status: 'active', deleted_at: null })
        .count('* as count')
        .first(),

      // Data created
      db('objectives')
        .where({ company_id: companyId })
        .whereBetween('created_at', [startDate, endDate])
        .count('* as count')
        .first()
    ]);

    return {
      apiCalls: parseInt(apiCalls.count),
      activeUsers: parseInt(activeUsers.count),
      dataCreated: parseInt(dataCreated.count)
    };
  }

  /**
   * Check for suspicious cross-tenant access attempts
   */
  async detectAnomalies(companyId: string): Promise<Anomaly[]> {
    // Find denied cross-tenant access attempts
    const denials = await db('audit_logs')
      .where({
        company_id: companyId,
        access_granted: false
      })
      .where('reason', 'like', '%cross-tenant%')
      .where('timestamp', '>', db.raw("NOW() - INTERVAL '24 hours'"))
      .select('*');

    return denials.map(denial => ({
      type: 'cross_tenant_access_attempt',
      userId: denial.user_id,
      timestamp: denial.timestamp,
      details: denial
    }));
  }
}

export default new TenantMonitoringService();
```

### Compliance & Data Isolation Audit

```typescript
// src/services/compliance.service.ts

class ComplianceService {
  /**
   * Audit data isolation integrity
   */
  async auditDataIsolation(): Promise<IsolationAuditReport> {
    const issues: IsolationIssue[] = [];

    // Check for missing company_id
    const tablesWithCompanyId = [
      'users',
      'objectives',
      'goals',
      'tasks',
      'assessments'
    ];

    for (const table of tablesWithCompanyId) {
      const missing = await db(table)
        .whereNull('company_id')
        .count('* as count')
        .first();

      if (parseInt(missing.count) > 0) {
        issues.push({
          severity: 'critical',
          table,
          issue: 'missing_company_id',
          count: parseInt(missing.count)
        });
      }
    }

    // Check for orphaned records (company doesn't exist)
    for (const table of tablesWithCompanyId) {
      const orphaned = await db(table)
        .leftJoin('companies', `${table}.company_id`, 'companies.id')
        .whereNull('companies.id')
        .count(`${table}.id as count`)
        .first();

      if (parseInt(orphaned.count) > 0) {
        issues.push({
          severity: 'high',
          table,
          issue: 'orphaned_records',
          count: parseInt(orphaned.count)
        });
      }
    }

    // Check for cross-tenant references
    const crossTenantGoals = await db('goals')
      .join('objectives', 'goals.objective_id', 'objectives.id')
      .where(db.raw('goals.company_id != objectives.company_id'))
      .count('* as count')
      .first();

    if (parseInt(crossTenantGoals.count) > 0) {
      issues.push({
        severity: 'critical',
        table: 'goals',
        issue: 'cross_tenant_reference',
        count: parseInt(crossTenantGoals.count)
      });
    }

    return {
      timestamp: new Date(),
      issuesFound: issues.length,
      issues
    };
  }

  /**
   * Generate GDPR data export for tenant
   */
  async exportTenantData(companyId: string): Promise<any> {
    const [company, users, objectives, goals, tasks, assessments] = await Promise.all([
      db('companies').where({ id: companyId }).first(),
      db('users').where({ company_id: companyId }),
      db('objectives').where({ company_id: companyId }),
      db('goals').where({ company_id: companyId }),
      db('tasks').where({ company_id: companyId }),
      db('assessments').where({ company_id: companyId })
    ]);

    return {
      company,
      users,
      objectives,
      goals,
      tasks,
      assessments,
      exportedAt: new Date()
    };
  }
}

export default new ComplianceService();
```

---

## Backup & Recovery

### Tenant-Specific Backup

```typescript
// src/services/tenant-backup.service.ts

class TenantBackupService {
  /**
   * Create backup for specific tenant
   */
  async backupTenant(companyId: string): Promise<string> {
    const timestamp = new Date().toISOString();
    const backupPath = `backups/${companyId}/${timestamp}.json`;

    // Export all tenant data
    const data = await complianceService.exportTenantData(companyId);

    // Store in S3 or file system
    await this.storeBackup(backupPath, data);

    // Record backup
    await db('tenant_backups').insert({
      id: uuidv4(),
      company_id: companyId,
      backup_path: backupPath,
      created_at: new Date()
    });

    return backupPath;
  }

  /**
   * Restore tenant from backup
   */
  async restoreTenant(companyId: string, backupPath: string): Promise<void> {
    const data = await this.loadBackup(backupPath);

    await db.transaction(async (trx) => {
      // Clear existing data
      await trx('objectives').where({ company_id: companyId }).delete();
      await trx('goals').where({ company_id: companyId }).delete();
      await trx('tasks').where({ company_id: companyId }).delete();
      await trx('assessments').where({ company_id: companyId }).delete();

      // Restore data
      if (data.objectives.length) {
        await trx('objectives').insert(data.objectives);
      }
      if (data.goals.length) {
        await trx('goals').insert(data.goals);
      }
      if (data.tasks.length) {
        await trx('tasks').insert(data.tasks);
      }
      if (data.assessments.length) {
        await trx('assessments').insert(data.assessments);
      }
    });
  }

  private async storeBackup(path: string, data: any): Promise<void> {
    // Implementation depends on storage backend
    // Could use S3, GCS, or local file system
  }

  private async loadBackup(path: string): Promise<any> {
    // Implementation depends on storage backend
  }
}

export default new TenantBackupService();
```

---

## Summary

This Multi-Tenancy Security implementation provides:

✅ **Row-Level Isolation** with `company_id` on all tenant tables
✅ **Multiple Protection Layers**: Application, middleware, query wrapper, database RLS
✅ **Automatic Tenant Context** via AsyncLocalStorage
✅ **Cross-Tenant Protection** with validation at request, resource, and response levels
✅ **CONSULTANT Override** for platform administration
✅ **Performance Optimization** with proper indexing and caching
✅ **Tenant Provisioning** with automated setup and decommissioning
✅ **Monitoring & Compliance** with audit tools and GDPR export
✅ **Backup & Recovery** for individual tenants

### Security Guarantees

1. **Data Isolation**: Users can only access their company's data
2. **Automatic Filtering**: All queries include company_id by default
3. **Cross-Tenant Prevention**: Multiple validation layers prevent data leakage
4. **Referential Integrity**: Database constraints ensure tenant boundaries
5. **Audit Trail**: All access attempts logged for compliance

### Best Practices

- ✅ Always include `company_id` in table definitions
- ✅ Use compound indexes with `company_id` as leading column
- ✅ Never trust client-provided `company_id` values
- ✅ Validate all foreign key references within tenant boundary
- ✅ Use tenant context middleware on all routes
- ✅ Log cross-tenant access attempts
- ✅ Regular data isolation audits
- ✅ Per-tenant backup and recovery procedures

---

**Document Version**: 1.0.0
**Last Updated**: October 27, 2025
**Status**: Production Ready
**Related Documents**:
- [JWT_SECURITY_DESIGN.md](./JWT_SECURITY_DESIGN.md) - Authentication
- [RBAC_IMPLEMENTATION_GUIDE.md](./RBAC_IMPLEMENTATION_GUIDE.md) - Authorization
- [DATA_MODELS_VALIDATION.md](./DATA_MODELS_VALIDATION.md) - Data models
- [THREAT_MODEL_MITIGATIONS.md](./THREAT_MODEL_MITIGATIONS.md) - Coming next
