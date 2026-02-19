# CodeVertex Revenue Plan (1-2 Year Reference)

Date: February 19, 2026

This document is the execution reference for growing website revenue through enterprise cybersecurity services.

## 1. What Is Implemented On The Website

### Services Page
- Added productized package section with price bands:
  - Attack Surface Sprint: `$12K-$25K`
  - Core Assurance Program: `$30K-$65K`
  - Enterprise Offensive Validation: `$75K-$180K+`
- Added recurring retainer section:
  - Starter: `$6K-$12K/month`
  - Growth: `$15K-$30K/month`
  - Enterprise: `$35K-$80K+/month`
- Added strategic add-ons section:
  - vCISO Advisory
  - Compliance Readiness
  - Incident Readiness

### Pricing Page
- Added a dedicated comparison page:
  - `/Users/sunil/Documents/CodeVertex_Website/pricing.html`
- Includes project package bands, recurring retainers, and strategic add-ons.
- Includes procurement note explaining final quote process.
- Added owned commercial asset downloads:
  - `assets/docs/codevertex-pricing-guide.pdf`
  - `assets/docs/codevertex-pricing-guide.txt`
  - `assets/docs/crm-webhook-field-map.txt`
- Added an interactive ROI calculator section to estimate prevented-loss and net business value.

### Contact Page
- Upgraded qualification flow to capture commercial intent:
  - `package_interest` (new required field)
  - Expanded budget ranges aligned to package and retainer pricing
- Kept existing enterprise fields:
  - `scope`, `timeline`, `region`, `message`, `reference_link`, `locale`
- Added automatic CRM routing fields at submission time:
  - `lead_score`
  - `lead_tier`
  - `lead_priority`
  - `revenue_track`
- Added attribution capture fields for all async forms:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
  - `landing_page`, `referrer`

### Booking Conversion Flow
- Added dedicated strategy-call conversion page:
  - `/Users/sunil/Documents/CodeVertex_Website/booking.html`
- Includes slot selection, high-intent intake fields, and CRM webhook routing.

### Nurture Subscription Flow
- Added segmented briefing capture page:
  - `/Users/sunil/Documents/CodeVertex_Website/newsletter.html`
- Includes role-based segmentation and marketing webhook routing.

### Checkout and Paid Kickoff Flow
- Added secure checkout intake page:
  - `/Users/sunil/Documents/CodeVertex_Website/checkout.html`
- Supports paid kickoff/deposit intent and procurement-aligned commercial intake.

### Partner and ABM Growth
- Added partner/referral program page:
  - `/Users/sunil/Documents/CodeVertex_Website/partner-program.html`
- Added ABM sector landing page (financial services):
  - `/Users/sunil/Documents/CodeVertex_Website/enterprise-finance-security.html`

### Revenue Intelligence Dashboard
- Added executive revenue dashboard page:
  - `/Users/sunil/Documents/CodeVertex_Website/revenue-dashboard.html`
- Backed by data feed:
  - `/Users/sunil/Documents/CodeVertex_Website/assets/data/revenue-dashboard.json`

### Preferences and Consent Center
- Added preferences management page:
  - `/Users/sunil/Documents/CodeVertex_Website/unsubscribe.html`
- Supports unsubscribe/segment updates and local cookie-consent reset.

### Live Chat Qualifier (Owned)
- Added on-site quick qualifier chat widget in `script.js` and `styles.css`.
- Routes capture to marketing webhook when configured.

### Launch Handoff and Future Monetization Coverage
- Added full deployment and operations handoff:
  - `/Users/sunil/Documents/CodeVertex_Website/LAUNCH-HANDOFF-PACK.md`
  - `/Users/sunil/Documents/CodeVertex_Website/API-ENDPOINT-CONTRACTS.md`
  - `/Users/sunil/Documents/CodeVertex_Website/WEBHOOK-TEST-PLAYBOOK.md`
- Added complete future monetization options reference:
  - `/Users/sunil/Documents/CodeVertex_Website/MONETIZATION-OPTIONS-PLAYBOOK.md`
- Added automated monetization readiness check:
  - `/Users/sunil/Documents/CodeVertex_Website/scripts/monetization-check.sh`

### CRM Automation (Implemented in Frontend)
- Lead scoring is computed from package, budget, timeline, and scope.
- Routing intent is attached to each form submission as hidden fields.
- This supports RevOps automation rules in CRM (priority, ownership, pipeline branch).
- Added dedicated technical mapping reference:
  - `/Users/sunil/Documents/CodeVertex_Website/CRM-WEBHOOK-MAPPING.md`
  - `/Users/sunil/Documents/CodeVertex_Website/crm-webhook-mapping.html`
- Added dedicated CRM webhook test harness:
  - `/Users/sunil/Documents/CodeVertex_Website/crm-webhook-test.html`
