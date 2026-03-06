"use client";

import LoadingScreen from "@/components/common/loading/loading-screen";
import { useGetMe } from "@/queries/useUserQuery";
import { format } from "date-fns";
import {
    CreditCard,
    Film,
    Trophy
} from "lucide-react";
import { useState } from "react";
import UserUpdateDialog from "./user-dialog";
import UserMovieFavouriteList from "./user-favourite-movie";
import UserPasswordDialog from "./user-password-dialog";
import UserTicketTable from "./user-ticket-table";
import UserMovieWatchedList from "./user-watched-movie";


export default function ProfilePage() {
    const { data: userRes } = useGetMe();
    const user = userRes?.data;
    const [activeTab, setActiveTab] = useState("my-ticket");
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    if (!user)
        return (
            <LoadingScreen />
        );

    return (
        <div className="min-h-screen text-white pb-20">

            {/* ================= BANNER ================= */}
            <div className="relative h-[500px] w-full mt-16 overflow-hidden">
                <img
                    src={user.banner}
                    className="w-full h-full object-cover"
                    alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b25] via-transparent to-transparent" />
            </div>

            {/* ================= AVATAR + BASIC INFO ================= */}
            <div className="container mx-auto px-4 lg:px-20 -mt-24 relative z-10">
                <div className="flex flex-col md:flex-row items-end gap-8">

                    <img
                        src={user.avatar}
                        className="w-56 h-56 rounded-full 
                       border-[6px] border-blue-500
                       shadow-[0_0_40px_rgba(255,200,0,0.6)] 
                       object-cover bg-neutral-900"
                        alt="Avatar"
                    />

                    <div className="mb-6">
                        <h1 className="text-5xl font-extrabold uppercase tracking-widest">
                            {user.username}
                        </h1>

                        <div className="flex flex-wrap gap-3 mt-4">
                            {/* Kiểm tra nếu user có tags và mảng không rỗng */}
                            {user?.tags && user.tags.length > 0 ? (
                                user.tags.map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-4 py-1 border border-white/40 
                   rounded-full text-sm 
                   bg-white/5 backdrop-blur-sm"
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                // Hiển thị mặc định nếu người dùng chưa có tag nào
                                <span className="text-sm text-neutral-500 italic">Chưa có danh hiệu</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= MAIN CONTENT ================= */}
            <div className="container mx-auto px-4 lg:px-20 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* ===== LEFT COLUMN ===== */}
                <div className="lg:col-span-4">
                    <div className="bg-gradient-to-br 
                          from-[#1f1f4a] 
                          via-[#2a2a6a] 
                          to-[#3b3bb3]
                          p-8 rounded-3xl
                          border border-white/10
                          shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

                        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
                            Thông tin chung
                        </h2>

                        <p className="italic text-white/70 text-center border-b border-white/10 pb-6 mb-6">
                            "Mỗi bộ phim là một chuyến hành trình – không chỉ qua câu chuyện trên màn ảnh, mà còn qua cảm xúc bên trong chính ta"
                        </p>

                        <div className="space-y-4 text-lg border-b border-white/10 pb-6 mb-6">
                            <InfoItem label="Tên" value={user.username} />
                            <InfoItem label="Email" value={user.email} />
                            <InfoItem label="Mã KH" value={user._id} />
                        </div>

                    </div>
                </div>

                {/* ===== RIGHT COLUMN ===== */}
                <div className="lg:col-span-8">

                    {/* ===== STATS ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            {
                                label: "Phim đã xem",
                                value: 7,
                                icon: <Film />,
                            },
                            {
                                label: "Tổng chi tiêu",
                                value: `${user.totalSpending?.toLocaleString()} đ`,
                                icon: <CreditCard />,
                            },
                            {
                                label: "Điểm thưởng",
                                value: `${user.currentPoints} BG`,
                                icon: <Trophy />,
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-gradient-to-br 
                           from-[#23235c] 
                           to-[#3c3cb8]
                           p-8 rounded-2xl 
                           text-center 
                           border border-white/10
                           shadow-[0_8px_30px_rgba(0,0,0,0.5)] 
                           hover:scale-105 transition-all duration-300"
                            >
                                <div className="text-yellow-400 flex justify-center mb-3 text-2xl">
                                    {stat.icon}
                                </div>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                                <p className="text-sm text-white/60">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ===== TABS ===== */}
                    <div className="flex border-b border-yellow-500/50 mb-8 overflow-x-auto">
                        {[
                            { id: "my-info", label: "Thông tin chi tiết" },
                            { id: "my-ticket", label: "Vé của tôi" },
                            { id: "my-movie", label: "Phim của tôi" },
                            { id: "my-password", label: "Đổi mật khẩu" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-yellow-500 text-black rounded-t-xl"
                                    : "text-white/70 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ===== TAB CONTENT ===== */}


                    {activeTab === "my-info" && (
                        <div className="bg-gradient-to-br 
                          from-[#1f1f4a] 
                          to-[#3535a3]
                          p-10 rounded-3xl 
                          border border-white/10
                          shadow-2xl">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoItem label="Họ và tên" value={user.fullName || "Chưa cập nhật"} />
                                    <InfoItem
                                        label="Ngày sinh"
                                        value={user.birth ? format(new Date(user.birth), "dd/MM/yyyy") : "Chưa cập nhật"}
                                    />
                                    <InfoItem label="Email" value={user.email} />
                                    <InfoItem
                                        label="Giới tính"
                                        value={
                                            user.gender === "male"
                                                ? "Nam"
                                                : user.gender === "female"
                                                    ? "Nữ"
                                                    : "Khác"
                                        }
                                    />
                                    <InfoItem
                                        label="Hạng thành viên"
                                        value={user.membership?.name || "Bronze"}
                                    />
                                </div>

                                <div className="pt-8 border-t border-white/10 flex justify-center">
                                    <button
                                        onClick={() => setIsUpdateDialogOpen(true)}
                                        className="bg-yellow-500 text-black px-10 py-3 rounded-xl font-bold hover:bg-yellow-400 transition"
                                    >
                                        CHỈNH SỬA THÔNG TIN
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "my-ticket" && (
                        <div className="space-y-6">

                            <UserTicketTable />
                        </div>
                    )}
                    {activeTab === "my-movie" && (
                        <div className="space-y-6">
                            <div className="text-2xl font-bold text-yellow-400 mb-4">
                                Phim đã xem
                            </div>
                            <UserMovieWatchedList />
                            <div className="text-2xl font-bold text-yellow-400 mb-4 mt-10">
                                Phim yêu thích
                            </div>
                            <UserMovieFavouriteList />
                        </div>
                    )}
                    {activeTab === "my-password" && (
                        <div className="bg-gradient-to-br 
                          from-[#1f1f4a] 
                          to-[#3535a3]
                          p-10 rounded-3xl 
                          border border-white/10
                          shadow-2xl">
                            <div className="space-y-6">
                                <div className="pt-8 border-t border-white/10 flex justify-center">
                                    <button
                                        onClick={() => setIsPasswordDialogOpen(true)}
                                        className="bg-yellow-500 text-black px-10 py-3 rounded-xl font-bold hover:bg-yellow-400 transition"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>


            <UserUpdateDialog
                open={isUpdateDialogOpen}
                onClose={() => setIsUpdateDialogOpen(false)}
                user={user}
            />

            <UserPasswordDialog
                open={isPasswordDialogOpen}
                onClose={() => setIsPasswordDialogOpen(false)}
            />
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <label className="text-white/60 text-sm block mb-1">{label}</label>
            <div className="text-lg font-medium break-all">{value}</div>
        </div>
    );
}