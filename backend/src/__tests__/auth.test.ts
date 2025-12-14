import request from 'supertest';
import server from '../server';
import { AuthService } from '../services/auth.service';
import CryptoJS from 'crypto-js';

// Mock AuthService
jest.mock('../services/auth.service');

const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('Auth Routes', () => {
    const app = server.getApp();
    const SECRET_KEY = process.env.PASSWORD_SECRET_KEY || 'test-secret-key'; // Ensure this matches logic

    // Helper to encrypt password
    const encryptPassword = (password: string) => {
        return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    };

    beforeAll(() => {
        // Set env var for test if needed, though jest mock isolates it mostly
        process.env.PASSWORD_SECRET_KEY = SECRET_KEY;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                role: 'user',
            };

            const mockToken = {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                user: mockUser,
            };

            // Mock the register method implementation
            mockAuthService.prototype.register.mockResolvedValue(mockToken as any);

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: encryptPassword('password123'),
                    role: 'user',
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockToken);
            expect(mockAuthService.prototype.register).toHaveBeenCalledWith(
                'test@example.com',
                'password123', // Expect decrypted password
                'user'
            );
        });

        it('should return 400 for invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: encryptPassword('password123'),
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully', async () => {
            const mockToken = {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                user: { _id: '123', email: 'test@example.com', role: 'user' },
            };

            mockAuthService.prototype.login.mockResolvedValue(mockToken as any);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: encryptPassword('password123'),
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockToken);
            expect(mockAuthService.prototype.login).toHaveBeenCalledWith(
                'test@example.com',
                'password123'
            );
        });
    });

    describe('POST /api/auth/refresh', () => {
        it('should refresh token successfully', async () => {
            const mockResponse = { accessToken: 'new-access-token' };
            mockAuthService.prototype.refreshAccessToken.mockResolvedValue(mockResponse);

            const res = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken: 'valid-refresh-token' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockResponse);
            expect(mockAuthService.prototype.refreshAccessToken).toHaveBeenCalledWith('valid-refresh-token');
        });

        it('should return 400 if refreshToken is missing', async () => {
            const res = await request(app)
                .post('/api/auth/refresh')
                .send({});

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            mockAuthService.prototype.logout.mockResolvedValue(undefined);

            const res = await request(app)
                .post('/api/auth/logout')
                .send({ refreshToken: 'valid-refresh-token' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(mockAuthService.prototype.logout).toHaveBeenCalledWith('valid-refresh-token');
        });
    });
});
