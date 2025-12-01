import { AggregateRoot } from '@shared/domain/base';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
import { UserRegisteredEvent } from '../events/user-registered.event';

export const UserRole = {
  PLAYER: 'PLAYER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const

export type UserRole = keyof typeof UserRole

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

/**
 * User Aggregate Root
 *
 * Represents a user in the system.
 * Main aggregate of the Identity bounded context.
 */
export class User extends AggregateRoot<string> {
  private email: Email;
  private username: Username;
  private name: string;
  private passwordHash: string;
  private role: UserRole;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: UserProps) {
    super(props.id);
    this.email = props.email;
    this.username = props.username;
    this.name = props.name;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Create a new user (registration)
   */
  static create(
    id: string,
    email: Email,
    username: Username,
    name: string,
    passwordHash: string,
  ): User {
    const user = new User({
      id,
      email,
      username,
      name,
      passwordHash,
      role: UserRole.PLAYER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Emit domain event
    user.addDomainEvent(
      new UserRegisteredEvent({
        userId: id,
        email: email.value,
        username: username.value,
      }),
    );

    return user;
  }

  /**
   * Reconstitute user from persistence
   */
  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  // Getters
  getEmail(): Email {
    return this.email;
  }

  getUsername(): Username {
    return this.username;
  }

  getName(): string {
    return this.name;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getRole(): UserRole {
    return this.role;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business logic
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.SUPER_ADMIN;
  }

  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }

  updatePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
    this.updatedAt = new Date();
  }
}
