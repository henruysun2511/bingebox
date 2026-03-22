import { AuthInit } from "@/components/provider/AuthInit";
import QueryProvider from "@/components/provider/QueryClient";
import { SETTING_QUERY_KEY } from "@/queries/useSettingQuery";
import { SettingService } from "@/services/setting.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { cache } from "react";
import { Toaster } from "sonner";
import "./globals.css";


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font",
});

const getSettings = cache(async () => {
  const res = await SettingService.getSettings();
  return res.data.data;
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();

    return {
      title: settings?.metaTitle || "BingeBox Cinema",
      description: settings?.metaDescription || "Website đặt vé xem phim trực tuyến",
      icons: {
        icon: settings?.logo || "/bingebox_logo.png",
        apple: settings?.logo || "/bingebox_logo.png",
      },
    };
  } catch (error) {
    return { title: "BingeBox - Movie" };
  }
}




export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: SETTING_QUERY_KEY,
    queryFn: getSettings,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <QueryProvider>
          <HydrationBoundary state={dehydratedState}>
            <AuthInit />
            {children}
            <Toaster position="top-right" richColors />
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
