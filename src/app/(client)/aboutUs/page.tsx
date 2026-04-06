"use client";

import { useCinemaDetail, useCinemaList } from "@/queries/useCinemaQuery";
import { useFormatRoomList } from "@/queries/useFormatRoomQuery";
import { Film, Info, Loader2, MapPin } from "lucide-react";
import { useState } from "react";

export default function AboutUs() {
    // State để lưu ID rạp được chọn (mặc định lấy rạp đầu tiên nếu có)
    const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null);

    // 1. Lấy danh sách các rạp
    const { data: cinemasRes, isLoading: isLoadingList } = useCinemaList({ page: 1, limit: 10 });
    const cinemas = cinemasRes?.data || [];

    // 2. Lấy chi tiết rạp được chọn
    const { data: cinemaDetailRes, isLoading: isLoadingDetail } = useCinemaDetail(selectedCinemaId || undefined);
    const cinemaDetail = cinemaDetailRes?.data || null;

    // 3. Lấy danh sách định dạng phòng chiếu
    const { data: formatRoomsRes, isLoading: isLoadingFormats } = useFormatRoomList({});
    const formats = formatRoomsRes?.data || [];

    // Chọn rạp đầu tiên mặc định khi load xong danh sách
    if (!selectedCinemaId && cinemas.length > 0) {
        setSelectedCinemaId(cinemas[0]._id);
    }

    return (
        <div className="min-h-screen  text-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* ===== HEADER ===== */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold mb-4 
          bg-gradient-to-r from-blue-400 to-blue-600
          bg-clip-text text-transparent">
                        BingeBox Cinema
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Trải nghiệm điện ảnh đỉnh cao với công nghệ hiện đại và không gian chuẩn Hollywood.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* ===== SIDEBAR ===== */}
                    <div className="md:col-span-1 bg-white/5 backdrop-blur-xl 
          p-6 rounded-2xl border border-white/10 shadow-xl">

                        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-blue-500">
                            <MapPin size={18} /> Hệ thống rạp
                        </h2>

                        {isLoadingList && (
                            <Loader2 className="animate-spin mx-auto text-blue-500" />
                        )}

                        <div className="space-y-3">
                            {cinemas.map((cinema) => (
                                <button
                                    key={cinema._id}
                                    onClick={() => setSelectedCinemaId(cinema._id)}
                                    className={`w-full text-left p-4 rounded-xl text-sm transition-all
                  ${selectedCinemaId === cinema._id
                                            ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                                            : "hover:bg-white/10 text-white/80"
                                        }`}
                                >
                                    {cinema.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ===== MAIN CONTENT ===== */}
                    <div className="md:col-span-3 space-y-10">

                        {isLoadingDetail ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-blue-500" size={40} />
                            </div>
                        ) : cinemaDetail ? (

                            <div className="bg-white/5 backdrop-blur-xl p-8 
              rounded-2xl border border-white/10 shadow-2xl">

                                {/* ===== IMAGE ===== */}
                                {cinemaDetail.image && (
                                    <img
                                        src={cinemaDetail.image}
                                        alt={cinemaDetail.name}
                                        className="w-full h-64 object-cover rounded-xl mb-8"
                                    />
                                )}

                                <h2 className="text-3xl font-bold mb-6 text-blue-500">
                                    {cinemaDetail.name}
                                </h2>

                                {/* INFO BOX */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 
                bg-white/5 p-6 rounded-xl border border-white/10 mb-8">

                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-red-400 mt-1" />
                                        <div>
                                            <p className="text-xs text-white/50">Địa chỉ</p>
                                            <p className="font-medium text-sm text-white/90">
                                                {cinemaDetail.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Info className="text-blue-400 mt-1" />
                                        <div>
                                            <p className="text-xs text-white/50">Mô tả</p>
                                            <p className="font-medium text-sm text-white/80">
                                                {cinemaDetail.description || "Chưa có mô tả"}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                {/* ABOUT */}
                                <div className="text-white/80 space-y-4">
                                    <h3 className="text-xl font-semibold text-blue-500">
                                        Về BingeBox Cinema
                                    </h3>
                                    <p>
                                        BingeBox mang đến không gian điện ảnh cao cấp, ghế ngồi êm ái,
                                        âm thanh Dolby sống động và màn hình chuẩn quốc tế.
                                    </p>
                                    <p>
                                        Tại <span className="text-blue-500 font-semibold">
                                            {cinemaDetail.name}
                                        </span>, bạn sẽ được trải nghiệm những bộ phim bom tấn mới nhất
                                        trong không gian đậm chất điện ảnh.
                                    </p>
                                </div>

                            </div>

                        ) : (
                            <div className="text-center py-20 text-white/50">
                                Vui lòng chọn một rạp để xem chi tiết.
                            </div>
                        )}

                        {/* ===== FORMATS ===== */}
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl 
            border border-white/10 shadow-xl">

                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-500" >
                                <Film size={20} /> Định dạng phòng chiếu
                            </h3>

                            {isLoadingFormats ? (
                                <Loader2 className="animate-spin mx-auto text-blue-500" />
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                    {formats.map((format) => (
                                        <div
                                            key={format._id}
                                            className="bg-white/5 border border-white/10 
                      p-5 rounded-xl text-center 
                      hover:border-yellow-400/40 hover:scale-105
                      transition-all duration-300"
                                        >
                                            <p className="text-sm font-bold text-goleden">
                                                {format.name}
                                            </p>
                                            <p className="text-xs text-white/60 mt-1">
                                                {format.description || "Định dạng cao cấp"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}