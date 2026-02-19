#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

ts="$(date +%Y-%m-%d)"
out="GO-LIVE-COMPLETION-REPORT-${ts}.md"

q="PASS"; p="PASS"; m="PASS"; s="PASS"; pc="PASS"
q_out=$(bash scripts/quality-check.sh 2>&1) || q="FAIL"
p_out=$(bash scripts/prelaunch-check.sh 2>&1) || p="FAIL"
m_out=$(bash scripts/monetization-check.sh 2>&1) || m="FAIL"
s_out=$(bash scripts/security-check.sh 2>&1) || s="FAIL"
pc_out=$(bash scripts/production-config-check.sh 2>&1) || pc="FAIL"

{
  echo "# Go-Live Completion Report"
  echo
  echo "Date: ${ts}"
  echo
  echo "## Automated Gates"
  echo "- quality-check: ${q}"
  echo "- prelaunch-check: ${p}"
  echo "- monetization-check: ${m}"
  echo "- security-check: ${s}"
  echo "- production-config-check: ${pc}"
  echo
  echo "## Output Logs"
  echo
  echo "### quality-check"
  echo '```text'
  echo "$q_out"
  echo '```'
  echo
  echo "### prelaunch-check"
  echo '```text'
  echo "$p_out"
  echo '```'
  echo
  echo "### monetization-check"
  echo '```text'
  echo "$m_out"
  echo '```'
  echo
  echo "### security-check"
  echo '```text'
  echo "$s_out"
  echo '```'
  echo
  echo "### production-config-check"
  echo '```text'
  echo "$pc_out"
  echo '```'
  echo
  echo "## Manual Owner Actions (Must Complete Before Production)"
  echo "- Replace placeholder legal assets in assets/docs with approved final PDFs/docs."
  echo "- Replace placeholder PGP key in pgp-key.txt with the real security team public key."
  echo "- Configure production environment variables from .env.example in hosting platform."
  echo "- Set real cv-turnstile-sitekey values in key lead forms (contact/booking/checkout/newsletter/partner)."
  echo "- Validate downstream CRM and marketing webhook destinations with real credentials."
}
> "$out"

echo "$out"
