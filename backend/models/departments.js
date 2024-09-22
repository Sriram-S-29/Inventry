import mongoose from "mongoose";

const purchaseRecordSchema =  mongoose.Schema({
    date: { type: Date, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    purpose: { type: String, required: true },
    description: { type: String },
});

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    head: { type: String, required: true },
    contact: { type: String, required: true },
    purchaseRecords: [purchaseRecordSchema],
    createdAt: { type: Date, default: Date.now },
});


export const Department = mongoose.model('Department', departmentSchema);
