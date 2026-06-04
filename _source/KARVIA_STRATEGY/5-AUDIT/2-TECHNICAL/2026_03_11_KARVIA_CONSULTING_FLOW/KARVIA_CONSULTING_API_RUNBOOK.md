# KARVIA Consulting API Runbook

This runbook executes the test flow:

1. Update Company Profile
2. Submit SSI context to OKR generation
3. Persist deterministic objectives
4. (Optional) reassign objective owners by slot map
5. Generate weekly plans and daily tasks

## Files

- Profile payload: `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/payloads/karvia_company_profile_payload.json`
- SSI generation payload: `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/payloads/karvia_generate_from_company_payload.json`
- Objective seed payload: `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/payloads/karvia_objectives_seed.json`
- Role matrix: `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/KARVIA_CONSULTING_ROLE_ASSIGNMENT_MATRIX.csv`
- Flow script: `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/scripts/seed_karvia_consulting_flow.sh`
- User slot exporter: `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/scripts/export_karvia_user_slots.sh`

## 1) Export real users to slot IDs (optional, for owner assignment)

```bash
BASE_URL="https://karvia-business.onrender.com" \
TOKEN="<jwt_token>" \
COMPANY_ID="<company_id>" \
bash KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/scripts/export_karvia_user_slots.sh
```

Output:

- `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/output/karvia_user_slots.csv` with `U001..U0NN` mapped to real `user_id`.

## 2) Run full seed flow

Using login credentials:

```bash
BASE_URL="https://karvia-business.onrender.com" \
EMAIL="<login_email>" \
PASSWORD="<login_password>" \
START_DATE="2026-04-01" \
TIMELINE_WEEKS="4" \
bash KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/scripts/seed_karvia_consulting_flow.sh
```

Using existing token:

```bash
BASE_URL="https://karvia-business.onrender.com" \
TOKEN="<jwt_token>" \
COMPANY_ID="<company_id>" \
START_DATE="2026-04-01" \
TIMELINE_WEEKS="4" \
bash KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/scripts/seed_karvia_consulting_flow.sh
```

## Optional flags

- `ASSIGN_OBJECTIVE_OWNERS=true`
  - Requires `.../2026_03_11_KARVIA_CONSULTING_FLOW/output/karvia_user_slots.csv` from exporter script.
  - Applies owner slots: `U001` (O1), `U004` (O2), `U008` (O3), `U011` (O4).
- `TRY_APPROVE_DRAFT=true`
  - Attempts `/api/ai-okr/approve-draft` before deterministic objective creation.
  - If draft approval fails, script falls back to `/api/objectives` seed path.

## Notes

- Weekly plan generation endpoint already creates weekly goals and tasks.
- The script uses first KR of each seeded objective for weekly plan creation.
- If weekly plan already exists for a KR, API may return `409`; script logs and continues.
