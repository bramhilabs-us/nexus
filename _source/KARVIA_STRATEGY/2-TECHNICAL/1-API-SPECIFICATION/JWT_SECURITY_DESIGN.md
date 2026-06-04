# KARVIA Pro API - JWT Security Design

<!-- @GENOME T2-ARC-014 | ACTIVE | 2026-04-05 | parent:T1-KRV-001 | auto:/coding | linked:/audit -->

> **Part of KARVIA Engine** - See [KARVIA_ENGINE_VISION.md](../../1-VISION/KARVIA_ENGINE_VISION.md) for engine overview.

## Table of Contents

- [Overview](#overview)
- [JWT Token Structure](#jwt-token-structure)
- [Token Generation](#token-generation)
- [Token Validation](#token-validation)
- [Token Lifecycle](#token-lifecycle)
- [Refresh Token Mechanism](#refresh-token-mechanism)
- [Security Best Practices](#security-best-practices)
- [Implementation Guide](#implementation-guide)
- [Error Handling](#error-handling)
- [Attack Mitigations](#attack-mitigations)

---

## Overview

KARVIA Pro uses JSON Web Tokens (JWT) for stateless authentication across all API endpoints. This document describes the complete JWT security architecture, token structure, generation, validation, and best practices.

### Key Features

- **Stateless Authentication**: No server-side session storage required
- **Role-Based Access Control (RBAC)**: Roles embedded in token payload
- **Multi-Tenancy Support**: Company isolation enforced via token claims
- **Short-lived Access Tokens**: 1 hour expiration for security
- **Long-lived Refresh Tokens**: 30 days for better UX
- **Token Rotation**: Automatic refresh token rotation on use
- **Secure Storage**: HttpOnly cookies recommended for web clients

### Token Types

| Token Type | Purpose | Expiration | Storage |
|------------|---------|------------|---------|
| **Access Token** | API authentication | 1 hour | Memory/localStorage (web), Keychain (mobile) |
| **Refresh Token** | Access token renewal | 30 days | HttpOnly cookie (web), Secure storage (mobile) |
| **Password Reset Token** | Password reset flow | 1 hour | Email link only |
| **Email Verification Token** | Email verification | 24 hours | Email link only |
| **Invitation Token** | User invitation | 7 days | Email link only |

---

## JWT Token Structure

### Access Token Payload

```typescript
interface AccessTokenPayload {
  // Standard JWT Claims
  iss: string;           // Issuer: "karvia-pro-api"
  sub: string;           // Subject: User ID (UUID)
  aud: string;           // Audience: "karvia-pro-client"
  exp: number;           // Expiration time (Unix timestamp)
  iat: number;           // Issued at (Unix timestamp)
  jti: string;           // JWT ID (UUID) - for token tracking/revocation

  // Custom Claims
  email: string;         // User email
  role: UserRole;        // User role (CONSULTANT, BUSINESS_OWNER, etc.)
  companyId: string;     // Company ID (UUID) - for multi-tenancy
  permissions: string[]; // Granular permissions array
  firstName: string;     // User first name
  lastName: string;      // User last name
  emailVerified: boolean; // Email verification status

  // Security Claims
  tokenVersion: number;  // Token version for invalidation
  sessionId: string;     // Session ID for device tracking
}
```

### Example Access Token

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "iss": "karvia-pro-api",
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "aud": "karvia-pro-client",
  "exp": 1730044800,
  "iat": 1730041200,
  "jti": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",

  "email": "john.doe@company.com",
  "role": "MANAGER",
  "companyId": "c7f9d6a0-8b3e-4c5d-9a7b-1e4f8c2d3a6b",
  "permissions": [
    "objectives:read",
    "objectives:write",
    "team:manage",
    "assessments:view"
  ],
  "firstName": "John",
  "lastName": "Doe",
  "emailVerified": true,

  "tokenVersion": 1,
  "sessionId": "sess_1730041200_xyz789"
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

### Refresh Token Payload

```typescript
interface RefreshTokenPayload {
  // Standard Claims
  iss: string;           // Issuer: "karvia-pro-api"
  sub: string;           // Subject: User ID (UUID)
  aud: string;           // Audience: "karvia-pro-refresh"
  exp: number;           // Expiration: 30 days
  iat: number;           // Issued at
  jti: string;           // JWT ID (UUID)

  // Custom Claims
  tokenFamily: string;   // Token family ID for rotation tracking
  tokenVersion: number;  // Must match user's current token version
  sessionId: string;     // Session ID
  deviceInfo: {
    userAgent: string;
    ip: string;
    deviceId?: string;
  };
}
```

---

## Token Generation

### Access Token Generation Flow

```typescript
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

async function generateAccessToken(user: User): Promise<string> {
  const payload: AccessTokenPayload = {
    // Standard claims
    iss: 'karvia-pro-api',
    sub: user.id,
    aud: 'karvia-pro-client',
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4(),

    // Custom claims
    email: user.email,
    role: user.role,
    companyId: user.company_id,
    permissions: await getPermissionsForRole(user.role),
    firstName: user.first_name,
    lastName: user.last_name,
    emailVerified: user.email_verified,

    // Security claims
    tokenVersion: user.token_version,
    sessionId: generateSessionId(user.id)
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    algorithm: 'HS256'
  });
}
```

### Refresh Token Generation Flow

```typescript
async function generateRefreshToken(
  user: User,
  deviceInfo: DeviceInfo
): Promise<string> {
  const tokenFamily = uuidv4(); // New family for rotation tracking

  const payload: RefreshTokenPayload = {
    iss: 'karvia-pro-api',
    sub: user.id,
    aud: 'karvia-pro-refresh',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 30 days
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4(),

    tokenFamily,
    tokenVersion: user.token_version,
    sessionId: generateSessionId(user.id),
    deviceInfo: {
      userAgent: deviceInfo.userAgent,
      ip: deviceInfo.ip,
      deviceId: deviceInfo.deviceId
    }
  };

  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    algorithm: 'HS256'
  });

  // Store refresh token family in database for rotation tracking
  await storeRefreshTokenFamily(user.id, tokenFamily, payload.exp);

  return token;
}
```

### Permission Resolution by Role

```typescript
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  CONSULTANT: [
    'companies:read',
    'companies:write',
    'teams:read',
    'teams:write',
    'objectives:read',
    'objectives:write',
    'assessments:read',
    'assessments:write',
    'analytics:read',
    'admin:read',
    'admin:write'
  ],

  BUSINESS_OWNER: [
    'companies:read',
    'companies:write',
    'teams:read',
    'teams:write',
    'objectives:read',
    'objectives:write',
    'assessments:read',
    'assessments:write',
    'analytics:read',
    'invitations:write'
  ],

  EXECUTIVE: [
    'companies:read',
    'teams:read',
    'objectives:read',
    'objectives:write',
    'assessments:read',
    'assessments:write',
    'analytics:read',
    'cascade:manage'
  ],

  MANAGER: [
    'teams:read',
    'objectives:read',
    'objectives:write',
    'assessments:read',
    'assessments:write',
    'tasks:write',
    'analytics:read'
  ],

  EMPLOYEE: [
    'objectives:read',
    'assessments:read',
    'tasks:read',
    'tasks:write',
    'goals:write'
  ]
};

async function getPermissionsForRole(role: UserRole): Promise<string[]> {
  return ROLE_PERMISSIONS[role] || [];
}
```

---

## Token Validation

### Access Token Validation Middleware

```typescript
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

async function validateAccessToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authorization token is required'
        }
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify and decode token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
      {
        algorithms: ['HS256'],
        audience: 'karvia-pro-client',
        issuer: 'karvia-pro-api'
      }
    ) as AccessTokenPayload;

    // Validate token version (for revocation support)
    const user = await getUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User associated with token not found'
        }
      });
    }

    if (user.token_version !== decoded.tokenVersion) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REVOKED',
          message: 'Token has been revoked. Please login again.'
        }
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'User account is not active'
        }
      });
    }

    // Attach decoded token to request
    req.user = decoded;
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired. Please refresh your token.'
        }
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token provided'
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error validating token'
      }
    });
  }
}
```

### Permission Validation Middleware

```typescript
function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Permission denied. Required: ${permission}`
        }
      });
    }

    next();
  };
}

// Usage
app.get('/api/objectives',
  validateAccessToken,
  requirePermission('objectives:read'),
  getObjectives
);
```

### Multi-Tenancy Validation

```typescript
function validateCompanyAccess(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const resourceCompanyId = req.params.companyId || req.body?.companyId;
  const userCompanyId = req.user?.companyId;

  // Super admins can access all companies
  if (req.user?.role === 'CONSULTANT') {
    return next();
  }

  // Regular users can only access their own company data
  if (resourceCompanyId && resourceCompanyId !== userCompanyId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CROSS_TENANT_ACCESS_DENIED',
        message: 'You do not have access to this company data'
      }
    });
  }

  next();
}
```

---

## Token Lifecycle

### Complete Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ↓
┌─────────────────────┐
│   API Server        │
│                     │
│ 2. Verify password  │
│ 3. Generate tokens  │
│    - Access Token   │
│    - Refresh Token  │
└──────┬──────────────┘
       │
       │ 4. Return tokens
       │    { accessToken, refreshToken }
       ↓
┌─────────────┐
│   Client    │
│             │
│ Store:      │
│ - Access in memory  │
│ - Refresh in cookie │
└──────┬──────┘
       │
       │ 5. API Request
       │    Authorization: Bearer <access_token>
       ↓
┌─────────────────────┐
│   API Server        │
│                     │
│ 6. Validate token   │
│ 7. Process request  │
└──────┬──────────────┘
       │
       │ 8. Response with data
       ↓
┌─────────────┐
│   Client    │
└─────────────┘

--- Token Expires ---

┌─────────────┐
│   Client    │
│             │
│ Detect 401  │
│ TOKEN_EXPIRED │
└──────┬──────┘
       │
       │ 9. POST /api/auth/refresh
       │    { refreshToken }
       ↓
┌─────────────────────┐
│   API Server        │
│                     │
│ 10. Validate refresh│
│ 11. Generate new    │
│     access token    │
│ 12. Rotate refresh  │
│     token           │
└──────┬──────────────┘
       │
       │ 13. Return new tokens
       ↓
┌─────────────┐
│   Client    │
│             │
│ Update      │
│ stored tokens│
│             │
│ Retry       │
│ original    │
│ request     │
└─────────────┘
```

### Token Expiration Timeline

```
Time →
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0 min                 60 min              30 days
│                        │                    │
├─── Access Token ───────┤
│    (valid)             │ (expired)
│
├────────────────── Refresh Token ────────────┤
     (valid throughout)
```

---

## Refresh Token Mechanism

### Refresh Token Flow

```typescript
async function refreshAccessToken(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REFRESH_TOKEN',
          message: 'Refresh token is required'
        }
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
      {
        algorithms: ['HS256'],
        audience: 'karvia-pro-refresh',
        issuer: 'karvia-pro-api'
      }
    ) as RefreshTokenPayload;

    // Get user
    const user = await getUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Validate token version
    if (user.token_version !== decoded.tokenVersion) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REVOKED',
          message: 'Token has been revoked'
        }
      });
    }

    // Check if token family is valid (detect reuse)
    const isValidFamily = await validateTokenFamily(
      decoded.sub,
      decoded.tokenFamily
    );

    if (!isValidFamily) {
      // Possible token theft - invalidate all tokens for this user
      await incrementTokenVersion(user.id);
      await invalidateAllTokenFamilies(user.id);

      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REUSE_DETECTED',
          message: 'Token reuse detected. All sessions have been invalidated.'
        }
      });
    }

    // Invalidate old token family
    await invalidateTokenFamily(decoded.tokenFamily);

    // Generate new tokens
    const newAccessToken = await generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user, decoded.deviceInfo);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_EXPIRED',
          message: 'Refresh token has expired. Please login again.'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Invalid refresh token'
      }
    });
  }
}
```

### Token Family Database Schema

```sql
CREATE TABLE refresh_token_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_family VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  invalidated_at TIMESTAMP,
  device_info JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_user_token_family (user_id, token_family),
  INDEX idx_expires_at (expires_at)
);

-- Cleanup expired families
CREATE INDEX idx_expired_families ON refresh_token_families (expires_at)
WHERE invalidated_at IS NULL;
```

### Token Rotation Logic

```typescript
async function validateTokenFamily(
  userId: string,
  tokenFamily: string
): Promise<boolean> {
  const family = await db.query(
    `SELECT * FROM refresh_token_families
     WHERE user_id = $1
     AND token_family = $2
     AND invalidated_at IS NULL
     AND expires_at > NOW()`,
    [userId, tokenFamily]
  );

  return family.rows.length > 0;
}

async function invalidateTokenFamily(tokenFamily: string): Promise<void> {
  await db.query(
    `UPDATE refresh_token_families
     SET invalidated_at = NOW()
     WHERE token_family = $1`,
    [tokenFamily]
  );
}

async function storeRefreshTokenFamily(
  userId: string,
  tokenFamily: string,
  expiresAt: number
): Promise<void> {
  await db.query(
    `INSERT INTO refresh_token_families (user_id, token_family, expires_at)
     VALUES ($1, $2, to_timestamp($3))`,
    [userId, tokenFamily, expiresAt]
  );
}
```

---

## Security Best Practices

### 1. Token Storage

#### Web Applications

**Recommended: HttpOnly Cookies for Refresh Tokens**
```typescript
// Set refresh token as HttpOnly cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,      // Prevents JavaScript access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/api/auth/refresh' // Only sent to refresh endpoint
});
```

**Access Token Storage Options:**
```typescript
// Option 1: Memory (most secure, lost on refresh)
class TokenManager {
  private accessToken: string | null = null;

  setToken(token: string) {
    this.accessToken = token;
  }

  getToken(): string | null {
    return this.accessToken;
  }
}

// Option 2: sessionStorage (cleared on tab close)
sessionStorage.setItem('accessToken', token);

// Option 3: localStorage (persists across tabs)
// Use with caution - vulnerable to XSS
localStorage.setItem('accessToken', token);
```

#### Mobile Applications

**iOS Keychain:**
```swift
import Security

func saveToken(token: String, key: String) {
    let data = token.data(using: .utf8)!
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: key,
        kSecValueData as String: data,
        kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
    ]
    SecItemDelete(query as CFDictionary)
    SecItemAdd(query as CFDictionary, nil)
}
```

**Android Keystore:**
```kotlin
import androidx.security.crypto.EncryptedSharedPreferences

val encryptedPrefs = EncryptedSharedPreferences.create(
    "secure_prefs",
    masterKey,
    context,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

encryptedPrefs.edit()
    .putString("access_token", token)
    .apply()
```

### 2. Secret Key Management

```typescript
// NEVER hardcode secrets
// ❌ BAD
const JWT_SECRET = "my-secret-key";

// ✅ GOOD - Use environment variables
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// Validate secrets on startup
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

// Use different secrets for access and refresh tokens
// This limits the impact if one is compromised
```

**Secret Generation:**
```bash
# Generate secure random secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 64
```

### 3. Token Revocation

```typescript
// User model - track token version
interface User {
  id: string;
  token_version: number; // Increment to invalidate all tokens
  // ... other fields
}

// Revoke all tokens for a user
async function revokeAllUserTokens(userId: string): Promise<void> {
  await db.query(
    `UPDATE users SET token_version = token_version + 1 WHERE id = $1`,
    [userId]
  );

  await invalidateAllTokenFamilies(userId);
}

// Use cases for revocation:
// - Password change
// - Suspicious activity detected
// - User logs out from all devices
// - Account compromise suspected
```

### 4. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/auth/login', authLimiter, login);
app.post('/api/auth/refresh', authLimiter, refreshAccessToken);

// Gentler rate limiting for general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);
```

### 5. CORS Configuration

```typescript
import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://app.karvia.pro',
      'https://staging.karvia.pro',
      ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Cache preflight for 24 hours
};

