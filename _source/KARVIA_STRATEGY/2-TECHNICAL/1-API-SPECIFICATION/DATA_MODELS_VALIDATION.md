# KARVIA Pro API - Data Models & Validation Guide

## 📋 Document Information

**Version:** 1.0.0
**Date:** October 27, 2025
**API Version:** 1.0.0
**Status:** Production Ready

---

## 🎯 Overview

This document provides comprehensive documentation of all data models used in the KARVIA Pro API, including validation rules, constraints, relationships, and business logic. It serves as the single source of truth for data structures across the platform.

### Document Scope

- **Core Entity Models** - User, Company, Team, Objective, Goal, Task
- **Assessment Models** - Assessment, Template, Question, Response
- **AI/Analytics Models** - AI Suggestions, Analytics Data, Forecasts
- **System Models** - Invitation, Notification, File Upload
- **Validation Rules** - Field constraints, business rules, data integrity
- **Relationships** - Entity relationships and cascading behavior

---

## 📊 Entity Relationship Overview

```
Company
  ├── Users (1:N)
  │   ├── Teams (N:M via TeamMember)
  │   ├── Assessments (1:N)
  │   ├── Objectives (Owner)
  │   ├── Goals (1:N)
  │   └── Tasks (Assignee)
  │
  ├── Teams (1:N)
  │   ├── Members (N:M with Users)
  │   ├── Objectives (1:N)
  │   └── Departments (Organizational Structure)
  │
  ├── Objectives (1:N)
  │   ├── Key Results (1:N)
  │   ├── Parent/Child Objectives (Self-referencing)
  │   ├── Goals (Alignment) (N:M)
  │   └── Progress History (1:N)
  │
  ├── Assessment Templates (1:N)
  │   └── Questions (1:N)
  │       └── Categories (1:N)
  │
  └── Invitations (1:N)
      └── Target User (Future relationship)

Goals (1:N per User)
  ├── Tasks (1:N)
  │   └── Subtasks (1:N)
  └── Key Results (N:M alignment)

Assessments (1:N per User)
  ├── Responses (1:N)
  ├── Scores (Calculated)
  └── AI Suggestions (1:N)
      └── Objectives (Generated)
```

---

## 📦 Core Entity Models

## 1. User Model

### Schema Definition

```typescript
interface User {
  // Identity
  id: string;                    // UUID, Primary Key
  email: string;                 // Unique, Indexed
  password_hash: string;         // bcrypt hash

  // Profile
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;

  // Role & Access
  role: UserRole;                // Enum: CONSULTANT | BUSINESS_OWNER | EXECUTIVE | MANAGER | EMPLOYEE
  company_id: string;            // Foreign Key → Company
  department_id?: string;        // Foreign Key → Department

  // Status
  status: UserStatus;            // Enum: active | inactive | pending_invite | suspended
  email_verified: boolean;
  onboarding_completed: boolean;

  // Preferences
  timezone: string;              // IANA timezone
  language: string;              // ISO 639-1 code
  date_format: DateFormat;       // MM/DD/YYYY | DD/MM/YYYY | YYYY-MM-DD
  notification_preferences: NotificationPreferences;

  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  deleted_at?: Date;             // Soft delete
}

enum UserRole {
  CONSULTANT = 'CONSULTANT',           // Full platform access
  BUSINESS_OWNER = 'BUSINESS_OWNER',   // Company admin
  EXECUTIVE = 'EXECUTIVE',             // High-level access
  MANAGER = 'MANAGER',                 // Team management
  EMPLOYEE = 'EMPLOYEE'                // Basic access
}

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_INVITE = 'pending_invite',
  SUSPENDED = 'suspended'
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  digest_frequency: 'daily' | 'weekly' | 'never';
  notify_on_assignment: boolean;
  notify_on_mention: boolean;
  notify_on_deadline: boolean;
}
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| email | Valid email format, unique | "Invalid email format" / "Email already exists" |
| email | Max length: 255 | "Email too long" |
| password | Min 8 chars, 1 uppercase, 1 lowercase, 1 number | "Password must meet complexity requirements" |
| first_name | Required, 1-100 chars | "First name is required" |
| last_name | Required, 1-100 chars | "Last name is required" |
| role | Must be valid enum value | "Invalid user role" |
| company_id | Must reference existing company | "Company not found" |
| timezone | Valid IANA timezone | "Invalid timezone" |

### Business Rules

1. **Email Uniqueness**: Email must be unique across the entire platform (global constraint)
2. **Role Hierarchy**:
   - CONSULTANT can access all companies
   - BUSINESS_OWNER can manage their company
   - EXECUTIVE/MANAGER can view company data
   - EMPLOYEE has limited access
3. **Soft Delete**: Users are never hard-deleted, only marked with `deleted_at`
4. **Company Association**: Every user (except CONSULTANT) must belong to a company
5. **Email Verification**: Users must verify email before full access

### Database Constraints

```sql
-- PostgreSQL Schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role user_role NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  status user_status DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  timezone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(5) DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  deleted_at TIMESTAMP,

  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_company ON users(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role);
