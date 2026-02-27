#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MFI_REPO="/Users/sunny/Desktop/Files/Work/Dev/MFI-Website"
MFI_OUT="$MFI_REPO/out/"
DEV_CLONE="$ROOT_DIR/dev/Mfi-Website/"

if [[ ! -d "$MFI_REPO/.git" ]]; then
  echo "MFI repo not found: $MFI_REPO"
  exit 1
fi

branch="$(git -C "$MFI_REPO" branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "Could not determine MFI repo branch."
  exit 1
fi

# Keep the main MFI repo up-to-date before applying mirrored changes.
git -C "$MFI_REPO" pull --rebase origin "$branch"

# Mirror CodeVertex clone -> MFI out export.
rsync -a --delete "$DEV_CLONE" "$MFI_OUT"

git -C "$MFI_REPO" add -A out
if git -C "$MFI_REPO" diff --cached --quiet; then
  echo "No MFI mirror changes to commit."
  exit 0
fi

msg="${1:-Sync out/ from CodeVertex mirror}"
git -C "$MFI_REPO" commit -m "$msg"
git -C "$MFI_REPO" push origin "$branch"
echo "Mirrored and pushed MFI repo on branch '$branch'."
