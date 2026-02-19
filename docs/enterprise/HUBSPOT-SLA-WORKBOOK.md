# HubSpot SLA Workbook

## Ticket ownership model
- Enterprise tier: Founder/Enterprise AE
- Growth tier: SDR/AE queue
- Standard tier: Nurture queue

## Workflow rules to create
1. High-priority leads
- Trigger: `lead_priority = high` OR `lead_tier = enterprise`
- Action: Create task due in 4 business hours
- Action: Assign owner = enterprise owner

2. Growth leads
- Trigger: `lead_tier = growth`
- Action: Create task due in 1 business day
- Action: Assign owner = SDR queue

3. No-response escalation
- Trigger: no activity for 48 hours on open lead
- Action: Notify manager + reassign

## Required properties
- `lead_tier`
- `lead_priority`
- `revenue_track`
- `lead_source`
- `first_response_sla_due`

## KPI views
- Time to first touch
- SLA breaches by owner
- Stage conversion by tier
