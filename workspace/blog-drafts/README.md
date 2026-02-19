# Blog Draft Workspace

Create and stage all new posts here before publishing to the live site.

## Where blogs are visible on the website
- Main blog hub: `/blog` (redirects to `/blog.html`)
- Insights page: `/insights.html` (new blogs also appear here after publish)

## Fast publish workflow
1. Create draft + HTML scaffold:
   - `scripts/blog-new.sh --title "Your Post Title" --category "Cloud Security" --tags "IAM,Identity,Hardening" --read-time "8 min read"`
2. Write your final content in the generated files:
   - Markdown draft in `workspace/blog-drafts/`
   - Website page `blog-<slug>.html`
3. Publish into live feeds and SEO files:
   - `scripts/blog-publish.sh --slug "your-post-title" --title "Your Post Title" --excerpt "One-sentence summary." --category "Cloud Security" --tags "IAM,Identity,Hardening" --read-time "8 min read" --date "2026-02-19"`

## What publish updates automatically
- `assets/data/blog-posts.json`
- `assets/data/insights-library.json`
- `sitemap.xml`
- `_redirects` (`/blog/<slug>` friendly URL)

## Media guidance for your own content
- Images/infographics: store in `assets/images/blog/`
- Video clips: store in `assets/videos/blog/`
- Keep assets owned by you only (no third-party embeds)
