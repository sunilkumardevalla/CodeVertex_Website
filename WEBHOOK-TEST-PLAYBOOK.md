# Webhook Test Playbook

Date: February 19, 2026

## 1) UI Harness Tests
Use:
- `/Users/sunil/Documents/New project/crm-webhook-test.html`

Validate presets:
- Generic JSON
- Zapier Catch Hook
- HubSpot Contact-style
- Salesforce Lead-style

Expected:
- HTTP 2xx response
- Payload includes lead routing fields
- CRM records route to expected pipeline owner/tier

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

## 3) Attribution Tests
Open page with query string, example:
- `?utm_source=linkedin&utm_medium=paid&utm_campaign=q2-abm`
Submit form and verify fields in payload.

## 4) Failure Tests
- Temporarily point webhook URL to invalid endpoint.
- Confirm UI shows failure message and does not silently pass.
- Restore endpoint and re-validate success.
