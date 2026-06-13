---
id: nexus.external-design-audit-2026-06-13
title: External Design Audit — premium mockup refinement
tier: T1
status: completed
owner: external-design-auditor
updated: 2026-06-13
summary: >
  Independent visual audit and implementation record for the Nexus mockups.
  The pass preserves the C-013 product brand while replacing equal-weight SaaS
  card grids with a hierarchy of orientation, decision, and evidence. It adds
  restrained operating-loop signatures, accessible derived interaction tones,
  responsive behavior, and page-specific focal compositions.
parents:
  - NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md
children:
  - NEXUS_STRATEGY/1-PRODUCT/design/mockups/README.md
revisit:
  - on: "the mockups can be rendered in the product browser or the production component build starts"
    stage: N3
---

# External Design Audit — premium mockup refinement

**Audit date:** June 13, 2026  
**Auditor stance:** independent visual and product-design review  
**Scope:** `NEXUS_STRATEGY/1-PRODUCT/design/` only  
**Implementation boundary:** no file outside the design folder was changed

## Executive assessment

The original mockups had a strong strategic base: disciplined product/parent
brand separation, a calm palette, a consistent dark shell, role-aware content,
and credible information architecture. The principal visual weakness was not
poor styling. It was insufficient editing.

Tiles, cards, panels, recommendations, and empty states frequently used the same
white surface, 8px radius, shadow, and padding. This made the product feel clean
but generic. Important decisions and supporting evidence carried almost equal
visual weight. The operating loop, Nexus's most ownable idea, was present in the
brand guide but weakly expressed in the application UI.

The refinement target was therefore:

> Quiet intelligence with moments of transformation.

The revised mockups use approximately 90% calm, functional restraint and 10%
distinctive brand expression. Premium quality comes from hierarchy and
confidence, not from adding decorative effects.

## Design principles applied

### 1. Three visual levels

Every page now distinguishes:

- **Orientation:** one dominant pulse, recommendation, result, or task.
- **Decision:** the action the current user should take next.
- **Evidence:** metrics, entity cards, rows, and supporting detail.

This replaces the earlier pattern where four analytics tiles and several cards
all competed at similar visual weight.

### 2. One focal composition per viewport

Executive and workflow pages now lead with one memorable composition:

- Dashboard: program pulse.
- My Clients: portfolio AIR pulse.
- Objectives: Next Best Move.
- Assessments: sprint pulse and guided journey.
- Teams: participation pulse.
- Planning: next best task.
- Profile: fit interpretation.
- Flashcards: the question itself.

### 3. The operating loop as a signature

Measure, Align, Transform, and Evolve now appear as a restrained loop rail. The
rail shows context and current stage; it is not a decorative rainbow. Gradients
remain limited to active loop state, selected brand moments, and progress.

### 4. Human warmth without visual noise

Human presence was added through initials, team clusters, fit interpretation,
and clearer consequence-oriented copy. No stock photography, illustrations, or
decorative avatars were introduced.

### 5. Stronger interaction contrast

The declared brand swatches remain unchanged. Mockup-local colors are derived
with `color-mix()`:

- Filled actions use a darker Intelligence Blue/Deep Text mix.
- Success and attention text use deeper signal mixes.
- Tertiary copy is slightly strengthened.

This approach preserves the brand guide while improving practical UI contrast.
The production token file was intentionally not edited because this audit was
restricted to the design folder.

## Shared system changes

File: `mockups/shell.css`

### Added local audit tokens

- Strong primary interaction color.
- Strong positive and warm text colors.
- Strengthened tertiary copy.
- Audit-specific line, radius, raised shadow, spotlight shadow, and motion
  timings.

All additions are derived from governed `--nx-*` tokens. No hardcoded hex value
was introduced in the mockups.

### Refined shell

- Added a subtle tonal gradient to the sidebar.
- Increased logo presence and separation.
- Added active-nav depth without turning the sidebar into a glowing surface.
- Added controlled hover movement and focus-visible treatment.
- Increased page width and breathing room.
- Increased title scale and tightened Sora tracking.
- Added an eyebrow/kicker pattern for contextual orientation.

### Added surface hierarchy

- Quiet panels use a hairline and no elevation.
- Interactive cards use restrained elevation.
- Spotlight moments use stronger composition and depth.
- Empty states now use quiet dashed teaching surfaces rather than another
  elevated card.

### Added reusable compositions

- `nx-pulse`: dominant status or orientation composition.
- `nx-loop-rail`: operating-loop stage context.
- `nx-decision-list`: ranked action hierarchy.
- `nx-focus`: expanded Next Best Move recommendation.
- `nx-dossier-head`: client/team identity.
- `nx-journey`: active assessment timeline.
- `nx-result-spotlight`: assessment result handoff.
- `nx-task-focus`: worker's next best task.
- `nx-context-strip`: quiet supporting metrics.
- `nx-fit-summary`: transparent profile interpretation.
- `nx-signal-grid`: grouped profile signals.

### Added motion and responsive behavior

- Interaction durations use 120ms, 180ms, and 240ms tiers.
- Motion is limited to feedback, selection, and depth.
- `prefers-reduced-motion` is respected.
- Breakpoints were added for large tablet, compact tablet, and mobile.
- The sidebar becomes a compact horizontal navigation surface on smaller
  viewports.
