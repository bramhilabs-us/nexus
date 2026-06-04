# ⚙️ ADMIN JOURNEY - Platform Management & System Configuration

**Version**: 2.0.0
**Created**: 2025-10-22
**Updated**: 2025-10-24
**Persona**: Admin / Platform Administrator
**Primary Goals**: Configure platform, manage users, maintain system, ensure security

---

## 📊 JOURNEY OVERVIEW

**North Star**: System Setup → User Management → Configuration → Monitoring → Maintenance

**Frequency**: Initial setup + Daily monitoring + As-needed configuration
**Key Screens**: Admin Panel, User Management, System Settings, Logs
**Critical Story**: **ADMIN-001**: Manage Question Library (Week 1)

### Technical Architecture Alignment

**Primary Blocks Used**:
- **Block 1**: Core Platform Administration (Required)
- **Block 7**: System Monitoring & Analytics

**Backend Engines**:
- **IAM Engine**: User management and permissions
- **Assessment Engine**: Question library and template management
- **Observer Engine**: System logs and monitoring
- **Scoring Engine**: Usage analytics and metrics

**Admin Privileges**:
- Super-admin access across all `business_id` contexts
- Direct database access for maintenance
- System-level configuration rights

---

## 🗺️ END-TO-END JOURNEY WITH TECHNICAL INTEGRATION

### PHASE 1: INITIAL SYSTEM SETUP (Week 1)

#### Step 1: Manage Question Library
- **Story**: **ADMIN-001**: Manage Question Library
- **Screen**: `admin-panel.html` → "Question Library" section
- **API Endpoint**: `POST /api/admin/questions`
- **Request**:
  ```json
  {
    "action": "create",
    "question": {
      "text": "How quickly can your team pivot strategy?",
      "dimension": "speed",
      "sub_dimension": "decision_making",
      "scale": {
        "type": "numeric",
        "min": 1,
        "max": 10  // Configurable scale
      },
      "tags": ["agility", "leadership"],
      "metadata": {
        "author": "admin_001",
        "version": "1.0",
        "language": "en",
        "industries": ["all"]  // or specific industries
      }
    }
  }
  ```
- **Backend Flow**:
  1. IAM Engine validates admin privileges
  2. Assessment Engine validates question structure
  3. Check for duplicate questions
  4. Store in question library with UUID
  5. Update all template caches
- **Dynamic Configuration**:
  ```javascript
  // No hardcoded question counts
  const QuestionLibraryConfig = {
    minQuestionsPerDimension: process.env.MIN_QUESTIONS || 5,
    maxQuestionsPerDimension: process.env.MAX_QUESTIONS || 100,
    defaultQuestionsPerDimension: process.env.DEFAULT_QUESTIONS || 15,
    allowCustomDimensions: true,
    maxDimensions: 10,
    scaleTypes: ['numeric', 'likert', 'boolean', 'text'],
    supportedLanguages: ['en', 'es', 'fr', 'de']
  };
  ```
- **Bulk Import**:
  ```json
  POST /api/admin/questions/bulk
  {
    "format": "csv",
    "data": "base64_encoded_csv",
    "validation": {
      "check_duplicates": true,
      "auto_tag": true,
      "default_dimension": "intelligence"
    }
  }
  ```
- **Data Models**: `Question`, `QuestionLibrary`, `QuestionVersion`, `QuestionTag`
- **Outcome**: Fully customizable question library

#### Step 2: Create Global Templates
- **Story**: **ADMIN-002**: Create Global Templates
- **Screen**: `assessment-creation-flow.html` (admin mode)
- **API Endpoint**: `POST /api/admin/templates/global`
- **Request**:
  ```json
  {
    "name": "Default SSI Assessment",
    "scope": "global",
    "settings": {
      "question_count": {
        "total": 45,  // Configurable
        "per_dimension": "flexible",  // or specific counts
        "min_required": 20  // Minimum for valid assessment
      },
      "dimensions": {
        "speed": {"weight": 33.33, "questions": "auto"},
        "strength": {"weight": 33.33, "questions": "auto"},
        "intelligence": {"weight": 33.34, "questions": "auto"}
      },
      "time_limits": {
        "per_question": null,  // No limit
        "total": 3600  // 1 hour total (optional)
      }
    },
    "flags": {
      "is_default": true,
      "is_recommended": true,
      "auto_assign_new_businesses": true
    }
  }
  ```
