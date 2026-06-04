# Delivery Backlog

<!-- @GENOME T2-PRD-017 | ACTIVE | 2026-03-30 | parent:T2-PRD-011 | auto:/coding | linked:- -->

## P0: Must Ship Before Beta Dry Run

### Product and documentation

- Update top-level beta-facing product docs so YSELA is no longer described primarily as an OKR/task platform.
- Align consultant onboarding narrative to the beta operating model.
- Keep all internal beta materials using one sentence:
  `YSELA uses the current execution stack to guide handoffs, ownership, and next moves.`

### Prompt system

- Finish moving beta-critical prompt behavior to `server/prompts/*`.
- Make `guidance` mandatory on beta-critical AI outputs.
- Update task-generation prompts to produce `next moves` semantically, while keeping `tasks[]` structurally.
- Add Legacy Succession and consultant-led context guidance.

### Frontend

- Rename planning-page user-facing copy from `Tasks` to `Next Moves` where practical.
- Rename `Generate Tasks` actions to `Suggest Next Moves` where practical.
- Update objective display to show human meaning in description.

## P1: Strongly Recommended Before Pilot

### Consultant operations

- Extend consultant reporting for blocked/deferred task visibility.
- Add or reuse a weekly evidence capture mechanism.
- Define the consultant weekly review template and operating rhythm.

### Backend

- Reduce benchmark duplication to one usable contract for beta-facing AI/narrative outputs.

## P2: Only If Pilot Preparation Shows A Real Need

### Optional schema additions

- objective beta metadata
- team mentor/organizer metadata

These should only be implemented if reporting or workflow is clearly blocked without them.

## Sequencing

1. P0 docs
2. P0 prompts
3. P0 frontend copy
4. P1 consultant reporting
5. P1 evidence capture
6. internal dry run
7. pilot launch

