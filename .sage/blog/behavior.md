## Open Questions
- [x] Duplicate `slug` across two files: should the build fail with an error, or should one post silently win?
    - Resolved: build fails with an error.
- [x] Images referenced inside the Markdown body (not the `cover` field) — where do they live (e.g. `public/blog/<slug>/...`) and what path convention should authors use?
    - Resolved: `public/blog/<slug>/...`.
- [x] No `cover` set on a post: does the list card render without an image (text-only), or show a default placeholder image?
    - Resolved: no placeholder — card renders without a cover image when `cover` is absent.
- [x] `/blog` with zero published posts: what should render (empty state message vs. blank list)?
    - Resolved: empty state message.
- [x] Display format for `date` on the page/card (e.g. "2026-06-23" vs. "June 23, 2026") — any locale preference?
    - Resolved: "June 23, 2026" format (en-US long form).
- [x] Two posts with the same `date`: what's the tie-breaking sort order (e.g. fall back to `title`, filename, or declaration order)?
    - Resolved: fall back to `title` (alphabetical).
- [x] `slug` format: is any validation enforced (lowercase, URL-safe characters, no spaces), or is any non-empty string accepted as-is?
    - Resolved: enforced — must be a valid URL segment (URL-safe characters only); invalid slugs fail the build.
- [x] Malformed frontmatter (invalid YAML, wrong type e.g. `date` not a string, `draft` not a boolean): does this fail the build like a missing required field, or is it treated differently?
    - Resolved: fails the build, same as a missing required field. A post template should be provided to authors to reduce this risk.
- [x] Fenced code block with no language tag: does it render as plain unhighlighted text, or is a default language assumed?
    - Resolved: renders as plain, unhighlighted text.
- [x] `cover` field: must it be a local path under `public/`, or is an absolute external URL also valid for `og:image`?
    - Resolved (updated): both — a local path under `public/` (starting with `/`) or an absolute `http(s)` URL are valid.

## Test Cases

### Happy path

**Scenario: Published post appears on listing page**
Short → Post with `draft` absent renders as a card on `/blog`.
Full:
- Given a Markdown file in `src/posts/` with valid frontmatter and `draft` absent
- When the site is built and `/blog` is rendered
- Then the post appears as a card showing title, date, summary, and cover (if present)

**Scenario: Posts sorted by date descending**
Short → Multiple published posts are ordered newest first by `date`.
Full:
- Given two or more published posts with different `date` values
- When `/blog` is rendered
- Then cards are ordered by `date` descending

**Scenario: Post detail page renders full content**
Short → Visiting `/blog/[slug]` renders the post's full Markdown body as HTML.
Full:
- Given a published post with slug `hello-world`
- When a user navigates to `/blog/hello-world`
- Then the page renders the full Markdown body as HTML
- And fenced code blocks with a language tag render with syntax highlighting

**Scenario: Metadata generated from frontmatter**
Short → Detail page sets title/meta description/OG tags from frontmatter.
Full:
- Given a published post with `title`, `summary`, and `cover` set
- When `/blog/[slug]` is requested
- Then the page `<title>` equals the post's `title`
- And meta description equals the post's `summary`
- And `og:image` is set to the post's `cover`

**Scenario: NavBar shows Blog link**
Short → "Blog" nav link appears on every page.
Full:
- Given any page of the site
- When the page is rendered
- Then the NavBar includes a "Blog" link pointing to `/blog`

**Scenario: Pages statically generated at build time**
Short → Blog pages render without client-side fetch.
Full:
- Given the site has been built
- When `/blog` or `/blog/[slug]` is requested
- Then the returned HTML includes full post content with no client-side fetch required to render it

### Validation

**Scenario: Missing required frontmatter field fails build**
Short → Post missing `title`/`date`/`slug`/`summary` fails the build with a descriptive error.
Full:
- Given a Markdown file missing one of `title`, `date`, `slug`, or `summary`
- When the site is built
- Then the build fails with a descriptive error naming the missing field and file

