export type Product = {
    _id?: string;
    name: string;
    slug: string;
    price: string;
    image: File | null;
    imageUrl?: string | null;
    description: string;
    status: 0 | 1;

};