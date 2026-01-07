import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const category = await db
            .collection("categories")
            .find({ status: 1 })
            .toArray();

        return NextResponse.json(category);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Lỗi khi lấy sản phẩm" }, { status: 500 });
    }
}
