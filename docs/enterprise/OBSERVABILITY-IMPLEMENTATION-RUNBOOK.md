# Observability Implementation Runbook

## Critical monitors
- Website uptime: `/`
- CRM intake health: `/api/crm-intake` (POST synthetic)
- Marketing intake health: `/api/marketing-intake` (POST synthetic)

## Alert routing
- Critical incidents -> Pager/SMS + Slack
- Degraded states -> Slack + email

## Baseline SLO targets
- Availability: 99.9%
- CRM intake routed success >= 98%
- 5xx error budget: <= 0.5% of requests

## Required dashboards
- Endpoint latency by route
- 4xx/5xx rates by function
- Lead routing success ratio
- Frontend JS error rate

## Implementation notes
- Use one owner per alert policy.
- Add runbook URL in every alert.
- Review alert noise weekly and tune thresholds.
