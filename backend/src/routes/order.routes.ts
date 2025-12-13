import { Router, Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

class OrderController {
    public async getMyOrders(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId;
            const orders = await orderService.getUserOrders(userId);

            res.status(200).json({
                success: true,
                message: 'Orders retrieved successfully',
                data: orders,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async getAllSales(_req: Request, res: Response): Promise<void> {
        try {
            const orders = await orderService.getAllOrders();

            const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

            res.status(200).json({
                success: true,
                message: 'Sales data retrieved successfully',
                data: {
                    orders,
                    totalRevenue,
                    totalOrders: orders.length
                },
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

const controller = new OrderController();

router.get(
    '/my-orders',
    authenticate,
    controller.getMyOrders.bind(controller)
);

router.get(
    '/sales',
    authenticate,
    requireAdmin,
    controller.getAllSales.bind(controller)
);

export default router;
