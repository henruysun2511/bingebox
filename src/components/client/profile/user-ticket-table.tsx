"use client";

import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useMyTickets } from "@/queries/useTicketQuery";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

export default function UserTicketTable() {
    const [page, setPage] = useState(1);
    const { data: ticketRes, isLoading, isError } = useMyTickets({
        page,
        limit: 10,
    });
    const tickets = ticketRes?.data || [];
    const pagination = ticketRes?.pagination;

    if (isLoading) {
        return <TicketTableSkeleton />;
    }

    if (isError) {
        return <div className="text-red-500 py-10 text-center">Có lỗi xảy ra khi tải danh sách vé.</div>;
    }

    if (!tickets || tickets.length === 0) {
        return <div className="text-neutral-500 py-10 text-center">Bạn chưa có giao dịch đặt vé nào.</div>;
    }

    return (

        <div>
            <div className="table-wrapper">

                <Table className="table-custom">

                    {/* ===== HEADER ===== */}
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">

                            <TableHead className="text-white font-semibold">
                                Phim
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Rạp / Phòng
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Suất chiếu
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Ghế
                            </TableHead>

                            <TableHead className="text-white font-semibold">
                                Mã QR
                            </TableHead>

                            <TableHead className="text-white font-semibold text-right">
                                Ngày đặt
                            </TableHead>

                        </TableRow>
                    </TableHeader>

                    {/* ===== BODY ===== */}
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow
                                key={ticket._id}
                            >

                                {/* ===== PHIM ===== */}
                                <TableCell className="py-5">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-white font-semibold tracking-wide">
                                            {ticket.showtime.movie.name}
                                        </span>

                                        <div className="flex gap-2">
                                            {ticket.showtime.movie.subtitle.map((sub) => (
                                                <span
                                                    key={sub}
                                                    className="text-[10px] 
                                 px-2 py-0.5 
                                 rounded-full 
                                 bg-white/10 
                                 text-white/70"
                                                >
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </TableCell>

                                {/* ===== RẠP ===== */}
                                <TableCell>
                                    <div>
                                        <p className="text-blue-200 font-medium">
                                            {ticket.showtime.room.cinema.name}
                                        </p>
                                        <p className="text-white/50 text-xs">
                                            {ticket.showtime.room.name}
                                        </p>
                                    </div>
                                </TableCell>

                                {/* ===== SUẤT CHIẾU ===== */}
                                <TableCell>
                                    <div>
                                        <p className="text-white font-bold">
                                            {format(new Date(ticket.showtime.startTime), "HH:mm")}
                                        </p>
                                        <p className="text-white/50 text-xs">
                                            {format(new Date(ticket.showtime.startTime), "dd/MM/yyyy")}
                                        </p>
                                    </div>
                                </TableCell>

                                {/* ===== GHẾ ===== */}
                                <TableCell>
                                    <span className="px-3 py-1 
                               rounded-full 
                               bg-blue-500/20 
                               text-blue-300 
                               text-sm font-medium">
                                        {ticket.seat?.code || "—"}
                                    </span>
                                </TableCell>

                                {/* ===== QR ===== */}
                                <TableCell>
                                    {ticket.qrCode && (
                                        <div className="w-20 h-20 
                                rounded-xl 
                                bg-white 
                                p-2 
                                shadow-lg 
                                hover:scale-105 
                                transition">
                                            <img
                                                src={ticket.qrCode}
                                                alt="QR"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    )}
                                </TableCell>

                                {/* ===== NGÀY ĐẶT ===== */}
                                <TableCell className="text-right text-white/50 text-sm">
                                    {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>

                </Table>


            </div>

            {pagination && (
                <div className="flex justify-center pt-4">
                    <DataPagination
                        page={pagination.page ?? 1}
                        totalPages={pagination.totalPages ?? 1}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>

    );
}

function TicketTableSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full bg-neutral-900 rounded-md" />
            ))}
        </div>
    );
}
