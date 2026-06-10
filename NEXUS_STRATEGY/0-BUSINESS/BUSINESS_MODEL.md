---
id: nexus.business-model
title: Business model — consulting funds the product, the product makes consulting unreplicable
tier: T0
status: active
owner: agent
updated: 2026-06-10
summary: >
  The revenue architecture: consulting engagements (playbook owns tiers),
  Builder-mode SaaS post-handover, the srishti add-on, and the methodology/
  benchmark horizon. Cost shape (agent-built, the 90-step budget) and the
  moat economics. SaaS pricing deliberately TODO until first handovers.
parents:
  - NEXUS_STRATEGY/0-BUSINESS/POSITIONING.md
children: []
revisit:
  - on: "first handover — set Builder-mode pricing from observed value"
    stage: N5
  - on: "BOQ benchmark/licensing products become concrete (post-beta)"
    stage: always
---

# Business model — consulting funds the product, the product makes consulting unreplicable

## Revenue streams, in activation order

| # | Stream | What's sold | Pricing | Status |
|---|---|---|---|---|
| 1 | **Consulting engagements** | AIR Strategic Assessment → quick wins → transformation partnership | Tiers $15k–$60k; full-funnel ≈ $130k/client (AI_CONSULTING_PLAYBOOK owns the table) | Active at launch — funds everything |
| 2 | **Builder-mode SaaS** | The handed-over OS: Nexus per-tenant subscription, post-handover | **TODO — deliberately unset** until 2–3 real handovers show observed value; anchor candidates: per-seat vs per-program; the $40–80k/yr tool-stack consolidation story (BOQ § pitch) is the ceiling argument | The moat; activates at first handover |
| 3 | **srishti add-on** | Document + model-care layer, LLM-connected | Add-on to stream 2; priced separately (srishti's own card when interfaces stabilize, TQ-3) | Seam reserved (N4) |
| 4 | **Methodology & benchmarks** | Published BOQ methodology, industry benchmark reports, eventual certification/licensing | Horizon bet — "the methodology is the IP, BOQ is the front door" (research base) | Parked post-beta; phased IP build sequences it |

**Stream-2 dependency discipline**: nothing in Night 2–5 may couple revenue to per-feature gating — flags are config (AP-3), tenancy is per-program (C-005), so any pricing shape stays implementable without rework.

## Cost shape

- **Build**: the agent loop — the 90-step budget (EXECUTION_PLAYBOOK) bounded by `_agent/AUTONOMY.md` daily caps. Engineering cost is, unusually, a *metered and journaled* line item.
- **Deliver**: consultant time (the two-week sprint, ~35 interviews) dominates engagement COGS — which is why instruments, evidence capture, scoring, and deliverable *generation* live in the product: every automated artifact raises engagement margin.
- **Run**: consolidated single app (C-003) + fresh Mongo + Render — deliberately boring, two environments (RELEASE_PROCESS), no per-engine fleet.

## The moat economics (why the loop closes)

1. Consulting revenue is **front-loaded and credible** (a business decision, not a software bet) — it funds the build without dilution pressure.
2. Each handover converts engagement trust into **recurring revenue with rising switching costs**: institutional memory (`@nexus/knowledge`), outcome history, Sustained KPIs, and eventually the client's own BOQ — none of it portable to a competitor's tool.
3. The methodology compounds: every engagement's signals sharpen AIR benchmarks, which raises diagnosis credibility, which raises tier pricing power — the consulting gets *less* replicable as the product grows, not more.

## Unit economics (template — fills from anchor engagements)

| Quantity | Definition | Value |
|---|---|---|
| Engagement margin | (engagement revenue − consultant time − tooling) / revenue | TODO (anchor phase measures it) |
| Assessment → engagement conversion | playbook target | 30–50% (target) |
| Handover → Builder retention @90d | the moat metric (4-CUSTOMER/METRICS) | ≥50% (target) |
| Builder-mode ARR per tenant | stream 2 | TODO (post first handovers) |

## Karvia adaptation note

Karvia's model was single-stream (consultant SaaS licenses) with no engagement revenue, no handover conversion, and no IP layer. Nexus inverts the sequence — services first, SaaS as the *retained* relationship — and adds the methodology horizon. The deliberate TODOs (stream-2 pricing, unit economics) are evidence-gated per the re-sum rule: no labelled totals before the data exists.
