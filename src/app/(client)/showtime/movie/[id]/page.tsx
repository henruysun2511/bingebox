"use client";

import { addDays, format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar1,
  Clock1,
  Info,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import LoadingScreen from "@/components/common/loading/loading-screen";
import SectionTitle from "@/components/common/title/section-title";
import { MovieStatusEnum } from "@/constants/enum";
import { cn } from "@/lib/utils";
import { useMovieDetail } from "@/queries/useMovieQuery";
import { useShowtimesByMovie } from "@/queries/useShowtimeQuery";

export default function MovieShowtimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showPast, setShowPast] = useState(false);
  const [selectedPastDate, setSelectedPastDate] = useState<Date | null>(null);
  const showtimeRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Data
  const { data: movieData, isLoading: isMovieLoading } = useMovieDetail(id);
  const movie = movieData?.data;

  // Fetch lịch chiếu cho tab hiện tại (7 ngày tới)
  const { data: showtimeData, isLoading: isShowtimeLoading } = useShowtimesByMovie(id, {
    date: selectedDate,
  });
  const showtimes = showtimeData?.data ?? [];

  // Fetch TẤT CẢ lịch chiếu để lọc ra các ngày trong quá khứ
  const { data: allShowtimeData } = useShowtimesByMovie(id, {});
  const allShowtimesRaw = allShowtimeData?.data ?? [];

  // 2. Xử lý Logic
  const isComingSoon = movie?.status === MovieStatusEnum.COMING_SOON;
  const dateTabs = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Lấy danh sách các ngày duy nhất có suất chiếu trong quá khứ
  const uniquePastDates = useMemo(() => {
    const datesMap = new Map();
    allShowtimesRaw.forEach((cinema: any) => {
      cinema.formats.forEach((f: any) => {
        f.showtimes.forEach((st: any) => {
          const startTime = new Date(st.startTime);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (startTime < today) {
            const dateStr = format(startTime, "yyyy-MM-dd");
            if (!datesMap.has(dateStr)) {
              datesMap.set(dateStr, startTime);
            }
          }
        });
      });
    });
    return Array.from(datesMap.values()).sort((a: any, b: any) => b.getTime() - a.getTime());
  }, [allShowtimesRaw]);

  // Lọc dữ liệu hiển thị cho phần "Lịch chiếu cũ"
  const pastShowtimesToRender = useMemo(() => {
    if (!selectedPastDate) return [];
    return allShowtimesRaw.map((cinema: any) => {
      const filteredFormats = cinema.formats.map((f: any) => ({
        ...f,
        showtimes: f.showtimes.filter((st: any) => isSameDay(new Date(st.startTime), selectedPastDate))
      })).filter((f: any) => f.showtimes.length > 0);

      return { ...cinema, formats: filteredFormats };
    }).filter((cinema: any) => cinema.formats.length > 0);
  }, [selectedPastDate, allShowtimesRaw]);

  if (isMovieLoading) return <LoadingScreen />
  if (!movie) return <div className="min-h-screen bg-black flex items-center justify-center">Không tìm thấy phim</div>;

  return (
    <div className="min-h-screen text-white pb-20 ">
      <div className="max-w-7xl mx-auto px-6 pt-20">

        {/* --- SECTION 2: THÔNG TIN PHIM --- */}
        <div className="relative z-5 bg-white/5 p-6 rounded-lg flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div className="relative w-64 shrink-0 group cursor-pointer" onClick={() => setShowTrailer(true)}>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img src={movie.poster} alt={movie.name} className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <PlayCircle size={60} className="text-blue" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-yellow-500 text-black font-semibold px-3 py-1 rounded-md text-sm">{movie.agePermission}</span>
              <span className="text-neutral-400 text-sm flex items-center gap-1"><Clock1 size={14} /> {movie.duration} phút</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
              {movie.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm text-white/80">
              <p><span className="text-neutral-500 font-medium">Đạo diễn:</span> {movie.director}</p>
              <p><span className="text-neutral-500 font-medium">Quốc gia:</span> {movie.nationality}</p>
              <p className="col-span-1 md:col-span-2"><span className="text-neutral-500 font-medium">Thể loại:</span> {movie.categories?.map((c: any) => c.name).join(", ")}</p>
              <div className="col-span-1 md:col-span-2 mt-2">
                <p className="text-neutral-500 font-medium mb-1">Nội dung:</p>
                <p className="text-neutral-400 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">{movie.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: LỊCH CHIẾU --- */}
        <div className="mt-5" ref={showtimeRef}>
          <div className="flex items-center justify-between mb-10">
            <SectionTitle title="Lịch chiếu phim" />
          </div>

          {isComingSoon ? (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-20 text-center">
              <Calendar1 className="mx-auto mb-4 text-neutral-600" size={48} />
              <h2 className="text-xl font-bold">Phim chưa có lịch chiếu</h2>
              <p className="text-neutral-500">Dự kiến khởi chiếu: {format(new Date(movie.releaseDate), "dd/MM/yyyy")}</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Tabs Ngày Hiện Tại */}
              <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                {dateTabs.map((date, i) => {
                  const active = isSameDay(date, selectedDate);
                  return (
                    <button
                      key={i}
                      onClick={() => { setSelectedDate(date); setShowPast(false); }}
                      className={cn(
                        "flex flex-col items-center min-w-[80px] py-3 rounded-xl transition-all",
                        active ? "bg-blue shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"
                      )}
                    >
                      <span className="text-[10px] uppercase opacity-60">{i === 0 ? "Hôm nay" : format(date, "EEEE", { locale: vi })}</span>
                      <span className="text-lg font-bold">{format(date, "dd/MM")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Danh sách rạp & Suất chiếu */}
              <div className="grid gap-6">
                {isShowtimeLoading ? (
                  <div className="py-20 text-center text-neutral-500 italic">Đang tìm suất chiếu...</div>
                ) : (
                  (showPast ? pastShowtimesToRender : showtimes).length > 0 ? (
                    (showPast ? pastShowtimesToRender : showtimes).map((cinema: any) => (
                      <div key={cinema._id} className="border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-4 bg-white/5 border-b border-white/10">
                          <h3 className="font-bold text-lg text-blue">{cinema.name}</h3>
                          <p className="text-xs text-gray-400 mt-1 italic">{cinema.address}</p>
                        </div>
                        <div className="p-4 space-y-6">
                          {cinema.formats.map((f: any, idx: number) => (
                            <div key={idx} className="space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold uppercase tracking-wider text-gray-300">{f.format}</span>
                                <div className="h-[1px] flex-1 bg-white/5" />
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {f.showtimes.map((st: any) => (
                                  <Link key={st._id} href={`/booking/${st._id}`} className="group bg-neutral-800 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-lg px-4 py-2 transition-all">
                                    <div className="text-sm font-bold group-hover:text-white">{format(new Date(st.startTime), "HH:mm")}</div>
                                    <div className="text-[10px] text-gray-500 group-hover:text-blue-200">~{format(new Date(st.endTime), "HH:mm")}</div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                      <Info className="mx-auto mb-2 text-neutral-600" />
                      <p className="text-neutral-500">Rất tiếc, hiện tại chưa có suất chiếu cho ngày này.</p>
                    </div>
                  )
                )}
              </div>

              {/* SECTION: LỊCH CHIẾU QUÁ KHỨ */}
              <div className="pt-10 border-t border-white/5 text-center">
                <button
                  onClick={() => {
                    setShowPast(!showPast);
                    if (!selectedPastDate && uniquePastDates.length > 0) setSelectedPastDate(uniquePastDates[0]);
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition"
                >
                  {showPast ? "Ẩn lịch chiếu quá khứ" : "Xem lịch chiếu trong quá khứ"}
                </button>

                {showPast && (
                  <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar justify-center">
                      {uniquePastDates.length > 0 ? (
                        uniquePastDates.map((date, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedPastDate(date)}
                            className={cn(
                              "flex flex-col items-center min-w-[80px] py-3 rounded-xl transition-all",
                              selectedPastDate && isSameDay(date, selectedPastDate) ? "bg-red-600 shadow-lg shadow-red-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"
                            )}
                          >
                            <span className="text-[10px] uppercase opacity-60">{format(date, "EEEE", { locale: vi })}</span>
                            <span className="text-lg font-bold">{format(date, "dd/MM")}</span>
                          </button>
                        ))
                      ) : (
                        <p className="text-neutral-600 italic">Không có dữ liệu quá khứ</p>
                      )}
                    </div>

                    {/* Past Cinema Cards */}
                    {pastShowtimesToRender.length > 0 && (
                      <div className="space-y-6 mt-6">
                        {pastShowtimesToRender.map((cinema: any) => (
                          <div key={cinema._id} className="border border-white/10 rounded-2xl overflow-hidden">
                            <div className="p-4 bg-white/5 border-b border-white/10">
                              <h3 className="font-bold text-lg text-blue">{cinema.name}</h3>
                              <p className="text-xs text-gray-400 mt-1 italic">{cinema.address}</p>
                            </div>
                            <div className="p-4 space-y-6">
                              {cinema.formats.map((f: any, fIdx: number) => (
                                <div key={fIdx} className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold uppercase tracking-wider text-gray-300">{f.format}</span>
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                  </div>
                                  <div className="flex flex-wrap gap-3">
                                    {f.showtimes.map((st: any) => (
                                      <Link key={st._id} href={`/booking/${st._id}`} className="bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 transition-all">
                                        <div className="text-sm font-bold">{format(new Date(st.startTime), "HH:mm")}</div>
                                        <div className="text-[10px] text-gray-500">~{format(new Date(st.endTime), "HH:mm")}</div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setShowTrailer(false)} />
          <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src={movie.trailer?.replace("watch?v=", "embed/") + "?autoplay=1"}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}