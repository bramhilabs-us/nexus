#!/usr/bin/env bash
set -euo pipefail

# KARVIA Consulting test flow runner
# Flow:
# 1) Login / resolve company
# 2) Update company profile
# 3) Submit SSI context to OKR generator (suggestion)
# 4) Persist curated objectives via /api/objectives
# 5) Optionally reassign objective owners from slot map
# 6) Generate weekly plans (+ tasks) for first KR of each objective

BASE_URL="${BASE_URL:-https://karvia-business.onrender.com}"
EMAIL="${EMAIL:-}"
PASSWORD="${PASSWORD:-}"
TOKEN="${TOKEN:-}"
COMPANY_ID="${COMPANY_ID:-}"

START_DATE="${START_DATE:-$(date +%F)}"
TIMELINE_WEEKS="${TIMELINE_WEEKS:-4}"
TRY_APPROVE_DRAFT="${TRY_APPROVE_DRAFT:-false}"
ASSIGN_OBJECTIVE_OWNERS="${ASSIGN_OBJECTIVE_OWNERS:-false}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DATA_DIR="${BASE_DIR}/payloads"
USER_SLOT_CSV="${USER_SLOT_CSV:-${BASE_DIR}/output/karvia_user_slots.csv}"

PROFILE_PAYLOAD_FILE="${PROFILE_PAYLOAD_FILE:-${DATA_DIR}/karvia_company_profile_payload.json}"
SSI_PAYLOAD_FILE="${SSI_PAYLOAD_FILE:-${DATA_DIR}/karvia_generate_from_company_payload.json}"
OBJECTIVES_SEED_FILE="${OBJECTIVES_SEED_FILE:-${DATA_DIR}/karvia_objectives_seed.json}"

HTTP_CODE=""
HTTP_BODY=""

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

log() {
  printf "\n[%s] %s\n" "$(date '+%H:%M:%S')" "$1"
}

api_call() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local tmp
  tmp="$(mktemp)"

  if [[ -n "$body" ]]; then
    HTTP_CODE="$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "${BASE_URL}${path}" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$body")"
  else
    HTTP_CODE="$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "${BASE_URL}${path}" \
      -H "Authorization: Bearer ${TOKEN}")"
  fi
  HTTP_BODY="$(cat "$tmp")"
  rm -f "$tmp"
}

json_file_to_compact() {
  jq -c . "$1"
}

resolve_company_id_from_login() {
  local login_body="$1"
  local cid
  cid="$(echo "$login_body" | jq -r '.user.company_id // .company._id // empty')"
  if [[ -n "$cid" ]]; then
    COMPANY_ID="$cid"
  fi
}

resolve_company_id_from_api() {
  api_call GET "/api/companies"
  if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -gt 299 ]]; then
    echo "Failed to resolve company from /api/companies: ${HTTP_CODE}" >&2
    echo "$HTTP_BODY" >&2
    exit 1
  fi

  local cid
  cid="$(echo "$HTTP_BODY" | jq -r '.companies[0]._id // .data[0]._id // empty')"
  if [[ -z "$cid" ]]; then
    echo "Could not resolve COMPANY_ID from /api/companies response." >&2
    exit 1
  fi
  COMPANY_ID="$cid"
}

slot_to_user_id() {
  local slot="$1"
  if [[ ! -f "$USER_SLOT_CSV" ]]; then
    return 1
  fi
  awk -F',' -v slot="$slot" 'NR > 1 && $1 == slot { print $2; exit }' "$USER_SLOT_CSV"
}

compute_end_date() {
  local start="$1"
  local end=""
  end="$(date -j -f "%Y-%m-%d" "$start" -v+89d "+%Y-%m-%d" 2>/dev/null || true)"
  if [[ -z "$end" ]]; then
    end="$(date -d "$start +89 days" "+%Y-%m-%d" 2>/dev/null || true)"
  fi
  if [[ -z "$end" ]]; then
    echo "Could not compute END_DATE from START_DATE=$start" >&2
    exit 1
  fi
  echo "$end"
}

need_cmd curl
need_cmd jq

[[ -f "$PROFILE_PAYLOAD_FILE" ]] || { echo "Missing profile payload file: $PROFILE_PAYLOAD_FILE" >&2; exit 1; }
[[ -f "$SSI_PAYLOAD_FILE" ]] || { echo "Missing SSI payload file: $SSI_PAYLOAD_FILE" >&2; exit 1; }
[[ -f "$OBJECTIVES_SEED_FILE" ]] || { echo "Missing objectives seed file: $OBJECTIVES_SEED_FILE" >&2; exit 1; }

