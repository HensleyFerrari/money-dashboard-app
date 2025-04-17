import mongoose, { Schema, Document, Types, models } from "mongoose";

interface Payment {
  dueDate: Date;
  status: "pending" | "paid";
  paidDate?: Date;
}

export interface IInstallment extends Document {
  userId: Types.ObjectId;
  description: string;
  totalAmount: number;
  numberOfInstallments: number;
  installmentAmount: number;
  startDate: Date;
  category: string;
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<Payment>({
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "paid"], required: true },
  paidDate: { type: Date },
});

const InstallmentSchema = new Schema<IInstallment>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  numberOfInstallments: { type: Number, required: true },
  installmentAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  category: { type: String, required: true },
  payments: { type: [PaymentSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Installment ||
  mongoose.model<IInstallment>("Installment", InstallmentSchema);
