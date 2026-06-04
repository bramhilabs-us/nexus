# Karvia Business API Documentation

## Overview

The Karvia Business API provides comprehensive endpoints for managing B2B OKR (Objectives and Key Results) operations. This RESTful API supports multi-tenant architecture with role-based access control.

## Base URL

```
https://your-domain.com/api
```

## Authentication

### JWT Token Authentication

All API requests require authentication using JWT tokens.

```http
Authorization: Bearer <your-jwt-token>
```

### Login Endpoint

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "email": "user@example.com",
      "role": "businessOwner",
      "businessId": "64a1b2c3d4e5f6789012346"
    }
  }
}
```

## Business Management

### Get Business Details

```http
GET /api/businesses/:businessId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789012346",
    "name": "Acme Corporation",
    "industry": "Technology",
    "size": "medium",
    "settings": {
      "timezone": "UTC",
      "currency": "USD"
    },
    "assessment": {
      "speed": 75,
      "strength": 82,
      "intelligence": 68
    }
  }
}
```

### Update Business Settings

```http
PUT /api/businesses/:businessId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Company Name",
  "settings": {
    "timezone": "America/New_York",
    "currency": "USD"
  }
}
```

## Objectives Management

### Create Objective

```http
POST /api/objectives
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Increase Customer Satisfaction",
  "description": "Improve overall customer satisfaction scores",
  "timeframe": "Q1 2024",
  "businessId": "64a1b2c3d4e5f6789012346",
  "keyResults": [
    {
      "title": "Achieve 90% customer satisfaction rating",
      "target": 90,
      "unit": "percentage",
      "current": 0
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789012347",
    "title": "Increase Customer Satisfaction",
    "description": "Improve overall customer satisfaction scores",
    "timeframe": "Q1 2024",
    "status": "active",
    "progress": 0,
    "businessId": "64a1b2c3d4e5f6789012346",
    "keyResults": [...],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Objectives

```http
GET /api/objectives?businessId=64a1b2c3d4e5f6789012346&status=active
Authorization: Bearer <token>
```

**Query Parameters:**
- `businessId` (required): Business ID
- `status` (optional): `active`, `completed`, `paused`
- `timeframe` (optional): Filter by timeframe
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

### Update Objective Progress

```http
PUT /api/objectives/:objectiveId/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "keyResultId": "64a1b2c3d4e5f6789012348",
  "current": 75,
  "note": "Significant progress made this week"
}
```

## Goals Management

### Create Goal

```http
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Improve Customer Support Response Time",
  "description": "Reduce average response time to under 2 hours",
  "objectiveId": "64a1b2c3d4e5f6789012347",
  "assignedTo": "64a1b2c3d4e5f6789012349",
  "department": "Customer Success",
  "dueDate": "2024-03-31",
  "priority": "high"
}
```

### Get Goals

```http
GET /api/goals?objectiveId=64a1b2c3d4e5f6789012347
Authorization: Bearer <token>
```

### Update Goal Status

```http
PUT /api/goals/:goalId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "progress": 100,
  "completedAt": "2024-02-15T10:30:00.000Z"
}
```

## Tasks Management

### Create Task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Set up customer feedback survey",
  "description": "Create and deploy customer satisfaction survey",
  "goalId": "64a1b2c3d4e5f678901234a",
  "assignedTo": "64a1b2c3d4e5f678901234b",
  "priority": "high",
  "dueDate": "2024-02-01",
  "estimatedHours": 8
}
```

### Get Tasks

```http
GET /api/tasks?goalId=64a1b2c3d4e5f678901234a&status=pending
Authorization: Bearer <token>
```

### Update Task

```http
PUT /api/tasks/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "actualHours": 6,
  "completedAt": "2024-01-25T14:30:00.000Z"
}
```

## Assessment Engine API

### Conduct Business Assessment

```http
POST /api/assessments/business
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessId": "64a1b2c3d4e5f6789012346",
  "responses": [
    {
      "questionId": "speed_1",
      "answer": 4
    },
    {
      "questionId": "strength_1",
      "answer": 3
    }
  ]
}
```

### Get Assessment Results

```http
GET /api/assessments/:businessId/results
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "businessId": "64a1b2c3d4e5f6789012346",
    "scores": {
      "speed": 75,
      "strength": 82,
      "intelligence": 68,
      "overall": 75
    },
    "recommendations": [
      "Focus on improving decision-making speed",
      "Leverage existing team strengths",
      "Invest in data analytics capabilities"
    ],
    "completedAt": "2024-01-15T09:00:00.000Z"
  }
}
```

## Analytics & Reporting

### Get Business Analytics

```http
GET /api/analytics/business/:businessId
Authorization: Bearer <token>
```

**Query Parameters:**
- `timeframe`: `week`, `month`, `quarter`, `year`
- `metrics`: Comma-separated list of metrics

### Get Team Performance

```http
GET /api/analytics/team/:teamId/performance
Authorization: Bearer <token>
```

### Export Report

```http
POST /api/analytics/export
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessId": "64a1b2c3d4e5f6789012346",
  "reportType": "executive_summary",
  "timeframe": "quarter",
  "format": "pdf"
}
```

## User Management

### Get Users

```http
GET /api/users?businessId=64a1b2c3d4e5f6789012346
Authorization: Bearer <token>
```

### Create User

```http
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "teamLead",
  "businessId": "64a1b2c3d4e5f6789012346",
  "department": "Marketing"
}
```

### Update User Role

```http
PUT /api/users/:userId/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "departmentHead",
  "department": "Sales"
}
```

## Collaboration Features

### Add Comment

```http
POST /api/objectives/:objectiveId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great progress on this objective!",
  "mentions": ["64a1b2c3d4e5f678901234c"]
}
```

### Get Activity Feed

```http
GET /api/activity?businessId=64a1b2c3d4e5f6789012346&limit=20
Authorization: Bearer <token>
```

## Integrations

### Slack Integration

```http
POST /api/integrations/slack/configure
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessId": "64a1b2c3d4e5f6789012346",
  "webhookUrl": "https://hooks.slack.com/services/...",
  "channels": {
    "general": "#general",
    "goals": "#okr-updates"
  }
}
```

### Send Notification

```http
POST /api/integrations/notifications/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessId": "64a1b2c3d4e5f6789012346",
  "type": "goal_completed",
  "channels": ["slack", "email"],
  "data": {
    "goalId": "64a1b2c3d4e5f678901234a",
    "userId": "64a1b2c3d4e5f678901234b"
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions for this action |
| `NOT_FOUND` | 404 | Requested resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `BUSINESS_RULE_VIOLATION` | 422 | Business logic constraint violated |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

- **Standard endpoints**: 100 requests per minute
- **Authentication endpoints**: 10 requests per minute
- **Analytics endpoints**: 50 requests per minute

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

Large result sets are paginated:

```http
GET /api/objectives?page=2&limit=25
```

**Response includes pagination metadata:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 25,
    "total": 150,
    "pages": 6
  }
}
```

## Webhooks

### Register Webhook

```http
POST /api/webhooks/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/karvia",
  "events": ["objective.created", "goal.completed"],
  "secret": "your-webhook-secret"
}
```

### Webhook Events

| Event | Description |
|-------|-------------|
| `objective.created` | New objective created |
| `objective.updated` | Objective progress updated |
| `goal.completed` | Goal marked as completed |
| `user.created` | New user added to business |
| `assessment.completed` | Business assessment completed |

### Webhook Payload Example

```json
{
  "event": "goal.completed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "client_id": "your-client-id",
  "data": {
    "goalId": "64a1b2c3d4e5f678901234a",
    "objectiveId": "64a1b2c3d4e5f6789012347",
    "completedBy": "64a1b2c3d4e5f678901234b",
    "completedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## SDK Examples

### JavaScript/Node.js

```javascript
const KarviaAPI = require('@karvia/api-client');

const client = new KarviaAPI({
  baseURL: 'https://your-domain.com/api',
  token: 'your-jwt-token'
});

// Create objective
const objective = await client.objectives.create({
  title: 'Increase Revenue',
  businessId: 'business-id'
});

// Get business analytics
const analytics = await client.analytics.getBusiness('business-id', {
  timeframe: 'quarter'
});
```

### Python

```python
from karvia_api import KarviaClient

client = KarviaClient(
    base_url='https://your-domain.com/api',
    token='your-jwt-token'
)

# Create objective
objective = client.objectives.create({
    'title': 'Increase Revenue',
    'businessId': 'business-id'
})

# Get analytics
analytics = client.analytics.get_business('business-id', timeframe='quarter')
```

## Testing

### Postman Collection

Import our Postman collection for easy API testing:
```
https://your-domain.com/api/docs/postman-collection.json
```

### API Testing Environment

```bash
# Test environment
BASE_URL=https://test.your-domain.com/api
TEST_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Run tests
curl -H "Authorization: Bearer $TEST_TOKEN" $BASE_URL/health
```

---

**API Version**: 1.0.0
**Last Updated**: January 2024
**Support**: api-support@karvia-business.com