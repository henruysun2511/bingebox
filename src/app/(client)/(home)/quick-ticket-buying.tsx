"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { MovieStatusEnum } from "@/constants/enum";
import { useMovieList } from "@/queries/useMovieQuery";
import { useQuickCinemas, useQuickDates, useQuickTimes } from "@/queries/useQuickTicketBuyingQuery";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuickTicketBuying() {
    const router = useRouter();

    const [selectedMovie, setSelectedMovie] = useState<string>("");
    const [selectedCinema, setSelectedCinema] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedShowtime, setSelectedShowtime] = useState<string>("");

    const { data: movies } = useMovieList({ limit: 20, status: MovieStatusEnum.NOW_SHOWING });
    const { data: cinemas, isPending: loadingCinemas } = useQuickCinemas(selectedMovie);
    const { data: dates, isPending: loadingDates } = useQuickDates({
        movieId: selectedMovie,
        cinemaId: selectedCinema,
    });
    const { data: times, isPending: loadingTimes } = useQuickTimes({
        movieId: selectedMovie,
        cinemaId: selectedCinema,
        date: selectedDate,
    });

    const handleBuyTicket = () => {
        if (selectedShowtime) {
            router.push(`/booking/${selectedShowtime}`);
        }
    };

    return (
        <div className="relative z-30 mb-8">
            {/* Container chính */}
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4 bg-neutral-900/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl items-end">

                {/* 1. Chọn Phim */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-blue uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse"></span>
                        Phim
                    </label>
                    <Select value={selectedMovie} onValueChange={(val) => {
                        setSelectedMovie(val);
                        setSelectedCinema("");
                        setSelectedDate("");
                        setSelectedShowtime("");
                    }}>
                        {/* SỬA: Thêm !w-full để ghi đè w-xs từ globals.css */}
                        <SelectTrigger className="select-trigger-custom !w-full h-11 border-white/10 bg-black/40 text-neutral-100 rounded-md hover:border-blue/50 transition-all">
                            <SelectValue placeholder="Chọn phim..." />
                        </SelectTrigger>
                        <SelectContent className="select-content-custom">
                            {movies?.data.map((m: any) => (
                                <SelectItem className="select-item-custom" key={m._id} value={m._id}>
                                    {m.name || m.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 2. Chọn Rạp */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Rạp</label>
                    <Select
                        disabled={!selectedMovie || loadingCinemas}
                        value={selectedCinema}
                        onValueChange={(val) => {
                            setSelectedCinema(val);
                            setSelectedDate("");
                            setSelectedShowtime("");
                        }}
                    >
                        {/* SỬA: !w-full */}
                        <SelectTrigger className="select-trigger-custom !w-full h-11 border-white/10 bg-black/40 text-neutral-100 rounded-md">
                            <SelectValue placeholder={loadingCinemas ? "Đang tải..." : "Chọn rạp"} />
                        </SelectTrigger>
                        <SelectContent className="select-content-custom">
                            {cinemas?.data.map((c: any) => (
                                <SelectItem className="select-item-custom" key={c._id} value={c._id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 3. Chọn Ngày */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Ngày chiếu</label>
                    <Select
                        disabled={!selectedCinema || loadingDates}
                        value={selectedDate}
                        onValueChange={(val) => {
                            setSelectedDate(val);
                            setSelectedShowtime("");
                        }}
                    >
                        {/* SỬA: !w-full */}
                        <SelectTrigger className="select-trigger-custom !w-full h-11 border-white/10 bg-black/40 text-neutral-100 rounded-md">
                            <SelectValue placeholder={loadingDates ? "Đang tải..." : "Chọn ngày"} />
                        </SelectTrigger>
                        <SelectContent className="select-content-custom">
                            {dates?.data.map((d: string) => (
                                <SelectItem className="select-item-custom" key={d} value={d}>
                                    {new Date(d).toLocaleDateString("vi-VN", { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 4. Chọn Suất Chiếu */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Suất chiếu</label>
                    <Select
                        disabled={!selectedDate || loadingTimes}
                        value={selectedShowtime}
                        onValueChange={setSelectedShowtime}
                    >
                        {/* SỬA: !w-full */}
                        <SelectTrigger className="select-trigger-custom !w-full h-11 border-white/10 bg-black/40 text-neutral-100 rounded-md">
                            <SelectValue placeholder={loadingTimes ? "Đang tải..." : "Chọn suất"} />
                        </SelectTrigger>
                        <SelectContent className="select-content-custom">
                            {times?.data.map((t: any) => {
                                const formattedTime = new Date(t.startTime).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                });
                                return (
                                    <SelectItem className="select-item-custom" key={t._id} value={t._id}>
                                        {formattedTime}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Nút Mua Vé */}
                <div className="h-11">
                    <Button
                        onClick={handleBuyTicket}
                        disabled={!selectedShowtime}
                        className="w-full h-full bg-blue hover:bg-blue/80 text-white font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 border-none"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        Mua vé nhanh
                    </Button>
                </div>
            </div>
        </div>
    );
}