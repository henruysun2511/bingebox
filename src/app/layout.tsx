import { AuthInit } from "@/components/provider/AuthInit";
import QueryProvider from "@/components/provider/QueryClient";
import { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font",
});

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const res = await SettingService.getSettings();
//     const settings = res.data?.data;
    
//     return {
//       title: settings?.metaTitle || "BingeBox",
//       description: settings?.metaDescription,
//       icons: {
//         icon: settings?.logo || "/favicon.ico",
//         apple: settings?.logo || "/favicon.ico",
//       },
//     };
//   } catch (error) {
//     return { title: "BingeBox - Movie" };
//   }
// }



export const metadata: Metadata = {
  title: "BingeBox Cinema",
  description: "Website đặt vé xem phim trực tuyến",
  icons: {
    icon: "/bingebox_logo.png",
    apple: "/bingebox_logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <QueryProvider>
          <AuthInit />
          {children} 
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
