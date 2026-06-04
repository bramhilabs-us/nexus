# Inventory — Epic D: Assessment Hub Enhancements

<!-- @GENOME T3-SPR-022-PW-ID | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

**Spec**: [EPIC_D_ASSESSMENT.md](../epics/EPIC_D_ASSESSMENT.md)
**Points**: 8

---

## Reuse-First Matrix

| Capability | Status | Existing | Action |
|------------|--------|----------|--------|
| Assessment.ssi_result schema | 🔧 extend | `server/models/Assessment.js:485` has `ssi_result.{overall, dimensions}` | EXTEND with `sub_dimensions` and `constraint` |
| 12 sub-dimensions per SSI | 🆕 new | nothing structured (some `ssi_scores.*.questions_answered` etc. exist) | ADD nested schema to ssi_result |
| Constraint auto-identification | 🆕 new | none | ADD scoring service hook |
| Detailed results endpoint | 🔧 extend | `GET /api/assessments/:id/detailed-results` exists at `server/routes/assessments.js:1573` | EXTEND response with `sub_dimensions` |
| Trends endpoint | 🆕 new | none | CREATE `GET /api/assessments/trends` |
| Compare endpoint | 🆕 new | none | CREATE `GET /api/assessments/compare` |
| Assessment Hub HTML | 🔧 extend | `client/pages/assessment-hub.html` exists | ADD tabs 4, 5, 6 |
| Assessment Hub script | ⚠️ conflict | `client/pages/scripts/assessment-hub.js` does **NOT** exist (Epic D spec says "MODIFY") | CREATE the file (spec is wrong) |
| Charts library | 🆕 new | Chart.js may or may not be loaded — verify | CREATE `client/js/assessment-charts.js` and ensure Chart.js loaded |

---

## ⚠️ Critical Spec Mismatch

Epic D's "Files to Create/Modify" lists `client/pages/scripts/assessment-hub.js` as MODIFY — **the file does not exist** in the repo. Behavior in `assessment-hub.html` is currently inline or in a different script. Need to:
1. Confirm where current Assessment Hub logic lives (search for inline `<script>` blocks in assessment-hub.html)
2. Either CREATE the file fresh with all logic OR identify the actual current script

---

## Existing Code Touched

| File | Lines | Current behavior | Sprint 22 change |
|------|-------|------------------|------------------|
| `server/models/Assessment.js` | 485+ (ssi_result block) | `ssi_result.{overall.score, dimensions.{speed,strength,intelligence}.{score,level,description}}` | EXTEND with `sub_dimensions.{speed,strength,intelligence}.<sub>.{score}` and `constraint.{dimension,sub_dimension,score}` |
| `server/routes/assessments.js` | 1573 (detailed-results) | Returns ssi_result | EXTEND to include sub_dimensions |
| `server/routes/assessments.js` | end of file | n/a | ADD trends + compare routes |
| `client/pages/assessment-hub.html` | full | 3 existing tabs (per Session #174 mockup boundary note: tabs 1-3 stay) | ADD tabs 4, 5, 6 |

---

## Net-New Files

```
client/js/assessment-charts.js                NEW (Chart.js wrappers)
client/pages/scripts/assessment-hub.js        NEW (per spec mismatch above)
```

---

## Net-New API Endpoints

| Method | Path | Owner |
|--------|------|-------|
| GET | `/api/assessments/trends?team_id=&period=` | D |
| GET | `/api/assessments/compare?id1=&id2=` | D |

---

## Conflicts / Decisions Required

| ID | Conflict | Refer to |
|----|----------|----------|
| D-1 | `assessment-hub.js` listed MODIFY but does not exist — change to CREATE | DECISIONS_LOG.md → D-D-1 |
| D-2 | Assessment model has BOTH `ssi_scores.{speed,strength,intelligence}.score` (line ~95) AND `ssi_result.{overall, dimensions, ...}` (line 485). Sub-dimensions go under `ssi_result.sub_dimensions` per spec — but is this populated by all scoring paths today? | DECISIONS_LOG.md → D-D-2 |
| D-3 | Constraint identification: spec returns lowest sub-dim. But: include vs exclude small-N sub-dims? Tie-breaking? | DECISIONS_LOG.md → D-D-3 |
| D-4 | Compare endpoint authorization: any role with both assessment IDs visible — but spec only checks "authenticated"; needs tenant scope check | DECISIONS_LOG.md → D-D-4 |
| D-5 | Trends endpoint: `period='12months'` default — but groupByMonth assumes complete months. Behavior on partial current month? | DECISIONS_LOG.md → D-D-5 |
| D-6 | Chart.js not currently loaded on assessment-hub.html — add CDN, vendor file, or import path? | DECISIONS_LOG.md → D-D-6 |
| D-7 | Sub-dimension scoring: who computes them? Where in the existing scoring pipeline? Need migration for existing assessments (back-fill or NULL) | DECISIONS_LOG.md → D-D-7 |

---

## Acceptance-Criteria Coverage Audit

Current AC (8 items) covers: schema, scoring, constraint, detailed API, 3 tabs, deltas, filters. **Gaps**:
- No AC for migration of existing assessments (sub_dimensions absent)
- No AC for compare endpoint tenant scope
- No AC for trends edge cases (no data, single month)

Add 3 AC items.

---

## Test-Plan Stub

- Unit: identifyConstraint() returns lowest sub-dim, ties resolved deterministically
- Unit: detailed-results returns sub_dimensions when present, omits gracefully when absent
- Integration: trends endpoint groups by month, returns empty array for no-data case
- Integration: compare endpoint rejects cross-tenant assessment IDs
- Playwright: tabs 4/5/6 render; trends chart draws with stub data; compare deltas color-coded
- Migration: existing assessment without sub_dimensions still loads; UI handles gracefully
