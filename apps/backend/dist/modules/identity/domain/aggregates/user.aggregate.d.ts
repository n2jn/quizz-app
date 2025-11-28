import { AggregateRoot } from '@shared/domain/base';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
export declare enum UserRole {
    PLAYER = "PLAYER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export interface UserProps {
    id: string;
    email: Email;
    username: Username;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export declare class User extends AggregateRoot<string> {
    private email;
    private username;
    private passwordHash;
    private role;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(id: string, email: Email, username: Username, passwordHash: string): User;
    static fromPersistence(props: UserProps): User;
    getEmail(): Email;
    getUsername(): Username;
    getPasswordHash(): string;
    getRole(): UserRole;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
    isAdmin(): boolean;
    isSuperAdmin(): boolean;
    updatePassword(newPasswordHash: string): void;
}
