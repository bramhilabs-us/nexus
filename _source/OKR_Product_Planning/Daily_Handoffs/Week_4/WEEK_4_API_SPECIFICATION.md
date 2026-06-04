# Week 4 - API Specification
## Complete Endpoint Documentation for AI OKR Generation & Objectives Dashboard

**Version**: 1.0
**Created**: October 19, 2025
**Status**: Ready for Implementation

---

## 📋 **TABLE OF CONTENTS**

1. [API Design Principles](#api-design-principles)
2. [Authentication & Authorization](#authentication--authorization)
3. [AI OKR Endpoints](#ai-okr-endpoints)
4. [Objectives Dashboard Endpoints](#objectives-dashboard-endpoints)
5. [iBrain AI Insights Endpoints](#ibrain-ai-insights-endpoints)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Response Format Standards](#response-format-standards)

---

## 🎯 **API DESIGN PRINCIPLES**

### **Consistency**
- All responses follow standard format: `{ success: boolean, data?: any, error?: string }`
- HTTP status codes match semantic meaning
- Timestamps in ISO 8601 format
- IDs as strings (MongoDB ObjectId serialized)

### **Security**
- All endpoints require authentication (`authenticateToken` middleware)
- Role-based access control where applicable
- Input validation on all POST/PUT requests
- No sensitive data in error messages

### **Performance**
- Caching headers for cacheable resources
- Pagination for list endpoints
- Lean queries (only return needed fields)
- Aggregation pipelines for statistics

---

## 🔐 **AUTHENTICATION & AUTHORIZATION**

### **Authentication Middleware**

```javascript
// All endpoints use this middleware
router.use(authenticateToken);

// Extracts JWT token from header
// Sets req.user = { id, email, role, business_id }
```

### **Role-Based Access Control**

```javascript
// Role hierarchy
EMPLOYEE < MANAGER < EXECUTIVE < BUSINESS_OWNER

// Role guard middleware
requireRole(['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER'])

// Permission matrix
| Endpoint | Employee | Manager | Executive | Business Owner |
|----------|----------|---------|-----------|----------------|
| Generate OKRs | ❌ | ✅ | ✅ | ✅ |
| View own objectives | ✅ | ✅ | ✅ | ✅ |
| View team objectives | ❌ | ✅ | ✅ | ✅ |
| View all objectives | ❌ | ❌ | ✅ | ✅ |
| Edit objectives | Own only | Own + Team | All | All |
| iBrain insights | If enabled | If enabled | If enabled | If enabled |
| Toggle iBrain | ❌ | ❌ | ❌ | ✅ |
```

---

## 🤖 **AI OKR ENDPOINTS**

### **1. Generate OKRs from Assessment**

**Endpoint**: `POST /api/ai-okr/generate/:assessmentId`

**Description**: Analyzes assessment weak areas and generates 3-5 SMART objectives with key results using OpenAI GPT-4.

**Access**: MANAGER, EXECUTIVE, BUSINESS_OWNER

**URL Parameters**:
- `assessmentId` (string, required) - Assessment ID to analyze

**Request Body** (optional):
```json
{
  "threshold": 40,           // Weak area threshold (default: 40)
  "count": 4,                // Number of objectives to generate (default: 3-5)
  "focus": "speed",          // Focus on specific dimension (optional)
  "include_categories": [    // Specific categories to address (optional)
    "execution",
    "decision_making"
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "suggestionId": "67890abc123def456",
    "assessmentId": "12345abc",
    "generatedAt": "2025-10-19T20:30:00.000Z",
    "weakAreasAnalysis": {
      "threshold": 40,
      "totalWeakCount": 8,
      "weakDimensions": [
        {
          "dimension": "speed",
          "score": 58,
          "label": "Business Agility"
        },
        {
          "dimension": "intelligence",
          "score": 62,
          "label": "Data & Strategy"
        }
      ],
      "weakCategories": [
        {
          "category": "execution",
          "dimension": "speed",
          "score": 54
        },
        {
          "category": "innovation",
          "dimension": "intelligence",
          "score": 60
        }
      ]
    },
    "objectives": [
      {
        "title": "Accelerate Decision-Making Process",
        "description": "Implement streamlined decision-making framework to reduce response time by 40% and improve team agility.",
        "category": "operational",
        "priority": "high",
        "effort_estimate": "high",
        "timeline": {
          "target_year": 2025,
          "quarters": [1, 2]
        },
        "weak_area_reference": {
          "dimension": "speed",
          "category": "execution",
          "current_score": 54,
          "target_score": 75
        },
        "key_results": [
          {
            "title": "Reduce decision cycle time from 5 days to 3 days",
            "metric_type": "number",
            "target_value": 3,
            "unit": "days",
            "quarter": 1
          },
          {
            "title": "Implement decision-making framework across all teams",
            "metric_type": "boolean",
            "target_value": 1,
            "unit": "completed",
            "quarter": 1
          },
          {
            "title": "Achieve 80% team satisfaction with new process",
            "metric_type": "percentage",
            "target_value": 80,
            "unit": "%",
            "quarter": 2
          }
        ],
        "edited": false,
        "approved": false
      }
      // ... 3-4 more objectives
    ],
    "aiMetadata": {
      "model": "gpt-4",
      "generationTimeMs": 12450,
      "fallbackUsed": false
    }
  }
}
```

**Error Responses**:
```json
// 400 - No weak areas found
{
  "success": false,
  "error": "No weak areas identified in assessment. All scores above threshold (40)."
}

// 403 - Permission denied
{
  "success": false,
  "error": "Only managers and above can generate objectives."
}

// 404 - Assessment not found
{
  "success": false,
  "error": "Assessment not found."
}

// 500 - AI service failure
{
  "success": false,
  "error": "AI service temporarily unavailable. Please try again.",
  "fallbackAvailable": true
}
```

**Performance**: < 15 seconds (AI generation time)

---

### **2. Get AI Suggestions**

**Endpoint**: `GET /api/ai-okr/suggestions/:userId`

**Description**: Retrieves the latest AI-generated OKR suggestions for a user.

**Access**: User can view own suggestions, Managers+ can view team suggestions

**URL Parameters**:
- `userId` (string, required) - User ID

**Query Parameters**:
- `status` (string, optional) - Filter by status: 'draft' | 'approved' | 'dismissed' | 'partially_approved'
- `limit` (number, optional) - Max results (default: 10)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "67890abc",
        "assessmentId": "12345abc",
        "userId": "user123",
        "status": "draft",
        "generatedAt": "2025-10-19T20:30:00.000Z",
        "objectivesCount": 4,
        "approvedCount": 0,
        "dismissedCount": 0,
        "objectives": [
          // Full objective objects (same structure as generate endpoint)
        ]
      }
    ],
    "total": 3,
    "hasMore": false
  }
}
```

**Error Responses**:
```json
// 403 - Access denied
{
  "success": false,
  "error": "You don't have permission to view these suggestions."
}
```

---

### **3. Edit AI Suggestion**

**Endpoint**: `PUT /api/ai-okr/edit/:suggestionId/:objectiveIndex`

**Description**: Edit an AI-generated objective before approval.

**Access**: Suggestion owner or Manager+

**URL Parameters**:
- `suggestionId` (string, required) - Suggestion ID
- `objectiveIndex` (number, required) - Index of objective to edit (0-based)

**Request Body**:
```json
{
  "title": "Updated Objective Title",
  "description": "Updated description...",
  "priority": "high",
  "effort_estimate": "medium",
  "key_results": [
    {
      "title": "Updated KR title",
      "metric_type": "percentage",
      "target_value": 85,
      "unit": "%",
      "quarter": 1
    }
    // ... other KRs
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "suggestionId": "67890abc",
    "objectiveIndex": 0,
    "edited": true,
    "updatedAt": "2025-10-19T20:35:00.000Z",
    "objective": {
      // Full updated objective object
    }
  }
}
```

**Validation Errors** (400):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "key_results[0].target_value",
      "message": "Target value must be greater than 0"
    },
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

### **4. Approve AI Suggestions**

**Endpoint**: `POST /api/ai-okr/approve`

**Description**: Approve AI suggestions and create Objective documents in database.

**Access**: MANAGER, EXECUTIVE, BUSINESS_OWNER

**Request Body**:
```json
{
  "suggestionId": "67890abc",
  "objectiveIndices": [0, 1, 2],  // Which objectives to approve (0-based)
  "overrides": {                   // Optional field overrides
    "0": {
      "owner_id": "user456",       // Assign to different user
      "start_date": "2025-11-01"   // Custom start date
    }
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "approvedCount": 3,
    "createdObjectives": [
      {
        "objectiveId": "obj123",
        "title": "Accelerate Decision-Making Process",
        "originalIndex": 0,
        "ownerId": "user123",
        "createdAt": "2025-10-19T20:40:00.000Z"
      },
      {
        "objectiveId": "obj124",
        "title": "Enhance Data-Driven Strategy",
        "originalIndex": 1,
        "ownerId": "user123",
        "createdAt": "2025-10-19T20:40:00.000Z"
      },
      {
        "objectiveId": "obj125",
        "title": "Improve Innovation Pipeline",
        "originalIndex": 2,
        "ownerId": "user123",
        "createdAt": "2025-10-19T20:40:00.000Z"
      }
    ],
    "suggestionStatus": "partially_approved",  // or "approved" if all approved
    "updatedAt": "2025-10-19T20:40:00.000Z"
  }
}
```

**Business Logic**:
1. Validates all objectives to be approved
2. Creates Objective documents with:
   - `ai_generated: true`
   - `assessment_id` link
   - `ai_okr_suggestion_id` link
   - `weak_area_reference` preserved
3. Updates suggestion status
4. Marks objectives as approved in suggestion document
5. Links created objectives back to suggestion

---

### **5. Dismiss AI Suggestion**

**Endpoint**: `DELETE /api/ai-okr/dismiss/:suggestionId/:objectiveIndex`

**Description**: Dismiss (soft delete) an AI-generated objective from suggestion.

**Access**: Suggestion owner or Manager+

**URL Parameters**:
- `suggestionId` (string, required)
- `objectiveIndex` (number, required)

**Request Body** (optional):
```json
{
  "reason": "Not aligned with current priorities"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "suggestionId": "67890abc",
    "objectiveIndex": 2,
    "dismissed": true,
    "reason": "Not aligned with current priorities",
    "dismissedAt": "2025-10-19T20:45:00.000Z"
  }
}
```

**Note**: Dismissing does NOT delete the objective from the suggestion document. It marks it as dismissed and hides it from the UI.

---

## 📊 **OBJECTIVES DASHBOARD ENDPOINTS**

### **6. Get My Dashboard**

**Endpoint**: `GET /api/objectives/my-dashboard`

**Description**: Complete dashboard data for current user including objectives, stats, and context.

**Access**: All authenticated users

**Query Parameters**:
- `quarter` (number, optional) - Filter by quarter (1-4)
- `year` (number, optional) - Filter by year
- `status` (string, optional) - Filter: 'active' | 'completed' | 'archived'

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "firstName": "Sarah",
      "lastName": "Chen",
      "fullName": "Sarah Chen",
      "email": "sarah.chen@acme.com",
      "role": "MANAGER",
      "avatarUrl": "/uploads/avatars/user123.jpg"
    },
    "business": {
      "id": "biz123",
      "name": "Acme Corporation",
      "fiscalYearStart": 1,          // January
      "ibrainEnabled": true
    },
    "currentQuarter": {
      "year": 2024,
      "quarter": 4,
      "label": "Q4 2024",
      "startDate": "2024-10-01",
      "endDate": "2024-12-31",
      "currentWeek": 3,
      "totalWeeks": 13
    },
    "stats": {
      "activeObjectivesCount": 4,
      "overallProgress": 67,          // Average of all objectives
      "totalKeyResults": 12,
      "completedKeyResults": 8,
      "onTrackCount": 2,
      "atRiskCount": 1,
      "aheadCount": 1,
      "aiAccuracy": 94                // % of AI objectives completed on time
    },
    "objectives": [
      {
        "id": "obj123",
        "title": "Accelerate Decision-Making Process",
        "description": "Implement streamlined...",
        "category": "operational",
        "priority": "high",
        "status": "active",
        "ownerId": "user123",
        "ownerName": "Sarah Chen",
        "ownerAvatar": "/uploads/avatars/user123.jpg",
        "businessId": "biz123",
        "assessmentId": "assess123",
        "aiGenerated": true,
        "aiOkrSuggestionId": "sugg123",

        "timeline": {
          "targetYear": 2024,
          "quarters": [3, 4],
          "startDate": "2024-07-01",
          "endDate": "2024-12-31"
        },

        "progress": {
          "percentage": 67,              // Stored in DB
          "expectedPercentage": 73,      // Calculated
          "statusLabel": "on-track",     // Calculated
          "statusClass": "text-green-600",  // Calculated
          "statusColor": "green",        // Calculated
          "weekProgress": {
            "current": 21,               // Calculated
            "total": 26                  // Calculated
          }
        },

        "weakAreaReference": {
          "dimension": "speed",
          "category": "execution",
          "currentScore": 54,
          "targetScore": 75,
          "improvementExpected": 21
        },

        "keyResults": [
          {
            "id": "kr1",
            "title": "Reduce decision cycle time",
            "metricType": "number",
            "currentValue": 3.5,
            "targetValue": 3,
            "unit": "days",
            "quarter": 3,
            "status": "in_progress",
            "progress": 70,              // Calculated
            "display": "3.5 → 3 days"   // Calculated
          },
          {
            "id": "kr2",
            "title": "Implement framework",
            "metricType": "boolean",
            "currentValue": 1,
            "targetValue": 1,
            "unit": "completed",
            "quarter": 3,
            "status": "completed",
            "progress": 100,
            "display": "✓ Done"
          },
          {
            "id": "kr3",
            "title": "Achieve 80% satisfaction",
            "metricType": "percentage",
            "currentValue": 65,
            "targetValue": 80,
            "unit": "%",
            "quarter": 4,
            "status": "in_progress",
            "progress": 81,
            "display": "65% → 80%"
          }
        ],

        "summary": {
          "totalKRs": 3,
          "completedKRs": 1,
          "onTrackKRs": 2,
          "atRiskKRs": 0
        },

        "createdAt": "2024-07-01T10:00:00.000Z",
        "updatedAt": "2024-10-19T20:00:00.000Z"
      }
      // ... more objectives
    ],
    "priorityOverview": [
      // Top 4 objectives by priority (subset of objectives array)
      {
        "id": "obj123",
        "title": "Accelerate Decision-Making Process",
        "progress": 67,
        "statusLabel": "on-track",
        "priority": "high",
        "priorityLabel": "High Priority",
        "priorityColor": "orange"
      }
      // ... 3 more
    ]
  }
}
```

