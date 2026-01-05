import { NextRequest, NextResponse } from "next/server";

let PRODUCTS = [
  { id: 1, name: "Len Mềm Mịn", slug: "len-mem-min", price: 100000, image: "image.png", description: "Len mềm mại" },
  { id: 2, name: "Len Sợi Dài", slug: "len-soi-dai", price: 120000, image: "image.png", description: "Sợi dài" },
];

export async function GET() {
  return NextResponse.json(PRODUCTS);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Thêm id tự tăng
    const newProduct = { id: PRODUCTS.length + 1, ...data };
    PRODUCTS.push(newProduct);
    return NextResponse.json({ message: "Thêm sản phẩm thành công", product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi thêm sản phẩm" }, { status: 500 });
  }
}