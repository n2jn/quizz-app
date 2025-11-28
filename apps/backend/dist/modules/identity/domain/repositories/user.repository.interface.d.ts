import { IRepository } from '@shared/domain/base';
import { User } from '../aggregates/user.aggregate';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
export interface IUserRepository extends IRepository<User> {
    findByEmail(email: Email): Promise<User | null>;
    findByUsername(username: Username): Promise<User | null>;
    exists(email: Email, username: Username): Promise<boolean>;
}