if [[ -z "$TOKEN" ]]; then
  [[ -n "$EMAIL" && -n "$PASSWORD" ]] || {
    echo "Provide TOKEN or EMAIL+PASSWORD." >&2
    exit 1
  }
  log "Logging in at ${BASE_URL}/api/auth/login"
  LOGIN_BODY="$(jq -n --arg email "$EMAIL" --arg password "$PASSWORD" '{email: $email, password: $password}')"
  TMP_LOGIN="$(mktemp)"
  LOGIN_CODE="$(curl -sS -o "$TMP_LOGIN" -w "%{http_code}" -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    --data "$LOGIN_BODY")"
  LOGIN_RESP="$(cat "$TMP_LOGIN")"
  rm -f "$TMP_LOGIN"

  if [[ "$LOGIN_CODE" -lt 200 || "$LOGIN_CODE" -gt 299 ]]; then
    echo "Login failed (${LOGIN_CODE}):" >&2
    echo "$LOGIN_RESP" >&2
    exit 1
  fi

  TOKEN="$(echo "$LOGIN_RESP" | jq -r '.token // empty')"
  if [[ -z "$TOKEN" ]]; then
    echo "Login succeeded but token missing." >&2
    echo "$LOGIN_RESP" >&2
    exit 1
  fi
  resolve_company_id_from_login "$LOGIN_RESP"
fi

if [[ -z "$COMPANY_ID" ]]; then
  log "Resolving company id from /api/companies"
  resolve_company_id_from_api
fi

log "Using company: ${COMPANY_ID}"

log "1/5 Updating company profile"
PROFILE_PAYLOAD="$(json_file_to_compact "$PROFILE_PAYLOAD_FILE")"
api_call PUT "/api/companies/${COMPANY_ID}" "$PROFILE_PAYLOAD"
if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -gt 299 ]]; then
  echo "Profile update failed (${HTTP_CODE}):" >&2
  echo "$HTTP_BODY" >&2
  exit 1
fi
echo "$HTTP_BODY" | jq -r '.message // "Profile updated"'

log "2/5 Generating OKR suggestion from SSI + profile context"
GEN_PAYLOAD="$(jq -c --arg cid "$COMPANY_ID" --arg sd "$START_DATE" '.company_id=$cid | .start_date=$sd' "$SSI_PAYLOAD_FILE")"
api_call POST "/api/ai-okr/generate-from-company" "$GEN_PAYLOAD"

SUGGESTION_ID=""
if [[ "$HTTP_CODE" -ge 200 && "$HTTP_CODE" -le 299 ]]; then
  SUGGESTION_ID="$(echo "$HTTP_BODY" | jq -r '.suggestion_id // empty')"
  if [[ -n "$SUGGESTION_ID" ]]; then
    echo "Created AI suggestion: ${SUGGESTION_ID}"
  else
    echo "AI generation responded but no suggestion_id; continuing with manual objective seed."
  fi
else
  echo "AI generation failed (${HTTP_CODE}); continuing with manual objective seed."
  echo "$HTTP_BODY" | jq -r '.error // .message // "Unknown error"' || true
fi

OBJECTIVE_IDS=()

if [[ "$TRY_APPROVE_DRAFT" == "true" && -n "$SUGGESTION_ID" ]]; then
  log "2b/5 Attempting draft approval (optional)"
  APPROVE_PAYLOAD="$(jq -cn --arg sid "$SUGGESTION_ID" '{suggestion_id: $sid, action: "approve"}')"
  api_call POST "/api/ai-okr/approve-draft" "$APPROVE_PAYLOAD"
  if [[ "$HTTP_CODE" -ge 200 && "$HTTP_CODE" -le 299 ]]; then
    while IFS= read -r oid; do
      [[ -n "$oid" ]] && OBJECTIVE_IDS+=("$oid")
    done < <(echo "$HTTP_BODY" | jq -r '.objective_ids[]?')
    echo "Approved draft objectives: ${#OBJECTIVE_IDS[@]}"
  else
    echo "Draft approval failed (${HTTP_CODE}); falling back to manual objective create."
  fi
fi

