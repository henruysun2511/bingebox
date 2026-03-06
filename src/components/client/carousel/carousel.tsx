import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CarouselProps {
    images: string[];
}

export default function Carousel({ images }: CarouselProps) {
    const [active, setActive] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const lengthItems = images.length - 1;

    const nextSlide = () => {
        setActive((prev) => (prev + 1 > lengthItems ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActive((prev) => (prev - 1 < 0 ? lengthItems : prev - 1));
    };

    useEffect(() => {
        if (images.length <= 1) return;

        intervalRef.current = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [images]);

    return (
        <div className="relative w-full mt-10 h-[700px] overflow-hidden">
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
            >
                {images && images.length > 0 ? images.map((src, index) => (
                    <div
                        key={index}
                        className="min-w-full h-full shrink-0 relative"
                    >
                        <img
                            src={src}
                            alt={`banner-${index}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            draggable={false}
                        />
                    </div>
                )) : (<div
                    className="min-w-full h-full shrink-0 relative"
                >
                    <img
                        src="/banner.png"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        draggable={false}
                    />
                </div>)}
            </div>

            {/* Prev */}
            <button
                onClick={prevSlide}
                className="absolute z-10 cursor-pointer top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition"
            >
                <ChevronLeft size={20} />
            </button>

            {/* Next */}
            <button
                onClick={nextSlide}
                className="absolute z-10 cursor-pointer top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3">
                {images.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setActive(index)}
                        className={`cursor-pointer transition-all duration-500 z-10 ${active === index
                            ? "w-6 h-2 rounded-xl bg-white"
                            : "w-2 h-2 rounded-full bg-white/60"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
