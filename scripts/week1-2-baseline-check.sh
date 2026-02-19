#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

bash scripts/domain-dns-baseline-check.sh
bash scripts/observability-baseline-check.sh

[[ -f docs/enterprise/HUBSPOT-SLA-WORKBOOK.md ]] || {
  echo "[week1-2-check] missing HubSpot SLA workbook" >&2
  exit 1
}

echo "[week1-2-check] pass"
