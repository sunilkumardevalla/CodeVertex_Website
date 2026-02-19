# Launch Runbook (CodeVertex)

Date baseline: February 19, 2026

## T-24h
- Freeze content and legal pages.
- Run: `bash scripts/quality-check.sh`
- Run: `bash scripts/prelaunch-check.sh`
- Run: `bash scripts/monetization-check.sh`
- Confirm legal/security sign-off on latest build.

## T-4h
- Set production values:
  - `cv-crm-webhook` meta in `contact.html`
  - `cv-track-endpoint` meta across pages
  - `pgp-key.txt` final key
- Update `status-feed.json` with current timestamp and service state.
- Re-run quality and prelaunch checks.

## T-1h
- Deploy to production.
- Validate:
  - Headers from `_headers`
  - HTTPS redirects from `_redirects`
  - `/.well-known/security.txt`
  - `sitemap.xml` + `robots.txt`

## T+0 (Go-Live)
- Smoke test core funnel:
  - Home -> Services -> Contact submit
  - Home -> Booking submit
  - Pricing -> Checkout submit
  - Insights -> Newsletter subscribe
  - Partner Program submit
  - Document downloads
  - Language/theme switchers
  - Cookie consent
  - Status page render
- Confirm event flow reaches analytics endpoint.
- Confirm CRM lead creation with full field mapping.
- Confirm marketing intake receives newsletter/partner/preferences/chat events.

## T+1h
- Review error logs and uptime checks.
- Review form submissions and conversion events.
- Publish launch confirmation internally.

## T+24h
- Review performance and accessibility findings.
- Review indexation and search console signals.
- Publish first post-launch insight/case update.
