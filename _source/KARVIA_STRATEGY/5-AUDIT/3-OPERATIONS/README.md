# 3-OPERATIONS: Operations Audits

<!-- @GENOME T3-NAV-012 | ACTIVE | 2026-04-01 | parent:T2-NAV-005 | auto:/audit,/deploy | linked:- -->

## Purpose

Monitor deployment health, uptime, and operational efficiency. Ensure production systems are stable and incidents are minimized.

## Owner

**Primary**: DevOps Lead
**Secondary**: SRE, On-call Engineers

---

## What Gets Audited

| Area | Questions | Frequency |
|------|-----------|-----------|
| Uptime | SLA compliance? Downtime incidents? | Weekly |
| Deployments | Success rate? Rollback frequency? | Weekly |
| Incidents | Mean time to detect/resolve? | Weekly |
| Infrastructure | Resource utilization? Cost efficiency? | Monthly |
| Monitoring | Alert quality? False positives? | Monthly |

---

## Artifacts Stored Here

| Type | Naming | Example |
|------|--------|---------|
| Weekly ops report | `YYYY_MM_DD_WEEKLY_OPS_REPORT.md` | `2026_04_01_WEEKLY_OPS_REPORT.md` |
| Incident post-mortem | `YYYY_MM_DD_INCIDENT_[ID].md` | `2026_04_01_INCIDENT_INC001.md` |
| Deployment audit | `YYYY_MM_DD_DEPLOYMENT_AUDIT.md` | `2026_04_01_DEPLOYMENT_AUDIT.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| Render dashboard | Deployment logs | Success/failure tracking |
| Monitoring tools | Uptime metrics | SLA tracking |
| 3-DELIVERY/6-ISSUES/ | Production bugs | Incident correlation |
| Error tracking | Exception logs | Pattern identification |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 3-DELIVERY/6-ISSUES/ | Ops-related bugs | When discovered |
| 2-TECHNICAL/ | Infrastructure improvements | After analysis |
| 0-STAKEHOLDERS/ | SLA reports | Monthly |

---

## Key Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Uptime | >99.5% | TBD |
| Deployment Success | >95% | TBD |
| MTTR (Mean Time to Resolve) | <1 hour | TBD |
| Alert Noise | <10% false positive | TBD |

---

## Incident Post-Mortem Template

```markdown
# Incident Post-Mortem: [INC-XXX]

**Date**: YYYY-MM-DD
**Severity**: P0 | P1 | P2
**Duration**: [X hours/minutes]
**Author**: [Name]

## Summary
[What happened in 2-3 sentences]

## Timeline
| Time | Event |
|------|-------|
| HH:MM | [Event] |

## Root Cause
[What caused this]

## Impact
- Users affected: [#]
- Revenue impact: [$]
- Reputation impact: [Low/Med/High]

## Resolution
[How it was fixed]

## Prevention
| Action | Owner | Due |
|--------|-------|-----|
| [Preventive measure] | [Who] | [When] |

## Lessons Learned
[What we'll do differently]
```
