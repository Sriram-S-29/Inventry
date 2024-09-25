import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  type: { type: String, required: true },
  date: { type: Date, required: true },
  newQuantity: { type: Number, required: true },
  supplier: { type: String,uppercase: true },
  customer: { type: String,uppercase: true },
  cost: { type: String },
  gst: { type: String },
  total: { type: String },
  purpose:{type:String,uppercase: true},
  transactionId: { type: String, required: true },
});

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    set: (value) => value.toUpperCase(),
    unique: true,
  },
  category: { type: String ,uppercase: true},
  price: { type: Number },
  quantityInStock: { type: Number, default: 0 },
  description: { type: String,uppercase: true },
  category: { type: String,uppercase: true },
  units: { type: String,uppercase: true },
  minimum: { type: String, default: 0 },
  cost: { type: String, default: 0 },
  transactions: [transactionSchema],
});

export const Product = mongoose.model("Product", productSchema);
