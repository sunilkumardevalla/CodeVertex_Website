# CRM and Webhook Test Playbook

Date: February 19, 2026

## 1) UI Harness Tests
Use:
- `/Users/sunil/Documents/CodeVertex_Website/crm-webhook-test.html`

Validate presets:
- Generic JSON
- Zapier Catch Hook
- HubSpot Contact-style
- Salesforce Lead-style

Expected:
- HTTP 2xx response
- Payload includes lead routing fields
- Routing response includes `routing_id`

## 2) Form Path Tests
Run submit tests on:
- `contact.html`
- `booking.html`
- `checkout.html`
- `newsletter.html`
- `partner-program.html`
- `unsubscribe.html`

Validate:
- Correct endpoint target (CRM vs marketing)
- UTM fields attached
- `lead_source` value present

## 3) HubSpot Direct Delivery Tests
Precondition:
- `CV_CRM_PROVIDER=hubspot`
- valid `CV_HUBSPOT_PRIVATE_APP_TOKEN`

Run:
1. Submit lead from `contact.html`.
2. Confirm `/api/crm-intake` returns `202` with `routed=true`.
3. Verify record appears in HubSpot contacts.
4. Repeat with `booking.html`.

## 4) Attribution Tests
Open page with query string, example:
- `?utm_source=linkedin&utm_medium=paid&utm_campaign=q2-abm`
Submit form and verify fields in payload.

## 5) Failure Tests
- Temporarily set invalid `CV_HUBSPOT_PRIVATE_APP_TOKEN`.
- Confirm router logs show provider failure.
- Confirm fallback webhook route works if configured.
- Restore token and revalidate success.
