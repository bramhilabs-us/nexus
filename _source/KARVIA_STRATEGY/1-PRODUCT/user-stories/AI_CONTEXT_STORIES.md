# AI Context User Stories

**Document**: AI_CONTEXT_STORIES.md
**Version**: 1.0.0
**Created**: February 16, 2026
**Related Epic**: Sprint 13 - Epic X (Unified LLM Context Service)
**Total Stories**: 8
**Status**: All Not Started (Sprint 13 Planned)

---

## Overview

These stories capture the user-facing value of the Unified LLM Context Service (Epic X). While Epic X defines the technical implementation, these stories ensure we capture the user experience requirements.

**Key Principle**: The system should "get smarter" day by day as it learns from each interaction.

---

## Story Index

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| AI-CONTEXT-001 | Context Accumulates Across Interactions | 3 | P0 |
| AI-CONTEXT-002 | Rejection Reasons Improve Suggestions | 3 | P0 |
| AI-CONTEXT-003 | Task History Informs Generation | 3 | P1 |
| AI-CONTEXT-004 | Context Delta Shows Changes | 2 | P1 |
| AI-CONTEXT-005 | SSI 12-Block Powers AI | 3 | P0 |
| AI-CONTEXT-006 | AI Reasoning Visible to User | 2 | P2 |
| AI-CONTEXT-007 | Cross-Company Learning (Consultant) | 3 | P2 |
| AI-CONTEXT-008 | Why Chain Shows SSI Connection | 2 | P1 |

---

## P0 Stories (Critical)

### AI-CONTEXT-001: Context Accumulates Across Interactions

**As a** business owner using AI features
**I want** the AI to remember what it knows about my company
**So that** suggestions improve over time without re-explaining context

**Technical Epic**: X2 (Unified buildContext)

**Acceptance Criteria**:
- [ ] When I generate OKRs, AI knows my company profile
- [ ] When I generate weekly goals, AI knows my existing OKRs
- [ ] When I generate tasks, AI knows my weekly goal context
- [ ] Each AI feature builds on previously captured context
- [ ] No need to re-enter company information for each feature

**User Value**: "The system remembers everything about my business and gets smarter over time."

**Implementation Reference**:
- `server/services/AIContextService.js` → `buildContext()`
- `AIInteractionLog` model captures context snapshots

---

### AI-CONTEXT-002: Rejection Reasons Improve Future Suggestions

**As a** user reviewing AI suggestions
**I want** my rejection reasons to influence future suggestions
**So that** the AI doesn't repeat mistakes I've already flagged

**Technical Epic**: X6 (Track Rejection Reasons)

**Acceptance Criteria**:
- [ ] When I dismiss an AI suggestion, I must select a reason:
  - `too_generic` - Not specific enough
  - `not_relevant` - Doesn't fit my business
  - `already_exists` - We already have this
  - `wrong_scope` - Wrong level (too big/small)
  - `unrealistic` - Not achievable
  - `other` - Free text input
- [ ] Rejection reasons are stored with the dismissed item
- [ ] Future AI prompts include: "Avoid suggestions like [rejected example] (reason: [reason])"
- [ ] Over time, AI generates fewer rejected items

**User Value**: "The AI learns from my feedback and stops suggesting things I don't want."

**UI Changes**:
- `client/pages/scripts/team-ssi-view.js` → Update dismiss modal
- Add reason picker dropdown before dismiss confirmation

---

### AI-CONTEXT-005: SSI 12-Block Powers All AI Features

**As a** user expecting data-driven suggestions
**I want** all AI features to use my detailed SSI scores
**So that** suggestions target my actual weak areas

**Technical Epic**: X1 (12-Block SSI in Service)

**Acceptance Criteria**:
- [ ] OKR generation uses 12-block SSI scores (not just 3 dimensions)
- [ ] AI identifies weakest blocks (e.g., "Financial Strength: 5.5/10")
- [ ] Generated objectives prioritize addressing weak blocks
- [ ] Weekly goals reference SSI context
- [ ] Task generation considers capability gaps

**User Value**: "The AI knows exactly where my organization struggles and suggests improvements for those areas."

**Example Flow**:
1. SSI shows: Financial Strength = 5.5/10 (weakest)
2. AI generates: "Strengthen Financial Foundation" objective
3. KRs target specific financial improvements
4. Weekly goals break down financial tasks

---

## P1 Stories (High)

### AI-CONTEXT-003: Task History Informs Task Generation

**As a** manager
**I want** task generation to consider my team's historical patterns
**So that** suggested tasks are realistic and achievable

**Technical Epic**: X7 (1-Year Task History)

**Acceptance Criteria**:
- [ ] AI accesses 12 months of completed task data
- [ ] Task generation considers:
  - Historical completion rate (e.g., 70%)
  - Average tasks per week (e.g., 9.3)
  - Common task patterns (e.g., "Research *", "Review *")
  - Velocity trends (increasing/decreasing)
- [ ] AI suggests realistic task count based on history
- [ ] Task names follow patterns that worked before

**User Value**: "The AI knows what our team can actually accomplish and suggests realistic tasks."

**Example**:
- History shows: 70% completion rate, avg 9 tasks/week
- AI suggests: 4 tasks for week (not 8), similar to past successful patterns

---

### AI-CONTEXT-004: Context Delta Shows What Changed

**As a** user returning after time away
**I want** the AI to know what changed since my last interaction
**So that** suggestions reflect current state, not stale context

**Technical Epic**: X3 (Context Delta Detection)

**Acceptance Criteria**:
- [ ] System tracks `last_llm_interaction` timestamp per company
- [ ] Delta detection identifies changes since last call:
  - New objectives created
  - KR progress changes (>10%)
  - Tasks completed
  - SSI scores updated (new assessment)
