"use client";

import { useCreateBooking } from "@/queries/useBookingQuery";
import { handleError } from "@/utils/error";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OrderSummaryProps {
    showtime: any;
    step: number;
    setStep: (step: number) => void;
    selectedSeats: any[];
    selectedFoods: any[];
    selectedVoucher: any;
    pointsUsed: number;
}

export default function OrderSummary({
    showtime,
    step,
    setStep,
    selectedSeats,
    selectedFoods,
    selectedVoucher,
    pointsUsed,
}: OrderSummaryProps) {
    const router = useRouter();
    const movie = showtime?.movie;
    const room = showtime?.room;
    const cinema = room?.cinema;
    const start = new Date(showtime?.startTime || 0);

    const totalSeatsPrice = selectedSeats.reduce((sum, seat) => {
        return sum + (seat.price || seat.seatType?.price || showtime?.price || 0);
    }, 0);

    // 2. Tính tiền đồ ăn (Giữ nguyên)
    const totalFoodsPrice = selectedFoods.reduce((sum, food) => {
        return sum + food.price * food.quantity;
    }, 0);

    // 3. Tổng cộng trước voucher và điểm
    const subTotal = totalSeatsPrice + totalFoodsPrice;

    // 4. Tính giảm giá voucher theo logic Backend:
    // Backend: Math.min(voucher.maxDiscountAmount, total)
    const discount = selectedVoucher
        ? Math.min(selectedVoucher.maxDiscountAmount, subTotal)
        : 0;

    // 5. Tổng cộng cuối cùng sau khi trừ Voucher và Điểm thưởng (nếu có)
    // Lưu ý: Đảm bảo pointsUsed đã được truyền vào từ props của BookingDetailPage
    const finalTotal = Math.max(0, subTotal - discount - (pointsUsed || 0));

    const { mutate: createBooking, isPending } = useCreateBooking();

    const handleNext = () => {
        // Step 1: Chọn ghế
        if (step === 1) {
            if (selectedSeats.length === 0) {
                return toast.error("Vui lòng chọn ít nhất một ghế");
            }
            setStep(2);
            return;
        }

        // Step 2: Chọn đồ ăn
        if (step === 2) {
            setStep(3);
            return;
        }

        // Step 3: Hoàn thành & Thanh toán
        if (step === 3) {
            // Chuẩn hóa dữ liệu theo IBookingBody
            const bookingPayload = {
                showtimeId: showtime._id,
                seatIds: selectedSeats.map((s: any) => s._id),
                foods: selectedFoods.map((f: any) => ({
                    foodId: f._id,
                    quantity: f.quantity
                })),
                voucherCode: selectedVoucher?.code || "",
                pointsUsed: pointsUsed,
            };
            console.log(bookingPayload);

            createBooking(bookingPayload, {
                onSuccess: (res: any) => {
                    toast.success("Đặt vé thành công!", {
                        description: "Hệ thống đang chuyển hướng sang trang thanh toán.",
                    });

                    const bookingId = res.data?.data._id;
                    router.push(`/payment/${bookingId}`);

                },
                onError: (error: any) => {
                    handleError(error);
                }
            });
        }
    };

    return (
        <div className="w-full lg:w-[450px] bg-[#0a0a0a] rounded-xl p-6 shadow-2xl border border-neutral-900 sticky top-24 h-fit">
            {/* Header: Poster & Info */}
            <div className="flex gap-4 mb-6">
                <div className="w-[120px] h-[180px] flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
                    <img
                        src={movie?.poster || "/no-image.png"}
                        alt={movie?.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <h2 className="text-lg font-bold text-white uppercase line-clamp-2">
                        {movie?.name}
                    </h2>
                    <p className="text-sm text-gray-400">{movie?.format || "2D"} • {movie?.duration} phút</p>
                    <div className="inline-block bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                        {movie?.agePermission || "K"}
                    </div>
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3 py-4 border-t border-neutral-800 border-dashed text-sm">
                <p className="text-white">
                    <span className="text-gray-400">Rạp:</span> {cinema?.name} - {room?.name}
                </p>
                <p className="text-white">
                    <span className="text-gray-400">Suất chiếu:</span>{" "}
                    {format(start, "HH:mm")} | {format(start, "dd/MM/yyyy")}
                </p>

                {/* Hiển thị ghế đã chọn */}
                {selectedSeats.length > 0 && (
                    <div className="mt-2 space-y-1 border-l-2 border-blue pl-3">
                        {selectedSeats.map((s) => (
                            <div key={s._id} className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">Ghế {s.code}:</span>
                                <span className="text-white font-medium">
                                    {(s.price || 0).toLocaleString()} đ
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hiển thị đồ ăn đã chọn */}
                {selectedFoods.length > 0 && (
                    <p className="text-white">
                        <span className="text-gray-400">Đồ ăn:</span>{" "}
                        {selectedFoods.map(f => `${f.name} (x${f.quantity})`).join(", ")}
                    </p>
                )}
            </div>

            {/* Chi tiết giá tiền */}
            <div className="space-y-2 py-4 border-t border-neutral-800 border-dashed text-sm">
                <div className="flex justify-between text-gray-400">
                    <span>Giá vé:</span>
                    <span>{totalSeatsPrice.toLocaleString()} đ</span>
                </div>

                {totalFoodsPrice > 0 && (
                    <div className="flex justify-between text-gray-400">
                        <span>Đồ ăn:</span>
                        <span>{totalFoodsPrice.toLocaleString()} đ</span>
                    </div>
                )}

                {/* Hiển thị giảm giá Voucher */}
                {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                        <div className="flex flex-col">
                            <span>Voucher ({selectedVoucher.code}):</span>
                            {subTotal < selectedVoucher.minOrderValue && (
                                <span className="text-[10px] text-red-500 italic">
                                    * Chưa đủ điều kiện (tối thiểu {selectedVoucher.minOrderValue.toLocaleString()} đ)
                                </span>
                            )}
                        </div>
                        <span>-{discount.toLocaleString()} đ</span>
                    </div>
                )}

                {/* Hiển thị giảm giá Điểm thưởng */}
                {pointsUsed > 0 && (
                    <div className="flex justify-between text-yellow-500">
                        <span>Dùng điểm:</span>
                        <span>-{pointsUsed.toLocaleString()} đ</span>
                    </div>
                )}
            </div>

            {/* Tổng cộng */}
            <div className="mt-4 flex justify-between items-center pt-4 border-t border-neutral-800">
                <span className="text-xl font-bold text-white">Tổng cộng</span>
                <span className="text-2xl font-bold text-orange-500">
                    {finalTotal.toLocaleString()} đ
                </span>
            </div>

            {/* Nút điều hướng */}
            <div className="flex gap-2 mt-8">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="flex-1 border border-neutral-700 text-white py-3 rounded-lg font-bold hover:bg-neutral-800 transition"
                    >
                        QUAY LẠI
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={isPending}
                    className={`flex-[2] py-3 rounded-lg font-bold transition uppercase flex items-center justify-center gap-2
    ${isPending
                            ? "bg-blue/60 cursor-not-allowed"
                            : "bg-blue hover:bg-blue-600"
                        }`}
                >
                    {isPending ? (
                        <>
                            <svg
                                className="w-4 h-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeDasharray="60"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Đang xử lý...
                        </>
                    ) : (
                        step === 3 ? "Hoàn thành" : "Tiếp tục"
                    )}
                </button>
            </div>
        </div>
    );
}