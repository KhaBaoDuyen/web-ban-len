"use client";
import { useEffect, useState } from "react";
import { formatVND } from "../utils/formatVND";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  ArrowPathIcon,
  EyeIcon,
  PlusIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";
import type { MaterialImport } from "../types/Materia"
 
export default function QuanLyNguyenLieu() {
  const [imports, setImports] = useState<MaterialImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getImportHistory();
  }, []);

  const getImportHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/material-imports");
      if (!res.ok) throw new Error("Lỗi tải dữ liệu");
      const data = await res.json();
      setImports(data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải lịch sử nhập kho");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = imports.filter((item) => {
    const keyword = search.trim().toLowerCase();
    return (
      item.yarn?.name.toLowerCase().includes(keyword) ||
      item.yarn?.colorName.toLowerCase().includes(keyword) ||
      (item.supplier || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl  text-slate-900 font-semibold tracking-tight">
              Lịch sử nhập kho
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Quản lý dòng tiền và số lượng nguyên liệu đầu vào • {filteredData.length} giao dịch
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={getImportHistory}
              className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all text-sm font-bold text-slate-700 active:scale-95"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>

            <Link
              href="/nguyen-lieu-nhap/ImportYarn"
              className="inline-flex items-center gap-2 bg-slate-900 px-5 py-2.5 rounded-2xl text-white shadow-lg shadow-slate-200 hover:bg-black transition-all text-sm font-bold active:scale-95"
            >
              <PlusIcon className="w-4 h-4 stroke-[3px]" />
              Nhập hàng mới
            </Link>
          </div>
        </div>

         <div className="mb-6 flex justify-between items-center gap-4">
            <div className="relative w-full max-w-md">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm tên len, màu hoặc nhà cung cấp..."
                    className="w-full pl-12 pr-4 py-3.5 text-sm border-2 bg-white border-slate-100 rounded-2xl outline-none focus:border-primary-500 transition-all shadow-sm"
                />
            </div>
        </div>

         <div className="bg-white rounded-xl shadow-xl  border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Ngày nhập</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Nguyên liệu</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Màu sắc</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Số lượng</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Đơn giá</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Thành tiền</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-24">
                      <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
                      <p className="mt-4 text-slate-400 font-bold text-sm">Đang truy xuất dữ liệu...</p>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-24 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <MagnifyingGlassIcon className="w-10 h-10 text-slate-200" />
                        <p className="font-bold">Không tìm thấy dữ liệu phù hợp</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                       <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </td>

                      {/* Tên len */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 text-base">
                          {item.yarn?.name || "N/A"}
                        </span>
                        {item.supplier && (
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                            NCC: {item.supplier}
                          </p>
                        )}
                      </td>

                      {/* Màu sắc */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-slate-200 shadow-sm"
                            style={{ backgroundColor: item.yarn?.colorCode }}
                          />
                          <span className="text-sm font-semibold text-slate-600 capitalize">
                            {item.yarn?.colorName}
                          </span>
                        </div>
                      </td>

                      {/* Số lượng */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-black">
                          {item.quantity} cuộn
                        </span>
                      </td>

                      {/* Giá nhập */}
                      <td className="px-6 py-4 text-right font-medium text-slate-500 text-sm">
                        {formatVND(item.price)}
                      </td>

                      {/* Thành tiền */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-slate-900">
                          {formatVND(item.price * item.quantity)}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
           {!loading && filteredData.length > 0 && (
            <div className="bg-primary-200 p-6 flex justify-between items-center text-primary-700">
                <span className="text-sm font-bold   uppercase tracking-widest">Tổng chi phí nhập kho</span>
                <span className="text-2xl font-black">
                    {formatVND(filteredData.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}