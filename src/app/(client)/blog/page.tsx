"use client";

import BlogList from "@/components/client/blog/blog-list";
import SectionTitle from "@/components/common/title/section-title";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BaseStatusEnum } from "@/constants/enum";
import { useGetSettings } from "@/queries/useSettingQuery";
import Link from "next/link";
import { useEffect, useState } from "react";
import BlogBanner from "./blog-banner";

export default function BlogPage() {
    const { data: setting, isLoading } = useGetSettings();
    const [openPopup, setOpenPopup] = useState(false);
    const [activePopup, setActivePopup] = useState<{ image: string; link: string } | null>(null);

    useEffect(() => {
        if (setting?.popup) {
            // Lọc ra tất cả các popup đang Active trước
            const activePopups = setting.popup.filter(
                (p: any) => p.isActive === BaseStatusEnum.ACTIVE
            );

            // Lấy phần tử chỉ số 1 (phần tử thứ hai)
            const secondActivePopup = activePopups[1];

            if (secondActivePopup) {
                setActivePopup(secondActivePopup);
                setOpenPopup(true);
            }
        }
    }, [setting]);

    if (isLoading) return null;


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
            <div className="mt-15"></div>
            <BlogBanner />
            <div className="!max-w-[1400px] mx-auto px-20 py-20">
                <SectionTitle title="Bài viết nổi bật" />
                <BlogList />
            </div>

        </>
    );
}