"use client";
import { useState, useEffect } from "react";
import {
    FiBox, FiLink, FiDollarSign, FiFileText, FiImage,
    FiX, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiZap,
} from "react-icons/fi";
import type { Product } from "@/app/types/product.type";
import type { Category } from "@/app/types/categories.type";
import Link from "next/link";


type Props = {
    initialData?: Partial<Product>;
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


    const [formData, setFormData] = useState<Product>({
        name: initialData.name || "",
        slug: initialData.slug || "",
        price: initialData.price || "",
        image: null,
        imageUrl: initialData.imageUrl || null,
        description: initialData.description || "",
        status: initialData.status || 1,
        categoryId: initialData.categoryId || "",
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        initialData.imageUrl ?? null
    );

    const [errors, setErrors] = useState({
        name: "",
        price: "",
        image: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
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

        setFormData((prev) => ({ ...prev, slug }));
    }, [formData.name]);


    const handleRemoveImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
        setErrors((prev) => ({ ...prev, image: "" }));
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === "image") {
            const file = files?.[0];
            if (!file) return;

            setFormData((p) => ({ ...p, image: file }));
            setImagePreview(URL.createObjectURL(file));
            return;
        }

        setFormData((p) => ({ ...p, [name]: value }));
    };


    const validate = () => {
        let valid = true;
        const newErrors = { name: "", price: "", image: "", description: "" };

        if (!formData.name) { newErrors.name = "Tên sản phẩm bắt buộc"; valid = false; }
        const numericPrice = Number(formData.price.replace(/\D/g, ""));

        if (!numericPrice || numericPrice <= 0) {
            newErrors.price = "Giá phải lớn hơn 0";
            valid = false;
        }

        if (!formData.image && !imagePreview) {
            newErrors.image = "Vui lòng chọn ảnh sản phẩm";
            valid = false;
        }
        if (!formData.description) { newErrors.description = "Vui lòng nhập mô tả hoặc tạo bằng AI"; valid = false; }
        if (!formData.categoryId) {
            valid = false;
            alert("Vui lòng chọn danh mục");
        }

        setErrors(newErrors);
        return valid;
    };


    //TAO MO TA VOI AI
    const [aiKeyword, setAiKeyword] = useState("");

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
                body: JSON.stringify({
                    name: formData.name,
                    keywords: aiKeyword,
                }),

            });
            const data = await res.json();
            if (data.text) setFormData((p) => ({ ...p, description: data.text }));
        } finally {
            setAiLoading(false);
        }
    };

    //RESET FORM 
    const resetForm = () => {
        setFormData({
            name: "",
            slug: "",
            price: "",
            image: null,
            description: "",
            status: 1,
            categoryId: "",
        });
        setImagePreview(null);
        setErrors({ name: "", price: "", image: "", description: "" });
        setMessage({ text: "", type: "success" });
    };


    //HAM XU LY
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        const payload = new FormData();

        Object.entries(formData).forEach(([k, v]) => {
            if (!v) return;

            if (k === "price") {
                const numericPrice = Number((v as string).replace(/\D/g, ""));
                payload.append("price", String(numericPrice));
            } else {
                payload.append(k, v as any);
            }
        });

        const result = await onSubmit(payload);

        setMessage({
            text: result.message,
            type: result.ok ? "success" : "error",
        });

        setLoading(false);

        if (result.ok && mode === "add") {
            resetForm();
        }

    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");

        if (!raw) {
            setFormData((p) => ({ ...p, price: "" }));
            return;
        }

        const formatted = new Intl.NumberFormat("vi-VN").format(Number(raw));

        setFormData((p) => ({
            ...p,
            price: formatted,
        }));
    };

    useEffect(() => {
        if (mode !== "edit" || !initialData) return;

        const rawCategoryId: any = initialData.categoryId;

        const categoryId =
            typeof rawCategoryId === "string"
                ? rawCategoryId
                : rawCategoryId?.$oid
                    ? rawCategoryId.$oid
                    : rawCategoryId?._id
                        ? rawCategoryId._id
                        : "";

        setFormData({
            name: initialData.name ?? "",
            slug: initialData.slug ?? "",
            price: initialData.price ?? "",
            image: null,
            imageUrl: initialData.imageUrl ?? null,
            description: initialData.description ?? "",
            status: initialData.status ?? 1,
            categoryId,
        });

        setImagePreview(initialData.imageUrl ?? null);
    }, [mode, initialData]);




    // HAM LAY DANH MUC 
    const [categories, setCategories] = useState<Category[]>([]);
    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error("Lỗi lấy danh mục", err);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen  lg:py-10 py-5 px-4">
            <div className="lg:w-10/12 mx-auto">
                <div className="bg-white rounded-xl shadow-xl  overflow-hidden">


                    <div className="p-8 border-b border-slate-100 bg-white">
                        <span className="">
                            <Link href="/quan-ly-san-pham" className="hover:underline font-bold text-primary-600 ">Trở về</Link>
                        </span>
                        <h2 className="text-2xl font-bold text-primary-600 ">{title}</h2>
                        <p className="text-slate-500 mt-2 font-medium">Hoàn tất các thông tin bên dưới để đăng tải sản phẩm</p>
                    </div>

                    <form onSubmit={handleSubmit} className="lg:p-8 p-3 space-y-8 lg:grid grid-cols-2 gap-5 ">
                        <div className="">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiBox className="text-indigo-600" /> Tên sản phẩm <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Ví dụ: Áo Hoodie Unisex"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${errors.name ? "border-red-200 focus:border-red-400 focus:ring-red-50" : "border-slate-100 focus:border-indigo-500 focus:ring-indigo-50"
                                            }`}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><FiAlertCircle /> {errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiLink className="text-slate-400" /> Slug hệ thống
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 text-slate-400 cursor-not-allowed font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiDollarSign className="text-indigo-600" /> Giá bán <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            name="price"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={handlePriceChange}
                                            className={`w-full pl-4 pr-16 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${errors.price ? "border-red-200 focus:border-red-400 focus:ring-red-50" : "border-slate-100 focus:border-indigo-500 focus:ring-indigo-50"
                                                }`}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-300">VND</span>
                                    </div>
                                    {errors.price && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><FiAlertCircle /> {errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiImage className="text-indigo-600" /> Hình ảnh <span className="text-red-500">*</span>
                                    </label>
                                    <label className={`flex items-center justify-center w-full h-[52px] px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer group ${errors.image ? "border-red-200 bg-red-50" : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"
                                        }`}>
                                        <div className="flex items-center gap-2">
                                            <FiUploadCloud className={errors.image ? "text-red-400" : "text-slate-400 group-hover:text-indigo-500"} />
                                            <span className={`text-sm font-semibold truncate max-w-[150px] ${errors.image ? "text-red-500" : "text-slate-500 group-hover:text-indigo-600"}`}>
                                                {formData.image ? formData.image.name : "Tải ảnh lên"}
                                            </span>
                                        </div>
                                        <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
                                    </label>
                                    {errors.image && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><FiAlertCircle /> {errors.image}</p>}
                                </div>
                            </div>

                            {imagePreview && (
                                <div className="flex justify-center pt-2">
                                    <div className="relative p-2 bg-white rounded-xl border-2 border-indigo-100 shadow-xl shadow-indigo-100/50">
                                        <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-xl" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all"
                                        >
                                            <FiX size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <FiBox className="text-indigo-600" /> Danh mục <span className="text-red-500">*</span>
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    {categories.map((cat) => {
                                        const checked = formData.categoryId === cat._id;
                                        console.log("FORM:", formData.categoryId);
                                        console.log("CAT:", cat._id);

                                        return (
                                            <label
                                                key={cat._id}
                                                className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
          ${checked ? "border-indigo-500 bg-indigo-50" : "border-slate-100 hover:border-indigo-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={cat._id}
                                                    checked={checked}
                                                    onChange={() =>
                                                        setFormData((p) => ({ ...p, categoryId: cat._id }))
                                                    }
                                                    className="accent-indigo-600"
                                                />
                                                <span className="font-semibold text-slate-700">{cat.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>

                                {!formData.categoryId && (
                                    <p className="text-xs text-red-500 font-bold">Vui lòng chọn danh mục</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl mt-5 font-bold text-lg text-white bg-accent-600"
                            >
                                {loading ? "Đang xử lý..." : submitText}
                            </button>
                        </div>

                        <div className="flex flex-col gap-5 mt-5">
                            <div className="space-y-2 ">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiCheckCircle className="text-indigo-600" /> Trạng thái
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium bg-white"
                                    >
                                        <option value="1">Đang bán (Hiển thị)</option>
                                        <option value="0">Tạm ngưng (Ẩn)</option>
                                    </select>
                                </div>

                                <span className="flex lg:flex-row flex-col gap-3 justify-between">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiFileText className="text-indigo-600" /> Mô tả sản phẩm
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleGenerateAI}
                                        disabled={aiLoading}
                                        className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all disabled:bg-slate-300"
                                    >
                                        {aiLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiZap />Tạo mô tả với AI</>}
                                    </button>
                                </span>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FiZap className="text-yellow-500" /> Từ khóa mô tả (cho AI)
                                    </label>
                                    <input
                                        type="text"
                                        value={aiKeyword}
                                        onChange={(e) => setAiKeyword(e.target.value)}
                                        placeholder="Ví dụ: thổ cẩm, thủ công, quà tặng, trang trí nhà cửa, vintage..."
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium bg-white"
                                    />
                                </div>

                                <div className=" gap-2">
                                    <textarea
                                        name="description"
                                        rows={10}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Nhập thông tin chi tiết về sản phẩm..."
                                        className={`w-full pl-4 pr-16 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${errors.description ? "border-red-200 focus:border-red-400 focus:ring-red-50" : "border-slate-100 focus:border-indigo-500 focus:ring-indigo-50"
                                            }`} />
                                    {errors.description && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><FiAlertCircle /> {errors.description}</p>}

                                </div>
                            </div>

                            {message.text && (
                                <div className={`flex items-center gap-3 p-5 rounded-xl border-2 animate-in fade-in slide-in-from-bottom-2 ${message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
                                    }`}>
                                    {message.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                                    <p className="text-sm font-bold">{message.text}</p>
                                </div>
                            )}

                        </div>


                    </form>
                </div>
            </div>
        </div>
    );
}
