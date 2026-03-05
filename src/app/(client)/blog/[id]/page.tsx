"use client";

import BlogList from "@/components/client/blog/blog-list";
import LoadingScreen from "@/components/common/loading/loading-screen";
import SectionTitle from "@/components/common/title/section-title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBlogDetail } from "@/queries/useBlogQuery";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useParams } from "next/navigation";

export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: blogData, isLoading } = useBlogDetail(id);
    const blog = blogData?.data;

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    if (!blog) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center text-muted-foreground">
                Không tìm thấy bài viết
            </div>
        );
    }

    return (
        <article className="max-w-7xl mx-auto space-y-8 my-30 py-10 px-10 ">

            {/* Title */}
            <h1 className="text-4xl font-bold leading-tight">
                {blog.title}
            </h1>

            {/* Author + Meta */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-6">

                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-neutral-800">
                        <AvatarImage
                            src={blog.author?.avatar}
                            alt={blog.author?.username}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-neutral-800 text-[10px] text-neutral-400">
                            {blog.author?.username?.substring(0, 2).toUpperCase() || "NA"}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className="font-medium">
                            {blog.author?.username || "Ẩn danh"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {blog.createdAt
                                ? format(new Date(blog.createdAt), "dd MMM yyyy")
                                : "Không rõ ngày"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Eye size={16} />
                    {blog.views ?? 0} lượt xem
                </div>
            </div>

            {/* Thumbnail */}
            {blog.thumbnail && (
                <div className="w-full overflow-hidden rounded-xl">
                    <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-auto object-cover"
                    />
                </div>
            )}

            {/* Content */}
            {blog.content && (
                <div
                    className="prose prose-lg prose-neutral dark:prose-invert max-w-none leading-loose"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            )}
            {/* Slug */}
            <div className="pt-6 border-t text-sm text-muted-foreground">
                Slug: <span className="font-mono">{blog.slug}</span>
            </div>

            <SectionTitle title="Bài viết khác" />
            <BlogList />

        </article>


    );
}