**Caching**: Cache for 5 minutes (Redis or in-memory)

**Performance**: < 300ms

---

### **7. List Objectives**

**Endpoint**: `GET /api/objectives/list`

**Description**: Filtered, sorted, paginated list of objectives.

**Access**: All authenticated users (role-based filtering applied)

**Query Parameters**:
```javascript
{
  status: 'active' | 'completed' | 'archived',
  priority: 'high' | 'medium' | 'low',
  category: 'revenue' | 'operational' | 'market' | 'team' | 'customer' | 'product',
  quarter: 1-4,
  year: number,
  owner_id: string,           // Filter by owner (managers+ can filter by team)
  ai_generated: boolean,      // Only AI-generated objectives
  sort: 'priority' | 'progress' | 'created_at' | 'updated_at',
  order: 'asc' | 'desc',
  limit: number (default: 20, max: 100),
  offset: number (default: 0)
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "objectives": [
      // Same structure as dashboard objectives
    ],
    "pagination": {
      "total": 47,
      "limit": 20,
      "offset": 0,
      "hasMore": true,
      "nextOffset": 20
    },
    "filters": {
      "applied": {
        "status": "active",
        "priority": "high"
      },
      "available": {
        "statuses": ["active", "completed", "archived"],
        "priorities": ["high", "medium", "low"],
        "categories": ["revenue", "operational", ...]
      }
    }
  }
}
```

