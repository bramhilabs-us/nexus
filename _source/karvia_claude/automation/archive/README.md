# Archived Automation Scripts

**Archived**: April 1, 2026
**Reason**: Replaced by `/init` and `/close` slash commands

## Files

| File | Original Purpose | Replaced By |
|------|------------------|-------------|
| start-session.js | Session initialization | `/init` command |
| end-session.js | Session closure | `/close` command |

## Why Archived

The original scripts:
- Required Node.js execution
- Referenced outdated file paths (e.g., `handoffs/SESSION_MANAGEMENT/`)
- Had complex logic that's now handled by simpler markdown-based commands

The new slash commands:
- Are simpler and more maintainable
- Integrate with Claude Code's native command system
- Reference current file structure
- Follow the documentation governance system

## Note

If you need to reference the original logic for any reason, the scripts are preserved here. However, they should not be used directly as they reference paths that no longer exist.
