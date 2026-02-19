# CodeVertex Launch Handoff Pack

Date: February 19, 2026
Owner: Web + RevOps

## 1) Scope of Handoff
This pack covers:
- Production deployment checks
- Endpoint and webhook contracts
- Conversion and monetization validation
- Revenue operations run sequence (first 30 days)

## 2) Deployment Sequence
1. Run local checks:
   - `bash scripts/quality-check.sh`
   - `bash scripts/prelaunch-check.sh`
   - `bash scripts/monetization-check.sh`
2. Configure production endpoint values.
3. Deploy static assets.
4. Run post-deploy smoke tests (forms, webhooks, dashboard feed).
5. Confirm analytics and CRM ingestion.

## 3) Required Production Endpoints
- CRM Intake: `/api/crm-intake`
- Marketing Intake: `/api/marketing-intake`
- Event Tracking: `/api/track`
- Revenue dashboard data feed: `assets/data/revenue-dashboard.json` (or API replacement)

## 4) Critical Revenue Journeys
- Home -> Booking -> CRM intake
- Insights -> Newsletter -> Marketing intake
- Pricing -> Checkout -> CRM intake
- Partner Program -> Application -> Marketing intake
- ABM landing -> Booking/Checkout

## 5) Financial Controls (Before Launch)
- Payment processor account live (Stripe or equivalent)
- Tax/commercial legal review complete
- Refund/cancellation policy confirmed in legal pages
- Deposit workflow approval by leadership

## 6) First 30-Day Operating Plan
Week 1:
- Validate all lead paths and webhook payloads daily.
- Monitor submission failure rate and endpoint errors.
Week 2:
- Launch first ABM campaign to finance page.
- Launch first partner outreach sequence.
Week 3:
- Publish 2 high-intent posts and 1 case refresh.
- Run first conversion optimization review.
Week 4:
- Revenue dashboard review with leadership.
- Adjust pricing/CTA/segments based on pipeline quality.

## 7) Incident Response for Monetization Flows
If checkout/booking/newsletter fails:
1. Switch CTA to `contact.html` fallback immediately.
2. Disable broken endpoint form routing in meta tags.
3. Route urgent leads manually via `contact@codevertex.io`.
4. Log incident in status workflow and restore with retest.

## 8) Source Files
- `/Users/sunil/Documents/CodeVertex_Website/booking.html`
- `/Users/sunil/Documents/CodeVertex_Website/newsletter.html`
- `/Users/sunil/Documents/CodeVertex_Website/checkout.html`
- `/Users/sunil/Documents/CodeVertex_Website/partner-program.html`
- `/Users/sunil/Documents/CodeVertex_Website/revenue-dashboard.html`
- `/Users/sunil/Documents/CodeVertex_Website/enterprise-finance-security.html`
- `/Users/sunil/Documents/CodeVertex_Website/unsubscribe.html`
- `/Users/sunil/Documents/CodeVertex_Website/script.js`
- `/Users/sunil/Documents/CodeVertex_Website/REVENUE-PLAN-README.md`
