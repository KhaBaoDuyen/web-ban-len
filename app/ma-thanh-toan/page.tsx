"use client";
import { useState } from "react";
import { formatVND } from "../utils/formatVND";
import { 
    CheckCircleIcon, 
    ArrowLeftIcon,
    DocumentDuplicateIcon 
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ThanhToan() {
    const [copied, setCopied] = useState(false);
    
    const paymentInfo = {
        total: 150000,
        orderId: "LEN123456",
        momo: {
            phone: "0337019197",
            name: "KHA THI BAO DUYEN",
            qr: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=momo_link_here"
        },
        bank: {
            name: "MB Bank",
            number: "0337019197",
            owner: "KHA THI BAO DUYEN",
            branch: "Chi nhánh TP.HCM",
            qr: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bank_transfer_details"
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen   py-12 px-4">
            <div className="max-w-4xl mx-auto ">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Thanh toán đơn hàng</h1>
                    <p className="text-slate-500 mt-2">Vui lòng quét mã bên dưới, không chuyển dư</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                     <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-pink-500 text-white px-4 py-1 rounded-bl-xl text-xs font-bold uppercase">
                            Momo
                        </div>
                        <div className="flex flex-col items-center">
                            <img src="/momo-logo.png" alt="Momo" className="h-10 mb-6" />
                            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-pink-200 mb-6">
                                <img src={paymentInfo.momo.qr} alt="Momo QR" className="w-48 h-48" />
                            </div>
                            <div className="space-y-3 w-full">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Số điện thoại:</span>
                                    <span className="font-bold text-slate-800">{paymentInfo.momo.phone}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Chủ tài khoản:</span>
                                    <span className="font-bold text-slate-800 uppercase">{paymentInfo.momo.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banking Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl text-xs font-bold uppercase">
                            Ngân hàng
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-10 mb-6 flex items-center font-bold text-blue-800 italic text-xl uppercase">
                                {paymentInfo.bank.name}
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-blue-200 mb-6">
                                <img src={paymentInfo.bank.qr} alt="Bank QR" className="w-48 h-48" />
                            </div>
                            <div className="space-y-3 w-full">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Số tài khoản:</span>
                                    <button 
                                        onClick={() => copyToClipboard(paymentInfo.bank.number)}
                                        className="font-bold text-slate-800 flex items-center gap-1 hover:text-blue-600 transition-colors"
                                    >
                                        {paymentInfo.bank.number}
                                        <DocumentDuplicateIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Chủ TK:</span>
                                    <span className="font-bold text-slate-800 uppercase">{paymentInfo.bank.owner}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 text-center mt-2 uppercase tracking-widest">
                                    {paymentInfo.bank.branch}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-primary-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-200">
                    <h3 className="text-xl font-bold mb-2">Nội dung chuyển khoản</h3>
                    <div className=" bg-accent-100 py-3 px-6 rounded-xl inline-flex items-center gap-4 text-2xl text-primary font-mono tracking-wider border border-indigo-400">
                        {paymentInfo.orderId}
                        <button onClick={() => copyToClipboard(paymentInfo.orderId)} className="hover:scale-110 transition-transform">
                            <DocumentDuplicateIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="mt-4 text-indigo-100 text-sm">
                        Hệ thống sẽ tự động cập nhật đơn hàng sau khi nhận được tiền (1-3 phút).
                    </p>
                </div>

                {copied && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-bounce">
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        Đã sao chép vào bộ nhớ tạm
                    </div>
                )}
            </div>
        </div>
    );
}