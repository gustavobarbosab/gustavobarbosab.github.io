import Image from "next/image";
import Link from "next/link";
import { formatPostDate } from "@/lib/formatDate";
import type { Post } from "@/lib/posts";

interface BlogCardProps {
    post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="block rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary transition-colors duration-200"
        >
            {post.cover && (
                <div className="relative w-full h-48">
                    <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatPostDate(post.date)}</p>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{post.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{post.summary}</p>
            </div>
        </Link>
    );
}
