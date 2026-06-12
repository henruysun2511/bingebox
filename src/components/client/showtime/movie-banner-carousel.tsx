"use client";

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { Calendar, Info, Star, Ticket } from 'lucide-react';
import Link from 'next/link';

const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
    else videoId = url.split("/").pop() || "";

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&enablejsapi=1`;
};

export const MovieBannerCarousel = ({ movies }: { movies: any[] }) => {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 10000, stopOnInteraction: false })
    ]);

    return (
        <section data-theme-fixed className="relative w-full h-[85vh] overflow-hidden bg-black" ref={emblaRef}>
            <div className="flex h-full w-full">
                {movies?.map((movie) => (
                    <div className="relative flex-[0_0_100%] w-full h-full" key={movie._id}>

                        {/* Video Background phủ kín màn hình */}
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] lg:w-[100vw] lg:h-[56.25vw] min-h-[100vh] min-w-[177.77vh]">
                                <iframe
                                    src={getYoutubeEmbedUrl(movie.trailer)}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    frameBorder="0"
                                ></iframe>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </div>

                        {/* Nội dung Banner */}
                        <div className="relative z-10 h-full container mx-auto px-6 md:px-12 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="max-w-3xl"
                            >
                                {/* 1. Thể loại phim lấy từ mảng categories */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {movie.categories?.map((cat: any) => (
                                        <span key={cat._id} className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 uppercase tracking-tight leading-none">
                                    {movie.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-bold">
                                    {/* 2. Định dạng phim (IMAX, 2D...) */}
                                    <div className="flex gap-2">
                                        {movie.format?.map((f: string) => (
                                            <span key={f} className="text-golden border border-golden/50 bg-golden/10 px-3 py-1 rounded">
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    <span className="text-neutral-300 flex items-center gap-2">
                                        {movie.duration || "134"} PHÚT
                                    </span>

                                    {/* 3. Ngày khởi chiếu */}
                                    <div className="flex items-center text-neutral-300 gap-2">
                                        <Calendar className="w-4 h-4 text-blue" />
                                        <span>
                                            {movie.releaseDate
                                                ? new Date(movie.releaseDate).toLocaleDateString('vi-VN')
                                                : "Đang cập nhật"
                                            }
                                        </span>
                                    </div>

                                    <div className="flex items-center text-yellow gap-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-white">8.5</span>
                                    </div>
                                </div>

                                {/* 4. Phụ đề/Thuyết minh */}
                                <div className="mb-6 flex gap-3 text-xs text-neutral-400 uppercase tracking-widest">
                                    {movie.subtitle?.map((sub: string) => (
                                        <span key={sub} className="border-r border-white/20 pr-3 last:border-none">{sub}</span>
                                    ))}
                                </div>

                                <p className="text-neutral-300 text-lg mb-10 line-clamp-3 leading-relaxed max-w-xl border-l-4 border-blue pl-6">
                                    {movie.description || "Sau những sự kiện chấn động, Sam Wilson chính thức nhận lấy danh hiệu Captain America và đối mặt với một âm mưu toàn cầu mới."}
                                </p>

                                <div className="flex items-center gap-6">
                                    <Link href={`/showtime/movie/${movie._id}`}>
                                        <button className="btn-custom !bg-blue hover:scale-105 px-10 py-4 text-lg shadow-[0_0_20px_rgba(0,74,173,0.4)]">
                                            <Ticket className="w-6 h-6" />
                                            ĐẶT VÉ NGAY
                                        </button>
                                    </Link>


                                    <Link href={`/movie/${movie._id}`}>
                                        <button className="flex items-center gap-2 text-white font-bold hover:text-golden transition-colors group">
                                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-golden transition-all">
                                                <Info className="w-5 h-5" />
                                            </div>
                                            XEM CHI TIẾT
                                        </button>
                                    </Link>

                                </div>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
