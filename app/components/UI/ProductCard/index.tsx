import type { Product } from "@/app/types/product.type";
import { formatVND } from "@/app/utils/formatVND";
import { FiEdit3, FiEye, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

export default function ProductCard({
    name,
    price,
    images,
    status,
    slug,
    description
}: Product) {
    const imageUrl = Array.isArray(images) && images.length > 0
        ? images[0]
        : "/placeholder-product.png";

    return (
        <Link href={`/san-pham/${slug}`}>
            <div className="group  cardproduct relative rounded-xl !bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="relative rounded-xl lg:h-[14rem] h-[10rem] overflow-hidden bg-slate-100">
                    <img
                        src={imageUrl || "/placeholder-product.png"}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div className="p-2">
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-organge-600 transition-colors line-clamp-2">
                        {name}
                    </h3>

                    <span className="text-lg font-bold text-primary-600">
                        {formatVND(Number(price))}
                    </span>

                </div>
            </div>
        </Link>

    );
}