import { PrismaService } from '../prisma/prisma.service';
import { User } from '@generated/prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: {
        email: string;
        username: string;
        name: string;
        password: string;
    }): Promise<User>;
}
