"use client";
import ActorList from "@/components/client/actor/actor-list";
import SectionTitle from "@/components/common/title/section-title";
import ActorBanner from "./actor-banner";

export default function ActorPage() {

    return (
        <>
            <div className="mt-15"></div>
            <ActorBanner />
            <div className="!max-w-[1400px] mx-auto px-10 py-10">

                <SectionTitle title="Danh sách diễn viên" />
                <ActorList />
            </div>

        </>
    );
}