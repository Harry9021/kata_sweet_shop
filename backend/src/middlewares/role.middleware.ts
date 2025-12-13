import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        if (req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required',
            });
            return;
        }

        next();
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Authorization check failed',
        });
    }
};
