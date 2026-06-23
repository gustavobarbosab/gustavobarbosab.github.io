import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { getAllPublishedPosts } from "@/lib/posts";

const navBar = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
];

export const metadata: Metadata = {
    title: "Blog | Gustavo Barbosa",
    description: "Articles by Gustavo Barbosa.",
};

export default function BlogPage() {
    const posts = getAllPublishedPosts();

    return (
        <div className="dark:bg-dark bg-light min-h-screen">
            <div className="overflow-hidden bg-gray-900">
                <NavBar items={navBar} className="w-full max-w-7xl px-4 mx-auto" />
            </div>

            <div className="w-full max-w-4xl px-4 mx-auto py-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-10">Blog</h1>

                {posts.length === 0 ? (
                    <p className="text-gray-700 dark:text-gray-300">No posts published yet. Check back soon!</p>
                ) : (
                    <div className="flex flex-col gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
