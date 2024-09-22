import mongoose from "mongoose";

const purchaseHistorySchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    items: [
        {
            name: {
                type: String,
                required: true,
            },
            newQuantity: {
                type: Number,
                required: true,
                min: 1,
            },
            cost: {
                type: Number,
                required: true,
                min: 0,
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });


const vendorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    phno: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    purchaseHistory: [purchaseHistorySchema]
}, {
    timestamps: true,
});

vendorSchema.index({ phno: 1 }, { unique: true });

export const Vendor = mongoose.model('Vendor', vendorSchema);