```

---

## 2. Company Model

### Schema Definition

```typescript
interface Company {
  // Identity
  id: string;                    // UUID, Primary Key
  name: string;
  slug: string;                  // URL-friendly, unique

  // Details
  industry: Industry;
  company_size: CompanySize;
  country: string;               // ISO 3166-1 alpha-2
  timezone: string;
  logo_url?: string;

  // Subscription
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  trial_ends_at?: Date;
  subscription_expires_at?: Date;

  // Features
  features: CompanyFeatures;

  // SSI Scores
  ssi_score?: number;            // 0-100
  ssi_history: SSIHistory[];

  // Settings
  settings: CompanySettings;

  // Onboarding
  onboarding_status: OnboardingStatus;
  onboarding_step: number;       // Current step 1-5

  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

enum Industry {
  CONSULTING = 'consulting',
  MARKETING = 'marketing',
  IT_SERVICES = 'it_services',
  PROFESSIONAL_SERVICES = 'professional_services',
  HEALTHCARE = 'healthcare',
  OTHER = 'other'
}

enum CompanySize {
  SMALL = 'small',       // 1-50
  MEDIUM = 'medium',     // 51-200
  LARGE = 'large'        // 201+
}

enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRIAL = 'trial',
  SUSPENDED = 'suspended'
}

interface CompanyFeatures {
  ibrain_enabled: boolean;       // AI features
  analytics_enabled: boolean;
  cascade_enabled: boolean;
  invitations_enabled: boolean;
  max_users: number;
  max_teams: number;
  max_objectives: number;
}

interface CompanySettings {
  work_week_start: string;       // monday, tuesday, etc.
  fiscal_year_start: string;     // MM-DD
  default_objective_duration: number; // days
  require_approval: boolean;
  allow_public_profiles: boolean;
}
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| name | Required, 2-100 chars, unique | "Company name required" |
| slug | Lowercase, alphanumeric + hyphens, unique | "Invalid slug format" |
| industry | Valid enum value | "Invalid industry" |
| company_size | Valid enum value | "Invalid company size" |
| ssi_score | 0-100 if provided | "SSI score must be between 0 and 100" |
| subscription_plan | Valid enum value | "Invalid subscription plan" |

### Business Rules

1. **Slug Generation**: Auto-generated from name, must be unique
2. **Trial Period**: New companies get 14-day trial
3. **Feature Gates**: Features locked based on subscription plan
4. **SSI Calculation**: Recalculated when assessments complete
5. **User Limits**: Enforced based on subscription plan
6. **Soft Delete**: Company deletion cascades to related entities (soft delete)

---

## 3. Objective Model

### Schema Definition

