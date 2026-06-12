"use client";
import LoadingScreen from "@/components/common/loading/loading-screen";
import { useTicketDetail } from "@/queries/useTicketQuery";
import { useParams } from "next/navigation";

export default function TicketDetailPage() {
    const { id } = useParams<{ id: string }>();

    // Gọi hook để lấy data dựa trên id từ URL
    const { data: ticketRes, isLoading, error } = useTicketDetail(id!);
    const ticket = ticketRes?.data;

    if (isLoading) return <LoadingScreen />;
    if (error) return <div className="text-center p-10 text-red-500">Lỗi khi tải dữ liệu vé.</div>;
    if (!ticket) return <div className="text-center p-10">Không tìm thấy vé.</div>;

    // Destructure dữ liệu

    const startTime = ticket.showtime.startTime;

    const formattedDate = new Date(startTime).toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = new Date(startTime).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="min-h-screen  text-white pb-20">

            {/* HEADER */}
            <div className="bg-blue-800 py-4 text-center text-lg font-semibold tracking-wider">
                THÔNG TIN ĐẶT VÉ
            </div>

            <div className="max-w-md mx-auto bg-white text-black rounded-xl shadow-xl mt-6 p-6 space-y-6">

                {/* PHIM */}
                <div>
                    <div className="text-blue font-semibold mb-2">Phim</div>
                    <div className="bg-gray-100 rounded-xl p-4 space-y-1">
                        <div className="font-bold text-lg">
                            {ticket.showtime.movie.name}
                        </div>
                        <div>{ticket.showtime.room.format.name}</div>
                        <div>{ticket.showtime.subtitle}</div>
                        <div className="text-sm text-gray-500">
                            {ticket.showtime.movie.agePermission} • {ticket.showtime.movie.duration} phút
                        </div>
                    </div>
                </div>

                <hr className="border-dashed border-gray-300" />

                {/* RẠP */}
                <div>
                    <div className="text-blue font-semibold mb-2">Rạp</div>
                    <div className="bg-gray-100 rounded-xl p-4 space-y-1">
                        <div className="font-semibold">
                            {ticket.showtime.room.cinema.name}
                        </div>
                        <div>
                            {formattedTime}
                        </div>
                        <div>
                            {formattedDate}
                        </div>
                        <div>
                            {ticket.showtime.room.name}
                        </div>
                    </div>
                </div>

                <hr className="border-dashed border-gray-300" />

                {/* GHẾ */}
                <div>
                    <div className="text-blue font-semibold mb-2">Ghế</div>
                    <div className="bg-gray-100 rounded-xl p-4">
                        <div className="font-semibold text-lg">
                            {ticket.seat?.code || "N/A"}
                        </div>
                        <div className="text-gray-600">
                            {ticket.seat?.seatType?.name || "Thường"}
                        </div>
                    </div>
                </div>

                <hr className="border-dashed border-gray-300" />

                {/* GIÁ */}
                <div>
                    <div className="text-blue font-semibold mb-2">Thanh toán</div>
                    <div className="bg-gray-100 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-gray-600">Tổng tiền</span>
                        <span className="text-blue-600 font-bold text-xl">
                            {ticket.price.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                </div>

                {/* QR CODE */}
                <div className="text-center pt-4">
                    <div className="text-blue font-semibold mb-2">
                        Mã QR Check-in
                    </div>
                    <img
                        src={ticket.qrCode}
                        alt="QR Code"
                        className="mx-auto w-40 h-40"
                    />
                </div>

                {/* STATUS */}
                <div className="text-center pt-2">
                    <span className="px-4 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        {ticket.status === "paid" ? "Đã thanh toán" : ticket.status}
                    </span>
                </div>

                {/* FOOTER MESSAGE */}
                <div className="text-center pt-6 italic text-blue-600">
                    Chúc quý khách xem phim vui vẻ
                </div>
            </div>
        </div>
    );
}