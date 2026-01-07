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
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { Search } from "../components/UI/Search";

export default function QuanLySanPham() {
    const [products, setProducts] = useState<Product[]>([]);
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
    const toggleStatus = async (slug: string, currentStatus: 0 | 1) => {
        const newStatus: 0 | 1 = currentStatus === 1 ? 0 : 1;

        try {
            const res = await fetch(`/api/products/${slug}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();
            console.log("STATUS:", res.status);
            console.log("RESPONSE:", data);

            if (!res.ok) throw new Error(data.message || "Update thất bại");

            setProducts((prev) =>
                prev.map((p) =>
                    p.slug === slug ? { ...p, status: newStatus } : p
                )
            );
        } catch (error) {
            console.error("Lỗi toggle status:", error);
        }
    };


    //XOA SAN PHAM
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);


    const handleDelete = async () => {
        if (!selectedSlug || isDeleting) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/products/${selectedSlug}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Xóa thành công!");
                setProducts(prev => prev.filter(p => p.slug !== selectedSlug));
                setOpenDelete(false);
                setSelectedSlug(null);
            } else {
                toast.error(data.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Không thể kết nối đến server");
        } finally {
            setIsDeleting(false);
        }
    };


    // TIM KIEM SAN PHAM 
    const [search, setSearch] = useState("");
    const filterProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen  p-4 md:p-8">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
                    <div className="sticky top-10">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Quản lý kho hàng
                        </h1>
                        <p className="text-slate-500 text-md">
                            Hiện có {products.length} sản phẩm trong hệ thống
                        </p>
                    </div>

                    <div className="inline-flex items-center justify-center gap-2 bg-accent-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95">
                        <PlusIcon className="w-5 h-5" />
                        <Link href={"/quan-ly-san-pham/them-san-pham"}>Thêm sản phẩm</Link>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
                    <div className="relative  w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên sản phẩm..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2.5 bg-primary-100 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.6-5.15a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
                        </svg>
                    </div>
                </div>


                <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                                    filterProducts.map((product, index) => (
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
                                                    <div className="flex flex-col text-left">
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
                                                {formatVND(Number(product.price))}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleStatus(product.slug, product.status)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                                    ${product.status === 1 ? "bg-green-500" : "bg-slate-300"}`} >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                    ${product.status === 1 ? "translate-x-5" : "translate-x-1"}`} />
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
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedSlug(product.slug);
                                                            setOpenDelete(true);
                                                        }}
                                                        disabled={isDeleting}
                                                        className={`p-2 rounded-lg transition-all ${isDeleting
                                                            ? "opacity-50 cursor-not-allowed bg-slate-100"
                                                            : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                            }`}
                                                    >
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

                <div className="md:hidden mt-4 space-y-4">
                    {products.map((product, index) => (
                        <div key={index} className="border rounded-xl shadow-sm p-4 flex justify-between items-start">
                            <div className="flex gap-3">
                                <img
                                    src={`${product.image}`}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-xl"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-700">{product.name}</span>
                                    <span className="text-xs text-slate-400 mt-0.5">ID: #SP-{1000 + index}</span>
                                    <span className="text-sm font-bold text-slate-700 mt-1">{formatVND(Number(product.price))}</span>
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
                                <button
                                    onClick={() => {
                                        setSelectedSlug(product.slug);
                                        setOpenDelete(true);
                                    }}
                                    disabled={isDeleting}
                                    className={`p-2 rounded-lg transition-all ${isDeleting
                                        ? "opacity-50 cursor-not-allowed bg-slate-100"
                                        : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        }`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
                {openDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in">
                            <h2 className="text-lg font-bold text-slate-800">
                                Xác nhận xoá sản phẩm
                            </h2>
                            <p className="text-slate-500 mt-2">
                                Bạn có chắc chắn muốn xoá sản phẩm này không? Hành động này không thể hoàn tác.
                            </p>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setOpenDelete(false)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 rounded-xl border font-semibold text-slate-600 hover:bg-slate-100"
                                >
                                    Huỷ
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isDeleting ? "Đang xoá..." : "Xoá"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
