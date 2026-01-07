"use client";
import { useEffect, useState } from "react";
import { formatVND } from "../utils/formatVND";
import {
    ShoppingBagIcon,
    UserIcon,
    PhoneIcon,
    CreditCardIcon,
    TrashIcon,
    ArrowPathIcon,
    EyeIcon
} from "@heroicons/react/24/outline";
import { OrderDetailModal } from "../components/form/OrderDetailModal/OrderDetailModal";
import { Order } from "../types/order.type";
import toast from "react-hot-toast";

export default function QuanLyDonHang() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);


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
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';

            case 'processing':
                return 'bg-blue-100 text-blue-700 border-blue-200';

            case 'completed':
                return 'bg-green-100 text-green-700 border-green-200';

            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';

            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';

            case 'processing':
                return 'Đang xử lý';

            case 'completed':
                return 'Hoàn thành';

            case 'cancelled':
                return 'Đã huỷ';

            default:
                return status;
        }
    };


    // HUY DON HANG
    const cancelOrder = async (order: Order) => {
        if (order.status !== "processing") {
            toast.error("Chỉ có thể huỷ đơn đang xử lý");
            return;
        }

        if (!confirm("Bạn có chắc chắn muốn huỷ đơn hàng này không?")) return;

        const loadingToast = toast.loading("Đang huỷ đơn hàng...");

        try {
            const res = await fetch(`/api/orders/${order._id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "cancelled" }),
            });

            if (!res.ok) throw new Error();

            setOrders(prev =>
                prev.map(o => o._id === order._id ? { ...o, status: "cancelled" } : o)
            );

            toast.success("Huỷ đơn thành công!", { id: loadingToast });

        } catch {
            toast.error("Huỷ đơn thất bại!", { id: loadingToast });
        }
    };

    //PHAN TABS
    const [search, setSearch] = useState<string>("");

    const [activeTab, setActiveTab] = useState<
        "all" | "pending" | "processing" | "completed" | "cancelled"
    >("all");
    const filteredOrders = orders.filter(o => {
        const matchStatus = activeTab === "all" || o.status === activeTab;

        const keyword = search.trim().toLowerCase();

        const productName = (o.productName || "").toLowerCase();
        const customerName = (o.customerName || "").toLowerCase();
        const assignedTo = (o.assignedTo || "").toLowerCase();

        const matchSearch =
            productName.includes(keyword) ||
            customerName.includes(keyword) ||
            assignedTo.includes(keyword);

        return matchStatus && matchSearch;
    });

    useEffect(() => {
        setSearch("");
    }, [activeTab]);
    // CAP NHAT NGUOI XU LY
    const receiveOrder = async (order: Order) => {
        if (order.assignedTo || order.status !== "pending") return;

        const loadingToast = toast.loading("Đang nhận đơn...");

        try {
            const res = await fetch(`/api/orders/${order._id}/assign`, {
                method: "PATCH",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setOrders((prev: Order[]) =>
                prev.map(o =>
                    o._id === order._id
                        ? { ...o, assignedTo: data.assignedTo, status: "processing" }
                        : o
                )
            );

            toast.success("Nhận đơn thành công!", { id: loadingToast });

        } catch (err: any) {
            toast.error(err.message || "Nhận đơn thất bại", { id: loadingToast });
        }
    };




    return (
        <div className="min-h-screen  p-4 md:p-8 font-sans">

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:mb-8 mb-4">
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
                <div className="flex flex-wrap gap-2 lg:mb-6 mb-3">
                    {[
                        { key: "all", label: `Tất cả (${orders.length})` },
                        { key: "pending", label: `Chờ xử lý (${orders.filter(o => o.status === "pending").length})` },
                        { key: "processing", label: `Đang xử lý (${orders.filter(o => o.status === "processing").length})` },
                        { key: "completed", label: `Hoàn thành (${orders.filter(o => o.status === "completed").length})` },
                        { key: "cancelled", label: `Đã huỷ (${orders.filter(o => o.status === "cancelled").length})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all
                                ${activeTab === tab.key
                                    ? "bg-primary-600 text-white border-primary-600 shadow"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="mb-4 flex justify-end">
                    <div className="relative w-full max-w-sm">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo tên sản phẩm, khách, người xử lý..."
                            className="w-full border bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
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
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người xử lý</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={7} className="text-center py-20 text-slate-400">Đang tải dữ liệu...</td></tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-20 text-slate-400">Không tìm thấy đơn hàng nào</td></tr>
                                ) : (
                                    filteredOrders.map((order: any) => (
                                        <tr
                                            key={order._id}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                        >

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
                                            <td className="px-6 py-4" onClick={() => setSelectedOrder(order)}>
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
                                                {order.assignedTo ? (
                                                    <span className="text-sm font-bold text-primary-600">
                                                        {order.assignedTo}
                                                    </span>
                                                ) : order.status === "pending" ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            receiveOrder(order);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-600 text-white  transition"
                                                    >
                                                        Nhận đơn
                                                    </button>
                                                ) : (
                                                    <span className="text-xs italic text-slate-400">
                                                        Chưa phân công
                                                    </span>
                                                )}
                                            </td>

                                            <td className="lg:px-6 text-center py-4">
                                                <span className={`px-3 py-1 rounded-full w-fit text-[10px] font-bold uppercase border ${getStatusStyle(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>


                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">

                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Xem chi tiết"
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>

                                                    <button
                                                        onClick={() => cancelOrder(order)}
                                                        disabled={order.status !== "processing"}
                                                        className={`p-2 rounded-lg transition-all
        ${order.status !== "processing"
                                                                ? "text-slate-300 cursor-not-allowed"
                                                                : "text-slate-400 hover:text-red-600 hover:bg-red-50"}
      `}
                                                        title="Huỷ đơn"
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
            </div>
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdated={(id, status, assignedTo) => {
                        setOrders((prev: Order[]) =>
                            prev.map(o =>
                                o._id === id
                                    ? { ...o, status, assignedTo: assignedTo ?? o.assignedTo }
                                    : o
                            )
                        );

                        setSelectedOrder((prev: Order | null) =>
                            prev ? { ...prev, status, assignedTo: assignedTo ?? prev.assignedTo } : prev
                        );

                    }}



                />
            )}


        </div>
    );
}