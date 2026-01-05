"use client";
import { useState, useEffect } from "react";
import {
  FiBox, FiLink, FiDollarSign, FiFileText, FiImage,
  FiX, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiZap
} from "react-icons/fi";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    image: null as File | null,
    description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({ name: "", price: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" as "success" | "error" });
  const [aiLoading, setAiLoading] = useState(false);
  useEffect(() => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;

    if (name === "image") {
      const file = files?.[0];
      setErrors((prev) => ({ ...prev, image: "" }));

      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "Định dạng ảnh phải là JPG, PNG hoặc WebP" }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Kích thước ảnh không được vượt quá 2MB" }));
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", price: "", image: "" };

    if (!formData.name) { newErrors.name = "Tên sản phẩm bắt buộc"; valid = false; }
    if (!formData.price || Number(formData.price) <= 0) { newErrors.price = "Giá phải lớn hơn 0"; valid = false; }
    if (!formData.image) { newErrors.image = "Vui lòng chọn ảnh sản phẩm"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  //TAO MO TA VOI AI
  const handleGenerateAI = async () => {
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Vui lòng nhập tên sản phẩm trước khi tạo mô tả AI" }));
      return;
    }

    setAiLoading(true);
    setErrors((prev) => ({ ...prev, name: "" }));

    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Viết mô tả sản phẩm hấp dẫn bằng tiếng Việt cho: ${formData.name}` }),
      });

      const data = await res.json();
      if (data.text) setFormData((prev) => ({ ...prev, description: data.text }));
      else setMessage({ text: "AI không tạo được mô tả", type: "error" });
    } catch {
      setMessage({ text: "Không thể kết nối AI", type: "error" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("slug", formData.slug);
      payload.append("price", formData.price);
      payload.append("description", formData.description);
      if (formData.image) payload.append("image", formData.image);

      const res = await fetch("/api/products", {
        method: "POST",
        body: payload,
      });

      if (res.ok) {
        setMessage({ text: "Thêm sản phẩm thành công!", type: "success" });
        setFormData({ name: "", slug: "", price: "", image: null, description: "" });
        setImagePreview(null);
      } else {
        setMessage({ text: "Có lỗi xảy ra khi lưu dữ liệu", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Không thể kết nối đến máy chủ", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">

          <div className="p-8 border-b border-slate-100 bg-white">
            <h2 className="text-3xl font-bold text-primary-600 ">Thêm sản phẩm mới</h2>
            <p className="text-slate-500 mt-2 font-medium">Hoàn tất các thông tin bên dưới để đăng tải sản phẩm</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                    type="number"
                    name="price"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
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
              <span className="flex justify-between">
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
              
              <div className="flex gap-2">
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập thông tin chi tiết về sản phẩm..."
                  className="flex-1 w-full px-4 py-4 rounded-xl border-2 border-slate-100 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all resize-none font-medium"
                />

              </div>
            </div>

            {message.text && (
              <div className={`flex items-center gap-3 p-5 rounded-xl border-2 animate-in fade-in slide-in-from-bottom-2 ${message.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
                }`}>
                {message.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                <p className="text-sm font-bold">{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-xl font-black text-lg text-white shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${loading ? "bg-slate-300 cursor-not-allowed shadow-none" : "bg-accent-600 hover:bg-indigo-700 shadow-indigo-200"
                }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiUploadCloud size={22} />
                  Xác nhận thêm sản phẩm
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}