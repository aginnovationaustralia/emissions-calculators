#!/bin/bash
# One-time setup: configures Git to show readable diffs for ODS files.
# Run from repo root: bash scripts/setup-ods-diff.sh
set -e
cd "$(git rev-parse --show-toplevel)"
script_dir="$(dirname "$0")"
# Use path relative to repo root so it works after clone in any location
git config diff.ods.textconv "bash $PWD/scripts/ods-diff.sh"
echo "Configured diff.ods.textconv. ODS files will now show readable diffs."
