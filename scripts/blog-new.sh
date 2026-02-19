#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

usage() {
  cat <<'HELP'
Usage:
  scripts/blog-new.sh --title "Post title" --category "Category" --tags "Tag 1,Tag 2,Tag 3" [--read-time "7 min read"] [--slug "custom-slug"] [--date YYYY-MM-DD]

Creates:
  1) Draft markdown in workspace/blog-drafts/
  2) New blog HTML page in project root
HELP
}

require_value() {
  local label="$1"
  local value="${2:-}"
  if [[ -z "$value" ]]; then
    echo "[blog-new] missing required value: $label" >&2
    usage
    exit 1
  fi
}

slugify() {
  local input="$1"
  echo "$input" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g'
}

TITLE=""
CATEGORY=""
TAGS=""
READ_TIME="7 min read"
SLUG=""
PUBLISH_DATE="$(date +%F)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title) TITLE="${2:-}"; shift 2 ;;
    --category) CATEGORY="${2:-}"; shift 2 ;;
    --tags) TAGS="${2:-}"; shift 2 ;;
    --read-time) READ_TIME="${2:-}"; shift 2 ;;
    --slug) SLUG="${2:-}"; shift 2 ;;
    --date) PUBLISH_DATE="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[blog-new] unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

require_value "--title" "$TITLE"
require_value "--category" "$CATEGORY"
require_value "--tags" "$TAGS"

if [[ -z "$SLUG" ]]; then
  SLUG="$(slugify "$TITLE")"
else
  SLUG="$(slugify "$SLUG")"
fi

if [[ -z "$SLUG" ]]; then
  echo "[blog-new] could not derive slug from title" >&2
  exit 1
fi

BLOG_FILE="blog-${SLUG}.html"
DRAFT_FILE="workspace/blog-drafts/${PUBLISH_DATE:0:7}-${SLUG}.md"

if [[ -e "$BLOG_FILE" ]]; then
  echo "[blog-new] blog file already exists: $BLOG_FILE" >&2
  exit 1
fi

if [[ -e "$DRAFT_FILE" ]]; then
  echo "[blog-new] draft file already exists: $DRAFT_FILE" >&2
  exit 1
fi

cat > "$DRAFT_FILE" <<DRAFT
# ${TITLE}

- Owner:
- Publish target date: ${PUBLISH_DATE}
- Funnel stage: (TOFU/MOFU/BOFU)
- Primary service mapped:
- Primary CTA URL:
- Secondary CTA URL:
- Category: ${CATEGORY}
- Tags: ${TAGS}
- Read time: ${READ_TIME}
- Blog slug: ${SLUG}

## 1. Headline

## 2. Executive Summary (3 bullets)

## 3. Problem Context

## 4. Threat/Control Analysis

## 5. Enterprise Actions (5-7 items)

## 6. KPI Impact

## 7. CTA Block
- Primary CTA:
- Secondary CTA:

## 8. Internal SEO Checklist
- Keyword focus:
- Meta title:
- Meta description:
- Internal links added:
- Case study link added:
- Image/video assets attached:
DRAFT

