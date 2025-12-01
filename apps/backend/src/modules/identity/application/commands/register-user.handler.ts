import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, Inject } from '@nestjs/common';
import { RegisterUserCommand } from './register-user.command';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
import { User } from '../../domain/aggregates/user.aggregate';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
import { EntityAlreadyExistsException } from '@shared/domain/exceptions';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterUserResult {
  userId: string;
  email: string;
  username: string;
}

/**
 * Register User Command Handler
 *
 * Handles user registration:
 * 1. Validate email and username are unique
 * 2. Hash password
 * 3. Create User aggregate
 * 4. Persist to database
 * 5. Publish UserRegisteredEvent
 */
@Injectable()
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, RegisterUserResult> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    const email = Email.create(command.email);
    const username = Username.create(command.username);

    // Check if user already exists
    const exists = await this.userRepository.exists(email, username);
    if (exists) {
      throw new EntityAlreadyExistsException('User', command.email);
    }

    // Password will be hashed in infrastructure layer (PasswordService)
    // For now, we expect it to be pre-hashed before reaching this handler
    const userId = uuidv4();
    const user = User.create(userId, email, username, command.name, command.password);

    // Save user
    await this.userRepository.save(user);

    // Publish domain events
    await this.eventBus.publishAll([...user.domainEvents]);
    user.clearEvents();

    return {
      userId: user.id,
      email: email.value,
      username: username.value,
    };
  }
}
