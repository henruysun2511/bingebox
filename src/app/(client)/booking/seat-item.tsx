"use client";

interface Props {
  seat: any;
  isSelected: boolean;
  onClick: () => void;
}

export default function SeatItemClient({ seat, isSelected, onClick }: Props) {
  if (!seat) return <div className="w-10 h-10" />;

  if (seat.code === "TRỐNG" || seat.isBlocked) {
    return <div className="w-10 h-10" />;
  }

  const isSold = seat.status === "SOLD";
  const isHold = seat.status === "HOLD";
  const isDisabled = isSold || isHold;

  const STATUS_COLOR: Record<string, string> = {
    SOLD: "var(--color-sold)",
    HOLD: "var(--color-hold)",
  };
  const bgColor = isSelected
    ? "var(--color-selected)"
    : STATUS_COLOR[seat.status] || seat.seatType?.color || "#3f3f46";

  return (
    <div
      onClick={!isDisabled ? onClick : undefined}
      style={{ backgroundColor: bgColor }}
      className={`
        w-10 h-10 text-[10px] font-bold flex items-center justify-center transition-all text-white
        ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-105 shadow-lg"}
        ${isSelected ? "ring-2 ring-white z-10 scale-110" : ""}
        ${seat.isCoupleSeat 
          ? "rounded-none first:rounded-l-lg last:rounded-r-lg border-x border-white/10 w-20" 
          : "rounded-md"}
        ${isSold ? "grayscale" : ""}
      `}
    >
      <div className="flex flex-col items-center">
        <span>{seat.code}</span>
      </div>
    </div>
  );
}