app.use(cors(corsOptions));
```

### 6. HTTPS Only

```typescript
// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Set security headers
import helmet from 'helmet';

app.use(helmet({
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.karvia.pro"]
    }
  }
}));
```

---

## Implementation Guide

### Backend Setup (Node.js/Express)

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: AccessTokenPayload;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Implementation from validation section above
};

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Implementation from validation section above
  };
};

export const validateCompanyAccess = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Implementation from validation section above
};
```

```typescript
// src/routes/auth.ts
import express from 'express';
import { login, register, refresh, logout, me } from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
```

```typescript
// src/controllers/auth.ts
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_CREDENTIALS',
        message: 'Email and password are required'
      }
    });
  }

  // Find user
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      }
    });
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      }
    });
  }

  // Generate tokens
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, {
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip,
  });

  // Set refresh token as HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  // Return access token
  res.json({
    success: true,
    data: {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        companyId: user.company_id
      }
    }
  });
}
```

### Frontend Setup (React/TypeScript)

```typescript
// src/services/auth.service.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class AuthService {
  private accessToken: string | null = null;

  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    }, {
      withCredentials: true // Include cookies
    });

    this.accessToken = response.data.data.accessToken;
    return response.data;
  }

  async refreshToken(): Promise<string> {
    const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
      withCredentials: true
    });

    this.accessToken = response.data.data.accessToken;
    return this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async logout() {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } finally {
      this.accessToken = null;
    }
  }
}

export default new AuthService();
```

