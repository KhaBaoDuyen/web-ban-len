import type { Category } from "./categories.type";

export type Product = {
    _id?: string;
    name: string;
    slug: string;
    price: string;
    note?: string;
    images: string[];
    imageUrl?: string | [];
    description: string;
    status: 0 | 1;
    categoryId?: string;
    category?: Category;
};
