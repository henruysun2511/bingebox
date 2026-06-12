"use client";

import { useCinemaList } from "@/queries/useCinemaQuery";
import { useFormatRoomList } from "@/queries/useFormatRoomQuery";
import { Film, Info, Loader2, MapPin } from "lucide-react";

export default function AboutUs() {
    // 1. Lấy danh sách các rạp
    const { data: cinemasRes, isLoading: isLoadingList } = useCinemaList({ page: 1, limit: 10 });
    const cinemas = cinemasRes?.data || [];

    // 2. Lấy danh sách định dạng phòng chiếu
    const { data: formatRoomsRes, isLoading: isLoadingFormats } = useFormatRoomList({});
    const formats = formatRoomsRes?.data || [];

    return (
        <div className="min-h-screen text-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* ===== HEADER & INTRO ===== */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 
          bg-gradient-to-r from-blue-400 to-blue-600
          bg-clip-text text-transparent">
                        Về BingeBox Cinema
                    </h1>
                    <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
                        BingeBox mang đến không gian điện ảnh cao cấp, ghế ngồi êm ái, âm thanh Dolby sống động và màn hình chuẩn quốc tế. Trải nghiệm điện ảnh đỉnh cao với công nghệ hiện đại và không gian chuẩn Hollywood.
                    </p>
                </div>

                {/* ===== CINEMAS LIST (ALTERNATING LAYOUT) ===== */}
                <div className="mb-24 space-y-20">
                    {isLoadingList ? (
                         <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-blue-500" size={40} />
                        </div>
                    ) : (
                        cinemas.map((cinema, index) => {
                            const isImageLeft = index % 2 === 0;

                            return (
                                <div key={cinema._id} className={`flex flex-col md:flex-row gap-12 items-center ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Image */}
                                    <div className="w-full md:w-1/2">
                                        <div className="relative group overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                                            {cinema.image ? (
                                                <img
                                                    src={cinema.image}
                                                    alt={cinema.name}
                                                    className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-[400px] bg-white/5 flex items-center justify-center">
                                                    <span className="text-white/50">Chưa có hình ảnh</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="w-full md:w-1/2 space-y-8">
                                        <h2 className="text-4xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {cinema.name}
                                        </h2>
                                        
                                        <div className="space-y-5">
                                            <div className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                                <div className="bg-red-400/20 p-3 rounded-full shrink-0">
                                                    <MapPin className="text-red-400" size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white/50 mb-1">Địa chỉ</p>
                                                    <p className="font-medium text-base text-white/90 leading-relaxed">
                                                        {cinema.location}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                                <div className="bg-blue-400/20 p-3 rounded-full shrink-0">
                                                    <Info className="text-blue-400" size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white/50 mb-1">Mô tả</p>
                                                    <p className="font-medium text-base text-white/80 leading-relaxed">
                                                        {cinema.description || "Chưa có mô tả cho rạp này."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ===== FORMATS ===== */}
                <div className="bg-white/5 backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="text-center mb-12 relative z-10">
                        <h3 className="text-3xl md:text-4xl font-bold inline-flex items-center gap-4 text-white mb-4" >
                            <Film className="text-blue-500" size={36} /> Định dạng phòng chiếu
                        </h3>
                        <p className="text-white/60 text-lg">Trải nghiệm đa dạng các định dạng phòng chiếu hiện đại nhất tại BingeBox.</p>
                    </div>

                    {isLoadingFormats ? (
                        <div className="flex justify-center relative z-10">
                            <Loader2 className="animate-spin text-blue-500" size={40} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                            {formats.map((format) => (
                                <div
                                    key={format._id}
                                    className="bg-white/5 border border-white/10 
                  p-8 rounded-2xl text-center 
                  hover:border-blue-500/40 hover:bg-blue-500/10 hover:-translate-y-2
                  transition-all duration-300 group"
                                >
                                    <p className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3">
                                        {format.name}
                                    </p>
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        {format.description || "Định dạng cao cấp tiêu chuẩn Hollywood"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}