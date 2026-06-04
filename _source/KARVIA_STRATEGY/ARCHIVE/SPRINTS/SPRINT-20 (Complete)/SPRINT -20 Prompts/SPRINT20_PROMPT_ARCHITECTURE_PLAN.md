# Sprint 20 Prompt Architecture Plan

## Goal

Tie all Sprint 20 prompts into one coherent objective-creation conversation that feels personal, grounded, and useful.

## Prompt chain

### Stage 0: Shared system layer

Source of truth:
- `server/prompts/base-system-prompt.js`
- Sprint 17 prompt conventions

Add Sprint 20-specific rules on top of the base coach identity:
- keep language plain
- make objective titles concrete
- never fabricate baselines
- preserve the user's original intent
- generate KR sets with metric diversity

### Stage 1: Pre-prompt

Purpose:
- warm the session
- summarize context internally
- reduce visible latency on Screen 2 and 3

Input:
- company summary
- maturity stage
- selected category
- selected priority
- SSI weak areas
- top strategic priority
- existing objective titles
- baseline availability

Output:
- lightweight JSON acknowledgment only
- internal focus summary for the next turn

This prompt should not attempt to generate the objective yet.

### Stage 2: Refine objective

Purpose:
- take the user's rough idea
- return one refined objective that is clearer, more strategic, and still recognizably theirs

Input:
- hidden pre-prompt summary
- user free-text intent
- category
- priority
- company context
- maturity constraints

Output contract:
- one refined objective
- short rationale
- SMART improvement notes
- optional one-question clarification only if quality is blocked

### Stage 3: Generate KRs

Purpose:
- generate exactly 4 KRs around the refined objective
- cover four distinct levers where possible

Input:
- refined objective
- rationale
- company context
- baseline metrics
- existing active objectives
- rejection history if available

Output contract:
- 4 KRs
- each KR with title, description, metric_type, target_value, baseline_value, unit, quarter
- set-level rationale
- assumptions
- confidence

### Stage 4: Regenerate one KR

Purpose:
- replace only one KR using user feedback
- keep the rest of the set stable

Input:
- refined objective
- full current KR set
- KR index being replaced
- user feedback on why it is weak
- diversity constraints

Output contract:
- one replacement KR
- short explanation of what changed
- confirmation that the new KR does not duplicate remaining KRs

## Shared context envelope

Every prompt should use the same normalized envelope.

```json
{
  "company": {
    "name": "string",
    "industry": "string",
    "employee_count": 120
  },
  "maturity": {
    "stage": 1,
    "confidence": "medium",
    "limitations": ["No historical outcomes yet"]
  },
  "user_selection": {
    "category": "customer_success",
    "priority": "high"
  },
  "strategy": {
    "priority_one": "Improve client retention through a stronger onboarding experience"
  },
  "ssi": {
    "weak_areas": ["response", "operations"]
  },
  "existing_objectives": [
    "Reduce time-to-value for new clients"
  ],
  "baselines": {
    "available": true,
    "metrics": [
      "client_retention_rate_pct=88",
      "time_to_value_days=21"
    ]
  }
}
```

## Output contracts

### Pre-prompt response

```json
{
  "ready": true,
  "session_focus": "High-priority customer success objective linked to onboarding and retention",
  "assumptions": [
    "Retention is materially affected by onboarding quality"
  ]
}
```

### Refine response

```json
{
  "refined_objective": {
    "title": "Reduce new-client time-to-value through a standardized onboarding experience",
    "description": "Create a consistent onboarding journey that speeds activation, improves early confidence, and strengthens retention."
  },
  "rationale": "This preserves the user's onboarding intent while making the business outcome measurable and aligned to customer success.",
  "smart_notes": [
    "Specific outcome added: reduced time-to-value",
    "Business impact made explicit: retention and activation"
  ],
  "ask_user": null
}
```

### Generate KRs response

```json
{
  "key_results": [],
  "set_rationale": "The KR set balances speed, adoption, satisfaction, and retention.",
  "assumptions": [],
  "confidence": {
    "level": "medium",
    "rationale": "Onboarding and retention baselines are available, but product adoption baseline is missing."
  }
}
```

### Regenerate KR response

```json
{
  "replacement_kr": {},
  "change_summary": "Replaced a vague activity-style KR with a measurable adoption outcome.",
  "duplication_check": "No overlap with the remaining KR metrics."
}
```

## Deterministic validators between prompts

### Objective validator

Pass rules:
- title is action-oriented and under 15 words
- description explains business impact
- category matches actual Objective enum
- no buzzwords from base prompt ban list

### KR set validator

Pass rules:
- exactly 4 KRs
- no duplicate primary metrics
- no fabricated baseline values
- quarter coverage is sensible
- KRs are outcomes, not tasks

### KR regeneration validator

Pass rules:
- only one KR changed
- replacement aligns to same objective
- replacement does not duplicate another KR's metric or mechanism

## Tying rules across the whole flow

1. The same company name, category, priority, and strategy language must persist across all prompts.
2. Refine output becomes the only objective source of truth for later prompts.
3. KR generation cannot silently change the objective category or intent.
4. Regeneration can improve one KR but cannot alter the objective or the untouched KRs.
5. Guidance and confidence language must stay consistent with the Sprint 17 prompt pack.

## Practical implementation notes

1. Add a new prompt type family under `server/prompts/objective-wizard/`.
2. Reuse `getPromptWithMaturity()` for stage-aware system instructions.
3. Keep wizard-specific JSON contracts small and explicit.
4. Log prompt input and output with `AILoggingWrapper`.
5. Validate server-side before returning anything to the UI.
