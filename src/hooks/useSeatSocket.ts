import { SEAT_QUERY_KEY } from "@/queries/useSeatQuery";
import { getSocket } from "@/utils/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export const useSeatSocket = (showtimeId: string) => {
  const queryClient = useQueryClient();
  const joinedRef = useRef(false);
  const queryClientRef = useRef(queryClient);
  queryClientRef.current = queryClient;

  useEffect(() => {
    if (!showtimeId) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    if (!joinedRef.current) {
      socket.emit("join-showtime", showtimeId);
      joinedRef.current = true;
    }

    const handleSeatHeld = ({ seatId }: { seatId: string }) => {
      queryClientRef.current.setQueryData<any>(
        [...SEAT_QUERY_KEY, "by-showtime", showtimeId],
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((seat: any) =>
              seat._id === seatId ? { ...seat, status: "HOLD" } : seat
            ),
          };
        }
      );
    };

    const handleSeatReleased = ({ seatId }: { seatId: string }) => {
      queryClientRef.current.setQueryData<any>(
        [...SEAT_QUERY_KEY, "by-showtime", showtimeId],
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((seat: any) =>
              seat._id === seatId ? { ...seat, status: "AVAILABLE" } : seat
            ),
          };
        }
      );
    };

    socket.on("seat:held", handleSeatHeld);
    socket.on("seat:released", handleSeatReleased);

    return () => {
      socket.off("seat:held", handleSeatHeld);
      socket.off("seat:released", handleSeatReleased);
    };
  }, [showtimeId]);
};

export const holdSeat = (showtimeId: string, seatId: string) => {
  const socket = getSocket();
  socket.emit("hold-seat", { showtimeId, seatId });
};

export const releaseSeat = (showtimeId: string, seatId: string) => {
  const socket = getSocket();
  socket.emit("release-seat", { showtimeId, seatId });
};
