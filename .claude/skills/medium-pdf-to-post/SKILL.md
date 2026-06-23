---
name: medium-pdf-to-post
description: Converts a PDF printed/exported from a Medium article into a Markdown post matching this repo's blog frontmatter schema (src/posts/*.md). Use whenever the user provides a PDF of a Medium article and asks to import it, convert it, or turn it into a blog post.
---

# Medium PDF → Blog Post

Converts a PDF that was printed/exported from a Medium article page into a Markdown file ready to drop into `src/posts/`, matching the frontmatter schema defined in `.sage/blog/spec.md`.

## Input

The user provides a path to a PDF (printed from Medium via the browser's "Print → Save as PDF" or Medium's own export). Ask for the path if not given.

## Required frontmatter schema (do not deviate)

```yaml
title: string                # required
date: "YYYY-MM-DD"           # required, ISO format
slug: kebab-case-string      # required, lowercase letters/numbers/hyphens only, must be unique in src/posts/
summary: string              # required, 1-2 sentences
draft: true                  # always default to true — never auto-publish
tags: ["tag1", "tag2"]       # optional, omit if none are obvious
cover: "/blog/<slug>/cover.png"  # optional, only if a usable cover image is found
```

## Steps

1. **Read the PDF.** Use the Read tool directly on the PDF path — it can extract text content from PDFs. For long articles, read in page-range chunks.

2. **Strip Medium chrome.** Medium print exports are full of non-article noise. Remove:
   - Top banner: publication/author byline line, "X min read", "·", clap count, response count, "Listen", "Share" controls
   - "Member-only story" / paywall banners
   - Footer rows repeated on every page: Medium logo, navigation links, "Sign up" / "Sign in", "Help", "Status", "About", "Careers", follow/follower counts
   - Embedded "Written by <author>" bio blocks and related-story recommendations at the end
   - Footnote-style reference URLs back to medium.com tracking links (`?source=...`) — keep the link text/destination but strip tracking query params

3. **Identify structure** from the cleaned text and convert to plain Markdown:
   - The large title text at the top → becomes the `title` frontmatter value, not a `#` heading in the body (the page renders the title separately)
   - Subheadings → `##` / `###`
   - Bulleted/numbered lists → `-` / `1.`
   - Blockquotes (visually indented/italic Medium quote blocks) → `>`
   - Bold/italic emphasis → `**bold**` / `*italic*`
   - Monospace-styled text blocks (Medium code blocks) → fenced ` ``` ` blocks. Only use a language tag if you're confident of the language from context (imports, syntax); otherwise leave the fence with no language rather than guessing wrong
   - Inline code → backticks

4. **Images.** PDF text extraction does not recover embedded images as files. For each image position in the article:
   - Insert `![<best-guess alt text or caption>](/blog/<slug>/PLACEHOLDER-<n>.png)` at the correct position in the body
   - Do not fabricate a `cover` frontmatter field unless the user supplies an actual cover image separately
   - At the end of the run, list every placeholder you inserted so the user knows which images to manually export from Medium and drop into `public/blog/<slug>/`

5. **Derive frontmatter:**
   - `title`: the article's title, verbatim
   - `slug`: kebab-case the title — lowercase, strip punctuation, spaces to hyphens (e.g. "How I Built X!" → `how-i-built-x`). Check `src/posts/` for an existing file with that slug and append `-2` etc. if it collides
   - `date`: use the publish date shown in the Medium export if present (format to `YYYY-MM-DD`); if absent, ask the user rather than guessing
   - `summary`: write a 1-2 sentence summary from the article's opening/subtitle — flag it as AI-written so the user can edit
   - `draft`: always `true`
   - `tags`: only include if Medium shows explicit tags on the page; otherwise omit the field entirely (don't invent tags)

6. **Write the file** to `src/posts/<slug>.md` using the Write tool.

7. **Report back:**
   - The generated file path
   - The list of image placeholders that need real assets
   - Any fields you couldn't confidently determine (date, tags, summary quality) that the user should review
   - Remind the user the post stays out of `/blog` until they flip `draft` to `false`

## Rules

- Never set `draft: false` automatically
- Never invent a `cover` image path that doesn't correspond to a real file the user will provide
- Never guess a code block's language if uncertain — an unlabeled fence is safer than a wrong label
- Don't fix article content/grammar beyond what's needed to clean up PDF extraction artifacts (e.g. mid-word line-break hyphens, repeated page headers/footers) — preserve the author's original text
