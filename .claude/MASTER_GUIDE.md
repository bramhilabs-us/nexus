# Nexus Master Guide — File Placement & Authority

**Status**: MANDATORY
**Last Updated**: 2026-06-03

---

## Where files go

```
nexus/
├── .claude/                      ← Agent configuration (this folder)
│   ├── CLAUDE.md                 ← What Nexus is, hard rules
│   ├── MASTER_GUIDE.md           ← THIS FILE
│   ├── BEST_PRACTICES.md         ← Quality bar (code/docs/commits/PRs)
│   ├── SESSION_PRACTICES.md      ← Session shape, Karvia-derived lessons
│   ├── TICK_PROTOCOL.md          ← How one loop iteration works
│   ├── DOC_STANDARDS.md          ← Markdown conventions + genome pointer
│   ├── commands/                 ← Slash commands (5 only: init, close, nexus-tick, sprint-load, audit)
│   ├── templates/                ← Doc templates
│   └── hooks/                    ← Hook scripts (budget, write-guard, doc-graph-check.py)
│
├── _agent/                       ← Persistent loop state (markdown only)
│   ├── JOURNAL.md                ← Append-only session log (THE step counter)
│   ├── NEXT_SESSION.md           ← The chain: card for the next session, rewritten every close
│   ├── BACKLOG.md                ← Groomed work queue
│   ├── DECISIONS.md              ← Architectural choices, dated
│   ├── clarifications.md         ← Questions for the human
│   ├── SPRINTS_NIGHT_N.md        ← Sprint definitions (human-authored)
│   └── AUTONOMY.md               ← Current autonomy level, budget status
│
├── _source/                      ← Frozen Karvia doc snapshot (reference only)
│
├── NEXUS_STRATEGY/               ← All strategy/product docs (every doc carries a genome)
│   ├── 00_NORTH_STAR.md          ← Root of the document graph
│   ├── DOCUMENTATION_GRAPH.md    ← Genome spec, registry, propagation rules
│   ├── 0-BUSINESS/
│   ├── 1-PRODUCT/
│   │   └── design/               ← DESIGN_LANGUAGE.md + brand/ (BRAMHI assets)
│   ├── 2-TECHNICAL/
│   │   └── diagrams/             ← Mermaid sources for all visualizations
│   ├── 3-DELIVERY/
│   │   └── QA/                   ← Test coverage maps, audits
│   └── 4-CUSTOMER/
│
├── src/                          ← Server workspace: modules/<8 blocks>/ (code Night 2+)
├── client/                       ← UI shell (Night 3+)
└── tests/                        ← Cross-module + journey tests
```

---

## File placement rules

| Type of content | Goes in |
|---|---|
| Anything explaining how the agent operates | `.claude/` |
| Anything the agent reads/writes between ticks | `_agent/` |
| Anything copied or extracted from Karvia for reference | `_source/` |
| Anything describing Nexus's product, business, or tech | `NEXUS_STRATEGY/` |
| Code (Night 2+) | `server/`, `client/`, `engines/`, `tests/` |

**Never:**
- Put state files (JOURNAL, BACKLOG) inside `.claude/` — they live in `_agent/`
- Put strategy docs in `.claude/` — they live in `NEXUS_STRATEGY/`
- Commit `_agent/clarifications.md` answers as decisions — promote them to `DECISIONS.md` first
- Write into `_source/` — it's frozen

---

## Improvements over Karvia's structure

| Karvia had | Nexus does instead | Why |
|---|---|---|
| `SESSION_LOG.md`, `SESSION_BREAK_NOTES.md`, `HOTFIX_DASHBOARD_NOTES.md` in `.claude/` | `_agent/JOURNAL.md` only | One append-only log beats scattered session files |
| `@GENOME T2-CMD-001` cryptic comment tags | YAML genome frontmatter + `doc-graph-check.py` (C-007) | Karvia's tags were unreadable and unenforced; Nexus's genome is human-readable AND machine-validated (no orphans, bidirectional edges, staleness warnings) |
| 16 slash commands (one per session type) | 5 commands; session type is data in `NEXT_SESSION.md` | The command set stays stable; the session chain carries the variation |
| 18+ files in `.claude/` root | 5 files + 3 subfolders | Easier to load context |
| State and config mixed | Config in `.claude/`, state in `_agent/` | Clean separation, easier to audit |
| Commands assume human user | Commands assume autonomous loop | TICK_PROTOCOL.md is the entry point |
| No autonomy/budget config | `AUTONOMY.md` + budget hooks | Required for unattended overnight runs |
| No write-guard | PreToolUse hook blocks writes to `karvia_business/` | Hard guarantee of zero impact on source |
