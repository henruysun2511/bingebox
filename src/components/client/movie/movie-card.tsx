
import { MovieStatusEnum } from "@/constants/enum";
import { SUBTITLE_TYPE_OPTIONS } from "@/constants/filter";
import { Movie } from "@/types/object";
import { Play, Ticket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MovieCardProps {
    movie: Movie;
    status?: string;
}

export default function MovieCard({ movie, status }: MovieCardProps) {
    const {
        _id,
        name,
        poster,
        categories,
        subtitle,
        format,
        agePermission,
        trailer,
    } = movie;

    const subtitleOption = subtitle.map((val) => {
        const option = SUBTITLE_TYPE_OPTIONS.find((opt) => opt.value === val);
        return option?.label || val;
    });

    const [showTrailer, setShowTrailer] = useState(false);
    console.log(trailer)


    return (
        <>
            <div className="w-[230px] group cursor-pointer">
                {/* Poster */}
                <div className="relative h-[320px] w-full overflow-hidden rounded-xl">
                    <img
                        src={poster || "/no-image.png"}
                        alt={name || "movie"}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

                    {/* Play Icon */}
                    <div
                        onClick={() => setShowTrailer(true)}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        <Play className="w-16 h-16 text-blue drop-shadow-xl" />
                    </div>

                    {/* Buy Ticket */}
                    {status === MovieStatusEnum.NOW_SHOWING && (
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300">
                            <Link href={`/showtime/movie/${_id}`}>
                                <button className="flex items-center whitespace-nowrap gap-2 bg-blue hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-lg transition">
                                    <Ticket className="w-4 h-4" />
                                    MUA VÉ NGAY
                                </button>
                            </Link>
                        </div>
                    )
                    }
                </div>

                {/* Badges */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded">
                        {agePermission || "N/A"}
                    </span>

                    <span className="bg-neutral-800 text-white text-[10px] px-2 py-1 rounded">
                        {subtitleOption?.length ? subtitleOption.join(', ') : "N/A"}
                    </span>

                    <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded">
                        {format?.length ? format.join(", ") : "N/A"}
                    </span>
                </div>

                {/* Name */}
                <Link href={`/movie/${_id}`}>
                    <h2 className="mt-3 text-white font-semibold text-lg line-clamp-2 hover:text-blue-400 transition">
                        {name || "N/A"}
                    </h2>
                </Link>

                {/* Categories (object[]) */}
                <p className="text-gray-400 text-sm mt-1">
                    Thể loại:{" "}
                    {categories?.length
                        ? categories.map((c) => c.name).join(", ")
                        : "N/A"}
                </p>
            </div >

           {showTrailer && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center px-4"
                    onClick={() => setShowTrailer(false)}
                >
                    <div
                        className="w-full max-w-[860px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            className="w-full aspect-video"
                            src={trailer}
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>

    );
}