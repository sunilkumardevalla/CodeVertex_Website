#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

fail() {
  echo "[security-check] $1" >&2
  exit 1
}

echo "[security-check] validating security baseline"

required_headers=(
  "Strict-Transport-Security"
  "X-Frame-Options"
  "X-Content-Type-Options"
  "Referrer-Policy"
  "Permissions-Policy"
  "Content-Security-Policy"
)

for h in "${required_headers[@]}"; do
  rg -q "$h" _headers || fail "missing header: $h"
done

# Ensure CSP keeps key restrictions.
rg -q "object-src 'none'" _headers || fail "CSP missing object-src none"
rg -q "frame-ancestors 'none'" _headers || fail "CSP missing frame-ancestors none"

# Internal pages that must remain noindex
internal=(
  content-studio.html
  crm-webhook-mapping.html
  crm-webhook-test.html
  revenue-dashboard.html
  routing-health.html
)
for p in "${internal[@]}"; do
  rg -q 'name="robots" content="noindex, nofollow"' "$p" || fail "internal page missing noindex: $p"
done

# Ensure no noindex pages leak into sitemap.
for p in "${internal[@]}"; do
  if rg -q "https://codevertex.io/$p" sitemap.xml; then
    fail "noindex page present in sitemap: $p"
  fi
done

# Ensure functions exist.
required_functions=(
  netlify/functions/track.js
  netlify/functions/crm-intake.js
  netlify/functions/marketing-intake.js
  netlify/functions/router-health.js
  netlify/functions/_lead-router.js
)
for f in "${required_functions[@]}"; do
  [[ -f "$f" ]] || fail "missing function: $f"
done

echo "[security-check] all checks passed"
