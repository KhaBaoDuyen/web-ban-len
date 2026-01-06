"use client";
import ProductForm from "@/app/components/form/formProduct/ProductForm";

export default function AddProductForm() {
  return (
    <ProductForm
      title="Thêm sản phẩm mới"
      submitText="Xác nhận thêm sản phẩm"
      onSubmit={async (data) => {
        const res = await fetch("/api/products", {
          method: "POST",
          body: data,
        });
        return res.ok;
      }}
    />
  );
}