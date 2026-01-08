"use client";
import { useEffect, useState } from "react";
import { formatVND } from "../utils/formatVND";
import { MagnifyingGlassIcon, ArrowPathIcon, PlusIcon, XMarkIcon, TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import MaterialImportForm from "./ImportYarn/page";

type SimpleImport = {
  _id: string;
  materialName: string;
  quantity: number;
  price: number;
  note: string;
  createdAt: string;
};

export default function QuanLyNguyenLieu() {
  const [imports, setImports] = useState<SimpleImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);

  // State cho việc xóa
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getImportHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/material-imports");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImports(data);
    } catch {
      toast.error("Không thể tải dữ liệu", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/material-imports/${deleteId}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error();

      toast.success("Đã xóa bản ghi", { position: "top-center" });
      setDeleteId(null);
      getImportHistory();
    } catch (error) {
      toast.error("Lỗi khi xóa dữ liệu");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    getImportHistory();
  }, []);

  const filtered = imports.filter(i =>
    (i.materialName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-primary-600">Lịch sử nhập kho</h1>
            <p className="text-slate-500 text-sm font-medium">Hệ thống quản lý vật tư sản xuất</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={getImportHistory}
              className="p-3 bg-white border border-slate-200 text-primary-600 rounded-xl hover:bg-primary-50 transition-all active:scale-95 shadow-sm"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setOpenForm(true)}
              className="flex-1 md:flex-none px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-95"
            >
              <PlusIcon className="w-5 h-5" /> Nhập mới
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-md mb-6">
          <MagnifyingGlassIcon className="w-5 h-5 text-primary-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nguyên liệu..."
            className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary-600 transition-all outline-none"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary-600 text-white">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Nguyên liệu</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Ghi chú</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Tổng cộng</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider w-20">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filtered.map((i) => (
                  <tr key={i._id} className="hover:bg-primary-50/40 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium">
                      {new Date(i.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{i.materialName}</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500 text-sm italic">{i.note || "Không có ghi chú"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-base font-black text-primary-600">{formatVND(i.price)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setDeleteId(i._id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {openForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
             <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] transition-opacity"
              onClick={() => setOpenForm(false)}
            />

             <div className="relative rounded-2xl bg-white w-full max-w-lg 
                    h-[92vh] sm:h-auto 
                    rounded-t-[20px] sm:rounded-xl 
                    shadow-2xl 
                    animate-in slide-in-from-bottom sm:zoom-in 
                    duration-300 ease-out 
                    flex flex-col overflow-hidden"
            >
               <div className="sm:hidden flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>

               <div className="p-5 sm:p-8 overflow-y-auto flex-1">
                <MaterialImportForm
                  onClose={() => setOpenForm(false)}
                  onSuccess={() => {
                    getImportHistory();
                    setOpenForm(false);
                    toast.success("Đã nhập kho thành công", {
                      position: "top-center",
                      style: { borderRadius: '10px', background: '#333', color: '#fff' }
                    });
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDeleteId(null)} />
            <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl p-8 text-center animate-in zoom-in duration-150">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Xác nhận xóa?</h3>
              <p className="text-slate-500 mb-8 font-medium">Hành động này không thể hoàn tác. Bạn có chắc muốn xóa bản ghi này?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all flex items-center justify-center"
                >
                  {isDeleting ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : "Xóa ngay"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}