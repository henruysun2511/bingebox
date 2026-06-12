"use client";

import { useGetMe } from "@/queries/useUserQuery"; // Đảm bảo đúng đường dẫn query của bạn
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface UserPointProps {
    pointsUsed: number;
    setPointsUsed: (points: number) => void;
    finalAmountBeforePoints: number;
}

export default function UserPoint({ 
    pointsUsed, 
    setPointsUsed, 
    finalAmountBeforePoints 
}: UserPointProps) {
    // 1. Lấy dữ liệu người dùng
    const { data: userData, isLoading } = useGetMe();
    // Kiểm tra đúng field trả về từ API của bạn (thường là userData.data.points)
    const currentPoints = userData?.data?.currentPoints || 0; 

    const [inputValue, setInputValue] = useState(pointsUsed.toString());

    // 2. Đồng bộ input khi pointsUsed thay đổi từ props (ví dụ khi reset đơn hàng)
    useEffect(() => {
        setInputValue(pointsUsed.toString());
    }, [pointsUsed]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Chỉ cho phép nhập số
        setInputValue(value);
        
        const numValue = Number(value);

        // 3. Logic kiểm tra ràng buộc
        if (numValue > currentPoints) {
            // Nếu nhập quá số điểm đang có
            setPointsUsed(currentPoints);
            setInputValue(currentPoints.toString());
        } else if (numValue > finalAmountBeforePoints) {
            // Nếu nhập quá tổng tiền đơn hàng
            setPointsUsed(finalAmountBeforePoints);
            setInputValue(finalAmountBeforePoints.toString());
        } else {
            // Hợp lệ
            setPointsUsed(numValue);
        }
    };

    const handleUseMax = () => {
        // Lấy giá trị nhỏ hơn giữa điểm hiện có và tổng tiền
        const maxPossible = Math.min(currentPoints, finalAmountBeforePoints);
        setPointsUsed(maxPossible);
        setInputValue(maxPossible.toString());
    };

    if (isLoading) return <div className="animate-pulse h-24 bg-neutral-900 rounded-xl mt-4" />;

    return (
        <div className="bg-card border border-neutral-900 rounded-xl p-5 mt-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-white font-bold">
                    <Star className="text-yellow-500" size={20} fill="currentColor" />
                    Dùng điểm thưởng
                </div>
                <span className="text-xs text-gray-400">
                    Bạn có: <b className="text-white">{currentPoints.toLocaleString()}</b> điểm
                </span>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Nhập số điểm..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue transition text-sm"
                    />
                    <button 
                        type="button"
                        onClick={handleUseMax}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue font-bold hover:text-blue-400 transition"
                    >
                        TỐI ĐA
                    </button>
                </div>
            </div>
            
            {pointsUsed > 0 && (
                <p className="text-[11px] text-green-500 mt-2">
                    ✓ Áp dụng giảm: <b>{pointsUsed.toLocaleString()} đ</b>
                </p>
            )}

            <p className="text-[10px] text-gray-500 mt-2 italic">
                * Quy đổi: 1 điểm = 1 VNĐ. Điểm sử dụng không vượt quá tổng giá trị đơn hàng.
            </p>
        </div>
    );
}