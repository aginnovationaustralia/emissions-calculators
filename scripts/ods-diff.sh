#!/bin/bash
# Git textconv for ODS files - extracts content.xml for readable diffs.
# Used via: git config diff.ods.textconv "bash scripts/ods-diff.sh"
#
# Run scripts/setup-ods-diff.sh once to configure this for the repo.
set -e
file="${1:?}"
[ -f "$file" ] || { echo "(file not found)"; exit 0; }
content=$(unzip -p -q "$file" content.xml 2>/dev/null || true)
[ -n "$content" ] || { echo "(could not extract content.xml)"; exit 0; }
if command -v xmllint >/dev/null 2>&1; then
  echo "$content" | xmllint --format - 2>/dev/null || echo "$content"
else
  echo "$content"
fi
