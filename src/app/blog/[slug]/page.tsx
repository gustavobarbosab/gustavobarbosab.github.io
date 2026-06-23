import "highlight.js/styles/github-dark.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { formatPostDate } from "@/lib/formatDate";
import { getAllPublishedPosts, getPostBySlug } from "@/lib/posts";

const navBar = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
];

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return getAllPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post || post.draft) {
        return {};
    }

    return {
        title: `${post.title} | Gustavo Barbosa`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            ...(post.cover ? { images: [post.cover] } : {}),
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post || post.draft) {
        notFound();
    }

    return (
        <div className="dark:bg-dark bg-light min-h-screen">
            <div className="overflow-hidden bg-gray-900">
                <NavBar items={navBar} className="w-full max-w-7xl px-4 mx-auto" />
            </div>

            <article className="w-full max-w-3xl px-4 mx-auto py-10">
                <Link
                    href="/blog"
                    className="inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-primary mb-6"
                >
                    ← Back to posts
                </Link>

                {post.cover && (
                    <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden mb-8">
                        <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400">{formatPostDate(post.date)}</p>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-1 mb-8">{post.title}</h1>

                <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
            </article>

            <Footer />
        </div>
    );
}
