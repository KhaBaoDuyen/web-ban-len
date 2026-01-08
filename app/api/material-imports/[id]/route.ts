import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/app/lib/mongodb";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
     const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID không hợp lệ" }, 
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("material_imports").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Không tìm thấy dữ liệu" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Đã xoá thành công" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}