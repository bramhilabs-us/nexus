# Secrets Management Guide

**Created**: October 16, 2025
**Status**: Production Ready
**Version**: 1.0

---

## Overview

This guide describes how secrets and sensitive configuration are managed in the Karvia Business platform to ensure security best practices.

## Key Principles

1. **Never commit secrets to git** - All `.env` files (except `.example`) are gitignored
2. **Environment-specific configs** - Separate configs for dev/staging/production
3. **Strong cryptographic secrets** - Minimum 64 characters (128 hex digits) for production
4. **Centralized management** - All secrets accessed through SecretsManager service
5. **Validation on startup** - Application validates secrets before starting

---

## Files Structure

```
karvia_business/
├── .env                          # Current environment (gitignored)
├── .env.development              # Development secrets (gitignored)
├── .env.production.example       # Production template (committed)
├── .env.backup                   # Backup before rotation (gitignored)
├── server/services/secretsManager.js  # Secrets management service
└── SECRETS_MANAGEMENT.md         # This file
```

---

## Environment Files

### .env (Active Configuration)

The active `.env` file is loaded based on `NODE_ENV`:

```bash
# Development (default)
NODE_ENV=development → loads .env.development

# Production
NODE_ENV=production → loads .env.production
```

### .env.development

- Contains development secrets with strong random values
- Safe to use on local machines
- **DO NOT use these secrets in production**
- Includes mock/sandbox API keys for testing

### .env.production.example

- Template for production configuration
- Contains placeholders for all required secrets
- **Committed to git** as reference
- Copy to `.env.production` and replace all values

---

## Required Secrets

### Critical (Must Have)

1. **JWT_SECRET** - JWT token signing key (min 64 chars in production)
2. **SESSION_SECRET** - Session cookie encryption key (min 64 chars)
3. **MONGODB_URI** - Database connection string
4. **OPENAI_API_KEY** - OpenAI API key for AI features
5. **MAILJET_API_KEY** - Mailjet API key for emails
6. **MAILJET_API_SECRET** - Mailjet API secret

### Optional (Recommended)

7. **REDIS_URL** - Redis connection for caching
8. **SENTRY_DSN** - Error tracking (production)
9. **SLACK_WEBHOOK_URL** - Slack notifications
10. **TEAMS_WEBHOOK_URL** - Microsoft Teams notifications

---

## Generating Strong Secrets

### Using Node.js Crypto

```bash
# Generate 64-byte (128 hex characters) secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Example output:
# 10561d770c6fca12777502604b3a6254aec12a5ae7673cd85f9426515cfbbb23da718f270d8c1eadf47e00d353849f866d5786fedb1be512b350882c1d07e8ab
```

### Using OpenSSL

```bash
# Generate 64-byte base64 secret
openssl rand -base64 64

# Generate 64-byte hex secret
openssl rand -hex 64
```

### Using SecretsManager Service

```javascript
const SecretsManager = require('./server/services/secretsManager');

// Generate a new secret
const newSecret = SecretsManager.generateSecret(64);
console.log(newSecret);
```

---

## SecretsManager Service

### Features

- **Centralized access** - Single point for all secret retrieval
- **Validation** - Checks for missing/weak secrets on startup
- **Redaction** - Safe logging without exposing secrets
- **Environment awareness** - Stricter validation in production

### Usage

```javascript
const secretsManager = require('./server/services/secretsManager');

// Get a secret
const jwtSecret = secretsManager.get('JWT_SECRET');

// Check if secret exists
if (secretsManager.has('OPENAI_API_KEY')) {
    // Use OpenAI features
}

// Get redacted value for logging
console.log('JWT_SECRET:', secretsManager.redact('JWT_SECRET'));
// Output: "1056...e8ab"

// Get secrets status
const status = secretsManager.getStatus();
console.log(status);
// Output:
// {
//   environment: 'development',
//   secrets_loaded: 15,
//   required_secrets: 6,
//   missing_secrets: [],
//   weak_secrets: [],
//   all_present: true,
//   all_strong: true
// }
```

---

## Security Rules

### Production Requirements

1. **Minimum secret length**: 32 characters (64 recommended)
2. **No weak patterns**: Must not contain "dev", "test", "example", "123", etc.
3. **Unique secrets**: Each environment must have different secrets
4. **No defaults**: Cannot use development secrets in production
5. **Validated on startup**: Application fails to start if secrets are weak

### Development Requirements

1. **Strong secrets recommended** (but not enforced)
2. **Mock/sandbox API keys** acceptable
3. **Local MongoDB** can be used instead of Atlas

---

## Secret Rotation

### When to Rotate Secrets

1. **Immediately** if a secret is exposed (committed to git, leaked, etc.)
2. **Every 90 days** for production secrets (recommended)
3. **After team member departure** who had access
4. **After security incident** or breach