- **Template Versioning**:
  ```javascript
  class GlobalTemplateManager {
    async createTemplate(config) {
      // No hardcoded defaults
      const template = {
        ...config,
        version: '1.0',
        created_by: 'admin',
        created_at: new Date(),
        is_active: true,
        usage_count: 0
      };

      // Store with full version control
      await this.versionControl.track(template);
      return await db.globalTemplates.create(template);
    }
  }
  ```
- **Data Models**: `GlobalTemplate`, `TemplateSettings`, `TemplateFlags`
- **Outcome**: Flexible global templates for all businesses

---

### PHASE 2: USER MANAGEMENT (Week 11)

#### Step 3: Manage Users
- **Story**: **ADMIN-003**: Manage Users
- **Screen**: `09_admin.html` → "Users" tab
- **API Endpoint**: `GET /api/admin/users`
- **Request**:
  ```json
  {
    "filters": {
      "business_id": "all",  // or specific business
      "role": "all",
      "status": "all",
      "search": "john",
      "last_login": "30_days"
    },
    "pagination": {
      "page": 1,
      "limit": 50,  // Configurable
      "sort": "last_login_desc"
    }
  }
  ```
- **Response**:
  ```json
  {
    "users": [
      {
        "id": "user_001",
        "email": "john@co.com",
        "name": "John Smith",
        "role": "MANAGER",
        "businesses": [
          {"id": "biz_001", "name": "Acme Inc", "role": "MANAGER"}
        ],
        "status": "active",
        "last_login": "2025-10-24T10:30:00Z",
        "created_at": "2025-01-15T09:00:00Z",
        "metadata": {
          "login_count": 145,
          "tasks_completed": 89,
          "assessments_taken": 3
        }
      }
    ],
    "pagination": {
      "total": 523,
      "pages": 11,
      "current": 1
    }
  }
  ```
- **User Management Actions**:
  ```javascript
  // Role change with audit
  async function changeUserRole(userId, newRole, adminId) {
    const oldUser = await getUser(userId);

    await db.transaction(async (trx) => {
      // Update role
      await trx.users.update(userId, { role: newRole });

      // Audit log
      await trx.auditLog.insert({
        action: 'ROLE_CHANGE',
        admin_id: adminId,
        user_id: userId,
        changes: {
          old_role: oldUser.role,
          new_role: newRole
        },
        timestamp: new Date()
      });

      // Update permissions cache
      await permissionCache.invalidate(userId);
    });
  }
  ```
- **Data Models**: `User`, `UserRole`, `AuditLog`, `UserMetadata`
- **Outcome**: Complete user lifecycle management

#### Step 4: Bulk User Import
- **Story**: **ADMIN-007**: Bulk User Import
- **Screen**: `09_admin.html` → "Bulk Import" button
- **API Endpoint**: `POST /api/admin/users/bulk-import`
- **Request**:
  ```json
  {
    "format": "csv",
    "data": "base64_encoded_csv",
    "settings": {
      "send_welcome_emails": true,
      "default_role": "EMPLOYEE",
      "default_password": "auto_generate",
      "validation": {
        "check_duplicates": true,
        "validate_emails": true,
        "max_users": 1000  // Configurable limit
      }
    }
  }
  ```
- **Bulk Processing**:
  ```javascript
  async function bulkImportUsers(csvData, settings) {
    const users = parseCSV(csvData);
    const validation = await validateUsers(users, settings);

    if (validation.errors.length > 0) {
      return { status: 'error', errors: validation.errors };
    }

    // Process in batches for performance
    const batchSize = settings.batchSize || 50;
    const results = [];

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const batchResults = await processBatch(batch, settings);
      results.push(...batchResults);
    }

    // Send welcome emails asynchronously
    if (settings.send_welcome_emails) {
      await emailQueue.addBulk(
        results.map(user => ({
          type: 'welcome',
          to: user.email,
          data: user
        }))
      );
    }

    return { status: 'success', imported: results.length };
  }
  ```
- **Data Models**: `BulkImport`, `ImportLog`, `UserBatch`
- **Outcome**: Efficient mass user onboarding

#### Step 5: Deactivate Users
- **Story**: **ADMIN-008**: Deactivate Users
- **Screen**: `09_admin.html` → User detail → "Deactivate" button
- **API Endpoint**: `PUT /api/admin/users/{user_id}/deactivate`
- **Request**:
  ```json
  {
    "user_id": "user_001",
    "deactivation": {
      "reason": "employee_departure",
      "effective_date": "2025-10-24",
      "actions": {
        "revoke_access": true,
        "reassign_tasks": true,
        "reassign_to": "user_002",
        "preserve_data": true,
        "anonymize_after_days": 365  // GDPR compliance
      }
    }
  }
  ```
