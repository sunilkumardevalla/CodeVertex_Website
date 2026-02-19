# Deployment Environment

## Required environment variables
- `CV_WEBHOOK_SIGNING_SECRET`: verify incoming signed requests.
- `CV_DOWNSTREAM_SIGNING_SECRET`: optional signature for outgoing webhooks.
- `CV_CRM_ENTERPRISE_WEBHOOK`, `CV_CRM_PRIMARY_WEBHOOK`, `CV_CRM_SECONDARY_WEBHOOK`: CRM routing targets.
- `CV_MARKETING_URGENT_WEBHOOK`, `CV_MARKETING_PRIMARY_WEBHOOK`, `CV_MARKETING_SECONDARY_WEBHOOK`: marketing routing targets.
- `CV_DEAD_LETTER_WEBHOOK`: dead-letter fallback target.
- `CV_ROUTER_MAX_ATTEMPTS`, `CV_ROUTER_BASE_DELAY_MS`: retry controls.
- `CV_FAIL_ON_ROUTING_ERROR`: strict fail mode toggle.
- `CV_ALLOWED_ORIGINS`: comma-separated origin allowlist for API calls.

## API routes (Netlify)
- `/api/track` -> `netlify/functions/track.js`
- `/api/crm-intake` -> `netlify/functions/crm-intake.js`
- `/api/marketing-intake` -> `netlify/functions/marketing-intake.js`

## Production controls
- Enable HTTPS only.
- Apply `_headers` with strict security policies.
- Restrict deploy permissions to owners/admins.
- Require branch protections on `main` and `staging`.

## Post-deploy checklist
1. Submit sample lead in contact flow.
2. Submit sample booking/checkout/newsletter flows.
3. Verify events arriving from `/api/track`.
4. Confirm status page timestamp and legal docs accessibility.


## Routing Reference
- `docs/LEAD-ROUTING-ARCHITECTURE.md`

## Security Automation
- Run `bash scripts/security-check.sh` before production deploy.
- CI workflow: `.github/workflows/security-baseline.yml`
