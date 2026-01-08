export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export interface Order {
  _id: string;
  orderId: string;
  productName: string;
  quantity: number;
  priceProduct: number;
  note: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  createdBy?: string;
  assignedTo?: string | null;
  product?: {
    name: string;
    price: number;
    image: string;
  };
}
