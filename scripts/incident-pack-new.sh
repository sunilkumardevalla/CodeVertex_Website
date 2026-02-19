#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

usage() {
  cat <<'HELP'
Usage:
  scripts/incident-pack-new.sh --title "Title" --category "Category" --severity "Critical|High|Medium|Low" --summary "One-line summary" --week "YYYY-Www"
HELP
}

slugify() {
  local input="$1"
  echo "$input" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g'
}

TITLE=""
CATEGORY=""
SEVERITY=""
SUMMARY=""
WEEK=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title) TITLE="${2:-}"; shift 2 ;;
    --category) CATEGORY="${2:-}"; shift 2 ;;
    --severity) SEVERITY="${2:-}"; shift 2 ;;
    --summary) SUMMARY="${2:-}"; shift 2 ;;
    --week) WEEK="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[incident-pack-new] unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

[[ -n "$TITLE" && -n "$CATEGORY" && -n "$SEVERITY" && -n "$SUMMARY" && -n "$WEEK" ]] || { usage; exit 1; }

SLUG="$(slugify "$TITLE")"
OUT="workspace/incident-packs/${WEEK}-${SLUG}.md"
[[ -e "$OUT" ]] && { echo "[incident-pack-new] file exists: $OUT" >&2; exit 1; }

cat > "$OUT" <<PACK
# ${TITLE}

- Week label: ${WEEK}
- Owner:
- Publish date: $(date +%F)
- Primary audience: enterprise

## 1) Incident Snapshot
- Category: ${CATEGORY}
- Severity: ${SEVERITY}
- Headline: ${TITLE}
- One-line summary: ${SUMMARY}

## 2) Why It Matters
- Business impact:
- Operational impact:
- Likely attack path:

## 3) Audience Guidance
- Enterprise advice:
- SMB advice:
- Individual advice:

## 4) Content Assets
- Video clip used:
- Infographic used:
- Related long-form blog URL:

## 5) CTA
- CTA label:
- CTA URL:
PACK

echo "[incident-pack-new] created: $OUT"
