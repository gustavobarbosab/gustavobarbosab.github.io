import { marked, type Tokens } from "marked";
import hljs from "highlight.js";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }: Tokens.Code): string => {
    const language = lang?.trim().split(/\s+/)[0];

    if (language && hljs.getLanguage(language)) {
        const highlighted = hljs.highlight(text, { language }).value;
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>\n`;
    }

    return `<pre><code>${escapeHtml(text)}</code></pre>\n`;
};

marked.use({ renderer });

export function markdownToHtml(markdown: string): string {
    return marked.parse(markdown, { async: false }) as string;
}
