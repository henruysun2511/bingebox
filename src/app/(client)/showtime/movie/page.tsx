"use client";

import LoadingScreen from "@/components/common/loading/loading-screen";
import SectionTitle from "@/components/common/title/section-title";
import { MovieStatusEnum } from "@/constants/enum";
import { useMovieList } from "@/queries/useMovieQuery";
import { Calendar1, Clock1 } from "lucide-react";
import Link from "next/link";
import { MovieBannerCarousel } from "../movie-banner-carousel";

export default function ShowtimeMoviePage() {
    const { data: moviesRes, isLoading } = useMovieList({ status: MovieStatusEnum.NOW_SHOWING });
    const movies = moviesRes?.data || [];

    if (isLoading) return <LoadingScreen />;

    return (
        <>
            <MovieBannerCarousel movies={movies || []} />
            <div className="min-h-screen pt-5 pb-20 px-6 sm:px-20 lg:px-40">
                <div className="container mx-auto">
                    <SectionTitle title="Phim đang chiếu" />
                    <p className="text-gray-400 mt-2 mb-10">Chọn phim để xem lịch chiếu chi tiết tại các rạp</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {movies.map((movie: any) => (
                            <Link
                                href={`/showtime/movie/${movie._id}`}
                                key={movie._id}
                                className="group flex flex-col bg-comment rounded-2xl overflow-hidden border border-white/10 hover:border-golden transition-all hover:-translate-y-2 shadow-xl"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden">
                                    <img
                                        src={movie.poster || "/fallback.jpg"}
                                        alt={movie.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3 bg-golden text-black text-xs font-bold px-2 py-1 rounded">
                                        {movie.agePermission}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col gap-2">
                                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-golden transition-colors">
                                        {movie.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                                        <div className="flex items-center gap-1">
                                            <Clock1 className="w-3 h-3" /> {movie.duration} phút
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar1 className="w-3 h-3" /> {new Date(movie.releaseDate).getFullYear()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
}
