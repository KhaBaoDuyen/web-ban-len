import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("orders").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Xóa đơn hàng thành công" });
    }

    return NextResponse.json(
      { message: "Không tìm thấy đơn hàng" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { message: "Xóa đơn hàng thất bại" },
      { status: 500 }
    );
  }
}
