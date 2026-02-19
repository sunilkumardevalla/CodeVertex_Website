# HubSpot Revenue Ops Automations

## Pipeline model
- Stages: New -> Qualified -> Discovery -> Proposal -> Negotiation -> Closed Won/Lost

## Assignment logic
- Enterprise tier leads -> founder/enterprise owner
- Growth tier leads -> SDR/AE queue
- Standard leads -> nurture queue

## SLA automations
- High-priority lead: task due within 4 business hours
- Growth lead: task due within 1 business day
- No response for 48 hours: escalate to manager

## Data hygiene automations
- Block free email domains for enterprise forms (flag for review)
- Auto-normalize company fields
- Deduplicate on email + domain

## KPI widgets
- Time to first touch
- Stage conversion rates
- Deal velocity
- Win rate by segment
