import SeatItem from "@/app/admin/seat/seat-item"
import { Button } from "@/components/ui/button"
import { useSeatListByRoom, useUpdateSeatByRoom } from "@/queries/useSeatQuery"
import { useSeatTypeList } from "@/queries/useSeatTypeQuery"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import SeatEditor from "./seat-editor"

export default function SeatList({ roomId }: { roomId: string }) {
  const { data, isLoading } = useSeatListByRoom(roomId);
  const { data: categoryData } = useSeatTypeList();
  const categories = categoryData?.data || [];

  const seats = data?.data ?? [];
  const [rows, setRows] = useState<any[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);

  useEffect(() => {
    if (seats && Array.isArray(seats)) {
      const groupedRows: { [key: string]: any[] } = {};

      // Nhóm ghế theo row (A, B, C...)
      seats.forEach((seat: any) => {
        if (!groupedRows[seat.row]) {
          groupedRows[seat.row] = [];
        }
        groupedRows[seat.row].push({
          ...seat,
          id: seat._id, // Đồng bộ _id từ API thành id cho UI
        });
      });

      // Chuyển object thành mảng và sắp xếp theo thứ tự column
      const formattedRows = Object.keys(groupedRows).sort().map(rowKey => ({
        rowKey,
        seats: groupedRows[rowKey].sort((a, b) => (a.column || 0) - (b.column || 0))
      }));

      setRows(formattedRows);
    }
  }, [seats]);

  const handleInitLayout = () => {
    setRows([{
      rowKey: "A",
      seats: Array.from({ length: 10 }, (_, i) => ({
        id: `init-A${i + 1}`,
        code: `A${i + 1}`,
        row: "A",
        column: i + 1,
        isBlocked: false,
        seatType: categories[0] // Mặc định lấy loại ghế đầu tiên
      }))
    }]);
  };


  const reindexAll = (allRows: any[]) => {
    return allRows.map((row, rIdx) => {
      const newRowKey = String.fromCharCode(65 + rIdx);
      let seatCount = 1;

      // 1. Cập nhật Row và Code cơ bản
      const newSeats = row.seats.map((s: any) => {
        const newCode = s.isBlocked ? "TRỐNG" : `${newRowKey}${seatCount++}`;
        return { ...s, row: newRowKey, code: newCode };
      });

      // 2. Cập nhật partnerSeatCode cho các ghế đôi để không bị lệch liên kết
      const finalSeats = newSeats.map((s: any, sIdx: number) => {
        if (s.isCoupleSeat) {
          const next = newSeats[sIdx + 1];
          const prev = newSeats[sIdx - 1];
          // Nếu ghế bên phải cũng là ghế đôi, chúng là một cặp
          if (next?.isCoupleSeat && next.partnerSeatCode !== s.code) {
            return { ...s, partnerSeatCode: next.code };
          }
          // Nếu không phải ghế phải, thì kiểm tra ghế bên trái
          if (prev?.isCoupleSeat) {
            return { ...s, partnerSeatCode: prev.code };
          }
        }
        return s;
      });

      return { ...row, rowKey: newRowKey, seats: finalSeats };
    });
  }


  const addRowBelow = (rowIndex: number) => {
    const baseRow = rows[rowIndex];

    const newRow = {
      rowKey: "", // Sẽ được reindexAll xử lý sau
      seats: baseRow.seats.map((s: any) => {
        // Nếu là ô trống, giữ nguyên là ô trống và không có loại ghế
        if (s.isBlocked) {
          return {
            ...s,
            id: crypto.randomUUID(),
            _id: undefined,
            isCoupleSeat: false,
            partnerSeatCode: null,
            seatType: undefined,
            seatTypeId: undefined,
            code: "TRỐNG"
          };
        }

        // Nếu là ghế bình thường, COPY y hệt loại ghế của ô ở hàng trên
        return {
          ...s,
          id: crypto.randomUUID(),
          _id: undefined,
          isCoupleSeat: false,
          partnerSeatCode: null,
          // Copy thông tin loại ghế từ hàng trên (s.seatType)
          seatType: s.seatType ? { ...s.seatType } : undefined,
          seatTypeId: s.seatTypeId || s.seatType?._id,
          code: ""
        };
      })
    };

    const updated = [...rows];
    updated.splice(rowIndex + 1, 0, newRow);

    // Đồng bộ lại mã ghế (A1, A2...) và rowKey
    setRows(reindexAll(updated));
    toast.success(`Đã thêm hàng mới copy định dạng từ hàng ${baseRow.rowKey}`);
  };


  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) return toast.error("Không thể xóa hàng cuối cùng");
    const updated = rows.filter((_, i) => i !== rowIndex);
    setRows(reindexAll(updated));
    setSelectedSeat(null); // Đóng editor nếu hàng đang chọn bị xóa
  };


  const { mutate: updateSeats, isPending: isUpdating } = useUpdateSeatByRoom();

  const handleSave = () => {
    // 1. Chuyển đổi cấu trúc từ mảng 'rows' (UI) sang mảng 'seats' phẳng (API)
    const formattedSeats = rows.flatMap((row) => {
      let currentColumn = 1;
      return row.seats.map((seat: any) => {
        const seatPayload: any = {
          code: seat.code,
          row: row.rowKey,
          column: currentColumn++,
          isBlocked: seat.isBlocked,
          // Lấy ID từ object seatType (quan trọng để giữ đúng màu/loại)
          seatTypeId: seat.seatType?._id || seat.seatTypeId,
        };

        // Nếu là ghế đôi, gửi thêm thông tin liên kết
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
    console.log(formattedSeats)

    // 2. Gọi mutation với đúng cấu trúc { roomId, data } như hook đã định nghĩa
    updateSeats(
      {
        roomId,
        data: { seats: formattedSeats } // payload bọc trong object seats theo yêu cầu của bạn
      },
      {
        onSuccess: () => {
          toast.success("Lưu sơ đồ ghế thành công!");
          setSelectedSeat(null); // Đóng editor sau khi lưu
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
            <Button onClick={handleInitLayout} className="btn-custom">
              <Plus size={16} /> Khởi tạo hàng ghế đầu tiên
            </Button>
          )}

          {/* NÚT LƯU SƠ ĐỒ */}
          <Button
            onClick={handleSave}
            disabled={isUpdating || rows.length === 0}
            className="btn-custom"
          >
            {isUpdating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
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

      {selectedSeat && (
        <SeatEditor
          rows={rows}
          setRows={setRows}
          selected={selectedSeat}
          setSelectedSeat={setSelectedSeat}
        />
      )}
    </div>
  )
}