import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import type { Product } from "@/app/types/product.type";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const url = new URL(req.url);
    const range = url.searchParams.get("range");  

    let filter: any = { status: "active" };

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

    const products: Product[] = await db
      .collection<Product>("products")
      .find(filter)
      .sort({ price: 1 })
      .toArray();

    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi khi lấy sản phẩm" }, { status: 500 });
  }
}
