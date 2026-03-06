"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { GenderEnum } from "@/constants/enum";
import { useFileChange } from "@/hooks/useFileChange";
import { cn } from "@/lib/utils";
import { useUpdateMe } from "@/queries/useUserQuery";
import { UserInput, UserSchema } from "@/schemas/user.schema";
import { handleError } from "@/utils/error";

interface Props {
    open: boolean;
    onClose: () => void;
    user: any;
}

const AVAILABLE_TAGS = [
    "Kẻ hủy diệt phim",
    "Thích phim hành động",
    "Một ngày 10 phim",
    "Phú bà bao rạp",
    "Trùm cày phim",
    "Mọt phim chính hiệu",
    "Thánh review",
    "Fan Marvel",
    "Fan DC",
    "Cúng tiền cho bắp nước",
    "Chuyên gia coi trailer",
    "Vào rạp sớm 30 phút",
    "Ở lại xem after-credit",
    "Thánh né spoiler",
    "Ngủ gật 5 phút vẫn hiểu phim",
    "Đi xem phim một mình không cô đơn",
    "Thuộc lòng intro Galaxy",
    "Chuyên gia né cặp đôi ồn ào",
    "Ông hoàng ghế VIP",
    "Bà hoàng phòng đôi",
    "Cao thủ đặt vé online",
    "Chuyên gia soi lỗi logic",
    "Xem phim là phải ngồi giữa",
    "Ăn hết bắp trước khi phim bắt đầu",
    "Mang lén đồ ăn vào rạp",
    "Chửi nhân viên CGV"
];

export default function UserUpdateDialog({ open, onClose, user }: Props) {
    const [tagInput, setTagInput] = useState("");
    const updateMe = useUpdateMe();

    const form = useForm<UserInput>({
        resolver: zodResolver(UserSchema) as any,
        defaultValues: {
            username: "",
            email: "",
            fullName: "",
            avatar: "",
            banner: "",
            birth: "",
            gender: GenderEnum.OTHER,
            tags: [],
        },
    });

    const { handleFileChange: uploadAvatar, isUploading: upAvatar } = useFileChange(form);
    const { handleFileChange: uploadBanner, isUploading: upBanner } = useFileChange(form);

    useEffect(() => {
        if (open && user) {
            form.reset({
                ...user,
                birth: user.birth ? new Date(user.birth).toISOString().split("T")[0] : "",
                tags: user.tags || [],
            });
        }
    }, [open, user, form]);

    const onAddTag = () => {
        if (tagInput.trim()) {
            const currentTags = form.getValues("tags");
            if (!currentTags.includes(tagInput.trim())) {
                form.setValue("tags", [...currentTags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (index: number) => {
        const currentTags = form.getValues("tags");
        form.setValue("tags", currentTags.filter((_, i) => i !== index));
    };

    const onSubmit = async (values: UserInput) => {
        try {
            await updateMe.mutateAsync(values);
            toast.success("Cập nhật thông tin thành công");
            onClose();
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-3xl bg-black text-white border-neutral-800 p-0 overflow-hidden custom-scrollbar flex flex-col max-h-[90vh]">
                <div className="overflow-y-auto p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold uppercase">
                            Cập nhật hồ sơ
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Media Section */}
                            <div className="space-y-4">
                                <FormLabel className="text-neutral-400">Ảnh bìa & Ảnh đại diện</FormLabel>
                                <div className="relative h-48 w-full rounded-xl overflow-hidden bg-neutral-900 border-2 border-dashed border-neutral-800 group">
                                    <input type="file" hidden id="banner-up" onChange={(e) => uploadBanner(e, "banner")} />
                                    {form.watch("banner") ? (
                                        <img src={form.watch("banner")!} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-neutral-500">Tải lên Banner (16:9)</div>
                                    )}
                                    <label htmlFor="banner-up" className="absolute top-2 right-2 p-2 bg-black/60 rounded-full cursor-pointer hover:bg-orange-500 transition">
                                        <Pencil size={18} />
                                    </label>

                                    {/* Avatar Overlay */}
                                    <div className="absolute -bottom-2 left-8 transform translate-y-1/2">
                                        <div className="relative group/avatar">
                                            <input type="file" hidden id="avatar-up" onChange={(e) => uploadAvatar(e, "avatar")} />
                                            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-neutral-800">
                                                {form.watch("avatar") ? (
                                                    <img src={form.watch("avatar")!} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs text-center p-2">Ảnh đại diện</div>
                                                )}
                                            </div>
                                            <label htmlFor="avatar-up" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition cursor-pointer rounded-full">
                                                <Pencil size={20} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 grid grid-cols-2 gap-6">
                                <FormField name="fullName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Họ và tên</FormLabel>
                                        <FormControl><Input {...field} className="bg-neutral-900 border-neutral-800 focus:ring-orange-500" /></FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )} />

                                <FormField name="username" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Username</FormLabel>
                                        <FormControl><Input {...field} className="bg-neutral-900 border-neutral-800" /></FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )} />

                                <FormField name="birth" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Ngày sinh</FormLabel>
                                        <FormControl><Input type="date" {...field} className="bg-neutral-900 border-neutral-800 invert-calendar" /></FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )} />

                                <FormField name="gender" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Giới tính</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-neutral-900 border-neutral-800">
                                                    <SelectValue placeholder="Chọn giới tính" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-neutral-900 text-white border-neutral-800">
                                                <SelectItem value={GenderEnum.MALE}>Nam</SelectItem>
                                                <SelectItem value={GenderEnum.FEMALE}>Nữ</SelectItem>
                                                <SelectItem value={GenderEnum.OTHER}>Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Tags Section */}
                            <div className="space-y-4">
                                <FormLabel className="text-neutral-400">Danh hiệu / Tags của bạn</FormLabel>

                                {/* 1. Hiển thị các Tags ĐÃ CHỌN (có nút X để xóa) */}
                                <div className="flex gap-2 mb-4 flex-wrap min-h-[40px] p-3 border border-neutral-800 rounded-lg bg-black/20">
                                    {form.watch("tags").length > 0 ? (
                                        form.watch("tags").map((tag, index) => (
                                            <Badge
                                                key={index}
                                                className="bg-blue text-white border-none px-3 py-1 gap-2 hover:bg-blue-500 transition"
                                            >
                                                {tag}
                                                <X
                                                    size={14}
                                                    className="cursor-pointer hover:text-white"
                                                    onClick={() => removeTag(index)}
                                                />
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-neutral-600 italic">Chưa chọn danh hiệu nào...</span>
                                    )}
                                </div>

                                {/* 2. Hiển thị danh sách các Tags CÓ SẴN để chọn */}
                                <div className="space-y-2">
                                    <p className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Danh sách danh hiệu gợi ý:</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {AVAILABLE_TAGS.map((tag) => {
                                            const isSelected = form.watch("tags").includes(tag);
                                            return (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => {
                                                        const currentTags = form.getValues("tags");
                                                        if (!isSelected) {
                                                            // Nếu chưa chọn thì thêm vào
                                                            form.setValue("tags", [...currentTags, tag]);
                                                        } else {
                                                            // Nếu đã chọn rồi mà nhấn lại thì xóa đi (toggle)
                                                            form.setValue("tags", currentTags.filter(t => t !== tag));
                                                        }
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-md text-sm border transition-all duration-200",
                                                        isSelected
                                                            ? "bg-blue-500/20 border-blue-500 text-white font-medium"
                                                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
                                                    )}
                                                >
                                                    {tag}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={upAvatar || upBanner || updateMe.isPending}
                                    className="btn-custom"
                                >
                                    {updateMe.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}