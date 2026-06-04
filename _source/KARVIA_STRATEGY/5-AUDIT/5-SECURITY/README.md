# 5-SECURITY: Security Audits

<!-- @GENOME T3-NAV-014 | ACTIVE | 2026-04-01 | parent:T2-NAV-005 | auto:/audit | linked:- -->

## Purpose

Identify and mitigate security vulnerabilities. Ensure the product protects user data and resists attacks.

## Owner

**Primary**: Security Lead
**Secondary**: CTO, DevOps

---

## What Gets Audited

| Area | Questions | Frequency |
|------|-----------|-----------|
| Vulnerabilities | Dependency CVEs? Code vulnerabilities? | Weekly |
| Authentication | JWT secure? Sessions managed? | Monthly |
| Authorization | RBAC working? Privilege escalation risks? | Monthly |
| Data Protection | Encryption at rest/transit? | Quarterly |
| Infrastructure | Network security? Access controls? | Monthly |
| OWASP Top 10 | XSS, injection, CSRF protected? | Per release |

---

## Artifacts Stored Here

| Type | Naming | Example |
|------|--------|---------|
| Vulnerability scan | `YYYY_MM_DD_VULNERABILITY_SCAN.md` | `2026_04_01_DEPENDENCY_SCAN.md` |
| Penetration test | `YYYY_MM_DD_PENTEST_REPORT.md` | `2026_04_01_EXTERNAL_PENTEST.md` |
| Security review | `YYYY_MM_DD_SECURITY_REVIEW.md` | `2026_04_01_AUTH_SECURITY_REVIEW.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| npm audit | Dependency vulnerabilities | Automated scanning |
| server/middleware/auth.js | Auth implementation | Security review |
| CLAUDE.md §Security | Security patterns | Compliance check |
| External pen test | Third-party assessment | Independent validation |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 3-DELIVERY/6-ISSUES/ | Security bugs (P0) | Immediately |
| 2-TECHNICAL/ | Security architecture changes | When needed |
| 0-STAKEHOLDERS/ | Security posture report | Quarterly |

---

## OWASP Top 10 Checklist

| Risk | Status | Last Checked |
|------|--------|--------------|
| A01: Broken Access Control | [ ] | |
| A02: Cryptographic Failures | [ ] | |
| A03: Injection | [ ] | |
| A04: Insecure Design | [ ] | |
| A05: Security Misconfiguration | [ ] | |
| A06: Vulnerable Components | [ ] | |
| A07: Auth Failures | [ ] | |
| A08: Integrity Failures | [ ] | |
| A09: Logging Failures | [ ] | |
| A10: SSRF | [ ] | |

---

## Severity Classification

| Severity | Response Time | Example |
|----------|---------------|---------|
| Critical | <4 hours | Data breach, auth bypass |
| High | <24 hours | Privilege escalation, injection |
| Medium | <1 week | Information disclosure |
| Low | Next sprint | Minor configuration issues |