---

### **8. Update Objective Progress**

**Endpoint**: `PUT /api/objectives/:objectiveId/progress`

**Description**: Update key result values and recalculate objective progress.

**Access**: Objective owner or Manager+

**URL Parameters**:
- `objectiveId` (string, required)

**Request Body**:
```json
{
  "keyResultUpdates": [
    {
      "keyResultId": "kr1",
      "currentValue": 3.2,
      "notes": "Improved by 10% this week"
    },
    {
      "keyResultId": "kr3",
      "currentValue": 70
    }
  ],
  "updateNote": "Weekly progress update"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "objectiveId": "obj123",
    "previousProgress": 67,
    "newProgress": 72,
    "updatedKeyResults": [
      {
        "keyResultId": "kr1",
        "previousValue": 3.5,
        "newValue": 3.2,
        "progress": 80
      },
      {
        "keyResultId": "kr3",
        "previousValue": 65,
        "newValue": 70,
        "progress": 87
      }
    ],
    "updatedAt": "2025-10-19T21:00:00.000Z"
  }
}
```

**Business Logic**:
1. Validate user has permission to update
2. Update key result `current_value`
3. Recalculate KR progress percentage
4. Update KR status (in_progress, completed, at_risk)
5. Recalculate objective `progress_percentage` (average of all KRs)
6. Log update in progress history
7. Return updated objective