```typescript
// src/services/api.service.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import authService from './auth.service';

class ApiService {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: Array<() => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - attach access token
    this.client.interceptors.request.use(
      (config) => {
        const token = authService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 &&
            error.response?.data?.error?.code === 'TOKEN_EXPIRED') {

          if (this.isRefreshing) {
            // Queue request while refresh is in progress
            return new Promise((resolve) => {
              this.refreshQueue.push(() => {
                resolve(this.client(originalRequest!));
              });
            });
          }

          this.isRefreshing = true;

          try {
            await authService.refreshToken();

            // Retry all queued requests
            this.refreshQueue.forEach(callback => callback());
            this.refreshQueue = [];

            // Retry original request
            return this.client(originalRequest!);

          } catch (refreshError) {
            // Refresh failed - redirect to login
            window.location.href = '/login';
            return Promise.reject(refreshError);

          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data: any, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data: any, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  delete<T>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }
}

export default new ApiService();
```

### Mobile Setup (React Native)

```typescript
// src/services/SecureStorage.ts
import * as SecureStore from 'expo-secure-store';

class SecureStorage {
  async saveToken(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  async getToken(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  }

  async deleteToken(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}

export default new SecureStorage();
```

```typescript
// src/services/AuthService.ts
import secureStorage from './SecureStorage';
import api from './ApiService';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class AuthService {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });

    await secureStorage.saveToken(
      ACCESS_TOKEN_KEY,
      response.data.data.accessToken
    );
    await secureStorage.saveToken(
      REFRESH_TOKEN_KEY,
      response.data.data.refreshToken
    );

    return response.data;
  }

  async getAccessToken(): Promise<string | null> {
    return await secureStorage.getToken(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return await secureStorage.getToken(REFRESH_TOKEN_KEY);
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = await this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });

    const newAccessToken = response.data.data.accessToken;
    const newRefreshToken = response.data.data.refreshToken;

    await secureStorage.saveToken(ACCESS_TOKEN_KEY, newAccessToken);
    await secureStorage.saveToken(REFRESH_TOKEN_KEY, newRefreshToken);

    return newAccessToken;
  }

  async logout() {
    await secureStorage.deleteToken(ACCESS_TOKEN_KEY);
    await secureStorage.deleteToken(REFRESH_TOKEN_KEY);
  }
}

export default new AuthService();
```

