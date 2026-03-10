"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");

    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    Cookies.set("accessToken", accessToken, { expires: 7 });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW data:", JSON.stringify(data));
        const user = data?.data?.user ?? data?.data ?? data?.user;
        console.log("user từ API:", user);  // ← user có đúng field không?

        setAuth(
          { username: user.username, role: user.role, avatar: user.avatar },
          accessToken
        );

        // Kiểm tra store ngay sau khi set
        console.log("store sau setAuth:", useAuthStore.getState());  // ← có user chưa?
        console.log("localStorage:", localStorage.getItem("auth-storage")); // ← đã ghi chưa?

        window.location.href = "/";
      })
      .catch(() => router.push("/auth/login"));
  }, [router, setAuth]);

  return (
    <div className="fixed inset-0 z-15 flex items-center justify-center bg-[#050505]">

      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <img
          src="/bingebox_logo.png"
          alt="BingeBox Logo"
          className="w-40 animate-pulse select-none"
        />

        {/* Loading text */}
        <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">
          Đang đăng nhập với Google...
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