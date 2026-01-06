export type Product = {
    _id?: string;
    name: string;
    slug: string;
    price: string;
    image: File | null;
    description: string;
    status: "active" | "inactive";
};