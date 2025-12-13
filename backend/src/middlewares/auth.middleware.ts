import { Request, Response, NextFunction } from 'express';
import { JWTConfig, AccessTokenPayload } from '../configs/jwt.config';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: 'Access token is required',
            });
            return;
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).json({
                success: false,
                message: 'Invalid authorization header format. Use: Bearer <token>',
            });
            return;
        }

        const token = parts[1];

        const decoded: AccessTokenPayload = JWTConfig.verifyAccessToken(token);

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || 'Invalid or expired access token',
        });
    }
};
