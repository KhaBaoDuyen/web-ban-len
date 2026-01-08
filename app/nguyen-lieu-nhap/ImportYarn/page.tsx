"use client";
import { useEffect, useState } from "react";
import { Search, Package, Trash2, PlusCircle, DollarSign, Hash, PlusIcon, X } from "lucide-react";
import CreateYarn from "../createYarn/page";

type YarnItem = {
  _id: string;
  name: string;
  colorName: string;
  colorCode: string;
  image?: string;
};

export default function ImportYarnForm() {
  const [yarns, setYarns] = useState<YarnItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<YarnItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [supplier, setSupplier] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchYarns = () => {
    fetch("/api/yarns")
      .then(res => res.json())
      .then(data => setYarns(data));
  };

  useEffect(() => {
    fetchYarns();
  }, []);

  const filtered = yarns.filter(y =>
    `${y.name || ""} ${y.colorName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setLoading(true);
    try {
      const res = await fetch("/api/material-imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yarnId: selected._id,
          quantity,
          price,
          supplier
        })
      });

      if (res.ok) {
        setQuantity(1);
        setPrice(0);
        setSupplier("");
        setSelected(null);
        setSearch("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:py-12 py-6 px-4">
      <div className="max-w-2xl mx-auto relative">

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full z-10 transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="max-h-[90vh] overflow-y-auto">
                <CreateYarn onCreated={() => {
                  setShowCreateModal(false);
                  fetchYarns();
                  setSearch("");
                }} />
              </div>
            </div>
          </div>
        )}

        <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 transition-all">

          <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-xl uppercase tracking-tight">Nhập Kho Vật Liệu</h2>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold">Inventory Management</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
            >
              <PlusIcon className="w-4 h-4" />
              Mã len mới
            </button>
          </div>

          <div className="p-6 lg:p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wide">
                1. Chọn mặt hàng
              </label>

              {!selected ? (
                <div className="relative group">
                  <input
                    placeholder="Gõ tên hoặc mã màu để tìm..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 pl-12 focus:border-blue-500 focus:bg-white transition-all outline-none shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                  {filtered.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-64 overflow-y-auto p-2 space-y-1 animate-in slide-in-from-top-2">
                      {filtered.map(y => (
                        <button
                          key={y._id}
                          type="button"
                          onClick={() => setSelected(y)}
                          className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group/item"
                        >
                          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0" style={{ background: y.colorCode }} />
                          <div className="text-left">
                            <p className="font-bold text-slate-800">{y.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{y.colorName}</p>
                          </div>
                          <PlusCircle className="ml-auto w-5 h-5 text-slate-200 group-hover/item:text-blue-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4 bg-blue-50/50 border-2 border-blue-200 rounded-2xl p-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md border-2 border-white shrink-0">
                    {selected.image ? (
                      <img src={selected.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: selected.colorCode }} />
                      <p className="font-bold text-slate-900">{selected.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">{selected.colorName}</p>
                  </div>
                  <button onClick={() => { setSelected(null); setSearch(""); }} className="p-2 bg-white hover:bg-red-50 text-red-500 rounded-xl shadow-sm transition-colors border border-red-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wide">Số lượng</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 pl-10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wide">Giá nhập</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 pl-10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <button
              disabled={loading || !selected}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl transition-all flex items-center justify-center gap-3
                ${loading || !selected
                  ? 'bg-slate-200 cursor-not-allowed text-slate-400 shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200'
                }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Xác nhận nhập kho"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
