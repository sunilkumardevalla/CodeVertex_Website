#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${CV_BASE_URL:-https://codevertex-website.netlify.app}"
HUBSPOT_TOKEN="${CV_HUBSPOT_PRIVATE_APP_TOKEN:-${HUBSPOT_PRIVATE_APP_TOKEN:-}}"
REQUIRE_HUBSPOT_VERIFY="${CV_REQUIRE_HUBSPOT_VERIFY:-true}"
TEST_EMAIL="${CV_TEST_EMAIL:-crm-health-$(date +%s)@codevertex.io}"
REPORT_DIR="${CV_REPORT_DIR:-reports}"

mkdir -p "$REPORT_DIR"
REPORT_PATH="$REPORT_DIR/crm-health-$(date +%Y%m%d-%H%M%S).md"

fail() {
  echo "[crm-health-check] $1" >&2
  exit 1
}

json_get() {
  local field="$1"
  jq -r "$field" 2>/dev/null || true
}

echo "[crm-health-check] running against: $BASE_URL"
echo "[crm-health-check] test email: $TEST_EMAIL"

payload=$(cat <<JSON
{
  "name": "Monthly CRM Health",
  "email": "$TEST_EMAIL",
  "company": "CodeVertex Automated QA",
  "role": "Security Operations",
  "scope": "cloud",
  "package_interest": "core",
  "timeline": "30days",
  "budget": "project-25-60",
  "region": "North America",
  "message": "Automated monthly CRM health verification",
  "lead_source": "monthly-health-check"
}
JSON
)

api_response=$(curl -sS -X POST "$BASE_URL/api/crm-intake" \
  -H 'content-type: application/json' \
  --data "$payload") || fail "crm-intake request failed"

ok=$(printf '%s' "$api_response" | json_get '.ok')
routed=$(printf '%s' "$api_response" | json_get '.routed')
lead_id=$(printf '%s' "$api_response" | json_get '.lead_id')
routing_id=$(printf '%s' "$api_response" | json_get '.routing_id')

[[ "$ok" == "true" ]] || fail "crm-intake returned non-ok response: $api_response"
[[ "$routed" == "true" ]] || fail "crm-intake returned routed=false: $api_response"

hubspot_status="skipped"
hubspot_contact_id=""
hubspot_error=""

if [[ -n "$HUBSPOT_TOKEN" ]]; then
  search_payload=$(cat <<JSON
{
  "filterGroups": [
    {
      "filters": [
        {
          "propertyName": "email",
          "operator": "EQ",
          "value": "$TEST_EMAIL"
        }
      ]
    }
  ],
  "properties": ["email", "firstname", "lastname", "company", "hs_lead_status", "lifecyclestage"],
  "limit": 1
}
JSON
)

  hubspot_response=$(curl -sS -X POST "https://api.hubapi.com/crm/v3/objects/contacts/search" \
    -H "Authorization: Bearer $HUBSPOT_TOKEN" \
    -H 'Content-Type: application/json' \
    --data "$search_payload") || fail "hubspot search request failed"

  hubspot_total=$(printf '%s' "$hubspot_response" | json_get '.total')
  if [[ "$hubspot_total" =~ ^[0-9]+$ ]] && [[ "$hubspot_total" -ge 1 ]]; then
    hubspot_status="verified"
    hubspot_contact_id=$(printf '%s' "$hubspot_response" | json_get '.results[0].id')
  else
    hubspot_status="failed"
    hubspot_error="$hubspot_response"
  fi
else
  if [[ "$REQUIRE_HUBSPOT_VERIFY" == "true" ]]; then
    fail "HUBSPOT_PRIVATE_APP_TOKEN is required but missing"
  fi
fi

if [[ "$hubspot_status" == "failed" ]]; then
  fail "HubSpot verification failed: $hubspot_error"
fi

hubspot_status_upper=$(printf '%s' "$hubspot_status" | tr '[:lower:]' '[:upper:]')

cat > "$REPORT_PATH" <<MD
# Monthly CRM Health Report

Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Base URL: $BASE_URL

## CRM Intake API
- Status: PASS
- Test Email: $TEST_EMAIL
- Lead ID: $lead_id
- Routing ID: $routing_id

## HubSpot Verification
- Status: $hubspot_status_upper
- Contact ID: ${hubspot_contact_id:-N/A}

## Raw API Response
\`\`\`json
$api_response
\`\`\`
MD

echo "[crm-health-check] PASS"
echo "[crm-health-check] report: $REPORT_PATH"
