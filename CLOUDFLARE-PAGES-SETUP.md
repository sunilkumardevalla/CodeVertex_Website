# Cloudflare Pages Migration (CodeVertex_Website)

This project is now Cloudflare Pages compatible with native Pages Functions under `functions/api/*`.

## What changed
- Added Cloudflare Pages Functions:
  - `functions/api/track.js`
  - `functions/api/crm-intake.js`
  - `functions/api/marketing-intake.js`
  - `functions/api/router-health.js`
- Added shared runtime utilities:
  - `functions/_shared/common.js`
  - `functions/_shared/lead-router.js`
- Removed Netlify-only `/api/*` rewrite from `_redirects`.
- Updated `script.js` form webhook fallback defaults:
  - CRM fallback: `/api/crm-intake`
  - Marketing fallback: `/api/marketing-intake`
- Added `wrangler.toml` for Cloudflare Pages config.

## Cloudflare Pages project setup
1. In Cloudflare Dashboard, go to `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
2. Select repo: `sunilkumardevalla/CodeVertex_Website`.
3. Branch: `main`.
4. Build settings:
   - Build command: leave empty
   - Build output directory: `.`
   - Root directory: (empty)
5. Deploy.

## Required environment variables (Pages -> Settings -> Environment variables)
Set all variables currently used in `.env.example`:
- `CV_WEBHOOK_SIGNING_SECRET`
- `CV_DOWNSTREAM_SIGNING_SECRET`
- `CV_CRM_PROVIDER`
- `CV_HUBSPOT_PRIVATE_APP_TOKEN`
- `CV_HUBSPOT_API_BASE`
- `CV_HUBSPOT_TIMEOUT_MS`
- `CV_HUBSPOT_LIFECYCLE_STAGE`
- `CV_HUBSPOT_DEFAULT_LEAD_STATUS`
- `CV_HUBSPOT_HIGH_PRIORITY_LEAD_STATUS`
- `CV_HUBSPOT_NURTURE_LEAD_STATUS`
- `CV_CRM_ENTERPRISE_WEBHOOK`
- `CV_CRM_PRIMARY_WEBHOOK`
- `CV_CRM_SECONDARY_WEBHOOK`
- `CV_MARKETING_URGENT_WEBHOOK`
- `CV_MARKETING_PRIMARY_WEBHOOK`
- `CV_MARKETING_SECONDARY_WEBHOOK`
- `CV_DEAD_LETTER_WEBHOOK`
- `CV_ROUTER_MAX_ATTEMPTS`
- `CV_ROUTER_BASE_DELAY_MS`
- `CV_FAIL_ON_ROUTING_ERROR`
- `CV_ALLOWED_ORIGINS`

## Domain cutover
1. In Cloudflare Pages project, add custom domains:
   - `codevertex.io`
   - `www.codevertex.io`
2. If DNS is already on Cloudflare: confirm CNAME/flattening targets set by Pages wizard.
3. If DNS is still elsewhere (e.g., GoDaddy): update nameservers to Cloudflare first, then add records.
4. Keep only one platform active for production DNS to avoid split routing.

## Post-cutover checks
1. Open site homepage and key pages.
2. Test APIs:
   - `GET /api/router-health`
   - submit contact form (`/api/crm-intake`)
   - submit newsletter/preference form (`/api/marketing-intake`)
3. Confirm no CORS errors in browser devtools.
4. Confirm HubSpot or webhook destination receives leads.

## Important note
Netlify build/deploy can be disabled after Cloudflare is fully live to avoid duplicate deployments and confusion.
