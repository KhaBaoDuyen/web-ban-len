import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("mydatabase");

    const { searchParams } = new URL(req.url);

    const sort = searchParams.get("sort");  
    const limit = Number(searchParams.get("limit"));
    const categoryId = searchParams.get("categoryId");
    const min = searchParams.get("min");
    const max = searchParams.get("max");

    const filter: any = { status: 1 };

    if (categoryId) {
      filter.categoryId = new ObjectId(categoryId);
    }

    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    let query = db.collection("products").find(filter);

    if (sort === "new") {
      query = query.sort({ createdAt: -1 });
    }

    if (limit) {
      query = query.limit(limit);
    }

    const products = await query.toArray();

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
