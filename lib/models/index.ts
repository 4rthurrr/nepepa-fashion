import mongoose, { Schema, model, models } from 'mongoose';

// --- User Schema ---
const UserSchema = new Schema({
    pinHash: {
        type: String,
        required: [true, 'PIN hash is required'],
    },
    role: {
        type: String,
        default: 'admin',
    },
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);

// --- Category Schema ---
const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
    },
}, { timestamps: true });

export const Category = models.Category || model('Category', CategorySchema);

// --- Item Schema ---
const ItemSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    materialType: {
        type: String,
        enum: ['Fabric', 'Yarn', 'Color', 'Custom'],
        default: 'Custom',
    },
    quantity: {
        type: Number,
        default: 0,
        min: [0, 'Quantity cannot be negative'],
    },
    unit: {
        type: String,
        default: 'pcs',
    },
    color: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });


export const Item = models.Item || model('Item', ItemSchema);
