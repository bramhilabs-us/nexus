#!/usr/bin/env python3
"""
In-place secret redaction for _source/ files.
Scans for common credential patterns and replaces the secret portion with [REDACTED].
Preserves variable names so docs stay readable.
"""
import re
import sys
from pathlib import Path

PATTERNS = [
    # OpenAI API keys (covers sk-, sk-svcacct-, sk-proj-, sk-ant-)
    (re.compile(r'\bsk-[a-zA-Z][a-zA-Z0-9_-]{20,}'), 'sk-[REDACTED]'),
    # Anthropic keys
    (re.compile(r'\bsk-ant-[a-zA-Z0-9_-]+'), 'sk-ant-[REDACTED]'),
    # Generic OPENAI_API_KEY assignment
    (re.compile(r'(OPENAI_API_KEY\s*=\s*)\S+'), r'\1[REDACTED]'),
    # MongoDB connection strings (catches any remaining)
    (re.compile(r'mongodb\+srv://[^:/\s]+:[^@/\s]+@'), 'mongodb+srv://[REDACTED]:[REDACTED]@'),
    # Mailjet
    (re.compile(r'(MAILJET_API_KEY\s*=\s*)[a-f0-9]{20,}'), r'\1[REDACTED]'),
    (re.compile(r'(MAILJET_API_SECRET\s*=\s*)[a-f0-9]{20,}'), r'\1[REDACTED]'),
    # JWT / Session secrets — anything long after the equals
    (re.compile(r'(JWT_SECRET\s*=\s*)[A-Za-z0-9+/=]{20,}'), r'\1[REDACTED]'),
    (re.compile(r'(SESSION_SECRET\s*=\s*)[A-Za-z0-9+/=]{20,}'), r'\1[REDACTED]'),
    (re.compile(r'(COOKIE_SECRET\s*=\s*)[A-Za-z0-9+/=]{20,}'), r'\1[REDACTED]'),
    (re.compile(r'(ENCRYPTION_KEY\s*=\s*)[A-Za-z0-9+/=]{20,}'), r'\1[REDACTED]'),
    # GitHub tokens
    (re.compile(r'\bghp_[a-zA-Z0-9]{20,}'), 'ghp_[REDACTED]'),
    (re.compile(r'\bgho_[a-zA-Z0-9]{20,}'), 'gho_[REDACTED]'),
    (re.compile(r'\bghs_[a-zA-Z0-9]{20,}'), 'ghs_[REDACTED]'),
    (re.compile(r'\bghu_[a-zA-Z0-9]{20,}'), 'ghu_[REDACTED]'),
    # AWS
    (re.compile(r'\bAKIA[A-Z0-9]{16}\b'), 'AKIA[REDACTED]'),
    (re.compile(r'(AWS_SECRET_ACCESS_KEY\s*=\s*)[A-Za-z0-9/+=]{30,}'), r'\1[REDACTED]'),
    # Stripe
    (re.compile(r'\bsk_live_[a-zA-Z0-9]+'), 'sk_live_[REDACTED]'),
    (re.compile(r'\brk_live_[a-zA-Z0-9]+'), 'rk_live_[REDACTED]'),
    # Slack
    (re.compile(r'\bxox[bpsra]-[a-zA-Z0-9-]{20,}'), 'xoxX-[REDACTED]'),
    # Generic API_KEY/SECRET assignments with long values
    (re.compile(r'(API_SECRET\s*=\s*)[A-Za-z0-9+/=]{30,}'), r'\1[REDACTED]'),
]

EXTENSIONS = {'.md', '.txt', '.yml', '.yaml', '.json', '.sh', '.js', '.ts', '.html', '.env', '.conf', '.example'}

def redact_file(path: Path) -> int:
    try:
        original = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return 0
    new = original
    for pat, repl in PATTERNS:
        new = pat.sub(repl, new)
    if new != original:
        path.write_text(new, encoding='utf-8')
        return sum(1 for line_o, line_n in zip(original.split('\n'), new.split('\n')) if line_o != line_n)
    return 0

def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('_source')
    if not root.exists():
        print(f'No such path: {root}', file=sys.stderr)
        sys.exit(1)
    total_files = 0
    total_lines = 0
    for path in root.rglob('*'):
        if path.is_file() and (path.suffix.lower() in EXTENSIONS or path.suffix == ''):
            n = redact_file(path)
            if n:
                total_files += 1
                total_lines += n
                print(f'  redacted {n} line(s) in {path}')
    print(f'\nTotal: {total_files} files, {total_lines} lines redacted')

if __name__ == '__main__':
    main()
