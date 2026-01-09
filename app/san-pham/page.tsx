"use client";
import { useEffect, useState, useMemo } from "react"; // Thêm useMemo
import ProductCard from "../components/UI/ProductCard";
import { Product } from "../types/product.type";
import { Category } from "../types/categories.type";
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Thêm icon để đẹp hơn

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<"all" | "under50" | "50to100" | "over100">("all");
    const [fadeOut, setFadeOut] = useState(false);

    // --- PHẦN THÊM MỚI: STATE PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

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
        try {
            const res = await fetch(`/api/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    // --- LOGIC PHÂN TRANG ---
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    }, [products, currentPage]);

    // Reset trang về 1 khi lọc thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [range, selectedCategory]);

    useEffect(() => {
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

            <div className="lg:grid grid-cols-12 gap-5 lg:w-10/12 w-11/12 mx-auto py-10">
                {/* Mobile Categories - GIỮ NGUYÊN */}
                <div className="lg:hidden mb-4 overflow-x-auto py-2">
                    <div className="flex gap-2 w-max px-1">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition
                            ${selectedCategory === "all" ? "bg-accent-600 text-white" : "bg-slate-100 text-slate-700"}`}
                        >
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition
                                ${selectedCategory === cat._id ? "bg-accent-600 text-white" : "bg-slate-100 text-slate-700"}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Desktop - GIỮ NGUYÊN */}
                <aside className="hidden lg:block w-full shadow col-span-3 bg-white rounded-2xl p-4 h-fit sticky top-44">
                    <h3 className="font-bold text-lg text-accent-600 mb-4">Danh mục</h3>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`w-full text-left px-3 py-2 rounded-xl font-medium transition
                                ${selectedCategory === "all" ? "bg-accent-100 text-accent-700" : "hover:bg-slate-100"}`}
                            >
                                Tất cả sản phẩm
                            </button>
                        </li>
                        {categories.map((cat) => (
                            <li key={cat._id}>
                                <button
                                    onClick={() => setSelectedCategory(cat._id)}
                                    className={`w-full text-left px-3 py-2 rounded-xl font-medium transition
                                    ${selectedCategory === cat._id ? "bg-accent-100 text-accent-700" : "hover:bg-slate-100"}`}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <section className="col-span-9">
                    <div id="san-pham" className="flex flex-col mx-auto font-sans py-5">
                        <span className="lg:flex justify-between items-center">
                            <h1 className="font-bold text-2xl text-accent-600">Danh sách sản phẩm</h1>
                            <div className="mb-5 flex items-center gap-3 mt-2">
                                <label htmlFor="priceFilter" className="font-bold">Lọc theo giá:</label>
                                <select
                                    id="priceFilter"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value as any)}
                                    className="px-3 py-2 rounded-xl border-2 border-gray-300 focus:border-indigo-500 outline-none"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="under50">Dưới 50,000 VND</option>
                                    <option value="50to100">50,000 - 100,000 VND</option>
                                    <option value="over100">Trên 100,000 VND</option>
                                </select>
                            </div>
                        </span>

                        {loading ? (
                            // Loading UI - GIỮ NGUYÊN
                            <div className={`splash-screen ${fadeOut ? "splash-fade-out" : ""}`}>
                                {/* ... nội dung splash screen ... */}
                            </div>
                        ) : currentProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <h3 className="text-xl font-bold text-slate-700">Danh mục này chưa có sản phẩm</h3>
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className="mt-4 px-5 py-2 rounded-xl bg-accent-600 text-white font-semibold"
                                >
                                    Xem tất cả sản phẩm
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid lg:grid-cols-4 grid-cols-2 gap-5">
                                    {currentProducts.map((product) => (
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

                                {/* --- THANH PHÂN TRANG (MỚI) --- */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12 pb-5">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            className="p-2 rounded-xl border border-gray-200 hover:bg-slate-50 disabled:opacity-30 transition"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-xl font-semibold transition ${
                                                    currentPage === i + 1
                                                        ? "bg-accent-600 text-white shadow-lg shadow-accent-200"
                                                        : "bg-white border border-gray-200 text-slate-600 hover:border-accent-600"
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            className="p-2 rounded-xl border border-gray-200 hover:bg-slate-50 disabled:opacity-30 transition"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}