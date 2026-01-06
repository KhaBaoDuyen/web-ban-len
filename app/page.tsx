"use client";

import { useEffect, useState } from "react";
import ProductCard from "./components/UI/ProductCard";
import { Product } from "./types/product.type";
import Link from "next/link";

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
    <div className="">
      <section className="relative w-full h-fit bg-primary-700 py-5 lg:py-10  gap-12 overflow-hidden">
        <span className="lg:w-10/12 w-11/12 mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1  z-10">
            <h1 className="text-3xl lg:text-6xl font-bold text-accent-300 mb-6 tracking-tight">
              Dệt Ấm Áp, <br />
              <span className="text-[#A3785E]">Trao Yêu Thương</span>
            </h1>
            <p className="text-muted text-md lg:text-xl max-w-lg mb-5 leading-relaxed">
              Khám phá những món đồ handmade từ len sợi được móc tay tỉ mỉ.
              Mỗi sản phẩm là một câu chuyện tình yêu gửi gắm trong từng mũi kim.
            </p>
            <div className="flex flex-wrap gap-4 hidden lg:block">
              <Link href="#san-pham" className="px-8 py-3 bg-accent-600 text-white rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95 shadow ">
                Khám phá ngay
              </Link>
              <a
                href="https://zalo.me/0337019197"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 ml-3 bg-accent-200 text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all"
              >
                Chat Zalo ngay
              </a>

            </div>
          </div>

          <div className="lg:flex-1 relative w-full h-[300px] lg:h-[500px] grid grid-cols-12 grid-rows-12 gap-4">
 
            <div className="col-start-1 col-end-8 row-start-2 row-end-11 relative rounded-2xl overflow-hidden 
            border-8 border-white shadow-2xl transition-transform hover:rotate-2 duration-500">
              <img
                src="/assets/banner-1.jpg"
                alt="Handmade crochet"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="col-start-8 col-end-13 row-start-1 row-end-6 relative rounded-2xl overflow-hidden border-4
             border-white shadow-xl hover:-translate-y-2 duration-500">
              <img
                src="/assets/banner-2.jpg"
                alt="Cat yarn"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="col-start-8 col-end-13 row-start-7 row-end-12 relative rounded-2xl overflow-hidden border-4 border-white shadow-xl hover:translate-y-2 duration-500">
              <img
                src="/assets/banner-3.jpg"
                alt="Product detail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </span>
      </section>

      <div id="san-pham" className="flex flex-col lg:w-10/12 w-11/12 mx-auto font-sans  py-5">
        <span className="lg:flex justify-between ">
          <h1 className="font-bold text-2xl text-accent-600">Danh sách sản phẩm</h1>
          <div className="mb-5 flex items-center gap-3  mt-2">
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
    </div>

  );
}