- **Deactivation Flow**:
  ```javascript
  async function deactivateUser(userId, options) {
    await db.transaction(async (trx) => {
      // 1. Update user status
      await trx.users.update(userId, {
        status: 'inactive',
        deactivated_at: options.effective_date
      });

      // 2. Revoke all sessions
      if (options.actions.revoke_access) {
        await trx.sessions.deleteWhere({ user_id: userId });
        await invalidateTokens(userId);
      }

      // 3. Reassign open tasks
      if (options.actions.reassign_tasks) {
        await trx.tasks.updateWhere(
          { assignee_id: userId, status: 'open' },
          { assignee_id: options.actions.reassign_to }
        );
      }

      // 4. Schedule data anonymization
      if (options.actions.anonymize_after_days) {
        await scheduleJob('anonymize_user', {
          user_id: userId,
          run_at: addDays(new Date(), options.actions.anonymize_after_days)
        });
      }

      // 5. Audit log
      await trx.auditLog.insert({
        action: 'USER_DEACTIVATED',
        user_id: userId,
        details: options,
        timestamp: new Date()
      });
    });
  }
  ```
- **Data Models**: `UserDeactivation`, `DataRetention`, `AnonymizationSchedule`
- **Outcome**: Secure, compliant user offboarding

---

### PHASE 3: SYSTEM CONFIGURATION (Week 11)

#### Step 6: Configure System Settings
- **Story**: **ADMIN-004**: Configure System Settings
- **Screen**: `09_admin.html` → "Settings" tab
- **API Endpoint**: `PUT /api/admin/settings`
- **Request**:
  ```json
  {
    "email": {
      "provider": "mailjet",
      "api_key": "encrypted_key",
      "sender": "noreply@karvia.com",
      "daily_limit": 10000,  // Configurable
      "rate_limit": {
        "per_second": 10,
        "per_minute": 300
      }
    },
    "authentication": {
      "session_timeout": 86400,  // 24 hours in seconds
      "password_policy": {
        "min_length": 8,
        "require_uppercase": true,
        "require_lowercase": true,
        "require_number": true,
        "require_special": true,
        "expiry_days": 90,  // Optional password expiry
        "history_count": 5  // Prevent reuse of last 5 passwords
      },
      "mfa": {
        "enabled": false,
        "methods": ["totp", "sms"],
        "required_for_roles": ["ADMIN", "EXEC"]
      }
    },
    "assessment": {
      "default_duration_days": 14,
      "allow_draft": true,
      "auto_save_interval": 30,  // seconds
      "reminder_schedule": [7, 3, 1],  // days before due
      "max_retakes": 1
    },
    "ai_integration": {
      "provider": "openai",
      "api_key": "encrypted_customer_key",
      "model": "gpt-4",
      "temperature": 0.7,
      "max_tokens": 2000,
      "rate_limit": {
        "per_minute": 60,
        "per_day": 1000
      }
    },
    "data_retention": {
      "assessments": 730,  // days (2 years)
      "tasks": 365,
      "logs": 90,
      "auto_archive": true,
      "archive_storage": "s3"
    }
  }
  ```
- **Settings Validation**:
  ```javascript
  class SystemSettingsManager {
    async updateSettings(newSettings, adminId) {
      // Validate all settings
      const validation = await this.validateSettings(newSettings);
      if (!validation.valid) {
        throw new ValidationError(validation.errors);
      }

      // Test critical settings before applying
      if (newSettings.email) {
        await this.testEmailSettings(newSettings.email);
      }
      if (newSettings.ai_integration) {
        await this.testAIConnection(newSettings.ai_integration);
      }

      // Apply with rollback capability
      const backup = await this.backupCurrentSettings();
      try {
        await this.applySettings(newSettings);
        await this.auditLog(adminId, 'SETTINGS_UPDATE', newSettings);
      } catch (error) {
        await this.rollback(backup);
        throw error;
      }
    }
  }
  ```
- **Data Models**: `SystemSettings`, `SettingsHistory`, `SettingsValidation`
- **Outcome**: Fully configurable platform settings

