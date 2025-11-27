import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../domain/aggregates/user.aggregate';
import { Email } from '../../domain/value-objects/email.vo';
import { Username } from '../../domain/value-objects/username.vo';

/**
 * User Repository Implementation
 *
 * Implements persistence for User aggregate using Prisma.
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const userModel = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userModel) {
      return null;
    }

    return this.toDomain(userModel);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userModel = await this.prisma.user.findUnique({
      where: { email: email.value },
    });

    if (!userModel) {
      return null;
    }

    return this.toDomain(userModel);
  }

  async findByUsername(username: Username): Promise<User | null> {
    const userModel = await this.prisma.user.findUnique({
      where: { username: username.value },
    });

    if (!userModel) {
      return null;
    }

    return this.toDomain(userModel);
  }

  async exists(email: Email, username: Username): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        OR: [{ email: email.value }, { username: username.value }],
      },
    });

    return count > 0;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.getEmail().value,
        username: user.getUsername().value,
        password: user.getPasswordHash(),
        role: user.getRole(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
      update: {
        email: user.getEmail().value,
        username: user.getUsername().value,
        password: user.getPasswordHash(),
        role: user.getRole(),
        updatedAt: user.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private toDomain(userModel: any): User {
    return User.fromPersistence({
      id: userModel.id,
      email: Email.create(userModel.email),
      username: Username.create(userModel.username),
      passwordHash: userModel.password,
      role: userModel.role as UserRole,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
    });
  }
}