```typescript
interface Objective {
  // Identity
  id: string;                    // UUID
  title: string;
  description?: string;

  // Ownership
  owner_id: string;              // FK → User
  team_id?: string;              // FK → Team
  company_id: string;            // FK → Company

  // Classification
  type: ObjectiveType;           // company | team | individual
  category?: string;
  tags: string[];

  // Timeline
  start_date: Date;
  end_date: Date;
  quarter?: string;              // Q1, Q2, Q3, Q4
  fiscal_year?: number;

  // Status & Progress
  status: ObjectiveStatus;
  progress: number;              // 0-100, calculated from KRs
  health: HealthStatus;          // on_track | at_risk | off_track

  // Key Results
  key_results: KeyResult[];

  // Cascade Relationships
  parent_id?: string;            // FK → Objective (self-reference)
  cascade_weight?: number;       // 0-100, contribution to parent

  // Metadata
  priority: Priority;            // high | medium | low
  visibility: Visibility;        // public | private | team
  is_stretch_goal: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  deleted_at?: Date;
}

enum ObjectiveType {
  COMPANY = 'company',
  TEAM = 'team',
  INDIVIDUAL = 'individual'
}

enum ObjectiveStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  CANCELLED = 'cancelled'
}

enum HealthStatus {
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  OFF_TRACK = 'off_track'
}

interface KeyResult {
  id: string;
  title: string;
  description?: string;
  metric_type: MetricType;       // number | percentage | currency | boolean
  start_value: number;
  current_value: number;
  target_value: number;
  unit?: string;                 // e.g., "users", "revenue", "%"
  progress: number;              // 0-100
  weight: number;                // 0-100, contribution to objective
  owner_id?: string;
  status: KRStatus;
  created_at: Date;
  updated_at: Date;
}

enum MetricType {
  NUMBER = 'number',
  PERCENTAGE = 'percentage',
  CURRENCY = 'currency',
  BOOLEAN = 'boolean'
}
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| title | Required, 5-200 chars | "Objective title required (5-200 characters)" |
| description | Max 2000 chars | "Description too long" |
| start_date | Required, valid date | "Invalid start date" |
| end_date | Required, must be after start_date | "End date must be after start date" |
| end_date | Max 1 year from start_date | "Objective duration exceeds 1 year" |
| progress | 0-100 | "Progress must be between 0 and 100" |
| key_results | Min 1, Max 5 | "Objective must have 1-5 key results" |
| cascade_weight | 0-100 if parent exists | "Cascade weight must be between 0 and 100" |

### Business Rules

1. **Progress Calculation**:
   ```typescript
   progress = Σ(kr.progress * kr.weight) / Σ(kr.weight)
   ```

2. **Health Status Auto-Calculation**:
   - `on_track`: progress >= expected_progress (based on time elapsed)
   - `at_risk`: progress < expected_progress by 10-25%
   - `off_track`: progress < expected_progress by >25%

3. **Cascade Validation**:
   - Cannot create circular dependencies
   - Child objectives must have end_date <= parent.end_date
   - Sum of cascade_weight for all children should = 100

4. **Key Result Constraints**:
   - At least 1 KR required for objective to be active
   - KR weights must sum to 100
   - KR owner must be in the same team/company

5. **Status Transitions**:
   ```
   draft → active → completed
   draft → active → archived
   draft → active → cancelled
   ```

### Database Constraints

```sql
CREATE TABLE objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  type objective_type NOT NULL,
  category VARCHAR(50),
  tags TEXT[],
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  quarter VARCHAR(2),
  fiscal_year INTEGER,
  status objective_status DEFAULT 'draft',
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  health health_status,
  parent_id UUID REFERENCES objectives(id) ON DELETE SET NULL,
  cascade_weight DECIMAL(5,2) CHECK (cascade_weight >= 0 AND cascade_weight <= 100),
  priority priority_level DEFAULT 'medium',
  visibility visibility_level DEFAULT 'team',
  is_stretch_goal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  deleted_at TIMESTAMP,

  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_duration CHECK (end_date <= start_date + INTERVAL '1 year')
);

-- Prevent circular cascades
CREATE OR REPLACE FUNCTION prevent_objective_cycles()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    IF EXISTS (
      WITH RECURSIVE cascade_tree AS (
        SELECT id, parent_id FROM objectives WHERE id = NEW.parent_id
        UNION ALL
        SELECT o.id, o.parent_id
        FROM objectives o
        INNER JOIN cascade_tree ct ON o.id = ct.parent_id
      )
      SELECT 1 FROM cascade_tree WHERE id = NEW.id
    ) THEN
      RAISE EXCEPTION 'Circular cascade dependency detected';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_objective_cycles
  BEFORE INSERT OR UPDATE ON objectives
  FOR EACH ROW
  EXECUTE FUNCTION prevent_objective_cycles();
```

---

## 4. Assessment Model

### Schema Definition

```typescript
interface Assessment {
  // Identity
  id: string;
  user_id: string;               // FK → User
  company_id: string;            // FK → Company
  template_id: string;           // FK → AssessmentTemplate

  // Status
  status: AssessmentStatus;
  progress: number;              // 0-100

  // Scores
  category_scores: CategoryScore[];
  overall_score: number;         // 0-100
  ssi_score: number;             // Strategic Success Indicator 0-100

  // Timing
  started_at: Date;
  submitted_at?: Date;
  calculated_at?: Date;

