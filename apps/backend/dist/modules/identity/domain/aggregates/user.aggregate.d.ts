import { AggregateRoot } from '@shared/domain/base';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
export declare const UserRole: {
    readonly PLAYER: "PLAYER";
    readonly ADMIN: "ADMIN";
    readonly SUPER_ADMIN: "SUPER_ADMIN";
};
export type UserRole = keyof typeof UserRole;
export interface UserProps {
    id: string;
    email: Email;
    username: Username;
    name: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export declare class User extends AggregateRoot<string> {
    private email;
    private username;
    private name;
    private passwordHash;
    private role;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(id: string, email: Email, username: Username, name: string, passwordHash: string): User;
    static fromPersistence(props: UserProps): User;
    getEmail(): Email;
    getUsername(): Username;
    getName(): string;
    getPasswordHash(): string;
    getRole(): UserRole;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
    isAdmin(): boolean;
    isSuperAdmin(): boolean;
    updatePassword(newPasswordHash: string): void;
}
