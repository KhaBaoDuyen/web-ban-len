import type { ProductCardProps } from "./productCard.type";

export default function ProductCard({
    name ="ten len",
    price = 100000,
    image = "../assets/products/image.png",
}: ProductCardProps) {
    return (
        <div className="rounded-xl bg-surface-100 p-3 shadow hover:shadow-md transition">
            <div className="overflow-hidden rounded-lg">
                <img
                    src={image}
                    alt={name}
                    className="h-40 w-full object-cover hover:scale-105 transition"/>
            </div>

            <h3 className="mt-2 text-sm font-medium text-text-heading line-clamp-2">
                {name}
            </h3>

            <p className="mt-1 font-semibold text-accent-600">
                {price.toLocaleString("vi-VN")}đ
            </p>


        </div>
    );
}