# KARVIA MONGODB DATABASE SCHEMA

<!-- @GENOME T2-ARC-011 | ACTIVE | 2026-04-05 | parent:T1-KRV-001 | auto:/coding | linked:/strategy -->

> **Part of KARVIA Engine** - See [KARVIA_ENGINE_VISION.md](../../1-VISION/KARVIA_ENGINE_VISION.md) for engine overview.

**Version**: 1.0.0
**Created**: 2025-10-24
**Last Updated**: 2025-10-24
**Database**: MongoDB 7.x with Mongoose ORM
**Status**: Production Ready

---

## 🎯 PURPOSE

Complete database schema documentation for KARVIA platform using MongoDB with Mongoose ORM. This document defines all collections, fields, relationships, indexes, and validation rules for the multi-tenant OKR management system.

---

## 📋 TABLE OF CONTENTS

1. [Database Architecture Overview](#database-architecture-overview)
2. [Core Collections](#core-collections)
3. [Assessment Collections](#assessment-collections)
4. [OKR Collections](#okr-collections)
5. [Team Management Collections](#team-management-collections)
6. [AI/Suggestion Collections](#aisuggestion-collections)
7. [Indexes Strategy](#indexes-strategy)
8. [Multi-Tenancy Design](#multi-tenancy-design)
9. [Data Relationships](#data-relationships)
10. [Migration Strategy](#migration-strategy)

---

## 🏗️ DATABASE ARCHITECTURE OVERVIEW

### Technology Stack
- **Primary Database**: MongoDB 7.x
- **ORM**: Mongoose 7.5.0
- **Cache Layer**: Redis (optional, for sessions)
- **Connection Pooling**: Max 10, Min 2 connections

### Database Configuration
```javascript
{
  // Connection settings
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,

  // Retry settings
  retryWrites: true,
  retryReads: true,

  // Production optimizations
  autoIndex: false,  // Indexes created manually
  autoCreate: false  // Collections created via migrations
}
```

### Multi-Tenancy Strategy
- **Row-Level Security**: Every document has `business_id` field
- **Data Isolation**: Queries automatically filtered by business context
- **Shared Collections**: All businesses share same collections
- **No Cross-Tenant Access**: Enforced at middleware level

---

## 📊 CORE COLLECTIONS

### 1. businesses
**Purpose**: Root tenant entity - represents client organizations

```javascript
{
  _id: ObjectId,

  // Basic Information
  name: String (required, max: 255),
  industry: Enum ['consulting', 'marketing', 'it_services', 'professional_services', 'healthcare', 'other'],
  size_category: Enum ['small', 'medium', 'large'],
  employee_count: Number (min: 1, max: 500),
  website: String,

  // Business Assessment Scores
  assessment_scores: {
    speed_score: Number (0-100, default: 0),
    strength_score: Number (0-100, default: 0),
    intelligence_score: Number (0-100, default: 0),
    overall_score: Number (0-100, default: 0)
  },

  // Subscription & Features
  subscription: {
    plan: Enum ['free', 'professional', 'enterprise'],
    status: Enum ['active', 'suspended', 'cancelled'],
    trial_ends_at: Date,
    current_period_end: Date
  },

  // LEGACY Feature Flags (DEPRECATED - use companies.feature_flags instead)
  feature_flags: {
    assessment_engine: Boolean (default: true), // DEPRECATED - use assessment_block
    ai_okr_generation: Boolean (default: false), // DEPRECATED - use ai_engine
    team_management: Boolean (default: true), // DEPRECATED - use iam_block
    advanced_analytics: Boolean (default: false), // DEPRECATED
    ibrain_enabled: Boolean (default: false) // DEPRECATED - moved to companies
  },

  // Configuration
  settings: {
    default_timezone: String (default: 'America/New_York'),
    fiscal_year_start: Number (1-12, default: 1),
    okr_cycle: Enum ['quarterly', 'yearly'],
    week_start_day: Number (0-6, default: 1)
  },

  // Metadata
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId (ref: 'users'),
  status: Enum ['active', 'inactive', 'suspended']
}
```

**Indexes**:
- `{ name: 1 }` - Business name search
- `{ created_at: -1 }` - Latest businesses
- `{ 'subscription.status': 1 }` - Active subscriptions

---

### 2. users
**Purpose**: System users with role-based access control

```javascript
{
  _id: ObjectId,

  // Business Association (LEGACY - maintained for backward compatibility)
  business_id: ObjectId (ref: 'businesses', index: true, optional),

  // Company Association (Block 2 - Modular IAM)
  companies: [{ // NEW - supports multi-company access
    company_id: ObjectId (ref: 'companies'),
    role: Enum ['OWNER', 'MANAGER', 'EMPLOYEE', 'CONSULTANT'],
    joined_at: Date,
    is_primary: Boolean (default: false)
  }],
  current_company_id: ObjectId (ref: 'companies', nullable), // Active company context

  // Authentication
  email: String (required, lowercase, unique globally),
  password_hash: String (required, min: 6),

  // User Information
  first_name: String (required, max: 100),
  last_name: String (required, max: 100),
  full_name: String (virtual: first_name + last_name),

  // Role & Permissions (Global role - can be overridden per company)
  role: Enum ['CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'EMPLOYEE', 'SUPER_ADMIN'],

  // Consultant Management (LEGACY - replaced by companies[] with CONSULTANT role)
  managed_businesses: [ObjectId] (ref: 'businesses', deprecated),

  // Organizational Hierarchy
  manager_id: ObjectId (ref: 'users'),
  reports_count: Number (default: 0),
  department: String,

  // Profile
  phone: String,
  avatar_url: String,
  position: String,
  bio: String (max: 500),

  // Preferences
  preferences: {
    notifications_enabled: Boolean (default: true),
    email_frequency: Enum ['immediate', 'daily', 'weekly'],
    theme: Enum ['light', 'dark', 'auto']
  },

  // Account Status
  is_active: Boolean (default: true),
  is_verified: Boolean (default: false),
  verification_token: String,
  password_reset_token: String,
  password_reset_expires: Date,

  // Activity Tracking
  last_login_at: Date,
  login_count: Number (default: 0),

  // Metadata
  created_at: Date,
  updated_at: Date,
  deleted_at: Date (soft delete)
}
```

**Indexes**:
- `{ email: 1 }` - Unique email lookup (global)
- `{ business_id: 1, email: 1 }` - LEGACY compound index (backward compatibility)
- `{ 'companies.company_id': 1 }` - NEW - Company membership queries
- `{ current_company_id: 1 }` - NEW - Active company context
- `{ business_id: 1, role: 1 }` - Role-based queries
- `{ manager_id: 1 }` - Hierarchy queries
- `{ business_id: 1, is_active: 1 }` - Active users per business

---

### 2a. companies (NEW - Block 2: Modular IAM)
**Purpose**: Company entities for multi-tenant IAM structure

```javascript
{
  _id: ObjectId,

  // Company Information
  name: String (required, unique, max: 255),
  industry: String (max: 100),
  size: Enum ['1-10', '11-50', '51-200', '201-500', '500+'],
  employee_count: Number (min: 1),
  website: String,

  // Business Architecture (from MVP_TECHNICAL_ARCHITECTURE_V5)
  archetype: String, // One of 16 business archetypes
  strategic_focus: [String], // 3-5 selections from 24 focus areas

  // Ownership
  owner_id: ObjectId (ref: 'users', required),

  // Subscription & Features (inherited from businesses model)
  subscription: {
    plan: Enum ['free', 'professional', 'enterprise'],
    status: Enum ['active', 'trial', 'suspended', 'cancelled'],
    trial_ends_at: Date,
    current_period_end: Date
  },

  // Feature Flags (Block-level enablement - aligns with MVP_TECHNICAL_ARCHITECTURE_V5.md)
  feature_flags: {
    iam_block: Boolean (default: true),             // Block 2: IAM (companies, teams, multi-user)
    assessment_block: Boolean (default: true),      // Block 3: Assessment System (SSI, 360, etc.)
    ai_engine: Boolean (default: false),            // Block 4: AI OKR Generation (GPT-4)
    progress_rollup: Boolean (default: true),       // Block 5: Automated Progress Aggregation
    bulk_ops: Boolean (default: true),              // Block 6: Bulk Invitations/Assessments
    permission_rules: Boolean (default: false),     // Block 7: Database-stored Permission Rules
    ibrain_enabled: Boolean (default: false)        // Post-MVP: iBrain Intelligence Layer
  },

  // Feature Flag Mapping (LEGACY to NEW)
  // This mapping documents the transition from old feature flags to block-based flags:
  // - businesses.feature_flags.assessment_engine → companies.feature_flags.assessment_block
  // - businesses.feature_flags.ai_okr_generation → companies.feature_flags.ai_engine
  // - businesses.feature_flags.team_management → companies.feature_flags.iam_block
  // - businesses.feature_flags.ibrain_enabled → companies.feature_flags.ibrain_enabled

  // Company Settings
  settings: {
    default_timezone: String (default: 'America/New_York'),
    fiscal_year_start: Number (1-12, default: 1),
    okr_cycle: Enum ['quarterly', 'yearly'],
    week_start_day: Number (0-6, default: 1)
  },

  // Assessment Scores (company-level aggregation)
  assessment_scores: {
    speed_score: Number (0-100, default: 0),
    strength_score: Number (0-100, default: 0),
    intelligence_score: Number (0-100, default: 0),
    overall_score: Number (0-100, default: 0)
  },

  // Metadata
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId (ref: 'users'),
  status: Enum ['active', 'inactive', 'suspended']
}
```

**Indexes**:
- `{ name: 1 }` - Unique company name
- `{ owner_id: 1 }` - Companies by owner
- `{ created_at: -1 }` - Latest companies
- `{ 'subscription.status': 1 }` - Active subscriptions
- `{ status: 1 }` - Active companies

**Relationship to businesses collection**:
- `companies` is the NEW multi-tenant structure (Block 2)
- `businesses` is LEGACY but maintained for backward compatibility
- When Block 2 (IAM) is enabled, use `companies`
- When Block 2 is disabled, fall back to `businesses`

---

## 📝 ASSESSMENT COLLECTIONS

### 3. assessment_templates
**Purpose**: Reusable assessment templates

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', index: true),

  // Template Information
  name: String (required, max: 255),
  description: String (max: 1000),
  category: Enum ['team', 'individual', 'business', 'project', 'department'],
  type: Enum ['ssi', 'custom', '360_review', 'self_assessment'],

  // Configuration
  is_global: Boolean (default: false, system templates),
  is_default: Boolean (default: false),
  total_questions: Number (min: 1, max: 100),
  passing_score: Number (0-100),

  // Question Categories
  sections: [{
    name: String,
    description: String,
    weight: Number (0-1),
    question_count: Number
  }],

  // Scoring Configuration
  scoring_method: Enum ['average', 'weighted', 'sum'],
  score_ranges: [{
    min: Number,
    max: Number,
    label: String,
    color: String
  }],

  // Usage Stats
  usage_count: Number (default: 0),
  last_used_at: Date,

  // Metadata
  created_by: ObjectId (ref: 'users'),
  created_at: Date,
  updated_at: Date,
  status: Enum ['active', 'archived']
}
```

**Indexes**:
- `{ business_id: 1, is_default: 1 }` - Default templates
- `{ is_global: 1 }` - System templates
- `{ business_id: 1, category: 1 }` - Templates by category

---

### 4. assessment_questions
**Purpose**: Question bank for assessments

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', nullable for global),
  template_id: ObjectId (ref: 'assessment_templates'),

  // Question Content
  question_text: String (required, max: 500),
  question_type: Enum ['multiple_choice', 'scale', 'yes_no', 'text', 'ranking'],
  category: Enum ['speed', 'strength', 'intelligence', 'leadership', 'teamwork', 'innovation'],

  // Options (for multiple choice/scale)
  options: [{
    value: String,
    label: String,
    score: Number
  }],

  // Scoring
  weight: Number (default: 1),
  max_score: Number (default: 10),
  is_required: Boolean (default: true),

  // Display Configuration
  order: Number,
  section: String,
  help_text: String,

  // Metadata
  is_global: Boolean (default: false),
  created_at: Date,
  updated_at: Date,
  status: Enum ['active', 'archived']
}
```

**Indexes**:
- `{ template_id: 1, order: 1 }` - Questions by template
- `{ business_id: 1, category: 1 }` - Questions by category
- `{ is_global: 1 }` - Global questions

---

### 5. assessments
**Purpose**: Assessment templates with dynamic dimensions (Block 3)

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', required, index: true),
  company_id: ObjectId (ref: 'companies', index: true), // NEW - Block 2 IAM

  // Assessment Information
  name: String (required, max: 255),
  description: String (max: 1000),
  assessment_type: Enum ['SSI', '360', 'Skills', 'Custom'],
  template_id: ObjectId (ref: 'assessment_templates'),

  // Dynamic Dimensions (NOT hardcoded to SSI)
  dimensions: [{ // Consultant-configurable
    name: String, // "Speed" | "Strength" | "Intelligence" | custom dimension
    category: String,
    weight: Number (0.0-1.0), // Consultant-adjustable weights
    description: String,
    questions: [ObjectId] (ref: 'assessment_questions')
  }],

  // Target Audience
  target_audience: Enum ['individual', 'team', 'org', 'role'],
  sent_to: [ObjectId] (ref: 'users'),
  completion_rate: Number (0-100),

  // Metadata
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId (ref: 'users')
}
```

**Indexes**:
- `{ business_id: 1, assessment_type: 1 }` - Assessments by type (LEGACY)
- `{ company_id: 1, assessment_type: 1 }` - Assessments by type (NEW - Block 2)
- `{ template_id: 1 }` - Assessments by template
- `{ business_id: 1, created_at: -1 }` - Recent assessments (LEGACY)
- `{ company_id: 1, created_at: -1 }` - Recent assessments (NEW - Block 2)

---

### 5a. assessment_results (NEW - Block 3: Dynamic Scoring)
**Purpose**: Individual assessment responses with per-dimension scores

```javascript
{
  _id: ObjectId,
  assessment_id: ObjectId (ref: 'assessments', required, index: true),
  user_id: ObjectId (ref: 'users', required, index: true),
  team_id: ObjectId (ref: 'teams'), // For team-level aggregation
  business_id: ObjectId (ref: 'businesses', index: true),
  company_id: ObjectId (ref: 'companies', index: true), // NEW - Block 2

  // Assessment Context
  assessed_by: ObjectId (ref: 'users'), // For 360 reviews
  invitation_id: ObjectId (ref: 'invitations'),

  // Responses (per question)
  responses: [{
    question_id: ObjectId (ref: 'assessment_questions'),
    question_text: String,
    dimension: String, // Which dimension this question belongs to
    answer: Mixed, // Number (1-10), String, Boolean, etc.
    score: Number, // Normalized score (0-100)
    time_spent_seconds: Number
  }],

  // Dynamic Dimension Scores (calculated from weighted responses)
  scores: {
    overall: Number (0-100), // Weighted average across all dimensions
    dimensions: [{ // Per-dimension breakdown
      name: String, // "Speed", "Strength", "Intelligence", or custom
      score: Number (0-100),
      level: Enum ['low', 'medium', 'high', 'exceptional'],
      description: String (max: 500),
      questions_answered: Number
    }]
  },

  // Weak Areas (scores < 60 threshold)
  weak_areas: [{
    dimension: String, // "Intelligence", "Speed", etc.
    score: Number,
    recommendations: [String], // "Improve data-driven decision making", etc.
    priority: Enum ['low', 'medium', 'high', 'critical']
  }],

  // LEGACY SSI Scores (DEPRECATED - kept for backward compatibility)
  ssi_scores: {
    speed: {
      score: Number (0-100),
      level: Enum ['low', 'medium', 'high', 'exceptional'],
      description: String (max: 500),
      questions_answered: Number
    },
    strength: {
      score: Number (0-100),
      level: Enum ['low', 'medium', 'high', 'exceptional'],
      description: String (max: 500),
      questions_answered: Number
    },
    intelligence: {
      score: Number (0-100),
      level: Enum ['low', 'medium', 'high', 'exceptional'],
      description: String (max: 500),
      questions_answered: Number
    }
  },

  // Overall Metrics
  overall_score: Number (0-100), // Duplicate of scores.overall for backward compatibility
  percentile_rank: Number (0-100),

  // Insights & Recommendations
  insights: [{
    type: Enum ['strength', 'weakness', 'opportunity', 'recommendation'],
    title: String,
    description: String,
    priority: Enum ['low', 'medium', 'high']
  }],

  ai_generated_insights: String (max: 2000),
  recommended_objectives: [String],

  // Completion Details
  status: Enum ['draft', 'in_progress', 'completed', 'expired'],
  started_at: Date,
  completed_at: Date,
  submitted_at: Date,
  time_taken_minutes: Number,
  completion_percentage: Number (0-100),

  // Metadata
  created_at: Date,
  updated_at: Date,
  expires_at: Date
}
```

**Indexes**:
- `{ business_id: 1, user_id: 1, created_at: -1 }` - User assessments
- `{ business_id: 1, assessment_type: 1 }` - Assessments by type
- `{ invitation_id: 1 }` - Assessment by invitation
- `{ business_id: 1, status: 1 }` - Active assessments

---

## 🎯 OKR COLLECTIONS

### 6. objectives
**Purpose**: Business objectives (the "O" in OKR)

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', required, index: true), // LEGACY
  company_id: ObjectId (ref: 'companies', index: true), // NEW - Block 2 IAM

  // Objective Information
  title: String (required, max: 255),
  description: String (max: 1000),
  category: Enum ['revenue', 'operational', 'market', 'team', 'customer', 'product', 'other'],

  // Ownership & Assignment
  owner_id: ObjectId (ref: 'users', required),
  team_id: ObjectId (ref: 'teams'),
  department: String,

  // Timeline
  target_year: Number (2024-2030),
  quarter: Number (1-4, optional),
  start_date: Date,
  end_date: Date (required),

  // Hierarchy (for cascading)
  parent_objective_id: ObjectId (ref: 'objectives'),
  is_company_objective: Boolean (default: false),

  // Status & Progress
  status: Enum ['draft', 'active', 'completed', 'paused', 'cancelled', 'at_risk'],
  progress_percentage: Number (0-100, default: 0),
  health_status: Enum ['on_track', 'at_risk', 'behind', 'critical'],

  // Visibility & Access
  visibility_level: Enum ['public', 'management', 'department', 'private'],
  shared_with: [ObjectId] (ref: 'users'),

  // Key Results (embedded for performance)
  key_results: [{
    _id: ObjectId,
    title: String (required, max: 255),
    description: String (max: 500),
    metric_type: Enum ['number', 'percentage', 'boolean', 'currency'],
    target_value: Number (required),
    current_value: Number (default: 0),
    start_value: Number (default: 0),
    unit: String,
    progress_percentage: Number (0-100),
    status: Enum ['not_started', 'in_progress', 'completed', 'at_risk'],
    owner_id: ObjectId (ref: 'users'),
    due_date: Date,
    created_at: Date,
    updated_at: Date
  }],

  // AI Generation Details
  ai_generated: Boolean (default: false),
  ai_suggestion_id: ObjectId (ref: 'ai_okr_suggestions'),
  generation_method: Enum ['manual', 'ai_generated', 'template', 'imported'],

  // Metrics & Analytics
  metrics: {
    total_key_results: Number,
    completed_key_results: Number,
    days_remaining: Number,
    velocity: Number,
    last_update_days_ago: Number
  },

  // Activity Log
  updates: [{
    user_id: ObjectId (ref: 'users'),
    action: String,
    description: String,
    timestamp: Date
  }],

  // Metadata
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId (ref: 'users'),
  last_reviewed_at: Date,
  archived_at: Date
}
```

**Indexes**:
- `{ business_id: 1, owner_id: 1 }` - User objectives (LEGACY)
- `{ company_id: 1, owner_id: 1 }` - User objectives (NEW - Block 2)
- `{ business_id: 1, status: 1 }` - Active objectives (LEGACY)
- `{ company_id: 1, status: 1 }` - Active objectives (NEW - Block 2)
- `{ business_id: 1, target_year: 1, quarter: 1 }` - Period objectives (LEGACY)
- `{ company_id: 1, target_year: 1, quarter: 1 }` - Period objectives (NEW - Block 2)
- `{ parent_objective_id: 1 }` - Cascading hierarchy
- `{ business_id: 1, team_id: 1 }` - Team objectives (LEGACY)
- `{ company_id: 1, team_id: 1 }` - Team objectives (NEW - Block 2)

---

### 7. goals
**Purpose**: Quarterly goals linked to objectives (first-class Block 1 feature)

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', required, index: true), // LEGACY
  company_id: ObjectId (ref: 'companies', index: true), // NEW - Block 2 IAM

  // Goal Information
  title: String (required, max: 255),
  description: String (max: 1000),

  // Linkage
  objective_id: ObjectId (ref: 'objectives', required),
  key_result_id: ObjectId,  // If linked to specific KR

  // Ownership
  owner_id: ObjectId (ref: 'users', required),
  team_id: ObjectId (ref: 'teams'),

  // Timeline
  quarter: Number (1-4),
  year: Number,
  start_date: Date,
  due_date: Date (required),

  // Progress & Status
  status: Enum ['not_started', 'in_progress', 'completed', 'blocked', 'at_risk'],
  progress_percentage: Number (0-100),

  // Metrics
  target_metric: {
    type: Enum ['number', 'percentage', 'boolean', 'currency'],
    target_value: Number,
    current_value: Number,
    unit: String
  },

  // Priority
  priority: Enum ['low', 'medium', 'high', 'critical'],

  // Metadata
  created_at: Date,
  updated_at: Date,
  completed_at: Date
}
```

**Indexes**:
- `{ objective_id: 1 }` - Goals by objective
- `{ business_id: 1, owner_id: 1 }` - User goals (LEGACY)
- `{ company_id: 1, owner_id: 1 }` - User goals (NEW - Block 2)
- `{ business_id: 1, quarter: 1, year: 1 }` - Quarterly goals (LEGACY)
- `{ company_id: 1, quarter: 1, year: 1 }` - Quarterly goals (NEW - Block 2)

---

### 8. tasks
**Purpose**: Weekly/daily execution tasks (first-class Block 1 feature)

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', required, index: true), // LEGACY
  company_id: ObjectId (ref: 'companies', index: true), // NEW - Block 2 IAM

  // Task Information
  title: String (required, max: 255),
  description: String (max: 1000),

  // Linkage (full lineage)
  objective_id: ObjectId (ref: 'objectives'),
  goal_id: ObjectId (ref: 'goals'),
  key_result_id: ObjectId,

  // Assignment
  assignee_id: ObjectId (ref: 'users', required),
  assigned_by: ObjectId (ref: 'users'),
  team_id: ObjectId (ref: 'teams'),

  // Timeline
  due_date: Date,
  start_date: Date,
  completed_at: Date,

  // Status & Priority
  status: Enum ['todo', 'in_progress', 'done', 'blocked', 'cancelled'],
  priority: Enum ['low', 'medium', 'high', 'urgent'],

  // Task Details
  estimated_hours: Number,
  actual_hours: Number,
  tags: [String],

  // Checklist
  checklist_items: [{
    text: String,
    completed: Boolean,
    completed_at: Date
  }],

  // Dependencies
  blocked_by: [ObjectId] (ref: 'tasks'),
  blocks: [ObjectId] (ref: 'tasks'),

  // Comments
  comments: [{
    user_id: ObjectId (ref: 'users'),
    text: String,
    created_at: Date
  }],

  // Metadata
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `{ business_id: 1, assignee_id: 1, status: 1 }` - User active tasks (LEGACY)
- `{ company_id: 1, assignee_id: 1, status: 1 }` - User active tasks (NEW - Block 2)
- `{ goal_id: 1 }` - Tasks by goal
- `{ business_id: 1, due_date: 1 }` - Upcoming tasks (LEGACY)
- `{ company_id: 1, due_date: 1 }` - Upcoming tasks (NEW - Block 2)
- `{ business_id: 1, team_id: 1 }` - Team tasks (LEGACY)
- `{ company_id: 1, team_id: 1 }` - Team tasks (NEW - Block 2)

---

## 👥 TEAM MANAGEMENT COLLECTIONS

### 9. teams
**Purpose**: Organizational teams for OKR collaboration

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', required, index: true),

  // Team Information
  name: String (required, max: 100),
  description: String (max: 500),
  department: String (max: 100),
  function: String (max: 100),

  // Leadership
  manager_id: ObjectId (ref: 'users', required),
  manager_name: String (denormalized for performance),

  // Members
  members: [{
    user_id: ObjectId (ref: 'users'),
    user_name: String (denormalized),
    user_email: String (denormalized),
    role: Enum ['member', 'lead', 'contributor'],
    joined_date: Date,
    is_active: Boolean (default: true)
  }],

  member_count: Number (default: 0),

  // Team Metrics
  metrics: {
    avg_objective_progress: Number (0-100),
    total_objectives: Number,
    completed_objectives: Number,
    at_risk_objectives: Number
  },

  // Team Settings
  settings: {
    weekly_standup_day: Number (0-6),
    default_visibility: Enum ['team', 'department', 'company'],
    auto_cascade_objectives: Boolean (default: false)
  },

  // Status
  is_active: Boolean (default: true),

  // Metadata
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId (ref: 'users')
}
```

**Indexes**:
- `{ business_id: 1, name: 1 }` - Unique team names per business
- `{ business_id: 1, manager_id: 1 }` - Teams by manager
- `{ business_id: 1, 'members.user_id': 1 }` - User's teams
- `{ business_id: 1, department: 1 }` - Teams by department

---

### 10. invitations
**Purpose**: System invitations for assessments and onboarding

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', required, index: true), // LEGACY
  company_id: ObjectId (ref: 'companies', index: true), // NEW - Block 2 IAM

  // Invitation Type
  type: Enum ['user_invite', 'assessment', 'team_join', 'objective_share'],

  // Bulk Operations (Block 6)
  recipient_type: Enum ['individual', 'team', 'company'], // NEW - supports bulk invitations
  bulk_invitation_id: ObjectId (ref: 'bulk_invitations'), // NEW - groups bulk invites together

  // Inviter Details
  invited_by: ObjectId (ref: 'users', required),
  inviter_name: String,
  inviter_email: String,

  // Invitee Details
  invitee_email: String (required, lowercase),
  invitee_name: String,
  invitee_user_id: ObjectId (ref: 'users', if existing user),

  // Context
  context: {
    role: String (for user invites),
    team_id: ObjectId (for team invites),
    assessment_template_id: ObjectId (for assessments),
    objective_id: ObjectId (for objective sharing),
    message: String (max: 500)
  },

  // Token & Security
  token: String (unique, indexed),
  expires_at: Date (required),

  // Usage
  status: Enum ['pending', 'accepted', 'declined', 'expired', 'cancelled'],
  accepted_at: Date,
  declined_at: Date,
  reminder_count: Number (default: 0),
  last_reminder_at: Date,

  // Metadata
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `{ token: 1 }` - Unique token lookup
- `{ business_id: 1, invitee_email: 1 }` - Invitations by email (LEGACY)
- `{ company_id: 1, invitee_email: 1 }` - Invitations by email (NEW - Block 2)
- `{ business_id: 1, status: 1 }` - Active invitations (LEGACY)
- `{ company_id: 1, status: 1 }` - Active invitations (NEW - Block 2)
- `{ bulk_invitation_id: 1 }` - NEW - Bulk invitation groups (Block 6)
- `{ recipient_type: 1 }` - NEW - Invitation recipient type (Block 6)
- `{ expires_at: 1 }` - TTL index for auto-deletion

---

## 🤖 AI/SUGGESTION COLLECTIONS

### 11. ai_okr_suggestions
**Purpose**: AI-generated OKR suggestions

```javascript
{
  _id: ObjectId,
  business_id: ObjectId (ref: 'businesses', required, index: true),
  user_id: ObjectId (ref: 'users', required),

  // Generation Context
  assessment_id: ObjectId (ref: 'assessments'),
  generation_method: Enum ['openai', 'ibrain', 'template', 'hybrid'],
  prompt_used: String,

  // Generated Objectives
  objectives: [{
    title: String,
    description: String,
    category: String,
    rationale: String,
    confidence_score: Number (0-1),
    key_results: [{
      title: String,
      metric_type: String,
      target_value: Number,
      unit: String,
      rationale: String
    }]
  }],

  // Metadata
  generation_time_ms: Number,
  tokens_used: Number,
  model_version: String,

  // User Interaction
  status: Enum ['generated', 'reviewed', 'accepted', 'rejected', 'modified'],
  accepted_objectives: [String],
  rejected_objectives: [String],
  feedback: String,

  // Timestamps
  created_at: Date,
  reviewed_at: Date,
  accepted_at: Date
}
```

**Indexes**:
- `{ business_id: 1, user_id: 1, created_at: -1 }` - User suggestions
- `{ assessment_id: 1 }` - Suggestions by assessment
- `{ business_id: 1, status: 1 }` - Accepted suggestions

---

## 🔍 INDEXES STRATEGY

### Primary Indexes (Required)
```javascript
// Multi-tenancy indexes (EVERY collection)
{ business_id: 1 }

// Authentication & lookup
{ email: 1 }  // users
{ token: 1 }  // invitations

// Relationships
{ user_id: 1 }  // assessments, objectives
{ objective_id: 1 }  // goals, tasks
{ team_id: 1 }  // objectives, tasks
```

### Compound Indexes (Performance)
```javascript
// User queries
{ business_id: 1, role: 1 }
{ business_id: 1, is_active: 1 }

// OKR queries
{ business_id: 1, owner_id: 1, status: 1 }
{ business_id: 1, target_year: 1, quarter: 1 }

// Assessment queries
{ business_id: 1, user_id: 1, created_at: -1 }
```

### TTL Indexes (Auto-cleanup)
```javascript
// Invitations expire after 30 days
{ expires_at: 1 } // TTL index

// Password reset tokens expire
{ password_reset_expires: 1 } // TTL index
```

---

## 🔐 MULTI-TENANCY DESIGN

### Implementation Strategy
1. **Every collection** includes `business_id` field
2. **Middleware enforcement** - All queries filtered by business context
3. **No shared documents** - Complete data isolation
4. **Consultant access** - Special role can access multiple businesses

### Query Pattern
```javascript
// All queries automatically include business filter
const objectives = await Objective.find({
  business_id: req.user.business_id,  // Always included
  owner_id: req.user._id
});
```

### Security Rules
- No cross-tenant queries allowed
- Business ID validated on every request
- Consultant role has managed_businesses array
- Soft deletes preserve audit trail

---

## 🔗 DATA RELATIONSHIPS

### Hierarchical Relationships
```
Business
├── Users (employees)
├── Teams
│   └── Members (users)
├── Objectives
│   ├── Key Results
│   ├── Goals
│   │   └── Tasks
│   └── AI Suggestions
├── Assessments
│   ├── Templates
│   └── Questions
└── Invitations
```

### Cross-References
- User → Manager (self-reference)
- Objective → Parent Objective (cascading)
- Task → Blocked By Tasks (dependencies)
- Assessment → AI Suggestions → Objectives

---

## 📦 MIGRATION STRATEGY

### Collection Creation Order
```javascript
1. businesses          // Root tenant
2. users              // Depends on business
3. teams              // Depends on business, users
4. assessment_templates  // Depends on business
5. assessment_questions  // Depends on templates
6. assessments          // Depends on users, questions
7. objectives           // Depends on users, teams
8. goals               // Depends on objectives
9. tasks               // Depends on goals
10. ai_okr_suggestions  // Depends on assessments
11. invitations        // Depends on business, users
```

### Seed Data Order
1. Create default business
2. Create admin user
3. Create global assessment templates
4. Create sample assessment questions
5. Create demo objectives (optional)

### Index Creation
```javascript
// Run after collections created
db.runCommand({
  createIndexes: "users",
  indexes: [
    { key: { business_id: 1, email: 1 }, unique: true },
    { key: { email: 1 } },
    { key: { business_id: 1, role: 1 } }
  ]
});
```

---

## 📊 PERFORMANCE CONSIDERATIONS

### Denormalization Strategy
- User names cached in team members array
- Manager names cached in teams
- Objective progress calculated and stored
- Key results embedded in objectives (not referenced)

### Query Optimization
- Use projection to limit fields returned
- Paginate large result sets (limit: 20-50)
- Use aggregation pipeline for complex metrics
- Cache frequently accessed data in Redis

### Data Retention
- Soft delete for audit trail
- Archive completed objectives after 2 years
- Purge draft assessments after 30 days
- Compress activity logs monthly

---

## 🔄 CHANGE LOG

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-24 | Technical Team | Initial schema documentation based on existing MongoDB implementation |

---

## 📞 QUESTIONS?

Contact: Technical Lead
Database: MongoDB 7.x
ORM: Mongoose 7.5.0
Cache: Redis (optional)