  // Responses
  responses: AssessmentResponse[];
  total_questions: number;
  answered_questions: number;

  // Metadata
  version: number;               // Template version
  invitation_token?: string;     // If invited

  created_at: Date;
  updated_at: Date;
}

enum AssessmentStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  CALCULATED = 'calculated',
  EXPIRED = 'expired'
}

interface CategoryScore {
  category_id: string;
  category_name: string;
  score: number;                 // 0-100
  max_score: number;
  weight: number;                // Contribution to overall
  questions_answered: number;
  total_questions: number;
}

interface AssessmentResponse {
  question_id: string;
  question_text: string;
  category_id: string;
  response_value: number | string | boolean;
  score: number;
  max_score: number;
  answered_at: Date;
}
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| user_id | Required, valid user | "User not found" |
| template_id | Required, valid template | "Assessment template not found" |
| status | Valid enum value | "Invalid assessment status" |
| overall_score | 0-100 if calculated | "Invalid score range" |
| responses | Each response must match question type | "Invalid response format" |

### Business Rules

1. **Score Calculation**:
   ```typescript
   overall_score = Σ(category_score * category_weight) / Σ(category_weight)
   ```

2. **SSI Score Calculation**:
   ```typescript
   ssi_score = (overall_score * 0.4) +
               (completion_rate * 0.2) +
               (consistency_factor * 0.2) +
               (quality_factor * 0.2)
   ```

3. **Status Transitions**:
   - `not_started` → `in_progress` (first response)
   - `in_progress` → `submitted` (all questions answered)
   - `submitted` → `calculated` (scores computed)
   - Any → `expired` (if >30 days in progress)

4. **Completion Requirements**:
   - All required questions must be answered
   - Minimum 80% of optional questions recommended
   - Cannot submit with validation errors

5. **Versioning**:
   - Assessment captures template version at creation
   - Scores remain valid even if template changes
   - Historical comparisons use same template version

---

## 5. Goal & Task Models

### Goal Schema

```typescript
interface Goal {
  id: string;
  user_id: string;               // Owner
  title: string;
  description?: string;

  // Alignment
  key_result_id?: string;        // FK → KeyResult
  objective_id?: string;         // FK → Objective

  // Type & Timeline
  type: GoalType;                // quarterly | weekly | milestone
  start_date: Date;
  due_date: Date;

  // Status
  status: GoalStatus;
  progress: number;              // 0-100
  completion_date?: Date;

  // Tasks
  tasks: Task[];
  completed_tasks: number;
  total_tasks: number;

  // Metadata
  priority: Priority;
  tags: string[];

  created_at: Date;
  updated_at: Date;
}

interface Task {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  assignee_id: string;           // FK → User

  // Status
  status: TaskStatus;
  completed: boolean;
  completed_at?: Date;
  completed_by?: string;

  // Timeline
  due_date?: Date;
  estimated_hours?: number;
  actual_hours?: number;

  // Hierarchy
  parent_task_id?: string;       // Subtasks
  subtasks: Task[];

  // Dependencies
  depends_on: string[];          // Task IDs
  blocks: string[];              // Task IDs

  // Metadata
  priority: Priority;
  tags: string[];
  checklist: ChecklistItem[];

  created_at: Date;
  updated_at: Date;
}
```

### Validation Rules

**Goals:**
| Field | Rule | Error Message |
|-------|------|---------------|
| title | Required, 3-200 chars | "Goal title required" |
| due_date | Must be after start_date | "Due date must be after start date" |
| progress | 0-100 | "Progress must be between 0 and 100" |
| type | Valid enum value | "Invalid goal type" |

**Tasks:**
| Field | Rule | Error Message |
|-------|------|---------------|
| title | Required, 3-200 chars | "Task title required" |
| assignee_id | Valid user in company | "Assignee not found" |
| depends_on | No circular dependencies | "Circular task dependency detected" |
| due_date | If goal has due_date, task.due_date <= goal.due_date | "Task due date exceeds goal due date" |

---

## 🔐 Validation Patterns

### Common Validation Rules

#### Email Validation
```regex
^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
```

#### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Optional: 1 special character

```typescript
function validatePassword(password: string): ValidationResult {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

#### Date Validation
```typescript
function validateDateRange(start: Date, end: Date, maxDuration?: number): boolean {
  if (end <= start) return false;
  if (maxDuration) {
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= maxDuration;
  }
  return true;
}
```

#### Slug Generation
```typescript
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

