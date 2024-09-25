import mongoose from "mongoose";

const purchaseRecordSchema =  mongoose.Schema({
    date: { type: Date, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    purpose: { type: String, uppercase: true,required: true },
    description: { type: String,uppercase: true },
});

const departmentSchema =  mongoose.Schema({
    dName: { type: String, required: true,uppercase: true,unique:true},
    contact: { type: String, required: true },
    purchaseRecords: [purchaseRecordSchema],
    createdAt: { type: Date, default: Date.now },
});


export const Departments = mongoose.model("Departments", departmentSchema);
