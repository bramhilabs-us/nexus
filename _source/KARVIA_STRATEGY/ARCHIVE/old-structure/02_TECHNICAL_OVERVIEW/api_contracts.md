# API Contracts

**Document**: Complete API endpoint documentation
**Last Updated**: October 21, 2025
**Owner**: Technical Lead

---

## 📋 Overview

KARVIA Pro exposes a RESTful API with **13 route modules** and **50+ endpoints**. All endpoints follow consistent patterns for authentication, error handling, and response formats.

**Base URL**: `https://api.karviapro.com` (production) or `http://localhost:8081` (development)

**API Version**: v1 (no versioning in URL yet, reserved for V1)

---

## 🔐 Authentication

### **Global Authentication Requirements**

Most endpoints require JWT authentication:

**Request Header**:
```
Authorization: Bearer <jwt_token>
```

**JWT Token Payload**:
```json
{
  "userId": 123,
  "businessId": 456,
  "role": "admin",
  "email": "user@example.com",
  "exp": 1234567890
}
```

**Error Responses**:
```json
// 401 Unauthorized (missing token)
{
  "error": "No token provided"
}

// 401 Unauthorized (expired token)
{
  "error": "Token expired"
}

// 403 Forbidden (insufficient permissions)
{
  "error": "Insufficient permissions"
}
```

---

## 📚 API Routes

### **1. /api/auth** (Authentication)

