#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

fail() {
  echo "[quality-check] $1" >&2
  exit 1
}

echo "[quality-check] running structural checks"

# 1) no external embedded video/iframe references
if rg -n "youtube|www.youtube|iframe src=" *.html styles.css script.js >/dev/null; then
  fail "found forbidden external video/embed reference"
fi

# 2) all data-i18n keys in HTML exist in script.js
missing=0
while IFS= read -r key; do
  if ! rg -q '"'"$key"'"\s*:' script.js; then
    echo "[quality-check] missing i18n key: $key" >&2
    missing=1
  fi
done < <(rg -o 'data-i18n="[^"]+"' *.html | sed -E 's/.*data-i18n="([^"]+)".*/\1/' | sort -u)
[[ "$missing" -eq 0 ]] || fail "missing i18n keys"

# 3) simple local link/src existence check
bad=0
while IFS= read -r ref; do
  ref="${ref%%\#*}"
  ref="${ref%%\?*}"
  [[ -z "$ref" ]] && continue
  [[ "$ref" =~ ^(https?:|mailto:|tel:|data:|javascript:|#) ]] && continue
  ref="${ref#/}"
  [[ "$ref" == "/" ]] && continue
  [[ -e "$ref" ]] || { echo "[quality-check] missing local asset/link: $ref" >&2; bad=1; }
done < <(rg -o -I '(href|src)="[^"]+"' *.html | sed -E 's/^(href|src)="([^"]+)"$/\2/' | sort -u)
[[ "$bad" -eq 0 ]] || fail "broken local refs"

# 4) div balance sanity
while IFS= read -r file; do
  opens=$(rg -o '<div\b' "$file" | wc -l | tr -d ' ')
  closes=$(rg -o '</div>' "$file" | wc -l | tr -d ' ')
  [[ "$opens" == "$closes" ]] || fail "div mismatch in $file ($opens/$closes)"
done < <(ls *.html)

echo "[quality-check] all checks passed"