---

## 🧠 **iBRAIN AI INSIGHTS ENDPOINTS**

### **9. Get iBrain Priorities**

**Endpoint**: `GET /api/objectives/ibrain/priorities/:userId`

**Description**: AI-calculated priority analysis for top 4 objectives requiring focus.

**Access**: All users (if business.ibrain_enabled = true)

**URL Parameters**:
- `userId` (string, required)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "priorities": [
      {
        "objectiveId": "obj123",
        "title": "Improve Customer Satisfaction Score",
        "progress": 45,
        "statusText": "45% complete • Needs attention",
        "severity": "critical",      // critical | high | medium | low
        "label": "Critical Focus",
        "riskScore": 85,              // AI-calculated 0-100
        "riskFactors": {
          "timeRisk": 40,             // Behind schedule
          "velocityRisk": 25,         // Slowing down
          "dependencyRisk": 15,       // Blocking others
          "impactScore": 5            // Business impact multiplier
        },
        "recommendations": [
          "Prioritize response time for maximum impact",
          "Allocate 2 more team members to support queue",
          "Review escalation procedures"
        ],
        "priorityOrder": 1
      },
      {
        "objectiveId": "obj124",
        "title": "Accelerate Revenue Growth",
        "progress": 67,
        "statusText": "67% complete • On track",
        "severity": "high",
        "label": "High Priority",
        "riskScore": 62,
        "riskFactors": {
          "timeRisk": 20,
          "velocityRisk": 15,
          "dependencyRisk": 10,
          "impactScore": 17
        },
        "recommendations": [
          "Increase focus on MRR growth",
          "Monitor conversion rate trends"
        ],
        "priorityOrder": 2
      },
      {
        "objectiveId": "obj125",
        "title": "Enhance Team Productivity",
        "progress": 78,
        "statusText": "78% complete • Ahead",
        "severity": "medium",
        "label": "Medium Priority",
        "riskScore": 45,
        "priorityOrder": 3
      },
      {
        "objectiveId": "obj126",
        "title": "Optimize Operations",
        "progress": 85,
        "statusText": "85% complete • Ahead",
        "severity": "low",
        "label": "Low Priority",
        "riskScore": 28,
        "priorityOrder": 4
      }
    ],
    "generatedAt": "2025-10-19T21:00:00.000Z",
    "algorithm": "iBrain Priority Scoring v2.1",
    "cacheExpiry": "2025-10-19T22:00:00.000Z"
  }
}
```

**Algorithm**:
```javascript
riskScore = timeRisk + velocityRisk + dependencyRisk + (impactScore * 5)

