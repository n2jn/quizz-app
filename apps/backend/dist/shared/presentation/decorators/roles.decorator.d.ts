import { UserRole } from '@modules/identity/domain/aggregates/user.aggregate';
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