---

## Error Handling

### Standard JWT Error Codes

```typescript
enum JWTErrorCode {
  MISSING_TOKEN = 'MISSING_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_INACTIVE = 'USER_INACTIVE',
  MISSING_REFRESH_TOKEN = 'MISSING_REFRESH_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  TOKEN_REUSE_DETECTED = 'TOKEN_REUSE_DETECTED',
  CROSS_TENANT_ACCESS_DENIED = 'CROSS_TENANT_ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
}
```

### Error Response Format

```typescript
interface JWTErrorResponse {
  success: false;
  error: {
    code: JWTErrorCode;
    message: string;
    details?: any;
  };
}
```

### Client-Side Error Handling

```typescript
// React example
function handleApiError(error: AxiosError) {
  const errorData = error.response?.data as JWTErrorResponse;

  switch (errorData?.error?.code) {
    case 'TOKEN_EXPIRED':
      // Handled automatically by interceptor
      break;

    case 'TOKEN_REVOKED':
    case 'TOKEN_REUSE_DETECTED':
    case 'REFRESH_TOKEN_EXPIRED':
      // Force logout and redirect to login
      authService.logout();
      navigate('/login', {
        state: { message: 'Your session has expired. Please login again.' }
      });
      break;

    case 'INSUFFICIENT_PERMISSIONS':
      showNotification('You do not have permission to perform this action', 'error');
      break;

    case 'CROSS_TENANT_ACCESS_DENIED':
      showNotification('Access denied to this resource', 'error');
      navigate('/dashboard');
      break;

    default:
      showNotification('An error occurred. Please try again.', 'error');
  }
}
```

