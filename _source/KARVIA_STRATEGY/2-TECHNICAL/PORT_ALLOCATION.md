# Port Allocation Strategy

<!-- @GENOME T2-ARC-018 | ACTIVE | 2026-04-06 | parent:T1-ARC-001 | auto:/coding | linked:/strategy -->

**Version**: 1.0
**Created**: April 6, 2026
**Purpose**: Document port allocation to prevent conflicts between KARVIA microservices and future iBrain engines

---

## Current Port Allocation

### KARVIA Engine (Active)

| Service | Port | Status | Description |
|---------|------|--------|-------------|
| Main API Server | 5000 | ACTIVE | Express API (production entry point) |
| IAM Engine | 8081 | ACTIVE | Identity and access management |
| Assessment Engine | 8082 | ACTIVE | SSI scoring and assessments |
| Planner Engine | 8083 | ACTIVE | OKR planning assistance |
| Scoring Engine | 8084 | ACTIVE | Goal/task scoring |
| Observer Engine | 8085 | STANDBY | Pattern observation |
| Tracking Engine | 8086 | STANDBY | Event tracking |
| Insights Engine | 8087 | STANDBY | Analytics |
| Collaboration Engine | 8088 | STANDBY | Team collaboration |

### Reserved Ports

| Range | Owner | Purpose |
|-------|-------|---------|
| 5000 | KARVIA | Production API |
| 8080-8089 | KARVIA | Engine microservices |
| 9080-9089 | iBrain | Future ML engines |
| 3000-3009 | Development | Local dev servers |

---

## iBrain Future Allocation

When iBrain integrates (post-Beta), it will use ports **9080-9089** to avoid conflicts:

| Service | Port | Description |
|---------|------|-------------|
| iBrain Scoring | 9080 | Behavioral scoring algorithms |
| iBrain Tracking | 9081 | Event and pattern tracking |
| iBrain Observer | 9082 | Behavioral pattern detection |
| iBrain Assessment | 9083 | Advanced assessments |
| iBrain Planner | 9084 | AI planning assistance |
| iBrain Nudge | 9085 | Behavioral nudge engine |

---

## Port Conflict Prevention

### Issue Identified

The original ECOSYSTEM_ARCHITECTURE.md listed iBrain engines using ports 8080-8085, which would conflict with KARVIA's microservices.

### Resolution

| Layer | Port Range | Rationale |
|-------|------------|-----------|
| KARVIA | 8080-8089 | Currently allocated, in production |
| iBrain | 9080-9089 | New allocation, avoids conflicts |

### Migration Strategy

If iBrain engines are deployed:
1. Use 9080-9089 range
2. Update iBRAIN_Integration docs
3. Configure service discovery to route correctly
4. No changes needed to KARVIA ports

---

## Development Environment

| Environment | API Port | Engine Port Range |
|-------------|----------|-------------------|
| Local Dev | 5000 | 8081-8089 |
| Docker Compose | 5000 | 8081-8089 (internal) |
| Staging (Render) | 5000 | N/A (monolith mode) |
| Production (Render) | 5000 | N/A (monolith mode) |

---

## Port Usage Guidelines

### Adding New KARVIA Services

1. Use next available port in 8080-8089 range
2. Update this document
3. Update docker-compose.yml
4. Document in KARVIA_1.0_CAPABILITIES.md

### Adding iBrain Services

1. Use next available port in 9080-9089 range
2. Update iBRAIN_Integration docs
3. Update this document

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ECOSYSTEM_ARCHITECTURE.md](../../ECOSYSTEM_ARCHITECTURE.md) | Three-layer overview |
| [KARVIA_1.0_CAPABILITIES.md](../1-PRODUCT/KARVIA_1.0_CAPABILITIES.md) | Engine baseline |
| [iBRAIN_Integration/](../../iBRAIN_Integration/) | Future integration specs |

---

**Document Owner**: CTO
**Last Updated**: April 6, 2026
