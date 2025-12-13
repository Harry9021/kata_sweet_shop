import { User, IUser } from '../models/user.model';
import { RefreshToken } from '../models/refreshToken.model';
import { JWTConfig } from '../configs/jwt.config';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface UserResponse {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
}

export class AuthService {
    public async register(
        email: string,
        password: string,
        role: 'user' | 'admin' = 'user'
    ): Promise<{ user: UserResponse; tokens: AuthTokens }> {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const user = await User.create({
                email,
                password,
                role,
            });

            const tokens = await this.generateTokens(user);

            return {
                user: this.formatUserResponse(user),
                tokens,
            };
        } catch (error: any) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }

    public async login(
        email: string,
        password: string
    ): Promise<{ user: UserResponse; tokens: AuthTokens }> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid email or password');
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            const tokens = await this.generateTokens(user);

            return {
                user: this.formatUserResponse(user),
                tokens,
            };
        } catch (error: any) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    public async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const decoded = JWTConfig.verifyRefreshToken(refreshToken);

            const storedToken = await RefreshToken.findOne({
                token: refreshToken,
                userId: decoded.userId,
            });

            if (!storedToken) {
                throw new Error('Invalid refresh token');
            }

            if (storedToken.expiresAt < new Date()) {
                await RefreshToken.deleteOne({ _id: storedToken._id });
                throw new Error('Refresh token has expired');
            }

            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }

            const accessToken = JWTConfig.generateAccessToken(user._id.toString(), user.role);

            return { accessToken };
        } catch (error: any) {
            throw new Error(`Token refresh failed: ${error.message}`);
        }
    }

    public async logout(refreshToken: string): Promise<void> {
        try {
            await RefreshToken.deleteOne({ token: refreshToken });
        } catch (error: any) {
            throw new Error(`Logout failed: ${error.message}`);
        }
    }

    private async generateTokens(user: IUser): Promise<AuthTokens> {
        const accessToken = JWTConfig.generateAccessToken(user._id.toString(), user.role);
        const refreshToken = JWTConfig.generateRefreshToken(user._id.toString());

        await RefreshToken.create({
            token: refreshToken,
            userId: user._id,
            expiresAt: JWTConfig.getRefreshTokenExpiry(),
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    private formatUserResponse(user: IUser): UserResponse {
        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}
