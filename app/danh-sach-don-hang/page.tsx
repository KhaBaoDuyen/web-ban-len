"use client";
import { useEffect, useState } from "react";
import { formatVND } from "../utils/formatVND";
import {
    ShoppingBagIcon,
    UserIcon,
    PhoneIcon,
    CreditCardIcon,
    TrashIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function QuanLyDonHang() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllOrder();
    }, []);

    const getAllOrder = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/orders");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'processing': return 'Đang xử lý';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen  p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Quản lý đơn hàng</h1>
                        <p className="text-slate-500 text-sm mt-1">Tổng cộng {orders.length} đơn hàng trong hệ thống</p>
                    </div>
                    <button
                        onClick={getAllOrder}
                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700"
                    >
                        <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số lượng</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thanh toán</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={7} className="text-center py-20 text-slate-400">Đang tải dữ liệu...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-20 text-slate-400">Không tìm thấy đơn hàng nào</td></tr>
                                ) : (
                                    orders.map((order: any) => (
                                        <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                                                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                                                        {order.customerName}
                                                    </span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                        <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                                                        {order.customerPhone}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                    <ShoppingBagIcon className="w-4 h-4 text-indigo-500" />
                                                    {order.productName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 font-semibold">{order.quantity}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-slate-900">{formatVND(order.totalAmount)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase border border-slate-200 px-2 py-0.5 rounded bg-slate-50">
                                                    <CreditCardIcon className="w-3 h-3" />
                                                    {order.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}