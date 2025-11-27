import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserCommand } from './login-user.command';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';

export interface LoginUserResult {
  userId: string;
  email: string;
  username: string;
  role: string;
}

/**
 * Login User Command Handler
 *
 * Handles user authentication:
 * 1. Find user by email
 * 2. Verify password (done in infrastructure)
 * 3. Return user info for JWT generation
 */
@Injectable()
@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand, LoginUserResult> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    const email = Email.create(command.email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Password verification happens in the service layer before calling this
    // This handler assumes password is already verified

    return {
      userId: user.id,
      email: user.getEmail().value,
      username: user.getUsername().value,
      role: user.getRole(),
    };
  }
}
