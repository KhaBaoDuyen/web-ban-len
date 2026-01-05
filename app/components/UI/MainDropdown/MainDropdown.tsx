import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { chunkArray } from "../../../utils/array";
import { MainDropdownProps } from "./MainDropdown.type";

export const MainDropdown = ({
    title,
    path,
    categories = [],
    brands = [],
    popularSearches = [],
}: MainDropdownProps) => {
    const categoryColumns = chunkArray(categories, 5);
    
     const hasDropdown = categories.length > 0 || brands.length > 0 || popularSearches.length > 0;

    return (
        <div className="relative group mx-4">
             <Link href={path} className="font-semibold flex items-center gap-1 py-4 hover:text-accent-600 transition-colors">
                {title}
                {hasDropdown && (
                    <ChevronDown
                        size={14}
                        className="group-hover:rotate-180 transition-transform"
                    />
                )}
            </Link>

             {hasDropdown && (
                <div
                    className="absolute left-0 top-full hidden group-hover:grid 
                    grid-cols-3 gap-8 min-w-max p-8
                    bg-white/60 backdrop-blur-lg text-black
                    rounded-xl shadow-2xl z-50 border border-white/20"
                >
                     <div className="border-r border-gray-300/50 pr-6">
                        <h3 className="mb-4 text-accent-600 font-bold uppercase text-sm tracking-wider">
                            Danh mục
                        </h3>
                        <div className="flex gap-8">
                            {categoryColumns.map((col, idx) => (
                                <div key={idx} className="flex flex-col gap-2">
                                    {col.map((item, i) => (
                                        <Link 
                                            key={i} 
                                            href={item.path} 
                                            className="hover:text-orange-500 capitalize transition-colors whitespace-nowrap text-md"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>

                         <div className="mt-5 flex flex-col gap-3 border-t border-accent-600/20 pt-4">
                            <Link href="/update" className="border-2 border-accent-600 text-on-primary px-4 py-1.5 rounded-xl text-sm text-center bg-accent-700 transition-colors">
                                Cập nhật phần mềm
                            </Link>
                            <Link href="/account" className="border-2 border-accent-600 text-on-primary px-4 py-1.5 rounded-xl text-sm text-center bg-accent-700 transition-colors">
                                Tài khoản
                            </Link>
                            <Link href="/news" className="border-2 border-accent-600 text-on-primary px-4 py-1.5 rounded-xl text-sm text-center bg-accent-700 transition-colors">
                                Tin tức của Ditigon
                            </Link>
                        </div>
                    </div>

                     <div className="border-r border-gray-300/50 pr-6">
                        <h3 className="mb-4 text-accent-600 font-bold uppercase text-sm tracking-wider">
                            Thương hiệu
                        </h3>
                        {brands.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {brands.map((brand, i) => (
                                    <Link key={i} href={brand.path} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                        <div className="w-5 h-5 bg-gray-200 rounded-sm flex-shrink-0">
                                            {brand.image ? (
                                                <img src={`/assets/images/brands/${brand.image}`} alt={brand.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    N/A
                                                </div>
                                            )}
                                            </div>
                                        <span className="text-sm">{brand.name}</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-xs italic">Đang cập nhật...</p>
                        )}
                    </div>

                     <div>
                        <h3 className="mb-4 text-accent-600 font-bold uppercase text-sm tracking-wider">
                            Tìm kiếm nhiều
                        </h3>
                        <div className="flex flex-col gap-4">
                            {popularSearches.length > 0 ? (
                                popularSearches.map((item, i) => (
                                    <Link key={i} href={item.path} className="font-medium hover:underline text-sm hover:text-accent-600 transition-colors">
                                        {item.name}
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-400 text-xs italic">Chưa có tìm kiếm nào...</p>
                            )}
                            <Link href="/tat-ca" className="text-accent-600 text-sm mt-2 flex items-center gap-1 hover:underline">
                                Xem thêm &gt;
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};