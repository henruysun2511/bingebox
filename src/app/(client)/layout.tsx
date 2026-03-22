"use client";
import Footer from "@/components/client/footer/footer";
import Header from "@/components/client/header/header";
import { useGetSettings } from "@/queries/useSettingQuery";
import { ReactNode } from "react";


export default function ClientLayout({ children }: { children: ReactNode }) {
  const { data: settings } = useGetSettings();


  return (
    <div className="min-h-screen flex flex-col">
      <Header logo={settings?.logo || ""} />

      {/* Content */}
      <main className="flex-1 bg-gradient mt-5 overflow-x-hidden">
        {children}
      </main>

      {/* Footer luôn nằm dưới */}
      {settings && <Footer settings={settings} />}
    </div>
  );
}