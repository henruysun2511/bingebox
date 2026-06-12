"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BaseStatusEnum } from "@/constants/enum";
import { useFileChange } from "@/hooks/useFileChange";
import { useGetSettings, useUpdateSettings } from "@/queries/useSettingQuery";
import { SettingInput, SettingSchema } from "@/schemas/setting.schema";
import { handleError } from "@/utils/error";
import { removeEmptyFields } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, ImagePlus, Loader2, Plus, Save, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";



export default function SettingPage() {
    const [isEdit, setIsEdit] = useState(false);
    const { data: settings, isPending } = useGetSettings();
    const updateMutation = useUpdateSettings();

    const form = useForm<SettingInput>({
        resolver: zodResolver(SettingSchema),
        defaultValues: {
            logo: "",
            name: "",
            company: "",
            email: "",
            hotline: "",
            address: "",
            workHours: "",
            metaTitle: "",
            metaDescription: "",
            social: {
                facebook: "",
                instagram: "",
                tiktok: "",
                zalo: "",
            },
            banner: [],
            popup: [],
        }
    })

    const { handleFileChange: uploadLogo } = useFileChange(form);
    const { handleFileChange: uploadBannerImage } = useFileChange(form);
    const { handleFileChange: uploadPopupImage } = useFileChange(form);

    // Popup array
    const { fields: popupFields, append: appendPopup, remove: removePopup } = useFieldArray({
        control: form.control,
        name: "popup"
    });

    // Banner array (NEW)
    const { fields: bannerFields, append: appendBanner, remove: removeBanner } = useFieldArray({
        control: form.control,
        name: "banner"
    });

    useEffect(() => {
        if (!settings) return

        form.reset({
            logo: settings.logo ?? "",
            name: settings.name ?? "",
            company: settings.company ?? "",
            email: settings.email ?? "",
            hotline: settings.hotline ?? "",
            address: settings.address ?? "",
            workHours: settings.workHours ?? "",
            metaTitle: settings.metaTitle ?? "",
            metaDescription: settings.metaDescription ?? "",

            social: {
                facebook: settings.social?.facebook ?? "",
                instagram: settings.social?.instagram ?? "",
                tiktok: settings.social?.tiktok ?? "",
                zalo: settings.social?.zalo ?? "",
            },

            banner: (settings.banner ?? []).map((b: any) => ({
                image: b.image,
                link: b.link ?? "",
                isActive: b.isActive ?? BaseStatusEnum.ACTIVE,
            })),

            popup: (settings.popup ?? []).map((p: any) => ({
                image: p.image,
                link: p.link ?? "",
                isActive: p.isActive ?? BaseStatusEnum.ACTIVE,
            })),
        })
    }, [settings, form])

    const handleCancel = () => {
        if (settings) {
            const formattedData: SettingInput = {
                logo: settings.logo ?? "",
                name: settings.name ?? "",
                company: settings.company ?? "",
                email: settings.email ?? "",
                hotline: settings.hotline ?? "",
                address: settings.address ?? "",
                workHours: settings.workHours ?? "",
                metaTitle: settings.metaTitle ?? "",
                metaDescription: settings.metaDescription ?? "",

                social: {
                    facebook: settings.social?.facebook ?? "",
                    instagram: settings.social?.instagram ?? "",
                    tiktok: settings.social?.tiktok ?? "",
                    zalo: settings.social?.zalo ?? "",
                },

                banner: (settings.banner ?? []).map((b: any) => ({
                    image: b.image,
                    link: b.link ?? "",
                    isActive: b.isActive ?? BaseStatusEnum.ACTIVE,
                })),

                popup: (settings.popup ?? []).map((p: any) => ({
                    image: p.image,
                    link: p.link ?? "",
                    isActive: p.isActive ?? BaseStatusEnum.ACTIVE,
                })),
            };
            form.reset(formattedData);
        }
        setIsEdit(false);
    };

    const onSubmit = async (data: SettingInput) => {
        try {
            const clean = removeEmptyFields(data) as SettingInput;
            await updateMutation.mutateAsync(clean);
            setIsEdit(false);
            toast.success("Cập nhật thành công");
        } catch (error) {
            handleError(error);
        }
    };

    if (isPending) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 mb-20">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase">Cấu hình hệ thống</h1>
                    <p className="text-neutral-400 text-sm">Quản lý thông tin chung, giao diện và SEO website</p>
                </div>
                {!isEdit ? (
                    <Button onClick={() => setIsEdit(true)} className="btn-custom">
                        <Edit3 size={16} className="mr-2" /> Chỉnh sửa cấu hình
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setIsEdit(false); handleCancel(); }} className="border-neutral-700 text-white cursor-pointer">
                            <XCircle size={16} className="mr-2" /> Hủy
                        </Button>
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={updateMutation.isPending} className="btn-custom">
                            <Save size={16} className="mr-2" /> Lưu thay đổi
                        </Button>
                    </div>
                )}
            </div>

            <Form {...form}>
                <form className="space-y-8">
                    {/* THÔNG TIN CƠ BẢN & LOGO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative group w-full aspect-square bg-neutral-900 border-2 border-dashed border-neutral-700 rounded-xl overflow-hidden flex items-center justify-center">
                            {form.watch("logo") ? (
                                <img
                                    src={form.watch("logo")}
                                    alt="Logo"
                                    className="w-full h-full object-contain p-4"
                                />
                            ) : (
                                <ImagePlus size={40} className="text-neutral-600" />
                            )}

                            {isEdit && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="logo-upload"
                                        onChange={(e) => uploadLogo(e, "logo")}
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-medium"
                                    >
                                        Thay đổi
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel className="form-label-custom">Tên Website</FormLabel><FormControl><Input {...field} disabled={!isEdit} className="form-input-custom" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="company" render={({ field }) => (
                                <FormItem><FormLabel className="form-label-custom">Tên Công ty</FormLabel><FormControl><Input {...field} disabled={!isEdit} className="form-input-custom" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel className="form-label-custom">Email liên hệ</FormLabel><FormControl><Input {...field} disabled={!isEdit} className="form-input-custom" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="hotline" render={({ field }) => (
                                <FormItem><FormLabel className="form-label-custom">Hotline</FormLabel><FormControl><Input {...field} disabled={!isEdit} className="form-input-custom" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="workHours" render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel className="form-label-custom">Giờ làm việc</FormLabel><FormControl><Input {...field} disabled={!isEdit} className="form-input-custom" placeholder="Ví dụ: 08:00 - 22:00 tất cả các ngày" /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel className="form-label-custom">Địa chỉ trụ sở</FormLabel><FormControl><Textarea {...field} disabled={!isEdit} className="form-input-custom h-20" /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>

                    {/* PHẦN 2: MẠNG XÃ HỘI */}
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 space-y-4">
                        <h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2">Mạng xã hội</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {["facebook", "instagram", "tiktok", "zalo"].map((social) => (
                                <FormField key={social} control={form.control} name={`social.${social}` as any} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="capitalize text-neutral-400">{social}</FormLabel>
                                        <FormControl><Input {...field} disabled={!isEdit} className="form-input-custom" placeholder={`Link ${social}...`} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            ))}
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-blue-400">Cấu hình Banner</h2>
                            {isEdit && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() =>
                                        appendBanner({
                                            image: "",
                                            link: "",
                                            isActive: BaseStatusEnum.ACTIVE
                                        })
                                    }
                                    className="bg-neutral-800 hover:bg-neutral-700"
                                >
                                    <Plus size={14} className="mr-1" /> Thêm Banner
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bannerFields.map((field, index) => (
                                /* Thêm relative và group vào đây */
                                <div key={field.id} className="relative group p-4 rounded-lg border border-neutral-800 bg-black/20 space-y-3 overflow-hidden">

                                    {/* NÚT XÓA: Thêm z-20 để luôn nằm trên cùng */}
                                    {isEdit && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            onClick={() => removeBanner(index)}
                                            className="absolute top-2 right-2 z-20 h-8 w-8 rounded-2xl shadow-lg bg-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    )}

                                    {/* PHẦN IMAGE */}
                                    <div className="relative h-32 w-full rounded overflow-hidden bg-neutral-800">
                                        {form.watch(`banner.${index}.image`) ? (
                                            <img
                                                src={form.watch(`banner.${index}.image`)}
                                                className="w-full h-full object-cover"
                                                alt={`Banner ${index}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-neutral-700 text-neutral-500">
                                                <ImagePlus size={24} />
                                                <span className="text-[10px] mt-1">Chưa có ảnh</span>
                                            </div>
                                        )}

                                        {/* Input File đè lên ảnh để click thay đổi */}
                                        {isEdit && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    onChange={(e) => uploadBannerImage(e, `banner.${index}.image`)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* LINK ĐIỀU HƯỚNG */}
                                    <FormField
                                        control={form.control}
                                        name={`banner.${index}.link`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isEdit}
                                                        placeholder="Link điều hướng"
                                                        className="form-input-custom text-xs h-9"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* TRẠNG THÁI KÍCH HOẠT */}
                                    <FormField
                                        control={form.control}
                                        name={`banner.${index}.isActive`}
                                        render={({ field }) => (
                                            <div className="flex items-center justify-between bg-neutral-900/80 p-2 rounded border border-neutral-800">
                                                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Kích hoạt</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-neutral-500">
                                                        {field.value === BaseStatusEnum.ACTIVE ? "Đang bật" : "Đang tắt"}
                                                    </span>
                                                    <Switch
                                                        checked={field.value === BaseStatusEnum.ACTIVE}
                                                        onCheckedChange={(v) =>
                                                            field.onChange(v ? BaseStatusEnum.ACTIVE : BaseStatusEnum.INACTIVE)
                                                        }
                                                        disabled={!isEdit}
                                                        className="switch-custom"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>


                    {/*POPUP*/}
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-orange-400">Cấu hình Popups</h2>
                            {isEdit && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() =>
                                        appendPopup({
                                            image: "",
                                            link: "",
                                            isActive: BaseStatusEnum.ACTIVE
                                        })
                                    }
                                    className="bg-neutral-800 hover:bg-neutral-700"
                                >
                                    <Plus size={14} className="mr-1" /> Thêm Popup
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {popupFields.map((field, index) => (
                                /* Thêm relative và group để xác định vị trí nút xóa */
                                <div key={field.id} className="relative group p-4 rounded-lg border border-neutral-800 bg-black/20 space-y-3">

                                    {/* NÚT XÓA: Thêm z-20 và thay variant destructive cho rõ ràng */}
                                    {isEdit && (
                                        <Button
                                            type="button"
                                            size="icon"
                                            onClick={() => removePopup(index)}
                                            className="absolute -top-2 -right-2 z-20 h-8 w-8 bg-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    )}

                                    {/* IMAGE BOX */}
                                    <div className="relative w-full aspect-[2/3] max-h-80 bg-neutral-800 rounded overflow-hidden">
                                        {form.watch(`popup.${index}.image`) ? (
                                            <img
                                                src={form.watch(`popup.${index}.image`)}
                                                className="w-full h-full object-cover"
                                                alt={`Popup ${index}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-neutral-700 text-neutral-500">
                                                <ImagePlus size={32} />
                                                <span className="text-xs mt-2">Chưa có ảnh Popup</span>
                                            </div>
                                        )}

                                        {/* Overlay upload ảnh khi hover */}
                                        {isEdit && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    onChange={(e) =>
                                                        uploadPopupImage(e, `popup.${index}.image`)
                                                    }
                                                />
                                                <div className="flex flex-col items-center text-white">
                                                    <ImagePlus size={24} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* LINK INPUT */}
                                    <FormField
                                        control={form.control}
                                        name={`popup.${index}.link`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isEdit}
                                                        placeholder="Link điều hướng khi click popup"
                                                        className="form-input-custom h-10 text-sm"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* ACTIVE TOGGLE */}
                                    <FormField
                                        control={form.control}
                                        name={`popup.${index}.isActive`}
                                        render={({ field }) => (
                                            <div className="flex items-center justify-between bg-neutral-900/80 p-2 rounded border border-neutral-800">
                                                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Trạng thái</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-neutral-500">
                                                        {field.value === BaseStatusEnum.ACTIVE ? "Đang bật" : "Đang tắt"}
                                                    </span>
                                                    <Switch
                                                        checked={field.value === BaseStatusEnum.ACTIVE}
                                                        onCheckedChange={(v) =>
                                                            field.onChange(v ? BaseStatusEnum.ACTIVE : BaseStatusEnum.INACTIVE)
                                                        }
                                                        disabled={!isEdit}
                                                        className="switch-custom"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/*SEO*/}
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 space-y-4">
                        <h2 className="text-lg font-semibold text-green-400 flex items-center gap-2">Cấu hình SEO</h2>
                        <div className="space-y-4">
                            <FormField control={form.control} name="metaTitle" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Tiêu đề SEO (Meta Title)</FormLabel>
                                    <FormControl><Input {...field} disabled={!isEdit} className="form-input-custom" placeholder="Tối đa 70 ký tự" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="metaDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Mô tả SEO (Meta Description)</FormLabel>
                                    <FormControl><Textarea {...field} disabled={!isEdit} className="form-input-custom h-24" placeholder="Tối đa 160 ký tự" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}