- Grids, decision rows, task metadata, flashcards, and context strips collapse
  deliberately rather than relying on accidental wrapping.

## Page-by-page change record

### Dashboard

Before:

- Four equal analytics cards.
- Three equal "Needs you today" cards.
- Objective cards carried similar visual importance.

After:

- One dark Program Pulse shows overall orientation.
- Three quiet metrics support the pulse.
- A loop rail makes the Transform stage visible.
- Today's actions are ranked by downstream impact.
- The highest-leverage decision receives the only dominant action.
- Objectives are explicitly presented as evidence behind the pulse.

### Dashboard — Builder mode

- Mirrors the same refined grammar as Engagement mode.
- Makes continuity after handover visible without inventing a separate product
  shell.
- The highest-leverage product-delivery move is ranked first.
- Sustained KPI evidence remains subordinate to today's decision.

### My Clients

Before:

- Generic analytics strip.
- Client cards resembled compact tables.

After:

- Portfolio AIR becomes the dominant portfolio signal.
- Client pipeline is ordered by next meaningful move.
- Each client reads as a dossier: score or organization mark, sponsor, stage,
  primary signal, evidence, and next action.
- Prospect state no longer displays a meaningless empty score ring.

### Objectives

Before:

- Three header actions competed for attention.
- Lifecycle counts appeared before the recommendation.
- Recommendation and objective cards were visually similar.

After:

- One primary header action remains; secondary operations move behind a quiet
  overflow action.
- Lifecycle data is a compact context strip.
- Next Best Move is the page's focal composition.
- The recommendation states what, why, and confidence.
- Objective cards are framed as supporting evidence.

### Assessments

Before:

- Assessment work was represented as four table-like rows.
- Current work and completed results shared panel treatment.

After:

- The sprint has one dominant halfway pulse.
- Measure is visibly active in the operating loop.
- Assessment work is a vertical journey with completed, active, and upcoming
  states.
- Today's evidence task is unmistakable.
- Completed AIR results receive a separate result-handoff composition.
- "Create objectives" is visually connected to the scored result.

### Planning

Before:

- Progress analytics appeared before the worker's actual work.

After:

- The Next Best Task is the first content block.
- The task states impact, time, due date, and dependency.
- Milestone metrics move to a quiet context strip.
- The existing calm task rows remain intact below.

### Teams

Before:

- Team cards were primarily counts and tags.

After:

- Participation is the dominant alignment signal.
- People clusters add human presence without requiring photography.
- Team identity is more scannable.
- The unowned Customer Service objective becomes an explicit alignment gap.

### Profile

Before:

- Four vertically stacked tag panels created a tag-wall effect.

After:

- A transparent "How Nexus sees your fit" interpretation leads the page.
- The interpretation explains why signals matter without hiding provenance.
- Signals are grouped in a two-column responsive layout.
- Assessment-fed tags remain marked.

### Assessment flashcards

- Replaced the text wordmark with the approved primary lockup.
- Added a calm ambient blue/green stage.
- Increased question typography and card breathing room.
- Added a subtle loop-gradient top edge to the card.
- Strengthened answer selection and hover feedback.
- Used Cormorant Garamond only for the human explanation and completion
  signature.
- Added the closing line: "Measure honestly. Transform deliberately."

## What was deliberately not added

- Glassmorphism.
- Bright glowing borders.
- Large decorative gradients on ordinary cards.
- Excessive rounded containers.
- Stock imagery.
- Generic AI sparkle icons.
- Red alert theatrics.
- Multiple dominant calls to action.
- Parent-brand typography in product chrome.

These treatments would make the interface more fashionable but less credible,
less durable, and less aligned with "we sell certainty."

## Accessibility and implementation notes

- Focus-visible states were added for links and buttons.
- Reduced-motion preferences are respected.
- Signal text no longer relies on the light raw success/accent swatches.
- Color remains supportive; stage and state retain visible text labels.
- The design now includes responsive rules, but real product implementation
  must still validate touch targets, keyboard order, and screen-reader names.
- The mockups still contain historical inline layout declarations. They are
  token-based and do not introduce color drift, but production components
  should replace them with named component variants.

## Validation status

Completed:

- All edits are confined to `NEXUS_STRATEGY/1-PRODUCT/design/`.
- No inline hex colors were introduced in `mockups/`.
- Responsive and reduced-motion rules now exist.
- All nine mockup surfaces were updated.
- Shared components continue to consume the governed Nexus token vocabulary.

Pending visual QA:

- Full-page browser screenshots at 1440px, 1024px, 768px, and 390px.
- Font-loading comparison with and without Google Fonts available.
- Final contrast measurement against rendered `color-mix()` output.
- Keyboard walkthrough of interactive mockup controls.

The current environment blocked local-file and localhost rendering in the
in-app browser. The implementation was therefore reviewed structurally through
the complete HTML/CSS and brand assets. The next design checkpoint should begin
with rendered screenshots before these patterns are promoted into production
components.

## Auditor recommendation

Approve this direction as the high-fidelity visual grammar for Night 3, subject
to rendered screenshot QA. Build the shared shell, pulse, decision list, focus
recommendation, journey, and task-focus components before implementing
individual pages. That ordering protects the hierarchy and prevents the product
from drifting back into equal-weight card grids.
