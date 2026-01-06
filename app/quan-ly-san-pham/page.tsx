"use client";
import Link from "next/link";
import { PRODUCT_DATA } from "@/app/data/PRODUCT_DATA";
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { formatVND } from "../utils/formatVND";
import { useEffect, useState } from "react";
import type { Product } from "@/app/types/product.type";

export default function QuanLySanPham() {
    const [products, setProducts] = useState();
    useEffect(() => {
        getAllProduct();
    }, []);

    const getAllProduct = async () => {
        try {
            const res = await fetch("/api/products");

            if (!res.ok) {
                throw new Error("Lấy dữ liệu thất bại");
            }

            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    // CAP NHAT STATUS 
    const toggleStatus = async (id: string, currentStatus: 0 | 1) => {
        const newStatus = currentStatus === 1 ? 0 : 1;

        try {
            const res = await fetch(`/api/products/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Update status failed");

            setProducts((prev) =>
                prev.map((p) =>
                    p._id === id ? { ...p, status: newStatus } : p
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="sticky top-10">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Quản lý kho hàng
                        </h1>
                        <p className="text-slate-500 text-md">
                            Hiện có {PRODUCT_DATA.length} sản phẩm trong hệ thống
                        </p>
                    </div>

                    <button className="inline-flex items-center justify-center gap-2 bg-accent-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95">
                        <PlusIcon className="w-5 h-5" />
                        <Link href={"/quan-ly-san-pham/them-san-pham"}>Thêm sản phẩm</Link>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-md font-semibold text-slate-500 uppercase tracking-wider">Thông tin</th>
                                    <th className="px-6 py-4 text-left text-md font-semibold text-slate-500 uppercase tracking-wider">Mô tả</th>
                                    <th className="px-6 py-4 text-left text-md font-semibold text-slate-500 uppercase tracking-wider">Giá niêm yết</th>
                                    <th className="px-6 py-4 text-left text-md font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-right text-md font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {(products ?? []).length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-6 text-slate-400">
                                            Chưa có sản phẩm
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product, index) => (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 text-center py-4  ">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                                        <img
                                                            src={`${product.image}`}
                                                            alt={product.name}
                                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-700 leading-tight">
                                                            {product.name}
                                                        </span>
                                                        <span className="text-xs text-slate-400 mt-1">ID: #SP-{1000 + index}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-slate-500 text-md max-w-xs text-justify line-clamp-5 ">
                                                {product.description}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center text-md font-bold text-slate-700">
                                                {formatVND(product.price)}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleStatus(product._id, product.status)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                                    ${product.status === "active" ? "bg-green-500" : "bg-slate-300"}`} >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                    ${product.status === "active" ? "translate-x-5" : "translate-x-1"}`}  />
                                                </button>

                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right text-md">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/quan-ly-san-pham/${product.slug}`}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    >
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </Link>
                                                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
                </div>

                {/* Mobile view alternative (optional) */}
                <div className="md:hidden mt-4 space-y-4">
                    {PRODUCT_DATA.map((product, index) => (
                        <div key={index} className="border rounded-xl shadow-sm p-4 flex justify-between items-start">
                            <div className="flex gap-3">
                                <img
                                    src={`/assets/products/${product.image}`}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-xl"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-700">{product.name}</span>
                                    <span className="text-xs text-slate-400 mt-0.5">ID: #SP-{1000 + index}</span>
                                    <span className="text-sm font-bold text-slate-700 mt-1">{formatVND(product.price)}</span>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-2">
                                <Link
                                    href={`/quan-ly-san-pham/${product.slug}`}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                >
                                    <PencilSquareIcon className="w-5 h-5" />
                                </Link>
                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
