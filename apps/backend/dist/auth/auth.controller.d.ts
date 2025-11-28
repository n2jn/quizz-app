import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto, UserDto } from '@quizz-app/shared-types';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    getProfile(req: any): Promise<Omit<UserDto, 'createdAt' | 'updatedAt'>>;
}
