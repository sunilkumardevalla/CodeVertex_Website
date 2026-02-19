#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

fail() {
  echo "[enterprise-readiness] $1" >&2
  exit 1
}

echo "[enterprise-readiness] checking enterprise operations baseline"

required_docs=(
  docs/enterprise/90-DAY-ENTERPRISE-ROADMAP.md
  docs/enterprise/DOMAIN-DNS-HARDENING.md
  docs/enterprise/OBSERVABILITY-ALERTING.md
  docs/enterprise/ANALYTICS-ATTRIBUTION.md
  docs/enterprise/HUBSPOT-REVOPS-AUTOMATIONS.md
  docs/enterprise/EMAIL-DELIVERABILITY.md
  docs/enterprise/COMPLIANCE-CMP-PLAN.md
  docs/enterprise/CRO-EXPERIMENT-BACKLOG.md
  docs/enterprise/SECURITY-OPERATIONS-CADENCE.md
  docs/enterprise/BCP-DR-PLAYBOOK.md
  docs/enterprise/EXECUTIVE-LAUNCH-BOARD.md
)

for f in "${required_docs[@]}"; do
  [[ -f "$f" ]] || fail "missing doc: $f"
done

required_workflows=(
  .github/workflows/monthly-crm-health-check.yml
  .github/workflows/security-baseline.yml
  .github/workflows/site-quality.yml
)

for f in "${required_workflows[@]}"; do
  [[ -f "$f" ]] || fail "missing workflow: $f"
done

echo "[enterprise-readiness] pass"
