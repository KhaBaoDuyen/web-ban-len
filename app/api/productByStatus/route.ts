import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const products = await db
            .collection("products")
            .find({ status: "active" })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(products);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Lỗi khi lấy sản phẩm" }, { status: 500 });
    }
}
