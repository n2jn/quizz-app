import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Password Service
 *
 * Handles password hashing and verification using bcrypt.
 */
@Injectable()
export class PasswordService {
  private readonly saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
