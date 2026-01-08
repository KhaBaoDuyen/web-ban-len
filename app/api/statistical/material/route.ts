import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const data = await db.collection("material_imports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const normalized = data.map((i: any) => ({
      ...i,
      materialName: i.materialName || "Kiện hàng"
    }));

    return NextResponse.json(normalized);


  } catch (error) {
    console.error("GET IMPORT ERROR:", error);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}
