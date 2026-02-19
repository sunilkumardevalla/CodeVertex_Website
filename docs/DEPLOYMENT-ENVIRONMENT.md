# Deployment Environment

## Required environment variables
- `CV_WEBHOOK_SIGNING_SECRET`: verify incoming signed requests.
- `CV_DOWNSTREAM_SIGNING_SECRET`: optional signature for outgoing webhooks.
- `CV_ALLOWED_ORIGINS`: comma-separated origin allowlist for API calls.

## CRM provider configuration
Recommended:
- `CV_CRM_PROVIDER=hubspot`
- `CV_HUBSPOT_PRIVATE_APP_TOKEN`
- `CV_HUBSPOT_API_BASE` (default: `https://api.hubapi.com`)
- `CV_HUBSPOT_TIMEOUT_MS`
- `CV_HUBSPOT_LIFECYCLE_STAGE`
- `CV_HUBSPOT_DEFAULT_LEAD_STATUS`
- `CV_HUBSPOT_HIGH_PRIORITY_LEAD_STATUS`
- `CV_HUBSPOT_NURTURE_LEAD_STATUS`

Optional webhook/fallback routing:
- `CV_CRM_ENTERPRISE_WEBHOOK`, `CV_CRM_PRIMARY_WEBHOOK`, `CV_CRM_SECONDARY_WEBHOOK`

## Marketing routing configuration
- `CV_MARKETING_URGENT_WEBHOOK`, `CV_MARKETING_PRIMARY_WEBHOOK`, `CV_MARKETING_SECONDARY_WEBHOOK`

## Resilience controls
- `CV_DEAD_LETTER_WEBHOOK`: dead-letter fallback target.
- `CV_ROUTER_MAX_ATTEMPTS`, `CV_ROUTER_BASE_DELAY_MS`: retry controls.
- `CV_FAIL_ON_ROUTING_ERROR`: strict fail mode toggle.

## API routes (Netlify)
- `/api/track` -> `netlify/functions/track.js`
- `/api/crm-intake` -> `netlify/functions/crm-intake.js`
- `/api/marketing-intake` -> `netlify/functions/marketing-intake.js`
- `/api/router-health` -> `netlify/functions/router-health.js`

## Production controls
- Enable HTTPS only.
- Apply `_headers` with strict security policies.
- Restrict deploy permissions to owners/admins.
- Require branch protections on `main` and `staging`.

## Post-deploy checklist
1. Submit sample lead from contact, booking, and checkout flows.
2. Confirm contact record appears in HubSpot.
3. Submit newsletter and partner flows.
4. Verify events arriving from `/api/track`.
5. Confirm status page timestamp and legal docs accessibility.

## Routing and CRM references
- `docs/LEAD-ROUTING-ARCHITECTURE.md`
- `docs/HUBSPOT-SETUP.md`

## Security automation
- Run `bash scripts/security-check.sh` before production deploy.
- CI workflow: `.github/workflows/security-baseline.yml`
