import { JwtService as NestJwtService } from '@nestjs/jwt';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
    role: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class JwtTokenService {
    private readonly jwtService;
    private readonly prisma;
    constructor(jwtService: NestJwtService, prisma: PrismaService);
    generateTokenPair(userId: string, email: string, username: string, role: string): Promise<TokenPair>;
    private generateRefreshToken;
    refreshAccessToken(refreshToken: string): Promise<TokenPair | null>;
    revokeRefreshToken(token: string): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
}
