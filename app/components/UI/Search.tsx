"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  _id?: string;
  name: string;
  slug: string;
  image?: string;
}

interface SearchProps {
  width?: string;
  showOnMobile?: boolean;
}

export const Search = ({
  width = "lg:w-5/12",
  showOnMobile = false,
}: SearchProps) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showBox, setShowBox] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    fetch("/api/productByStatus")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

   useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    const k = keyword.toLowerCase();

    const result = products
      .filter((p) => p.name.toLowerCase().includes(k))
      .slice(0, 5);

    setSuggestions(result);
  }, [keyword, products]);

   useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setKeyword("");
    setSuggestions([]);
    setShowBox(false);
    router.push(`/san-pham/${slug}`);
  };

  return (
    <div ref={boxRef} className={`relative ${showOnMobile ? "flex" : "hidden"} lg:flex ${width}`}>
      <div className="flex w-full items-center bg-white/20 rounded-md px-3 pr-0">
        <input
          type="text"
          value={keyword}
          onFocus={() => setShowBox(true)}
          onChange={(e) => {
            setKeyword(e.target.value);
            setShowBox(true);
          }}
          className="p-2 w-full bg-transparent placeholder:text-gray-300 outline-none border-none text-white"
          placeholder="Tìm sản phẩm..."
        />

        <button
          onClick={() => keyword && router.push(`/san-pham?search=${keyword}`)}
          className="bg-primary-700 min-w-max px-4 py-2 rounded text-white ml-2 hover:bg-primary-700"
        >
          Tìm kiếm
        </button>
      </div>

       {showBox && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
          {suggestions.map((item) => (
            <div
              key={item.slug}
              onClick={() => handleSelect(item.slug)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-100 transition"
            >
              {item.images && (
                <img
                  src={item.images}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg border"
                />
              )}
              <span className="text-sm text-slate-700 font-medium line-clamp-1">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
