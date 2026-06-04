# Cross-Sprint Plans Audit Report — January 28, 2026

**Auditor**: Claude Code
**Scope**: Sprint Plans 10–14 (technical soundness, best practices, hardcoding, redundancies, reuse, principles)
**Files Reviewed**: 15+ planning documents, 10+ implementation files verified against plans

---

## Executive Summary

| Sprint | Issues | Critical | High | Medium | Low | Verdict |
|--------|--------|----------|------|--------|-----|---------|
| 10 | 12 | 1 | 4 | 5 | 2 | APPROVED (fix C1) |
| 11 (Epics) | 8 files | 0 | 3 outdated | 2 current | 3 archive | V2 IS SOURCE OF TRUTH |
| 12 | 17 | 1 | 5 | 8 | 3 | CONDITIONAL (fix C1, resolve V1/V2) |
| 13 | 32 | 8 | 12 | 7 | 5 | CONDITIONAL (8 blockers) |
| 14 | 10 | 4 | 1 | 3 | 2 | CONDITIONAL (4 blockers) |
| **TOTAL** | **79** | **14** | **25** | **25** | **15** | |

**Overall Quality**: 6.5/10 — Solid feature design but significant consistency gaps across sprints.

---

## Cross-Sprint Critical Blockers (MUST FIX BEFORE ANY SPRINT STARTS)

### B1. V1 vs V2 Conflict (Sprints 12, 13)
- **Problem**: Both Sprint 12 and Sprint 13 have competing V1/V2 master plans with different epic scopes
- **Impact**: Developers don't know which plan to follow; resource allocation unclear
- **Fix**: Delete or archive V1 plans; mark V2 as authoritative in both sprint folders

### B2. Missing `s13-patterns.css` Foundation
- **Problem**: Sprint 11 V2 creates this file, Sprints 12–13 assume it exists. File does not exist yet.
- **Impact**: BLOCKS ALL PAGE REDESIGNS across 3 sprints
- **Fix**: Create `client/css/s13-patterns.css` with all CSS variables as pre-Sprint-11 work

### B3. Unverified API Client Methods
- **Problem**: Plans reference `AssessmentAPI`, `ObjectivesAPI`, `DashboardAPI`, `CategoryIcons` methods that may not exist
- **Impact**: Frontend code will call non-existent methods, causing runtime failures
- **Fix**: Audit all referenced API client files before each sprint starts; create stubs for missing methods

### B4. Multi-Tenancy Not Verified on New Endpoints
- **Problem**: Sprints 12–14 add endpoints without confirming `company_id` filtering
- **Impact**: Potential data leakage between companies
- **Fix**: Pre-implementation audit of all endpoints for `req.user.company_id` filtering

---

## Sprint 10 Findings (12 Issues)

**Status**: COMPLETE — Code exists, audit is retrospective

| ID | Sev | Category | Location | Issue |
|----|-----|----------|----------|-------|
| S10-C1 | CRITICAL | Auth | `diagnostic-reports.js:807` | Missing `authenticateToken` on `/ssi/:companyId/benchmark` |
| S10-H1 | HIGH | Config | `company-profile.js:27-31` | Hardcoded risk thresholds (50, 50, 40) |
| S10-H2 | HIGH | Multi-tenancy | `diagnostic-reports.js` (multiple) | Inconsistent company access validation patterns |
| S10-H3 | HIGH | Config | `ValidationService.js:410-435` | 20+ vague phrase regexes hardcoded in class |
| S10-H4 | HIGH | Security | `company-profile.js:852` | XSS risk in error display (innerHTML) |
| S10-M1 | MEDIUM | Config | `ValidationService.js:495,559` | Hardcoded quality thresholds (80/50) |
| S10-M2 | MEDIUM | Reuse | `SSINarrativeService.js:18` | No industry validation before narrative generation |
| S10-M3 | MEDIUM | Robustness | `SSINarrativeService.js:254` | No LLM response schema validation |
| S10-M4 | MEDIUM | Consistency | `SSINarrativeService.js:364-370` | Fallback narrative depends on array sort order |
| S10-M5 | MEDIUM | Reuse | `company-profile.js:386` | Duplicates `escapeHtml()` instead of importing from `common.js` |
| S10-L1 | LOW | Input | `company-profile.js:95` | Missing token existence check before API call |
| S10-L2 | LOW | Validation | `company-profile.js:763` | No client-side numeric bounds on `employee_count` |

