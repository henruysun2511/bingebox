import { ArrowRight, Flame, MessageCircle } from "lucide-react";

export default function CommentBanner() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://wallpapercave.com/wp/wp6034976.jpg"
          alt="Discussion Background"
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        />

        {/* overlays */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/30 backdrop-blur-md">
            <MessageCircle size={16} className="text-purple-400" />
            <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
              Cộng đồng điện ảnh
            </span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter text-white">
            BÀN LUẬN <br />
            <span className="bg-gradient-to-r from-purple-400 via-white to-purple-500 bg-clip-text text-transparent italic">
              ĐIỆN ẢNH
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-lg border-l-2 border-purple-500 pl-6">
            Nơi người yêu phim chia sẻ cảm nhận, tranh luận về các tác phẩm
            điện ảnh, diễn viên và những khoảnh khắc đáng nhớ trên màn ảnh.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95">
              Tham gia thảo luận <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute bottom-12 right-6 hidden lg:flex gap-4 animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-40">
            <p className="text-purple-400 font-black text-2xl">5K+</p>
            <p className="text-gray-400 text-xs font-medium uppercase">
              Bài thảo luận
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-40">
            <p className="text-purple-400 font-black text-2xl">20K+</p>
            <p className="text-gray-400 text-xs font-medium uppercase">
              Bình luận
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-40">
            <p className="text-purple-400 font-black text-2xl flex items-center gap-1">
              <Flame size={18} /> Hot
            </p>
            <p className="text-gray-400 text-xs font-medium uppercase">
              Chủ đề nổi bật
            </p>
          </div>
        </div>
      </div>

      {/* Particles */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-500 rounded-full blur-2xl animate-pulse delay-700" />
    </div>
  );
}