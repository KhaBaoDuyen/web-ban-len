import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//LAY DANH SACH SAN PHAM
export async function GET() {
  try {
    const client = await clientPromise;
 
    const db = client.db();
    const products = await db
      .collection("products")
      .find({})
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Lỗi lấy danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

//THEM SAN PHAM
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const slug = formData.get("slug")?.toString();
    const price = Number(formData.get("price"));
    const description = formData.get("description")?.toString();
    const status = formData.get("status")?.toString();
    const image = formData.get("image") as File;

    if (!name || !slug || !price || !description || !image ||!status)
      return NextResponse.json({ error: "Thiếu dữ liệu bắt buộc" }, { status: 400 });

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "products", resource_type: "image" },
      async (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    const stream = cloudinary.uploader.upload_stream(
      { folder: "products", resource_type: "image" },
      async (error, result) => {
        if (error) throw error;

        const client = await clientPromise;
        const db = client.db("mydatabase");
        const products = db.collection("products");

        const productData = {
          name,
          slug,
          price,
          description,
          image: result?.secure_url || "",
          status,
          createdAt: new Date(),
        };

        await products.insertOne(productData);
      }
    );

    stream.end(buffer);

    return NextResponse.json({ message: "Thêm sản phẩm thành công" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Có lỗi khi lưu sản phẩm" }, { status: 500 });
  }
};
