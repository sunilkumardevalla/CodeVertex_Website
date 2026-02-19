# API Endpoint Contracts (Launch)

Date: February 19, 2026

## Security Baseline
- All endpoints accept `POST` only.
- Content type: `application/json`.
- Rate limit: enabled server-side.
- Dedupe window: enabled server-side for lead and subscriber payloads.
- Signature verification:
  - header: `x-cv-signature`
  - algorithm: `HMAC-SHA256(raw_body, CV_WEBHOOK_SIGNING_SECRET)`

## 1) `/api/crm-intake`
Purpose:
- Receive high-intent commercial leads from booking, checkout, and contact forms.

Provider modes:
- `CV_CRM_PROVIDER=hubspot` (recommended): sends lead directly to HubSpot Contacts API.
- `CV_CRM_PROVIDER=webhook`: sends lead to configured CRM webhook destinations.

Minimum fields expected:
- `name`, `email`, `company` (or `org`), `lead_source`

Recommended fields:
- `scope`, `timeline`, `package_interest`, `budget`, `region`, `message`
- `lead_score`, `lead_tier`, `lead_priority`, `revenue_track`
- UTM fields, `landing_page`, `referrer`

Response contract:
- `202`: `{ ok: true, lead_id, route: "crm", routing_id, routed, priority }`
- `400`: `{ error: "invalid_email" | "invalid_payload" }`
- `401`: `{ error: "invalid_signature" }`
- `429`: `{ error: "rate_limited" }`
- `502`: `{ error: "downstream_delivery_failed" }` when `CV_FAIL_ON_ROUTING_ERROR=true`

## 2) `/api/marketing-intake`
Purpose:
- Receive newsletter subscriptions, partner applications, preferences updates, and low-intent qualifier leads.

Common fields:
- `name`, `email`, `lead_source`, `segment`, `interest_topic`, `message`, `consent`
- attribution fields (UTMs + referrer + landing page)

Response contract:
- `202`: `{ ok: true, subscriber_id, route: "marketing", routing_id, routed, priority }`
- `400`: `{ error: "invalid_email" | "invalid_payload" }`
- `401`: `{ error: "invalid_signature" }`
- `429`: `{ error: "rate_limited" }`

## 3) `/api/track`
Purpose:
- Receive frontend telemetry from `trackEvent` in `script.js`.

Expected payload:
- `event`
- `page`
- `ts`
- optional event metadata fields

Response contract:
- `202`: `{ ok: true }`
- `400`: `{ error: "invalid_event" }`
- `429`: `{ error: "rate_limited" }`

## 4) Operational Recommendations
- Route logs from all API handlers to centralized observability.
- Alert on sustained 4xx/5xx rates and signature failures.
- Maintain idempotency in downstream CRM/marketing ingestion.
- Rotate `CV_WEBHOOK_SIGNING_SECRET` on a fixed schedule.
- Rotate HubSpot private app token every 90 days.

## 5) Routing and Retry Behavior
- CRM and marketing endpoints use a shared routing engine.
- Delivery supports:
  - priority-based destination selection
  - retry with backoff
  - dead-letter fallback when all destinations fail
- Response payload includes:
  - `routing_id`
  - `routed` boolean
  - `priority`
  - `dead_letter` status object when applicable
- Strict mode:
  - set `CV_FAIL_ON_ROUTING_ERROR=true` to return `502` on routing failure
