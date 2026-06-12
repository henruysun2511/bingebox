import { ArrowRight, Newspaper } from "lucide-react";

export default function BlogBanner() {
  return (
    <div data-theme-fixed className="relative w-full h-[600px] overflow-hidden group">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://wallpapercave.com/wp/wp10254487.jpg"
          alt="Blog Background"
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        />

        {/* overlays */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-overlay via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 backdrop-blur-md">
            <Newspaper size={16} className="text-red-400" />
            <span className="text-xs font-bold text-red-300 uppercase tracking-widest">
              Tin tức điện ảnh
            </span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter text-white">
            BLOG <br />
            <span className="bg-gradient-to-r from-red-400 via-white to-red-500 bg-clip-text text-transparent italic">
              ĐIỆN ẢNH
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-lg border-l-2 border-red-500 pl-6">
            Cập nhật tin tức mới nhất về phim ảnh, hậu trường điện ảnh,
            review phim và những câu chuyện thú vị từ thế giới điện ảnh.
          </p>

          {/* Button */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95">
              Xem bài viết <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-12 right-6 hidden lg:flex gap-4 animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-40">
            <p className="text-red-400 font-black text-2xl">200+</p>
            <p className="text-gray-400 text-xs font-medium uppercase">
              Bài viết
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-40">
            <p className="text-red-400 font-black text-2xl">50+</p>
            <p className="text-gray-400 text-xs font-medium uppercase">
              Chủ đề
            </p>
          </div>
        </div>
      </div>

      {/* Light particles */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-red-400 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full blur-2xl animate-pulse delay-700" />
    </div>
  );
}
