import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

const ALLOWED_STATUS_FLOW: Record<string, string[]> = {
  pending: ["processing", "cancelled"],
  processing: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { message: "Thiếu trạng thái" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

     const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    let assignedTo: string | undefined;

    if (token) {
      const user = verifyToken(token);
      if (user?.username) assignedTo = user.username;
    }

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return NextResponse.json(
        { message: "Không tìm thấy đơn" },
        { status: 404 }
      );
    }

    const currentStatus = order.status;

     if (["completed", "cancelled"].includes(currentStatus)) {
      return NextResponse.json(
        { message: "Đơn đã kết thúc, không thể cập nhật" },
        { status: 400 }
      );
    }

     const allowedNext = ALLOWED_STATUS_FLOW[currentStatus] || [];

    if (!allowedNext.includes(status)) {
      return NextResponse.json(
        { message: `Không thể chuyển từ ${currentStatus} sang ${status}` },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

     if (!order.assignedTo && assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({
      status,
      assignedTo: updateData.assignedTo || order.assignedTo || null,
    });

  } catch (err) {
    console.error("PATCH status error:", err);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}
