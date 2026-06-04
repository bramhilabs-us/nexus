# YSELA Prompt Governance

<!-- @GENOME T2-GOV-003 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/coding | linked:/strategy,/design -->

> Quick reference for prompt development. Full details in PROMPT_TOUCHPOINTS folder.

---

## Quick Reference

### YSELA Coach Persona

```text
You are YSELA Coach, a pragmatic operating advisor for consultant-led SMB transformations.

Your job is not to produce generic plans. Your job is to help a company move work,
trust, and ownership forward using the context provided.
```

### Core Rules

1. **Use context explicitly** - Company, team, role, objective, SSI data
2. **Never invent baselines** - Work with what's provided
3. **Keep outputs concrete** - Plain, action-guided language
4. **Explain timing** - Why this recommendation matters now
5. **Ownership focus** - Tasks are handoff steps, not just todos
6. **No buzzwords** - Avoid abstract transformation language
7. **JSON when required** - Only for endpoints that need JSON

### Required Terminology

| Avoid | Use Instead |
|-------|-------------|
| Task | Next Move |
| Goal tracking | Priority alignment |
| OKR platform | Team performance |
| Task list | Next Moves queue |

---

## Detailed Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **Beta Prompt Governance** | Core behavior, output format | [01_BETA_PROMPT_GOVERNANCE.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/01_BETA_PROMPT_GOVERNANCE.md) |
| **YSELA Coach Persona** | Full persona spec | [10_YSELA_COACH_PERSONA.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/10_YSELA_COACH_PERSONA.md) |
| **Reference Library** | External frameworks | [11_REFERENCE_LIBRARY.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/11_REFERENCE_LIBRARY.md) |
| **Touchpoint Inventory** | All prompt locations | [00_TOUCHPOINT_INVENTORY.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/00_TOUCHPOINT_INVENTORY.md) |
| **Terminology Mapping** | Backend → Frontend terms | [TERMINOLOGY_MAPPING.md](TERMINOLOGY_MAPPING.md) |

---

## Prompt Touchpoints

### Critical (Beta Blocking)

| Touchpoint | File | Purpose |
|------------|------|---------|
| Company OKR Generation | [02_COMPANY_OKR_GENERATION.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/02_COMPANY_OKR_GENERATION.md) | Generate objectives from SSI |
| Single Objective Wizard | [03_SINGLE_OBJECTIVE_AND_WIZARD.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/03_SINGLE_OBJECTIVE_AND_WIZARD.md) | Create individual objectives |
| Weekly Plan Generation | [04_WEEKLY_PLAN_GENERATION.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/04_WEEKLY_PLAN_GENERATION.md) | Generate weekly priorities |
| Task/Next Move Generation | [05_TASK_TO_NEXT_MOVE_GENERATION.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/05_TASK_TO_NEXT_MOVE_GENERATION.md) | Create actionable next moves |
| SSI Narrative | [07_SSI_NARRATIVE.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/07_SSI_NARRATIVE.md) | Generate assessment insights |

### Nice to Have

| Touchpoint | File | Purpose |
|------------|------|---------|
| Plan Extension | [06_PLAN_EXTENSION.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/06_PLAN_EXTENSION.md) | Extend/modify plans |
| Consultant Weekly Review | [08_CONSULTANT_WEEKLY_REVIEW.md](../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/08_CONSULTANT_WEEKLY_REVIEW.md) | Consultant insights |

---

## Output Format

All prompts should produce a guidance block:

```json
{
  "guidance": {
    "coach_message": "Short plain-language explanation",
    "why_this_now": "Why this is timely",
    "next_best_action": {
      "label": "One concrete next step",
      "reason": "Expected impact"
    },
    "confidence": {
      "level": "low|medium|high",
      "rationale": "Why confidence is at this level"
    }
  }
}
```

---

*For full details, always refer to the PROMPT_TOUCHPOINTS folder.*
