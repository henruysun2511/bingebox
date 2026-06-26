import { useSeatTypeList } from "@/queries/useSeatTypeQuery";
import { useSeatStore } from "@/stores/useSeatStore";

export default function SeatEditor() {
  const { data: categoryData } = useSeatTypeList();
  const categories = categoryData?.data || [];

  // Lấy data và actions trực tiếp từ Zustand
  const {
    rows,
    selectedSeat,
    changeSeatType,
    toggleCoupleSeat,
    insertSeat,
    removeSeat
  } = useSeatStore();

  if (!selectedSeat) return null;
  const { rowIndex, seatIndex } = selectedSeat;
  const seat = rows[rowIndex]?.seats[seatIndex];

  if (!seat) return null;

  return (
    <div className="mt-6 w-[400px] rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="font-semibold text-white text-base tracking-wide">
          Ghế: {seat.code}
        </div>
        <div
          className="w-4 h-4 rounded-full border border-white/20"
          style={{ backgroundColor: seat.seatType?.color }}
        />
      </div>

      <div className="mb-5 space-y-2">
        <label className="text-[11px] text-neutral-500 uppercase font-semibold tracking-wider">
          Loại ghế
        </label>
        <select
          disabled={seat.isBlocked || seat.isCoupleSeat}
          value={seat.seatType?._id || ""}
          onChange={(e) => changeSeatType(e.target.value, categories)}
          className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>-- Chọn loại ghế --</option>
          {categories
            .filter((c: any) => !c.name.toLowerCase().includes("đôi"))
            .map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
        {seat.isCoupleSeat && (
          <p className="text-[11px] text-amber-500 italic">
            * Ghế đôi sử dụng cấu hình loại ghế riêng
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => insertSeat(false, "left")} className="cursor-pointer text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg py-2 transition-colors border border-neutral-700">+ Ghế trái</button>
        <button onClick={() => insertSeat(false, "right")} className="cursor-pointer text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg py-2 transition-colors border border-neutral-700">+ Ghế phải</button>
        <button onClick={() => insertSeat(true, "left")} className="cursor-pointer text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-500 rounded-lg py-2 transition-colors border border-neutral-700">+ Trống trái</button>
        <button onClick={() => insertSeat(true, "right")} className="cursor-pointer text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-500 rounded-lg py-2 transition-colors border border-neutral-700">+ Trống phải</button>

        <button
          onClick={() => toggleCoupleSeat(categories)}
          className={`col-span-2 py-2.5 rounded-lg font-medium transition-colors border cursor-pointer ${seat.isCoupleSeat
            ? "bg-red-500/15 text-red-400 border-red-500/40 hover:bg-red-500/25"
            : "bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30"
            }`}
        >
          {seat.isCoupleSeat ? "Hủy ghế đôi" : "Ghép thành ghế đôi"}
        </button>

        <button onClick={removeSeat} className="col-span-2 py-2 rounded-lg font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer">
          Xóa ghế
        </button>
      </div>
    </div>
  );
}