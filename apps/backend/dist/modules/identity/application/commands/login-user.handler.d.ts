import { ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
export interface LoginUserResult {
    userId: string;
    email: string;
    username: string;
    role: string;
}
export declare class LoginUserHandler implements ICommandHandler<LoginUserCommand, LoginUserResult> {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(command: LoginUserCommand): Promise<LoginUserResult>;
}
