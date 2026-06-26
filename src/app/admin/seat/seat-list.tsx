import SeatItem from "@/app/admin/seat/seat-item";
import { Button } from "@/components/ui/button";
import { useSeatListByRoom, useUpdateSeatByRoom } from "@/queries/useSeatQuery";
import { useSeatTypeList } from "@/queries/useSeatTypeQuery";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import SeatEditor from "./seat-editor";
import { useSeatStore } from "@/stores/useSeatStore";

export default function SeatList({ roomId }: { roomId: string }) {
  const { data, isLoading } = useSeatListByRoom(roomId);
  const { data: categoryData } = useSeatTypeList();
  const categories = categoryData?.data || [];

  // Sử dụng Zustand store
  const {
    rows,
    selectedSeat,
    setInitialRows,
    initDefaultLayout,
    setSelectedSeat,
    addRowBelow,
    removeRow
  } = useSeatStore();

  useEffect(() => {
    if (data?.data) {
      setInitialRows(data.data, categories);
    }
  }, [data?.data, categories]);

  const { mutate: updateSeats, isPending: isUpdating } = useUpdateSeatByRoom();

  const handleSave = () => {
    const formattedSeats = rows.flatMap((row) => {
      let currentColumn = 1;
      return row.seats.map((seat: any) => {
        const seatPayload: any = {
          code: seat.code,
          row: row.rowKey,
          column: currentColumn++,
          isBlocked: seat.isBlocked,
          seatTypeId: seat.seatType?._id || seat.seatTypeId,
        };
        if (seat.isCoupleSeat) {
          seatPayload.isCoupleSeat = true;
          seatPayload.partnerSeatCode = seat.partnerSeatCode;
        }
        if (seat.isBlocked) {
          seatPayload.seatTypeId = undefined;
        }
        return seatPayload;
      });
    });

    updateSeats(
      { roomId, data: { seats: formattedSeats } },
      {
        onSuccess: () => {
          toast.success("Lưu sơ đồ ghế thành công!");
          setSelectedSeat(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Không thể lưu sơ đồ");
        }
      }
    );
  };

  if (isLoading) return <div className="p-10 text-zinc-500 italic">Đang tải sơ đồ ghế...</div>;

  return (
    <div className="p-10 text-white">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-600 rounded-full" />
          Sơ đồ ghế
        </h3>
        <div className="flex flex-col gap-5">
          {rows.length === 0 && (
            <Button onClick={() => initDefaultLayout(categories[0])} className="btn-custom">
              <Plus size={16} /> Khởi tạo hàng ghế đầu tiên
            </Button>
          )}
          <Button onClick={handleSave} disabled={isUpdating || rows.length === 0} className="btn-custom">
            {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isUpdating ? "Đang lưu..." : "Lưu sơ đồ"}
          </Button>
        </div>
      </div>

      <div className="space-y-4 inline-block">
        {rows.length > 0 ? rows.map((row, rIdx) => (
          <div key={row.rowKey} className="flex items-center gap-4">
            <div className="w-8 font-bold text-zinc-500">{row.rowKey}</div>
            <div className="flex gap-1">
              {row.seats.map((seat: any, sIdx: number) => (
                <SeatItem
                  key={seat.id}
                  seat={seat}
                  active={selectedSeat?.rowIndex === rIdx && selectedSeat?.seatIndex === sIdx}
                  onClick={() => setSelectedSeat({ rowIndex: rIdx, seatIndex: sIdx })}
                />
              ))}
            </div>
            <div className="flex gap-1 ml-4">
              <button onClick={() => addRowBelow(rIdx)} className="p-2 bg-zinc-800 rounded-md hover:bg-zinc-700"><Plus size={14} /></button>
              <button onClick={() => removeRow(rIdx)} className="p-2 bg-zinc-800 rounded-md hover:bg-red-900/30 text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        )) : "Chưa có ghế nào"}
      </div>

      {/* Không cần truyền đống props rows, setRows, setSelectedSeat lằng nhằng nữa */}
      {selectedSeat && <SeatEditor />}
    </div>
  );
}