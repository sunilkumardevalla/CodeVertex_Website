# CodeVertex CRM Webhook Mapping

Date: February 19, 2026
Source of truth: `/Users/sunil/Documents/New project/script.js`

## 1. Overview
The contact qualification form submits to the site backend and optionally forwards the same payload to a CRM webhook endpoint.

Webhook endpoint resolution order:
1. `window.CV_CRM_WEBHOOK`
2. `<meta name="cv-crm-webhook" content="...">`

Webhook request:
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body: `JSON.stringify(Object.fromEntries(formData.entries()))`

## 2. Field Dictionary

### Identity fields
- `name`: Requestor full name
- `email`: Business email
- `company`: Company/legal entity
- `role`: Role/title (optional)

### Qualification fields
- `scope`: Security scope intent (`web-api`, `cloud`, `red-team`, `continuous`)
- `package_interest`: Commercial package intent (`sprint`, `core`, `enterprise`, `retainer`, `advisory`)
- `timeline`: Start urgency (`urgent`, `30days`, `quarter`, `planning`)
- `budget`: Budget band (project/retainer options)
- `region`: Delivery region
- `message`: Problem context and constraints
- `reference_link`: Optional supporting link
- `locale`: Language/locale signal

### Derived routing fields (auto-generated)
- `lead_score`: Numeric score, sent as string
- `lead_tier`: `standard` | `growth` | `enterprise`
- `lead_priority`: `nurture` | `normal` | `high`
- `revenue_track`: `project` | `recurring` | `advisory`

## 3. Routing Logic Summary

`computeLeadRouting(form)` applies weighted increments:
- Base score = 20
- Package weighting increases based on deal type
- Budget weighting increases based on commercial band
- Timeline weighting increases for urgency
- Scope can force recurring track when `continuous`

Tier/priority derivation:
- Enterprise tier for high score or enterprise-level selections
- Growth tier for mid-range score or retainer/core selections
- High priority for urgent timeline or enterprise tier
- Nurture priority for planning-stage standard leads

## 4. Recommended CRM Automations

### Pipeline routing
- If `lead_priority=high` or `lead_tier=enterprise` -> route to Enterprise AE queue.
- If `revenue_track=recurring` -> route to Retainer pipeline stage.
- If `revenue_track=advisory` -> route to Advisory/vCISO specialists.

### Task automation
- Create immediate follow-up task when `lead_priority=high` (SLA: 4 business hours).
- Create discovery task when `lead_tier=growth` (SLA: 1 business day).
- Add nurture cadence when `lead_priority=nurture`.

### Reporting
- Dashboard by `package_interest`, `lead_tier`, `revenue_track`, and `budget`.
- Weekly conversion report: lead -> call -> proposal -> close.

## 5. Example Payload

```json
{
  "name": "Jane Doe",
  "email": "jane@enterprise.com",
  "company": "Enterprise Co",
  "scope": "cloud",
  "package_interest": "retainer",
  "timeline": "urgent",
  "budget": "retainer-35-80",
  "region": "North America",
  "message": "Need continuous validation for cloud workloads.",
  "locale": "en-US",
  "lead_score": "123",
  "lead_tier": "enterprise",
  "lead_priority": "high",
  "revenue_track": "recurring"
}
```

## 6. Implementation References
- `/Users/sunil/Documents/New project/contact.html`
- `/Users/sunil/Documents/New project/script.js`
- `/Users/sunil/Documents/New project/assets/docs/crm-webhook-field-map.txt`

## 7. Test Harness Presets

The webhook test harness supports adapter presets for common integration patterns:
- Generic JSON (native CodeVertex payload)
- Zapier Catch Hook style (`event/source/timestamp/data`)
- HubSpot Contact-style (`properties` object)
- Salesforce Lead-style fields (`FirstName`, `LastName`, custom `CV_*__c`)

Harness page:
- `/Users/sunil/Documents/New project/crm-webhook-test.html`
