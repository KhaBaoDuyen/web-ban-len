"use client";
import { useState, useRef } from "react";
import { Plus, Image as ImageIcon, Palette, Type, CheckCircle2, AlertCircle, X } from "lucide-react";

export type Yarn = {
  _id?: string;
  name: string;
  colorName: string;
  colorCode: string;
  image: File | null;
};

export default function CreateYarn({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState<Yarn>({
    name: "",
    colorName: "",
    colorCode: "#3b82f6",
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const imagePreview = form.image ? URL.createObjectURL(form.image) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("colorName", form.colorName);
    fd.append("colorCode", form.colorCode);
    if (form.image) fd.append("image", form.image);

    try {
      const res = await fetch("/api/yarns", {
        method: "POST",
        body: fd
      });

      if (res.ok) {
        showToast("Thêm loại len mới thành công!", "success");
        setForm({ name: "", colorName: "", colorCode: "#3b82f6", image: null });
        onCreated?.();
      } else {
        showToast("Có lỗi xảy ra, vui lòng thử lại", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối server", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
       {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
          toast.type === "success" ? "bg-white border-green-100 text-green-800" : "bg-white border-red-100 text-red-800"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 p-1 hover:bg-slate-100 rounded-full">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Plus className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-xl text-slate-800">Thêm loại len mới</h2>
        </div>

         <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Type className="w-4 h-4" /> Tên dòng len
          </label>
          <input
            placeholder="VD: Cotton Milk 125g, Len Nhung Đũa..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-blue-500 focus:bg-white transition-all outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Tên màu
            </label>
            <input
              placeholder="VD: Xanh pastel, Đỏ đô..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-blue-500 focus:bg-white transition-all outline-none"
              value={form.colorName}
              onChange={(e) => setForm({ ...form, colorName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Mã màu đại diện</label>
            <div className="flex items-center gap-3 h-[52px] bg-slate-50 border-2 border-slate-100 rounded-2xl px-3">
              <input
                type="color"
                className="w-10 h-8 rounded cursor-pointer bg-transparent shadow-sm"
                value={form.colorCode}
                onChange={(e) => setForm({ ...form, colorCode: e.target.value })}
              />
              <span className="text-sm font-mono text-slate-500 uppercase">{form.colorCode}</span>
            </div>
          </div>
        </div>

         <button 
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
            ${loading 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-primary-900 hover:bg-black hover:shadow-xl active:scale-[0.98]'
            }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Lưu loại len vào danh mục
            </>
          )}
        </button>
      </form>
    </div>
  );
}