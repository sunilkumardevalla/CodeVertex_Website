#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

fail() {
  echo "[monetization-check] $1" >&2
  exit 1
}

echo "[monetization-check] validating monetization assets"

required_pages=(
  booking.html
  newsletter.html
  checkout.html
  partner-program.html
  revenue-dashboard.html
  enterprise-finance-security.html
  unsubscribe.html
  content-studio.html
)

for page in "${required_pages[@]}"; do
  [[ -f "$page" ]] || fail "missing page: $page"
done

required_data=(
  assets/data/insights-library.json
  assets/data/revenue-dashboard.json
)

required_api=(
  netlify/functions/_common.js
  netlify/functions/_lead-router.js
  netlify/functions/crm-intake.js
  netlify/functions/marketing-intake.js
  netlify/functions/track.js
  netlify.toml
)
for f in "${required_data[@]}"; do
  [[ -f "$f" ]] || fail "missing data file: $f"
done
for f in "${required_api[@]}"; do
  [[ -f "$f" ]] || fail "missing api file: $f"
done

rg -q "data-webhook-target=\"crm\"" booking.html || fail "booking crm target missing"
rg -q "data-webhook-target=\"crm\"" checkout.html || fail "checkout crm target missing"
rg -q "data-webhook-target=\"marketing\"" newsletter.html || fail "newsletter marketing target missing"
rg -q "data-webhook-target=\"marketing\"" partner-program.html || fail "partner marketing target missing"
rg -q "data-webhook-target=\"marketing\"" unsubscribe.html || fail "preferences marketing target missing"

rg -q "data-revenue-kpis" revenue-dashboard.html || fail "revenue dashboard hook missing"
rg -q "cv-chat-widget" script.js || fail "chat widget integration missing"
rg -q "monetization-check.sh" -S README.md >/dev/null || true

echo "[monetization-check] all checks passed"
