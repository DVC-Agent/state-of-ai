#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
python3 audit/build_visual_revision.py
python3 audit/build_visual_deck.py
target="${PREVIEW_DIR:-${root}-preview}"
target="$(node -e 'console.log(require("node:path").resolve(process.argv[1]))' "$target")"
case "$target/" in
  "$root/"*) printf 'PREVIEW_DIR must be outside the source checkout.\\n' >&2; exit 1 ;;
esac
mkdir -p "$target"
rsync -a --delete --delete-excluded \
  --exclude='.git' --exclude='audit' --exclude='*.md' \
  --exclude='.gitignore' --exclude='serve.json' \
  --exclude='.venv' --exclude='node_modules' --exclude='__pycache__' \
  --exclude='.pytest_cache' --exclude='requirements-dev.txt' \
  --exclude='qa' --exclude='qa-full' --exclude='qa-visual' --exclude='*.py' \
  --exclude='hc_microcopy_tests.js' --exclude='.firebaserc' \
  --exclude='firebase.json' --exclude='*.bak' \
  "$root/" "$target/"
printf 'Local preview files: %s\n' "$target"
