import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto, RefreshTokenDto } from '../dtos/auth-response.dto';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { LoginUserCommand } from '../../application/commands/login-user.command';
import { PasswordService } from '../../infrastructure/services/password.service';
import { JwtTokenService } from '../../infrastructure/services/jwt.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';

/**
 * Auth Controller
 *
 * Handles authentication endpoints: register, login, refresh.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly passwordService: PasswordService,
    private readonly jwtTokenService: JwtTokenService,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    // Hash password before sending to command
    const hashedPassword = await this.passwordService.hash(dto.password);

    const result = await this.commandBus.execute(
      new RegisterUserCommand(dto.email, dto.username, dto.username, hashedPassword),
    );

    // Generate tokens
    const tokens = await this.jwtTokenService.generateTokenPair(
      result.userId,
      result.email,
      result.username,
      'PLAYER',
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        userId: result.userId,
        email: result.email,
        username: result.username,
        role: 'PLAYER',
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    // Find user and verify password
    const email = Email.create(dto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.getPasswordHash(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Execute login command
    const result = await this.commandBus.execute(new LoginUserCommand(dto.email, dto.password));

    // Generate tokens
    const tokens = await this.jwtTokenService.generateTokenPair(
      result.userId,
      result.email,
      result.username,
      result.role,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        userId: result.userId,
        email: result.email,
        username: result.username,
        role: result.role,
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const tokens = await this.jwtTokenService.refreshAccessToken(dto.refreshToken);

    if (!tokens) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Get user info from new access token
    const user = await this.userRepository.findById(
      this.jwtTokenService['jwtService'].decode(tokens.accessToken)['sub'],
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        userId: user.id,
        email: user.getEmail().value,
        username: user.getUsername().value,
        role: user.getRole(),
      },
    };
  }
}
