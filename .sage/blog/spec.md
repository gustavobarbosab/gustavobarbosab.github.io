## Feature: Personal Blog (Markdown Articles)

### What it does
Adds a blog section to the personal website that renders author-written Markdown files as web pages: a listing page at `/blog` and an individual page per post at `/blog/[slug]`, statically generated at build time from files committed to the repo.

### Inputs
- Markdown files: `src/posts/*.md` — one file per article
- Frontmatter (required unless noted):
  - `title`: string — post title
  - `date`: string (ISO `YYYY-MM-DD`) — publish date, used for sort order
  - `slug`: string — unique URL segment, used for `/blog/[slug]` routing (source of truth, independent of filename)
  - `summary`: string — short description used on the list card and as the meta description
  - `draft`: boolean, optional, default `false` — excludes the post from the build/listing when `true`
  - `tags`: string array, optional — stored on the post, not yet used for filtering
  - `cover`: string, optional — path to a cover image, used on the list card and as `og:image`
- Markdown body: plain Markdown (headings, lists, links, images, bold/italic, blockquotes) plus fenced code blocks that render with syntax highlighting

### Outputs
- `/blog`: listing page — published posts (`draft` is `false`/absent) sorted by `date` descending, each card showing title, date, summary, and cover image when present
- `/blog/[slug]`: detail page — full rendered Markdown content; `<title>`, meta description, and Open Graph tags (`og:title`, `og:description`, `og:image` when `cover` is present) generated from frontmatter
- NavBar: new "Blog" entry linking to `/blog`, visible on all pages
- Unknown slug at `/blog/[slug]`: renders Next.js `not-found` page (404)

### Acceptance criteria
- Every `.md` file in `src/posts/` with `draft` absent or `false` appears as a card on `/blog`, ordered by `date` descending
- Every `.md` file with `draft: true` is excluded from `/blog` and its detail URL returns a 404 if visited directly
- `/blog/[slug]` renders the post's full Markdown body as HTML, with fenced code blocks syntax-highlighted
- `/blog/[slug]` sets page title from `title`, meta description from `summary`, and Open Graph tags (including `og:image` when `cover` is set) via `generateMetadata`
- NavBar renders a "Blog" link pointing to `/blog` on every page
- All blog pages are generated at build time (SSG via `generateStaticParams`) — no client-side fetch is required to render post content
- A post missing any required frontmatter field (`title`, `date`, `slug`, `summary`) fails the build with a descriptive error instead of rendering with blank/undefined values

### Do NOT
- Do not implement MDX or allow embedded React components inside post bodies — Markdown only
- Do not implement tag-based filtering UI — `tags` is stored but not surfaced for filtering in this iteration
- Do not implement pagination — all published posts render in a single list
- Do not fetch or render post content client-side or per-request — content is statically generated from files committed to the repo
