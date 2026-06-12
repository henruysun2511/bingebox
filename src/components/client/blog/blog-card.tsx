"use client";
import { Blog } from "@/types/object";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface BlogCardProps {
    blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
    const { _id, title, thumbnail, createdAt } = blog;

    return (
        <div data-theme-fixed className="w-[280px] group cursor-pointer bg-comment rounded-xl overflow-hidden border border-white/5 hover:border-blue/50 transition-all duration-300">
            {/* Thumbnail */}
            <div className="relative h-[180px] w-full overflow-hidden">
                <img
                    src={thumbnail || "/no-image.png"}
                    alt={title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Created At */}
                <div className="flex items-center gap-2 text-neutral-400 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                        {createdAt 
                            ? format(new Date(createdAt), "dd MMMM, yyyy", { locale: vi }) 
                            : "N/A"}
                    </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${_id}`}>
                    <h3 className="text-white font-semibold text-md line-clamp-2 hover:text-blue transition duration-200 h-12">
                        {title || "Không có tiêu đề"}
                    </h3>
                </Link>

                {/* Read More Link */}
                <Link 
                    href={`/blog/${_id}`}
                    className="text-blue text-xs font-medium inline-block hover:underline"
                >
                    Đọc thêm →
                </Link>
            </div>
        </div>
    );
}