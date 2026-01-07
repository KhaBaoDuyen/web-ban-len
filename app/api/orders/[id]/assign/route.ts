import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const client = await clientPromise;
    const db = client.db();

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user?.username) {
      return NextResponse.json({ message: "Token không hợp lệ" }, { status: 401 });
    }

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return NextResponse.json({ message: "Không tìm thấy đơn" }, { status: 404 });
    }

    if (order.assignedTo) {
      return NextResponse.json({ message: "Đơn đã có người xử lý" }, { status: 400 });
    }

    if (order.status !== "pending") {
      return NextResponse.json({ message: "Đơn không ở trạng thái chờ xử lý" }, { status: 400 });
    }

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          assignedTo: user.username,
          status: "processing",
        },
      }
    );

    return NextResponse.json({
      assignedTo: user.username,
      status: "processing",
    });

  } catch (err) {
    console.error("Assign order error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