// timeRisk: Based on progress vs expected
// Behind by 20%+ = 40 points
// Behind by 10-20% = 20 points
// On track = 0 points

// velocityRisk: Based on progress trend
// Slowing down = 25 points
// Steady = 10 points
// Accelerating = 0 points

// dependencyRisk: Based on blocking relationships
// Blocking high-priority objectives = 15 points
// Blocking medium-priority = 10 points
// Not blocking = 0 points

// impactScore: Business impact (1-10) × 5
```

**Caching**: 1 hour (Redis)

**Error Responses**:
```json
// 403 - iBrain disabled
{
  "success": false,
  "error": "iBrain features are disabled for this organization.",
  "code": "IBRAIN_DISABLED"
}
```

---

### **10. Get iBrain Insights**

**Endpoint**: `GET /api/objectives/ibrain/insights/:userId`

**Description**: AI-generated insights for Focus Area, Quick Win, and Forecast.

**Access**: All users (if business.ibrain_enabled = true)

**URL Parameters**:
- `userId` (string, required)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "focusArea": {
      "objectiveId": "obj123",
      "objectiveTitle": "Customer Satisfaction",
      "message": "Customer Satisfaction needs attention. Prioritize response time for maximum impact. Current progress is 30% behind schedule.",
      "confidence": 85,              // AI confidence 0-100
      "reasoning": "Based on velocity trend analysis and historical completion patterns",
      "actionItems": [
        "Allocate 2 more team members to support queue",
        "Implement automated response system",
        "Review escalation procedures"
      ],
      "expectedImpact": "Could improve by 15% in 2 weeks"
    },
    "quickWin": {
      "objectiveId": "obj125",
      "objectiveTitle": "Team Productivity",
      "message": "Team Productivity is 20% ahead of schedule. Consider reallocating resources to Customer Satisfaction objective.",
      "confidence": 92,
      "reasoning": "Sustained velocity above expected rate for 3 consecutive weeks",
      "potentialImpact": "Could accelerate at-risk objective by 15%",
      "suggestedReallocation": {
        "fromObjective": "obj125",
        "toObjective": "obj123",
        "resourceType": "team_member",
        "amount": 1
      }
    },
    "forecast": {
      "objectiveId": "obj124",
      "objectiveTitle": "Revenue Growth",
      "message": "Revenue Growth will complete 2 weeks ahead of schedule at current velocity. Expected completion: Nov 15, 2025.",
      "confidence": 78,
      "reasoning": "Consistent weekly progress of 12% over past 4 weeks",
      "projectedCompletionDate": "2025-11-15",
      "scheduledCompletionDate": "2025-11-30",
      "weeksAhead": 2,
      "currentVelocity": "+12% per week",
      "requiredVelocity": "+8% per week"
    },
    "generatedAt": "2025-10-19T21:00:00.000Z",
    "algorithm": "iBrain Insights Engine v3.2",
    "cacheExpiry": "2025-10-19T22:00:00.000Z"
  }
}
```

