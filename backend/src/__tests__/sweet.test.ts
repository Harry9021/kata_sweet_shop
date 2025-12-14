import request from 'supertest';
import server from '../server';
import { SweetService } from '../services/sweet.service';
import { JWTConfig } from '../configs/jwt.config';

// Mock SweetService
jest.mock('../services/sweet.service');
const mockSweetService = SweetService as jest.MockedClass<typeof SweetService>;

// Mock Auth Middleware dependencies (if needed, but usually we just send valid tokens)
// Since we are mocking the service, we just need to bypass auth or provide valid tokens.
// For simplicity in integration tests with mocked services, we can mock the auth middleware OR generate valid tokens if the env is set up.
// Here we will generate valid tokens using JWTConfig.

describe('Sweet Routes', () => {
    const app = server.getApp();
    let adminToken: string;
    let userToken: string;

    beforeAll(() => {
        // Generate tokens for testing
        // Note: mocking DB might be needed if auth middleware checks DB. 
        // Checking auth.middleware.ts... it verifies token. 
        // Checking role.middleware.ts... it checks req.user.role.
        // If auth middleware fetches user from DB, we need to mock that too or mock the middleware.
        // Let's assume for now we might need to mock the middleware if it hits DB.
        // However, looking at standard JWT implementation, verify usually just decodes. 
        // If `authenticate` middleware finds user in DB, we'll need to handle that.

        // Let's rely on standard JWT generation.
        adminToken = JWTConfig.generateAccessToken('admin-id', 'admin');
        userToken = JWTConfig.generateAccessToken('user-id', 'user');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // We need to mock the User.findById if auth middleware uses it.
    // Let's check auth.middleware.ts content if available or assume standard.
    // Assuming it adheres to standard pattern. If it fails, we will mock the middleware.

    describe('GET /api/sweets', () => {
        it('should return all sweets', async () => {
            const mockSweets = [{ name: 'Choco', price: 10 }];
            mockSweetService.prototype.getAllSweets.mockResolvedValue(mockSweets as any);

            const res = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockSweets);
        });
    });

    describe('POST /api/sweets', () => {
        it('should create sweet if admin', async () => {
            const newSweet = { name: 'New Candy', price: 5, category: 'Candy', quantity: 100 };
            mockSweetService.prototype.createSweet.mockResolvedValue(newSweet as any);

            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newSweet);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(newSweet);
        });

        it('should fail if not admin', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Hack' });

            expect(res.status).toBe(403);
        });
    });

    // Add more cases...
    describe('GET /api/sweets/:id', () => {
        it('should return a sweet by id', async () => {
            const validId = '507f1f77bcf86cd799439011';
            const mockSweet = { _id: validId, name: 'Sweet' };
            mockSweetService.prototype.getSweetById.mockResolvedValue(mockSweet as any);

            const res = await request(app)
                .get(`/api/sweets/${validId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toEqual(mockSweet);
        });
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should purchase sweet', async () => {
            const validId = '507f1f77bcf86cd799439011';
            const mockSweet = { _id: validId, quantity: 90 };
            mockSweetService.prototype.purchaseSweet.mockResolvedValue(mockSweet as any);

            const res = await request(app)
                .post(`/api/sweets/${validId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 5 });

            expect(res.status).toBe(200);
            expect(mockSweetService.prototype.purchaseSweet).toHaveBeenCalledWith(validId, 'user-id', 5);
        });
    });
});
