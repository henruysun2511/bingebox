"use client";
import { useSeatsByShowtime } from "@/queries/useSeatQuery";
import { usePreviewTicketPrice } from "@/queries/useTicketPrice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SeatItemClient from "./seat-item";

interface Props {
    showtimeId: string;
    selectedSeats: any[];
    setSelectedSeats: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function SeatListClient({ showtimeId, selectedSeats, setSelectedSeats }: Props) {
    const { data: resData, isLoading } = useSeatsByShowtime(showtimeId);
    const [rows, setRows] = useState<any[]>([]);
    const { mutate: previewPrice } = usePreviewTicketPrice();

    useEffect(() => {
        const seats = resData?.data;
        if (seats && Array.isArray(seats)) {
            const groupedRows: { [key: string]: any[] } = {};

            // Nhóm ghế theo hàng (row: A, B, C...)
            seats.forEach((seat: any) => {
                if (!groupedRows[seat.row]) {
                    groupedRows[seat.row] = [];
                }
                groupedRows[seat.row].push(seat);
            });

            // Sắp xếp hàng theo chữ cái và ghế trong hàng theo cột
            const formattedRows = Object.keys(groupedRows)
                .sort()
                .map((rowKey) => ({
                    rowKey,
                    seats: groupedRows[rowKey].sort((a, b) => (a.column || 0) - (b.column || 0)),
                }));

            setRows(formattedRows);
        }
    }, [resData]);

    const toggleSeat = (seat: any) => {
        const isCouple = seat.seatType?.name === "Ghế đôi";
        const seatNumber = parseInt(seat.code.replace(/[^\d]/g, ''));
        const isEven = seatNumber % 2 === 0;

        const partnerCode = isEven
            ? seat.code.replace(/\d+$/, (seatNumber - 1).toString())
            : seat.code.replace(/\d+$/, (seatNumber + 1).toString());

        const partnerSeat = resData?.data.find((s: any) => s.code === partnerCode && s.row === seat.row);
        const isExisted = selectedSeats.find((s) => s._id === seat._id);

        if (isExisted) {
            // HỦY CHỌN: Cập nhật UI ngay lập tức
            if (isCouple) {
                setSelectedSeats(selectedSeats.filter(
                    (s) => s._id !== seat._id && s._id !== partnerSeat?._id
                ));
            } else {
                setSelectedSeats(selectedSeats.filter((s) => s._id !== seat._id));
            }
        } else {
            // CHỌN MỚI: Cập nhật UI màu xanh ngay lập tức (với giá tạm tính 0 hoặc giá mặc định)
            const initialSeat = { ...seat, price: seat.seatType?.price || 0 };

            if (isCouple) {
                if (partnerSeat && partnerSeat.status === "AVAILABLE") {
                    const initialPartner = { ...partnerSeat, price: partnerSeat.seatType?.price || 0 };
                    setSelectedSeats([...selectedSeats, initialSeat, initialPartner]);
                } else {
                    return toast.warning("Ghế đôi này không khả dụng đủ cặp");
                }
            } else {
                setSelectedSeats([...selectedSeats, initialSeat]);
            }

            // GỌI API NGẦM ĐỂ CẬP NHẬT GIÁ CHÍNH XÁC
            previewPrice(
                { seatId: seat._id, showtimeId },
                {
                    onSuccess: (res: any) => {
                        const priceFromServer = res.data.data.price;

                        // Cập nhật lại giá vé trong mảng selectedSeats mà không làm mất trạng thái xanh
                        setSelectedSeats((prev: any[]) => // Thêm kiểu any[] cho prev
                            prev.map((s: any) => // Thêm kiểu any cho s
                                (s._id === seat._id || (isCouple && s._id === partnerSeat?._id))
                                    ? { ...s, price: priceFromServer }
                                    : s
                            )
                        );
                    },
                    onError: () => {
                        // Nếu lỗi thì vẫn giữ màu xanh nhưng báo lỗi hoặc dùng giá mặc định
                        console.error("Cập nhật giá thực tế thất bại");
                    }
                }
            );
        }
    };

    if (isLoading) return <div className="text-center py-20 italic text-neutral-500">Đang tải sơ đồ ghế...</div>;

    return (
        <div className="flex flex-col items-center w-full py-8 ">
            {/* Màn hình */}
            <div className="w-full max-w-2xl mb-16">
                <div className="w-full h-1.5 bg-blue shadow-[0_0_20px_#0066FF] rounded-full mb-4" />
                <p className="text-center text-neutral-500 tracking-[1em] uppercase text-xs">Màn hình</p>
            </div>

            {/* Danh sách ghế */}
            <div className="w-full overflow-x-auto pb-6 cursor-grab active:cursor-grabbing custom-scrollbar">
                <div className="flex flex-col items-center min-w-max mx-auto px-4">
                    <div className="space-y-3 inline-block">
                        {rows.map((row) => (
                            <div key={row.rowKey} className="flex items-center gap-4">
                                {/* Tên hàng ghế */}
                                <div className="w-6 font-bold text-neutral-600 text-sm sticky left-0 bg-transparent backdrop-blur-sm z-10">
                                    {row.rowKey}
                                </div>

                                <div className="flex gap-1.5">
                                    {row.seats.map((seat: any) => (
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

            {/* Chú thích (Legend) */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-neutral-800" /> <span>Có thể chọn</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#0066FF]" /> <span>Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#f59e0b]" /> <span>Đang giữ chỗ</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#171717] grayscale" /> <span>Đã bán</span>
                </div>
            </div>
        </div>
    );
}