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

## API and CRM
- `netlify/functions/`
- `netlify.toml`
- `.env.example`
- `API-ENDPOINT-CONTRACTS.md`
- `docs/DEPLOYMENT-ENVIRONMENT.md`
- `docs/HUBSPOT-SETUP.md`

## Enterprise Operations Package
- `docs/enterprise/90-DAY-ENTERPRISE-ROADMAP.md`
- `docs/enterprise/DOMAIN-DNS-HARDENING.md`
- `docs/enterprise/OBSERVABILITY-ALERTING.md`
- `docs/enterprise/ANALYTICS-ATTRIBUTION.md`
- `docs/enterprise/HUBSPOT-REVOPS-AUTOMATIONS.md`
- `docs/enterprise/EMAIL-DELIVERABILITY.md`
- `docs/enterprise/COMPLIANCE-CMP-PLAN.md`
- `docs/enterprise/CRO-EXPERIMENT-BACKLOG.md`
- `docs/enterprise/SECURITY-OPERATIONS-CADENCE.md`
- `docs/enterprise/BCP-DR-PLAYBOOK.md`
- `docs/enterprise/EXECUTIVE-LAUNCH-BOARD.md`

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
- `bash scripts/security-check.sh`
- `bash scripts/production-config-check.sh`
- `bash scripts/monthly-crm-health-check.sh`
- `bash scripts/enterprise-readiness-check.sh`

## CI Workflows
- `.github/workflows/site-quality.yml`
- `.github/workflows/prelaunch-audit.yml`
- `.github/workflows/lighthouse-production.yml`
- `.github/workflows/security-baseline.yml`
- `.github/workflows/production-readiness.yml`
- `.github/workflows/monthly-crm-health-check.yml`
- `.github/workflows/enterprise-readiness.yml`