cat > "$BLOG_FILE" <<HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${TITLE} | CodeVertex</title>
    <meta name="description" content="Add a concise meta description for ${TITLE}." />
    <meta name="theme-color" content="#0d6ed1" />
    <meta name="cv-track-endpoint" content="/api/track" />
    <link rel="canonical" href="https://codevertex.io/${BLOG_FILE}" />
    <meta property="og:title" content="${TITLE} | CodeVertex" />
    <meta property="og:description" content="Add social description for ${TITLE}." />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://codevertex.io/${BLOG_FILE}" />
    <meta property="og:image" content="https://codevertex.io/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${TITLE} | CodeVertex" />
    <meta name="twitter:description" content="Add social description for ${TITLE}." />
    <meta name="twitter:image" content="https://codevertex.io/og-image.jpg" />
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png" />
    <link rel="apple-touch-icon" href="apple-touch-icon.png" />
    <link rel="manifest" href="site.webmanifest" />
    <link rel="preload" as="image" href="assets/logos/6.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body data-blog-slug="${SLUG}">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="site-shell" aria-hidden="true"><span class="orb one"></span><span class="orb two"></span><span class="orb three"></span></div>
    <header class="site-header"><div class="container header-inner"><a href="index.html" aria-label="CodeVertex home"><img class="logo-image" src="assets/logos/6.png" alt="CodeVertex" /></a><nav class="main-nav" id="primary-nav" aria-label="Primary"><a href="index.html">Home</a><a href="services.html">Services</a><a href="industries.html">Industries</a><a class="active" href="blog.html">Blog</a><a href="insights.html">Insights</a><a href="contact.html">Contact</a></nav><div class="header-controls"><div class="select-wrap"><label for="lang-switch">Language</label><select id="lang-switch"><option value="auto">Auto</option><option value="en">English</option><option value="es">Espanol</option></select></div><div class="select-wrap"><label for="theme-switch">Theme</label><select id="theme-switch"><option value="light">Light</option><option value="dark">Dark</option></select></div><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span><span></span><span></span></button></div></div></header>

    <main id="main-content">
      <section class="section page-hero tone-sky" data-track-section="blog_${SLUG}_hero">
        <div class="container hero-block reveal">
          <p class="kicker">${READ_TIME}</p>
          <h1>${TITLE}</h1>
          <p class="lead">Write a short executive summary that explains the business outcome and action path.</p>
        </div>
      </section>

      <section class="section tone-cyan" data-track-section="blog_${SLUG}_body">
        <div class="container">
          <article class="panel reveal">
            <h2>Section 1 heading</h2>
            <p>Add your content here.</p>
            <h2>Section 2 heading</h2>
            <p>Add your content here.</p>
            <h2>Section 3 heading</h2>
            <p>Add your content here.</p>
          </article>
        </div>
      </section>

      <section class="section alt tone-amber" data-track-section="blog_${SLUG}_cta">
        <div class="container resource-bar panel reveal">
          <div>
            <p class="kicker">Next step</p>
            <h2>Need tailored support for this topic?</h2>
            <p class="lead">Move from recommendations to a scoped execution plan.</p>
          </div>
          <div class="resource-actions">
            <a class="btn primary" href="booking.html">Book strategy call</a>
            <a class="btn secondary" href="security-assessment.html">Assessment accelerator</a>
            <a class="btn ghost" href="blog.html">Back to blog</a>
          </div>
        </div>
      </section>

      <section class="section tone-cyan" data-track-section="blog_related">
        <div class="container">
          <header class="section-head reveal"><h2>Related articles</h2><p>Continue exploring adjacent topics relevant to this article.</p></header>
          <div class="grid three" data-related-posts></div>
        </div>
      </section>
    </main>

    <footer class="site-footer"><div class="container footer-grid"><div><img class="footer-logo" src="assets/logos/6.png" alt="CodeVertex" /><p>Enterprise cybersecurity, penetration testing, and cyber resilience programs.</p></div><nav class="footer-links footer-columns" aria-label="Footer"><div class="footer-col"><p class="footer-group-title">Company</p><a href="index.html">Home</a><a href="about.html">About</a><a href="insights.html">Insights</a><a href="contact.html">Contact</a></div><div class="footer-col"><p class="footer-group-title">Content</p><a href="blog.html">Blog</a><a href="insights.html">Insights</a><a href="resource-center.html">Resources</a></div></nav><p class="copy">© 2026 CodeVertex Software Solutions. All rights reserved.</p></div></footer>
    <div class="cookie-banner" data-cookie-banner hidden><p>We use essential cookies for site operation and optional analytics cookies to improve experience.</p><div class="cookie-actions"><button class="btn secondary" type="button" data-cookie-action="essential">Essential only</button><button class="btn primary" type="button" data-cookie-action="all">Accept all</button></div></div>
    <script src="script.js"></script>
  </body>
</html>
HTML

echo "[blog-new] created draft: $DRAFT_FILE"
echo "[blog-new] created page:  $BLOG_FILE"
echo "[blog-new] next: scripts/blog-publish.sh --slug \"$SLUG\" --title \"$TITLE\" --excerpt \"One-sentence summary\" --category \"$CATEGORY\" --tags \"$TAGS\" --read-time \"$READ_TIME\" --date \"$PUBLISH_DATE\""
