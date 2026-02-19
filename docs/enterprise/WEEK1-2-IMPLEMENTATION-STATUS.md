# Week 1-2 Implementation Status

Date: February 19, 2026

## Scope
- Domain/DNS hardening baseline
- Observability baseline
- HubSpot SLA automation baseline

## Completed in repository
- [x] Domain/DNS hardening runbook and audit template
- [x] Domain baseline script: `scripts/domain-dns-baseline-check.sh`
- [x] Observability implementation runbook
- [x] Observability baseline script: `scripts/observability-baseline-check.sh`
- [x] HubSpot SLA configuration workbook
- [x] Weekly ops automation workflow: `.github/workflows/weekly-ops-baseline.yml`

## Requires account-level action (external systems)
- [ ] Apply DNS CAA/DMARC/SPF/DKIM records in registrar/DNS provider
- [ ] Configure uptime monitor provider and alert destinations
- [ ] Configure frontend error tracking provider and DSN
- [ ] Build HubSpot workflows in production portal with assignment owners

## Verification command
Run from repo root:
- `bash scripts/week1-2-baseline-check.sh`
