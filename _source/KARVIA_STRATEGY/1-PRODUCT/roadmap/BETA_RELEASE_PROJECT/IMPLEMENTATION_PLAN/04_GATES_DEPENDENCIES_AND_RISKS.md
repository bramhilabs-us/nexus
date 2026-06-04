# Gates, Dependencies, and Risks

<!-- @GENOME T2-PRD-016 | ACTIVE | 2026-03-30 | parent:T2-PRD-011 | auto:/coding | linked:- -->

## 1. Delivery Gates

## Gate 1: Narrative Alignment

Before implementation starts:

- beta roadmap approved
- product positioning aligned
- consultant beta model agreed

If this gate fails, engineering will implement against conflicting product definitions.

## Gate 2: Prompt Coverage

Before internal dry run:

- all beta-critical AI paths use canonical prompt templates
- all beta-critical AI responses include guidance blocks

If this gate fails, the product experience will remain inconsistent.

## Gate 3: Frontend Reframing

Before pilot:

- planning UI no longer reads like generic task software
- objective UI shows business target plus human meaning

If this gate fails, the product perception problem remains unsolved.

## Gate 4: Beta Operations

Before pilot:

- consultant weekly review process defined
- evidence capture path defined
- reporting available for blocked/deferred work

If this gate fails, beta data quality will be poor.

## 2. Dependencies

| Dependency | Why It Matters | Gate |
|------------|----------------|------|
| Prompt system is stable | Needed for reframing without backend rewrite | Gate 2 |
| Planning page is preserved | Core beta execution substrate | Gate 3 |
| Consultant reporting is available | Required for repeatable pilot ops | Gate 4 |
| Evidence capture exists | Required for future behavior-engine learning | Gate 4 |

## 3. Major Risks

### Risk 1: Overbuilding backend

Impact:

- delay
- regression risk
- lower learning velocity

Mitigation:

- enforce reuse-first decision rule

### Risk 2: Product still feels like a task tool

Impact:

- shareholder concern remains valid
- beta signal becomes noisy

Mitigation:

- prioritize prompt and UI reframing before schema work

### Risk 3: Consultant execution varies by company

Impact:

- evidence is inconsistent
- beta findings become hard to trust

Mitigation:

- standard weekly consultant cadence and review template

### Risk 4: No usable learning loop

Impact:

- cannot define GRIT engine v1 from evidence

Mitigation:

- add weekly evidence capture before pilot launch

## 4. Go / No-Go Checklist

- [ ] Product and roadmap docs aligned
- [ ] Prompt system used consistently on beta-critical flows
- [ ] Guidance blocks present everywhere needed
- [ ] Planning page reframed in UI copy
- [ ] Consultant can review blocked/deferred work
- [ ] Weekly evidence capture path available
- [ ] Internal dry run completed

