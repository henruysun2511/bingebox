import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      {/* 404 Heading */}
      <div className="relative">
        <h1 className="text-[120px] md:text-[180px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-b from-[#004aad] to-[#3533cd] animate-pulse select-none">
          404
        </h1>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#004aad] rounded-full blur-sm opacity-50"></div>
      </div>

      {/* Message */}
      <h2 className="text-2xl md:text-3xl font-bold mt-8 text-white uppercase tracking-tight">
        Oops! Trang không tìm thấy
      </h2>
      
      <p className="text-gray-400 mt-4 max-w-lg text-lg leading-relaxed font-medium">
        Dường như bạn đã đi lạc vào một "vùng tối" của rạp phim. Đừng lo, hãy để chúng tôi đưa bạn trở về trang chủ để tiếp tục thưởng thức những bộ phim hay nhất!
      </p>

      {/* Back Button */}
      <Link 
        href="/" 
        className="btn-custom mt-10 px-8 py-4 text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
      >
        <Home className="w-6 h-5" />
        Trở về trang chủ
      </Link>

      {/* Sub-animation or decoration */}
      <div className="mt-16 flex gap-4 opacity-10 select-none">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" 
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
