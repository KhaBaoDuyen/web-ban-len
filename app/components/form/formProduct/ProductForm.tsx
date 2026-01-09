"use client";
import { useEffect, useState } from "react";
import {
    FiBox, FiLink, FiDollarSign, FiFileText, FiImage,
    FiX, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiZap, FiPlus
} from "react-icons/fi";
import type { Product } from "@/app/types/product.type";
import type { Category } from "@/app/types/categories.type";
import Link from "next/link";

type Props = {
    initialData?: Partial<Product> & { images?: string[] };
    title: string;
    submitText: string;
    onSubmit: (data: FormData) => Promise<{
        ok: boolean;
        message: string;
    }>;
    mode?: "add" | "edit";
};

export default function ProductForm({
    initialData = {},
    title,
    submitText,
    onSubmit,
    mode = "add",
}: Props) {
    const [formData, setFormData] = useState<any>({
        name: initialData.name || "",
        slug: initialData.slug || "",
        price: initialData.price || "",
        description: initialData.description || "",
        status: initialData.status || 1,
        categoryId: initialData.categoryId || "",
    });

    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(initialData.images || []);

    const [errors, setErrors] = useState({
        name: "",
        price: "",
        images: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiKeyword, setAiKeyword] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" }>({
        text: "",
        type: "success",
    });

    useEffect(() => {
        if (!formData.name) return;
        const slug = formData.name
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        setFormData((prev: any) => ({ ...prev, slug }));
    }, [formData.name]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
         if (mode === "edit" && initialData && Object.keys(initialData).length > 0) {

             if (initialData.images && Array.isArray(initialData.images)) {
                setExistingImages(initialData.images);
            }

             const rawCategoryId: any = initialData.categoryId;
            const categoryId = typeof rawCategoryId === "string"
                ? rawCategoryId
                : (rawCategoryId?.$oid || rawCategoryId?._id || "");

            setFormData({
                name: initialData.name || "",
                slug: initialData.slug || "",
                price: initialData.price  || "",
                description: initialData.description || "",
                status: initialData.status ?? 1,
                categoryId,
            });
        }
    }, [initialData, mode]); 

    // console.log("State existingImages hiện tại:", existingImages);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("Lỗi lấy danh mục", err);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const fileArray = Array.from(files);
        setNewImages((prev) => [...prev, ...fileArray]);
        setErrors((prev) => ({ ...prev, images: "" }));
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (url: string) => {
        setExistingImages((prev) => prev.filter((item) => item !== url));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        if (!raw) {
            setFormData((p: any) => ({ ...p, price: "" }));
            return;
        }
        const formatted = new Intl.NumberFormat("vi-VN").format(Number(raw));
        setFormData((p: any) => ({ ...p, price: formatted }));
    };

    const validate = () => {
        let valid = true;
        const newErrors = { name: "", price: "", images: "", description: "" };

        if (!formData.name) { newErrors.name = "Tên sản phẩm bắt buộc"; valid = false; }
        const numericPrice = Number(String(formData.price).replace(/\D/g, ""));

        if (!numericPrice || numericPrice <= 0) {
            newErrors.price = "Giá phải lớn hơn 0";
            valid = false;
        }

        if (newImages.length === 0 && existingImages.length === 0) {
            newErrors.images = "Vui lòng chọn ít nhất một ảnh";
            valid = false;
        }
        if (!formData.description) { newErrors.description = "Vui lòng nhập mô tả"; valid = false; }
        if (!formData.categoryId) { valid = false; alert("Vui lòng chọn danh mục"); }

        setErrors(newErrors);
        return valid;
    };

    const handleGenerateAI = async () => {
        if (!formData.name.trim()) {
            setErrors((p) => ({ ...p, name: "Nhập tên trước khi tạo AI" }));
            return;
        }
        setAiLoading(true);
        try {
            const res = await fetch("/api/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name, keywords: aiKeyword }),
            });
            const data = await res.json();
            if (data.text) setFormData((p: any) => ({ ...p, description: data.text }));
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        const payload = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
            if (k === "price") {
                payload.append("price", String(v).replace(/\D/g, ""));
            } else {
                payload.append(k, v as any);
            }
        });

        newImages.forEach((file) => payload.append("images", file));
        payload.append("existingImages", JSON.stringify(existingImages));

        const result = await onSubmit(payload);
        setMessage({ text: result.message, type: result.ok ? "success" : "error" });
        setLoading(false);

        if (result.ok && mode === "add") {
            setFormData({ name: "", slug: "", price: "", description: "", status: 1, categoryId: "" });
            setNewImages([]);
            setExistingImages([]);
        }
    };

    return (
        <div className="min-h-screen lg:py-10 py-5 px-4 text-slate-800">
            <div className="lg:w-10/12 mx-auto">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-white">
                        <Link href="/quan-ly-san-pham" className="hover:underline font-bold text-primary-600">Trở về</Link>
                        <h2 className="text-2xl font-bold text-slate-800 mt-2">{title}</h2>
                        <p className="text-slate-500 mt-1 font-medium">Quản lý thông tin và hình ảnh sản phẩm</p>
                    </div>
           
                    <form onSubmit={handleSubmit} className="lg:p-8 p-3 lg:grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <FiBox className="text-primary-600" /> Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${errors.name ? "border-red-200 focus:border-red-400 focus:ring-red-50" : "border-slate-100 focus:border-primary-500 focus:ring-primary-50"}`}
                                />
                                {errors.name && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><FiAlertCircle /> {errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiDollarSign className="text-primary-600" /> Giá bán
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.price}
                                            onChange={handlePriceChange}
                                            className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-500 outline-none"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">VND</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiCheckCircle className="text-primary-600" /> Trạng thái
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-primary-500 outline-none"
                                    >
                                        <option value={1}>Đang bán</option>
                                        <option value={0}>Tạm ẩn</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <FiImage className="text-primary-600" /> Hình ảnh sản phẩm (Nhiều ảnh)
                                </label>

                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {existingImages.map((url, idx) => (
                                        <div key={`${url}-${idx}`} className="relative group aspect-square">
                                            <img src={url} className="w-full h-full object-cover rounded-xl border" />
                                            <button type="button" onClick={() => removeExistingImage(url)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg">
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {newImages.map((file, idx) => (
                                        <div key={idx} className="relative group aspect-square">
                                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-xl border-2 border-primary-200" />
                                            <button type="button" onClick={() => removeNewImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg">
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all">
                                        <FiPlus size={24} className="text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-500 mt-1">Thêm ảnh</span>
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                                {errors.images && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><FiAlertCircle /> {errors.images}</p>}
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <FiBox className="text-primary-600" /> Danh mục sản phẩm
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((cat) => (
                                        <label key={cat._id} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.categoryId === cat._id ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-50 hover:border-slate-200"}`}>
                                            <input type="radio" checked={formData.categoryId === cat._id} onChange={() => setFormData({ ...formData, categoryId: cat._id })} className="accent-primary-600" />
                                            <span className="text-xs font-bold">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiFileText className="text-primary-600" /> Mô tả sản phẩm
                                    </label>
                                    <button type="button" onClick={handleGenerateAI} disabled={aiLoading} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold disabled:bg-slate-300">
                                        {aiLoading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiZap /> AI Write</>}
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={aiKeyword}
                                    onChange={(e) => setAiKeyword(e.target.value)}
                                    placeholder="Từ khóa gợi ý cho AI..."
                                    className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-primary-500"
                                />

                                <textarea
                                    rows={12}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${errors.description ? "border-red-200 focus:border-red-400" : "border-slate-100 focus:border-primary-500"}`}
                                    placeholder="Thông tin chi tiết về chất liệu, kích thước, quy cách đóng gói..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all disabled:bg-slate-400"
                            >
                                {loading ? "Đang xử lý..." : submitText}
                            </button>

                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 border-2 ${message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                                    {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                                    <span className="text-sm font-bold">{message.text}</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}