**Caching**: 1 hour (Redis)

**Manual Refresh**: `GET /api/objectives/ibrain/insights/:userId?refresh=true`

---

### **11. Refresh iBrain Insights**

**Endpoint**: `POST /api/objectives/ibrain/refresh/:userId`

**Description**: Manually trigger iBrain insights regeneration.

**Access**: All users (if business.ibrain_enabled = true)

**Rate Limit**: 3 requests per hour per user

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "refreshed": true,
    "generatedAt": "2025-10-19T21:05:00.000Z",
    "remainingRefreshes": 2,
    "resetAt": "2025-10-19T22:00:00.000Z"
  }
}
```

**Error Responses**:
```json
// 429 - Rate limit exceeded
{
  "success": false,
  "error": "iBrain refresh limit exceeded. Please wait before refreshing again.",
  "resetAt": "2025-10-19T22:00:00.000Z"
}
```

---

### **12. Request AI Help for Objective**

**Endpoint**: `POST /api/objectives/:objectiveId/ai-help`

**Description**: Request AI-generated recommendations for an at-risk objective.

**Access**: Objective owner or Manager+

**URL Parameters**:
- `objectiveId` (string, required)

**Request Body**: None required

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "objectiveId": "obj123",
    "objectiveTitle": "Customer Satisfaction",
    "currentStatus": "at-risk",
    "analysis": {
      "progressGap": 25,             // % behind expected
      "timeRemaining": "8 weeks",
      "velocityRequired": "+15% per week",
      "currentVelocity": "+5% per week",
      "bottlenecks": [
        "Long response time (avg 48 hours)",
        "High ticket volume in support queue",
        "Limited automation for common issues"
      ]
    },
    "recommendations": [
      {
        "action": "Hire 2 additional support specialists",
        "priority": "high",
        "estimatedImpact": "+10% progress in 2 weeks",
        "effort": "high",
        "timeline": "2-3 weeks to implement"
      },
      {
        "action": "Implement chatbot for common questions",
        "priority": "medium",
        "estimatedImpact": "+5% progress in 4 weeks",
        "effort": "medium",
        "timeline": "3-4 weeks to implement"
      },
      {
        "action": "Create FAQ knowledge base",
        "priority": "medium",
        "estimatedImpact": "+3% progress in 1 week",
        "effort": "low",
        "timeline": "1 week to implement"
      }
    ],
    "predictedOutcome": {
      "withoutChanges": "Will complete at 75% in 8 weeks",
      "withRecommendations": "Will complete at 90%+ in 8 weeks",
      "confidence": 82
    },
    "generatedAt": "2025-10-19T21:10:00.000Z"
  }
}
```

