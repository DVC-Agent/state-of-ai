#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
python3 audit/build_visual_revision.py
python3 audit/build_visual_deck.py
target="/home/user/workspace/state-of-ai-preview"
mkdir -p "$target"
rsync -a --delete --delete-excluded \
  --exclude='.git' --exclude='audit' --exclude='*.md' \
  --exclude='.gitignore' --exclude='serve.json' \
  --exclude='qa' --exclude='qa-full' --exclude='qa-visual' --exclude='*.py' \
  --exclude='hc_microcopy_tests.js' --exclude='.firebaserc' \
  --exclude='firebase.json' --exclude='*.bak' \
  "$root/" "$target/"
