"use client";

import SectionTitle from "@/components/common/title/section-title";
import { MovieStatusEnum } from "@/constants/enum";
import { cn } from "@/lib/utils";
import { useCinemaList } from "@/queries/useCinemaQuery";
import { useAdminMovieList } from "@/queries/useMovieQuery";
import { useShowtimesByCinema } from "@/queries/useShowtimeQuery";
import { addDays, format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import { MovieBannerCarousel } from "../movie-banner-carousel";

export default function ShowtimeCinemaPage() {
    const { data: cinemaData } = useCinemaList({ limit: 10 });
    const cinemas = cinemaData?.data ?? [];

    const [selectedCinema, setSelectedCinema] = useState<string | null>(null);
    const [mode, setMode] = useState<"current" | "past">("current");

    const { data: showtimeData } = useShowtimesByCinema(selectedCinema || "");
    const showtimes = showtimeData?.data ?? [];

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // 7 ngày hiện tại
    const currentDates = Array.from({ length: 7 }, (_, i) =>
        addDays(new Date(), i)
    );

    // Lấy tất cả ngày từ DB
    const allDates = showtimes.flatMap((m: any) =>
        m.showtimes.map((st: any) => new Date(st.startTime))
    );

    const uniquePastDates = Array.from(
        new Map(
            allDates.map((d: Date) => [format(d, "yyyy-MM-dd"), d])
        ).values()
    ).sort((a, b) => a.getTime() - b.getTime());

    const datesToRender = mode === "current" ? currentDates : uniquePastDates;

    const filteredMovies = showtimes
        .map((movieBlock: any) => {
            const filteredShowtimes = movieBlock.showtimes.filter((st: any) =>
                isSameDay(new Date(st.startTime), selectedDate)
            );

            if (filteredShowtimes.length === 0) return null;

            return {
                ...movieBlock,
                showtimes: filteredShowtimes
            };
        })
        .filter(Boolean);

    const { data: movies, isLoading } = useAdminMovieList({ limit: 5, status: MovieStatusEnum.NOW_SHOWING });
    return (
        <>
            <MovieBannerCarousel movies={movies?.data || []} />
            <div className="px-20 py-10 mx-30 text-white space-y-10">

                {/* DANH SÁCH RẠP */}
                <SectionTitle title="Danh sách rạp" />
                <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
                    {cinemas.map((cinema: any) => {
                        const active = selectedCinema === cinema._id;

                        return (
                            <div
                                key={cinema._id}
                                onClick={() => setSelectedCinema(cinema._id)}
                                className="relative group min-w-[260px] h-[180px] cursor-pointer"
                            >
                                <img
                                    src={cinema.image}
                                    alt={cinema.name}
                                    className={cn(
                                        "absolute inset-0 w-full h-full object-cover rounded-2xl transition duration-500",
                                        active ? "scale-105" : "group-hover:scale-105"
                                    )}
                                />
                                <div
                                    className={cn(
                                        "absolute inset-0 rounded-2xl transition-all duration-300",
                                        active
                                            ? "bg-black/50 ring-2 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                                            : "bg-black/60 group-hover:bg-black/40"
                                    )}
                                />
                                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                                    <h3 className="text-lg font-bold tracking-wide">
                                        {cinema.name}
                                    </h3>

                                    {active && (
                                        <p className="text-xs text-blue-300 mt-1">
                                            Đang xem lịch chiếu
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* TAB CHỌN LOẠI */}
                {selectedCinema && (
                    <>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setMode("current")}
                                className={cn(
                                    "px-6 py-2 rounded-full",
                                    mode === "current" ? "bg-blue-600" : "bg-white/10"
                                )}
                            >
                                Lịch hiện tại
                            </button>

                            <button
                                onClick={() => setMode("past")}
                                className={cn(
                                    "px-6 py-2 rounded-full",
                                    mode === "past" ? "bg-blue-600" : "bg-white/10"
                                )}
                            >
                                Lịch quá khứ
                            </button>
                        </div>

                        {/* DATE TABS */}
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {datesToRender.map((date, index) => {
                                const isSelected = isSameDay(date, selectedDate);
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(date)}
                                        className={cn(
                                            "flex flex-col items-center min-w-[90px] py-3 rounded-xl transition-all",
                                            isSelected
                                                ? "bg-blue-600"
                                                : "bg-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        <span className="text-[10px] uppercase opacity-60">
                                            {format(date, "EEEE", { locale: vi })}
                                        </span>
                                        <span className="text-lg font-bold">
                                            {format(date, "dd/MM")}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* MOVIE LIST */}
                        <div className="space-y-10">
                            {filteredMovies.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    Không có suất chiếu
                                </div>
                            ) : (
                                filteredMovies.map((movieBlock: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex gap-8 bg-gradient-to-r from-blue-900 to-indigo-800 p-6 rounded-2xl shadow-xl"
                                    >
                                        {/* POSTER */}
                                        <img
                                            src={movieBlock.movie.poster}
                                            className="w-[180px] h-[260px] object-cover rounded-xl"
                                        />

                                        {/* INFO */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded font-bold">
                                                    {movieBlock.movie.agePermission}
                                                </span>
                                                {movieBlock.movie.format.map((f: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 bg-green-600 text-xs rounded font-bold"
                                                    >
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* DURATION + RELEASE */}
                                            <div className="text-sm text-white/80 space-y-1">
                                                <div>Thời lượng: {movieBlock.movie.duration} phút</div>
                                                <div>
                                                    Khởi chiếu:{" "}
                                                    {movieBlock.movie.releaseDate
                                                        ? format(new Date(movieBlock.movie.releaseDate), "dd/MM/yyyy")
                                                        : "N/A"}
                                                </div>
                                            </div>

                                            {/* DESCRIPTION */}
                                            <p className="text-sm text-white/70 line-clamp-3 leading-relaxed ">
                                                {movieBlock.movie.description || "Chưa có mô tả."}
                                            </p>

                                            {/* GIỜ CHIẾU */}
                                            <div className="flex gap-3 flex-wrap pt-3">
                                                {movieBlock.showtimes.map((st: any) => (
                                                    <Link
                                                        href={`booking/${st._id}`}
                                                        key={st._id}
                                                        className="px-4 py-2 bg-white text-black font-semibold rounded-lg"
                                                    >
                                                        {format(new Date(st.startTime), "HH:mm")}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </>

    );
}