---

## ⚠️ **ERROR HANDLING**

### **Standard Error Format**

All errors follow this format:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",           // Optional machine-readable code
  "details": [...],               // Optional validation details
  "timestamp": "2025-10-19T21:00:00.000Z"
}
```

### **HTTP Status Codes**

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful request |
| 201 | Created | Resource created (objectives approved) |
| 400 | Bad Request | Validation errors, invalid parameters |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | AI service down, database unavailable |

### **Error Codes**

```javascript
// Authentication/Authorization
AUTH_TOKEN_MISSING
AUTH_TOKEN_INVALID
AUTH_TOKEN_EXPIRED
PERMISSION_DENIED
ROLE_INSUFFICIENT

// Validation
VALIDATION_FAILED
REQUIRED_FIELD_MISSING
INVALID_FIELD_VALUE
INVALID_FIELD_TYPE

// Resources
RESOURCE_NOT_FOUND
ASSESSMENT_NOT_FOUND
OBJECTIVE_NOT_FOUND
SUGGESTION_NOT_FOUND

// Business Logic
NO_WEAK_AREAS
ALREADY_APPROVED
ALREADY_DISMISSED
IBRAIN_DISABLED

// External Services
AI_SERVICE_UNAVAILABLE
AI_GENERATION_FAILED
DATABASE_UNAVAILABLE

// Rate Limiting
RATE_LIMIT_EXCEEDED
REFRESH_LIMIT_EXCEEDED
```

---

## ⏱️ **RATE LIMITING**

### **Global Limits**
- 100 requests per minute per user
- 1000 requests per hour per business

### **Endpoint-Specific Limits**

| Endpoint | Limit |
|----------|-------|
| POST /api/ai-okr/generate | 10 per hour per user |
| POST /api/objectives/ibrain/refresh | 3 per hour per user |
| POST /api/objectives/:id/ai-help | 20 per hour per user |
| All other endpoints | 100 per minute per user |

### **Rate Limit Headers**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634673600
```

---

## 📦 **RESPONSE FORMAT STANDARDS**

### **Success Response**
```json
{
  "success": true,
  "data": {
    // Response payload
  }
}
```

### **List Response with Pagination**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "limit": 20,
      "offset": 0,
      "hasMore": true,
      "nextOffset": 20
    }
  }
}
```

### **Empty Response**
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "total": 0,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

## 🔧 **IMPLEMENTATION CHECKLIST**

### **Backend**
- [ ] Create `server/routes/ai-okr.js` with 5 endpoints
- [ ] Extend `server/routes/objectives.js` with 7 new endpoints
- [ ] Implement validation middleware for all POST/PUT
- [ ] Implement role guards for restricted endpoints
- [ ] Add rate limiting middleware
- [ ] Add caching for dashboard and iBrain endpoints
- [ ] Write integration tests for all endpoints
- [ ] Document all endpoints with JSDoc comments

### **Frontend**
- [ ] Create API client wrapper classes
- [ ] Implement error handling for all API calls
- [ ] Add loading states for async operations
- [ ] Implement retry logic for failed requests
- [ ] Add request cancellation for navigation
- [ ] Cache responses in localStorage where appropriate

---

**END OF API SPECIFICATION**

**Next Document**: WEEK_4_DATA_FLOW.md (showing data sources and calculations)
