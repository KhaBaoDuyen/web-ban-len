import { XMarkIcon, UserIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { formatVND } from "@/app/utils/formatVND";
import { formatDate } from "@/app/utils/formatDate";
import toast from "react-hot-toast";
import { useState } from "react";
import { Order } from "@/app/types/order.type";

type OrderDetailModalProps = {
    order: Order;
    onClose: () => void;
    onStatusUpdated: (
        id: string,
        status: Order["status"],
        assignedTo?: string
    ) => void;
};

export function OrderDetailModal({
    order,
    onClose,
    onStatusUpdated,
}: OrderDetailModalProps) {
    const [updating, setUpdating] = useState(false);

    if (!order) return null;

    const isLocked = order.status === "completed" || order.status === "cancelled";

    const handleChangeStatus = async (newStatus: Order["status"]) => {
        if (newStatus === order.status || isLocked) return;
        setUpdating(true);
        const loadingToast = toast.loading("Đang cập nhật...");
        try {
            const res = await fetch(`/api/orders/${order._id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message);
            onStatusUpdated(order._id, data.status, data.assignedTo);
            toast.success("Thành công!", { id: loadingToast });
        } catch (err) {
            toast.error("Thất bại!", { id: loadingToast });
        } finally {
            setUpdating(false);
        }
    };

    const getAllowedNextStatus = (status: Order["status"]) => {
        switch (status) {
            case "pending": return ["pending", "processing", "cancelled"];
            case "processing": return ["processing", "completed", "cancelled"];
            default: return [status];
        }
    };
    const allowedStatus = getAllowedNextStatus(order.status);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
             <div className="bg-white w-full max-w-2xl h-[90vh] sm:h-auto rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                
                 <div className="flex items-center justify-between px-5 py-4 border-b bg-white">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-800">Chi tiết đơn hàng</h2>
                        <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">ID: {order.orderId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
                        <XMarkIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                 <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Khách hàng</h3>
                        <div className="space-y-2">
                            <p className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                <UserIcon className="w-4 h-4 text-slate-400" /> {order.customerName}
                            </p>
                            <p className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                <PhoneIcon className="w-4 h-4 text-slate-400" /> {order.customerPhone}
                            </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase">Tạo bởi</p>
                                <p className="text-xs font-semibold">{order.createdBy}</p>
                            </div>
                            {order.assignedTo && (
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Người xử lý</p>
                                    <p className="text-xs font-semibold text-indigo-600">{order.assignedTo}</p>
                                </div>
                            )}
                        </div>
                    </div>

                     <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col sm:flex-row gap-4">
                        {order.product?.image && (
                            <img
                                src={order.product.image}
                                alt={order.product.name}
                                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
                            />
                        )}

                        <div className="flex flex-col justify-between flex-1 space-y-2">
                            <div>
                                <p className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                                    {order.product?.name || order.productName}
                                </p>
                                <div className="flex justify-between sm:block mt-1">
                                    <p className="text-xs text-slate-500">Số lượng: <span className="text-slate-800 font-medium">{order.quantity}</span></p>
                                    <p className="text-xs text-slate-500">Đơn giá: {formatVND(order.product?.price || order.priceProduct)}</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t sm:border-none flex justify-between items-center">
                                <span className="text-xs text-slate-400 sm:hidden">Tổng cộng:</span>
                                <p className="text-lg font-bold text-orange-600">{formatVND(order.totalAmount)}</p>
                            </div>
                        </div>
                    </div>

                     <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                        <p className="text-[10px] text-amber-600 font-bold uppercase mb-1">Ghi chú</p>
                        <p className="text-sm text-slate-700 italic">"{order.note || "Không có ghi chú"}"</p>
                    </div>

                     <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-full">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Trạng thái đơn hàng</p>
                            <select
                                value={order.status}
                                disabled={isLocked || updating}
                                onChange={(e) => handleChangeStatus(e.target.value as Order["status"])}
                                className={`w-full border rounded-lg px-3 py-3 text-sm font-bold outline-none shadow-sm
                                    ${isLocked ? "bg-slate-200 text-slate-500" : "bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 border-slate-200"}`}
                            >
                                <option value="pending" disabled={!allowedStatus.includes("pending")}>Chưa móc</option>
                                <option value="processing" disabled={!allowedStatus.includes("processing")}>Đang móc</option>
                                <option value="completed" disabled={!allowedStatus.includes("completed")}>Hoàn thành</option>
                                <option value="cancelled" disabled={!allowedStatus.includes("cancelled")}>Huỷ đơn</option>
                            </select>
                            {isLocked && (
                                <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1">
                                    ● Đơn đã chốt, không thể chỉnh sửa.
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                             <span className="text-[10px] text-slate-400 uppercase">Ngày tạo</span>
                             <span className="text-xs font-medium text-slate-600">{formatDate(order.createdAt)}</span>
                        </div>
                    </div>
                </div>

                 <div className="p-4 border-t bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-primary-800 text-white text-sm font-bold active:scale-95 transition-transform"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}