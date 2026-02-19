# API Endpoint Contracts (Launch)

Date: February 19, 2026

## 1) `/api/crm-intake`
Purpose:
- Receive commercial high-intent leads from booking, checkout, and contact forms.

Method:
- `POST`

Content-Type:
- `application/json`

Minimum fields expected:
- `name`, `email`, `company` (or `org`), `scope`, `timeline`, `lead_source`

Recommended fields:
- `package_interest`, `budget`, `region`, `message`
- `lead_score`, `lead_tier`, `lead_priority`, `revenue_track`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- `landing_page`, `referrer`

Response contract:
- `2xx` = accepted
- non-`2xx` = client shows submission failure

## 2) `/api/marketing-intake`
Purpose:
- Receive newsletter subscriptions, partner applications, preferences updates, chat qualifier submissions.

Method:
- `POST`

Content-Type:
- `application/json`

Common fields:
- `name`, `email`, `lead_source`, `segment`, `interest_topic`, `message`
- attribution fields (UTMs + referrer + landing page)

## 3) `/api/track`
Purpose:
- Receive frontend event telemetry from `trackEvent` in `script.js`.

Method:
- `POST`

Expected payload:
- `event`
- `page`
- `lang`
- `theme`
- `ts`
- optional event payload fields

## 4) Error Handling Recommendation
- Return JSON body with `status`, `message`, and optional `id`.
- Log payload validation failures with request ID.
- Enable retry-safe behavior on duplicate submissions.
