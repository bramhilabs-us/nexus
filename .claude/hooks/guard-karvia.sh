#!/usr/bin/env bash
# Pre-tool-use hook: hard-block any Write or Edit targeting karvia_business/
# Reads tool input from stdin (JSON), exits 2 to block with feedback to the model.

set -euo pipefail

INPUT="$(cat)"
KARVIA_PATH="/Users/sagarrs/Desktop/official_dev/karvia_business"

# Extract file_path from common shapes (Write/Edit tools)
FILE_PATH="$(echo "$INPUT" | /usr/bin/python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    ti = data.get('tool_input', {})
    print(ti.get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")"

if [[ -n "$FILE_PATH" && "$FILE_PATH" == "$KARVIA_PATH"* ]]; then
  echo "BLOCKED: write attempt against karvia_business/ at $FILE_PATH. karvia is READ-ONLY for Nexus work." >&2
  exit 2
fi

exit 0
