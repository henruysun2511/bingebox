import { ArrowRight, Users } from 'lucide-react';

export default function ActorBanner() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      {/* 1. Background Image với hiệu ứng mờ nhẹ và zoom khi hover */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://wallpapercave.com/wp/wp6103461.jpg"
          alt="Actors Background"
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        />
        {/* Overlays: Kết hợp nhiều lớp để tạo độ sâu */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* 2. Content Layer */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-md">
            <Users size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">
              Gương mặt điện ảnh
            </span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter text-white">
            NHỮNG NGÔI SAO <br />
            <span className="bg-gradient-to-r from-blue-400 via-white to-blue-500 bg-clip-text text-transparent italic">
              RỰC SÁNG
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-lg border-l-2 border-blue-500 pl-6">
            Khám phá hành trình sự nghiệp và những vai diễn để đời của những tài năng xuất chúng trên màn ảnh Việt.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95">
              Khám phá ngay <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* 3. Floating Feature Cards (Góc dưới bên phải) */}
        <div className="absolute bottom-12 right-6 hidden lg:flex gap-4 animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-40">
                <p className="text-blue-400 font-black text-2xl">500+</p>
                <p className="text-gray-400 text-xs font-medium uppercase">Diễn viên</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-40">
                <p className="text-blue-400 font-black text-2xl">1000+</p>
                <p className="text-gray-400 text-xs font-medium uppercase">Giải thưởng</p>
            </div>
        </div>
      </div>

      {/* Hiệu ứng hạt sáng bay (Particle-like effect) */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full blur-2xl animate-pulse delay-700" />
    </div>
  );
}