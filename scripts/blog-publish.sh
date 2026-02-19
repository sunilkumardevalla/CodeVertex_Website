#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

usage() {
  cat <<'HELP'
Usage:
  scripts/blog-publish.sh --slug "post-slug" --title "Post title" --excerpt "One sentence" --category "Category" --tags "Tag 1,Tag 2" [--read-time "7 min read"] [--date YYYY-MM-DD] [--url blog-post-slug.html]

Publishes by updating:
  - assets/data/blog-posts.json
  - assets/data/insights-library.json
  - sitemap.xml
  - _redirects (friendly /blog/<slug> route)
HELP
}

require_value() {
  local label="$1"
  local value="${2:-}"
  if [[ -z "$value" ]]; then
    echo "[blog-publish] missing required value: $label" >&2
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

month_year_from_date() {
  local d="$1"
  date -j -f "%Y-%m-%d" "$d" "+%b %Y" 2>/dev/null || date "+%b %Y"
}

SLUG=""
TITLE=""
EXCERPT=""
CATEGORY=""
TAGS=""
READ_TIME="7 min read"
PUBLISH_DATE="$(date +%F)"
URL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --slug) SLUG="${2:-}"; shift 2 ;;
    --title) TITLE="${2:-}"; shift 2 ;;
    --excerpt) EXCERPT="${2:-}"; shift 2 ;;
    --category) CATEGORY="${2:-}"; shift 2 ;;
    --tags) TAGS="${2:-}"; shift 2 ;;
    --read-time) READ_TIME="${2:-}"; shift 2 ;;
    --date) PUBLISH_DATE="${2:-}"; shift 2 ;;
    --url) URL="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "[blog-publish] unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

require_value "--slug" "$SLUG"
require_value "--title" "$TITLE"
require_value "--excerpt" "$EXCERPT"
require_value "--category" "$CATEGORY"
require_value "--tags" "$TAGS"

SLUG="$(slugify "$SLUG")"
if [[ -z "$SLUG" ]]; then
  echo "[blog-publish] invalid slug" >&2
  exit 1
fi

if [[ -z "$URL" ]]; then
  URL="blog-${SLUG}.html"
fi

if [[ ! -f "$URL" ]]; then
  echo "[blog-publish] blog page not found: $URL" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "[blog-publish] jq is required" >&2
  exit 1
fi

INSIGHT_DATE="$(month_year_from_date "$PUBLISH_DATE")"
TODAY="$(date +%F)"

BLOG_JSON="assets/data/blog-posts.json"
INSIGHTS_JSON="assets/data/insights-library.json"

tmp_blog="$(mktemp)"
jq \
  --arg today "$TODAY" \
  --arg slug "$SLUG" \
  --arg title "$TITLE" \
  --arg excerpt "$EXCERPT" \
  --arg url "$URL" \
  --arg category "$CATEGORY" \
  --arg tags "$TAGS" \
  --arg read_time "$READ_TIME" \
  --arg date "$PUBLISH_DATE" \
  '
  .updated_at = $today
  | .posts = (
      (.posts // [])
      | map(select(.slug != $slug))
      + [{
          slug: $slug,
          title: $title,
          excerpt: $excerpt,
          url: $url,
          category: $category,
          tags: ($tags | split(",") | map(gsub("^\\s+|\\s+$"; "")) | map(select(length > 0))),
          read_time: $read_time,
          date: $date
        }]
      | sort_by(.date)
      | reverse
    )
  ' "$BLOG_JSON" > "$tmp_blog"
mv "$tmp_blog" "$BLOG_JSON"

tmp_insights="$(mktemp)"
jq \
  --arg today "$TODAY" \
  --arg idate "$INSIGHT_DATE" \
  --arg read_time "$READ_TIME" \
  --arg title "$TITLE" \
  --arg summary "$EXCERPT" \
  --arg url "$URL" \
  '
  .updated_at = $today
  | .items = (
      [{
        date: $idate,
        read_time: $read_time,
        title: $title,
        summary: $summary,
        url: $url,
        cta: "Read article"
      }]
      + ((.items // []) | map(select(.url != $url)))
    )
  ' "$INSIGHTS_JSON" > "$tmp_insights"
mv "$tmp_insights" "$INSIGHTS_JSON"

SITEMAP_LOC="https://codevertex.io/$URL"
if ! rg -Fq "$SITEMAP_LOC" sitemap.xml; then
  perl -0pi -e "s#</urlset>#  <url><loc>$SITEMAP_LOC</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>#" sitemap.xml
fi

BLOG_ROUTE="/blog/$SLUG /$URL 301"
if ! rg -Fxq "$BLOG_ROUTE" _redirects; then
  tmp_redirects="$(mktemp)"
  awk -v new_line="$BLOG_ROUTE" '
    BEGIN { added=0 }
    {
      if (!added && $0 ~ /^# API function routes/) {
        print new_line
        print ""
        added=1
      }
      print $0
    }
    END {
      if (!added) print new_line
    }
  ' _redirects > "$tmp_redirects"
  mv "$tmp_redirects" _redirects
fi

echo "[blog-publish] published: $TITLE"
echo "[blog-publish] url: $URL"
echo "[blog-publish] route: /blog/$SLUG"
echo "[blog-publish] updated: $BLOG_JSON, $INSIGHTS_JSON, sitemap.xml, _redirects"
