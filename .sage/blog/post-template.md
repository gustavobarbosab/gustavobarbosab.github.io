---
title: "Post Title Here"
date: "2026-01-01"
slug: "post-title-here"
summary: "One or two sentences shown on the /blog list card and used as the meta description."
draft: true
tags: ["optional", "tags"]
cover: "/blog/post-title-here/cover.png"
---

Write the post body here using plain Markdown.

Notes for authors:
- `slug` must be lowercase letters, numbers, and hyphens only — it controls the `/blog/<slug>` URL and must be unique across all posts.
- `date` must be `YYYY-MM-DD`.
- `cover` is optional. If set, it must be either a local path under `public/` (e.g. `/blog/<slug>/cover.png` mapped to `public/blog/<slug>/cover.png`) or an absolute `http(s)` URL.
- Body images also live under `public/blog/<slug>/...` and are referenced the same way, e.g. `![alt text](/blog/<slug>/diagram.png)`.
- Set `draft: false` (or remove the field) when the post is ready to publish.
- Copy this file into `src/posts/<your-slug>.md` and remove this notes section.
