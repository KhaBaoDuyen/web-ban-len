import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, createdAt, note } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Thiếu tên kiện hàng" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const newImport = {
      materialName: name,
      price: Number(price || 0),
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      note: note || "Không có ghi chú" 
    };

    await db.collection("material_imports").insertOne(newImport);

    return NextResponse.json({ message: "Nhập kho thành công" }, { status: 201 });

  } catch (error: any) {
    console.error("IMPORT ERROR:", error);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}

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