---

## Attack Mitigations

### 1. XSS (Cross-Site Scripting)

**Threat**: Attacker injects malicious scripts to steal tokens from localStorage/cookies

**Mitigation**:
```typescript
// Use HttpOnly cookies for refresh tokens (JavaScript cannot access)
res.cookie('refreshToken', token, {
  httpOnly: true,  // ← Key protection
  secure: true,
  sameSite: 'strict'
});

// Sanitize all user inputs
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

// Set Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'"], // Only allow scripts from same origin
  }
}));
```

### 2. CSRF (Cross-Site Request Forgery)

**Threat**: Attacker tricks user into making unwanted requests

**Mitigation**:
```typescript
// Use SameSite cookie attribute
res.cookie('refreshToken', token, {
  sameSite: 'strict', // ← Prevents cross-site cookie sending
  httpOnly: true,
  secure: true
});

// Require custom headers for state-changing operations
// (browsers won't send custom headers on cross-origin requests without CORS)
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const customHeader = req.headers['x-requested-with'];
    if (customHeader !== 'XMLHttpRequest') {
      return res.status(403).json({
        success: false,
        error: { code: 'CSRF_PROTECTION', message: 'Missing required header' }
      });
    }
  }
  next();
});
```

### 3. Token Theft via Man-in-the-Middle

