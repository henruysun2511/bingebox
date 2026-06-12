"use client";

import AuthorMessage from "@/components/author/author-message";
import LoadingScreen from "@/components/common/loading/loading-screen";
import SectionTitle from "@/components/common/title/section-title";
import { Button } from "@/components/ui/button";
import { MovieStatusEnum } from "@/constants/enum";
import { cn } from "@/lib/utils";
import { useMovieDetail, useToggleLikeMovie } from "@/queries/useMovieQuery";
import { useShowtimesByMovie } from "@/queries/useShowtimeQuery";
import { useGetMe } from "@/queries/useUserQuery";
import { handleError } from "@/utils/error";
import { addDays, format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar1, Clock1, Heart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN");
};

export default function MovieDetailPage() {
    const { id } = useParams<{ id: string }>();

    //Lấy thông tin phim
    const { data: movieData, isLoading } = useMovieDetail(id);
    const movie = movieData?.data;
    const isComingSoon = movie?.status === MovieStatusEnum.COMING_SOON
    const [showTrailer, setShowTrailer] = useState(false);

    console.log(movie);

    //Lấy thông tin user
    const { data: meRes } = useGetMe();
    const currentUserId = meRes?.data?._id;


    //Logic lấy lịch chiếu hiện tại theo ngày
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { data: showtimeData, isLoading: isShowtimeLoading } = useShowtimesByMovie(id, {
        date: selectedDate
    });
    const showtimes = showtimeData?.data ?? [];

    //Select ngày
    const dateTabs = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));


    //Logic lấy lịch chiếu trong quá khứ
    const [showPast, setShowPast] = useState(false);
    const [selectedPastDate, setSelectedPastDate] = useState<Date | null>(null);

    const { data: showtimeDataV2, isLoading: isShowtimeV2Loading } = useShowtimesByMovie(id, {});
    const pastShowtimesRaw = showtimeDataV2?.data ?? [];

    // Lấy toàn bộ startTime
    const allPastDates = pastShowtimesRaw.flatMap((cinema: any) =>
        cinema.formats.flatMap((f: any) =>
            f.showtimes.map((st: any) => new Date(st.startTime))
        )
    );

    // Lọc unique theo ngày (yyyy-MM-dd)
    const uniquePastDates = Array.from(
        new Map(
            allPastDates.map((date) => [
                format(date, "yyyy-MM-dd"),
                date
            ])
        ).values()
    ).sort((a, b) => a.getTime() - b.getTime());


    const toggleLikeMutation = useToggleLikeMovie();
    // Kiểm tra xem currentUserId có nằm trong mảng movie.likes không
    const isLiked = movie?.likes?.includes(currentUserId as string);

    const handleToggleLike = async () => {
        try {
            await toggleLikeMutation.mutateAsync(movie?._id || "");
            toast.success(isLiked ? "Đã bỏ thích phim" : "Đã thích phim");
        } catch (error) {
            handleError(error);
        }
    };

    const showtimeRef = useRef<HTMLDivElement>(null);
    const scrollToShowtimes = () => {
        showtimeRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (isLoading) return <LoadingScreen />;
    if (!movie) return <div className="text-white p-10">Movie not found</div>;


    return (
        <>
            <AuthorMessage
                content={"Do tác giả lười up lịch chiếu mới, nên mọi người ấn nút demo lịch chiếu để xem lịch chiếu trong quá khứ nhé"}
                name={"Tác giả"}
                position=""
                image={"https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/594967022_1516503276319019_8492803772297431689_n.jpg"}
            />

            {/* BANNER */}
            <div className="mt-16">
                <div data-theme-fixed className="relative h-[320px] sm:h-[450px] lg:h-[620px] w-full overflow-hidden">

                    <img
                        src={movie.banner || "/fallback.jpg"}
                        alt={movie.name}
                        className="w-full h-full object-cover scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

                    <div
                        onClick={() => setShowTrailer(true)}
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    >
                        <div className="text-white text-5xl sm:text-6xl lg:text-7xl hover:scale-110 transition">
                            ▶
                        </div>
                    </div>

                    <div className="absolute bottom-2 right-2 flex gap-3 items-center">
                        <Button
                            onClick={handleToggleLike}
                            disabled={toggleLikeMutation.isPending}
                            variant={isLiked ? "default" : "outline"}
                            className={`gap-2 ${isLiked ? "bg-red-500 hover:bg-red-600" : "border-neutral-700"
                                }`}
                        >
                            <Heart className={isLiked ? "fill-white" : ""} size={20} />
                            {isLiked ? "Đã thích" : "Thích"}
                        </Button>

                        <span className="text-xs sm:text-sm text-gray-400">
                            {movie.likeCount || 0} lượt thích
                        </span>
                    </div>

                </div>
            </div>

            {/* PAGE CONTAINER */}
            <div className="px-4 sm:px-10 md:px-16 lg:px-24 xl:px-40 2xl:px-80">

                {/* INFO */}
                <div className="relative -mt-20 lg:-mt-25 z-10 mb-16 lg:mb-20">
                    <div className="container mx-auto px-2 sm:px-6">

                        <div className="flex flex-col items-center lg:items-end lg:flex-row gap-6 lg:gap-10 text-white">

                            {/* POSTER */}
                            <div className="w-[180px] sm:w-[220px] lg:w-[280px] shrink-0">

                                <img
                                    src={movie.poster || "/fallback.jpg"}
                                    alt={movie.name}
                                    className="w-full h-[260px] sm:h-[320px] lg:h-[400px] object-cover rounded-xl shadow-2xl"
                                />

                            </div>

                            {/* CONTENT */}
                            <div className="flex-1">

                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
                                    {movie.name}
                                </h1>

                                <div className="flex flex-wrap gap-6 sm:gap-8 mb-4 text-sm text-white/80">

                                    <div className="flex items-center gap-2">
                                        <Clock1 className="w-4 h-4" />
                                        {movie.duration || "N/A"} phút
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar1 className="w-4 h-4" />
                                        {formatDate(movie.releaseDate)}
                                    </div>

                                </div>

                                <div className="space-y-2 text-sm text-white/80">
                                    <p>Đạo diễn: {movie.director || "N/A"}</p>
                                    <p>Quốc gia: {movie.nationality || "N/A"}</p>
                                </div>

                                {/* CATEGORY */}
                                <div className="flex flex-wrap items-center gap-2 mt-4">
                                    <span className="text-white/70">Thể loại:</span>

                                    {movie.categories?.length ? (
                                        movie.categories.map((c: any) => (
                                            <span
                                                key={c._id}
                                                className="px-3 py-1 bg-white/10 rounded-full text-xs"
                                            >
                                                {c.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>

                                {/* AGE */}
                                <div className="mt-4">
                                    <span className="px-3 py-1 bg-yellow-500 text-black font-semibold rounded-md text-sm">
                                        {movie.agePermission || "N/A"}
                                    </span>
                                </div>

                                {/* BUTTONS */}
                                <div data-theme-fixed className="flex flex-wrap gap-3 sm:gap-4 mt-6">

                                    <button
                                        onClick={() => setShowTrailer(true)}
                                        className="px-6 py-2 rounded-full bg-blue hover:opacity-90 transition font-semibold"
                                    >
                                        TRAILER
                                    </button>

                                    {!isComingSoon && (
                                        <button
                                            onClick={scrollToShowtimes}
                                            className="px-6 py-2 rounded-full bg-red-500 hover:opacity-90 transition font-semibold"
                                        >
                                            ĐẶT VÉ
                                        </button>
                                    )}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mb-12 sm:mb-16 lg:mb-20">

                    <div className="container mx-auto px-2 sm:px-6 text-white">

                        <SectionTitle title="Nội dung" />

                        <p className="mt-6 text-white/80 leading-relaxed max-w-4xl">
                            {movie.description || "N/A"}
                        </p>

                    </div>
                </div>

                {/* ACTORS */}
                <div className="mb-16 lg:mb-24">

                    <div className="container mx-auto px-2 sm:px-6 text-white">

                        <SectionTitle title="Diễn viên" />

                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 mt-8">

                            {movie.actors?.length ? (
                                movie.actors.map((actor: any) => (
                                    <Link
                                        key={actor._id}
                                        className="flex flex-col items-center group cursor-pointer"
                                        href={`/actor/${actor._id}`}
                                    >

                                        <div className="w-[80px] h-[80px] sm:w-[95px] sm:h-[95px] lg:w-[110px] lg:h-[110px] rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition">

                                            <img
                                                src={actor.avatar || "/avatar-fallback.png"}
                                                alt={actor.name}
                                                className="w-full h-full object-cover"
                                            />

                                        </div>

                                        <div className="mt-3 text-xs sm:text-sm text-center text-white/80">
                                            {actor.name || "N/A"}
                                        </div>

                                    </Link>
                                ))
                            ) : (
                                <p>N/A</p>
                            )}

                        </div>

                    </div>
                </div>

                {/* SHOWTIMES */}
                <div className="mb-10" ref={showtimeRef}>
                    <div className="container mx-auto px-6 text-white pb-20">
                        <SectionTitle title="Lịch chiếu" />
                        {isComingSoon ? (
                            /* HIỂN THỊ KHI PHIM SẮP CHIẾU */
                            <div className="mt-10 p-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/20">
                                <Calendar1 className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                                <h3 className="text-xl font-bold text-gray-300">Phim sắp ra mắt</h3>
                                <p className="text-gray-500 mt-2">
                                    Suất chiếu sẽ sớm được cập nhật khi phim chính thức khởi chiếu.
                                </p>
                            </div>
                        ) : (
                            /* HIỂN THỊ LỊCH CHIẾU BÌNH THƯỜNG */
                            <>
                                {/* DATE TABS */}
                                <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar ">
                                    {dateTabs.map((date, index) => {
                                        const isSelected = isSameDay(date, selectedDate);
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedDate(date)}
                                                className={cn(
                                                    "flex flex-col items-center min-w-[80px] py-3 rounded-xl transition-all",
                                                    isSelected
                                                        ? "bg-blue shadow-lg shadow-blue-500/20"
                                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                <span className="text-[10px] uppercase opacity-60">
                                                    {index === 0 ? "Hôm nay" : format(date, "EEEE", { locale: vi })}
                                                </span>
                                                <span className="text-lg font-bold">
                                                    {format(date, "dd/MM")}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* CINEMA LIST */}
                                <div className="space-y-6">
                                    {isShowtimeLoading ? (
                                        <div className="text-center py-10 text-gray-400">Đang tải lịch chiếu...</div>
                                    ) : showtimes.length > 0 ? (
                                        showtimes.map((cinema: any) => (
                                            <div key={cinema._id} className="border border-white/10 rounded-2xl overflow-hidden">
                                                {/* Cinema Header */}
                                                <div className="p-4 bg-white/5 border-b border-white/10">
                                                    <h3 className="font-bold text-lg text-blue">{cinema.name}</h3>
                                                    <p className="text-xs text-gray-400 mt-1 italic">{cinema.address}</p>
                                                </div>

                                                {/* Formats (Mỗi format một dòng) */}
                                                <div className="p-4 space-y-6">
                                                    {cinema.formats.map((f: any, fIdx: number) => (
                                                        <div key={fIdx} className="space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                                                                    {f.format}
                                                                </span>
                                                                <div className="h-[1px] flex-1 bg-white/5" />
                                                            </div>

                                                            {/* Showtime Buttons */}
                                                            <div className="flex flex-wrap gap-3">
                                                                {f.showtimes.map((st: any) => (
                                                                    <Link
                                                                        key={st._id}
                                                                        href={`/booking/${st._id}`}
                                                                        className="group relative bg-neutral-800 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-lg px-4 py-2 transition-all"
                                                                    >
                                                                        <div className="text-sm font-bold group-hover:text-white">
                                                                            {format(new Date(st.startTime), "HH:mm")}
                                                                        </div>
                                                                        <div className="text-[10px] text-gray-500 group-hover:text-blue-200">
                                                                            ~{format(new Date(st.endTime), "HH:mm")}
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>



                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-500">
                                            Rất tiếc, không có suất chiếu nào cho ngày này.
                                        </div>
                                    )}
                                </div>
                            </>
                        )}


                    </div>
                    <div className="text-center mb-5">
                        <button
                            onClick={() => setShowPast(!showPast)}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition"
                        >
                            {showPast ? "Ẩn lịch chiếu quá khứ" : "Xem lịch chiếu trong quá khứ"}
                        </button>
                    </div>
                </div>





                {showPast && (
                    <div className="mt-16 mb-10  pl-5 ">
                        <SectionTitle title="Lịch chiếu trước đây" />

                        {/* DATE TABS */}
                        <div className="flex gap-4 overflow-x-auto pb-6 mt-6 custom-scrollbar ">
                            {uniquePastDates.map((date, index) => {
                                const isSelected =
                                    selectedPastDate &&
                                    isSameDay(date, selectedPastDate);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedPastDate(date)}
                                        className={cn(
                                            "flex flex-col items-center min-w-[80px] py-3 rounded-xl transition-all",
                                            isSelected
                                                ? "bg-red-600 shadow-lg shadow-red-500/20"
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
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

                        {/* FILTERED SHOWTIME LIST */}
                        <div className="space-y-6">
                            {pastShowtimesRaw
                                .map((cinema: any) => {
                                    const filteredFormats = cinema.formats.map((f: any) => ({
                                        ...f,
                                        showtimes: f.showtimes.filter((st: any) =>
                                            selectedPastDate
                                                ? isSameDay(
                                                    new Date(st.startTime),
                                                    selectedPastDate
                                                )
                                                : true
                                        )
                                    })).filter((f: any) => f.showtimes.length > 0);

                                    if (filteredFormats.length === 0) return null;

                                    return (
                                        <div key={cinema._id} className="border border-white/10 rounded-2xl overflow-hidden">
                                            <div className="p-4 bg-white/5 border-b border-white/10">
                                                <h3 className="font-bold text-lg text-blue-500">
                                                    {cinema.name}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1 italic">
                                                    {cinema.address}
                                                </p>
                                            </div>

                                            <div className="p-4 space-y-6">
                                                {filteredFormats.map((f: any, fIdx: number) => (
                                                    <div key={fIdx} className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                                                                {f.format}
                                                            </span>
                                                            <div className="h-[1px] flex-1 bg-white/5" />
                                                        </div>

                                                        <div className="flex flex-wrap gap-3">
                                                            {f.showtimes.map((st: any) => (
                                                                <Link
                                                                    key={st._id}
                                                                    href={`/booking/${st._id}`}
                                                                    className="cursor-pointer bg-neutral-800 border border-white/10 rounded-lg px-4 py-2"
                                                                >
                                                                    <div className="text-sm font-bold">
                                                                        {format(new Date(st.startTime), "HH:mm")}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-500">
                                                                        ~{format(new Date(st.endTime), "HH:mm")}
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}

            </div>

            {/* TRAILER MODAL */}
            {showTrailer && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center px-4"
                    onClick={() => setShowTrailer(false)}
                >
                    <div
                        className="w-full max-w-[860px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            className="w-full aspect-video"
                            src={movie.trailer}
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
}

