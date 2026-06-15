import { SettingInput } from "@/schemas/setting.schema";
import { SettingService } from "@/services/setting.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SETTING_QUERY_KEY = ["settings"];

export const useGetSettings = () => {
    return useQuery({
        queryKey: SETTING_QUERY_KEY,
        queryFn: async () => {
            const res = await SettingService.getSettings();
            return res.data.data;
        },
        staleTime: 0,
    });
};

export const useUpdateSettings = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: SettingInput) => SettingService.update(payload),
        onSuccess: () => {
            // Tự động làm mới dữ liệu sau khi update thành công
            qc.invalidateQueries({ queryKey: SETTING_QUERY_KEY, refetchType: "active" });
        },
    });
};