# KARVIA Pro API - Threat Model & Mitigations

<!-- @GENOME T2-ARC-017 | ACTIVE | 2026-04-05 | parent:T1-KRV-001 | auto:/coding | linked:/audit -->

> **Part of KARVIA Engine** - See [KARVIA_ENGINE_VISION.md](../../1-VISION/KARVIA_ENGINE_VISION.md) for engine overview.

## Table of Contents

- [Overview](#overview)
- [Threat Modeling Methodology](#threat-modeling-methodology)
- [Asset Inventory](#asset-inventory)
- [Threat Categories](#threat-categories)
- [Authentication Threats](#authentication-threats)
- [Authorization Threats](#authorization-threats)
- [Data Threats](#data-threats)
- [Network Threats](#network-threats)
- [Application Threats](#application-threats)
- [Infrastructure Threats](#infrastructure-threats)
- [Third-Party Threats](#third-party-threats)
- [Insider Threats](#insider-threats)
- [Supply Chain Threats](#supply-chain-threats)
- [Business Logic Threats](#business-logic-threats)
- [Incident Response](#incident-response)
- [Security Metrics](#security-metrics)

---

## Overview

This document provides a comprehensive threat model for the KARVIA Pro platform, identifying potential security threats and their mitigations using the STRIDE methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).

### Threat Modeling Scope

```
┌─────────────────────────────────────────────────────────────┐
│                     KARVIA Pro Platform                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer                                             │
│  • React Web App                                            │
│  • Mobile Apps (iOS/Android)                                │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                  │
│  • REST API (Node.js/Express)                               │
│  • Authentication/Authorization                             │
│  • Business Logic                                           │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  • PostgreSQL Database                                      │
│  • File Storage (S3)                                        │
│  • Cache (Redis)                                            │
├─────────────────────────────────────────────────────────────┤
│  External Services                                          │
│  • Email Service (SendGrid)                                 │
│  • AI/ML Services (OpenAI)                                  │
│  • Analytics                                                │
└─────────────────────────────────────────────────────────────┘
```

### Risk Assessment Matrix

| Likelihood | Impact: Low | Impact: Medium | Impact: High | Impact: Critical |
|------------|-------------|----------------|--------------|------------------|
| **Very Likely** | Medium | High | Critical | Critical |
| **Likely** | Low | Medium | High | Critical |
| **Possible** | Low | Medium | High | High |
| **Unlikely** | Low | Low | Medium | High |
| **Rare** | Low | Low | Low | Medium |

**Risk Levels:**
- **Critical**: Immediate action required
- **High**: Address within 1 week
- **Medium**: Address within 1 month
- **Low**: Address in regular development cycle

---

## Threat Modeling Methodology

### STRIDE Framework

| Category | Definition | Example |
|----------|------------|---------|
| **Spoofing** | Impersonating someone or something else | User pretends to be another user |
| **Tampering** | Modifying data or code | Attacker modifies database records |
| **Repudiation** | Claiming to not have performed an action | User denies creating an objective |
| **Information Disclosure** | Exposing information to unauthorized parties | Database leak exposes user data |
| **Denial of Service** | Making system unavailable | API flooding causes downtime |
| **Elevation of Privilege** | Gaining unauthorized capabilities | Employee gains admin access |

### Threat Analysis Process

```
1. Identify Assets
   ↓
2. Decompose System
   ↓
3. Identify Threats (STRIDE)
   ↓
4. Assess Risk (Likelihood × Impact)
   ↓
5. Design Mitigations
   ↓
6. Implement Controls
   ↓
7. Test & Validate
   ↓
8. Monitor & Review
```

---

## Asset Inventory

### Critical Assets

| Asset | Classification | CIA Impact | Business Impact |
|-------|----------------|------------|-----------------|
| **User Credentials** | Critical | High/High/High | Account takeover, data breach |
| **Company Data** | Critical | High/High/High | Business continuity, compliance |
| **JWT Secret Keys** | Critical | High/High/Low | Authentication bypass |
| **Database** | Critical | High/High/High | Complete data loss |
| **API Keys** | High | High/Medium/Low | Unauthorized access |
| **User PII** | High | High/High/Medium | Privacy violation, GDPR |
| **OKR Data** | High | Medium/High/Medium | Business intelligence leak |
| **Assessment Results** | Medium | Medium/High/Medium | Strategic advantage loss |
| **Session Tokens** | Medium | Medium/Medium/Low | Account hijacking |

**CIA Triad:**
- **C**: Confidentiality - Protection from unauthorized access
- **I**: Integrity - Protection from unauthorized modification
- **A**: Availability - System uptime and accessibility

---

## Threat Categories

### Summary of Identified Threats

| Category | # of Threats | Critical | High | Medium | Low |
|----------|--------------|----------|------|--------|-----|
| Authentication | 12 | 3 | 5 | 3 | 1 |
| Authorization | 10 | 2 | 4 | 3 | 1 |
| Data Security | 15 | 4 | 6 | 4 | 1 |
| Network Security | 8 | 1 | 3 | 3 | 1 |
| Application Logic | 14 | 2 | 5 | 5 | 2 |
| Infrastructure | 9 | 2 | 3 | 3 | 1 |
| Third-Party | 7 | 1 | 2 | 3 | 1 |
| Insider Threats | 6 | 2 | 2 | 2 | 0 |
| Supply Chain | 5 | 1 | 2 | 2 | 0 |
| Business Logic | 11 | 2 | 4 | 4 | 1 |
| **Total** | **97** | **20** | **36** | **32** | **9** |

---

## Authentication Threats

### THREAT-AUTH-001: Brute Force Password Attack

**STRIDE Category**: Spoofing
**Risk Level**: High (Likely × High Impact)
**CWE**: CWE-307: Improper Restriction of Excessive Authentication Attempts

**Threat Description:**
Attacker attempts to guess user passwords through automated repeated login attempts.

**Attack Scenario:**
```
1. Attacker obtains user email list (from public source or data breach)
2. Attacker uses automated tool (Hydra, Burp Intruder) to try common passwords
3. Attacker tries 1000s of passwords per user
4. Successfully guesses weak password "Password123!"
5. Gains unauthorized access to account
```

**Mitigation Strategy:**

```typescript
// Rate limiting on auth endpoints
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: true,
  standardHeaders: true,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Try again in 15 minutes.'
    }
  },
  // Custom key generator to rate limit by email + IP
  keyGenerator: (req) => {
    return `${req.body.email}:${req.ip}`;
  }
});

app.post('/api/auth/login', authLimiter, loginHandler);

// Account lockout after failed attempts
async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user) {
    // Use same error message to prevent user enumeration
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
    });
  }

  // Check if account is locked
  if (user.locked_until && user.locked_until > new Date()) {
    const minutesLeft = Math.ceil((user.locked_until.getTime() - Date.now()) / 60000);
    return res.status(403).json({
      success: false,
      error: {
        code: 'ACCOUNT_LOCKED',
        message: `Account locked. Try again in ${minutesLeft} minutes.`
      }
    });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    // Increment failed attempts
    const failedAttempts = (user.failed_login_attempts || 0) + 1;

    if (failedAttempts >= 5) {
      // Lock account for 30 minutes
      await db('users')
        .where({ id: user.id })
        .update({
          failed_login_attempts: failedAttempts,
          locked_until: new Date(Date.now() + 30 * 60 * 1000),
          updated_at: new Date()
        });

      // Send security alert
      await sendSecurityAlert(user, 'Account locked due to failed login attempts');

      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account locked due to too many failed attempts. Check your email.'
        }
      });
    }

    await db('users')
      .where({ id: user.id })
      .update({
        failed_login_attempts: failedAttempts,
        updated_at: new Date()
      });

    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
    });
  }

  // Reset failed attempts on successful login
  await db('users')
    .where({ id: user.id })
    .update({
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: new Date(),
      updated_at: new Date()
    });

  // Generate tokens and return...
}
```

**Additional Controls:**
- ✅ Enforce strong password policy (min 8 chars, complexity requirements)
- ✅ CAPTCHA after 3 failed attempts
- ✅ Email notification on failed login attempts
- ✅ Implement 2FA for high-privilege accounts
- ✅ Monitor for distributed brute force attacks (multiple IPs, same user)

**Testing:**
```bash
# Test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done

# Expected: First 5 succeed (with 401), next 5 get 429 (rate limited)
```

---

### THREAT-AUTH-002: JWT Token Theft

**STRIDE Category**: Spoofing, Information Disclosure
**Risk Level**: Critical (Possible × Critical Impact)
**CWE**: CWE-522: Insufficiently Protected Credentials

**Threat Description:**
Attacker steals JWT access token to impersonate legitimate user.

**Attack Vectors:**
1. **XSS**: Steal token from localStorage via injected JavaScript
2. **Man-in-the-Middle**: Intercept token over unencrypted connection
3. **Browser Extension**: Malicious extension reads localStorage
4. **Physical Access**: Access token from unlocked device
5. **Session Fixation**: Force user to use attacker-controlled token

**Mitigation Strategy:**

```typescript
// 1. Use HttpOnly cookies for refresh tokens (XSS protection)
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,        // Cannot be accessed via JavaScript
  secure: true,          // HTTPS only
  sameSite: 'strict',    // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/api/auth/refresh'
});

// 2. Short-lived access tokens (1 hour)
const accessTokenPayload = {
  sub: user.id,
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
  // ...
};

// 3. Token binding to prevent token replay
const accessTokenPayload = {
  // ...
  deviceFingerprint: hashDeviceInfo(req),  // Bind to device
  ipAddress: req.ip,                       // Bind to IP (with tolerance)
  jti: uuidv4()                            // Unique token ID
};

// 4. Validate token binding on each request
function validateTokenBinding(req: AuthenticatedRequest): boolean {
  const token = req.user!;
  const currentDevice = hashDeviceInfo(req);
  const currentIP = req.ip;

  // Strict device check
  if (token.deviceFingerprint !== currentDevice) {
    return false;
  }

  // Tolerant IP check (allow IP changes within same subnet)
  if (!isSameSubnet(token.ipAddress, currentIP)) {
    // Log suspicious activity
    auditService.logSuspiciousActivity(token.sub, 'ip_mismatch', {
      tokenIP: token.ipAddress,
      requestIP: currentIP
    });
    return false;
  }

  return true;
}

// 5. Token revocation via version number
interface User {
  id: string;
  token_version: number; // Increment to invalidate all tokens
  // ...
}

async function validateAccessToken(token: string): Promise<AccessTokenPayload> {
  const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;

  // Check if token version matches user's current version
  const user = await getUserById(decoded.sub);
  if (!user || user.token_version !== decoded.tokenVersion) {
    throw new Error('Token has been revoked');
  }

  return decoded;
}

// Revoke all tokens on password change
async function changePassword(userId: string, newPassword: string): Promise<void> {
  await db.transaction(async (trx) => {
    // Update password
    await trx('users')
      .where({ id: userId })
      .update({
        password_hash: await bcrypt.hash(newPassword, 10),
        token_version: db.raw('token_version + 1'), // Invalidate all tokens
        updated_at: new Date()
      });

    // Invalidate all refresh token families
    await trx('refresh_token_families')
      .where({ user_id: userId })
      .update({ invalidated_at: new Date() });
  });

  // Send notification
  await sendSecurityAlert(userId, 'Password changed - all sessions logged out');
}
```

**Additional Controls:**
- ✅ HTTPS everywhere (enforce with HSTS)
- ✅ Content Security Policy to prevent XSS
- ✅ Subresource Integrity for CDN scripts
- ✅ Regular token rotation (refresh every hour)
- ✅ Detect and alert on token reuse
- ✅ Anomaly detection (unusual location, device, behavior)

---

### THREAT-AUTH-003: Session Fixation

**STRIDE Category**: Spoofing
**Risk Level**: Medium (Unlikely × High Impact)
**CWE**: CWE-384: Session Fixation

**Threat Description:**
Attacker forces user to use a session token controlled by the attacker.

**Attack Scenario:**
```
1. Attacker obtains valid session token
2. Attacker tricks user into using that token (via phishing link)
3. User authenticates using attacker's token
4. Attacker can now access user's session
```

**Mitigation Strategy:**

```typescript
// Generate new token on login (don't reuse existing)
async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // Validate credentials...
  const user = await authenticateUser(email, password);

  // ALWAYS generate NEW tokens on login
  // Never accept or reuse tokens from request
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, {
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });

  // Clear any existing tokens
  res.clearCookie('refreshToken');

  // Set new token
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    data: {
      accessToken,
      user: sanitizeUser(user)
    }
  });
}

// Regenerate session on privilege escalation
async function elevatePrivileges(req: AuthenticatedRequest, res: Response) {
  // Re-authenticate before privilege escalation
  const { password } = req.body;
  const user = await getUserById(req.user!.sub);

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_PASSWORD', message: 'Invalid password' }
    });
  }

  // Generate new tokens with elevated privileges
  const newAccessToken = await generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user, {
    userAgent: req.headers['user-agent'],
    ip: req.ip
  });

  // Invalidate old tokens
  await incrementTokenVersion(user.id);

  res.cookie('refreshToken', newRefreshToken, { /* ... */ });
  res.json({ success: true, data: { accessToken: newAccessToken } });
}
```

**Additional Controls:**
- ✅ Generate new session ID on authentication state change
- ✅ Include session creation timestamp in token
- ✅ Validate session age (reject if created before login)
- ✅ Bind session to device fingerprint

---

### THREAT-AUTH-004: Credential Stuffing

**STRIDE Category**: Spoofing
**Risk Level**: High (Likely × High Impact)
**CWE**: CWE-307: Improper Restriction of Excessive Authentication Attempts

**Threat Description:**
Attacker uses leaked credentials from other breaches to attempt login.

**Attack Scenario:**
```
1. Attacker obtains credentials from previous breach (LinkedIn, Dropbox, etc.)
2. Attacker tries those credentials on KARVIA Pro
3. Users who reused passwords are compromised
```

**Mitigation Strategy:**

```typescript
// Check credentials against known breach databases
import { pwnedPassword } from 'hibp';

async function validatePasswordStrength(password: string): Promise<{
  isStrong: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  // Check against haveibeenpwned
  const breachCount = await pwnedPassword(password);
  if (breachCount > 0) {
    issues.push(`This password has appeared in ${breachCount} data breaches`);
  }

  // Other validations...
  if (password.length < 8) {
    issues.push('Password must be at least 8 characters');
  }

  return {
    isStrong: issues.length === 0,
    issues
  };
}

// Force password change if compromised
async function checkPasswordCompromise(userId: string): Promise<void> {
  const user = await getUserById(userId);

  // Periodically check if password is compromised
  const isCompromised = await pwnedPassword(user.password_hash);

  if (isCompromised) {
    await db('users')
      .where({ id: userId })
      .update({
        requires_password_change: true,
        updated_at: new Date()
      });

    await sendSecurityAlert(user, 'Your password was found in a data breach. Please change it immediately.');
  }
}

// Detect credential stuffing patterns
async function detectCredentialStuffing(): Promise<void> {
  // Monitor for multiple failed logins across different accounts from same IP
  const suspiciousIPs = await db('audit_logs')
    .where({
      action: 'login',
      access_granted: false
    })
    .where('timestamp', '>', db.raw("NOW() - INTERVAL '1 hour'"))
    .groupBy('ip_address')
    .having(db.raw('COUNT(DISTINCT user_id) > ?'), [10])  // 10+ different users
    .select('ip_address', db.raw('COUNT(DISTINCT user_id) as user_count'));

  for (const { ip_address } of suspiciousIPs) {
    // Block IP temporarily
    await blockIP(ip_address, 24 * 60 * 60); // 24 hours

    // Alert security team
    await alertSecurityTeam('Credential stuffing detected', { ip: ip_address });
  }
}
```

**Additional Controls:**
- ✅ Monitor for velocity anomalies (many logins, different users, same IP)
- ✅ Require email verification on first login from new device
- ✅ Implement 2FA for sensitive accounts
- ✅ Use CAPTCHA for suspected automated login attempts
- ✅ Notify users of logins from new locations/devices

---

## Authorization Threats

### THREAT-AUTHZ-001: Privilege Escalation via Role Manipulation

**STRIDE Category**: Elevation of Privilege
**Risk Level**: Critical (Unlikely × Critical Impact)
**CWE**: CWE-269: Improper Privilege Management

**Threat Description:**
Attacker modifies their role to gain unauthorized privileges.

**Attack Scenario:**
```json
// Malicious request to update user profile
PUT /api/users/me
{
  "firstName": "John",
  "role": "CONSULTANT"  // Attempting to elevate to admin
}
```

**Mitigation Strategy:**

```typescript
// Never trust role from client input
async function updateUserProfile(req: AuthenticatedRequest, res: Response) {
  const userId = req.user!.sub;
  const updates = req.body;

  // Explicitly reject role changes from this endpoint
  if (updates.role || updates.company_id || updates.token_version) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN_FIELD',
        message: 'Cannot modify role, company_id, or token_version'
      }
    });
  }

  // Whitelist allowed fields
  const allowedFields = ['first_name', 'last_name', 'notification_preferences'];
  const sanitizedUpdates = Object.keys(updates)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  await db('users')
    .where({ id: userId })
    .update({
      ...sanitizedUpdates,
      updated_at: new Date()
    });

  res.json({ success: true });
}

// Separate endpoint for role changes (admin only)
async function updateUserRole(req: AuthenticatedRequest, res: Response) {
  const requestor = req.user!;
  const targetUserId = req.params.userId;
  const { newRole } = req.body;

  // Only CONSULTANT and BUSINESS_OWNER can change roles
  if (![UserRole.CONSULTANT, UserRole.BUSINESS_OWNER].includes(requestor.role)) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'INSUFFICIENT_PERMISSIONS',
        message: 'You do not have permission to change user roles'
      }
    });
  }

  const targetUser = await getUserById(targetUserId);

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found' }
    });
  }

  // BUSINESS_OWNER can only change roles within their company
  if (requestor.role === UserRole.BUSINESS_OWNER) {
    if (targetUser.company_id !== requestor.companyId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CROSS_TENANT_ACCESS',
          message: 'Cannot modify users from other companies'
        }
      });
    }

    // BUSINESS_OWNER cannot create CONSULTANT
    if (newRole === UserRole.CONSULTANT) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CANNOT_CREATE_CONSULTANT',
          message: 'Cannot assign CONSULTANT role'
        }
      });
    }
  }

  // Audit role change
  await auditService.logAccess(
    requestor,
    'role_change',
    'users',
    targetUserId,
    req
  );

  // Update role
  await db('users')
    .where({ id: targetUserId })
    .update({
      role: newRole,
      token_version: db.raw('token_version + 1'), // Invalidate sessions
      updated_at: new Date()
    });

  // Notify user of role change
  await sendNotification(targetUser, {
    type: 'role_changed',
    message: `Your role has been changed to ${newRole}`,
    changedBy: requestor.email
  });

  res.json({ success: true });
}
```

**Additional Controls:**
- ✅ Immutable fields in database (role changes require explicit SQL)
- ✅ Audit all role changes
- ✅ Require re-authentication for sensitive operations
- ✅ Implement approval workflow for role escalation
- ✅ Alert security team on admin role assignments

---

### THREAT-AUTHZ-002: Horizontal Privilege Escalation (IDOR)

**STRIDE Category**: Information Disclosure, Elevation of Privilege
**Risk Level**: High (Likely × High Impact)
**CWE**: CWE-639: Authorization Bypass Through User-Controlled Key

**Threat Description:**
Attacker accesses resources belonging to other users at same privilege level.

**Attack Scenario:**
```
GET /api/objectives/550e8400-e29b-41d4-a716-446655440000
// Accessing another user's objective without authorization check
```

**Mitigation Strategy:**

```typescript
// Always validate ownership before returning resource
async function getObjective(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;
  const objectiveId = req.params.id;

  // Fetch with automatic tenant filtering
  const objective = await objectivesRepository.findById(objectiveId);

  if (!objective) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Objective not found' }
    });
  }

  // Verify user can access this objective
  const canAccess = await authorizationService.canAccess({
    user,
    resource: objective,
    action: 'objectives:read'
  });

  if (!canAccess) {
    // Return 404 instead of 403 to prevent resource enumeration
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Objective not found' }
    });
  }

  res.json({ success: true, data: objective });
}

// Use parameterized queries with user context
async function getUserObjectives(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;

  // Query automatically scoped to user's accessible objectives
  let query = db('objectives')
    .where({ company_id: user.companyId, deleted_at: null });

  // Apply role-based filtering
  switch (user.role) {
    case UserRole.EMPLOYEE:
      // Only see own objectives
      query = query.where({ owner_id: user.sub });
      break;

    case UserRole.MANAGER:
      // See team objectives
      const teamMemberIds = await getTeamMemberIds(user.sub);
      query = query.whereIn('owner_id', [...teamMemberIds, user.sub]);
      break;

    case UserRole.EXECUTIVE:
    case UserRole.BUSINESS_OWNER:
      // See all company objectives (already filtered by company_id)
      break;

    case UserRole.CONSULTANT:
      // See all (no additional filter)
      break;
  }

  const objectives = await query.select('*');
  res.json({ success: true, data: objectives });
}

// Prevent ID enumeration
async function listUserIds(req: AuthenticatedRequest, res: Response) {
  // ❌ BAD: Exposes sequential/predictable IDs
  const users = await db('users').select('id', 'email');

  // ✅ GOOD: Use UUIDs (non-sequential, non-guessable)
  // Already using UUIDs in schema
}
```

**Additional Controls:**
- ✅ Use UUIDs instead of sequential IDs
- ✅ Implement object-level authorization on every access
- ✅ Return 404 instead of 403 for unauthorized resources (prevent enumeration)
- ✅ Log all IDOR attempts for security monitoring
- ✅ Implement rate limiting on resource access endpoints

---

### THREAT-AUTHZ-003: Vertical Privilege Escalation

**STRIDE Category**: Elevation of Privilege
**Risk Level**: Critical (Unlikely × Critical Impact)
**CWE**: CWE-863: Incorrect Authorization

**Threat Description:**
Lower-privileged user accesses higher-privileged functionality.

**Attack Scenario:**
```
// EMPLOYEE attempting to access admin endpoint
GET /api/admin/companies
Authorization: Bearer <employee_token>
```

**Mitigation Strategy:**

```typescript
// Enforce role-based access at middleware level
app.get('/api/admin/companies',
  authenticate,                          // Verify valid token
  requireRole([UserRole.CONSULTANT]),   // Enforce role
  adminController.listCompanies
);

// Double-check permissions in controller
async function listCompanies(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;

  // Defense in depth: verify role again
  if (user.role !== UserRole.CONSULTANT) {
    await auditService.logDenial(
      user,
      'admin:read',
      'companies',
      undefined,
      'Insufficient role',
      req
    );

    return res.status(403).json({
      success: false,
      error: {
        code: 'INSUFFICIENT_ROLE',
        message: 'This endpoint requires CONSULTANT role'
      }
    });
  }

  const companies = await db('companies')
    .where({ deleted_at: null })
    .select('*');

  res.json({ success: true, data: companies });
}

// Implement permission checks at database level (Row-Level Security)
// See MULTI_TENANCY_SECURITY.md for RLS policies

// Prevent access to admin endpoints via URL manipulation
const adminRoutes = [
  '/api/admin/*',
  '/api/system/*',
  '/api/companies/*/settings'
];

app.use(adminRoutes, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    });
  }

  if (![UserRole.CONSULTANT, UserRole.BUSINESS_OWNER].includes(req.user.role)) {
    await auditService.logDenial(
      req.user,
      'admin:access',
      'admin_endpoint',
      req.path,
      'Insufficient role',
      req
    );

    return res.status(403).json({
      success: false,
      error: {
        code: 'ADMIN_ACCESS_REQUIRED',
        message: 'This endpoint requires admin privileges'
      }
    });
  }

  next();
});
```

**Additional Controls:**
- ✅ Separate admin interface on different subdomain (admin.karvia.pro)
- ✅ Require re-authentication for admin actions
- ✅ Implement 2FA for admin accounts
- ✅ Alert on admin endpoint access by non-admin users
- ✅ Implement time-based admin access (require re-auth every 30 minutes)

---

## Data Threats

### THREAT-DATA-001: SQL Injection

**STRIDE Category**: Tampering, Information Disclosure
**Risk Level**: Critical (Possible × Critical Impact)
**CWE**: CWE-89: SQL Injection

**Threat Description:**
Attacker injects malicious SQL code to manipulate database queries.

**Attack Scenario:**
```sql
-- Malicious search query
GET /api/objectives?search=' OR '1'='1' --

-- Resulting SQL (if not properly sanitized):
SELECT * FROM objectives WHERE title LIKE '%' OR '1'='1' --%'
-- Returns all objectives, bypassing filters
```

**Mitigation Strategy:**

```typescript
// ✅ ALWAYS use parameterized queries (Knex.js)
async function searchObjectives(search: string, companyId: string): Promise<Objective[]> {
  // ✅ GOOD: Parameterized query
  return db('objectives')
    .where({ company_id: companyId, deleted_at: null })
    .where('title', 'LIKE', `%${search}%`)  // Knex automatically escapes
    .select('*');

  // ❌ BAD: String concatenation (NEVER DO THIS)
  // const sql = `SELECT * FROM objectives WHERE title LIKE '%${search}%'`;
  // return db.raw(sql);
}

// Use query builder instead of raw SQL
async function getObjectivesByStatus(status: string, companyId: string): Promise<Objective[]> {
  // ✅ GOOD: Query builder with parameters
  return db('objectives')
    .where({
      company_id: companyId,
      status: status,  // Automatically parameterized
      deleted_at: null
    })
    .select('*');
}

// If raw SQL is absolutely necessary, use bindings
async function complexQuery(userId: string, startDate: Date): Promise<any[]> {
  return db.raw(`
    SELECT o.*, COUNT(g.id) as goals_count
    FROM objectives o
    LEFT JOIN goals g ON g.objective_id = o.id AND g.deleted_at IS NULL
    WHERE o.owner_id = ?
    AND o.start_date >= ?
    AND o.deleted_at IS NULL
    GROUP BY o.id
  `, [userId, startDate]);  // ← Parameterized bindings
}

// Input validation
function validateSearchInput(search: string): { valid: boolean; error?: string } {
  // Max length
  if (search.length > 100) {
    return { valid: false, error: 'Search query too long' };
  }

  // Reject SQL keywords in search
  const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', '--', ';'];
  const upperSearch = search.toUpperCase();

  for (const keyword of sqlKeywords) {
    if (upperSearch.includes(keyword)) {
      return { valid: false, error: 'Invalid search query' };
    }
  }

  return { valid: true };
}
```

**Additional Controls:**
- ✅ Use ORM/query builder (Knex) for all database access
- ✅ Implement input validation and sanitization
- ✅ Use principle of least privilege for database users
- ✅ Disable dangerous SQL features (xp_cmdshell, etc.)
- ✅ Regular security code reviews focusing on database queries
- ✅ Use prepared statements for all dynamic queries
- ✅ Enable SQL injection detection in WAF

---

### THREAT-DATA-002: Mass Assignment

**STRIDE Category**: Tampering
**Risk Level**: High (Likely × High Impact)
**CWE**: CWE-915: Improperly Controlled Modification of Dynamically-Determined Object Attributes

**Threat Description:**
Attacker modifies unintended object properties by including extra fields in request.

**Attack Scenario:**
```json
// Malicious request to create objective
POST /api/objectives
{
  "title": "Test Objective",
  "company_id": "other-company-uuid",  // Trying to create in different company
  "is_template": true,                  // Trying to set admin-only field
  "created_at": "2020-01-01"           // Trying to manipulate timestamp
}
```

**Mitigation Strategy:**

```typescript
// Whitelist allowed fields
interface CreateObjectiveDTO {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  owner_id?: string;
  parent_id?: string;
}

async function createObjective(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;
  const input = req.body;

  // Validate input against DTO
  const validation = validateCreateObjectiveDTO(input);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: validation.errors
      }
    });
  }

  // Explicitly construct object with only allowed fields
  const objectiveData: Partial<Objective> = {
    id: uuidv4(),
    company_id: user.companyId,  // Force user's company (never trust client)
    owner_id: input.owner_id || user.sub,
    title: input.title,
    description: input.description,
    start_date: new Date(input.start_date),
    end_date: new Date(input.end_date),
    parent_id: input.parent_id || null,
    progress: 0,  // Always start at 0
    status: 'active',  // Always start as active
    created_at: new Date(),  // Server-side timestamp
    updated_at: new Date(),
    created_by: user.sub
  };

  // Validate owner belongs to same company
  if (objectiveData.owner_id !== user.sub) {
    const owner = await getUserById(objectiveData.owner_id!);
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

  const objective = await db('objectives')
    .insert(objectiveData)
    .returning('*');

  res.status(201).json({ success: true, data: objective[0] });
}

// Use class-validator for DTO validation
import { IsString, IsDate, IsOptional, IsUUID, Length } from 'class-validator';
import { plainToClass } from 'class-transformer';

class CreateObjectiveDTO {
  @IsString()
  @Length(1, 500)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  description?: string;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsOptional()
  @IsUUID()
  owner_id?: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;
}

async function validateCreateObjectiveDTO(input: any): Promise<{
  valid: boolean;
  errors?: string[];
  dto?: CreateObjectiveDTO;
}> {
  const dto = plainToClass(CreateObjectiveDTO, input);
  const errors = await validate(dto);

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors.map(e => Object.values(e.constraints || {}).join(', '))
    };
  }

  return { valid: true, dto };
}
```

**Additional Controls:**
- ✅ Never use `Object.assign()` or spread operator with user input directly
- ✅ Define explicit DTOs for all endpoints
- ✅ Use validation library (class-validator, Joi, Yup)
- ✅ Implement database column-level permissions
- ✅ Log attempts to set forbidden fields
- ✅ Use TypeScript strict mode for compile-time checks

---

### THREAT-DATA-003: Sensitive Data Exposure in Logs

**STRIDE Category**: Information Disclosure
**Risk Level**: Medium (Likely × Medium Impact)
**CWE**: CWE-532: Insertion of Sensitive Information into Log File

**Threat Description:**
Sensitive data (passwords, tokens, PII) exposed in application logs.

**Attack Scenario:**
```typescript
// ❌ BAD: Logging sensitive data
console.log('Login attempt:', req.body);  // Contains password!
// Output: Login attempt: { email: 'user@example.com', password: 'secretPass123' }

logger.info('User created', user);  // Contains password_hash!
```

**Mitigation Strategy:**

```typescript
// Sanitize data before logging
function sanitizeForLogging(obj: any): any {
  const sensitiveFields = [
    'password',
    'password_hash',
    'token',
    'accessToken',
    'refreshToken',
    'credit_card',
    'ssn',
    'api_key',
    'secret'
  ];

  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sanitized = { ...obj };

  for (const key of Object.keys(sanitized)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLogging(sanitized[key]);
    }
  }

  return sanitized;
}

// Custom logger with automatic sanitization
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Wrapper that sanitizes
export function logInfo(message: string, meta?: any) {
  logger.info(message, meta ? sanitizeForLogging(meta) : undefined);
}

export function logError(message: string, error?: Error, meta?: any) {
  logger.error(message, {
    error: {
      message: error?.message,
      stack: error?.stack
    },
    ...(meta ? sanitizeForLogging(meta) : {})
  });
}

// Usage
async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // ✅ GOOD: Only log non-sensitive data
  logInfo('Login attempt', { email, ip: req.ip });

  const user = await authenticateUser(email, password);

  if (!user) {
    logInfo('Login failed', { email, reason: 'invalid_credentials' });
    return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS' } });
  }

  // ✅ GOOD: Sanitize before logging
  logInfo('Login successful', {
    userId: user.id,
    email: user.email,
    role: user.role
    // password_hash NOT logged
  });

  // Generate tokens...
}

// Don't log full request/response
app.use((req, res, next) => {
  // ❌ BAD
  // logger.info('Request', { body: req.body, headers: req.headers });

  // ✅ GOOD
  logInfo('Request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
    // Body and headers NOT logged
  });

  next();
});
```

**Additional Controls:**
- ✅ Never log passwords, tokens, or PII
- ✅ Use structured logging (JSON format)
- ✅ Implement log retention policies
- ✅ Encrypt logs at rest
- ✅ Restrict log file access (chmod 600)
- ✅ Regular log audits to check for leaked secrets
- ✅ Use secret scanning tools on log files

---

### THREAT-DATA-004: Database Backup Exposure

**STRIDE Category**: Information Disclosure
**Risk Level**: Critical (Unlikely × Critical Impact)
**CWE**: CWE-530: Exposure of Backup File to an Unauthorized Control Sphere

**Threat Description:**
Database backups stored insecurely, exposing all company data.

**Mitigation Strategy:**

```typescript
// Encrypt backups before storage
import crypto from 'crypto';
import { S3 } from 'aws-sdk';

const s3 = new S3();

async function createEncryptedBackup(companyId: string): Promise<string> {
  // Export data
  const data = await complianceService.exportTenantData(companyId);
  const jsonData = JSON.stringify(data);

  // Encrypt with AES-256
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(process.env.BACKUP_ENCRYPTION_KEY!, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(jsonData, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Store encrypted backup in S3 with server-side encryption
  const timestamp = new Date().toISOString();
  const backupKey = `backups/${companyId}/${timestamp}.enc`;

  await s3.putObject({
    Bucket: process.env.BACKUP_BUCKET!,
    Key: backupKey,
    Body: JSON.stringify({
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    }),
    ServerSideEncryption: 'AES256',  // S3 server-side encryption
    Metadata: {
      'company-id': companyId,
      'created-at': timestamp
    }
  }).promise();

  // Record backup
  await db('tenant_backups').insert({
    id: uuidv4(),
    company_id: companyId,
    backup_path: backupKey,
    encrypted: true,
    created_at: new Date()
  });

  return backupKey;
}

// Secure backup restoration
async function restoreFromEncryptedBackup(
  companyId: string,
  backupKey: string
): Promise<void> {
  // Verify requester has permission
  // ... (require CONSULTANT role)

  // Download from S3
  const response = await s3.getObject({
    Bucket: process.env.BACKUP_BUCKET!,
    Key: backupKey
  }).promise();

  const backupData = JSON.parse(response.Body!.toString());

  // Decrypt
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(process.env.BACKUP_ENCRYPTION_KEY!, 'salt', 32);
  const iv = Buffer.from(backupData.iv, 'hex');
  const authTag = Buffer.from(backupData.authTag, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(backupData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  const data = JSON.parse(decrypted);

  // Restore to database
  await db.transaction(async (trx) => {
    // ... restore data
  });

  // Audit restore operation
  await auditService.logAccess(
    requestor,
    'backup_restore',
    'company',
    companyId,
    req
  );
}

// Backup retention policy
async function cleanupOldBackups(): Promise<void> {
  const retentionDays = 90;
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

  // Get old backups
  const oldBackups = await db('tenant_backups')
    .where('created_at', '<', cutoffDate)
    .select('*');

  for (const backup of oldBackups) {
    // Delete from S3
    await s3.deleteObject({
      Bucket: process.env.BACKUP_BUCKET!,
      Key: backup.backup_path
    }).promise();

    // Remove record
    await db('tenant_backups')
      .where({ id: backup.id })
      .delete();
  }

  logInfo('Cleaned up old backups', { count: oldBackups.length });
}
```

**Additional Controls:**
- ✅ Encrypt backups at rest (AES-256)
- ✅ Store backups in secure location (S3 with restricted IAM)
- ✅ Implement backup retention policy (90 days)
- ✅ Test backup restoration regularly
- ✅ Audit all backup access
- ✅ Use separate encryption keys for backups
- ✅ Implement backup versioning

---

## Network Threats

### THREAT-NET-001: Man-in-the-Middle (MITM) Attack

**STRIDE Category**: Information Disclosure, Tampering
**Risk Level**: High (Possible × High Impact)
**CWE**: CWE-300: Channel Accessible by Non-Endpoint

**Threat Description:**
Attacker intercepts communication between client and server.

**Mitigation Strategy:**

```typescript
// 1. Enforce HTTPS everywhere
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
  }
  next();
});

// 2. Enable HSTS (HTTP Strict Transport Security)
import helmet from 'helmet';

app.use(helmet.hsts({
  maxAge: 31536000,          // 1 year
  includeSubDomains: true,   // Apply to all subdomains
  preload: true              // Submit to HSTS preload list
}));

// 3. Implement Certificate Pinning (mobile apps)
// iOS (Swift)
/*
func urlSession(
  _ session: URLSession,
  didReceive challenge: URLAuthenticationChallenge,
  completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
) {
  guard let serverTrust = challenge.protectionSpace.serverTrust else {
    completionHandler(.cancelAuthenticationChallenge, nil)
    return
  }

  let pinnedCertificates = [
    // SHA-256 hash of server certificate
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
  ]

  if let serverCertificate = SecTrustGetCertificateAtIndex(serverTrust, 0) {
    let serverCertificateData = SecCertificateCopyData(serverCertificate) as Data
    let serverCertificateHash = serverCertificateData.sha256()

    if pinnedCertificates.contains(serverCertificateHash) {
      completionHandler(.useCredential, URLCredential(trust: serverTrust))
      return
    }
  }

  completionHandler(.cancelAuthenticationChallenge, nil)
}
*/

// 4. Use TLS 1.3
// nginx configuration
/*
ssl_protocols TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
*/

// 5. Subresource Integrity for CDN resources
/*
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>
*/

// 6. Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'sha256-...'"],  // Whitelist specific scripts
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.karvia.pro"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  }
}));
```

**Additional Controls:**
- ✅ Use HTTPS for all communications
- ✅ Implement HSTS with preload
- ✅ Use strong TLS configuration (TLS 1.3, strong ciphers)
- ✅ Implement certificate pinning for mobile apps
- ✅ Regular certificate renewal (Let's Encrypt automation)
- ✅ Monitor certificate expiration
- ✅ Implement Subresource Integrity for external resources

---

### THREAT-NET-002: Distributed Denial of Service (DDoS)

**STRIDE Category**: Denial of Service
**Risk Level**: High (Likely × High Impact)
**CWE**: CWE-400: Uncontrolled Resource Consumption

**Threat Description:**
Attacker floods system with requests to make it unavailable.

**Mitigation Strategy:**

```typescript
// 1. Rate limiting at multiple levels
import rateLimit from 'express-rate-limit';

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,  // 1000 requests per 15 minutes per IP
  message: 'Too many requests from this IP'
});

app.use(globalLimiter);

// Aggressive rate limiting for expensive endpoints
const expensiveLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,  // 10 requests per minute
  skipSuccessfulRequests: false
});

app.post('/api/ai/generate', expensiveLimiter, aiController.generate);

// 2. Request size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// 3. Connection limits
import { Server } from 'http';

const server = new Server(app);
server.maxConnections = 1000;

// 4. Timeout configuration
server.timeout = 30000;  // 30 seconds
server.keepAliveTimeout = 65000;  // 65 seconds
server.headersTimeout = 66000;  // 66 seconds

// 5. Circuit breaker for external services
import CircuitBreaker from 'opossum';

const circuitBreakerOptions = {
  timeout: 3000,          // 3 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000     // Try again after 30 seconds
};

const sendEmailCircuit = new CircuitBreaker(sendEmailFunction, circuitBreakerOptions);

sendEmailCircuit.fallback(() => {
  // Queue for later retry
  return queueEmail();
});

sendEmailCircuit.on('open', () => {
  logError('Email service circuit breaker opened');
});

// 6. Database connection pooling
const knexConfig = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,  // Limit concurrent connections
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000
  }
};

// 7. Graceful shutdown
process.on('SIGTERM', async () => {
  logInfo('SIGTERM received, shutting down gracefully');

  // Stop accepting new requests
  server.close(() => {
    logInfo('HTTP server closed');
  });

  // Close database connections
  await db.destroy();

  process.exit(0);
});
```

**Infrastructure-Level DDoS Protection:**

```yaml
# Cloudflare configuration
# 1. Enable DDoS protection
# 2. Configure rate limiting rules
# 3. Enable Bot Fight Mode
# 4. Configure firewall rules

# AWS WAF rules
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  DDoSProtectionRule:
    Type: AWS::WAFv2::WebACL
    Properties:
      Scope: REGIONAL
      Rules:
        - Name: RateLimitRule
          Priority: 1
          Action:
            Block: {}
          Statement:
            RateBasedStatement:
              Limit: 2000
              AggregateKeyType: IP
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: RateLimitRule
```

**Additional Controls:**
- ✅ Use CDN (Cloudflare) with DDoS protection
- ✅ Implement progressive rate limiting (stricter for unauthenticated)
- ✅ Enable auto-scaling for traffic spikes
- ✅ Monitor traffic patterns and set up alerts
- ✅ Implement CAPTCHA for suspicious traffic
- ✅ Use connection pooling and queuing
- ✅ Implement graceful degradation (disable non-critical features under load)

---

## Business Logic Threats

### THREAT-BIZ-001: OKR Cascade Manipulation

**STRIDE Category**: Tampering, Elevation of Privilege
**Risk Level**: High (Possible × High Impact)
**Business Impact**: Employees could manipulate performance metrics

**Threat Description:**
User manipulates cascade relationships to falsely inflate progress metrics.

**Attack Scenario:**
```
1. Employee creates objective with 100% progress
2. Employee cascades it to manager's objective
3. Manager's objective progress artificially increased
4. Employee appears to be high performer based on false data
```

**Mitigation Strategy:**

```typescript
// 1. Validate cascade permissions
async function cascadeObjective(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;
  const sourceId = req.params.id;
  const { cascadeTargets } = req.body;

  const source = await objectivesRepository.findById(sourceId);

  if (!source) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Source objective not found' }
    });
  }

  // Only owner can cascade
  if (source.owner_id !== user.sub) {
    // Exception for admins
    if (![UserRole.CONSULTANT, UserRole.BUSINESS_OWNER].includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'NOT_OWNER',
          message: 'Only the objective owner can cascade it'
        }
      });
    }
  }

  // Validate cascade direction (can only cascade down hierarchy)
  for (const target of cascadeTargets) {
    const targetUser = await getUserById(target.targetId);

    if (!targetUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TARGET',
          message: `User ${target.targetId} not found`
        }
      });
    }

    // Check hierarchical relationship
    const canCascadeTo = await validateCascadeHierarchy(user, targetUser);

    if (!canCascadeTo) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INVALID_CASCADE_DIRECTION',
          message: 'Can only cascade to direct reports or team members',
          details: {
            targetUserId: target.targetId,
            targetRole: targetUser.role
          }
        }
      });
    }
  }

  // Prevent circular cascades
  for (const target of cascadeTargets) {
    const wouldCreateCycle = await checkForCascadeCycle(
      sourceId,
      target.targetId
    );

    if (wouldCreateCycle) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CIRCULAR_CASCADE',
          message: 'This would create a circular cascade relationship'
        }
      });
    }
  }

  // Create cascade
  const cascadedObjectives = await cascadeService.create(source, cascadeTargets);

  // Audit cascade operation
  await auditService.logAccess(
    user,
    'objective_cascade',
    'objectives',
    sourceId,
    req
  );

  res.status(201).json({ success: true, data: cascadedObjectives });
}

// 2. Validate cascade hierarchy
async function validateCascadeHierarchy(
  requestor: User,
  target: User
): Promise<boolean> {
  // Same company required
  if (requestor.company_id !== target.company_id) {
    return false;
  }

  // Admins can cascade to anyone
  if ([UserRole.CONSULTANT, UserRole.BUSINESS_OWNER].includes(requestor.role)) {
    return true;
  }

  // Executives can cascade to managers/employees
  if (requestor.role === UserRole.EXECUTIVE) {
    return [UserRole.MANAGER, UserRole.EMPLOYEE].includes(target.role);
  }

  // Managers can cascade to their team members
  if (requestor.role === UserRole.MANAGER) {
    const isTeamMember = await teamPermissionsService.isInTeam(
      requestor.id,
      target.id
    );
    return isTeamMember;
  }

  // Employees cannot cascade
  return false;
}

// 3. Detect circular cascades
async function checkForCascadeCycle(
  sourceObjectiveId: string,
  targetUserId: string
): Promise<boolean> {
  // Check if target user owns any parent of source objective
  const ancestors = await getAncestorObjectives(sourceObjectiveId);

  for (const ancestor of ancestors) {
    if (ancestor.owner_id === targetUserId) {
      return true;  // Would create cycle
    }
  }

  return false;
}

// 4. Validate progress calculations
async function updateObjectiveProgress(
  objectiveId: string,
  newProgress: number
): Promise<void> {
  // Manual progress updates only allowed if no children
  const children = await getChildObjectives(objectiveId);

  if (children.length > 0) {
    throw new Error(
      'Cannot manually update progress for objectives with child objectives. ' +
      'Progress is automatically calculated from children.'
    );
  }

  // Validate progress range
  if (newProgress < 0 || newProgress > 100) {
    throw new Error('Progress must be between 0 and 100');
  }

  await db('objectives')
    .where({ id: objectiveId })
    .update({
      progress: newProgress,
      updated_at: new Date()
    });

  // Recalculate parent progress
  const objective = await getObjectiveById(objectiveId);
  if (objective.parent_id) {
    await recalculateParentProgress(objective.parent_id);
  }
}

// 5. Audit cascade changes
async function auditCascadeChange(
  userId: string,
  action: 'create' | 'update' | 'delete',
  cascadeData: any
): Promise<void> {
  await db('cascade_audit_log').insert({
    id: uuidv4(),
    user_id: userId,
    action,
    source_objective_id: cascadeData.sourceId,
    target_objective_id: cascadeData.targetId,
    timestamp: new Date()
  });
}
```

**Additional Controls:**
- ✅ Implement approval workflow for cross-department cascades
- ✅ Limit cascade depth (max 5 levels)
- ✅ Alert on unusual cascade patterns (many cascades in short time)
- ✅ Regular cascade integrity audits
- ✅ Immutable cascade history (soft delete only)

---

### THREAT-BIZ-002: Assessment Score Manipulation

**STRIDE Category**: Tampering, Repudiation
**Risk Level**: High (Possible × High Impact)
**Business Impact**: Falsified strategic assessments affecting business decisions

**Threat Description:**
User manipulates assessment responses or scores to appear more favorable.

**Mitigation Strategy:**

```typescript
// 1. Immutable assessment submissions
async function submitAssessment(req: AuthenticatedRequest, res: Response) {
  const user = req.user!;
  const assessmentId = req.params.id;
  const { responses } = req.body;

  const assessment = await getAssessmentById(assessmentId);

  if (!assessment) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Assessment not found' }
    });
  }

  // Check if already submitted
  if (assessment.status === 'submitted') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'ALREADY_SUBMITTED',
        message: 'Assessment has already been submitted and cannot be modified'
      }
    });
  }

  // Validate all questions answered
  const template = await getAssessmentTemplate(assessment.assessment_type);
  const requiredQuestions = template.questions.filter(q => q.required);

  for (const question of requiredQuestions) {
    const response = responses.find(r => r.questionId === question.id);
    if (!response || !response.answer) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INCOMPLETE_ASSESSMENT',
          message: `Question "${question.text}" is required`
        }
      });
    }
  }

  // Calculate score server-side (never trust client calculation)
  const score = calculateAssessmentScore(template, responses);

  // Atomic update with version check (optimistic locking)
  const updated = await db('assessments')
    .where({
      id: assessmentId,
      status: 'draft',  // Ensure still in draft
      version: assessment.version  // Optimistic lock
    })
    .update({
      responses: JSON.stringify(responses),
      score,
      status: 'submitted',
      submitted_at: new Date(),
      submitted_by: user.sub,
      version: assessment.version + 1,
      updated_at: new Date()
    })
    .returning('*');

  if (updated.length === 0) {
    // Concurrent modification or already submitted
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONCURRENT_MODIFICATION',
        message: 'Assessment was modified by another request'
      }
    });
  }

  // Create immutable audit record
  await db('assessment_submissions').insert({
    id: uuidv4(),
    assessment_id: assessmentId,
    user_id: user.sub,
    responses_snapshot: JSON.stringify(responses),
    score,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
    submitted_at: new Date()
  });

  res.json({ success: true, data: updated[0] });
}

// 2. Server-side score calculation
function calculateAssessmentScore(
  template: AssessmentTemplate,
  responses: AssessmentResponse[]
): number {
  let totalScore = 0;
  let totalWeight = 0;

  for (const question of template.questions) {
    const response = responses.find(r => r.questionId === question.id);

    if (!response) continue;

    const questionScore = calculateQuestionScore(question, response);
    const weight = question.weight || 1;

    totalScore += questionScore * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? (totalScore / totalWeight) : 0;
}

function calculateQuestionScore(
  question: AssessmentQuestion,
  response: AssessmentResponse
): number {
  switch (question.type) {
    case 'multiple_choice':
      const option = question.options.find(o => o.id === response.answer);
      return option?.score || 0;

    case 'scale':
      return parseFloat(response.answer) || 0;

    case 'yes_no':
      return response.answer === 'yes' ? question.yesScore : question.noScore;

    default:
      return 0;
  }
}

// 3. Prevent retroactive modifications
async function getAssessmentHistory(assessmentId: string): Promise<AssessmentHistory[]> {
  return db('assessment_submissions')
    .where({ assessment_id: assessmentId })
    .orderBy('submitted_at', 'desc')
    .select('*');
}

// 4. Detect suspicious patterns
async function detectAssessmentAnoma lies(): Promise<Anomaly[]> {
  const anomalies: Anomaly[] = [];

  // Find assessments with perfect scores
  const perfectScores = await db('assessments')
    .where({ score: 100, status: 'submitted' })
    .count('* as count')
    .first();

  if (parseInt(perfectScores.count) > 0) {
    anomalies.push({
      type: 'perfect_scores',
      count: parseInt(perfectScores.count),
      severity: 'medium'
    });
  }

  // Find rapid submissions (< 5 minutes for 20+ questions)
  const rapidSubmissions = await db('assessments')
    .whereRaw(`
      status = 'submitted' AND
      EXTRACT(EPOCH FROM (submitted_at - created_at)) < 300 AND
      jsonb_array_length(responses) > 20
    `)
    .select('*');

  if (rapidSubmissions.length > 0) {
    anomalies.push({
      type: 'rapid_submissions',
      count: rapidSubmissions.length,
      severity: 'high',
      details: rapidSubmissions.map(a => a.id)
    });
  }

  return anomalies;
}
```

**Additional Controls:**
- ✅ Randomize question order
- ✅ Implement minimum time per question
- ✅ Require verification for outlier scores
- ✅ Peer review for high-stakes assessments
- ✅ Track revision history with signatures
- ✅ Regular statistical analysis for outliers

---

## Incident Response

### Incident Response Plan

```typescript
// src/services/incident-response.service.ts

interface SecurityIncident {
  id: string;
  type: IncidentType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedAssets: string[];
  detectedAt: Date;
  detectedBy: 'automated' | 'user_report' | 'security_team';
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
  assignedTo?: string;
  resolvedAt?: Date;
}

enum IncidentType {
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  DATA_BREACH = 'data_breach',
  DDOS_ATTACK = 'ddos_attack',
  MALWARE = 'malware',
  PHISHING = 'phishing',
  INSIDER_THREAT = 'insider_threat',
  CREDENTIAL_COMPROMISE = 'credential_compromise',
  VULNERABILITY_EXPLOIT = 'vulnerability_exploit'
}

class IncidentResponseService {
  /**
   * Detect and create incident
   */
  async detectIncident(
    type: IncidentType,
    severity: string,
    description: string,
    metadata: any
  ): Promise<SecurityIncident> {
    const incident: SecurityIncident = {
      id: uuidv4(),
      type,
      severity: severity as any,
      description,
      affectedAssets: metadata.affectedAssets || [],
      detectedAt: new Date(),
      detectedBy: 'automated',
      status: 'detected'
    };

    // Store incident
    await db('security_incidents').insert(incident);

    // Alert based on severity
    if (severity === 'critical' || severity === 'high') {
      await this.alertSecurityTeam(incident);
    }

    // Auto-contain if critical
    if (severity === 'critical') {
      await this.autoContain(incident);
    }

    return incident;
  }

  /**
   * Automatic containment actions
   */
  private async autoContain(incident: SecurityIncident): Promise<void> {
    switch (incident.type) {
      case IncidentType.CREDENTIAL_COMPROMISE:
        // Revoke all tokens for affected users
        for (const userId of incident.affectedAssets) {
          await this.revokeAllUserTokens(userId);
          await this.notifyUser(userId, 'credential_compromise');
        }
        break;

      case IncidentType.DDOS_ATTACK:
        // Enable aggressive rate limiting
        await this.enableDDoSProtection();
        break;

      case IncidentType.DATA_BREACH:
        // Lock affected accounts
        for (const userId of incident.affectedAssets) {
          await this.lockUserAccount(userId);
        }
        break;
    }

    await db('security_incidents')
      .where({ id: incident.id })
      .update({
        status: 'contained',
        updated_at: new Date()
      });
  }

  /**
   * Security team notification
   */
  private async alertSecurityTeam(incident: SecurityIncident): Promise<void> {
    const securityTeam = await this.getSecurityTeamEmails();

    await sendEmail({
      to: securityTeam,
      subject: `[${incident.severity.toUpperCase()}] Security Incident: ${incident.type}`,
      body: `
        A security incident has been detected:

        Type: ${incident.type}
        Severity: ${incident.severity}
        Description: ${incident.description}
        Detected At: ${incident.detectedAt}
        Affected Assets: ${incident.affectedAssets.join(', ')}

        Please investigate immediately: ${process.env.ADMIN_URL}/incidents/${incident.id}
      `
    });

    // Also send to Slack/PagerDuty
    await this.sendSlackAlert(incident);
  }

  /**
   * Revoke all tokens for user
   */
  private async revokeAllUserTokens(userId: string): Promise<void> {
    await db('users')
      .where({ id: userId })
      .update({
        token_version: db.raw('token_version + 1'),
        updated_at: new Date()
      });

    await db('refresh_token_families')
      .where({ user_id: userId })
      .update({ invalidated_at: new Date() });
  }

  /**
   * Lock user account
   */
  private async lockUserAccount(userId: string): Promise<void> {
    await db('users')
      .where({ id: userId })
      .update({
        status: 'suspended',
        locked_until: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        updated_at: new Date()
      });
  }
}

export default new IncidentResponseService();
```

### Incident Response Runbooks

**Runbook: Suspected Data Breach**

```markdown
# Data Breach Response Runbook

## Immediate Actions (0-1 hour)

1. **Contain**
   - [ ] Identify affected systems/data
   - [ ] Isolate affected systems
   - [ ] Revoke compromised credentials
   - [ ] Enable additional monitoring

2. **Assess**
   - [ ] Determine scope of breach
   - [ ] Identify data accessed/exfiltrated
   - [ ] Identify affected users/companies

3. **Notify**
   - [ ] Alert security team
   - [ ] Notify executive leadership
   - [ ] Document all actions taken

## Short-term Actions (1-24 hours)

4. **Investigate**
   - [ ] Review access logs
   - [ ] Analyze attack vector
   - [ ] Identify root cause
   - [ ] Collect forensic evidence

5. **Communicate**
   - [ ] Notify affected users (if required by GDPR/CCPA)
   - [ ] Prepare public statement (if necessary)
   - [ ] Report to authorities (if required)

## Long-term Actions (1-7 days)

6. **Remediate**
   - [ ] Patch vulnerabilities
   - [ ] Implement additional controls
   - [ ] Update security policies
   - [ ] Conduct security training

7. **Monitor**
   - [ ] Enhanced monitoring for 30 days
   - [ ] Watch for similar attack patterns
   - [ ] Track affected user activity

8. **Review**
   - [ ] Post-incident review meeting
   - [ ] Update incident response plan
   - [ ] Implement lessons learned
```

---

## Security Metrics

### Key Security Indicators (KSIs)

```typescript
// src/services/security-metrics.service.ts

interface SecurityMetrics {
  authenticationFailureRate: number;
  averageLoginAttemptsPerUser: number;
  suspiciousActivityCount: number;
  crossTenantAccessAttempts: number;
  privilegeEscalationAttempts: number;
  tokenReuseDetections: number;
  incidentCount: number;
  meanTimeToDetect: number;  // hours
  meanTimeToRespond: number; // hours
  patchLevel: number;        // percentage of systems patched
}

class SecurityMetricsService {
  /**
   * Generate security dashboard metrics
   */
  async getSecurityMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<SecurityMetrics> {
    const [
      authFailures,
      suspiciousActivity,
      crossTenantAttempts,
      incidents
    ] = await Promise.all([
      this.getAuthenticationFailures(startDate, endDate),
      this.getSuspiciousActivityCount(startDate, endDate),
      this.getCrossTenantAttempts(startDate, endDate),
      this.getIncidents(startDate, endDate)
    ]);

    return {
      authenticationFailureRate: authFailures.rate,
      averageLoginAttemptsPerUser: authFailures.avgAttempts,
      suspiciousActivityCount: suspiciousActivity,
      crossTenantAccessAttempts: crossTenantAttempts,
      privilegeEscalationAttempts: await this.getPrivilegeEscalationAttempts(startDate, endDate),
      tokenReuseDetections: await this.getTokenReuseDetections(startDate, endDate),
      incidentCount: incidents.length,
      meanTimeToDetect: this.calculateMTTD(incidents),
      meanTimeToRespond: this.calculateMTTR(incidents),
      patchLevel: await this.getPatchLevel()
    };
  }

  private async getAuthenticationFailures(
    startDate: Date,
    endDate: Date
  ): Promise<{ rate: number; avgAttempts: number }> {
    const result = await db('audit_logs')
      .where({ action: 'login', access_granted: false })
      .whereBetween('timestamp', [startDate, endDate])
      .select(
        db.raw('COUNT(*) as total_failures'),
        db.raw('COUNT(DISTINCT user_id) as unique_users')
      )
      .first();

    const totalAttempts = await db('audit_logs')
      .where({ action: 'login' })
      .whereBetween('timestamp', [startDate, endDate])
      .count('* as count')
      .first();

    return {
      rate: (parseInt(result.total_failures) / parseInt(totalAttempts.count)) * 100,
      avgAttempts: parseInt(result.total_failures) / parseInt(result.unique_users)
    };
  }

  private calculateMTTD(incidents: SecurityIncident[]): number {
    // Mean Time To Detect - average time from occurrence to detection
    // Implementation depends on incident tracking
    return 0;
  }

  private calculateMTTR(incidents: SecurityIncident[]): number {
    // Mean Time To Respond - average time from detection to resolution
    const resolved = incidents.filter(i => i.resolvedAt);
    if (resolved.length === 0) return 0;

    const totalTime = resolved.reduce((sum, incident) => {
      const detectionTime = incident.detectedAt.getTime();
      const resolutionTime = incident.resolvedAt!.getTime();
      return sum + (resolutionTime - detectionTime);
    }, 0);

    return totalTime / resolved.length / (1000 * 60 * 60); // Convert to hours
  }
}
```

---

## Summary

This threat model identified **97 security threats** across 10 categories:

### Critical Risks Addressed

1. ✅ **Authentication**: JWT theft, brute force, session fixation, credential stuffing
2. ✅ **Authorization**: Privilege escalation, IDOR, cross-tenant access
3. ✅ **Data Security**: SQL injection, mass assignment, sensitive data exposure, backup security
4. ✅ **Network**: MITM attacks, DDoS, insecure communications
5. ✅ **Business Logic**: Cascade manipulation, assessment fraud, metric gaming

### Defense in Depth

```
┌─────────────────────────────────────┐
│  Network Layer                      │
│  • HTTPS/TLS 1.3                    │
│  • Cloudflare DDoS Protection       │
│  • WAF Rules                        │
├─────────────────────────────────────┤
│  Application Layer                  │
│  • JWT Authentication               │
│  • RBAC Authorization               │
│  • Input Validation                 │
│  • Rate Limiting                    │
├─────────────────────────────────────┤
│  Data Layer                         │
│  • Multi-Tenancy Isolation          │
│  • Parameterized Queries            │
│  • Encryption at Rest               │
│  • Row-Level Security               │
├─────────────────────────────────────┤
│  Monitoring Layer                   │
│  • Audit Logging                    │
│  • Anomaly Detection                │
│  • Incident Response                │
│  • Security Metrics                 │
└─────────────────────────────────────┘
```

### Security Maturity

| Category | Maturity Level | Status |
|----------|----------------|--------|
| Authentication | ⭐⭐⭐⭐⭐ | Advanced |
| Authorization | ⭐⭐⭐⭐⭐ | Advanced |
| Data Protection | ⭐⭐⭐⭐ | Intermediate |
| Network Security | ⭐⭐⭐⭐ | Intermediate |
| Incident Response | ⭐⭐⭐ | Basic |
| Security Monitoring | ⭐⭐⭐⭐ | Intermediate |

### Next Steps

1. [ ] Implement automated security testing (SAST/DAST)
2. [ ] Conduct penetration testing
3. [ ] Establish bug bounty program
4. [ ] Complete SOC 2 Type II certification
5. [ ] Implement Security Information and Event Management (SIEM)
6. [ ] Establish Security Operations Center (SOC)
7. [ ] Regular security training for development team
8. [ ] Quarterly threat model reviews

---

**Document Version**: 1.0.0
**Last Updated**: October 27, 2025
**Status**: Production Ready
**Related Documents**:
- [JWT_SECURITY_DESIGN.md](./JWT_SECURITY_DESIGN.md)
- [RBAC_IMPLEMENTATION_GUIDE.md](./RBAC_IMPLEMENTATION_GUIDE.md)
- [MULTI_TENANCY_SECURITY.md](./MULTI_TENANCY_SECURITY.md)
- [DATA_MODELS_VALIDATION.md](./DATA_MODELS_VALIDATION.md)
