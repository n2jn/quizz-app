import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/aggregates/user.aggregate';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';
export declare class UserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    findByUsername(username: Username): Promise<User | null>;
    exists(email: Email, username: Username): Promise<boolean>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    private toDomain;
}
