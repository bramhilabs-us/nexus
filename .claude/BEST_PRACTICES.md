# Nexus Best Practices

---

## Code

- **Tests first** when adding behavior. Write the failing test, then the code.
- **Module boundaries are sacred.** A change inside `@nexus/objectives` must not require changes inside `@nexus/crm`. If it does, the contract is wrong — fix the contract.
- **No cross-module imports of internals.** Modules talk via their published API only.
- **No new dependencies without a note in `DECISIONS.md`.** Justify why an existing lib won't do.
- **Errors at boundaries.** Throw at the edge of a module, not deep inside.

## Docs

- **One topic per file.** If a doc covers two concepts, split it.
- **Diagrams in Mermaid.** Sources committed in `2-TECHNICAL/diagrams/`. No external image links.
- **Date every decision.** `DECISIONS.md` entries open with the date.
- **Link, don't duplicate.** If the same fact appears twice, one is wrong soon. Pick the source of truth, link from the other.

## Commits

- **Imperative mood**: "Add AI readiness scoring rubric" not "Added" or "Adding".
- **One concern per commit.** Mass renames are their own commit.
- **Co-author tag**: every agent commit ends with `Co-Authored-By: bramhi-bot <bot@bramhilabs.us>`.
- **No co-author tag for security-sensitive changes** (env handling, auth). Those need human review.

## PRs

- **Title under 70 chars.**
- **Body has: what changed, why, how to test, risk notes.**
- **Link the BACKLOG item ID.**
- **Draft if blocked.** A red PR with a clear "blocked because X" is more useful than a deleted branch.

## Anti-patterns to avoid

| Anti-pattern | Do instead |
|---|---|
| Adding "TODO: revisit later" comments | Open a BACKLOG item instead |
| Catching errors silently | Log + rethrow or fail loud |
| Mocking the database in integration tests | Hit a real Mongo instance (test DB) |
| Long-living branches across ticks | One tick = one branch = one PR |
| "Just one more refactor" scope creep | Stop. Open a new BACKLOG item. |
