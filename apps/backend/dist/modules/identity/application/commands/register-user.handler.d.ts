import { ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { EventBusService } from '@shared/infrastructure/events/event-bus.service';
export interface RegisterUserResult {
    userId: string;
    email: string;
    username: string;
}
export declare class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, RegisterUserResult> {
    private readonly userRepository;
    private readonly eventBus;
    constructor(userRepository: IUserRepository, eventBus: EventBusService);
    execute(command: RegisterUserCommand): Promise<RegisterUserResult>;
}
