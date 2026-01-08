"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Order = {
  _id: string;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  createdAt: string;
};

type ImportMaterial = {
  _id: string;
  materialName: string;
  price: number;
  createdAt: string;
};

type WeekOption = "week1" | "week2" | "week3" | "week4";

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function ThongKePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [imports, setImports] = useState<ImportMaterial[]>([]);
  const [week, setWeek] = useState<WeekOption>("week1");

  useEffect(() => {
    fetch("/api/statistical/orderByStatus")
      .then((res) => res.json())
      .then(setOrders);

    fetch("/api/statistical/material")
      .then((res) => res.json())
      .then(setImports);
  }, []);

  const filterByWeek = (dateStr: string) => {
    const d = new Date(dateStr).getDate();
    if (week === "week1") return d <= 7;
    if (week === "week2") return d > 7 && d <= 14;
    if (week === "week3") return d > 14 && d <= 21;
    return d > 21;
  };

  const ordersByWeek = useMemo(
    () => orders.filter((o) => filterByWeek(o.createdAt)),
    [orders, week]
  );

  const importsByWeek = useMemo(
    () => imports.filter((i) => filterByWeek(i.createdAt)),
    [imports, week]
  );

  const totalRevenue = ordersByWeek.reduce(
    (s, o) => s + (o.totalAmount || 0),
    0
  );

  const totalCost = importsByWeek.reduce((s, i) => s + (i.price || 0), 0);

  const totalOrders = ordersByWeek.length;

  const totalProducts = ordersByWeek.reduce(
    (s, o) => s + (o.quantity || 0),
    0
  );

  const profit = totalRevenue - totalCost;

  const chartData = [
    {
      name: "Tổng tuần",
      "Tiền vốn": totalCost,
      "Tiền bán": totalRevenue,
    },
  ];

  return (
    <div className="w-11/12 lg:w-10/12 mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-semibold"> Thống kê theo tuần</h1>

      <div className="flex gap-3 flex-wrap">
        {[
          { k: "week1", t: "Tuần 1" },
          { k: "week2", t: "Tuần 2" },
          { k: "week3", t: "Tuần 3" },
          { k: "week4", t: "Tuần 4" },
        ].map((w) => (
          <button
            key={w.k}
            onClick={() => setWeek(w.k as WeekOption)}
            className={`px-5 py-2 rounded-xl border transition ${
              week === w.k
                ? "bg-primary-700 text-white"
                : "bg-white hover:bg-slate-100"
            }`}
          >
            {w.t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatBox title="Tiền vốn" value={formatVND(totalCost)} />
        <StatBox title="Doanh thu" value={formatVND(totalRevenue)} />
        <StatBox title="Lợi nhuận" value={formatVND(profit)} />
        <StatBox title="Sản phẩm" value={totalProducts} />
        <StatBox title="Đơn hàng" value={totalOrders} />
      </div>

      <div className="bg-white rounded-xl p-5 shadow">
        <h2 className="font-semibold mb-4">Biểu đồ tổng tuần</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Tiền vốn" fill="#9d6646"  />
              <Bar dataKey="Tiền bán" fill="#ff943d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow">
        <h2 className="font-semibold mb-4">Danh sách đơn hàng</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-3 rounded-tl-2xl">Sản phẩm</th>
                <th className="p-3">Giá bán</th>
                <th className="p-3">Số lượng</th>
                <th className="p-3 rounded-tr-2xl">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {ordersByWeek.map((o) => (
                <tr key={o._id} className="border-b last:border-none">
                  <td className="p-3">{o.productName}</td>
                  <td className="p-3">{formatVND(o.price)}</td>
                  <td className="p-3">{o.quantity}</td>
                  <td className="p-3 font-semibold">
                    {formatVND(o.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
