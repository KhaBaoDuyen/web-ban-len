"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product } from "@/app/types/product.type";
import { formatVND } from "@/app/utils/formatVND";
import {
    FiMinus, FiPlus, FiShoppingCart, FiChevronRight,
    FiChevronUp, FiChevronDown, FiShield, FiTruck,
    FiRefreshCw, FiUser, FiPhone, FiCreditCard, FiPackage,
    FiFileText
} from "react-icons/fi";
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDetail() {
    const params = useParams();
    const slug = params.slug as string;

    const [data, setData] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [openDecription, setOpenDecription] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);


    const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", paymentMethod: "cod", note: "" });
    const [errors, setErrors] = useState({ name: "", phone: "" });

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetch(`/api/products/${slug}`)
            .then((res) => res.json())
            .then((res) => {
                setData(res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [slug]);

    const handleCheckout = async () => {
        let valid = true;
        const newErrors = { name: "", phone: "" };

        if (!customerInfo.name.trim()) {
            newErrors.name = "Họ tên không được để trống";
            valid = false;
        }

        const phone = customerInfo.phone.trim();
        const phoneRegex = /^0[35789][0-9]{8}$/;

        if (!phone) {
            newErrors.phone = "Số điện thoại không được để trống";
            valid = false;
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (phải là số VN, 10 chữ số, bắt đầu bằng 0)";
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) {
            toast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        const loadingToast = toast.loading("Đang gửi đơn hàng móc len...");

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: data?._id,
                    productName: data?.name,
                    price: data?.price,
                    note: customerInfo?.note,
                    quantity: quantity,
                    customerName: customerInfo.name,
                    customerPhone: customerInfo.phone,
                    paymentMethod: customerInfo.paymentMethod = "cod",
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Đặt hàng thành công!", { id: loadingToast });
                setCustomerInfo({ name: "", phone: "", paymentMethod: "cod", note: "" });
                setQuantity(1);
            } else {
                toast.error(result.message || "Đặt hàng thất bại", { id: loadingToast });
            }
        } catch (error) {
            toast.error("Lỗi mạng, không thể gửi đơn hàng", { id: loadingToast });
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-accent-600">Đang tải...</div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Sản phẩm không tồn tại!</div>;

    return (
        <div className=" min-h-screen pb-10">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-white  ">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-accent-600 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-accent-600 transition">Trang chủ</Link>
                    <FiChevronRight size={14} />
                    <Link href="/san-pham" className="hover:text-accent-600 transition">Sản phẩm</Link>
                    <FiChevronRight size={14} />
                    <span className="text-slate-900 font-medium truncate">{data.name}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-5">
                        <div className="sticky top-6 aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <img
                                src={typeof data.image === 'string' ? data.image : ''}
                                alt={data.name}
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white lg:p-6 p-3 rounded-2xl shadow-sm border border-slate-100">
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-3 bg-accent-100 text-accent-600 uppercase tracking-widest">
                                {data.status === 1 ? 'Còn hàng' : 'Tạm hết hàng'}
                            </span>

                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2 leading-tight">{data.name}</h1>

                            <div className="text-3xl font-black text-accent-600 mb-6">
                                {formatVND(Number(data.price))}
                            </div>

                            <div className="bg-primary-50 lg:p-5 p-3 rounded-xl border border-slate-200 space-y-4 mb-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <FiShoppingCart className="text-accent-600" /> Thông tin đặt hàng
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Họ và tên *"
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white outline-none transition ${errors.name ? 'border-red-500' : 'border-slate-200 focus:border-accent-600'}`}
                                                value={customerInfo.name}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setCustomerInfo({ ...customerInfo, name: value });
                                                    if (value.trim()) {
                                                        setErrors((prev) => ({ ...prev, name: "" }));
                                                    }
                                                }}

                                            />
                                        </div>
                                        {errors.name && <p className="text-[11px] text-red-500 ml-1">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="relative">
                                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="tel"
                                                placeholder="Số điện thoại *"
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white outline-none transition 
                                                ${errors.phone ? 'border-red-500' : 'border-slate-200 focus:border-accent-600'}`}
                                                value={customerInfo.phone}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, "");
                                                    if (value.length > 10) value = value.slice(0, 10);

                                                    setCustomerInfo({ ...customerInfo, phone: value });

                                                    const phoneRegex = /^0[35789][0-9]{8}$/;

                                                    if (phoneRegex.test(value)) {
                                                        setErrors((prev) => ({ ...prev, phone: "" }));
                                                    }
                                                }}
                                            />

                                        </div>
                                        {errors.phone && <p className="text-[11px] text-red-500 ml-1">{errors.phone}</p>}
                                    </div>

                                </div>
                                <div className="space-y-1">
                                    <div className="relative">
                                        <FiFileText className="absolute left-3 top-3 text-slate-400" />
                                        <textarea
                                            placeholder="Ghi chú"
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white outline-none transition 
                 border-slate-200 focus:border-accent-600"
                                            value={customerInfo.note}
                                            onChange={(e) =>
                                                setCustomerInfo({ ...customerInfo, note: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>


                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-700">Hình thức thanh toán:</p>
                                    <div className="w-full">
                                        <label
                                            className={`
      flex w-full items-center gap-2 p-3 rounded-xl border cursor-pointer transition
      ${customerInfo.paymentMethod === 'cod'
                                                    ? 'border-accent-600 bg-accent-50'
                                                    : 'border-slate-200 bg-white hover:border-accent-300'}
    `}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="hidden"
                                                onChange={() =>
                                                    setCustomerInfo({ ...customerInfo, paymentMethod: 'cod' })
                                                }
                                            />

                                            <FiPackage
                                                className={`text-xl shrink-0 ${customerInfo.paymentMethod === 'cod'
                                                        ? 'text-accent-600'
                                                        : 'text-slate-400'
                                                    }`}
                                            />

                                            <span
                                                className={`text-sm font-semibold leading-tight ${customerInfo.paymentMethod === 'cod'
                                                        ? 'text-accent-600'
                                                        : 'text-slate-600'
                                                    }`}
                                            >
                                                Thanh toán khi nhận hàng
                                            </span>
                                        </label>
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-fit justify-between">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-accent-600 transition"><FiMinus /></button>
                                    <span className="px-8 font-black text-slate-800">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-accent-600 transition"><FiPlus /></button>
                                </div>
                                <button
                                    onClick={() => setOpenConfirm(true)}
                                    className="w-full flex-1 h-14 bg-primary-600 text-white font-bold py-2 rounded-xl hover:bg-accent-600 transition shadow-lg uppercase tracking-widest text-sm"
                                >
                                    Đặt hàng ngay
                                </button>

                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-accent-600 bg-accent-50 p-2 rounded-lg"><FiTruck size={20} /></div>
                                <span className="text-xs font-bold text-slate-600 uppercase">Giao toàn quốc</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-accent-600 bg-accent-50 p-2 rounded-lg"><FiShield size={20} /></div>
                                <span className="text-xs font-bold text-slate-600 uppercase">Chính hãng</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <div className="text-accent-600 bg-accent-50 p-2 rounded-lg"><FiRefreshCw size={20} /></div>
                                <span className="text-xs font-bold text-slate-600 uppercase">Đổi trả 7 ngày</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-accent-600 rounded-full"></div>
                            Mô tả sản phẩm
                        </h2>
                        <div className={`relative overflow-hidden transition-all duration-500 ${openDecription ? "max-h-full" : "max-h-48"}`}>
                            <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-line text-sm">
                                {data.description}
                            </p>
                            {!openDecription && (
                                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
                            )}
                        </div>
                        <button
                            onClick={() => setOpenDecription(!openDecription)}
                            className="mt-4 mx-auto flex items-center gap-2 text-accent-600 font-bold hover:underline transition"
                        >
                            {openDecription ? <>Thu gọn <FiChevronUp /></> : <>Xem thêm chi tiết <FiChevronDown /></>}
                        </button>
                    </div>

                    <div className="bg-accent-50 p-6 rounded-2xl border border-accent-100">
                        <h2 className="text-accent-800 font-black mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent-600 rounded-full animate-pulse"></span>
                            Thông tin đơn hàng Order
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            {[
                                "Sản phẩm handmade order từ 3-7 ngày tùy độ khó",
                                "Màu len thực tế có thể chênh lệch do lô len nhuộm khác nhau",
                                "Kích thước có thể sai số 1-2cm do tính chất len sợi",
                                "Vui lòng không hủy đơn sau khi shop đã bắt đầu móc sản phẩm",
                                "Nhận móc theo yêu cầu và màu sắc cá nhân qua tin nhắn",
                                "Chỉ giải quyết khiếu nại khi có video khui hàng rõ nét"
                            ].map((note, i) => (
                                <li key={i} className="flex items-start gap-2 text-[13px] text-accent-700 font-medium">
                                    <div className="mt-1 flex-shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {openConfirm && data && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in">

                            <h2 className="text-xl font-black text-slate-800 mb-4 text-center">
                                Xác nhận đơn hàng
                            </h2>

                            <div className="space-y-3 text-sm text-slate-700">
                                <div className="flex justify-between">
                                    <span>Sản phẩm:</span>
                                    <b>{data.name}</b>
                                </div>

                                <div className="flex justify-between">
                                    <span>Số lượng:</span>
                                    <b>{quantity}</b>
                                </div>

                                <div className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <b className="text-accent-600">
                                        {formatVND(Number(data.price) * quantity)}
                                    </b>
                                </div>

                                <hr />

                                <div>
                                    <p><b>Khách hàng:</b> {customerInfo.name}</p>
                                    <p><b>SĐT:</b> {customerInfo.phone}</p>
                                    <p><b>Thanh toán:</b> Thanh toán khi nhận hàng</p>
                                    <p><b>Ghi chú:</b> {customerInfo.note}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setOpenConfirm(false)}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold"
                                >
                                    Huỷ
                                </button>

                                <button
                                    onClick={() => {
                                        setOpenConfirm(false);
                                        handleCheckout();
                                    }}
                                    className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-accent-600 text-white font-bold shadow"
                                >
                                    Xác nhận đặt hàng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}