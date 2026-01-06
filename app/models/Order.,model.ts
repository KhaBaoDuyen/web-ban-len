import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    paymentMethod: { type: String, enum: ['cod', 'transfer'], required: true },
    status: { type: String, enum: ['pending','processing','completed','cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