---

## Sprint 11 Findings (Epic Specification Audit)

**Status**: PLANNING — V2 Master Plan is authoritative

| File | Status | Action |
|------|--------|--------|
| `EPIC-QA-QUESTION-ANSWER-CREDIBILITY.md` | OUTDATED | Archive; superseded by V2 (13 pts → 5 pts in V2) |
| `EPIC-J-ASSESSMENT-CREDIBILITY.md` | OUTDATED | Wrong sprint attribution (says Sprint 10); use V2 |
| `EPIC-U-UI-STANDARDIZATION.md` | SUPERSEDED | V2 has better scope (22 pts → 11 pts); archive |
| `EPIC-L-PLANNING-PAGE-REDESIGN.md` | CURRENT | Keep; moved to Sprint 12 per V2; add XSS fixes |
| `FEATURE-QUESTION-ANSWER-TYPE-VALIDATION.md` | CURRENT | Primary source for response type config |
| `ISSUE-INDUSTRY-TAGGING.md` | INTEGRATE | Fold into Epic J/QA; don't treat separately |
| `SPRINT-11-PAGE-MATRIX.md` | ARCHIVE | Internal planning doc; V2 supersedes |
| `SPRINT-11-MASTER-PLAN-V2.md` | **PRIMARY** | Adopt as sole authoritative source |

**Key Conflicts Resolved**:
- Epic QA vs FEATURE file → Use FEATURE file (5 pts)
- Epic L placement → Sprint 12 (per V2)
- Epic U scope → V2's 11 pts (not 22)
- Dashboard changes → Defer to Sprint 13 (per V2)

---

## Sprint 12 Findings (17 Issues)

| ID | Sev | Category | Issue |
|----|-----|----------|-------|
| S12-C1 | CRITICAL | Auth | Missing `authenticateToken` on `POST /api/ai-okr/generate-from-company` (`ai-okr.js:1201`) |
| S12-H1 | HIGH | Data | Hardcoded improvement percentages (20%, 30%) in OKR templates (`ai-okr.js:797,834`) |
| S12-H2 | HIGH | Architecture | Inconsistent LLM models: `gpt-3.5-turbo-0125` vs `gpt-4o-mini` (`planning.js:1548,1679`) |
| S12-H3 | HIGH | Architecture | Missing `response_format: { type: 'json_object' }` on planning LLM calls |
| S12-H4 | HIGH | API | Payload field mismatch in objectives UI (`objectives.html:1538`) |
| S12-H5 | HIGH | Planning | 23 pts of deferred Epic Q work may affect Sprint 12 quality |
| S12-M1 | MEDIUM | Architecture | `TargetCalculatorService` not yet created (blocks Epic O) |
| S12-M2 | MEDIUM | Architecture | `AIContextService` missing methods for Epic N |
| S12-M3 | MEDIUM | Planning | V1 vs V2 scope conflict (72 pts vs 53 pts) |
| S12-M4 | MEDIUM | Data | Missing industry enum validation on `Company.js:44` |
| S12-M5 | MEDIUM | Data | Metric structure mismatch (provenance vs flat) between model and plan |
| S12-M6 | MEDIUM | Documentation | Missing module reuse verification checklist |
| S12-M7 | MEDIUM | Security | RBAC not specified for dashboard task actions |
| S12-M8 | MEDIUM | Security | Multi-tenancy not verified for new dashboard endpoints |
| S12-L1 | LOW | Documentation | Inconsistent epic naming between V1/V2 |
| S12-L2 | LOW | Architecture | Missing `response_format` in DiagnosticEngine (deferred) |
| S12-L3 | LOW | Testing | Sprint 11 QA completion not verified as prerequisite |

---

## Sprint 13 Findings (32 Issues)

