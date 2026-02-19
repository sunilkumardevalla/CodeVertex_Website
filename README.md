# CodeVertex Website

Enterprise cybersecurity marketing and revenue website for CodeVertex.

## Start Here
- Primary context: `/Users/sunil/Documents/CodeVertex_Website/THREAD.md`
- Entry page: `/Users/sunil/Documents/CodeVertex_Website/index.html`
- Production repository: `sunilkumardevalla/CodeVertex_Website`

## Core Application
- `index.html`
- `styles.css`
- `script.js`
- `sitemap.xml`, `robots.txt`, `_headers`, `_redirects`

## Revenue and Operations Pages
- `booking.html`
- `newsletter.html`
- `checkout.html`
- `partner-program.html`
- `enterprise-finance-security.html`
- `unsubscribe.html`
- `content-studio.html`
- `crm-webhook-test.html`
- `crm-webhook-mapping.html`

## Data and Templates
- `assets/data/insights-library.json`
- `assets/data/revenue-dashboard.json`
- `workspace/`
- `templates/`

## API and Deployment
- `netlify/functions/`
- `netlify.toml`
- `.env.example`
- `API-ENDPOINT-CONTRACTS.md`
- `docs/DEPLOYMENT-ENVIRONMENT.md`

## Governance and Release
- `CONTRIBUTING.md`
- `docs/RELEASE-MANAGEMENT.md`
- `GO-LIVE-CHECKLIST.md`
- `LAUNCH-HANDOFF-PACK.md`
- `VISUAL-QA-AND-LAUNCH-SIGNOFF-2026-02-19.md`

## Required Validation Before Release
Run all checks from project root:
- `bash scripts/quality-check.sh`
- `bash scripts/prelaunch-check.sh`
- `bash scripts/monetization-check.sh`

## CI Workflows
- `.github/workflows/site-quality.yml`
- `.github/workflows/prelaunch-audit.yml`
- `.github/workflows/lighthouse-production.yml`
