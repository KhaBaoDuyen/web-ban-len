export type Order = {
    id?: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    paymentMethod: 'cod' | 'transfer';
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: Date;
};
