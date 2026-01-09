"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/app/components/form/formProduct/ProductForm";
import { Product } from "@/app/types/product.type";

export default function EditProductForm() {
    const params = useParams();
    const slug = params.slug as string;

    const [data, setData] = useState<Product | null>(null);

    const router = useRouter();

    const handleUpdate = async (formData: FormData) => {
        try {
            const res = await fetch(`/api/products/${params.slug}`, {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    ok: false,
                    message: data.error || "Cập nhật sản phẩm thất bại",
                };
            }

            return {
                ok: true,
                message: data.message || "Cập nhật sản phẩm thành công",
            };
        } catch (err) {
            return {
                ok: false,
                message: "Không thể kết nối server",
            };
        }
    };


    useEffect(() => {
        if (!slug) return;

        fetch(`/api/products/${slug}`)
            .then((res) => res.json())
            .then((res) => setData(res));
    }, [slug]);

    const [fadeOut, setFadeOut] = useState(false);

    if (!data) return (
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
                    <p className="shop-name text-primary-600">
                        Tiệm Len Handmade
                    </p>
                    <div className="progress-bar">
                        <div className="progress-fill bg-primary-600"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ProductForm
            title="Cập nhật sản phẩm"
            submitText="Xác nhận sửa sản phẩm"
            initialData={{
                name: data.name,
                slug: data.slug,
                price: String(data.price),
                description: data.description,
                imageUrl: typeof data.image === "string"
                    ? data.image
                    : data.image instanceof File
                        ? URL.createObjectURL(data.image)
                        : null,
                status: data.status,

                categoryId: typeof data.categoryId === "string"
                    ? data.categoryId
                    : (data.categoryId as any)?.$oid
                        ? (data.categoryId as any).$oid
                        : String(data.categoryId),
            }}
            mode="edit"
            onSubmit={handleUpdate}
        />

    );
}
