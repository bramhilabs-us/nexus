#!/usr/bin/env bash
set -euo pipefail

# Export real users into deterministic slot IDs (U001..)
# so the role assignment matrix can be mapped to actual user IDs.

BASE_URL="${BASE_URL:-https://karvia-business.onrender.com}"
TOKEN="${TOKEN:-}"
COMPANY_ID="${COMPANY_ID:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUT_FILE="${OUT_FILE:-${BASE_DIR}/output/karvia_user_slots.csv}"

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

need_cmd curl
need_cmd jq
need_cmd awk

[[ -n "$TOKEN" ]] || { echo "TOKEN is required" >&2; exit 1; }
[[ -n "$COMPANY_ID" ]] || { echo "COMPANY_ID is required" >&2; exit 1; }

mkdir -p "$(dirname "$OUT_FILE")"

RESP_FILE="$(mktemp)"
CODE="$(curl -sS -o "$RESP_FILE" -w "%{http_code}" \
  -X GET "${BASE_URL}/api/companies/${COMPANY_ID}/users" \
  -H "Authorization: Bearer ${TOKEN}")"
BODY="$(cat "$RESP_FILE")"
rm -f "$RESP_FILE"

if [[ "$CODE" -lt 200 || "$CODE" -gt 299 ]]; then
  echo "Failed to fetch users (${CODE})" >&2
  echo "$BODY" >&2
  exit 1
fi

echo "$BODY" | jq -r '
  def rank:
    if . == "BUSINESS_OWNER" then 1
    elif . == "EXECUTIVE" then 2
    elif . == "MANAGER" then 3
    elif . == "EMPLOYEE" then 4
    elif . == "CONSULTANT" then 5
    else 9 end;

  (.data // .users // [])
  | sort_by((.role | rank), (.first_name // ""), (.last_name // ""), .email)
  | .[]
  | [
      ._id,
      ((.first_name // "") + " " + (.last_name // "") | gsub("^\\s+|\\s+$"; "")),
      (.email // ""),
      (.role // ""),
      (.title // "")
    ]
  | @tsv
' | awk -F'\t' '
  BEGIN {
    OFS=",";
    print "slot_id,user_id,name,email,role,title";
  }
  {
    printf "U%03d,%s,%s,%s,%s,%s\n", NR, $1, $2, $3, $4, $5;
  }
' > "$OUT_FILE"

echo "Wrote slot map to ${OUT_FILE}"
echo "Sample:"
head -n 12 "$OUT_FILE"
