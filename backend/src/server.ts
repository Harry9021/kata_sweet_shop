import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseConfig } from './configs/database.config';
import authRoutes from './routes/auth.routes';
import sweetRoutes from './routes/sweet.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

dotenv.config();

class Server {
    private app: Application;
    private port: number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '5000', 10);

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.app.use(
            cors({
                origin: process.env.CORS_ORIGIN || '*',
                credentials: true,
            })
        );

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        if (process.env.NODE_ENV === 'development') {
            this.app.use((req, _res, next) => {
                console.log(`${req.method} ${req.path}`);
                next();
            });
        }
    }

    private initializeRoutes(): void {
        this.app.get('/health', (_req, res) => {
            res.status(200).json({
                success: true,
                message: 'Server is running',
                timestamp: new Date().toISOString(),
            });
        });

        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/sweets', sweetRoutes);
        this.app.use('/api/orders', orderRoutes);

        this.app.use(notFound);
    }

    private initializeErrorHandling(): void {
        this.app.use(errorHandler);
    }

    public getApp(): Application {
        return this.app;
    }

    public async start(): Promise<void> {
        try {
            await DatabaseConfig.connect();

            this.app.listen(this.port, () => {
                console.log('========================================');
                console.log(`Server running on port ${this.port}`);
                console.log(`Environment: ${process.env.NODE_ENV}`);
                console.log(`Health check: http://localhost:${this.port}/health`);
                console.log('========================================');
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

const server = new Server();

if (process.env.NODE_ENV !== 'test') {
    server.start();
}

export default server;