**Scenario: Malformed frontmatter value fails build**
Short → Wrong-type frontmatter (e.g. `date` not a string, `draft` not a boolean) fails the build.
Full:
- Given a post where a frontmatter field has the wrong type (e.g. `draft: "yes"`)
- When the site is built
- Then the build fails with a descriptive error identifying the offending field and file

**Scenario: Invalid slug format fails build**
Short → A `slug` containing invalid URL characters fails the build.
Full:
- Given a post with `slug` containing spaces or non-URL-safe characters (e.g. `"Hello World!"`)
- When the site is built
- Then the build fails with a descriptive error indicating the invalid slug

**Scenario: Duplicate slug fails build**
Short → Two posts sharing the same `slug` fail the build.
Full:
- Given two Markdown files declaring the same `slug` value
- When the site is built
- Then the build fails with a descriptive error naming the duplicate slug and the conflicting files

**Scenario: Cover with an unsupported value fails build**
Short → A `cover` that is neither a local path nor an absolute `http(s)` URL fails the build.
Full:
- Given a post with `cover` set to a value that doesn't start with `/` and isn't a valid `http(s)` URL (e.g. `"cover.png"`)
- When the site is built
- Then the build fails with a descriptive error indicating the invalid `cover` value

### Edge cases

**Scenario: Draft post excluded from listing**
Short → Post with `draft: true` does not appear on `/blog`.
Full:
- Given a Markdown file with `draft: true`
- When `/blog` is rendered
- Then the post does not appear in the list

**Scenario: Draft post detail URL returns 404**
Short → Directly visiting a draft post's slug returns 404.
Full:
- Given a Markdown file with `draft: true` and `slug: "secret-post"`
- When a user navigates to `/blog/secret-post`
- Then the Next.js `not-found` page (404) is rendered

**Scenario: Unknown slug returns 404**
Short → Visiting a slug with no matching post returns 404.
Full:
- Given no post exists with `slug: "does-not-exist"`
- When a user navigates to `/blog/does-not-exist`
- Then the Next.js `not-found` page (404) is rendered

**Scenario: No published posts shows empty state**
Short → `/blog` with zero published posts shows an empty state message.
Full:
- Given no Markdown files have `draft` absent/`false`
- When `/blog` is rendered
- Then an empty state message is shown instead of a blank list

**Scenario: Post without cover renders without image**
Short → Card and detail page omit the image when `cover` is absent.
Full:
- Given a published post with no `cover` field
- When `/blog` and `/blog/[slug]` are rendered
- Then the card and page render without a cover image (no placeholder)
- And `og:image` is omitted from the page's meta tags

**Scenario: Post with an external cover URL renders correctly**
Short → A `cover` set to an absolute `http(s)` URL renders on the card and as `og:image`.
Full:
- Given a published post with `cover` set to an absolute URL (e.g. `"https://example.com/cover.png"`)
- When `/blog` and `/blog/[slug]` are rendered
- Then the card and detail page render the cover image from that URL
- And `og:image` is set to that same URL

**Scenario: Tie-break sort by title on equal dates**
Short → Posts sharing the same `date` are ordered by `title`.
Full:
- Given two published posts with the same `date` value
- When `/blog` is rendered
- Then the posts are ordered alphabetically by `title`

**Scenario: Code block without language renders as plain text**
Short → Fenced code block with no language tag renders unhighlighted.
Full:
- Given a post body containing a fenced code block with no language specified
- When `/blog/[slug]` is rendered
- Then the code block renders as plain, unhighlighted text

**Scenario: Date displayed in long form**
Short → Dates render as "June 23, 2026" on cards and detail pages.
Full:
- Given a post with `date: "2026-06-23"`
- When the card or detail page is rendered
- Then the date displays as "June 23, 2026"

### Error handling

**Scenario: Build errors identify the offending file and field**
Short → All build-time validation failures report which file and field/value caused the failure.
Full:
- Given any frontmatter validation failure (missing field, wrong type, invalid slug, duplicate slug)
- When the build fails
- Then the error message names the offending file and field/value
- And the build process exits non-zero
