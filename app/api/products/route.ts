import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from "mongodb";

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
      .sort({ createdAt: -1 })
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
function uploadToCloudinary(buffer: Buffer) {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const slug = formData.get("slug")?.toString();
    const price = Number(formData.get("price"));
    const description = formData.get("description")?.toString();
    const status = Number(formData.get("status"));
    const categoryId = formData.get("categoryId")?.toString();
    
     const images = formData.getAll("images") as File[];

     if (!name || !slug || !price || !description || images.length === 0 || !categoryId) {
      return NextResponse.json({ error: "Thiếu dữ liệu hoặc chưa có ảnh" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mydatabase");
    const products = db.collection("products");

     const exist = await products.findOne({
      $or: [{ name }, { slug }],
    });

    if (exist) {
      return NextResponse.json(
        { error: "Tên hoặc slug sản phẩm đã tồn tại" },
        { status: 409 }
      );
    }

     const uploadPromises = images.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await uploadToCloudinary(buffer);
      return result.secure_url;  
    });

     const imageUrls = await Promise.all(uploadPromises);

     await products.insertOne({
      name,
      slug,
      price,
      description,
      images: imageUrls, 
      status,
      categoryId: new ObjectId(categoryId),
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Thêm sản phẩm thành công" });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Có lỗi khi lưu sản phẩm / upload ảnh" },
      { status: 500 }
    );
  }
};