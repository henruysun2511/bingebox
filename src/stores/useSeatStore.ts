import { create } from "zustand";
import { toast } from "sonner";

interface SeatStore {
    rows: any[];
    selectedSeat: { rowIndex: number; seatIndex: number } | null;

    // Actions
    setInitialRows: (seats: any[], categories: any[]) => void;
    initDefaultLayout: (defaultCategory: any) => void;
    setSelectedSeat: (selected: { rowIndex: number; seatIndex: number } | null) => void;
    changeSeatType: (categoryId: string, categories: any[]) => void;
    toggleCoupleSeat: (categories: any[]) => void;
    insertSeat: (isBlocked: boolean, side: "left" | "right") => void;
    removeSeat: () => void;
    addRowBelow: (rowIndex: number) => void;
    removeRow: (rowIndex: number) => void;
}

// Hàm bổ trợ reindex lại toàn bộ sơ đồ ghế khi thay đổi hàng
const reindexAll = (allRows: any[]) => {
    return allRows.map((row, rIdx) => {
        const newRowKey = String.fromCharCode(65 + rIdx);
        let seatCount = 1;

        const newSeats = row.seats.map((s: any) => {
            const newCode = s.isBlocked ? "TRỐNG" : `${newRowKey}${seatCount++}`;
            return { ...s, row: newRowKey, code: newCode };
        });

        const finalSeats = newSeats.map((s: any, sIdx: number) => {
            if (s.isCoupleSeat) {
                const next = newSeats[sIdx + 1];
                const prev = newSeats[sIdx - 1];
                if (next?.isCoupleSeat && next.partnerSeatCode !== s.code) {
                    return { ...s, partnerSeatCode: next.code };
                }
                if (prev?.isCoupleSeat) {
                    return { ...s, partnerSeatCode: prev.code };
                }
            }
            return s;
        });

        return { ...row, rowKey: newRowKey, seats: finalSeats };
    });
};

// Hàm bổ trợ sync mã ghế nội bộ trong một hàng
const syncRowData = (row: any) => {
    let count = 1;
    const updatedSeats = row.seats.map((s: any) => {
        const newCode = s.isBlocked ? "TRỐNG" : `${row.rowKey}${count++}`;
        return { ...s, code: newCode };
    });

    return updatedSeats.map((s: any, idx: number) => {
        if (s.isCoupleSeat) {
            const prev = updatedSeats[idx - 1];
            const next = updatedSeats[idx + 1];
            if (prev && prev.isCoupleSeat && (prev.partnerSeatCode === s.code || s.partnerSeatCode === prev.code)) {
                return { ...s, partnerSeatCode: prev.code };
            }
            if (next && next.isCoupleSeat) {
                return { ...s, partnerSeatCode: next.code };
            }
        }
        return s;
    });
};

