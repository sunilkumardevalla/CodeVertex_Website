# HubSpot Setup Guide (CodeVertex)

Date: February 19, 2026

## 1) Why this setup
This project supports direct CRM ingestion into HubSpot via the Contacts API so high-intent leads from `contact`, `booking`, and `checkout` can land in your CRM immediately.

## 2) Create HubSpot private app
1. In HubSpot, go to Settings -> Integrations -> Private Apps.
2. Create app: `CodeVertex Lead Intake`.
3. Grant scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
4. Copy the private app token.

## 3) Configure environment variables (hosting)
Set these in Netlify site environment variables (do not commit real values):
- `CV_CRM_PROVIDER=hubspot`
- `CV_HUBSPOT_PRIVATE_APP_TOKEN=<real token>`
- `CV_HUBSPOT_API_BASE=https://api.hubapi.com`
- `CV_HUBSPOT_TIMEOUT_MS=7000`
- `CV_HUBSPOT_LIFECYCLE_STAGE=lead`
- `CV_HUBSPOT_DEFAULT_LEAD_STATUS=NEW`
- `CV_HUBSPOT_HIGH_PRIORITY_LEAD_STATUS=OPEN`
- `CV_HUBSPOT_NURTURE_LEAD_STATUS=IN_PROGRESS`

Optional fallback routes:
- `CV_CRM_ENTERPRISE_WEBHOOK`
- `CV_CRM_PRIMARY_WEBHOOK`
- `CV_CRM_SECONDARY_WEBHOOK`
- `CV_DEAD_LETTER_WEBHOOK`

## 4) Field mapping used by server
Direct HubSpot properties written:
- `email`
- `firstname`
- `lastname`
- `company`
- `jobtitle`
- `phone` (if present)
- `website` (from `reference_link` when present)
- `lifecyclestage`
- `hs_lead_status`

Lead status mapping:
- enterprise/high -> `CV_HUBSPOT_HIGH_PRIORITY_LEAD_STATUS`
- nurture -> `CV_HUBSPOT_NURTURE_LEAD_STATUS`
- default -> `CV_HUBSPOT_DEFAULT_LEAD_STATUS`

## 5) Test flow (required)
1. Deploy with environment variables set.
2. Submit test from `/contact.html`.
3. Verify `202` response from `/api/crm-intake`.
4. Confirm contact appears in HubSpot.
5. Submit second test from `/booking.html`.
6. Confirm no delivery errors in function logs.

## 6) Production hardening
- Rotate private app token every 90 days.
- Restrict token visibility to owners only.
- Keep `CV_ALLOWED_ORIGINS` scoped to your domains.
- Keep `CV_WEBHOOK_SIGNING_SECRET` enabled.
- Monitor `routing_id` + `request_id` in logs for incident triage.
