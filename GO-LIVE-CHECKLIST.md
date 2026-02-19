# CodeVertex Go-Live Checklist

Last updated: February 19, 2026

## 1. Legal and Compliance
- [ ] Replace placeholder legal templates in `assets/docs/` with approved production PDFs.
- [ ] Legal review and sign-off for:
  - [ ] `privacy.html`
  - [ ] `terms.html`
  - [ ] `responsible-disclosure.html`
  - [ ] `data-retention.html`
  - [ ] `subprocessors.html`
- [ ] Confirm regional privacy requirements (GDPR/CCPA/other) and publish required clauses.
- [ ] Confirm cookie policy wording aligns with legal counsel guidance.

## 2. Security and Trust
- [ ] Replace placeholder key in `pgp-key.txt` with real security team public key.
- [ ] Validate `.well-known/security.txt` entries and contact mailbox ownership.
- [ ] Review `_headers` CSP against final integrations.
- [ ] Run final security smoke test on public environment (headers, TLS, redirects, CSP).
- [ ] Perform external penetration test of the website/application surface.

## 3. Integrations (Required)
- [ ] Set CRM webhook endpoint in `contact.html` meta tag `cv-crm-webhook`.
- [ ] Set marketing webhook endpoint in pages using `cv-marketing-webhook`.
- [ ] Set tracking endpoint in `cv-track-endpoint` meta tags.
- [ ] Validate form routing and data mapping in CRM:
  - [ ] `name`
  - [ ] `email`
  - [ ] `org`
  - [ ] `scope`
  - [ ] `timeline`
  - [ ] `region`
  - [ ] `message`
  - [ ] `lead_source`
  - [ ] `locale`
- [ ] Configure analytics dashboard for tracked events in `script.js`.
- [ ] Validate revenue dashboard feed in `assets/data/revenue-dashboard.json` or production API.
- [ ] Validate checkout/partner/newsletter/preferences forms route to correct endpoints.

## 4. Content and Brand Proof
- [ ] Replace placeholder leadership bios with approved real profiles.
- [ ] Add approved client logos/testimonials and release approvals.
- [ ] Replace placeholder report/doc artifacts with branded enterprise versions.
- [ ] Final copy edit pass in English and Spanish by native reviewers.

## 5. Accessibility and UX
- [ ] Run WCAG 2.2 AA audit (keyboard, screen-reader, contrast, motion, forms).
- [ ] Verify reduced-motion behavior across all animated scenes.
- [ ] Validate focus order and visible focus on all pages.
- [ ] Confirm mobile behavior across iOS/Android (header, forms, cookie banner, animations).

## 6. Performance and SEO
- [ ] Verify production image optimization and CDN caching.
- [ ] Run Lighthouse on key pages (home, services, contact, trust center).
- [ ] Confirm `sitemap.xml` and `robots.txt` served correctly.
- [ ] Validate `hreflang` and canonical tags in production HTML.
- [ ] Confirm Open Graph and Twitter cards render correctly.

## 7. Operations and Monitoring
- [ ] Connect `status.html` feed process ownership for `status-feed.json` updates.
- [ ] Define incident update SLA and approval workflow.
- [ ] Configure uptime monitoring and alert channels.
- [ ] Configure frontend error monitoring and alert routing.

## 8. CI/CD and Release Controls
- [ ] Ensure GitHub Actions workflow passes: `.github/workflows/site-quality.yml`.
- [ ] Run local quality gate before deployment:
  - `bash scripts/quality-check.sh`
- [ ] Add branch protection requiring successful quality checks.
- [ ] Tag release and archive deployment artifacts.

## 9. Final Launch Verification
- [ ] Smoke test core journey:
  - [ ] Homepage -> Services -> Contact form submit
  - [ ] Homepage -> Booking -> CRM lead creation
  - [ ] Pricing -> Checkout -> CRM lead creation
  - [ ] Insights -> Newsletter -> Marketing lead creation
  - [ ] Partner Program -> Marketing lead creation
  - [ ] Preferences Center -> marketing update event
  - [ ] Document downloads
  - [ ] Theme switch and language switch
  - [ ] Cookie consent interaction
  - [ ] Status page feed rendering
- [ ] Confirm no console errors in major browsers.
- [ ] Confirm HTTPS-only and no mixed-content warnings.
- [ ] Take final legal/security sign-off snapshot and publish.

## 10. Post-Launch (First 14 Days)
- [ ] Daily check tracking events and conversion funnel.
- [ ] Daily check uptime/error alerts.
- [ ] Weekly review top pages and drop-off points.
- [ ] Weekly content/SEO updates and indexation checks.
- [ ] Publish first post-launch case-study/insight update.

---

## Ownership Matrix (Recommended)
- Legal: Counsel / Compliance lead
- Security: Security lead
- Integrations: Web engineering + RevOps
- Content: Marketing + Leadership
- Accessibility: UX + QA
- Operations: DevOps/SRE

## Go/No-Go Gate
Proceed to launch only when:
- [ ] All required checkboxes in sections 1-4 are complete
- [ ] Quality checks pass
- [ ] Monetization checks pass: `bash scripts/monetization-check.sh`
- [ ] Security/legal owners sign off
