export type Order = {
  _id: string;
  orderId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  status: "processing" | "completed" | "cancelled";
  createdAt: string;
  createdBy?: string;
  product?: {
    name: string;
    price: number;
    image: string;
    slug: string;
    status: number;
  };
};
