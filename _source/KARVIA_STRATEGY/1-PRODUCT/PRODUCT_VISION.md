# Karvia Product Vision - Evolution History

<!-- @GENOME T1-PRD-001 | HISTORICAL | 2026-04-05 | parent:ROOT | auto:- | linked:/strategy -->

**Status**: HISTORICAL (Evolution Document)
**Last Substantive Update**: November 2025
**Current Vision**: See [1-VISION/](../1-VISION/) for active documents

---

## Document Purpose

This document captures the **evolution** of Karvia's product vision from inception to current state. It is preserved for historical context and decision traceability.

**For current vision, see:**
- **YSELA Product**: [YSELA/vision/YSELA_VISION.md](../../YSELA/vision/YSELA_VISION.md)
- **KARVIA Engine**: [1-VISION/KARVIA_ENGINE_VISION.md](../1-VISION/KARVIA_ENGINE_VISION.md)
- **Ecosystem**: [ECOSYSTEM_ARCHITECTURE.md](../../ECOSYSTEM_ARCHITECTURE.md)

---

## Evolution Timeline

### Phase 1: OKR Platform (2025)

**Original Vision**:
> "Karvia is a B2B OKR management platform that helps SMBs (50-500 employees) align teams, track objectives, and build high-performance cultures."

**Focus Areas**:
- Goal tracking and progress measurement
- AI-assisted OKR generation
- Assessment framework (SSI)
- Multi-tenant architecture
- Role-based access control

**Key Achievements**:
- Core OKR hierarchy (Objective → Key Result → Goal → Task)
- SSI assessment with 12-block MECE scoring
- AI context service for intelligent generation
- 1,491+ tests with 98% pass rate

---

### Phase 2: Engine + Product Separation (Early 2026)

**Realization**:
The platform needed to separate **infrastructure** (reusable engine) from **experience** (user-facing product).

**Result**:
- **KARVIA** = The OKR engine (invisible infrastructure)
- **YSELA** = The product brand (user-facing behavior system)
- **iBrain** = The intelligence layer (future)

---

### Phase 3: Behavior Operating System (April 2026)

**Current Vision**:
> "YSELA uses the current execution stack to guide handoffs, ownership, and next moves."

**Key Shift**:
- From "OKR tracking" to "behavior transformation"
- From "task management" to "handoff guidance"
- From "goal setting" to "ownership development"

**What Changed**:
- Narrative and positioning (how we talk about it)
- Documentation and training materials
- Consultant methodology

**What Stayed the Same**:
- All code, APIs, and database schemas
- UI labels ("Tasks" remains "Tasks")
- The 4-step model: Assess → Team → Objectives → Tasks

---

## Key Decisions Documented

| Date | Decision | Rationale |
|------|----------|-----------|
| Nov 2025 | Separate KARVIA/YSELA | Reusable engine vs. product brand |
| Mar 2026 | Consultant-led beta model | Trust-based distribution |
| Apr 2026 | Zero-change reframe | Narrative shift without code changes |
| Apr 2026 | "Tasks" label preserved | Stability over cosmetic changes |

---

## Archived Content

The original 325-line PRODUCT_VISION.md (Nov 2025) contained:
- Market analysis and TAM/SAM/SOM
- Competitive positioning
- Pricing tiers (Free/Pro/Enterprise)
- 5-phase roadmap (2025-2026)
- Success metrics and KPIs

This content is preserved in git history. For current strategy, see:
- [BETA_ROADMAP_2026.md](./roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md)
- [PRODUCT_STRATEGY_MASTER.md](./strategy/PRODUCT_STRATEGY_MASTER.md)

---

## Related Documents

| Document | Purpose | Location |
|----------|---------|----------|
| YSELA Vision | Current product vision | [YSELA/vision/](../../YSELA/vision/) |
| KARVIA Engine | Engine architecture | [1-VISION/](../1-VISION/) |
| Beta Roadmap | Launch plan | [BETA_RELEASE_PROJECT/](./roadmap/BETA_RELEASE_PROJECT/) |
| Philosophy | Core beliefs | [YSELA/philosophy/](../../YSELA/philosophy/) |

---

**Document Type**: Historical / Evolution Record
**Owner**: Product Team
**Created**: November 2025
**Transitioned**: April 2026
