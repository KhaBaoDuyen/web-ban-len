
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { Order } from "@/app/models/Order.,model";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();

        const orders = await db.collection("orders").aggregate([
            {
                $lookup: {
                    from: "products",
                    let: { pid: "$productId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$pid"] } } },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                price: 1,
                                image: 1,
                                slug: 1,
                                status: 1,
                            }
                        }
                    ],
                    as: "product"
                }
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]).toArray();

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error("Lỗi GET orders:", error);
        return NextResponse.json(
            { message: "Không thể lấy danh sách đơn hàng" },
            { status: 500 }
        );
    }
}
//THEM DON HANG
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db();

        const {
            productId,
            productName,
            price,
            quantity,
            customerName,
            customerPhone,
            paymentMethod
        } = body;

        if (!productId || !productName || !customerName || !customerPhone || !paymentMethod) {
            return NextResponse.json(
                { message: "Thiếu thông tin: Vui lòng kiểm tra lại" },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("auth_session")?.value;

        let createdBy = `khach-hang: ${customerName}`;

        if (token) {
            const user = verifyToken(token);
            if (user?.username) {
                createdBy = `admin: ${user.username}`;
            }
        }

        const newOrder = {
            orderId: `ORD-${Date.now()}`,
            productId: new ObjectId(productId),
            productName,
            price: Number(price),
            quantity: Number(quantity),
            totalAmount: Number(price) * Number(quantity),
            customerName,
            customerPhone,
            paymentMethod,
            status: "pending",
            createdAt: new Date(),
            createdBy,
            assignedTo: null,
            createdRole: token ? "admin" : "customer"
        };

        const result = await db.collection("orders").insertOne(newOrder);

        if (result.acknowledged) {
            return NextResponse.json(
                {
                    message: "Đặt hàng thành công!",
                    orderId: newOrder.orderId
                },
                { status: 201 }
            );
        } else {
            throw new Error("Database không xác nhận lưu dữ liệu");
        }

    } catch (error: any) {
        console.error("Lỗi Driver:", error);
        return NextResponse.json(
            { message: "Lỗi hệ thống: " + error.message },
            { status: 500 }
        );
    }
}