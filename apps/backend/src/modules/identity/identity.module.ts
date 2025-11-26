import { Module } from '@nestjs/common';

/**
 * Identity Bounded Context
 *
 * Responsibilities:
 * - User registration and authentication
 * - JWT token management
 * - User profile management
 * - Password hashing and validation
 *
 * Domain Events Emitted:
 * - UserRegisteredEvent
 * - UserLoggedInEvent
 */
@Module({
  imports: [],
  providers: [],
  controllers: [],
  exports: [],
})
export class IdentityModule {}
