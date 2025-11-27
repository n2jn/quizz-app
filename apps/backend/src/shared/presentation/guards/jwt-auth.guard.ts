import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Auth Guard
 *
 * Protects routes requiring authentication.
 * Uses the JWT strategy to validate tokens.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
