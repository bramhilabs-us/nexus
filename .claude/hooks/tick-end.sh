#!/usr/bin/env bash
# Stop hook: fire-and-forget notification at end of every tick.
# Reads stop event from stdin (JSON); does not block.

set -euo pipefail
LOG="/Users/sagarrs/Desktop/official_dev/nexus/_agent/.tick-events.log"
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] tick ended" >> "$LOG"
exit 0
