import mongoose, { Schema, Document, Types, models } from "mongoose";

export interface ICategory extends Document {
  userId: Types.ObjectId;
  type: "income" | "expense";
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
