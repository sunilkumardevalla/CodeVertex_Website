# Blog Publishing Playbook

This workflow is designed so both the owner and assistant can publish consistently and quickly.

## 1) Create a new post shell
Run:

```bash
scripts/blog-new.sh \
  --title "Zero Trust Segmentation Blueprint" \
  --category "Network Security" \
  --tags "Zero Trust,Segmentation,Architecture" \
  --read-time "9 min read"
```

Output created:
- Draft: `workspace/blog-drafts/YYYY-MM-zero-trust-segmentation-blueprint.md`
- Page: `blog-zero-trust-segmentation-blueprint.html`

## 2) Add content and media
- Add your final article copy into the new blog HTML page.
- Add your own images/infographics/videos from your internal library.
- Use internal CTAs (`booking.html`, `security-assessment.html`, `resource-center.html`) to drive conversion.

## 3) Publish to blog + insights + SEO
Run:

```bash
scripts/blog-publish.sh \
  --slug "zero-trust-segmentation-blueprint" \
  --title "Zero Trust Segmentation Blueprint" \
  --excerpt "A pragmatic path to segment critical systems and reduce blast radius." \
  --category "Network Security" \
  --tags "Zero Trust,Segmentation,Architecture" \
  --read-time "9 min read" \
  --date "2026-02-19"
```

This command automatically updates:
- Blog feed data (`assets/data/blog-posts.json`)
- Insights feed data (`assets/data/insights-library.json`)
- SEO sitemap (`sitemap.xml`)
- Friendly route (`/blog/<slug>` in `_redirects`)

## 4) Verify locally
- Open `blog.html` and confirm new card appears.
- Open `insights.html` and confirm the article appears in insights cards.
- Open `/blog/<slug>` and confirm redirect works.

## 5) Publish live
- Commit and push to `main`.
- Netlify auto-deploy will publish changes.

## Editorial cadence (recommended)
- Week 1: 1 technical deep dive post
- Week 2: 1 executive/business impact post
- Week 3: 1 checklist/template post
- Week 4: 1 case-study-driven post

## Quality rules
- Keep excerpts to one clear business-value sentence.
- Always map each post to one primary CTA.
- Use only owned images/videos/infographics.
- Add at least one internal link to service or booking page.
