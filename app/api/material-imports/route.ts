import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const materials = await db.collection("material_imports")
      .aggregate([
        {
          $lookup: {
            from: "yarns",
            localField: "yarnId",
            foreignField: "_id",
            as: "yarn"
          }
        },
        {
          $unwind: {
            path: "$yarn",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray();

    return NextResponse.json(materials);

  } catch (e) {
    console.error("GET MATERIAL IMPORTS ERROR:", e);
    return NextResponse.json(
      { message: "Lỗi lấy dữ liệu nhập kho" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { yarnId, quantity, price, supplier } = body;

    if (!yarnId || !quantity) {
      return NextResponse.json({ message: "Thiếu dữ liệu" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection("material_imports").insertOne({
      yarnId: new ObjectId(yarnId),
      quantity,
      price,
      supplier,
      createdAt: new Date()
    });

    await db.collection("yarns").updateOne(
      { _id: new ObjectId(yarnId) },
      { $inc: { stock: quantity } }
    );

    return NextResponse.json({ message: "Nhập kho thành công" });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
