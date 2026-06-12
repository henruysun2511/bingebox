export default function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <label className="text-white/60 text-sm block mb-1">{label}</label>
            <div className="text-lg font-medium break-all">{value}</div>
        </div>
    );
}
