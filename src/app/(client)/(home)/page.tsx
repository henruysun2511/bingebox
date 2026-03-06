"use client";

import BlogSection from "@/components/client/blog/blog-section";
import Carousel from "@/components/client/carousel/carousel";
import MovieComingSoonList from "@/components/client/movie/movie-comingsoon-list";
import MovieNowShowingList from "@/components/client/movie/movie-nowshowing-list";
import PromotionList from "@/components/client/promotion/promotion-list";
import LoadingScreen from "@/components/common/loading/loading-screen";
import SectionTitle from "@/components/common/title/section-title";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BaseStatusEnum } from "@/constants/enum";
import { useGetSettings } from "@/queries/useSettingQuery";
import Link from "next/link";
import { useEffect, useState } from "react";
import ExpertReviews from "./expert-review";
import QuickTicketBuying from "./quick-ticket-buying";

export default function Home() {
  const { data: setting, isLoading } = useGetSettings();
  const [openPopup, setOpenPopup] = useState(false);
  const [activePopup, setActivePopup] = useState<{ image: string; link: string } | null>(null);

  useEffect(() => {
    if (setting?.popup) {
      const popup = setting.popup.find(
        (p: any) => p.isActive === BaseStatusEnum.ACTIVE
      );

      console.log("POPUP:", popup);

      if (popup) {
        setActivePopup(popup);
        setOpenPopup(true);
      }
    }
  }, [setting]);

  if (isLoading) return <LoadingScreen />;

  const activeBanners =
    setting?.banner
      ?.filter((item: any) => item?.isActive === BaseStatusEnum.ACTIVE)
      .map((item: any) => item?.image) || [];

  return (
    <>
      {/* POPUP DIALOG */}
      <Dialog open={openPopup} onOpenChange={setOpenPopup}>
        <DialogContent className="!max-w-[550px] md:max-w-[600px] p-0 overflow-hidden border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Thông báo khuyến mãi</DialogTitle>

          {activePopup && (
            <div className="relative group">
              <Link href={activePopup.link}>
                <img
                  src={activePopup.image || "/popup.png"}
                  alt=""
                  width={600}
                  height={800}
                  className="w-full h-full object-contain rounded-lg"
                />
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MAIN CONTENT */}
      <Carousel images={activeBanners} />


      <div className="!max-w-[1400px] mx-auto px-10 py-10">
        <div className="relative z-5 -mt-14">
          <QuickTicketBuying />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="flex-1 w-full">
            <SectionTitle title="Phim đang chiếu" />
            <MovieNowShowingList />

            <SectionTitle title="Phim sắp chiếu" />
            <MovieComingSoonList />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-[260px] shrink-0">
            <SectionTitle title="Khuyến mãi" />

            <PromotionList
              promotions={[
                "/images/promo1.jpg",
                "/images/promo2.jpg",
                "/images/promo3.jpg",
                "/images/promo4.jpg",
              ]}
            />
          </div>

        </div>



        <BlogSection />

        <ExpertReviews />
      </div>

    </>
  );
}