import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Application
import { RegisterUserHandler } from './application/commands/register-user.handler';
import { LoginUserHandler } from './application/commands/login-user.handler';

// Infrastructure
import { UserRepository } from './infrastructure/repositories/user.repository';
import { PasswordService } from './infrastructure/services/password.service';
import { JwtTokenService } from './infrastructure/services/jwt.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

// Presentation
import { AuthController } from './presentation/controllers/auth.controller';

// Provide the repository implementation
import { IUserRepository } from './domain/repositories/user.repository.interface';

const CommandHandlers = [RegisterUserHandler, LoginUserHandler];

const Repositories = [
  {
    provide: 'IUserRepository',
    useClass: UserRepository,
  },
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
];

const Services = [PasswordService, JwtTokenService];

const Strategies = [JwtStrategy];

/**
 * Identity Module
 *
 * Handles user authentication and identity management.
 * Implements Clean Architecture with CQRS pattern.
 */
@Module({
  imports: [
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, ...Repositories, ...Services, ...Strategies],
  exports: [JwtModule, PassportModule, ...Services],
})
export class IdentityModule {}
