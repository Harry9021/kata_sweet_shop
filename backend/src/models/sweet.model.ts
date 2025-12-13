import mongoose, { Document, Schema } from 'mongoose';

export interface ISweet extends Document {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const sweetSchema = new Schema<ISweet>(
    {
        name: {
            type: String,
            required: [true, 'Sweet name is required'],
            trim: true,
            minlength: [2, 'Sweet name must be at least 2 characters long'],
            maxlength: [100, 'Sweet name cannot exceed 100 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            enum: {
                values: ['Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Toffee', 'Other'],
                message: '{VALUE} is not a valid category',
            },
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
            validate: {
                validator: function (value: number) {
                    return Number.isFinite(value) && value >= 0;
                },
                message: 'Price must be a valid positive number',
            },
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative'],
            validate: {
                validator: function (value: number) {
                    return Number.isInteger(value) && value >= 0;
                },
                message: 'Quantity must be a non-negative integer',
            },
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

sweetSchema.index({ name: 'text' });
sweetSchema.index({ category: 1 });
sweetSchema.index({ price: 1 });

sweetSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete (ret as any).__v;
        return ret;
    },
});

export const Sweet = mongoose.model<ISweet>('Sweet', sweetSchema);
