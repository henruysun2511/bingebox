"use client";

import { addDays, format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar1,
  ChevronRight,
  Clock1,
  History,
  Info,
  MapPin,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import SectionTitle from "@/components/common/title/section-title";
import { Button } from "@/components/ui/button";
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

  if (isMovieLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-golden">Đang tải...</div>;
  if (!movie) return <div className="min-h-screen bg-black flex items-center justify-center">Không tìm thấy phim</div>;

  return (
    <div className="min-h-screen text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-20">
        
        {/* --- SECTION 2: THÔNG TIN PHIM --- */}
        <div className="relative z-5 flex flex-col md:flex-row gap-10 items-center md:items-start bg-neutral-900/30 p-8 rounded-3xl border border-white/5">
          <div className="relative w-64 shrink-0 group cursor-pointer" onClick={() => setShowTrailer(true)}>
            <div className="shadow-[0_20px_50px_rgba(0,0,0,1)] rounded-xl overflow-hidden border border-white/10">
              <img src={movie.poster} alt={movie.name} className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <PlayCircle size={60} className="text-blue" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-golden text-black px-3 py-1 rounded-md text-xs font-black">{movie.agePermission}</span>
              <span className="text-neutral-400 text-sm flex items-center gap-1"><Clock1 size={14} /> {movie.duration} phút</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6 leading-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
              {movie.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm text-neutral-300">
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
                        "flex flex-col items-center min-w-[110px] py-4 rounded-2xl transition-all border shrink-0",
                        active ? "bg-blue border-blue shadow-[0_10px_20px_rgba(0,74,173,0.3)]" : "bg-neutral-900 border-white/5 hover:border-white/20"
                      )}
                    >
                      <span className="text-[10px] uppercase font-bold opacity-60 mb-1">{i === 0 ? "Hôm nay" : format(date, "EEEE", { locale: vi })}</span>
                      <span className="text-xl font-black">{format(date, "dd/MM")}</span>
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
                      <div key={cinema._id} className="bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                          <div>
                            <h3 className="text-blue font-bold text-xl uppercase tracking-tight">{cinema.name}</h3>
                            <p className="text-neutral-500 text-xs flex items-center gap-1 mt-1 italic"><MapPin size={12} /> {cinema.address}</p>
                          </div>
                          <Button variant="ghost" className="text-golden hover:text-golden hover:bg-golden/10 p-0 h-auto text-xs uppercase tracking-widest font-bold">Xem bản đồ <ChevronRight size={14} /></Button>
                        </div>
                        <div className="p-6 flex flex-col gap-8">
                          {cinema.formats.map((f: any, idx: number) => (
                            <div key={idx} className="space-y-4">
                              <span className="text-[10px] font-black bg-blue/10 text-blue border border-blue/20 px-3 py-1 rounded-md uppercase tracking-widest">{f.format}</span>
                              <div className="flex flex-wrap gap-3">
                                {f.showtimes.map((st: any) => (
                                  <Link key={st._id} href={`/booking/${st._id}`} className="group bg-neutral-800/50 hover:bg-blue border border-white/5 hover:border-blue px-6 py-3 rounded-xl transition-all text-center min-w-[110px]">
                                    <p className="font-black text-lg group-hover:scale-110 transition-transform">{format(new Date(st.startTime), "HH:mm")}</p>
                                    <p className="text-[10px] text-neutral-500 group-hover:text-blue-100 italic">~{format(new Date(st.endTime), "HH:mm")}</p>
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
              <div className="pt-10 border-t border-white/5">
                <button
                  onClick={() => {
                    setShowPast(!showPast);
                    if (!selectedPastDate && uniquePastDates.length > 0) setSelectedPastDate(uniquePastDates[0]);
                  }}
                  className={cn(
                    "mx-auto flex items-center gap-2 px-8 py-3 rounded-full transition-all text-sm font-bold uppercase tracking-widest border",
                    showPast ? "bg-red-600 border-red-600" : "bg-white/5 hover:bg-white/10 border-white/10"
                  )}
                >
                  <History size={18} className={showPast ? "text-white" : "text-golden"} />
                  {showPast ? "Đang xem lịch cũ" : "Xem lịch chiếu cũ (Demo)"}
                </button>

                {showPast && (
                  <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <p className="text-center text-neutral-500 text-xs mb-6 uppercase tracking-widest italic">Chọn một ngày trong quá khứ để xem lại suất chiếu</p>
                    <div className="flex gap-3 overflow-x-auto pb-6 custom-scrollbar justify-center">
                      {uniquePastDates.length > 0 ? (
                        uniquePastDates.map((date, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedPastDate(date)}
                            className={cn(
                              "min-w-[90px] py-3 rounded-xl border text-center transition-all shrink-0",
                              selectedPastDate && isSameDay(date, selectedPastDate) ? "bg-red-600 border-red-600 shadow-lg shadow-red-600/20" : "bg-neutral-900 border-white/5"
                            )}
                          >
                            <p className="text-[10px] opacity-50 uppercase">{format(date, "EEEE", { locale: vi })}</p>
                            <p className="font-bold">{format(date, "dd/MM")}</p>
                          </button>
                        ))
                      ) : (
                        <p className="text-neutral-600 italic">Không có dữ liệu quá khứ</p>
                      )}
                    </div>
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