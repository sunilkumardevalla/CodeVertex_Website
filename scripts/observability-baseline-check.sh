#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

fail() {
  echo "[observability-check] $1" >&2
  exit 1
}

echo "[observability-check] validating observability baseline"

required=(
  docs/enterprise/OBSERVABILITY-ALERTING.md
  docs/enterprise/OBSERVABILITY-IMPLEMENTATION-RUNBOOK.md
)

for f in "${required[@]}"; do
  [[ -f "$f" ]] || fail "missing file: $f"
done

for endpoint in "/api/track" "/api/crm-intake" "/api/marketing-intake" "/api/router-health"; do
  rg -q "from = \"$endpoint\"" netlify.toml || fail "missing endpoint mapping in netlify.toml: $endpoint"
done

rg -q "cv-track-endpoint" index.html || fail "index missing cv-track-endpoint meta"

echo "[observability-check] pass"
