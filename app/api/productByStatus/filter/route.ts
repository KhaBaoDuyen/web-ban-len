import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import type { Product } from "@/app/types/product.type";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const url = new URL(req.url);
    const range = url.searchParams.get("range");
    const categoryId = url.searchParams.get("categoryId");

    let filter: any = { status: 1 };

    //  LỌC THEO GIÁ
    switch (range) {
      case "under50":
        filter.price = { $lt: 50000 };
        break;
      case "50to100":
        filter.price = { $gte: 50000, $lte: 100000 };
        break;
      case "over100":
        filter.price = { $gt: 100000 };
        break;
      default:
        break;
    }

    //  LỌC THEO DANH MỤC
    if (categoryId && categoryId !== "all") {
      filter.categoryId = new ObjectId(categoryId);
    }

    const products: Product[] = await db
      .collection<Product>("products")
      .find(filter)
      .sort({ createdAt: -1 })  
      .toArray();

    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi khi lấy sản phẩm" }, { status: 500 });
  }
}
