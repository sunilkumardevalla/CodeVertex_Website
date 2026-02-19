#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${CV_DOMAIN:-codevertex.io}"

fail() {
  echo "[domain-dns-check] $1" >&2
  exit 1
}

warn() {
  echo "[domain-dns-check][WARN] $1"
}

echo "[domain-dns-check] checking docs and DNS baseline for $DOMAIN"

[[ -f docs/enterprise/DOMAIN-DNS-IMPLEMENTATION-RUNBOOK.md ]] || fail "missing domain runbook"
[[ -f docs/enterprise/templates/DNS-CHANGE-LOG.md ]] || fail "missing DNS change log template"

if command -v dig >/dev/null 2>&1; then
  caa=$(dig +short CAA "$DOMAIN" | wc -l | tr -d ' ')
  dmarc=$(dig +short TXT "_dmarc.$DOMAIN" | wc -l | tr -d ' ')
  spf=$(dig +short TXT "$DOMAIN" | rg -i 'v=spf1' -n || true)

  [[ "$caa" -gt 0 ]] || warn "no CAA record detected for $DOMAIN"
  [[ "$dmarc" -gt 0 ]] || warn "no DMARC TXT record detected for _dmarc.$DOMAIN"
  [[ -n "$spf" ]] || warn "no SPF policy detected in TXT records for $DOMAIN"
else
  warn "dig not installed; DNS live checks skipped"
fi

echo "[domain-dns-check] pass"
