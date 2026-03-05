"use client";

import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  useCommentReplies,
  useCreateComment,
  useDeleteComment,
  useToggleLikeComment,
  useUpdateComment
} from "@/queries/useCommentQuery";
import { createCommentSchema } from "@/schemas/comment.schema";
import { Edit2, Loader2, MessageCircle, MoreVertical, Send, ThumbsUp, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReplyDialogProps {
  parentComment: any | null;
  onClose: () => void;
  currentUser: any;
  movieId: string;
}

export function ReplyDialog({ parentComment, onClose, currentUser, movieId }: ReplyDialogProps) {
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // 1. Lấy danh sách replies từ Hook chuyên biệt
  const {
    data: repliesRes,
    isLoading: isLoadingReplies,
    refetch: refetchReplies
  } = useCommentReplies(parentComment?._id, { page: 1, limit: 50 });

  const replies = (repliesRes as any)?.data || [];
  console.log(replies)

  // 2. Mutations
  const createMutation = useCreateComment(movieId);
  const updateMutation = useUpdateComment(movieId);
  const deleteMutation = useDeleteComment(movieId);
  const toggleLikeMutation = useToggleLikeComment(movieId);

  const handleEdit = (reply: any) => {
    setEditingId(reply._id);
    setContent(reply.content);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Đã xóa phản hồi");
        setOpenDeleteDialog(false);
        setDeleteId(null);
        refetchReplies();
      },
      onError: (error: any) => {
        toast.error("Xóa phản hồi thất bại");
      }
    });
  };


  const cancelEdit = () => {
    setEditingId(null);
    setContent("");
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    const payload = {
      movie: movieId,
      content: content,
      rating: 5,
      parent: parentComment._id,
    };

    const validation = createCommentSchema.safeParse(payload);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: validation.data }, {
        onSuccess: () => {
          toast.success("Đã cập nhật phản hồi");
          cancelEdit();
          refetchReplies(); // Refresh danh sách reply
        }
      });
    } else {
      createMutation.mutate(validation.data, {
        onSuccess: () => {
          toast.success("Đã gửi phản hồi");
          setContent("");
          refetchReplies(); // Refresh danh sách reply
        }
      });
    }
  };

  return (
    <>
      <Dialog open={!!parentComment} onOpenChange={onClose}>
        <DialogContent className="!max-w-4xl bg-[#111] text-white border-white/10 max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-white/10">
            <DialogTitle className="text-xl flex items-center gap-2 font-bold">
              <MessageCircle size={20} className="text-blue-500" />
              Phản hồi bình luận
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* HIỂN THỊ BÌNH LUẬN CHA (Gốc) */}
            {parentComment && (
              <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 italic opacity-80 mb-4">
                <img src={parentComment.user.avatar} className="w-10 h-10 rounded-full object-cover border border-white/20" alt="" />
                <div className="flex-1">
                  <p className="font-bold text-yellow-400 text-sm">{parentComment.user.username}</p>
                  <p className="text-sm text-white/80 mt-1">{parentComment.content}</p>
                </div>
              </div>
            )}

            <div className="space-y-4 pl-6 border-l-2 border-white/10">
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Danh sách phản hồi</h3>

              {/* LOADING STATE */}
              {isLoadingReplies && <Loader2 className="animate-spin mx-auto text-blue-400" />}

              {/* RENDER REPLIES */}
              {replies.length > 0 ? (
                replies.map((reply: any) => {
                  const isMine = currentUser?._id === reply.user._id;
                  const isLiked = reply.likes.includes(currentUser?._id);

                  return (
                    <div key={reply._id} className="bg-white/5 p-4 rounded-xl border border-white/5 group transition hover:border-white/20">
                      <div className="flex gap-3">
                        <img src={reply.user.avatar} className="w-8 h-8 rounded-full object-cover border border-white/10" alt="" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-blue-500 text-sm">{reply.user.username}</span>
                            {isMine && (
                              <DropdownMenu>
                                <DropdownMenuTrigger className="p-1 hover:bg-white/10 rounded-full outline-none">
                                  <MoreVertical size={14} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#111] border-white/10 text-white">
                                  <DropdownMenuItem onClick={() => handleEdit(reply)} className="gap-2 cursor-pointer focus:bg-blue-600 focus:text-white">
                                    <Edit2 size={14} /> Sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDeleteId(reply._id);
                                      setOpenDeleteDialog(true);
                                    }}
                                    className="gap-2 cursor-pointer text-red-400 focus:bg-red-600 focus:text-white"
                                  >
                                    <Trash2 size={14} /> Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <p className="text-sm mt-1 text-white/90">{reply.content}</p>

                          <div className="mt-3 flex gap-4">
                            <button
                              onClick={() => toggleLikeMutation.mutate(reply._id, { onSuccess: () => refetchReplies() })}
                              className={`flex items-center gap-1 text-xs transition ${isLiked ? 'text-blue-400 font-bold' : 'text-white/40 hover:text-white'}`}
                            >
                              <ThumbsUp size={12} className={isLiked ? "fill-blue-400" : ""} />
                              <span>{reply.likes.length}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : !isLoadingReplies && (
                <p className="text-sm text-white/20 italic text-center py-4">Chưa có phản hồi nào cho bình luận này.</p>
              )}
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase text-blue-500 tracking-tighter">
                {editingId ? "Đang cập nhật phản hồi" : "Viết câu trả lời"}
              </span>
              {editingId && (
                <button onClick={cancelEdit} className="text-[10px] text-red-400 flex items-center gap-1 hover:underline">
                  <X size={10} /> HỦY CHỈNH SỬA
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={editingId ? "Cập nhật nội dung..." : "Nhập câu trả lời của bạn..."}
                className="flex-1 bg-white/10 rounded-xl p-3 text-sm focus:outline-none border border-white/10 focus:border-blue-500/50 transition resize-none"
                rows={2}
              />
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue hover:bg-blue-700 p-4 rounded-xl self-end transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Xóa phản hồi?"
        description="Phản hồi này sẽ bị xóa vĩnh viễn và không thể khôi phục."
      />
    </>

  );
}