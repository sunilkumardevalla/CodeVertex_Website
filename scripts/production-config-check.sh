#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

fail() {
  echo "[prod-config-check] $1" >&2
  exit 1
}

warn() {
  echo "[prod-config-check][WARN] $1"
}

echo "[prod-config-check] validating production configuration baseline"

# 1) Required API scaffolding files
required=(
  netlify.toml
  netlify/functions/track.js
  netlify/functions/crm-intake.js
  netlify/functions/marketing-intake.js
  netlify/functions/router-health.js
  netlify/functions/_lead-router.js
  .env.example
)
for f in "${required[@]}"; do
  [[ -f "$f" ]] || fail "missing required file: $f"
done

# 2) Ensure anti-bot key placeholders exist on high-value forms
for page in contact.html booking.html checkout.html newsletter.html partner-program.html; do
  rg -q 'name="cv-turnstile-sitekey"' "$page" || fail "missing cv-turnstile-sitekey meta in $page"
done

# 3) Ensure internal ops pages are noindex
for page in content-studio.html crm-webhook-mapping.html crm-webhook-test.html revenue-dashboard.html routing-health.html; do
  rg -q 'name="robots" content="noindex, nofollow"' "$page" || fail "internal page missing noindex meta: $page"
done

# 4) Ensure no noindex pages are in sitemap
for page in content-studio.html crm-webhook-mapping.html crm-webhook-test.html revenue-dashboard.html routing-health.html; do
  if rg -q "https://codevertex.io/$page" sitemap.xml; then
    fail "noindex page appears in sitemap: $page"
  fi
done

# 5) Strict placeholder detection
if rg -n 'replace-with-|example.com/hooks|placeholder|replace this file with your approved' .env.example assets/docs/*.txt pgp-key.txt >/dev/null; then
  warn "placeholder values detected in templates/assets; replace before production"
fi

# 6) Security headers and CSP baseline
for h in Strict-Transport-Security X-Frame-Options X-Content-Type-Options Referrer-Policy Permissions-Policy Content-Security-Policy; do
  rg -q "$h" _headers || fail "missing header: $h"
done
rg -q "object-src 'none'" _headers || fail "CSP missing object-src none"
rg -q "frame-ancestors 'none'" _headers || fail "CSP missing frame-ancestors none"

# 7) API route wiring
for route in "/api/track" "/api/crm-intake" "/api/marketing-intake" "/api/router-health"; do
  rg -q "from = \"$route\"" netlify.toml || fail "missing netlify redirect for $route"
done

echo "[prod-config-check] checks passed (with warnings only where noted)"
