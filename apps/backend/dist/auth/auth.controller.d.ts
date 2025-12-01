import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto, UserDto } from '@quizz-app/shared-types';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    getProfile(req: ExpressRequest & {
        user: {
            id: string;
            email: string;
            username: string;
            name: string;
        };
    }): Promise<Omit<UserDto, 'createdAt' | 'updatedAt'>>;
}
