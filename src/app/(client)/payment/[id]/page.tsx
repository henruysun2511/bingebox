"use client";

import LoadingScreen from "@/components/common/loading/loading-screen";
import { useBookingDetail, useFakeFail, useFakePay } from "@/queries/useBookingQuery";
import { differenceInSeconds, format } from "date-fns";
import {
    Calendar,
    Clock,
    CreditCard,
    MapPin,
    Ticket,
    Utensils,
    XCircle
} from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.id as string;

    // Lấy dữ liệu chi tiết booking
    const { data: resData, isLoading } = useBookingDetail(bookingId);
    const bookingData = resData?.data;
    const booking = bookingData?.booking;
    const tickets = bookingData?.tickets || [];

    // Hook thanh toán/hủy (Fake)
    const { mutate: pay, isPending: isPaying } = useFakePay();
    const { mutate: fail, isPending: isFailing } = useFakeFail();

    // State cho countdown
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (booking?.expiresAt) {
            const timer = setInterval(() => {
                const now = new Date();
                const expire = new Date(booking.expiresAt);
                const diff = differenceInSeconds(expire, now);

                if (diff <= 0) {
                    clearInterval(timer);
                    setTimeLeft(0);
                    toast.error("Giao dịch đã hết hạn!", {
                        description: "Hệ thống sẽ đưa bạn quay lại trang chủ."
                    });
                    setTimeout(() => router.push("/"), 2000);
                } else {
                    setTimeLeft(diff);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [booking?.expiresAt, router]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    if (isLoading) return <LoadingScreen />;

    if (!booking) notFound();

    const handlePayment = () => {
        pay(bookingId, {
            onSuccess: () => {
                toast.success("Thanh toán thành công!");
                router.push(`/profile`);
            }
        });
    };

    const handleCancel = () => {
        fail(bookingId, {
            onSuccess: () => {
                toast.warning("Đã hủy giao dịch");
                router.push("/");
            }
        });
    };

    return (
        <div className="container mx-auto py-10 mt-20 max-w-5xl">
            {/* Countdown Header */}
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3 text-orange-500">
                    <Clock className="animate-pulse" />
                    <span className="font-medium">Thời gian thanh toán còn lại:</span>
                </div>
                <span className="text-3xl font-mono font-bold text-orange-500">
                    {formatTime(timeLeft)}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CỘT TRÁI: THÔNG TIN VÉ & QR */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-neutral-900 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Ticket className="text-blue" /> Chi tiết vé của bạn
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tickets.map((ticket: any) => (
                                <div key={ticket._id} className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 flex items-center gap-4">
                                    <img src={ticket.qrCode} alt="QR" className="w-24 h-24 bg-white p-1 rounded-lg" />
                                    <div>
                                        <p className="text-white font-bold text-lg">Ghế: {ticket.seat?.code || "N/A"}</p>
                                        <p className="text-sm text-neutral-400">Loại: {ticket.seat?.seatType?.name || "N/A"}</p>
                                        <p className="text-blue font-semibold mt-1">{ticket.price.toLocaleString()}đ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border border-neutral-900 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Utensils className="text-orange-500" /> Đồ ăn kèm
                        </h2>
                        {booking.foods.length > 0 ? (
                            <div className="space-y-4">
                                {booking.foods.map((item: any) => (
                                    <div key={item._id} className="flex justify-between items-center text-neutral-300">
                                        <span>{item.foodId.name} <b className="text-white">x{item.quantity}</b></span>
                                        <span className="font-medium">{(item.priceAtBooking * item.quantity).toLocaleString()}đ</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500 italic">Không có đồ ăn đi kèm</p>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: TÓM TẮT THANH TOÁN */}
                <div className="space-y-6">
                    <div className="bg-card border border-neutral-900 rounded-2xl p-6 shadow-xl sticky top-28">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white uppercase mb-2">{booking.showtime.movie.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                                    {booking.showtime.movie.agePermission}
                                </span>
                                <span>• {booking.showtime.room.format?.name || "Standard"}</span>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-b border-neutral-800 py-6 my-6 border-dashed">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-neutral-500 mt-1" />
                                <div>
                                    <p className="text-white font-medium">{booking.showtime.room.name}</p>
                                    <p className="text-xs text-neutral-400">Rạp Beta Cinema</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="text-neutral-500 mt-1" />
                                <div>
                                    <p className="text-white font-medium">
                                        {format(new Date(booking.showtime.startTime), "HH:mm")} - {format(new Date(booking.showtime.startTime), "dd/MM/yyyy")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-neutral-400">
                                <span>Tạm tính</span>
                                <span>{booking.totalAmount.toLocaleString()}đ</span>
                            </div>

                            <div className="flex justify-between text-neutral-400">
                                <span>Giảm giá</span>
                                <span>-{booking.discountAmount.toLocaleString()}đ</span>
                            </div>

                            <div className="flex justify-between text-neutral-400">
                                <span>Điểm sử dụng</span>
                                <span>-{booking.pointsUsed} điểm</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Điểm thưởng</span>
                                <span>+{booking.pointsEarned} điểm</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
                                <span className="text-lg font-bold text-white">Tổng tiền</span>
                                <span className="text-2xl font-bold text-blue tracking-tighter">
                                    {booking.finalAmount.toLocaleString()}đ
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handlePayment}
                                disabled={isPaying || isFailing || timeLeft === 0}
                                className="w-full bg-blue hover:bg-blue-600 disabled:bg-neutral-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <CreditCard size={20} />
                                {isPaying ? "ĐANG XỬ LÝ..." : "THANH TOÁN NGAY"}
                            </button>

                            <button
                                onClick={handleCancel}
                                disabled={isPaying || isFailing}
                                className="w-full bg-transparent hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/50 text-neutral-400 hover:text-red-500 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                            >
                                <XCircle size={18} />
                                HỦY GIAO DỊCH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