- [ ] AI prompts include delta: "Since last interaction: 3 tasks completed, KR progress +15%"
- [ ] UI can optionally show "What's changed" summary

**User Value**: "The AI picks up where we left off and knows what's new."

---

### AI-CONTEXT-008: Why Chain Shows SSI Connection

**As an** employee viewing my tasks
**I want** to see how my task connects back to SSI findings
**So that** I understand the strategic purpose of my work

**Related Story**: EMP-016 (Why Chain)
**Technical Epic**: X2 (context includes SSI lineage)

**Acceptance Criteria**:
- [ ] Why Chain breadcrumb shows full lineage:
  - Task → Weekly Goal → Quarterly Goal → Key Result → Objective → [SSI Insight]
- [ ] SSI tooltip shows: "This objective addresses Financial Strength gap (5.5/10)"
- [ ] Employee can see: "Your work impacts our weakest area"
- [ ] Clear connection between daily work and assessment findings

**User Value**: "I understand why this task matters - it helps us improve where we scored lowest."

---

## P2 Stories (Medium)

### AI-CONTEXT-006: AI Reasoning Visible to User

**As a** user reviewing AI suggestions
**I want** to see why the AI suggested something
**So that** I can trust and validate the suggestions

**Technical Epic**: X8, X9 (reasoning in responses)

**Acceptance Criteria**:
- [ ] AI suggestions include "reasoning" field
- [ ] UI shows collapsible "Why this suggestion?" panel
- [ ] Reasoning references:
  - SSI weak areas addressed
  - Existing objectives considered
  - Historical patterns used
  - Rejection patterns avoided
- [ ] User can verify AI logic before accepting

**User Value**: "I can see the AI's thinking and trust that it's making smart suggestions."

**Example UI**:
```
[Suggested Objective: Strengthen Financial Foundation]
[▼ Why this suggestion?]
   - Your Financial Strength score (5.5/10) is the lowest
   - No existing objectives in Financial Health category
   - Past successful objectives had similar scope
```

---

### AI-CONTEXT-007: Cross-Company Learning (Consultant View)

**As a** consultant managing multiple clients
**I want** AI to learn from patterns across my portfolio
**So that** I can apply successful approaches to similar clients

**Status**: Future (Post-MVP)

**Acceptance Criteria**:
- [ ] AI can identify: "Similar client in your portfolio achieved X with approach Y"
- [ ] Cross-company patterns anonymized (no data leakage)
- [ ] Consultant can opt in to cross-company learning
- [ ] AI suggests: "3 other tech startups addressed financial strength this way..."

**User Value**: "I can leverage what worked for other clients to help new ones."

**Privacy Note**: All cross-company insights must be anonymized and aggregated.

---

## Mapping to Epic X Stories

| AI-CONTEXT Story | Epic X Story | Relationship |
|------------------|-------------|--------------|
| AI-CONTEXT-001 | X2 | User value of unified context |
| AI-CONTEXT-002 | X6 | User flow for rejection tracking |
| AI-CONTEXT-003 | X7 | User value of task history |
| AI-CONTEXT-004 | X3 | User value of delta detection |
| AI-CONTEXT-005 | X1 | User value of 12-block SSI |
| AI-CONTEXT-006 | X8, X9 | User interface for reasoning |
| AI-CONTEXT-007 | Future | Consultant-specific learning |
| AI-CONTEXT-008 | X2, EMP-016 | SSI lineage in Why Chain |

---

## Updates to Existing Stories

The following existing stories should be enhanced to reference AI context:

### CONS-005: Generate Client OKRs
**Add to Acceptance Criteria**:
- [ ] OKR generation uses 12-block SSI scores (per AI-CONTEXT-005)
- [ ] Generated OKRs prioritize weak blocks
- [ ] Context snapshot saved to AIInteractionLog

### CONS-006: Review Generated OKRs
**Add to Acceptance Criteria**:
- [ ] Rejection requires reason selection (per AI-CONTEXT-002)
- [ ] Rejection reasons stored for future learning
- [ ] AI reasoning visible in review modal (per AI-CONTEXT-006)

### MGR-021: Create Quarterly Plans
**Add to Acceptance Criteria**:
- [ ] AI generation uses full context (per AI-CONTEXT-001)
- [ ] Task history considered (per AI-CONTEXT-003)
- [ ] Delta shown if returning user (per AI-CONTEXT-004)

### EMP-016: View "Why Chain" Context
**Add to Acceptance Criteria**:
- [ ] SSI insight tooltip at objective level (per AI-CONTEXT-008)
- [ ] Shows which SSI block this work addresses

---

## Story Point Summary

| Priority | Stories | Total Points |
|----------|---------|--------------|
| P0 | 3 | 9 pts |
| P1 | 3 | 7 pts |
| P2 | 2 | 5 pts |
| **Total** | **8** | **21 pts** |

Note: These points overlap with Epic X (42 pts). They represent the user-facing acceptance criteria that must be met, not additional development work.

---

## Related Documents

- [CROSS_PAGE_AI_CONTEXT_FLOW.md](../user-journeys/CROSS_PAGE_AI_CONTEXT_FLOW.md) - Visual journey flow
- [EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md](../../3-DELIVERY/1-SPRINTS/SPRINT-13%20(Planned)/EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md) - Technical spec
- [PERSONA_CONS_STORIES.md](./PERSONA_CONS_STORIES.md) - Consultant stories
- [USER_STORIES_MASTER.md](./USER_STORIES_MASTER.md) - Master story list

---

**Document Created**: February 16, 2026
**Author**: Claude Code
**Status**: READY FOR SPRINT 13 INTEGRATION
