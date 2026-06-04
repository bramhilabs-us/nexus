# 4-COMPLIANCE: Compliance Audits

<!-- @GENOME T3-NAV-013 | ACTIVE | 2026-04-01 | parent:T2-NAV-005 | auto:/audit | linked:- -->

## Purpose

Ensure the product meets regulatory requirements, legal obligations, and industry standards.

## Owner

**Primary**: Legal/Compliance Lead
**Secondary**: CPO, CTO

---

## What Gets Audited

| Area | Questions | Frequency |
|------|-----------|-----------|
| Data Privacy | GDPR/CCPA compliance? Data handling? | Quarterly |
| Terms of Service | User agreements current? | Per release |
| Accessibility | WCAG compliance? | Quarterly |
| Industry Standards | SOC2, ISO certifications? | Annually |
| Licensing | Open source compliance? | Quarterly |

---

## Artifacts Stored Here

| Type | Naming | Example |
|------|--------|---------|
| Privacy audit | `YYYY_MM_DD_PRIVACY_AUDIT.md` | `2026_04_01_GDPR_COMPLIANCE_AUDIT.md` |
| Accessibility report | `YYYY_MM_DD_ACCESSIBILITY_AUDIT.md` | `2026_04_01_WCAG_AUDIT.md` |
| License audit | `YYYY_MM_DD_LICENSE_AUDIT.md` | `2026_04_01_OSS_LICENSE_AUDIT.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| Legal requirements | Regulations | Compliance baseline |
| server/models/ | Data models | Data handling review |
| client/ | UI components | Accessibility review |
| package.json | Dependencies | License review |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 1-PRODUCT/ | Compliance requirements | When regulations change |
| 3-DELIVERY/6-ISSUES/ | Compliance bugs | When found |
| 0-STAKEHOLDERS/ | Compliance status | Quarterly |

---

## Compliance Checklist

### Data Privacy (GDPR/CCPA)
- [ ] Data inventory documented
- [ ] Consent mechanisms in place
- [ ] Right to deletion implemented
- [ ] Data processing agreements signed
- [ ] Privacy policy current

### Accessibility (WCAG 2.1)
- [ ] Color contrast adequate
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Alt text on images
- [ ] Form labels present

### Licensing
- [ ] All dependencies licensed
- [ ] No GPL conflicts
- [ ] Attribution file current
- [ ] License notices displayed
