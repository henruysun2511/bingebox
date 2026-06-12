import { Checkbox } from "@/components/ui/checkbox";
import { useVoucherList } from "@/queries/useVoucherQuery";
import { Percent } from "lucide-react";

export default function VoucherListClient({ selectedVoucher, setSelectedVoucher }: any) {
    const { data } = useVoucherList({});
    const vouchers = data?.data || [];

    return (
        <div className="w-full mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Voucher ưu đãi
                </h3>
                <span className="text-sm text-neutral-500">{vouchers.length} voucher khả dụng</span>
            </div>

            <div className="grid gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {vouchers.map((v: any) => {
                    const isSelected = selectedVoucher?._id === v._id;
                    
                    return (
                        <div
                            key={v._id}
                            onClick={() => setSelectedVoucher(isSelected ? null : v)}
                            className={`
                                relative flex items-center bg-black rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2
                                ${isSelected ? "border-blue shadow-[0_0_15px_rgba(0,102,255,0.2)]" : "border-neutral-800 hover:border-neutral-700"}
                            `}
                        >
                            <div className={`
                                w-24 h-full flex flex-col items-center justify-center p-4 border-r border-dashed border-neutral-700
                                ${isSelected ? "bg-blue/10 text-blue" : "bg-neutral-800/50 text-neutral-400"}
                            `}>
                                <Percent size={24} className="mb-1" />
                                <span className="text-lg font-black">{v.discountValue || v.maxDiscountAmount}%</span>
                                <span className="text-[10px] uppercase font-bold tracking-tighter">OFF</span>
                            </div>

                            <div className="flex-1 p-4 space-y-1 relative">
                                <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-around py-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-4 h-4 bg-card rounded-full -ml-2" />)}
                                </div>

                                <div className="flex justify-between items-start">
                                    <h4 className="text-white font-bold leading-tight">{v.name}</h4>
                                    <Checkbox 
                                        checked={isSelected} 
                                        className="rounded-full border-neutral-600 data-[state=checked]:bg-blue data-[state=checked]:border-blue"
                                    />
                                </div>
                                
                                <p className="text-xs text-neutral-400 line-clamp-1 italic">{v.description}</p>
                                
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="bg-neutral-800 px-2 py-1 rounded border border-neutral-700">
                                        <span className="text-[11px] font-mono text-blue uppercase tracking-wider">{v.code}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {vouchers.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-neutral-800 rounded-xl">
                        <p className="text-neutral-500">Hiện chưa có voucher nào dành cho bạn.</p>
                    </div>
                )}
            </div>
        </div>
    );
}