import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto, UserDto } from '@quizz-app/shared-types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: ExpressRequest & { user: { id: string; email: string; username: string; name: string } }): Promise<Omit<UserDto, 'createdAt' | 'updatedAt'>> {
    return {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      name: req.user.name,
    };
  }
}