| ID | Sev | Category | Issue |
|----|-----|----------|-------|
| S13-C1 | CRITICAL | Planning | V1 (8 pts) vs V2 (58 pts) conflict — completely different scope |
| S13-C2 | CRITICAL | Infrastructure | `s13-patterns.css` doesn't exist yet — blocks all redesigns |
| S13-C3 | CRITICAL | API | Route path inconsistency (`/api/assessment-questions` vs camelCase file) |
| S13-C4 | CRITICAL | Architecture | Hardcoded mockup references without dynamic rendering rules |
| S13-C5 | CRITICAL | Scope | Epic N (21 pts) contradicts claim that endpoints "ALREADY EXIST" |
| S13-C6 | CRITICAL | Verification | Epic V claims all 8 endpoints exist but response shapes unverified |
| S13-C7 | CRITICAL | Security | Multi-tenancy not verified for Epics N, O, U2 endpoints |
| S13-C8 | CRITICAL | Rollback | Rollback plan references files that may not exist yet |
| S13-H1 | HIGH | Architecture | Epic T navigation order conflicts with current `navigation.js` |
| S13-H2 | HIGH | Verification | `CategoryIcons.getAllCategories()` method unverified |
| S13-H3 | HIGH | Architecture | `DashboardAPI` module existence unclear |
| S13-H4 | HIGH | API | Team SSI aggregation endpoint ambiguous ("or" between two options) |
| S13-H5 | HIGH | Infrastructure | s13-patterns.css color variables not finalized |
| S13-H6 | HIGH | Verification | `ObjectivesAPI` method signatures unverified |
| S13-H7 | HIGH | Verification | `AssessmentAPI` methods (8 claimed) not confirmed in codebase |
| S13-H8 | HIGH | Verification | Planning.js AI endpoint not confirmed for Epic M-Ph1 |
| S13-H9 | HIGH | Security | No role-based testing criteria for Objectives UI |
| S13-H10 | HIGH | Estimation | Point totals math verification needed |
| S13-H11 | HIGH | Testing | No test cases for empty/error states |
| S13-H12 | HIGH | Scope | Chat feature deferred without backlog tracking |
| S13-M1 | MEDIUM | Documentation | Mockup paths not standardized across plans |
| S13-M2 | MEDIUM | Performance | No performance targets for new pages |
| S13-M3 | MEDIUM | UX | No error state UI specifications |
| S13-M4 | MEDIUM | Responsive | Mobile breakpoints not defined |
| S13-M5 | MEDIUM | Deployment | No feature flag rollout strategy |
| S13-M6 | MEDIUM | Data | No migration plan for status field changes |
| S13-M7 | MEDIUM | Scope | PDF export "enhanced" underspecified (4 pts) |
| S13-L1 | LOW | Documentation | V1 archived specs still in main doc |
| S13-L2 | LOW | Documentation | Inconsistent "pts" vs "story points" terminology |
| S13-L3 | LOW | Planning | No pre-sprint checklist for prerequisites |
| S13-L4 | LOW | UX | No backward compatibility for old page URLs |
| S13-L5 | LOW | Security | No security audit mentioned in implementation plan |

---

## Sprint 14 Findings (10 Issues)

| ID | Sev | Category | Issue |
|----|-----|----------|-------|
| S14-C1 | CRITICAL | Infrastructure | Q5: No industry profile template structure exists (only 1 JSON, no prompts) |
| S14-C2 | CRITICAL | Standards | Hardcoded TTL constants (86400, 300) violate config principles |
| S14-C3 | CRITICAL | Architecture | Q11: SSE JWT fallback has 1 sentence, 0 implementation details |
| S14-C4 | CRITICAL | Scope | Q7: Hallucination guardrails are a stub function with no validation logic |
| S14-H1 | HIGH | Data | Q5 claims "7 industries" but count unverified in code |
| S14-M1 | MEDIUM | Dependencies | Q3→Q4 dependency chain not documented |
| S14-M2 | MEDIUM | Architecture | Cache invalidation hooks not mapped to actual routes |
| S14-M3 | MEDIUM | Estimation | Q5 (3 pts) and Q7 (3 pts) likely need 5 pts each; total 23→27-28 pts |
| S14-L1 | LOW | API | Streaming endpoint route path not finalized |
| S14-L2 | LOW | Security | Cache key edge cases (poisoning, collision) not addressed |

---

## Cross-Sprint Dependency Chain