#### **POST /api/auth/register**
Create new user + business account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "businessName": "Acme Corp",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "role": "admin",
    "businessId": 456
  },
  "business": {
    "id": 456,
    "name": "Acme Corp"
  }
}
```

**Errors**:
- `400`: Validation error (email format, password strength)
- `409`: Email already registered

---

#### **POST /api/auth/login**
Authenticate user and receive JWT token.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "role": "admin",
    "businessId": 456,
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Errors**:
- `401`: Invalid credentials

---

### **2. /api/businesses** (Business Management)

#### **GET /api/businesses/:id**
Get business details.

**Auth**: Required (admin or member of business)

**Response** (200 OK):
```json
{
  "id": 456,
  "name": "Acme Corp",
  "ibrain_enabled": true,
  "settings": {
    "timezone": "America/New_York",
    "okr_cycle": "quarterly"
  },
  "created_at": "2025-01-15T10:00:00Z"
}
```

**Errors**:
- `401`: Not authenticated
- `403`: Not authorized to view this business
- `404`: Business not found

---

#### **PUT /api/businesses/:id**
Update business settings.

**Auth**: Required (admin only)

**Request**:
```json
{
  "name": "Acme Corporation",
  "settings": {
    "timezone": "America/Los_Angeles",
    "okr_cycle": "quarterly"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "business": {
    "id": 456,
    "name": "Acme Corporation",
    "settings": { ... },
    "updated_at": "2025-10-21T14:30:00Z"
  }
}
```

**Errors**:
- `403`: Not authorized (admin only)

---

### **3. /api/assessments** (Assessment Management)

#### **POST /api/assessments**
Create new assessment.

**Auth**: Required

**Request**:
```json
{
  "template_id": 1,
  "level": "organization",
  "responses": [
    { "question_id": 1, "value": 4 },
    { "question_id": 2, "value": 3 },
    ...
  ]
}
```

**Response** (201 Created):
```json
{
  "id": 789,
  "business_id": 456,
  "template_id": 1,
  "level": "organization",
  "scores": {
    "speed": 3.5,
    "strength": 4.2,
    "intelligence": 3.8,
    "overall": 3.83
  },
  "insights": {
    "weak_areas": ["Communication", "Decision Making"],
    "strong_areas": ["Execution", "Collaboration"],
    "recommendations": ["Focus on improving communication channels"]
  },
  "created_at": "2025-10-21T10:00:00Z"
}
```

**Errors**:
- `400`: Invalid template_id or missing responses
- `404`: Template not found

---

#### **GET /api/assessments/:id**
Get assessment by ID.

**Auth**: Required

**Response** (200 OK):
```json
{
  "id": 789,
  "business_id": 456,
  "template": {
    "id": 1,
    "name": "Organization Health Assessment",
    "level": "organization"
  },
  "scores": { ... },
  "insights": { ... },
  "created_at": "2025-10-21T10:00:00Z"
}
```

---

#### **GET /api/assessments/business/:business_id**
Get all assessments for a business.

**Auth**: Required (must belong to business)

**Query Parameters**:
- `level` (optional): Filter by level (organization, team, individual)
- `limit` (optional): Pagination limit (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200 OK):
```json
{
  "assessments": [
    { "id": 789, "level": "organization", "scores": {...}, "created_at": "..." },
    { "id": 790, "level": "team", "scores": {...}, "created_at": "..." }
  ],
  "total": 12,
  "limit": 50,
  "offset": 0
}
```

---

### **4. /api/objectives** (OKR Management)

#### **POST /api/objectives**
Create new objective.

**Auth**: Required (admin or manager)

**Request**:
```json
{
  "title": "Increase customer satisfaction by 20%",
  "level": "company",
  "parent_id": null,
  "owner_id": 123,
  "key_results": [
    {
      "description": "Improve NPS score from 40 to 50",
      "target": 50,
      "current": 40,
      "unit": "points",
      "weight": 50
    },
    {
      "description": "Reduce support ticket response time to < 2 hours",
      "target": 2,
      "current": 4.5,
      "unit": "hours",
      "weight": 50
    }
  ],
  "due_date": "2025-12-31"
}
```

**Response** (201 Created):
```json
{
  "id": 1001,
  "business_id": 456,
  "title": "Increase customer satisfaction by 20%",
  "level": "company",
  "parent_id": null,
  "owner": {
    "id": 123,
    "name": "John Doe",
    "email": "john@acme.com"
  },
  "key_results": [ ... ],
  "progress": 0.00,
  "status": "on-track",
  "created_at": "2025-10-21T10:00:00Z"
}
```

**Errors**:
- `400`: Validation error (title required, invalid parent_id)
- `403`: Insufficient permissions (not admin/manager)

---

#### **GET /api/objectives**
Get objectives with filters.

**Auth**: Required

**Query Parameters**:
- `level` (optional): Filter by level (company, department, team, individual)
- `status` (optional): Filter by status (on-track, at-risk, behind, ahead)
- `parent_id` (optional): Filter by parent objective
- `owner_id` (optional): Filter by owner
- `limit` (optional): Pagination limit (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200 OK):
```json
{
  "objectives": [
    {
      "id": 1001,
      "title": "Increase customer satisfaction by 20%",
      "level": "company",
      "progress": 35.5,
      "status": "on-track",
      "owner": { "id": 123, "name": "John Doe" },
      "key_results": [ ... ],
      "created_at": "2025-10-21T10:00:00Z"
    }
  ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

---

#### **GET /api/objectives/:id**
Get single objective with full details.

**Auth**: Required

**Response** (200 OK):
```json
{
  "id": 1001,
  "business_id": 456,
  "title": "Increase customer satisfaction by 20%",
  "level": "company",
  "parent": null,
  "children": [
    { "id": 1002, "title": "Improve support response times", "progress": 40.0 }
  ],
  "owner": { "id": 123, "name": "John Doe", "email": "john@acme.com" },
  "key_results": [
    {
      "id": "kr-1",
      "description": "Improve NPS score from 40 to 50",
      "target": 50,
      "current": 42,
      "unit": "points",
      "weight": 50,
      "progress": 20.0
    },
    {
      "id": "kr-2",
      "description": "Reduce support ticket response time to < 2 hours",
      "target": 2,
      "current": 3.5,
      "unit": "hours",
      "weight": 50,
      "progress": 40.0
    }
  ],
  "progress": 30.0,
  "status": "on-track",
  "created_at": "2025-10-21T10:00:00Z",
  "updated_at": "2025-10-21T14:00:00Z"
}
```

---

#### **PUT /api/objectives/:id/kr**
Update key result progress.

**Auth**: Required (owner or admin/manager)

**Request**:
```json
{
  "kr_id": "kr-1",
  "current": 45
}
```

**Response** (200 OK):
```json
{
  "objective": {
    "id": 1001,
    "progress": 55.0,
    "status": "on-track",
    "key_results": [
      { "id": "kr-1", "current": 45, "progress": 50.0 },
      { "id": "kr-2", "current": 3.5, "progress": 40.0 }
    ],
    "updated_at": "2025-10-21T15:00:00Z"
  }
}
```

**Errors**:
- `404`: Objective or KR not found
- `403`: Not authorized to update (not owner/admin)

---

### **5. /api/ai-okr** (iBrain Integration)

#### **POST /api/ai-okr/generate**
Generate AI objectives from assessment.

**Auth**: Required
**Toggle**: Requires `business.ibrain_enabled = true`

**Request**:
```json
{
  "assessment_id": 789
}
```

**Response** (200 OK):
```json
{
  "suggestions": [
    {
      "id": 5001,
      "assessment_id": 789,
      "objective_text": "Improve decision-making speed by 30%",
      "key_results": [
        {
          "description": "Reduce decision cycle time from 5 days to 3.5 days",
          "target": 3.5,
          "current": 5,
          "unit": "days"
        }
      ],
      "rationale": "Assessment identified decision-making as a weak area (score: 2.8/5)",
      "status": "pending",
      "created_at": "2025-10-21T10:00:00Z"
    }
  ]
}
```

**Errors**:
- `403`: iBrain not enabled for this business
- `404`: Assessment not found
- `503`: iBrain service unavailable

---

#### **POST /api/ai-okr/approve**
Approve AI-generated objective (convert to real objective).

**Auth**: Required (admin or manager)

**Request**:
```json
{
  "suggestion_id": 5001
}
```

**Response** (201 Created):
```json
{
  "objective": {
    "id": 1002,
    "title": "Improve decision-making speed by 30%",
    "source": "ai_generated",
    "ai_suggestion_id": 5001,
    ...
  }
}
```

---

### **6. /api/analytics** (Team Analytics)

#### **GET /api/analytics/team**
Get team-level analytics.

**Auth**: Required

**Query Parameters**:
- `dimension` (optional): Filter by dimension (speed, strength, intelligence)
- `category` (optional): Filter by category
- `status` (optional): Filter by objective status
- `date_range` (optional): Date range (30d, 90d, 1y)

**Response** (200 OK):
```json
{
  "summary": {
    "total_objectives": 42,
    "on_track": 28,
    "at_risk": 10,
    "behind": 4,
    "average_progress": 62.5
  },
  "by_dimension": [
    { "dimension": "Speed", "avg_score": 3.8, "objectives": 14 },
    { "dimension": "Strength", "avg_score": 4.1, "objectives": 16 },
    { "dimension": "Intelligence", "avg_score": 3.5, "objectives": 12 }
  ],
  "by_category": [
    { "category": "Communication", "avg_progress": 55.0, "objectives": 8 },
    { "category": "Execution", "avg_progress": 72.0, "objectives": 12 }
  ],
  "trends": [
    { "week": "2025-W40", "avg_progress": 58.0 },
    { "week": "2025-W41", "avg_progress": 60.5 },
    { "week": "2025-W42", "avg_progress": 62.5 }
  ]
}
```

---

#### **GET /api/analytics/drilldown**
Drill down into specific dimension/category.

**Auth**: Required

**Query Parameters**:
- `dimension` (required): Dimension to drill down (speed, strength, intelligence)
- `category` (optional): Category within dimension

**Response** (200 OK):
```json
{
  "dimension": "Speed",
  "categories": [
    {
      "name": "Decision Making",
      "objectives": [
        { "id": 1001, "title": "...", "progress": 45.0, "status": "on-track" }
      ],
      "avg_progress": 45.0
    }
  ]
}
```

---

### **7. /api/invitations** (Team Invitations)

#### **POST /api/invitations**
Send team member invitation.

**Auth**: Required (admin only)

**Request**:
```json
{
  "email": "newuser@example.com",
  "role": "manager"
}
```

**Response** (201 Created):
```json
{
  "id": 3001,
  "email": "newuser@example.com",
  "role": "manager",
  "token": "inv_abc123xyz",
  "status": "pending",
  "expires_at": "2025-10-28T10:00:00Z",
  "created_at": "2025-10-21T10:00:00Z"
}
```

**Errors**:
- `400`: Email already registered or invited
- `403`: Not authorized (admin only)

---

#### **GET /api/invitations/:token/accept**
Accept invitation and create user account.

**Auth**: Not required (public endpoint)

**Request**:
```json
{
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 124,
    "email": "newuser@example.com",
    "role": "manager",
    "businessId": 456
  }
}
```

**Errors**:
- `404`: Invalid or expired invitation token
- `409`: Email already registered

---

### **8. /api/admin** (Admin Utilities)

#### **GET /api/admin/health**
Health check endpoint.

**Auth**: Not required (public)

**Response** (200 OK):
```json
{
  "status": "healthy",
  "service": "Karvia Business API Server",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "timestamp": "2025-10-21T10:00:00Z",
  "database": {
    "status": "healthy",
    "overall": true
  },
  "services": {
    "overallHealth": "healthy",
    "services": [
      { "name": "iBrainService", "status": "operational" }
    ]
  }
}
```

---

## 🔄 Response Formats

### **Success Responses**

All successful responses follow RESTful conventions:

- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST (resource created)
- `204 No Content`: Successful DELETE (no response body)

### **Error Responses**

All errors return consistent JSON format:

```json
{
  "error": "Validation failed",
  "status": 400,
  "message": "Title is required",
  "details": {
    "field": "title",
    "constraint": "required"
  }
}
```

**HTTP Status Codes**:
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: External service (iBrain) down

---

## 📊 Pagination

Endpoints that return lists support pagination:

**Query Parameters**:
- `limit`: Number of items per page (default: 50, max: 100)
- `offset`: Number of items to skip (default: 0)

**Response Format**:
```json
{
  "data": [ ... ],
  "total": 120,
  "limit": 50,
  "offset": 0,
  "has_more": true
}
```

---

## 🔍 Filtering & Sorting

**Supported Filters** (vary by endpoint):
- `level`: company, department, team, individual
- `status`: on-track, at-risk, behind, ahead
- `dimension`: speed, strength, intelligence
- `category`: Communication, Execution, etc.
- `date_range`: 30d, 90d, 1y

**Sorting** (V1 feature):
- `sort_by`: Field to sort by (e.g., progress, created_at)
- `sort_order`: asc or desc

---

## 📚 References

- **REST API Design**: https://restfulapi.net
- **JSON Schema**: https://json-schema.org
- **HTTP Status Codes**: https://httpstatuses.com

---

**END OF DOCUMENT**
