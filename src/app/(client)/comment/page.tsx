"use client";

import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MovieStatusEnum } from "@/constants/enum";
import { cn } from "@/lib/utils";
import { useCommentListByMovie, useCreateComment, useDeleteComment, useToggleLikeComment, useUpdateComment } from "@/queries/useCommentQuery";
import { useMovieDetail, useMovieList } from "@/queries/useMovieQuery";
import { useGetMe } from "@/queries/useUserQuery";
import { createCommentSchema } from "@/schemas/comment.schema";
import { handleError } from "@/utils/error";
import { Calendar, Clock, Edit2, Film, Loader2, MessageCircle, MoreVertical, Send, Star, ThumbsUp, Trash2, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CommentBanner from "./comment-banner";
import { ReplyDialog } from "./reply-comment-dialog";

export default function CommentPage() {
    // Lấy thông tin người dùng (để check quyền sửa/xóa)
    const { data: meRes } = useGetMe();
    const currentUser = meRes?.data;

    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [rating, setRating] = useState<number>(5);
    const [page, setPage] = useState(1);
    const [replyingComment, setReplyingComment] = useState<any | null>(null);

    // State cho việc chỉnh sửa
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

    // 1. Queries
    const { data: moviesRes, isLoading: isLoadingList } = useMovieList({ page: 1, limit: 10, status: MovieStatusEnum.NOW_SHOWING });
    const movies = moviesRes?.data || [];

    const { data: movieDetailRes } = useMovieDetail(selectedMovieId || undefined);
    const movieDetail = movieDetailRes?.data || null;

    const { data: commentRes, isLoading: isLoadingComments, refetch: refetchComments } = useCommentListByMovie(selectedMovieId || undefined, { page, limit: 10 });
    const comments = (commentRes as any)?.data || [];
    const pagination = (commentRes as any)?.pagination || null;

    // 2. Mutations
    const createCommentMutation = useCreateComment(selectedMovieId || "");
    const updateCommentMutation = useUpdateComment(selectedMovieId || "");
    const deleteCommentMutation = useDeleteComment(selectedMovieId || "");
    const toggleLikeMutation = useToggleLikeComment(selectedMovieId || "");

    const handleSelectMovie = (id: string) => {
        setSelectedMovieId(id);
        cancelEdit();
        setPage(1);
    };


    // Bật chế độ sửa
    const handleEditClick = (comment: any) => {
        setEditingCommentId(comment._id);
        setCommentContent(comment.content);
        setRating(comment.rating);
        // Cuộn xuống box comment
        document.getElementById("comment-box")?.scrollIntoView({ behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setCommentContent("");
        setRating(5);
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
            deleteCommentMutation.mutate(id, {
                onSuccess: () => {
                    toast.success("Đã xóa bình luận");
                    refetchComments();
                }
            });
        }
    };

    const handleToggleLike = (id: string) => {
        toggleLikeMutation.mutate(id, {
            onSuccess: () => {
                toast.success("Đã cập nhật thích bình luận");
                refetchComments()
            }
        });
    };

    const handleSubmitComment = () => {
        if (!commentContent.trim() || !selectedMovieId) return;

        // 1. Chuẩn bị dữ liệu cho Zod validation
        const payload = {
            movie: selectedMovieId,
            content: commentContent,
            rating: rating,
        };

        const validation = createCommentSchema.safeParse(payload);

        if (!validation.success) {
            toast.error(validation.error.issues[0].message);
            return;
        }

        if (editingCommentId) {
            updateCommentMutation.mutate(
                {
                    id: editingCommentId,
                    data: validation.data
                },
                {
                    onSuccess: () => {
                        toast.success("Cập nhật bình luận thành công!");
                        cancelEdit();
                    },
                    onError: (error: any) => {
                        handleError(error);
                    }
                }
            );
        } else {
            // 3. TRƯỜNG HỢP TẠO MỚI (CREATE)
            createCommentMutation.mutate(
                validation.data,
                {
                    onSuccess: () => {
                        setCommentContent("");
                        setRating(5);
                        toast.success("Đã đăng bình luận");
                        refetchComments();
                    },
                    onError: (error: any) => {
                        handleError(error);
                    }
                }
            );
        }
    };

    return (
        <>
        <div className="mt-15"></div>
            <CommentBanner />
            <div className="min-h-screen text-white pb-20">


                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-15 relative z-10">

                    {/* LEFT SIDEBAR: MOVIE GRID */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-[#111] p-5 rounded-3xl border border-white/5 shadow-2xl sticky top-24">
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <Film className="text-blue-500" size={20} />
                                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Đang chiếu</h2>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoadingList && <Loader2 className="animate-spin mx-auto text-blue-500" />}
                                {movies.map((movie) => (
                                    <div
                                        key={movie._id}
                                        onClick={() => handleSelectMovie(movie._id)}
                                        className={cn(
                                            "group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border-2",
                                            selectedMovieId === movie._id ? "border-blue-500 scale-[0.98]" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <img src={movie.poster} alt={movie.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                            <p className="text-xs font-bold truncate">{movie.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-9 space-y-10">
                        {!selectedMovieId ? (
                            <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                                <div className="p-6 bg-blue-500/10 rounded-full mb-4">
                                    <Film size={40} className="text-blue-500 animate-pulse" />
                                </div>
                                <p className="text-gray-500 font-medium">Chọn một bộ phim từ danh sách để bắt đầu thảo luận</p>
                            </div>
                        ) : movieDetail && (
                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                                {/* Movie Header Card */}
                                <div className="relative p-10 rounded-[40px] overflow-hidden border border-white/10 bg-[#111]">
                                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                                        <img src={movieDetail.poster} className="w-full h-full object-cover blur-3xl" alt="" />
                                    </div>

                                    <div className="relative z-10 ">
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className="px-4 py-1 bg-blue-600 text-[10px] font-bold rounded-full tracking-widest">{movieDetail.agePermission}</span>
                                            {movieDetail.categories.map((c: any) => (
                                                <span key={c._id} className="px-4 py-1 bg-white/5 border border-white/10 text-[10px] font-medium rounded-full text-gray-300">
                                                    {c.name}
                                                </span>
                                            ))}
                                        </div>

                                        <h2 className="text-5xl font-black mb-6 leading-tight tracking-tighter uppercase">{movieDetail.name}</h2>

                                        <div className="flex flex-wrap gap-8 text-sm text-gray-400 mb-8">
                                            <div className="flex items-center gap-2"><Clock size={16} className="text-blue-500" /> {movieDetail.duration} phút</div>
                                            <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> {new Date(movieDetail.releaseDate).toLocaleDateString("vi-VN")}</div>
                                            <div className="flex items-center gap-2"><User size={16} className="text-blue-500" /> {movieDetail.actors?.slice(0, 3).map((a: any) => a.name).join(", ")}</div>
                                        </div>

                                        <p className="text-gray-400 leading-relaxed max-w-3xl text-lg font-light italic">
                                            "{movieDetail.description}"
                                        </p>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="mt-12 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold flex items-center gap-3">
                                            Đánh giá từ khán giả
                                            <span className="text-sm font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                                                {pagination?.totalItems || 0}
                                            </span>
                                        </h3>
                                    </div>

                                    {/* List Comments */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {isLoadingComments ? (
                                            <Loader2 className="animate-spin text-blue-500" />
                                        ) : comments.map((comment: any) => (
                                            <div key={comment._id} className="group relative bg-[#161616] border border-white/5 p-6 rounded-[32px] transition-all duration-300 overflow-hidden">

                                                {/* 1. NỀN BANNER PHÍA SAU (Background Image Layer) */}
                                                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                                                    <img
                                                        src={movieDetail?.banner || movieDetail?.poster}
                                                        alt=""
                                                        // Tăng opacity lên 30% và giảm blur để ảnh rõ hơn
                                                        className="w-full h-full object-cover opacity-20 blur-none transition-transform duration-700 group-hover:scale-105 group-hover:opacity-40"
                                                    />
                                                    {/* Lớp gradient overlay mỏng hơn để không che mất ảnh */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#161616]/60 via-black/20 to-[#161616]/70" />
                                                </div>

                                                {/* 2. NỘI DUNG (Content Layer) - Cần đặt z-10 để nổi lên trên nền */}
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={comment.user.avatar}
                                                                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10 shadow-lg"
                                                                alt={comment.user.username}
                                                            />
                                                            <div>
                                                                <h4 className="font-bold text-blue-400 text-sm drop-shadow-md">
                                                                    {comment.user.username}
                                                                </h4>
                                                                <div className="flex gap-0.5 mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            size={10}
                                                                            className={i < comment.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-700"}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {currentUser?._id === comment.user._id && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-full outline-none backdrop-blur-md">
                                                                    <MoreVertical size={16} />
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-[#111]/95 border-white/10 text-white rounded-xl backdrop-blur-xl">
                                                                    <DropdownMenuItem onClick={() => handleEditClick(comment)} className="gap-2 cursor-pointer focus:bg-blue-600 focus:text-white">
                                                                        <Edit2 size={14} /> Sửa
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => deleteCommentMutation.mutate(comment._id)} className="gap-2 text-red-500 cursor-pointer focus:bg-red-600 focus:text-white">
                                                                        <Trash2 size={14} /> Xóa
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>

                                                    <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-4 font-medium drop-shadow-sm">
                                                        "{comment.content}"
                                                    </p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                        <div className="flex gap-4">
                                                            <button
                                                                onClick={() => handleToggleLike(comment._id)}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 text-xs transition-all hover:scale-110",
                                                                    comment.likes.includes(currentUser?._id) ? "text-blue-400" : "text-gray-400 hover:text-white"
                                                                )}
                                                            >
                                                                <ThumbsUp size={14} className={comment.likes.includes(currentUser?._id) ? "fill-current" : ""} />
                                                                <span className="font-bold">{comment.likes.length}</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setReplyingComment(comment)}
                                                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-all hover:scale-110"
                                                            >
                                                                <MessageCircle size={14} />
                                                                <span className="font-bold">{comment.replyCount}</span>
                                                            </button>
                                                        </div>
                                                        <span className="text-[9px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-tighter font-black border border-white/5">
                                                            Reviewer
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination && pagination.totalPages > 1 && (
                                        <div className="flex justify-center pt-6">
                                            <DataPagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
                                        </div>
                                    )}

                                    {/* Input Box */}
                                    <div id="comment-box" className={cn(
                                        "mt-12 p-8 rounded-[35px] border-2 transition-all duration-500 bg-[#111]",
                                        editingCommentId ? "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "border-white/5"
                                    )}>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-8 bg-blue-500 rounded-full" />
                                                <h4 className="text-xl font-bold">{editingCommentId ? "Chỉnh sửa đánh giá" : "Gửi đánh giá của bạn"}</h4>
                                            </div>
                                            {editingCommentId && (
                                                <button onClick={cancelEdit} className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm">
                                                    <X size={16} /> Hủy bỏ
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex gap-2 mb-6">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={32}
                                                    onClick={() => setRating(star)}
                                                    className={cn(
                                                        "cursor-pointer transition-all duration-300 hover:scale-110",
                                                        star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-800"
                                                    )}
                                                />
                                            ))}
                                        </div>

                                        <div className="relative group">
                                            <textarea
                                                value={commentContent}
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                placeholder="Cảm nghĩ của bạn về bộ phim này..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[120px] focus:outline-none focus:border-blue-500/50 transition-all resize-none text-lg"
                                            />
                                            <button
                                                onClick={handleSubmitComment}
                                                disabled={createCommentMutation.isPending}
                                                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {createCommentMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Đăng bài</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <ReplyDialog
                    parentComment={replyingComment}
                    onClose={() => setReplyingComment(null)}
                    currentUser={currentUser}
                    movieId={selectedMovieId || ""}
                />
            </div>
        </>

    );
}