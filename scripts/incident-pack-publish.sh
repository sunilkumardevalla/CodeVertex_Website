#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

usage() {
  cat <<'HELP'
Usage:
  scripts/incident-pack-publish.sh \
    --id "inc-..." --date "YYYY-MM-DD" --category "Category" --severity "Critical|High|Medium|Low" \
    --title "Title" --summary "Summary" --audiences "enterprise,smb,individual" \
    --advice-enterprise "..." --advice-smb "..." --advice-individual "..." \
    --cta-label "Label" --cta-url "url"
HELP
}

ID=""; DATE=""; CATEGORY=""; SEVERITY=""; TITLE=""; SUMMARY=""; AUDIENCES=""
ADV_E=""; ADV_S=""; ADV_I=""; CTA_LABEL=""; CTA_URL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --id) ID="${2:-}"; shift 2 ;;
    --date) DATE="${2:-}"; shift 2 ;;
    --category) CATEGORY="${2:-}"; shift 2 ;;
    --severity) SEVERITY="${2:-}"; shift 2 ;;
    --title) TITLE="${2:-}"; shift 2 ;;
    --summary) SUMMARY="${2:-}"; shift 2 ;;
    --audiences) AUDIENCES="${2:-}"; shift 2 ;;
    --advice-enterprise) ADV_E="${2:-}"; shift 2 ;;
    --advice-smb) ADV_S="${2:-}"; shift 2 ;;
    --advice-individual) ADV_I="${2:-}"; shift 2 ;;
    --cta-label) CTA_LABEL="${2:-}"; shift 2 ;;
    --cta-url) CTA_URL="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[incident-pack-publish] unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

[[ -n "$ID" && -n "$DATE" && -n "$CATEGORY" && -n "$SEVERITY" && -n "$TITLE" && -n "$SUMMARY" && -n "$AUDIENCES" && -n "$ADV_E" && -n "$ADV_S" && -n "$ADV_I" && -n "$CTA_LABEL" && -n "$CTA_URL" ]] || { usage; exit 1; }

command -v jq >/dev/null 2>&1 || { echo "[incident-pack-publish] jq required" >&2; exit 1; }

TMP="$(mktemp)"
TODAY="$(date +%F)"

jq \
  --arg id "$ID" \
  --arg date "$DATE" \
  --arg category "$CATEGORY" \
  --arg severity "$SEVERITY" \
  --arg title "$TITLE" \
  --arg summary "$SUMMARY" \
  --arg audiences "$AUDIENCES" \
  --arg adv_e "$ADV_E" \
  --arg adv_s "$ADV_S" \
  --arg adv_i "$ADV_I" \
  --arg cta_label "$CTA_LABEL" \
  --arg cta_url "$CTA_URL" \
  --arg today "$TODAY" \
  '
  .updated_at = $today
  | .items = (
      [{
        id: $id,
        date: $date,
        category: $category,
        severity: $severity,
        title: $title,
        summary: $summary,
        audiences: ($audiences | split(",") | map(gsub("^\\s+|\\s+$"; "")) | map(select(length > 0))),
        advice: {
          enterprise: $adv_e,
          smb: $adv_s,
          individual: $adv_i
        },
        cta_label: $cta_label,
        cta_url: $cta_url
      }]
      + ((.items // []) | map(select(.id != $id)))
    )
  ' assets/data/incident-watch.json > "$TMP"

mv "$TMP" assets/data/incident-watch.json

echo "[incident-pack-publish] published incident: $ID"
