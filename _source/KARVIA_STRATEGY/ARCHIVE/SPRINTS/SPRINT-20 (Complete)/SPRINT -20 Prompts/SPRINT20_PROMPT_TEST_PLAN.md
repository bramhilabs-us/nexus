# Sprint 20 Prompt Test Plan

## Purpose

Test prompt behavior before finalizing the Sprint 20 prompt pack.

The test goal is not just correct JSON. The goal is a coherent objective-creation experience that feels useful from Screen 1 through final KR review.

## Test sequence

### Phase 1: Contract validation

Validate that each prompt returns the expected keys and types.

Checks:
- valid JSON
- required keys present
- no extra narrative outside JSON
- enum-safe category values

### Phase 2: Quality validation

Score outputs using the rubric below.

### Phase 3: Experience validation

Review the full chain as one conversation:
- does the refine step clearly build on the user idea?
- do KRs feel like the next logical step?
- does regenerate improve one weak KR without destabilizing the set?

## Core test scenarios

### Scenario A: Strong context, strong baselines

Use when:
- SSI exists
- company profile is mature
- baseline metrics are present

Expected:
- refine is highly specific
- KRs use `from X to Y` where justified
- confidence is medium or high

### Scenario B: Strong context, weak baselines

Use when:
- SSI exists
- company strategy exists
- baseline metrics are missing

Expected:
- objective stays specific
- KRs use target-only wording
- assumptions explicitly note missing baselines

### Scenario C: Weak context, early-stage company

Use when:
- maturity stage 0-1
- limited historical data

Expected:
- output is still useful but more conservative
- one KR establishes a baseline
- no invented company-specific metrics

### Scenario D: User writes a vague idea

Input example:
- "make onboarding better"

Expected:
- refine step sharpens the idea without changing the core intent
- KR set translates the idea into measurable business outcomes

### Scenario E: User writes an activity instead of an outcome

Input example:
- "build a training deck for onboarding"

Expected:
- refine converts activity into business objective
- KRs measure time-to-value, adoption, satisfaction, or retention rather than deck completion alone

### Scenario F: KR regeneration feedback

Feedback example:
- "This KR is too vague and sounds like a task"

Expected:
- replacement KR becomes measurable
- other KRs remain unchanged
- metric diversity remains intact

## Quality rubric

Score each visible AI stage from 1-5.

### Refine objective rubric

1. Personalization
   - references selected area, urgency, or company context
2. Intent preservation
   - still feels like the user's original idea
3. Strategic clarity
   - ties to a real business outcome
4. Plain language
   - free of generic consulting language
5. Actionability
   - sets up KR generation cleanly

Pass threshold:
- average 4.0+
- no score below 3

### KR generation rubric

1. Objective alignment
2. Metric diversity
3. Measurability
4. Baseline honesty
5. Realism
6. Non-duplication with existing objectives

Pass threshold:
- average 4.2+
- metric diversity must score 5 for approval

### KR regeneration rubric

1. Responds to user feedback
2. Improves measurability
3. Preserves objective fit
4. Preserves set coherence
5. Avoids duplication

Pass threshold:
- average 4.0+

## Failure reasons that block prompt finalization

1. The refine step overwrites the user's core idea.
2. The KR set repeats the same metric multiple times.
3. The model fabricates baselines.
4. The response category does not match real backend enums.
5. Regeneration changes more than one KR.
6. Tone changes noticeably across steps.

## Minimum pre-release test pack

Before prompt finalization, run at least:
- 3 tests for Scenario A
- 3 tests for Scenario B
- 2 tests for Scenario C
- 3 tests for Scenario D/E combined
- 3 tests for Scenario F

Minimum sample count: 14 end-to-end prompt chains.

## What to log during live testing

For each chain capture:
- input context summary
- prompt version
- output JSON
- rubric score
- validator warnings
- keep or reject decision

## Finalization rule

Prompts can be marked final only when:
- all fixtures stay schema-valid
- the 14-chain sample passes thresholds
- no blocking failure repeats more than once
