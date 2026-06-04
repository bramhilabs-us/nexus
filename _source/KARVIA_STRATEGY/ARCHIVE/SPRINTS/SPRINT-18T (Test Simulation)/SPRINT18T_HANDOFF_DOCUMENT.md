# Sprint 18-T Handoff Document

**Sprint**: 18-T (Test Simulation)
**Type**: Research/Validation Sprint (No production code)
**Status**: PLANNED
**Created**: March 11, 2026

---

## Sprint Overview

**Goal**: Simulate the complete AI journey for KARVIA Consulting from Day 0 to Day 365 to validate all prompts, context accumulation, and inform better sprint planning.

**Trigger**: During KARVIA Consulting Flow testing, we discovered OKR quality issues (5/10) that led to Epic P1. This simulation validates the fix and maps ALL AI touchpoints.

---

## Sprint Backlog

| ID | Task | Points | Status | Description |
|----|------|--------|--------|-------------|
| T1 | Stage 1-2: Seed Data | 2 | PENDING | Company profile + SSI assessment data |
| T2 | Stage 3: First OKR Generation | 3 | PENDING | Simulate with improved prompt (P1) |
| T3 | Stage 4: Subsequent OKRs | 3 | PENDING | Test context accumulation |
| T4 | Stage 5-6: Planning + Tasks | 3 | PENDING | Weekly plan + task generation |
| T4.5 | Stage 6.5-6.6: Incremental Planning | 3 | PENDING | Weeks 5-8, 9-12 with context |
| T5 | Stage 7: Q1 Review | 3 | PENDING | Progress context simulation |
| T6 | Stage 8: Mid-Year Review | 3 | PENDING | H1 context simulation |
| T7 | Stage 10: Year-End | 3 | PENDING | Full year context |
| T8 | Context Service Design | 5 | PENDING | Architecture from learnings |
| T9 | Sprint Impact Analysis | 3 | PENDING | Document dependencies |
| T10 | Final Report | 2 | PENDING | Summary + recommendations |
| **Total** | | **33** | | |

```
Sprint 18-T Progress: [          ] 0/33 pts (0%)
```

---

## Dependencies

### Blocking Dependencies

| Sprint | What We Need | Why |
|--------|--------------|-----|
| Sprint 18-A (P1.3) | Lean prompt structure | To simulate improved prompts |
| Sprint 18-B | SSIModule | To simulate Stage 2 scoring |

### Non-Blocking

| Sprint | Relationship |
|--------|--------------|
| Sprint 19 | Insights endpoints may not exist yet - simulate expected responses |

---

## Simulation Files Location

```
KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/
├── simulation/
│   ├── stage1_company_profile.json
│   ├── stage2_ssi_assessment.json
│   ├── stage3_okr_gen_1_prompt.txt
│   ├── stage3_okr_gen_1_response.json
│   ├── stage4_okr_gen_2_prompt.txt
│   ├── stage4_okr_gen_2_response.json
│   ├── stage5_weekly_plan_prompt.txt
│   ├── stage5_weekly_plan_response.json
│   ├── stage6_tasks_prompt.txt
│   ├── stage6_tasks_response.json
│   ├── stage7_q1_review_prompt.txt
│   ├── stage7_q1_review_response.json
│   ├── stage8_midyear_prompt.txt
│   ├── stage8_midyear_response.json
│   ├── stage10_year_end_prompt.txt
│   ├── stage10_year_end_response.json
│   └── SIMULATION_ANALYSIS.md
```

---

## What This Sprint Produces

1. **Validated Prompts** - Exact prompts for each AI touchpoint
2. **Expected Responses** - Quality-scored AI responses
3. **Context Service Design** - Architecture for accumulation
4. **Sprint Dependencies** - What must be built when
5. **Missing Endpoints** - APIs that don't exist yet
6. **Quality Benchmarks** - Target scores for each stage

---

## Key Questions to Answer

| Question | Stage | Answer Location |
|----------|-------|-----------------|
| Does P1 fix OKR quality? | 3 | stage3_response vs original |
| Does context accumulation work? | 4+ | Prompt analysis |
| What endpoints are missing? | 7, 8, 10 | SIMULATION_ANALYSIS.md |
| What's in ContextService? | All | Context Service Design |
| What's the token budget? | All | Token tracking |

---

## Execution Notes

### How to Run Simulations

1. **Direct OpenAI Calls**: Use API key to test prompts directly
2. **Record Everything**: Save both prompt and response
3. **Score Quality**: Rate each response 1-10
4. **Note Issues**: Document any gaps or problems
5. **Iterate**: Refine prompts based on responses

### Quality Scoring Criteria

| Score | Meaning |
|-------|---------|
| 9-10 | Production ready, no changes needed |
| 7-8 | Good, minor refinements |
| 5-6 | Acceptable, needs work |
| 1-4 | Not usable, major issues |

---

## Related Documents

- [Sprint 18-T Master Plan](./SPRINT18T_MASTER_PLAN.md) - Full journey map
- [Sprint 18-A Handoff](../SPRINT-18A%20(Hotfix)/SPRINT18A_HANDOFF_DOCUMENT.md) - Epic P1
- [Prompt Improvement Validation](../../4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/PROMPT_IMPROVEMENT_VALIDATION.md) - Stage 3 already simulated

---

## Prior Work

Stage 3 (First OKR Generation) was already simulated during today's session:

| Metric | Original | Improved |
|--------|----------|----------|
| Token Usage | ~6,500 | 1,915 |
| Quality Score | 5/10 | 9/10 |
| KR Diversity | 4/10 | 9/10 |
| SSI Targeting | 1/10 | 10/10 |

Files created:
- `prompts/improved_system_prompt.txt`
- `prompts/improved_user_prompt.txt`
- `prompts/improved_response.json`
- `PROMPT_IMPROVEMENT_VALIDATION.md`

---

**Document Version**: 1.0.0
**Last Updated**: March 11, 2026
