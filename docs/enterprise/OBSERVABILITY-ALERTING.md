# Observability and Alerting Plan

## What to monitor
- Uptime: homepage + `/api/crm-intake` + `/api/marketing-intake`
- Functional SLA: CRM intake success rate
- Client errors: frontend exceptions
- Server errors: function 5xx rates

## Alert channels
- Critical: SMS or Pager + Slack
- High: Slack + email
- Medium: email digest

## Required thresholds
- Uptime below 99.9% monthly: alert
- CRM intake `routed=false` > 2% over 15 min: alert
- Consecutive 5xx responses >= 5 in 10 min: alert

## Incident workflow
1. Detect
2. Triage owner assigned in <= 10 minutes
3. Mitigate
4. Communicate update every 30 minutes
5. Postmortem within 48 hours
