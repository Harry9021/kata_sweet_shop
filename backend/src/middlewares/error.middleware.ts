import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal server error';

    if (error.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(error.errors).map((err: any) => err.message);
        message = `Validation error: ${errors.join(', ')}`;
    }

    if (error.code === 11000) {
        statusCode = 409;
        const field = Object.keys(error.keyPattern)[0];
        message = `Duplicate value for field: ${field}`;
    }

    if (error.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${error.path}: ${error.value}`;
    }

    if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    }

    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
    const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
    next(error);
};
