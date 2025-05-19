import mongoose, { Schema, Document, Types, models } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  transactionType: "pix" | "debit" | "credit";
  installment: number;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
