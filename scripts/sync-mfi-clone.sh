#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MAIN_DIR="/Users/sunny/Desktop/Files/Work/Dev/MFI-Website/out/"
DEV_DIR="$ROOT_DIR/dev/Mfi-Website/"

usage() {
  cat <<'EOF'
Usage:
  scripts/sync-mfi-clone.sh main-to-dev
  scripts/sync-mfi-clone.sh dev-to-main

Examples:
  scripts/sync-mfi-clone.sh main-to-dev
  scripts/sync-mfi-clone.sh dev-to-main
EOF
}

if [[ $# -ne 1 ]]; then
  usage
  exit 1
fi

mkdir -p "$ROOT_DIR/dev/Mfi-Website"
if [[ ! -d "$MAIN_DIR" ]]; then
  echo "Main path not found: $MAIN_DIR"
  exit 1
fi

case "$1" in
  main-to-dev|mfi-to-dev)
    rsync -a --delete "$MAIN_DIR" "$DEV_DIR"
    echo "Synced: MFI-Website/out -> dev/Mfi-Website"
    ;;
  dev-to-main|dev-to-mfi)
    rsync -a --delete "$DEV_DIR" "$MAIN_DIR"
    echo "Synced: dev/Mfi-Website -> MFI-Website/out"
    ;;
  *)
    usage
    exit 1
    ;;
esac