#### Step 7: Configure Email Templates
- **Story**: **ADMIN-009**: Configure Email Templates
- **Screen**: `09_admin.html` → "Email Templates" section
- **API Endpoint**: `PUT /api/admin/email-templates/{template_id}`
- **Request**:
  ```json
  {
    "template_id": "assessment_invitation",
    "template": {
      "name": "Assessment Invitation",
      "subject": "Complete your {{quarter}} {{year}} SSI Assessment",
      "body_html": "<html>...</html>",
      "body_text": "Plain text version...",
      "variables": [
        {"key": "recipient_name", "required": true},
        {"key": "assessment_name", "required": true},
        {"key": "due_date", "required": true},
        {"key": "quarter", "required": false},
        {"key": "year", "required": false}
      ],
      "settings": {
        "track_opens": true,
        "track_clicks": true,
        "include_unsubscribe": true
      },
      "localization": {
        "default": "en",
        "translations": {
          "es": {
            "subject": "Complete su evaluación SSI de {{quarter}} {{year}}"
          }
        }
      }
    }
  }
  ```
- **Template Processing**:
  ```javascript
  class EmailTemplateEngine {
    async renderTemplate(templateId, data, locale = 'en') {
      const template = await this.getTemplate(templateId, locale);

      // Validate required variables
      const missing = template.variables
        .filter(v => v.required && !data[v.key])
        .map(v => v.key);

      if (missing.length > 0) {
        throw new Error(`Missing required variables: ${missing.join(', ')}`);
      }

      // Render with Handlebars or similar
      const rendered = {
        subject: this.render(template.subject, data),
        body_html: this.render(template.body_html, data),
        body_text: this.render(template.body_text, data)
      };

      return rendered;
    }
  }
  ```
- **Data Models**: `EmailTemplate`, `TemplateVariable`, `TemplateLocalization`
- **Outcome**: Customizable, multi-language email communications

---

### PHASE 4: MONITORING & MAINTENANCE (Week 11)

#### Step 9: View System Logs
- **Story**: **ADMIN-005**: View System Logs
- **Screen**: `09_admin.html` → "System Logs" tab
- **API Endpoint**: `GET /api/admin/logs`
- **Request**:
  ```json
  {
    "filters": {
      "level": ["ERROR", "WARN"],
      "module": ["authentication", "assessment"],
      "date_range": {
        "from": "2025-10-23T00:00:00Z",
        "to": "2025-10-24T23:59:59Z"
      },
      "search": "timeout"
    },
    "pagination": {
      "limit": 100,
      "offset": 0
    },
    "streaming": true  // WebSocket for real-time
  }
  ```
- **Log Streaming**:
  ```javascript
  // Real-time log streaming via WebSocket
  class LogStreamManager {
    streamLogs(filters, socket) {
      // Subscribe to log events
      const subscription = logEmitter.on('log', (log) => {
        if (this.matchesFilters(log, filters)) {
          socket.emit('log', this.formatLog(log));
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        subscription.unsubscribe();
      });

      // Send recent logs
      this.getRecentLogs(filters).then(logs => {
        socket.emit('logs:initial', logs);
      });
    }
  }
  ```
- **Alert Configuration**:
  ```json
  POST /api/admin/alerts
  {
    "name": "High Error Rate",
    "condition": {
      "metric": "error_count",
      "operator": "greater_than",
      "threshold": 10,
      "window": "1_hour"
    },
    "actions": [
      {"type": "email", "to": ["admin@company.com"]},
      {"type": "slack", "channel": "#alerts"},
      {"type": "pagerduty", "service": "platform"}
    ]
  }
  ```
- **Data Models**: `SystemLog`, `LogAlert`, `AlertAction`
- **Outcome**: Comprehensive system monitoring

#### Step 10: System Health Dashboard
- **Story**: **ADMIN-010**: System Health Dashboard
- **Screen**: `09_admin.html` → "Health" tab
- **API Endpoint**: `GET /api/admin/health/dashboard`
- **Response**:
  ```json
  {
    "timestamp": "2025-10-24T10:30:00Z",
    "status": "healthy",
    "metrics": {
      "performance": {
        "api_response_time": {
          "p50": 45,
          "p95": 120,
          "p99": 350
        },
        "database": {
          "connections_active": 45,
          "connections_max": 100,
          "query_time_avg": 12
        },
        "cache": {
          "hit_rate": 0.92,
          "memory_used": "1.2GB",
          "memory_max": "4GB"
        }
      },
      "resources": {
        "cpu": {
          "usage": 35,
          "cores": 8
        },
        "memory": {
          "used_gb": 12.5,
          "total_gb": 32,
          "percentage": 39
        },
        "disk": {
          "used_gb": 120,
          "total_gb": 500,
          "percentage": 24
        }
      },
      "services": {
        "database": {"status": "healthy", "latency": 2},
        "redis": {"status": "healthy", "latency": 1},
        "email": {"status": "healthy", "latency": 150},
        "ai": {"status": "healthy", "latency": 500}
      },
      "errors": {
        "last_hour": 3,
        "last_24h": 45,
        "last_7d": 312
      }
    }
  }
  ```