```
Sprint 11 (59 pts)
  └─ Creates: s13-patterns.css, AssessmentHub, QuestionLibrary, TeamsPage
  └─ Prerequisite for: Sprint 12, 13, 14

Sprint 12 (53 pts)
  └─ Creates: Dashboard redesign, Planning redesign, TargetCalculatorService
  └─ Depends on: Sprint 11 complete
  └─ Prerequisite for: Sprint 13

Sprint 13 (58 pts)
  └─ Creates: Objectives redesign, SSI Report, Navigation redesign, OKR features
  └─ Depends on: Sprint 11 + 12 complete, s13-patterns.css exists

Sprint 14 (23 pts)
  └─ Creates: LLM quality improvements, caching, streaming
  └─ Depends on: Sprint 13 complete
  └─ No downstream dependencies
```

**Total Roadmap**: 193 pts across 4 sprints

---

## Redundancy & Reuse Analysis

### Good Reuse Patterns
- `ObjectivesAPI` reused across Dashboard, Objectives page, Planning page
- `CategoryIcons` reused for badges across multiple pages
- `NavigationManager` consistent across all pages
- `escapeHtml()` XSS prevention pattern established
- `feature-flags.js` graceful degradation for all optional features
- `SSINarrativeService` extended (not duplicated) across Sprints 10–14

### Bad Redundancy Found
- `escapeHtml()` duplicated in `company-profile.js` instead of importing from `common.js`
- Navigation philosophy colors hardcoded in Epic T spec instead of referencing `s13-patterns.css`
- Progress color calculation functions duplicated across pages (`getProgressColor`, `getKRColorClass`)
- Status badge logic repeated instead of centralized
- Multi-tenancy validation patterns inconsistent (should be middleware)

---

## Hardcoding Violations Summary

| Location | Value | Sprint | Fix |
|----------|-------|--------|-----|
| `company-profile.js:27-31` | Risk thresholds (50, 50, 40) | 10 | Move to company config |
| `ValidationService.js:495,559` | Quality thresholds (80, 50) | 10 | Move to config |
| `ValidationService.js:410-435` | 20+ vague phrase regexes | 10 | Externalize to config file |
| `ai-okr.js:797,834` | Improvement % (20%, 30%) | 12 | TargetCalculatorService |
| `planning.js:1548,1679` | `gpt-3.5-turbo-0125` model | 12 | Centralize in `config/ai.js` |
| Sprint 14 Q6 | TTL `86400` | 14 | Environment variable |
| Sprint 14 Q11 | Ticket expiry `300` | 14 | Environment variable |
| Epic L plan | Week count fallback `13` | 12 | Get from `period_definition` |

---

## Top 10 Recommended Actions (Priority Order)

1. **Archive V1 plans** in Sprint 12 and 13; mark V2 as authoritative
2. **Create `s13-patterns.css`** with all CSS variables before Sprint 11 starts
3. **Fix `diagnostic-reports.js:807`** — add `authenticateToken` (1-line fix, blocks auth bypass)
4. **Fix `ai-okr.js:1201`** — add `authenticateToken` (1-line fix, blocks auth bypass)
5. **Audit all API client files** (AssessmentAPI, ObjectivesAPI, DashboardAPI, CategoryIcons) — document actual methods vs planned
6. **Audit all endpoints for `company_id` filtering** before implementing new features
7. **Archive outdated Sprint 11 epic specs** (QA, J, U) — keep V2 + FEATURE file only
8. **Centralize LLM model config** in `server/config/ai.js` (fixes inconsistent gpt-3.5 vs gpt-4o-mini)
9. **Create `requireCompanyAccess()` middleware** to standardize multi-tenancy checks
10. **Define Sprint 13 pre-flight checklist** listing all prerequisites that must be verified

---

## Quality Gate Recommendations

### Before Each Sprint Starts
- [ ] Confirm V2 is sole authoritative plan
- [ ] All referenced API client methods verified to exist
- [ ] `s13-patterns.css` exists with all required variables
- [ ] Multi-tenancy audit complete for all new endpoints
- [ ] RBAC matrix defined for all new UI actions

### Post-Implementation (Before Deploy)
- [ ] All 5 roles tested for new features
- [ ] `escapeHtml()` applied to all dynamic HTML rendering
- [ ] Error states tested and UI handles gracefully
- [ ] No hardcoded magic numbers in new code
- [ ] Company isolation tested (Company A cannot see Company B data)

---

**Audit Complete**: January 28, 2026
**Total Issues Found**: 79 (14 Critical, 25 High, 25 Medium, 15 Low)
**Recommendation**: Fix 4 cross-sprint blockers (B1–B4) before Sprint 11 begins
