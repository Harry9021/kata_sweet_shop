import { Request, Response, NextFunction } from 'express';
import { decryptPassword } from '../utils/encryption';

export const decryptPasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body && req.body.password) {
            req.body.password = decryptPassword(req.body.password);
        }
        return next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: 'Invalid password encoding',
        });
    }
};