---

## 📝 Request Validation Examples

### Create Objective Validation

```typescript
const createObjectiveSchema = {
  title: {
    type: 'string',
    required: true,
    minLength: 5,
    maxLength: 200,
    message: 'Title must be between 5 and 200 characters'
  },
  description: {
    type: 'string',
    required: false,
    maxLength: 2000
  },
  start_date: {
    type: 'date',
    required: true,
    validate: (value) => new Date(value) >= new Date()
  },
  end_date: {
    type: 'date',
    required: true,
    validate: (value, data) => new Date(value) > new Date(data.start_date)
  },
  key_results: {
    type: 'array',
    required: true,
    minLength: 1,
    maxLength: 5,
    items: {
      title: { type: 'string', required: true, minLength: 3 },
      target_value: { type: 'number', required: true },
      metric_type: {
        type: 'string',
        required: true,
        enum: ['number', 'percentage', 'currency', 'boolean']
      }
    }
  }
};
```

### Update Progress Validation

```typescript
const updateProgressSchema = {
  key_result_id: {
    type: 'string',
    required: true,
    format: 'uuid'
  },
  current_value: {
    type: 'number',
    required: true,
    validate: (value, context) => {
      const kr = context.keyResult;
      if (kr.metric_type === 'percentage') {
        return value >= 0 && value <= 100;
      }
      return true;
    }
  },
  note: {
    type: 'string',
    required: false,
    maxLength: 500
  }
};
```

---

## 🔄 Data Integrity Rules

### Cascade Delete Behavior

| Parent Entity | Child Entity | Behavior |
|---------------|--------------|----------|
| Company | Users | CASCADE (Soft Delete) |
| Company | Teams | CASCADE (Soft Delete) |
| Company | Objectives | CASCADE (Soft Delete) |
| Team | Objectives | SET NULL |
| User (Owner) | Objectives | PREVENT (Transfer first) |
| Objective | Key Results | CASCADE |
| Objective (Parent) | Objective (Child) | SET NULL |
| Goal | Tasks | CASCADE |

### Referential Integrity

1. **Foreign Key Constraints**: All relationships enforced at database level
2. **Orphan Prevention**: Cannot delete entity if children exist (unless cascading)
3. **Soft Delete**: Most entities use `deleted_at` timestamp
4. **Audit Trail**: All changes tracked in audit logs

---

## 📊 Performance Considerations

### Indexing Strategy

```sql
-- High-frequency queries
CREATE INDEX idx_objectives_owner ON objectives(owner_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_objectives_team ON objectives(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_objectives_status ON objectives(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_objectives_dates ON objectives(start_date, end_date);

-- Search optimization
CREATE INDEX idx_objectives_search ON objectives
  USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Cascade queries
CREATE INDEX idx_objectives_parent ON objectives(parent_id) WHERE deleted_at IS NULL;

-- Composite indexes
CREATE INDEX idx_goals_user_status ON goals(user_id, status) WHERE deleted_at IS NULL;
```

### Query Optimization

1. **Pagination**: Always use `LIMIT` and `OFFSET` for list queries
2. **Selective Loading**: Only fetch required fields
3. **Batch Operations**: Use transactions for multiple related operations
4. **Caching**: Cache frequently accessed reference data

---

## ✅ Validation Summary Checklist

### Before Accepting Data
- [ ] All required fields present
- [ ] Data types match schema
- [ ] String lengths within limits
- [ ] Numeric values within ranges
- [ ] Enum values are valid
- [ ] Date ranges are logical
- [ ] Foreign keys reference existing entities
- [ ] Business rules satisfied
- [ ] No circular dependencies
- [ ] User has permission for operation

### Before Returning Data
- [ ] Sensitive fields removed (password_hash, etc.)
- [ ] Calculated fields populated
- [ ] Relationships loaded if requested
- [ ] Timestamps formatted consistently
- [ ] Null values handled appropriately
- [ ] Response matches API specification

---

## 📚 Additional Resources

- **OpenAPI Specification**: See `openapi.yaml` for complete API contract
- **Database Migrations**: See `/migrations` for schema evolution
- **Test Fixtures**: See `/tests/fixtures` for example data
- **API Test Plan**: See `API_TEST_PLAN.md` for validation test cases

---

**Document Version**: 1.0.0
**Last Updated**: October 27, 2025
**Next Review**: November 27, 2025
**Maintained By**: API Development Team
