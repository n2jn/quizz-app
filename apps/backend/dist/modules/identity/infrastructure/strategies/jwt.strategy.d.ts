import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../services/jwt.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string;
        username: string;
        role: import("../../domain/aggregates/user.aggregate").UserRole;
    }>;
}
export {};
