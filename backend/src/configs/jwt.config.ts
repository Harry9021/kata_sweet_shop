import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface TokenPayload {
    userId: string;
    role?: string;
}

export interface AccessTokenPayload extends TokenPayload {
    role: string;
}

export class JWTConfig {
    private static readonly ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
    private static readonly REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    private static readonly ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
    private static readonly REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

    public static generateAccessToken(userId: string, role: string): string {
        const payload: AccessTokenPayload = {
            userId,
            role,
        };

        return jwt.sign(payload, this.ACCESS_SECRET, {
            expiresIn: this.ACCESS_EXPIRY as any,
        });
    }

    public static generateRefreshToken(userId: string): string {
        const payload: TokenPayload = {
            userId,
        };

        return jwt.sign(payload, this.REFRESH_SECRET, {
            expiresIn: this.REFRESH_EXPIRY as any,
        });
    }

    public static verifyAccessToken(token: string): AccessTokenPayload {
        try {
            const decoded = jwt.verify(token, this.ACCESS_SECRET) as AccessTokenPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Access token has expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid access token');
            }
            throw error;
        }
    }

    public static verifyRefreshToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.REFRESH_SECRET) as TokenPayload;
            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Refresh token has expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid refresh token');
            }
            throw error;
        }
    }

    public static getRefreshTokenExpiry(): Date {
        const expiryMs = this.parseExpiryToMs(this.REFRESH_EXPIRY);
        return new Date(Date.now() + expiryMs);
    }

    private static parseExpiryToMs(expiry: string): number {
        const match = expiry.match(/^(\d+)([smhd])$/);
        if (!match) {
            throw new Error(`Invalid expiry format: ${expiry}`);
        }

        const value = parseInt(match[1], 10);
        const unit = match[2];

        const multipliers: { [key: string]: number } = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };

        return value * multipliers[unit];
    }
}
