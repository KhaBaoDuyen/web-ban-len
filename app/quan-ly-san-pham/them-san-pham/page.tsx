"use client";
import ProductForm from "@/app/components/form/formProduct/ProductForm";

const handleCreateProduct = async (formData: FormData) => {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        message: data.error || "Thêm sản phẩm thất bại",
      };
    }

    return {
      ok: true,
      message: data.message || "Thêm sản phẩm thành công",
    };
  } catch (err) {
    return {
      ok: false,
      message: "Không thể kết nối server",
    };
  }
};

export default function AddProductForm() {
  return (
    <ProductForm
      title="Thêm sản phẩm mới"
      submitText="Xác nhận thêm sản phẩm"
       onSubmit={handleCreateProduct}
        mode="add"
    />

  );
}