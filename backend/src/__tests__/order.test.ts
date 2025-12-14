import request from 'supertest';
import server from '../server';
import { orderService } from '../services/order.service'; // It exports an instance 'orderService'
import { JWTConfig } from '../configs/jwt.config';

// Mock OrderService
// Since correct import is an instance, we mock the class and the instance methods?
// In order.routes.ts: import { orderService } from '../services/order.service';
// We need to spy on the instance methods or mock the module to return a mock instance.
jest.mock('../services/order.service', () => ({
    orderService: {
        getUserOrders: jest.fn(),
        getAllOrders: jest.fn(),
    }
}));

const mockOrderService = orderService as jest.Mocked<typeof orderService>;

describe('Order Routes', () => {
    const app = server.getApp();
    let adminToken: string;
    let userToken: string;

    beforeAll(() => {
        adminToken = JWTConfig.generateAccessToken('admin-id', 'admin');
        userToken = JWTConfig.generateAccessToken('user-id', 'user');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/orders/my-orders', () => {
        it('should return user orders', async () => {
            const mockOrders = [{ _id: 'order1', totalAmount: 50 }];
            (mockOrderService.getUserOrders as jest.Mock).mockResolvedValue(mockOrders);

            const res = await request(app)
                .get('/api/orders/my-orders')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockOrders);
            // Verify userId passed to service matches token's userId
            expect(mockOrderService.getUserOrders).toHaveBeenCalledWith('user-id');
        });
    });

    describe('GET /api/orders/sales', () => {
        it('should return sales data for admin', async () => {
            const mockOrders = [
                { totalAmount: 100 },
                { totalAmount: 50 }
            ];
            (mockOrderService.getAllOrders as jest.Mock).mockResolvedValue(mockOrders);

            const res = await request(app)
                .get('/api/orders/sales')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.totalRevenue).toBe(150);
            expect(res.body.data.totalOrders).toBe(2);
        });

        it('should fail for non-admin', async () => {
            const res = await request(app)
                .get('/api/orders/sales')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(403);
        });
    });
});