**Threat**: Attacker intercepts tokens during transmission

**Mitigation**:
```typescript
// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Enable HSTS (HTTP Strict Transport Security)
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));

// Use secure cookies
res.cookie('refreshToken', token, {
  secure: true, // ← Only sent over HTTPS
  httpOnly: true,
  sameSite: 'strict'
});
```

### 4. Token Replay Attacks

**Threat**: Attacker reuses stolen tokens

**Mitigation**:
```typescript
// Short-lived access tokens (1 hour)
const payload = {
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // ← 1 hour
  // ...
};

// Token rotation for refresh tokens
// Old refresh token is invalidated when used
async function refreshAccessToken(req, res) {
  const decoded = jwt.verify(req.body.refreshToken, SECRET);

  // Invalidate old token family
  await invalidateTokenFamily(decoded.tokenFamily); // ← Prevent reuse

  // Generate new tokens with new family
  const newTokens = await generateNewTokens(user);
  res.json(newTokens);
}

// JTI (JWT ID) for tracking individual tokens
const payload = {
  jti: uuidv4(), // ← Unique token identifier
  // ...
};
```

### 5. Token Reuse Detection

**Threat**: Attacker obtains and reuses a refresh token

**Mitigation**:
```typescript
async function refreshAccessToken(req, res) {
  const decoded = jwt.verify(req.body.refreshToken, SECRET);

  // Check if token family is still valid
  const isValid = await validateTokenFamily(decoded.tokenFamily);

  if (!isValid) {
    // Token was already used - possible theft!
    // Invalidate ALL tokens for this user
    await incrementTokenVersion(decoded.sub); // ← Nuclear option
    await invalidateAllTokenFamilies(decoded.sub);

    // Alert user
    await sendSecurityAlert(decoded.sub, 'Possible token theft detected');

    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_REUSE_DETECTED',
        message: 'All sessions have been invalidated for security'
      }
    });
  }

  // ... proceed with refresh
}
```