- Supports live payload preview, derived routing-field inspection, and endpoint response logging.
- Supports endpoint adapter presets:
  - Generic JSON
  - Zapier Catch Hook
  - HubSpot Contact-style payload
  - Salesforce Lead-style payload

### Insights Page
- Added blog-to-service mapping section so editorial content directly supports pipeline growth.
- Added scalable insights library feed backed by:
  - `/Users/sunil/Documents/CodeVertex_Website/assets/data/insights-library.json`
  - Rendered dynamically in `insights.html` via `script.js`

### Content Operations System
- Added dedicated operating hub page:
  - `/Users/sunil/Documents/CodeVertex_Website/content-studio.html`
- Added structured future-change workspace:
  - `/Users/sunil/Documents/CodeVertex_Website/workspace/blog-drafts/`
  - `/Users/sunil/Documents/CodeVertex_Website/workspace/page-changes/`
  - `/Users/sunil/Documents/CodeVertex_Website/workspace/media-requests/`
  - `/Users/sunil/Documents/CodeVertex_Website/workspace/editorial-calendar/2026-calendar.md`
- Added reusable authoring templates:
  - `/Users/sunil/Documents/CodeVertex_Website/templates/blog-post-template.md`
  - `/Users/sunil/Documents/CodeVertex_Website/templates/page-change-template.md`
  - `/Users/sunil/Documents/CodeVertex_Website/templates/case-study-template.md`

### 24-Month Growth Roadmap
- Added step-by-step execution plan for monetization and scaling:
  - `/Users/sunil/Documents/CodeVertex_Website/GROWTH-ROADMAP-2026-2028.md`

### Internationalization
- Added English and Spanish labels/options for new form fields in `script.js`.

## 2. Core Monetization Model (Primary)

### Revenue Mix Target
- 60-70% recurring retainers
- 20-30% fixed-scope projects
- 10% add-ons (vCISO, compliance, incident readiness, workshops)

### Why This Mix
- Retainers create stable monthly cash flow.
- Projects feed retainers.
- Add-ons increase margin and lifetime value.

## 3. Offer Ladder (How Clients Move)

1. Entry: Attack Surface Sprint
2. Expansion: Core Assurance Program
3. Strategic: Enterprise Offensive Validation
4. Recurring: Continuous Validation Retainer
5. Executive Expansion: vCISO + Compliance + Incident readiness

## 4. Lead Funnel Design

### Primary Conversion Path
`Blog/Service Page -> Contact Qualification Form -> Executive Call -> Proposal -> Project -> Retainer`

### Form Qualification Priority
- Scope urgency
- Preferred package
- Budget range
- Region and constraints

### Commercial SLA
- First response in under 24 hours
- Discovery call offer in first response
- Proposal target: within 3-5 business days after discovery

## 5. Content Strategy That Makes Money

### Monthly Cadence
- Publish 2 high-intent articles/month.
- Publish 1 case-study refresh/month.
- Publish 1 executive-risk brief/month.

### High-Intent Blog Themes
- SOC 2 readiness and pentest expectations
- API abuse and identity attack-path closure
- Cloud IAM hardening and lateral movement prevention
- Board-level cyber risk reporting structure

### CTA Rules
- Every blog must include one primary CTA: `Book executive call`
- One secondary CTA: `Open readiness checklist` or `Request private briefing`

## 6. 90-Day Execution Plan

### Days 1-30
- Finalize production CRM mapping for new form fields.
- Build proposal templates per package tier.
- Set weekly pipeline review ritual.

### Days 31-60
- Start outbound + partner referrals (MSPs/compliance advisors/cloud consultancies).
- Launch first 4 high-intent blog posts tied to service pages.
- Track close-rate by package tier.

### Days 61-90
- Promote retainer conversion from all project proposals.
- Launch one webinar or executive briefing event.
- Publish one new public case outcome with measurable closure metrics.

## 7. 12-24 Month Growth Plan

### Year 1
- Stabilize package pipeline.
- Convert project clients into recurring retainers.
- Build repeatable proposal and delivery system.

### Year 2
- Expand vCISO and compliance offerings.
- Launch incident readiness retainer track.
- Introduce sector-specific bundles (SaaS, finance, healthcare).

## 8. KPI Dashboard (Weekly)

### Top Funnel
- Unique service-page visitors
- Contact form completion rate
- Call booking rate

### Sales
- Qualified lead rate
- Proposal win rate
- Average deal size
- Sales cycle length

### Revenue
- Monthly recurring revenue (MRR)
- Project revenue per month
- Retainer attach rate from project deals
- Client lifetime value (LTV)

## 9. Operating Cadence

### Weekly
- Pipeline review (leads, calls, proposals, blockers)
- Content performance review (traffic, CTA clicks, conversions)

