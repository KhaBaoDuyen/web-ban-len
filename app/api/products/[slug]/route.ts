import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from "mongodb";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// LAY SAN PHAM CHI TIET SAN PHAM
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await context.params;

        console.log("Slug nhận được:", slug);

        const client = await clientPromise;
        const db = client.db("mydatabase");

        const product = await db
            .collection("products")
            .findOne({ slug });

        if (!product) {
            return NextResponse.json(
                { message: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { message: "Lỗi lấy chi tiết sản phẩm" },
            { status: 500 }
        );
    }
}

//CAP NHAT SAN PHAM

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const client = await clientPromise;
        const db = client.db("mydatabase");
        const products = db.collection("products");

        const formData = await req.formData();

        const name = formData.get("name") as string;
        const newSlug = formData.get("slug") as string;
        const price = formData.get("price") as string;
        const description = formData.get("description") as string;
        const status = Number(formData.get("status"));
        const categoryId = formData.get("categoryId") as string;
        const imageFile = formData.get("image") as File | null;

        if (!name || !newSlug || !price || !description || !categoryId) {
            return NextResponse.json(
                { error: "Thiếu dữ liệu bắt buộc" },
                { status: 400 }
            );
        }

        const existingProduct = await products.findOne({ slug });
        if (!existingProduct) {
            return NextResponse.json(
                { error: "Sản phẩm không tồn tại" },
                { status: 404 }
            );
        }

        const duplicate = await products.findOne({
            _id: { $ne: existingProduct._id },
            $or: [{ name }, { slug: newSlug }],
        });

        if (duplicate) {
            return NextResponse.json(
                { error: "Tên hoặc slug sản phẩm đã tồn tại" },
                { status: 409 }
            );
        }

        // XỬ LÝ ẢNH
        let imageUrl = existingProduct.image;

        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());

            const uploadResponse: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            imageUrl = uploadResponse.secure_url;
        }

        //   DATA UPDATE
        const updatedData = {
            name,
            slug: newSlug,
            price: Number(price),
            description,
            image: imageUrl,
            status,
            categoryId: new ObjectId(categoryId),
            updatedAt: new Date(),
        };

        await products.updateOne(
            { _id: existingProduct._id },
            { $set: updatedData }
        );

        return NextResponse.json(
            { message: "Cập nhật thành công" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("UPDATE ERROR:", error);
        return NextResponse.json(
            { error: "Có lỗi khi cập nhật sản phẩm" },
            { status: 500 }
        );
    }
}


// XOA SAN PHAM
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const client = await clientPromise;
        const db = client.db("mydatabase");

        const existingProduct = await db.collection("products").findOne({ slug });

        if (!existingProduct) {
            return NextResponse.json(
                { message: "Sản phẩm không tồn tại" },
                { status: 404 }
            );
        }

        if (existingProduct.image) {
            try {
                const urlParts = existingProduct.image.split("/");
                const fileName = urlParts[urlParts.length - 1].split(".")[0];
                const publicId = `products/${fileName}`;

                await cloudinary.uploader.destroy(publicId);
            } catch (cloudErr) {
                console.error("Lỗi xóa ảnh Cloudinary:", cloudErr);
            }
        }

        const result = await db.collection("products").deleteOne({ slug });

        if (result.deletedCount === 1) {
            return NextResponse.json(
                { message: "Xóa sản phẩm thành công" },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "Không thể xóa sản phẩm" },
                { status: 400 }
            );
        }

    } catch (error: any) {
        return NextResponse.json(
            { message: "Lỗi server: " + error.message },
            { status: 500 }
        );
    }
}