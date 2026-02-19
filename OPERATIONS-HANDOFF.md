# Operations Handoff

## Required Production Config
- CRM webhook: set `meta[name=\"cv-crm-webhook\"]` in `contact.html`
- Tracking endpoint: set `meta[name=\"cv-track-endpoint\"]` in all pages (or provide `window.CV_TRACK_ENDPOINT` globally)
- PGP key: replace placeholder in `pgp-key.txt`

## Files With Operational Ownership
- `status-feed.json` (status updates)
- `.well-known/security.txt` (security contact and policy links)
- `_headers` (security policies)
- `sitemap.xml` (SEO updates)
- `assets/docs/*` (legal/procurement package)

## Monitoring Targets
- Form submissions success/fail rate
- CTA click-through events
- Download events
- Status feed load errors
- Uptime and HTTP error rates
