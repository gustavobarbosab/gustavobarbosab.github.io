import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown";

const POSTS_DIRECTORY = path.join(process.cwd(), "src/posts");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface Post {
    title: string;
    date: string;
    slug: string;
    summary: string;
    draft: boolean;
    tags: string[];
    cover?: string;
    contentHtml: string;
}

function fail(fileName: string, message: string): never {
    throw new Error(`Invalid post frontmatter in "${fileName}": ${message}`);
}

function parsePost(fileName: string): Post {
    const filePath = path.join(POSTS_DIRECTORY, fileName);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    if (typeof data.title !== "string" || data.title.trim().length === 0) {
        fail(fileName, '"title" is required and must be a non-empty string');
    }

    if (typeof data.date !== "string" || !DATE_PATTERN.test(data.date) || Number.isNaN(Date.parse(data.date))) {
        fail(fileName, '"date" is required and must be an ISO date string (YYYY-MM-DD)');
    }

    if (typeof data.slug !== "string" || data.slug.trim().length === 0) {
        fail(fileName, '"slug" is required and must be a non-empty string');
    }

    if (!SLUG_PATTERN.test(data.slug)) {
        fail(fileName, `"slug" must contain only lowercase letters, numbers, and hyphens (got "${data.slug}")`);
    }

    if (typeof data.summary !== "string" || data.summary.trim().length === 0) {
        fail(fileName, '"summary" is required and must be a non-empty string');
    }

    if (data.draft !== undefined && typeof data.draft !== "boolean") {
        fail(fileName, `"draft" must be a boolean (got ${typeof data.draft})`);
    }

    if (data.tags !== undefined && (!Array.isArray(data.tags) || !data.tags.every((tag: unknown) => typeof tag === "string"))) {
        fail(fileName, '"tags" must be an array of strings');
    }

    if (data.cover !== undefined) {
        const isLocalPath = typeof data.cover === "string" && data.cover.startsWith("/");
        const isExternalUrl = typeof data.cover === "string" && /^https?:\/\//.test(data.cover);
        if (!isLocalPath && !isExternalUrl) {
            fail(fileName, `"cover" must be a local path starting with "/" (e.g. "/blog/${data.slug}/cover.png") or an absolute http(s) URL`);
        }
    }

    return {
        title: data.title,
        date: data.date,
        slug: data.slug,
        summary: data.summary,
        draft: data.draft ?? false,
        tags: data.tags ?? [],
        cover: data.cover,
        contentHtml: markdownToHtml(content),
    };
}

let cachedPosts: Post[] | null = null;

function loadAllPosts(): Post[] {
    if (cachedPosts) {
        return cachedPosts;
    }

    const fileNames = fs.readdirSync(POSTS_DIRECTORY).filter((name) => name.endsWith(".md"));
    const posts = fileNames.map(parsePost);

    const slugToFile = new Map<string, string>();
    posts.forEach((post, index) => {
        const fileName = fileNames[index];
        const existingFile = slugToFile.get(post.slug);
        if (existingFile) {
            throw new Error(`Duplicate slug "${post.slug}" found in "${existingFile}" and "${fileName}". Slugs must be unique across all posts.`);
        }
        slugToFile.set(post.slug, fileName);
    });

    cachedPosts = posts;
    return posts;
}

export function getAllPublishedPosts(): Post[] {
    return loadAllPosts()
        .filter((post) => !post.draft)
        .sort((a, b) => {
            if (a.date !== b.date) {
                return a.date < b.date ? 1 : -1;
            }
            return a.title.localeCompare(b.title);
        });
}

export function getPostBySlug(slug: string): Post | undefined {
    return loadAllPosts().find((post) => post.slug === slug);
}