### How to Rotate Secrets

1. **Backup current secrets**:
   ```bash
   cp .env .env.backup
   ```

2. **Generate new secrets**:
   ```bash
   node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
   node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Update .env file** with new secrets

4. **Restart all services**:
   ```bash
   pm2 restart all
   # or
   docker-compose restart
   ```

5. **Verify functionality**:
   - Test login flow
   - Test API endpoints
   - Check logs for errors

6. **Delete backup** after verification:
   ```bash
   rm .env.backup
   ```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Copy `.env.production.example` to `.env.production`
- [ ] Replace all `REPLACE_WITH_*` placeholders
- [ ] Generate new JWT_SECRET (64 bytes)
- [ ] Generate new SESSION_SECRET (64 bytes)
- [ ] Add production MongoDB URI
- [ ] Add production OpenAI API key
- [ ] Add production Mailjet credentials
- [ ] Set CORS_ORIGIN to production domain
- [ ] Set NODE_ENV=production
- [ ] Run secrets validation:
  ```bash
  node -e "require('./server/services/secretsManager').getStatus()"
  ```
- [ ] Verify no weak secrets detected
- [ ] Test application startup
- [ ] Delete `.env.backup` if exists

---

## Exposed Secrets - Emergency Response

If a secret is accidentally committed to git:

### 1. Remove from Git History

```bash
# Remove file from all git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push to remote (WARNING: rewrites history)
git push origin --force --all
git push origin --force --tags
```

### 2. Rotate All Secrets

- Generate new secrets immediately
- Update all environments
- Revoke old API keys (OpenAI, Mailjet, etc.)

### 3. Notify Team

- Alert all team members
- Document incident
- Update secrets management procedures

---

## Best Practices

### DO ✅

- ✅ Use environment variables for all secrets
- ✅ Generate cryptographically random secrets
- ✅ Use different secrets for each environment
- ✅ Validate secrets on application startup
- ✅ Log redacted secret values only
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use secrets management service (AWS Secrets Manager, etc.) in production
- ✅ Add `.env` to `.gitignore`
- ✅ Commit `.env.example` files as templates

### DON'T ❌

- ❌ Commit `.env` files to git
- ❌ Use weak or default secrets in production
- ❌ Share secrets via email or chat
- ❌ Log full secret values
- ❌ Hardcode secrets in source code
- ❌ Reuse secrets across environments
- ❌ Use production secrets locally
- ❌ Store secrets in config files

---

## Secrets in Different Environments

### Development

- **Location**: `.env.development`
- **Strength**: Strong recommended (not enforced)
- **API Keys**: Sandbox/test keys acceptable
- **Rotation**: Not required

### Staging

- **Location**: `.env.staging`
- **Strength**: Production-level required
- **API Keys**: Separate staging keys
- **Rotation**: Every 90 days

### Production

- **Location**: AWS Secrets Manager / `.env.production`
- **Strength**: Maximum (64+ bytes, cryptographically random)
- **API Keys**: Production keys only
- **Rotation**: Every 90 days (mandatory)

---

## Monitoring

### Secrets Health Check

Add to monitoring dashboard:

```javascript
const status = secretsManager.getStatus();

if (!status.all_present) {
    alert('Missing required secrets: ' + status.missing_secrets.join(', '));
}

if (!status.all_strong && status.environment === 'production') {
    alert('Weak secrets detected: ' + status.weak_secrets.join(', '));
}
```

### Audit Log

Log secret access (redacted) for security audits:

```javascript
const secret = secretsManager.get('OPENAI_API_KEY');
logger.info('Accessed secret: OPENAI_API_KEY', {
    value: secretsManager.redact('OPENAI_API_KEY'),
    user: req.user.id,
    timestamp: new Date().toISOString()
});
```

---

## Troubleshooting

### "Missing required secrets" Error

**Cause**: One or more required secrets not set in `.env`

**Fix**:
1. Check which secrets are missing: `node -e "console.log(require('./server/services/secretsManager').getStatus())"`
2. Add missing secrets to `.env`
3. Restart application

### "Weak secrets detected in production" Error

**Cause**: Secrets are too short or contain weak patterns

**Fix**:
1. Generate new strong secrets: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
2. Update `.env.production`
3. Restart application

### "Secret not found" Error

**Cause**: Trying to access a secret that doesn't exist

**Fix**:
1. Check if secret exists in `.env`
2. Verify correct environment is loaded
3. Add secret if missing

---

## Support

For questions about secrets management:

1. Read this guide
2. Check `server/services/secretsManager.js` source
3. Contact security team
4. Review SECURITY.md

---

**Document Version**: 1.0
**Last Updated**: October 16, 2025
**Next Review**: November 16, 2025
