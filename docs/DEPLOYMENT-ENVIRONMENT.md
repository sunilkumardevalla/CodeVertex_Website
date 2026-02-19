# Deployment Environment

## Required environment variables
- `CV_WEBHOOK_SIGNING_SECRET`:
  - used by `/api/crm-intake` and `/api/marketing-intake` for signature verification.

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
