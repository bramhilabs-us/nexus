---
id: nexus.client
title: client — the Nexus UI shell
tier: T2
status: draft
owner: agent
updated: 2026-06-09
summary: >
  Vanilla JS client for v1 (C-004). Renders the six pages from server-served
  PageContract configs; one small component set (tile, card, stage ribbon, CTA
  pair, empty state) styled by the BRAMHI design language. Assessment-specific
  surfaces render into typed slots owned by the installed assessment block.
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
  - NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md
children: []
revisit:
  - on: "page contracts or the component set change"
    stage: N3
---

# client — the Nexus UI shell

Six pages, two modes (Engagement/Builder), one component set. Page behavior is governed by [PRODUCT_STRATEGY.md](../NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md); visual rules by [DESIGN_LANGUAGE.md](../NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md). UI build starts Night 3.
