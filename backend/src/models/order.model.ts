import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
    sweetId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                sweetId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Sweet',
                    required: true,
                },
                name: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

orderSchema.index({ userId: 1, createdAt: -1 });

orderSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete (ret as any).__v;
        return ret;
    },
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
