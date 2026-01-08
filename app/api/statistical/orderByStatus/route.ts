
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
 
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();

        const orders = await db.collection("orders").aggregate([
              {
                $match: { 
                    status: "completed" 
                }
            },
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