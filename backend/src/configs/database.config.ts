import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseConfig {
    private static isConnected: boolean = false;

    public static async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('📦 Database already connected');
            return;
        }

        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop';

            await mongoose.connect(mongoUri);

            this.isConnected = true;
            console.log('✅ Database connected successfully');

            mongoose.connection.on('error', (error) => {
                console.error('❌ Database connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('⚠️  Database disconnected');
                this.isConnected = false;
            });

            process.on('SIGINT', async () => {
                await mongoose.connection.close();
                console.log('🔌 Database connection closed due to app termination');
                process.exit(0);
            });

        } catch (error) {
            console.error('❌ Failed to connect to database:', error);
            this.isConnected = false;
            throw error;
        }
    }

    public static async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.connection.close();
            this.isConnected = false;
            console.log('🔌 Database disconnected');
        } catch (error) {
            console.error('❌ Error disconnecting from database:', error);
            throw error;
        }
    }

    public static getConnectionStatus(): boolean {
        return this.isConnected;
    }
}
