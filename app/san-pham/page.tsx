"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/UI/ProductCard";
import { Product } from "../types/product.type";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Heart, Leaf, Sun, ShieldCheck, PackageCheck, Sparkles, Scissors, } from 'lucide-react';
import { Category } from "../types/categories.type";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<"all" | "under50" | "50to100" | "over100">("all");
    const [fadeOut, setFadeOut] = useState(false);



    //SAN PHAM TAT CA
    const fetchProducts = async (range: string, category: string) => {
        setLoading(true);
        try {
            let url = `/api/productByStatus/filter?range=${range}`;

            if (category !== "all") {
                url += `&categoryId=${category}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    // SAN PHAM THEO DANH MUC
    const CAT_1 = "695e02800128120a9a48d721";
    const CAT_2 = "695e02800128120a9a48d720";
    const CAT_3 = "695e02800128120a9a48d724";

    const [cat1Products, setCat1Products] = useState<Product[]>([]);
    const [cat2Products, setCat2Products] = useState<Product[]>([]);
    const [cat3Products, setCat3Products] = useState<Product[]>([]);

    const fetchByCategory = async (catId: string, setData: any) => {
        try {
            const res = await fetch(`/api/productByStatus?categoryId=${catId}&limit=8`);
            const data = await res.json();
            setData(data);
        } catch (err) {
            console.error("Lỗi lấy danh mục:", err);
        }
    };


    useEffect(() => {
        fetchByCategory(CAT_1, setCat1Products);
        fetchByCategory(CAT_2, setCat2Products);
        fetchByCategory(CAT_3, setCat3Products);
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(range, selectedCategory);
    }, [range, selectedCategory]);

    return (
        <div className="">
            <section className="relative bg-primary-800">
                <div className="lg:w-10/12 w-11/12 mx-auto py-10 text-center">
                    <h1 className="text-3xl lg:text-5xl font-semibold text-accent-300">
                        Tất cả sản phẩm
                    </h1>
                    <p className="text-muted mt-3 text-sm lg:text-lg">
                        Khám phá thế giới đồ len handmade – nhận làm theo yêu cầu
                    </p>
                </div>
            </section>
            <div className="grid grid-cols-12 gap-5 lg:w-10/12 w-11/12 mx-auto py-10">
                <aside className="w-full shadow col-span-3 bg-white rounded-2xl  p-4 h-fit sticky top-24">

                    <h3 className="font-bold text-lg text-accent-600 mb-4">
                        Danh mục
                    </h3>

                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`w-full text-left px-3 py-2 rounded-xl font-medium transition
        ${selectedCategory === "all"
                                        ? "bg-accent-100 text-accent-700"
                                        : "hover:bg-slate-100"
                                    }`}
                            >
                                Tất cả sản phẩm
                            </button>
                        </li>

                        {categories.map((cat) => (
                            <li key={cat._id}>
                                <button
                                    onClick={() => setSelectedCategory(cat._id)}
                                    className={`w-full text-left px-3 py-2 rounded-xl font-medium transition
          ${selectedCategory === cat._id
                                            ? "bg-accent-100 text-accent-700"
                                            : "hover:bg-slate-100"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <section className=" col-span-9 ">
                    <div id="san-pham" className="flex flex-col  mx-auto font-sans  py-5">
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
                            <div className={`splash-screen ${fadeOut ? "splash-fade-out" : ""}`}>
                                <div className="splash-content">
                                    <div className="logo-wrapper">
                                        <img
                                            src="/assets/logo-light.png"
                                            alt="Logo Tiệm Len"
                                            className="logo-img"
                                        />
                                    </div>
                                    <div className="loading-container">
                                        <p className="shop-name text-accent-600">
                                            Tiệm Len Handmade
                                        </p>
                                        <div className="progress-bar">
                                            <div className="progress-fill bg-accent-600"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                
                                <h3 className="text-xl font-bold text-slate-700">
                                    Danh mục này chưa có sản phẩm
                                </h3>
                                <p className="text-slate-500 mt-2">
                                    Bạn có thể chọn danh mục khác hoặc xem tất cả sản phẩm.
                                </p>

                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className="mt-4 px-5 py-2 rounded-xl bg-accent-600 text-white font-semibold hover:bg-accent-700 transition"
                                >
                                    Xem tất cả sản phẩm
                                </button>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-4 grid-cols-2 gap-5">
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
                </section>
            </div>


        </div>

    );
}
