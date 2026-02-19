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

## Blog Publishing Operations
- Public blog hub: `/blog` and `blog.html`
- Post index data: `assets/data/blog-posts.json`
- Insights feed data: `assets/data/insights-library.json`
- Draft workspace: `workspace/blog-drafts/README.md`
- Publishing playbook: `docs/BLOG-PUBLISHING-PLAYBOOK.md`
- New post scaffold: `scripts/blog-new.sh`
- Publish command: `scripts/blog-publish.sh`

## Incident Watch Operations
- Incident center: `incident-watch.html`
- Incident feed data: `assets/data/incident-watch.json`
- Weekly playbook: `docs/WEEKLY-INCIDENT-PACK-PLAYBOOK.md`
- Draft workspace: `workspace/incident-packs/README.md`
- Draft script: `scripts/incident-pack-new.sh`
- Publish script: `scripts/incident-pack-publish.sh`

## API and CRM
- `functions/api/` (Cloudflare Pages Functions)
- `functions/_shared/`
- `CLOUDFLARE-PAGES-SETUP.md`
- `netlify/functions/` (legacy fallback)
- `netlify.toml` (legacy fallback)
- `.env.example`
- `API-ENDPOINT-CONTRACTS.md`
- `docs/DEPLOYMENT-ENVIRONMENT.md`
- `docs/HUBSPOT-SETUP.md`

## Enterprise Operations Package
- `docs/enterprise/90-DAY-ENTERPRISE-ROADMAP.md`
- `docs/enterprise/DOMAIN-DNS-HARDENING.md`
- `docs/enterprise/DOMAIN-DNS-IMPLEMENTATION-RUNBOOK.md`
- `docs/enterprise/OBSERVABILITY-ALERTING.md`
- `docs/enterprise/OBSERVABILITY-IMPLEMENTATION-RUNBOOK.md`
- `docs/enterprise/ANALYTICS-ATTRIBUTION.md`
- `docs/enterprise/HUBSPOT-REVOPS-AUTOMATIONS.md`
- `docs/enterprise/HUBSPOT-SLA-WORKBOOK.md`
- `docs/enterprise/EMAIL-DELIVERABILITY.md`
- `docs/enterprise/COMPLIANCE-CMP-PLAN.md`
- `docs/enterprise/CRO-EXPERIMENT-BACKLOG.md`
- `docs/enterprise/SECURITY-OPERATIONS-CADENCE.md`
- `docs/enterprise/BCP-DR-PLAYBOOK.md`
- `docs/enterprise/EXECUTIVE-LAUNCH-BOARD.md`
- `docs/enterprise/WEEK1-2-IMPLEMENTATION-STATUS.md`

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
- `bash scripts/week1-2-baseline-check.sh`

## CI Workflows
- `.github/workflows/site-quality.yml`
- `.github/workflows/prelaunch-audit.yml`
- `.github/workflows/lighthouse-production.yml`
- `.github/workflows/security-baseline.yml`
- `.github/workflows/production-readiness.yml`
- `.github/workflows/monthly-crm-health-check.yml`
- `.github/workflows/enterprise-readiness.yml`
- `.github/workflows/weekly-ops-baseline.yml`
