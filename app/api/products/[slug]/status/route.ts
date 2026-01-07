import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export async function PATCH(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params; 
    const { status }: { status: 0 | 1 } = await req.json();

    await client.connect();
    const db = client.db( );
    const products = db.collection("products");

    const result = await products.updateOne(
      { slug: slug },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Lỗi update status:", error);
    return Response.json({ message: "Lỗi server" }, { status: 500 });
  }
}
