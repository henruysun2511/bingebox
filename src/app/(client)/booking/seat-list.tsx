"use client";
import { useSeatsByShowtime } from "@/queries/useSeatQuery";
import { usePreviewTicketPrice } from "@/queries/useTicketPrice";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { holdSeat, releaseSeat, useSeatSocket } from "@/hooks/useSeatSocket";
import SeatItemClient from "./seat-item";

interface SeatItem {
    _id: string;
    code: string;
    row: string;
    column?: number | null;
    status: string;
    isBlocked?: boolean;
    isCoupleSeat?: boolean;
    partnerSeat?: string;
    seatType?: { name: string; price: number; color: string };
    price?: number;
}

interface Props {
    showtimeId: string;
    selectedSeats: SeatItem[];
    setSelectedSeats: React.Dispatch<React.SetStateAction<SeatItem[]>>;
}

const findPartnerSeat = (allSeats: SeatItem[], seat: SeatItem) => {
    const seatNumber = parseInt(seat.code.replace(/[^\d]/g, ""), 10);
    const isEven = seatNumber % 2 === 0;
    const partnerCode = isEven
        ? seat.code.replace(/\d+$/, String(seatNumber - 1))
        : seat.code.replace(/\d+$/, String(seatNumber + 1));
    return allSeats.find(
        (s) => s.code === partnerCode && s.row === seat.row
    );
};

const groupRows = (seats: SeatItem[]) => {
    const grouped: Record<string, SeatItem[]> = {};
    seats.forEach((seat) => {
        if (!grouped[seat.row]) grouped[seat.row] = [];
        grouped[seat.row].push(seat);
    });
    return Object.keys(grouped)
        .sort()
        .map((rowKey) => ({
            rowKey,
            seats: grouped[rowKey].sort(
                (a, b) => (a.column || 0) - (b.column || 0)
            ),
        }));
};

export default function SeatListClient({ showtimeId, selectedSeats, setSelectedSeats }: Props) {
    const { data: resData, isLoading } = useSeatsByShowtime(showtimeId);
    const seats = resData?.data ?? [];
    const [rows, setRows] = useState<{ rowKey: string; seats: SeatItem[] }[]>([]);
    const [loadingSeats, setLoadingSeats] = useState<Set<string>>(new Set());
    const { mutate: previewPrice } = usePreviewTicketPrice();
    useSeatSocket(showtimeId);

    const selectedRef = useRef(selectedSeats);
    selectedRef.current = selectedSeats;

    useEffect(() => {
        return () => {
            selectedRef.current.forEach((s) => releaseSeat(showtimeId, s._id));
        };
    }, []);

    useEffect(() => {
        if (Array.isArray(seats)) setRows(groupRows(seats));
    }, [seats]);

    const toggleSeat = useCallback(
        (seat: SeatItem) => {
            if (loadingSeats.size > 0) return;

            const isCouple = seat.seatType?.name === "Ghế đôi";
            const partnerSeat = findPartnerSeat(seats, seat);
            const isExisted = selectedSeats.some((s) => s._id === seat._id);

            if (isExisted) {
                releaseSeat(showtimeId, seat._id);
                if (isCouple && partnerSeat) releaseSeat(showtimeId, partnerSeat._id);
                setSelectedSeats(
                    isCouple
                        ? selectedSeats.filter(
                            (s) => s._id !== seat._id && s._id !== partnerSeat?._id
                        )
                        : selectedSeats.filter((s) => s._id !== seat._id)
                );
            } else {
                holdSeat(showtimeId, seat._id);
                if (isCouple) {
                    if (!partnerSeat || partnerSeat.status !== "AVAILABLE") {
                        return toast.warning("Ghế đôi này không khả dụng đủ cặp");
                    }
                    holdSeat(showtimeId, partnerSeat._id);
                    setSelectedSeats([
                        ...selectedSeats,
                        { ...seat, price: seat.seatType?.price || 0 },
                        { ...partnerSeat, price: partnerSeat.seatType?.price || 0 },
                    ]);
                } else {
                    setSelectedSeats([
                        ...selectedSeats,
                        { ...seat, price: seat.seatType?.price || 0 },
                    ]);
                }

                setLoadingSeats((prev) => new Set(prev).add(seat._id));

                previewPrice(
                    { seatId: seat._id, showtimeId },
                    {
                        onSuccess: (res: any) => {
                            const priceFromServer = res.data.data.price;
                            setSelectedSeats((prev) =>
                                prev.map((s) =>
                                    s._id === seat._id ||
                                    (isCouple && s._id === partnerSeat?._id)
                                        ? { ...s, price: priceFromServer }
                                        : s
                                )
                            );
                        },
                        onError: () => console.error("Cập nhật giá thực tế thất bại"),
                        onSettled: () => {
                            setLoadingSeats((prev) => {
                                const next = new Set(prev);
                                next.delete(seat._id);
                                return next;
                            });
                        },
                    }
                );
            }
        },
        [showtimeId, selectedSeats, seats, setSelectedSeats, previewPrice, loadingSeats]
    );

    if (isLoading) return <div className="text-center py-20 italic text-neutral-500">Đang tải sơ đồ ghế...</div>;

    return (
        <div data-theme-fixed className="flex flex-col items-center w-full py-8">
            <div className="w-full max-w-2xl mb-16">
                <div className="w-full h-1.5 bg-blue shadow-[0_0_20px_var(--color-selected)] rounded-full mb-4" />
                <p className="text-center text-neutral-500 tracking-[1em] uppercase text-xs">Màn hình</p>
            </div>

            <div className="w-full overflow-x-auto pb-6 cursor-grab active:cursor-grabbing custom-scrollbar">
                <div className="flex flex-col items-center min-w-max mx-auto px-4">
                    <div className="space-y-3 inline-block">
                        {rows.map((row) => (
                            <div key={row.rowKey} className="flex items-center gap-4">
                                <div className="w-6 font-bold text-neutral-600 text-sm sticky left-0 bg-transparent backdrop-blur-sm z-10">
                                    {row.rowKey}
                                </div>
                                <div className="flex gap-1.5">
                                    {row.seats.map((seat) => (
                                        <SeatItemClient
                                            key={seat._id}
                                            seat={seat}
                                            isSelected={selectedSeats.some((s) => s._id === seat._id)}
                                            onClick={() => toggleSeat(seat)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-neutral-400">
                {[
                    { color: "bg-neutral-800", label: "Có thể chọn" },
                    { color: "bg-selected", label: "Đang chọn" },
                    { color: "bg-hold", label: "Đang giữ chỗ" },
                    { color: "bg-sold grayscale", label: "Đã bán" },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color}`} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
