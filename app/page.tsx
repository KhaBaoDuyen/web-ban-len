"use client";

import { useEffect, useState } from "react";
import ProductCard from "./components/UI/ProductCard";
import { Product } from "./types/product.type";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Heart, Leaf, Sun, ShieldCheck, PackageCheck, Sparkles, Scissors, } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsNew, setProductsNew] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"all" | "under50" | "50to100" | "over100">("all");

  //SAN PHAM MOI NHAT 
  const ProductsNew = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/productByStatus?sort=new&limit=8");
      const data = await res.json();
      setProductsNew(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //SAN PHAM TAT CA
  const fetchProducts = async (range: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/productByStatus/filter?range=${range}`);
      const data = await res.json();
      setProducts(data);
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
    ProductsNew();
    fetchByCategory(CAT_1, setCat1Products);
    fetchByCategory(CAT_2, setCat2Products);
    fetchByCategory(CAT_3, setCat3Products);
  }, []);


  useEffect(() => {
    fetchProducts(range);
  }, [range]);

  const HorizontalSection = ({ title, products }: { title: string; products: Product[] }) => {
    if (!products.length) return null;

    return (
      <section className="flex flex-col lg:w-10/12 w-11/12 mx-auto py-6">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-bold text-2xl text-accent-600">{title}</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
          {products.map((p) => (
            <div key={p._id} className="min-w-[260px] snap-start">
              <ProductCard {...p} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="">
      <section className="relative w-full h-fit bg-primary-800 py-5 lg:py-10  gap-12 overflow-hidden">
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

      <section className="flex flex-col lg:w-10/12 w-11/12 mx-auto font-sans  py-5">
        <span className="text-center">
          <h1 className="font-bold text-3xl text-accent-600">Sản phẩm mới</h1>
          <p className="text-muted">Những sản phẩm mới cập nhật tại đây.</p>
          <div className="grid grid-cols-5 overflow-x-auto py-2 snap-x snap-mandatory gap-4 scrollbar-hide">
            {productsNew.map((product, index) => (
              <ProductCard key={index + 1} {...product} />
            ))}
          </div>
        </span>
      </section>

      <section className="">
        <div className=" rounded-2xl bg-surface-50 py-16 px-4">
          <div className="bg-primary-800 text-white py-6 mb-16 rounded-lg">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Leaf size={32} strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest">Tự nhiên 100%</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Heart size={32} strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest">An toàn cho da</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Sun size={32} strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest">Bền màu tuyệt đối</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={32} strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest">Chống xù lông</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-neutral-800 italic">
              Sợi len tạo nên sự ấm áp cho gia đình
            </h2>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-12">
             <div className="space-y-16 text-right">
              <div>
                <div className="flex justify-end mb-4">
                  <div className="p-3 bg-accent-50 text-accent-600 rounded-xl border border-accent-100 shadow-sm">
                    <PackageCheck size={28} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-neutral-800 mb-2">Chất lượng cao cấp</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Len được tuyển chọn từ những sợi bông tốt nhất, đảm bảo độ mềm mại và giữ ấm vượt trội.
                </p>
              </div>

              <div>
                <div className="flex justify-end mb-4">
                  <div className="p-3 bg-accent-50 text-accent-600 rounded-xl border border-accent-100 shadow-sm">
                    <Sparkles size={28} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-neutral-800 mb-2">Độ bóng tự nhiên</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Bề mặt len mượt mà, mang lại vẻ ngoài sang trọng cho các sản phẩm đan móc thủ công.
                </p>
              </div>
            </div>

             <div className="relative group">
              <div className="absolute -inset-4 bg-accent-100/50 rounded-[40px] blur-2xl group-hover:bg-accent-200/50 transition duration-500"></div>
              <div className="relative aspect-square bg-white rounded-3xl flex items-center justify-center overflow-hidden border-[12px] border-white shadow-2xl">
                <img
                  src="/assets/product-wool.jpg"  
                  alt="Sản phẩm len"
                  className="object-cover w-full h-full transform group-hover:scale-110 transition duration-700"
                />
              </div>
            </div>

             <div className="space-y-16 text-left">
              <div>
                <div className="flex justify-start mb-4">
                  <div className="p-3 bg-accent-50 text-accent-600 rounded-xl border border-accent-100 shadow-sm">
                    <Scissors size={28} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-neutral-800 mb-2">Dễ dàng đan móc</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Sợi len chắc chắn, không bị tách sợi giúp người mới bắt đầu cũng có thể tạo ra sản phẩm đẹp.
                </p>
              </div>

              <div>
                <div className="flex justify-start mb-4">
                  <div className="p-3 bg-accent-50 text-accent-600 rounded-xl border border-accent-100 shadow-sm">
                    <Leaf size={28} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-neutral-800 mb-2">Thân thiện môi trường</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Quy trình nhuộm màu tự nhiên, không hóa chất độc hại, an toàn cho cả trẻ sơ sinh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white ">
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
      </section>

    </div>

  );
}
