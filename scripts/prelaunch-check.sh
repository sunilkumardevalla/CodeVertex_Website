#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[prelaunch] running prelaunch audit"
warn=0

warn_msg() {
  echo "[prelaunch][WARN] $1"
  warn=1
}

# 1) Empty webhook/tracking endpoints
if rg -n 'name="cv-crm-webhook" content=""' contact.html >/dev/null; then
  warn_msg "CRM webhook is empty in contact.html"
fi
if rg -n 'name="cv-track-endpoint" content=""' *.html >/dev/null; then
  warn_msg "Tracking endpoint is empty in one or more HTML files"
fi

# 2) Placeholder PGP key
if rg -n 'placeholder|replace with production|BEGIN PGP PUBLIC KEY BLOCK' pgp-key.txt >/dev/null; then
  warn_msg "pgp-key.txt appears to contain placeholder content"
fi

# 3) Placeholder docs
if rg -n 'Placeholder|replace this file with your approved' assets/docs/*.txt >/dev/null; then
  warn_msg "One or more docs in assets/docs are still placeholders"
fi

# 4) Status feed freshness (best effort)
updated=$(rg -o '"updated_at"\s*:\s*"[^"]+"' status-feed.json | sed -E 's/.*"([0-9T:\-]+Z)"/\1/' || true)
if [[ -z "${updated:-}" ]]; then
  warn_msg "status-feed.json updated_at is missing"
else
  echo "[prelaunch] status-feed updated_at: $updated"
fi

if [[ "$warn" -eq 0 ]]; then
  echo "[prelaunch] no warnings"
else
  echo "[prelaunch] warnings found - resolve before production launch"
fi
