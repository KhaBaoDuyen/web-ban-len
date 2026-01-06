
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { Order } from "@/app/models/Order.,model";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();

         const orders = await db
            .collection("orders")
            .find({})
            .sort({ createdAt: -1 }) 
            .toArray();

        return NextResponse.json(orders, { status: 200 });
    } catch (error: any) {
        console.error("Lỗi GET orders:", error);
        return NextResponse.json(
            { message: "Không thể lấy danh sách đơn hàng" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db(); // Tên database mặc định trong connection string

        const {
            productId,
            productName,
            price,
            quantity,
            customerName,
            customerPhone,
            paymentMethod
        } = body;

        // 1. Kiểm tra dữ liệu đầu vào (Validation)
        if (!productId || !productName || !customerName || !customerPhone || !paymentMethod) {
            return NextResponse.json(
                { message: "Thiếu thông tin: Vui lòng kiểm tra lại tên SP hoặc phương thức thanh toán" },
                { status: 400 }
            );
        }

        // 2. Chuẩn bị dữ liệu sạch
        const newOrder = {
            orderId: `ORD-${Date.now()}`,
            productId,
            productName,
            quantity: Number(quantity),
            totalAmount: Number(price) * Number(quantity),
            customerName,
            customerPhone,
            paymentMethod,
            status: "pending",
            createdAt: new Date() // Driver dùng được đối tượng Date thật
        };

        // 3. LƯU VÀO DB BẰNG INSERT_ONE (Cách của Driver)
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