- **Health Check System**:
  ```javascript
  class HealthMonitor {
    async runHealthChecks() {
      const checks = await Promise.allSettled([
        this.checkDatabase(),
        this.checkRedis(),
        this.checkEmailService(),
        this.checkAIService(),
        this.checkDiskSpace(),
        this.checkMemory()
      ]);

      const status = checks.every(c => c.status === 'fulfilled' && c.value.healthy)
        ? 'healthy'
        : checks.some(c => c.status === 'rejected')
        ? 'critical'
        : 'degraded';

      return {
        status,
        checks: this.formatCheckResults(checks),
        timestamp: new Date()
      };
    }
  }
  ```
- **Data Models**: `HealthMetric`, `ServiceStatus`, `PerformanceMetric`
- **Outcome**: Real-time system health visibility

---

## 🔗 ADMIN TECHNICAL CAPABILITIES

### Permission System
```javascript
const AdminPermissions = {
  SUPER_ADMIN: {
    users: ['create', 'read', 'update', 'delete', 'bulk_import'],
    settings: ['read', 'update'],
    logs: ['read', 'export'],
    templates: ['create', 'read', 'update', 'delete'],
    monitoring: ['read', 'configure_alerts'],
    database: ['maintenance', 'backup']
  },
  SYSTEM_ADMIN: {
    users: ['read', 'update'],
    settings: ['read'],
    logs: ['read'],
    templates: ['read'],
    monitoring: ['read']
  }
};
```

### Audit Logging
```javascript
// All admin actions are audited
async function auditAdminAction(adminId, action, details) {
  await db.auditLog.insert({
    admin_id: adminId,
    action: action,
    details: details,
    ip_address: request.ip,
    user_agent: request.headers['user-agent'],
    timestamp: new Date(),
    session_id: request.sessionId
  });
}
```

---

## 📊 USER STORIES BY WEEK WITH TECHNICAL COMPLEXITY

### Week 1: Setup
- ✅ ADMIN-001: Manage Question Library [API: High - dynamic config]
- ✅ ADMIN-002: Create Global Templates [API: Medium - versioning]

### Week 11: Full Admin Panel
- ⬜ ADMIN-003: Manage Users [API: High - multi-tenant]
- ⬜ ADMIN-004: Configure System Settings [API: High - validation]
- ⬜ ADMIN-005: View System Logs [WebSocket: High - streaming]
- ⬜ ADMIN-006: Manage Permissions [API: Medium - RBAC]
- ⬜ ADMIN-007: Bulk User Import [API: High - batch processing]
- ⬜ ADMIN-008: Deactivate Users [API: Medium - data retention]
- ⬜ ADMIN-009: Configure Email Templates [API: Medium - templating]
- ⬜ ADMIN-010: System Health Dashboard [API: High - metrics]

**Total Admin Stories**: 10 (2 complete, 8 not started)
**Technical Complexity**: 6 High, 4 Medium

---

## 🔧 TECHNICAL REQUIREMENTS

### Performance Requirements
- Admin dashboard load: < 2 seconds
- Log search: < 1 second for 1M records
- Bulk import: 100 users/second
- Health checks: Every 30 seconds
- Real-time logs: < 100ms latency

### Data Requirements
- Store 90 days of logs (configurable)
- Support 10,000+ users
- Handle 1000+ concurrent admin operations
- Audit trail for 2 years

### Security Requirements
- MFA for admin accounts
- IP whitelisting option
- Session recording for critical actions
- Encrypted storage for sensitive settings
- Rate limiting on admin APIs

### Integration Points
- Email service (Mailjet)
- AI service (OpenAI)
- Monitoring (Datadog/NewRelic)
- Log aggregation (ELK stack)
- Backup service (S3)

---

## 🔗 RELATED DOCUMENTATION

- [MVP_TECHNICAL_ARCHITECTURE_V5.md](../../KARVIA_STRATEGY/02_TECHNICAL_OVERVIEW/MVP_TECHNICAL_ARCHITECTURE_V5.md)
- [MASTER_DEV_LIST_V5.md](../../KARVIA_STRATEGY/03_DEVELOPMENT_ROADMAP/MASTER_DEV_LIST_V5.md)
- [System Administration Guide](../../admin_guide.md)
- [API Documentation](../../api_docs.md)

---

**Version**: 2.0.0
**Last Updated**: 2025-10-24
**Status**: ✅ Technical Architecture Added - Ready for implementation (No hardcoding)