if [[ "${#OBJECTIVE_IDS[@]}" -eq 0 ]]; then
  log "3/5 Creating deterministic objectives from seed payload"
  END_DATE="$(compute_end_date "$START_DATE")"
  OBJ_COUNT="$(jq 'length' "$OBJECTIVES_SEED_FILE")"

  for i in $(seq 0 $((OBJ_COUNT - 1))); do
    OBJ_PAYLOAD="$(jq -c --arg sd "$START_DATE" --arg ed "$END_DATE" --argjson idx "$i" '
      .[$idx] + {
        time_period_type: "custom",
        duration_months: 3,
        target_year: ($sd[0:4] | tonumber),
        start_date: $sd,
        end_date: $ed,
        status: "active"
      }' "$OBJECTIVES_SEED_FILE")"

    api_call POST "/api/objectives" "$OBJ_PAYLOAD"
    if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -gt 299 ]]; then
      echo "Objective create failed at index ${i} (${HTTP_CODE})" >&2
      echo "$HTTP_BODY" >&2
      exit 1
    fi

    OID="$(echo "$HTTP_BODY" | jq -r '.objective._id // .objective.id // .data._id // empty')"
    if [[ -z "$OID" ]]; then
      echo "Objective created but id missing at index ${i}" >&2
      echo "$HTTP_BODY" >&2
      exit 1
    fi
    OBJECTIVE_IDS+=("$OID")
  done
fi

log "Created objectives: ${#OBJECTIVE_IDS[@]}"

if [[ "$ASSIGN_OBJECTIVE_OWNERS" == "true" ]]; then
  log "4/5 Applying objective owner assignments from slot map (if available)"
  OWNER_SLOTS=("U001" "U004" "U008" "U011")
  for idx in "${!OBJECTIVE_IDS[@]}"; do
    slot="${OWNER_SLOTS[$idx]:-}"
    oid="${OBJECTIVE_IDS[$idx]}"
    [[ -n "$slot" ]] || continue
    owner_id="$(slot_to_user_id "$slot" || true)"
    if [[ -z "$owner_id" ]]; then
      echo "No user found for slot ${slot}; skipping owner update for objective ${oid}"
      continue
    fi
    UPDATE_PAYLOAD="$(jq -cn --arg owner_id "$owner_id" '{owner_id: $owner_id}')"
    api_call PUT "/api/objectives/${oid}" "$UPDATE_PAYLOAD"
    if [[ "$HTTP_CODE" -ge 200 && "$HTTP_CODE" -le 299 ]]; then
      echo "Objective ${oid} owner -> ${slot} (${owner_id})"
    else
      echo "Owner update failed for objective ${oid} (${HTTP_CODE})"
      echo "$HTTP_BODY" | jq -r '.message // .error // "Unknown error"' || true
    fi
  done
fi

log "5/5 Generating weekly plans (first KR of each objective)"
for oid in "${OBJECTIVE_IDS[@]}"; do
  api_call GET "/api/objectives/${oid}"
  if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -gt 299 ]]; then
    echo "Failed to load objective ${oid}; skipping weekly plan."
    continue
  fi

  KR_ID="$(echo "$HTTP_BODY" | jq -r '.data.key_results[0]._id // .objective.key_results[0]._id // empty')"
  if [[ -z "$KR_ID" ]]; then
    echo "No key results found for objective ${oid}; skipping weekly plan."
    continue
  fi

  PLAN_PAYLOAD="$(jq -cn \
    --arg kr "$KR_ID" \
    --arg oid "$oid" \
    --arg sd "$START_DATE" \
    --argjson weeks "$TIMELINE_WEEKS" \
    '{key_result_id: $kr, objective_id: $oid, start_date: $sd, timeline_weeks: $weeks}')"

  api_call POST "/api/planning/generate-weekly-plan" "$PLAN_PAYLOAD"
  if [[ "$HTTP_CODE" -ge 200 && "$HTTP_CODE" -le 299 ]]; then
    goals="$(echo "$HTTP_BODY" | jq -r '.weekly_goals | length // 0')"
    tasks="$(echo "$HTTP_BODY" | jq -r '.total_tasks // 0')"
    echo "Objective ${oid}: generated ${goals} weekly goals, ${tasks} tasks"
  else
    err="$(echo "$HTTP_BODY" | jq -r '.error // .message // "Unknown error"' 2>/dev/null || echo "Unknown error")"
    echo "Objective ${oid}: weekly plan skipped (${HTTP_CODE}) - ${err}"
  fi
done

log "Done. Summary"
echo "BASE_URL=${BASE_URL}"
echo "COMPANY_ID=${COMPANY_ID}"
echo "OBJECTIVE_IDS=${OBJECTIVE_IDS[*]}"
echo "START_DATE=${START_DATE}"
echo "TIMELINE_WEEKS=${TIMELINE_WEEKS}"