export const useSeatStore = create<SeatStore>((set, get) => ({
    rows: [],
    selectedSeat: null,

    setSelectedSeat: (selected) => set({ selectedSeat: selected }),

    setInitialRows: (seats, categories) => {
        if (!seats || !Array.isArray(seats) || seats.length === 0) return;
        const groupedRows: { [key: string]: any[] } = {};
        seats.forEach((seat: any) => {
            if (!groupedRows[seat.row]) groupedRows[seat.row] = [];
            groupedRows[seat.row].push({ ...seat, id: seat._id });
        });

        const formattedRows = Object.keys(groupedRows).sort().map(rowKey => ({
            rowKey,
            seats: groupedRows[rowKey].sort((a, b) => (a.column || 0) - (b.column || 0))
        }));
        set({ rows: formattedRows });
    },

    initDefaultLayout: (defaultCategory) => {
        set({
            rows: [{
                rowKey: "A",
                seats: Array.from({ length: 10 }, (_, i) => ({
                    id: `init-A${i + 1}`,
                    code: `A${i + 1}`,
                    row: "A",
                    column: i + 1,
                    isBlocked: false,
                    seatType: defaultCategory
                }))
            }]
        });
    },

    changeSeatType: (categoryId, categories) => {
        const { selectedSeat, rows } = get();
        if (!selectedSeat) return;
        const { rowIndex, seatIndex } = selectedSeat;
        const selectedCategory = categories.find((c: any) => c._id === categoryId);
        if (!selectedCategory) return;

        const newRows = [...rows];
        const currentRow = { ...newRows[rowIndex] };
        const newSeats = [...currentRow.seats];

        newSeats[seatIndex] = {
            ...newSeats[seatIndex],
            seatType: {
                _id: selectedCategory._id,
                name: selectedCategory.name,
                color: selectedCategory.color,
            }
        };

        currentRow.seats = newSeats;
        newRows[rowIndex] = currentRow;
        set({ rows: newRows });
        toast.success(`Đã đổi sang loại ghế: ${selectedCategory.name}`);
    },

    toggleCoupleSeat: (categories) => {
        const { selectedSeat, rows } = get();
        if (!selectedSeat) return;
        const { rowIndex, seatIndex } = selectedSeat;
        const seat = rows[rowIndex]?.seats[seatIndex];
        if (!seat || seat.isBlocked) return;

        const coupleCategory = categories.find((c: any) =>
            c.name.toLowerCase().includes("đôi") || c.isCoupleType === true
        );

        const newRows = [...rows];
        const currentRow = { ...newRows[rowIndex] };
        const newSeats = [...currentRow.seats];

        if (seat.isCoupleSeat) {
            const defaultCat = categories[0];
            const partnerCode = seat.partnerSeatCode;
            currentRow.seats = newSeats.map(s => {
                if (s.code === seat.code || s.code === partnerCode) {
                    return {
                        ...s,
                        isCoupleSeat: false,
                        partnerSeatCode: undefined,
                        seatType: defaultCat ? { _id: defaultCat._id, name: defaultCat.name, color: defaultCat.color } : s.seatType
                    };
                }
                return s;
            });
        } else {
            const nextSeat = newSeats[seatIndex + 1];
            if (!nextSeat || nextSeat.isBlocked || nextSeat.isCoupleSeat) {
                toast.error("Cần một ghế trống bên phải để tạo ghế đôi!");
                return;
            }

            const seatTypeUpdate = coupleCategory
                ? { _id: coupleCategory._id, name: coupleCategory.name, color: coupleCategory.color }
                : seat.seatType;

            newSeats[seatIndex] = { ...seat, isCoupleSeat: true, partnerSeatCode: nextSeat.code, seatType: seatTypeUpdate };
            newSeats[seatIndex + 1] = { ...nextSeat, isCoupleSeat: true, partnerSeatCode: seat.code, seatType: seatTypeUpdate };
            currentRow.seats = newSeats;
        }

        newRows[rowIndex] = currentRow;
        set({ rows: newRows });
    },

    insertSeat: (isBlocked, side) => {
        const { selectedSeat, rows } = get();
        if (!selectedSeat) return;
        const { rowIndex, seatIndex } = selectedSeat;
        const seat = rows[rowIndex]?.seats[seatIndex];
        if (!seat || seat.isBlocked) {
            toast.error("Chọn một ghế thường để thêm!");
            return;
        }

        const nextSeat = rows[rowIndex].seats[seatIndex + 1];
        const prevSeat = rows[rowIndex].seats[seatIndex - 1];
        if (side === "right" && seat.isCoupleSeat && nextSeat?.code === seat.partnerSeatCode) {
            toast.error("Không thể chèn vào giữa ghế đôi!");
            return;
        }
        if (side === "left" && seat.isCoupleSeat && prevSeat?.code === seat.partnerSeatCode) {
            toast.error("Không thể chèn vào giữa ghế đôi!");
            return;
        }

        const newRows = [...rows];
        const currentRow = { ...newRows[rowIndex] };
        const newSeats = [...currentRow.seats];
        const index = side === "left" ? seatIndex : seatIndex + 1;

        const newSeat = {
            ...seat,
            id: crypto.randomUUID(),
            _id: undefined,
            isBlocked: isBlocked,
            isCoupleSeat: false,
            partnerSeat: null,
            partnerSeatCode: null,
            seatType: isBlocked ? undefined : seat.seatType
        };

        newSeats.splice(index, 0, newSeat);
        currentRow.seats = syncRowData({ ...currentRow, seats: newSeats });
        newRows[rowIndex] = currentRow;

        set({ rows: newRows });
        toast.success(`Đã thêm ${isBlocked ? "ô trống" : "ghế"} vào bên ${side === "left" ? "trái" : "phải"}`);
    },

    removeSeat: () => {
        const { selectedSeat, rows } = get();
        if (!selectedSeat) return;
        const { rowIndex, seatIndex } = selectedSeat;
        const seat = rows[rowIndex]?.seats[seatIndex];
        if (!seat) return;

        const newRows = [...rows];
        const currentRow = { ...newRows[rowIndex] };

        if (seat.isCoupleSeat && currentRow.seats.length <= 2) {
            toast.error("Hàng phải có ít nhất một ghế. Không thể xóa cặp ghế cuối cùng!");
            return;
        }
        if (!seat.isCoupleSeat && currentRow.seats.length <= 1) {
            toast.error("Hàng phải có ít nhất một ghế. Không thể xóa ghế cuối cùng!");
            return;
        }

        let newSeats;
        if (seat.isCoupleSeat) {
            newSeats = currentRow.seats.filter((s: any) => s.code !== seat.code && s.code !== seat.partnerSeatCode);
        } else {
            newSeats = currentRow.seats.filter((_: any, idx: number) => idx !== seatIndex);
        }

        currentRow.seats = syncRowData({ ...currentRow, seats: newSeats });
        newRows[rowIndex] = currentRow;
        set({ rows: newRows, selectedSeat: null }); // Xóa xong hủy chọn ghế luôn cho an toàn
    },

    addRowBelow: (rowIndex) => {
        const { rows } = get();
        const baseRow = rows[rowIndex];
        const newRow = {
            rowKey: "",
            seats: baseRow.seats.map((s: any) => ({
                ...s,
                id: crypto.randomUUID(),
                _id: undefined,
                isCoupleSeat: false,
                partnerSeatCode: null,
                seatType: s.isBlocked ? undefined : (s.seatType ? { ...s.seatType } : undefined),
                seatTypeId: s.seatTypeId || s.seatType?._id,
                code: s.isBlocked ? "TRỐNG" : ""
            }))
        };

        const updated = [...rows];
        updated.splice(rowIndex + 1, 0, newRow);
        set({ rows: reindexAll(updated) });
        toast.success(`Đã thêm hàng mới copy định dạng từ hàng ${baseRow.rowKey}`);
    },

    removeRow: (rowIndex) => {
        const { rows } = get();
        if (rows.length <= 1) {
            toast.error("Không thể xóa hàng cuối cùng");
            return;
        }
        const updated = rows.filter((_, i) => i !== rowIndex);
        set({ rows: reindexAll(updated), selectedSeat: null });
    }
}));