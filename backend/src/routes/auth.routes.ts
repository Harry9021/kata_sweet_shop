import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { validate } from '../middlewares/validation.middleware';
import { decryptPasswordMiddleware } from '../middlewares/decryption.middleware';

const router = Router();
const authService = new AuthService();

class AuthController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, role } = req.body;

            const result = await authService.register(email, password, role);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const result = await authService.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async refresh(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;

            const result = await authService.refreshAccessToken(refreshToken);

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: result,
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;

            await authService.logout(refreshToken);

            res.status(200).json({
                success: true,
                message: 'Logout successful',
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

const controller = new AuthController();

const registerValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

const refreshValidation = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

const logoutValidation = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

router.post('/register', decryptPasswordMiddleware, validate(registerValidation), controller.register.bind(controller));
router.post('/login', decryptPasswordMiddleware, validate(loginValidation), controller.login.bind(controller));
router.post('/refresh', validate(refreshValidation), controller.refresh.bind(controller));
router.post('/logout', validate(logoutValidation), controller.logout.bind(controller));

export default router;
