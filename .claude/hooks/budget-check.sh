#!/usr/bin/env bash
# Pre-tool-use hook: stop the session if today's spend exceeds NEXUS_DAILY_BUDGET_USD.
# Placeholder: real spend tracking requires the runtime to expose cost; for now this
# just checks a manually-maintained tally file and exits 2 if over budget.

set -euo pipefail

BUDGET="${NEXUS_DAILY_BUDGET_USD:-60}"
TALLY_FILE="/Users/sagarrs/Desktop/official_dev/nexus/_agent/.budget-$(date +%Y-%m-%d).tally"

if [[ -f "$TALLY_FILE" ]]; then
  SPENT="$(cat "$TALLY_FILE" 2>/dev/null || echo 0)"
  if (( $(echo "$SPENT >= $BUDGET" | bc -l 2>/dev/null || echo 0) )); then
    echo "BLOCKED: daily budget exhausted (\$$SPENT >= \$$BUDGET). Resume tomorrow or raise budget." >&2
    exit 2
  fi
fi

exit 0
