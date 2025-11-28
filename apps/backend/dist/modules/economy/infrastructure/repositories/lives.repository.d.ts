import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { ILivesRepository } from '../../domain/repositories/lives.repository.interface';
import { Lives } from '../../domain/aggregates/lives.aggregate';
export declare class LivesRepository implements ILivesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(lives: Lives): Promise<void>;
    findByUserId(userId: string): Promise<Lives | null>;
    getOrCreate(userId: string): Promise<Lives>;
}