### Monthly
- Pricing/packaging performance review
- Retainer conversion review
- Offer refinement based on closed-lost reasons

## 10. Systems and Ownership

### Required Systems
- CRM with custom fields (`package_interest`, budget, timeline, scope)
- Analytics dashboard for CTA and form conversion tracking
- Proposal templates and statement-of-work templates

### Suggested Ownership
- Founder/Leadership: pricing, key proposals, enterprise calls
- Delivery Lead: scope realism and capacity planning
- Marketing/Content: blog calendar and case-study assets
- RevOps: CRM quality and funnel reporting

## 11. Risks and Controls

### Risks
- Low-quality leads from broad traffic
- Long enterprise sales cycles
- Underpricing high-complexity scopes

### Controls
- Strong qualification form and discovery checklist
- Price floor per package tier
- Standard scoping boundaries and change-control terms

## 12. File Reference (Where Changes Were Made)

- `/Users/sunil/Documents/CodeVertex_Website/services.html`
- `/Users/sunil/Documents/CodeVertex_Website/pricing.html`
- `/Users/sunil/Documents/CodeVertex_Website/contact.html`
- `/Users/sunil/Documents/CodeVertex_Website/insights.html`
- `/Users/sunil/Documents/CodeVertex_Website/script.js`
- `/Users/sunil/Documents/CodeVertex_Website/styles.css`
- `/Users/sunil/Documents/CodeVertex_Website/document-center.html`
- `/Users/sunil/Documents/CodeVertex_Website/content-studio.html`
- `/Users/sunil/Documents/CodeVertex_Website/booking.html`
- `/Users/sunil/Documents/CodeVertex_Website/newsletter.html`
- `/Users/sunil/Documents/CodeVertex_Website/checkout.html`
- `/Users/sunil/Documents/CodeVertex_Website/partner-program.html`
- `/Users/sunil/Documents/CodeVertex_Website/enterprise-finance-security.html`
- `/Users/sunil/Documents/CodeVertex_Website/revenue-dashboard.html`
- `/Users/sunil/Documents/CodeVertex_Website/unsubscribe.html`
- `/Users/sunil/Documents/CodeVertex_Website/assets/data/revenue-dashboard.json`
- `/Users/sunil/Documents/CodeVertex_Website/LAUNCH-HANDOFF-PACK.md`
- `/Users/sunil/Documents/CodeVertex_Website/API-ENDPOINT-CONTRACTS.md`
- `/Users/sunil/Documents/CodeVertex_Website/WEBHOOK-TEST-PLAYBOOK.md`
- `/Users/sunil/Documents/CodeVertex_Website/MONETIZATION-OPTIONS-PLAYBOOK.md`
- `/Users/sunil/Documents/CodeVertex_Website/scripts/monetization-check.sh`
- `/Users/sunil/Documents/CodeVertex_Website/assets/data/insights-library.json`
- `/Users/sunil/Documents/CodeVertex_Website/templates/blog-post-template.md`
- `/Users/sunil/Documents/CodeVertex_Website/templates/page-change-template.md`
- `/Users/sunil/Documents/CodeVertex_Website/templates/case-study-template.md`
- `/Users/sunil/Documents/CodeVertex_Website/workspace/blog-drafts/README.md`
- `/Users/sunil/Documents/CodeVertex_Website/workspace/page-changes/README.md`
- `/Users/sunil/Documents/CodeVertex_Website/workspace/media-requests/README.md`
- `/Users/sunil/Documents/CodeVertex_Website/workspace/editorial-calendar/2026-calendar.md`
- `/Users/sunil/Documents/CodeVertex_Website/GROWTH-ROADMAP-2026-2028.md`
- `/Users/sunil/Documents/CodeVertex_Website/sitemap.xml`
- `/Users/sunil/Documents/CodeVertex_Website/assets/docs/codevertex-pricing-guide.pdf`
- `/Users/sunil/Documents/CodeVertex_Website/assets/docs/codevertex-pricing-guide.txt`
- `/Users/sunil/Documents/CodeVertex_Website/assets/docs/crm-webhook-field-map.txt`
- `/Users/sunil/Documents/CodeVertex_Website/CRM-WEBHOOK-MAPPING.md`
- `/Users/sunil/Documents/CodeVertex_Website/crm-webhook-mapping.html`
- `/Users/sunil/Documents/CodeVertex_Website/crm-webhook-test.html`

## 13. Next Recommended Enhancements

1. Add downloadable one-page PDF variants per package tier (sprint/core/enterprise).
2. Add explicit CRM workflow IDs (HubSpot/Salesforce) in mapping doc once platform is finalized.
3. Add monthly executive webinar registration funnel.
4. Publish at least 6 fresh case outcomes in the next 12 months.
