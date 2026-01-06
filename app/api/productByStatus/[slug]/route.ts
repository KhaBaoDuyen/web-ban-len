import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
 
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const client = await clientPromise;
        const db = client.db("mydatabase");

        const formData = await req.formData();
        const status = formData.get("status") as string;

        const existingProduct = await db.collection("products").findOne({ slug });
        if (!existingProduct) {
            return NextResponse.json({ message: "Sản phẩm không tồn tại" }, { status: 404 });
        }

         const updatedData = {
            status,
            updatedAt: new Date(),
        };

        await db.collection("products").updateOne(
            { slug: slug },
            { $set: updatedData }
        );

        return NextResponse.json({ message: "Cập nhật trạng thái thành công" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

