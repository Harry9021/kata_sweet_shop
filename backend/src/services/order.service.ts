import { Order, IOrder, IOrderItem } from '../models/order.model';


export class OrderService {
    public async createOrder(userId: string, items: IOrderItem[]): Promise<IOrder> {
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = new Order({
            userId,
            items,
            totalAmount,
        });

        return await order.save();
    }

    public async getUserOrders(userId: string): Promise<IOrder[]> {
        return await Order.find({ userId }).sort({ createdAt: -1 });
    }

    public async getAllOrders(): Promise<IOrder[]> {
        return await Order.find().populate('userId', 'email').sort({ createdAt: -1 });
    }
}

export const orderService = new OrderService();