### 6. Brute Force Attacks

**Threat**: Attacker tries many passwords/tokens

**Mitigation**:
```typescript
import rateLimit from 'express-rate-limit';

// Aggressive rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // ← Only 5 attempts
  message: 'Too many attempts. Try again later.',
  skipSuccessfulRequests: true // Don't count successful logins
});

app.post('/api/auth/login', authLimiter, login);

// Account lockout after failed attempts
async function login(req, res) {
  const user = await getUserByEmail(req.body.email);

  // Check if account is locked
  if (user.locked_until && user.locked_until > new Date()) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'ACCOUNT_LOCKED',
        message: `Account locked until ${user.locked_until}`
      }
    });
  }

  const isValid = await bcrypt.compare(req.body.password, user.password_hash);

  if (!isValid) {
    // Increment failed attempts
    await incrementFailedAttempts(user.id);

    if (user.failed_attempts >= 5) {
      // Lock account for 30 minutes
      await lockAccount(user.id, 30);
    }

    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' }
    });
  }

  // Reset failed attempts on successful login
  await resetFailedAttempts(user.id);

  // ... proceed with login
}
```

### 7. JWT Algorithm Confusion

**Threat**: Attacker changes algorithm from RS256 to HS256 to bypass verification

**Mitigation**:
```typescript
// Always specify allowed algorithms
jwt.verify(token, SECRET, {
  algorithms: ['HS256'], // ← Explicit whitelist
  // Never use 'none' algorithm
});

// Validate algorithm in token header
const decoded = jwt.decode(token, { complete: true });
if (!decoded || decoded.header.alg !== 'HS256') {
  throw new Error('Invalid token algorithm');
}
```

### 8. Token Size DoS

**Threat**: Attacker sends huge tokens to exhaust server resources

**Mitigation**:
```typescript
// Limit request body size
app.use(express.json({
  limit: '10kb' // ← Restrict payload size
}));

// Validate token size before processing
function validateAccessToken(req, res, next) {
  const token = req.headers.authorization?.substring(7);

  if (token && token.length > 2048) { // ← Reasonable limit
    return res.status(400).json({
      success: false,
      error: { code: 'TOKEN_TOO_LARGE', message: 'Token exceeds size limit' }
    });
  }

  // ... proceed with validation
}
```

---

## Summary

This JWT security design provides:

✅ **Stateless Authentication** with access and refresh tokens
✅ **Role-Based Access Control** with granular permissions
✅ **Multi-Tenancy Support** with company isolation
✅ **Token Rotation** to prevent reuse attacks
✅ **Comprehensive Error Handling** with clear error codes
✅ **Attack Mitigation** against XSS, CSRF, replay, brute force
✅ **Secure Storage** patterns for web and mobile
✅ **Production-Ready** implementation examples

**Next Steps:**
1. Review and customize token expiration times for your needs
2. Implement rate limiting on authentication endpoints
3. Set up monitoring for token reuse detection
4. Configure HTTPS and security headers
5. Test token refresh flow thoroughly
6. Document token handling for your frontend team

---

**Document Version**: 1.0.0
**Last Updated**: October 27, 2025
**Status**: Production Ready
**Related Documents**:
- [openapi.yaml](./openapi.yaml) - API specification
- [DATA_MODELS_VALIDATION.md](./DATA_MODELS_VALIDATION.md) - Data models and validation
- [RBAC_IMPLEMENTATION_GUIDE.md](./RBAC_IMPLEMENTATION_GUIDE.md) - Coming next
