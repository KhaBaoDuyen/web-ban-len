import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 

    const { status } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    return NextResponse.json({ success: result.modifiedCount === 1 });

  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
