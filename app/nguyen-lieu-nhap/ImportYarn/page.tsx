"use client";
import { useState } from "react";
import { PackagePlus, CalendarDays, X } from "lucide-react";

interface ImportYarnFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportYarnForm({ onClose, onSuccess }: ImportYarnFormProps) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const formatNumber = (val: string) => {
    const num = val.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setPrice(formatNumber(raw));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/material-imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "simple",
          name: name,
          price: Number(price.replace(/\./g, "")),
          quantity: 1,
          note: note,
          createdAt: date
        })
      });
      if (res.ok) onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
       <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Nhập kho nguyên liệu</h2>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Thông tin kiện hàng</p>
          </div>
        </div>
        <button onClick={onClose} className="sm:hidden p-2 text-slate-400">
           <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={submit} className="flex-1   space-y-5 pb-4 custom-scrollbar">
         <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 ml-1 uppercase">Tên kiện hàng / Nguyên liệu</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Kiện len tháng 2..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm text-slate-800"
          />
        </div>

         <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 ml-1 uppercase">Tổng giá trị</label>
          <div className="relative">
            <input
              required
              value={price}
              onChange={handlePriceChange}
              inputMode="numeric"
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-primary-600 text-lg focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">VNĐ</span>
          </div>
        </div>

         <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 ml-1 uppercase">Ngày nhập</label>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm text-slate-800"
            />
          </div>
        </div>

         <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 ml-1 uppercase">Ghi chú</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Mô tả kiện hàng..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none transition-all text-sm text-slate-800 resize-none"
          />
        </div>
      </form>

       <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t mt-4">
        <button
          disabled={loading}
          type="submit"
          onClick={(e) => {
              if(e.currentTarget.type !== 'submit') submit(e as any);
          }}
          className="order-1 sm:order-2 flex-[2] bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Xác nhận nhập kho"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="order-2 sm:order-1 flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}