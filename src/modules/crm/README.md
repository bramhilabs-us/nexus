---
id: nexus.module.crm
title: "@nexus/crm"
tier: T2
status: draft
owner: agent
updated: 2026-06-09
summary: >
  Tenants, companies, programs, people, roles, and the client pipeline (Prospect -> Assessing -> Engaged -> Handed over). Owns the Program entity (C-005) and program_memberships.
parents:
  - src/README.md
children: []
revisit:
  - on: "contract.ts for this module changes shape"
    stage: N2
---

# @nexus/crm

Tenants, companies, programs, people, roles, and the client pipeline (Prospect -> Assessing -> Engaged -> Handed over). Owns the Program entity (C-005) and program_memberships.

Anatomy and rules: [src/README.md](../../README.md) -> [TECH_STRATEGY.md](../../../NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md). Contract-first: `contract.ts` + failing contract test land before any implementation (hard rule 7).
