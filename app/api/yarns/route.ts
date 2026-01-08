import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

/* ================= GET ================= */

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const yarns = await db.collection("yarns").find().toArray();

    return NextResponse.json(yarns);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Lỗi lấy len" }, { status: 500 });
  }
}

 
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const colorName = formData.get("colorName") as string;
    const colorCode = formData.get("colorCode") as string;

    if (!name || !colorName || !colorCode) {
      return NextResponse.json({ message: "Thiếu dữ liệu" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const newYarn = {
      name,
      colorName,
      colorCode,
      stock: 0,
      createdAt: new Date()
    };

    await db.collection("yarns").insertOne(newYarn);

    return NextResponse.json({ message: "Đã thêm loại len", data: newYarn });

  } catch (e) {
    console.error("CREATE YARN ERROR:", e);
    return NextResponse.json({ message: "Lỗi server khi thêm len" }, { status: 500 });
  }
}
