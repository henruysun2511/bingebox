type Props = {
  seat: any;
  active: boolean;
  onClick: () => void;
};

export default function SeatItem({ seat, active, onClick }: Props) {
  // Ưu tiên lấy màu từ API trả về, nếu không có mới dùng màu mặc định
  const seatColor = seat.seatType?.color || "#3f3f46";

  if (seat.isBlocked) {
    return (
      <div
        onClick={onClick}
        className={`w-10 h-10 border border-dashed flex items-center justify-center cursor-pointer transition-all
        ${active ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-600 hover:border-zinc-400"}`}
      >
        <span className="opacity-30 text-xs">—</span>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: seatColor }}
      className={`w-10 h-10 text-[10px] font-bold flex items-center justify-center cursor-pointer transition-all text-white
      ${active ? "ring-2 ring-white scale-110 z-10" : "hover:brightness-110 shadow-lg"}
      ${seat.isCoupleSeat
          ? "rounded-none first:rounded-l-lg last:rounded-r-lg border-x border-white/10"
          : "rounded-md"}
      `}
    >
      <div className="flex flex-col items-center">
        <span>{seat.code}</span>
      </div>
    </div>
  )
}