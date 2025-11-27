import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@modules/identity/domain/aggregates/user.aggregate';

/**
 * Roles Decorator
 *
 * Marks a route as requiring specific role(s).
 * Usage: @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
