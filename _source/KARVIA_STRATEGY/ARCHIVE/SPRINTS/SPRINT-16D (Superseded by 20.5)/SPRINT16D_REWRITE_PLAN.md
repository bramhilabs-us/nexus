# Sprint 16D Rewrite Plan

## Decision

Sprint 16D should be rewritten as a **targeted documentation and navigation maintenance sprint**, not a repository-wide documentation infrastructure sprint.

The original Sprint 16D plan is not suitable for approval as written because it:

- mixes documentation work with operational changes while claiming "documentation-only"
- relies on stale baseline metrics
- treats historical sprint documentation as disposable archive material
- over-optimizes for README coverage instead of developer outcomes

## Recommendation

Approve a narrow Sprint 16D replacement with three goals:

1. Remove stale references that actively mislead humans and AI assistants.
2. Audit path dependencies before any structural cleanup.
3. Improve navigation in the highest-traffic documentation entry points only.

Reject the following from the original plan:

- mass README generation across every folder
- new documentation governance layers that duplicate `.claude`
- `.local/` archival of completed sprints outside Git
- folder merges without a verified migration map
- metrics based on file counts rather than usability outcomes

## Current-State Reality Check

The rewrite is based on current repo conditions, not the original Sprint 16D baseline:

- repository directories: `624`
- current `README.md` files: `56`
- live references to legacy planning/mockup paths across key docs and scripts: `306+`
- existing documentation governance already present in `.claude`

This means the original assumptions about scale, cleanliness, and effort are already outdated.

## Sprint Objective

Create a cleaner and safer documentation surface for the repo by fixing misleading references, validating structural assumptions before migration, and improving core entry-point navigation.

## Scope

### In Scope

- fix stale sprint references in top-level operational docs
- fix stale path references in high-traffic docs and scripts
- create a reference inventory for `Karvia_OKR_Product_Planning` and `Karvia_OKR_Mockups`
- update a small set of entry-point READMEs and indexes
- document which structural changes are safe, unsafe, or blocked

### Out of Scope

- generating README files for every directory
- moving completed sprint documents out of Git
- broad `.claude` command-system redesign
- introducing new automation or pre-commit enforcement for docs
- renaming or merging folders before dependency validation

## Workstreams

### D1. High-Risk Reference Cleanup

Clean references that currently create confusion or wrong routing:

- stale Sprint 3 references in `CLAUDE.md` and `.claude/commands/*`
- stale references to in-progress or outdated sprint states in core docs
- high-visibility path references that point to legacy planning/mockup structures

Primary target files:

- `CLAUDE.md`
- `.claude/README.md`
- `.claude/MASTER_GUIDE.md`
- `.claude/SESSION_LOG.md`
- `.claude/commands/*.md`
- top-level `README.md`

### D2. Path Dependency Audit

Before any structural merge is even discussed, produce a dependency map for:

- `Karvia_OKR_Product_Planning`
- `Karvia_OKR_Mockups`

The audit should classify every reference as:

- safe to update now
- needs coordinated migration
- should remain as historical reference
- unknown and requires manual review

This workstream is the prerequisite for any future cleanup sprint that changes folder structure.

### D3. Entry-Point Documentation Refresh

Refresh only documents that act as navigation or orientation surfaces:

- root `README.md`
- `.claude/README.md`
- sprint index pages or roadmap index pages that are actually used

The standard for inclusion is simple: if a document is not an entry point, a frequently used operating document, or clearly broken, it should not be rewritten in this sprint.

### D4. Safe Structural Recommendation

End the sprint with a written recommendation, not a structural migration.

That recommendation should answer:

- should the planning/mockup folders be merged, retained, or partially consolidated?
- what exact dependencies block the change?
- what must be updated first if a merge is approved later?

## Deliverables

- corrected top-level and `.claude` operating references
- documented inventory of legacy path dependencies
- refreshed entry-point docs for real navigation surfaces
- one short structural recommendation note for future cleanup work

## Success Criteria

Sprint 16D is successful if all of the following are true:

- no obviously stale sprint references remain in core operating docs
- the repo has a written dependency inventory for legacy planning/mockup paths
- entry-point docs route users to current locations and current sprint state
- no historical sprint material has been removed from Git
- no folder merge has been attempted without a validated migration plan

## Non-Success Criteria

The following do **not** count as success:

- reaching a target number of READMEs
- adding metadata headers for coverage purposes
- archiving files to reduce visible repo size
- creating more governance docs than the team will maintain

## Estimated Effort

This rewrite should be treated as a short maintenance sprint:

- duration: `2-4 days`
- effort: small, focused cleanup
- risk: low if limited to references and navigation docs
- risk: high if expanded back into restructuring or archive removal

## Key Assumptions To Keep Challenging

- not every folder needs a README to be understandable
- historical sprint docs are product memory, not clutter
- command docs are operational assets and must be treated carefully
- path cleanup requires dependency analysis before renaming anything
- better navigation is more valuable than broader documentation volume

## Approval Recommendation

Approve Sprint 16D only in this rewritten form.

Do not approve:

- the original 147-point master plan
- any variant that removes completed sprints from Git
- any variant that merges folders before dependency mapping is complete

## Suggested Next Step

Use this rewrite as the governing scope, then execute the sprint in this order:

1. inventory live stale references
2. fix core operating docs
3. refresh entry-point navigation docs
4. publish structural recommendation for later decision
