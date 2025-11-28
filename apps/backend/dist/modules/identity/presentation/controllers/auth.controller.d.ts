import { CommandBus } from '@nestjs/cqrs';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto, RefreshTokenDto } from '../dtos/auth-response.dto';
import { PasswordService } from '../../infrastructure/services/password.service';
import { JwtTokenService } from '../../infrastructure/services/jwt.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
export declare class AuthController {
    private readonly commandBus;
    private readonly passwordService;
    private readonly jwtTokenService;
    private readonly userRepository;
    constructor(commandBus: CommandBus, passwordService: PasswordService, jwtTokenService: JwtTokenService, userRepository: IUserRepository);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    refresh(dto: RefreshTokenDto): Promise<AuthResponseDto>;
}
