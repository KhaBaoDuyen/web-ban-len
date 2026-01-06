"use client";

import { useEffect, useState } from "react";
import ProductCard from "./components/UI/ProductCard";
import { Product } from "./types/product.type";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"all" | "under50" | "50to100" | "over100">("all");

  const fetchProducts = async (range: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/filter?range=${range}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(range);
  }, [range]);

  return (
    <div className="flex flex-col lg:w-10/12 w-11/12 mx-auto font-sans  py-5">

      <span className=";g:flex justify-between ">
        <h1 className="font-bold text-2xl text-accent-600">Danh sách sản phẩm</h1>
        <div className="mb-5 flex items-center gap-3 text-muted mt-2">
          <label htmlFor="priceFilter" className="font-bold">Lọc theo giá:</label>
          <select
            id="priceFilter"
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="px-3 py-2 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="under50">Dưới 50,000 VND</option>
            <option value="50to100">50,000 - 100,000 VND</option>
            <option value="over100">Trên 100,000 VND</option>
          </select>
        </div>
      </span>


      {loading ? (
        <p className="text-center mt-20">Đang tải sản phẩm...</p>
      ) : (
        <div className="grid lg:grid-cols-5 grid-cols-2 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
              slug={product.slug}
              status={product.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
