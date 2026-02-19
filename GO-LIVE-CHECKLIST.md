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
- [ ] Implement CMP evidence retention model in `docs/enterprise/COMPLIANCE-CMP-PLAN.md`.

## 2. Security and Trust
- [ ] Replace placeholder key in `pgp-key.txt` with real security team public key.
- [ ] Validate `.well-known/security.txt` entries and contact mailbox ownership.
- [ ] Review `_headers` CSP against final integrations.
- [ ] Run final security smoke test on public environment (headers, TLS, redirects, CSP).
- [ ] Perform external penetration test of the website/application surface.
- [ ] Adopt security cadence in `docs/enterprise/SECURITY-OPERATIONS-CADENCE.md`.

## 3. Integrations (Required)
- [ ] Set CRM and marketing integration values in production env.
- [ ] Validate form routing and data mapping in CRM.
- [ ] Configure analytics dashboard for tracked events in `script.js`.
- [ ] Validate checkout/partner/newsletter/preferences forms route to correct endpoints.
- [ ] Enable monthly CRM health workflow and confirm green run.

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
- [ ] Configure uptime monitoring and alert channels.
- [ ] Configure frontend error monitoring and alert routing.
- [ ] Implement `docs/enterprise/OBSERVABILITY-ALERTING.md` actions.
- [ ] Define incident update SLA and approval workflow.

## 8. CI/CD and Release Controls
- [ ] Ensure GitHub Actions workflows pass.
- [ ] Run local quality gates before deployment.
- [ ] Add branch protection requiring successful checks.
- [ ] Tag release and archive deployment artifacts.
- [ ] Enable weekly `Enterprise Readiness` workflow run.

## 9. Final Launch Verification
- [ ] Smoke test core journey and key forms.
- [ ] Confirm no console errors in major browsers.
- [ ] Confirm HTTPS-only and no mixed-content warnings.
- [ ] Take final legal/security sign-off snapshot and publish.

## 10. Post-Launch (First 14 Days)
- [ ] Daily check tracking events and conversion funnel.
- [ ] Daily check uptime/error alerts.
- [ ] Weekly review top pages and drop-off points.
- [ ] Weekly content/SEO updates and indexation checks.
- [ ] Publish first post-launch case-study/insight update.

## 11. 90-Day Enterprise Execution
- [ ] Run plan in `docs/enterprise/90-DAY-ENTERPRISE-ROADMAP.md`.
- [ ] Review weekly against `docs/enterprise/EXECUTIVE-LAUNCH-BOARD.md`.
- [ ] Track owner accountability per milestone.
