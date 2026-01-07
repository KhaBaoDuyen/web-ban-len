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
        const loadingToast = toast.loading("Đang cập nhật trạng thái...");

        try {
            const res = await fetch(`/api/orders/${order._id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message);

            onStatusUpdated(order._id, data.status, data.assignedTo);

            toast.success("Cập nhật trạng thái thành công!", { id: loadingToast });

        } catch (err) {
            toast.error("Cập nhật trạng thái thất bại!", { id: loadingToast });
        } finally {
            setUpdating(false);
        }
    };

    // SET TRANG  

    const getAllowedNextStatus = (status: Order["status"]) => {
        switch (status) {
            case "pending":
                return ["pending", "processing", "cancelled"];

            case "processing":
                return ["processing", "completed", "cancelled"];

            case "completed":
                return ["completed"];

            case "cancelled":
                return ["cancelled"];

            default:
                return [status];
        }
    };
    const allowedStatus = getAllowedNextStatus(order.status);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Chi tiết đơn hàng</h2>
                        <p className="text-xs text-slate-500">Mã đơn: {order.orderId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
                        <XMarkIcon className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-5">

                    <div className="bg-slate-50 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-slate-700 mb-2">Thông tin khách hàng</h3>
                        <p className="flex items-center gap-2 text-sm"><UserIcon className="w-4 h-4" /> {order.customerName}</p>
                        <p className="flex items-center gap-2 text-sm mt-1"><PhoneIcon className="w-4 h-4" /> {order.customerPhone}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            Người tạo đơn: <b>{order.createdBy}</b>
                        </p>
                        {order.assignedTo && (
                            <p className="text-xs text-slate-500 mt-1">
                                Người xử lý: <b className="text-indigo-600">{order.assignedTo}</b>
                            </p>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 flex gap-4">
                        {order.product?.image && (
                            <img
                                src={order.product.image}
                                alt={order.product.name}
                                className="w-24 h-24 object-cover rounded-xl border"
                            />
                        )}

                        <div className="flex flex-col justify-between">
                            <div>
                                <p className="font-bold text-slate-800">{order.product?.name || order.productName}</p>
                                <p className="text-sm text-slate-500 mt-1">Số lượng: {order.quantity}</p>
                                <p className="text-sm text-slate-500">
                                    Đơn giá: {formatVND(order.product?.price || order.priceProduct)}
                                </p>
                            </div>

                            <p className="text-base font-bold text-accent-600">
                                Thành tiền: {formatVND(order.totalAmount)}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 rounded-xl p-4">
                        <div>
                            <p className="text-sm font-bold text-slate-700 mb-1">Trạng thái đơn</p>

                            <select
                                value={order.status}
                                disabled={isLocked || updating}
                                onChange={(e) => handleChangeStatus(e.target.value as Order["status"])}
                                className={`border rounded-lg px-3 py-2 text-sm font-semibold outline-none 
    ${isLocked ? "bg-slate-200 cursor-not-allowed" : "focus:ring-2 focus:ring-accent-500"}`}
                            >
                                <option value="pending" disabled={!allowedStatus.includes("pending")}>
                                    Chờ xử lý
                                </option>

                                <option value="processing" disabled={!allowedStatus.includes("processing")}>
                                    Đang xử lý
                                </option>

                                <option value="completed" disabled={!allowedStatus.includes("completed")}>
                                    Hoàn thành
                                </option>

                                <option value="cancelled" disabled={!allowedStatus.includes("cancelled")}>
                                    Huỷ đơn
                                </option>
                            </select>


                            {isLocked && (
                                <p className="text-[11px] text-slate-400 mt-1 italic">
                                    Đơn đã kết thúc, không thể thay đổi trạng thái
                                </p>
                            )}
                        </div>

                        <p className="text-xs text-slate-400">
                            Tạo lúc: {formatDate(order.createdAt)}
                        </p>
                    </div>

                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-sm font-bold"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
