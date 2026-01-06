import clientPromise from "@/app/lib/mongodb";
import type { Product } from "@/app/types/product.type";

export async function getActiveProducts(): Promise<Product[]> {
  const client = await clientPromise;
  const db = client.db();
  return db
    .collection<Product>("products")
    .find({ status: "active" })
    .sort({ createdAt: -1 })
    .toArray();
}