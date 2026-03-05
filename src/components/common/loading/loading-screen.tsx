export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-5 flex items-center justify-center bg-[#050505]">
      
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <img
          src="/bingebox_logo.png"
          alt="BingeBox Logo"
          className="w-40 animate-pulse select-none"
        />

        {/* Loading text */}
        <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">
          Loading...
        </p>

        {/* Progress line */}
        <div className="w-40 h-[2px] bg-white/10 overflow-hidden rounded">
          <div className="h-full w-1/2 bg-blue-500 animate-loading-bar"></div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-loading-bar {
          animation: loadingBar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}