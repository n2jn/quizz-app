import { PrismaService } from '@shared/infrastructure/database/prisma.service';
import { IPlayerProgressRepository } from '../../domain/repositories/player-progress.repository.interface';
import { PlayerProgress } from '../../domain/aggregates/player-progress.aggregate';
export declare class PlayerProgressRepository implements IPlayerProgressRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(progress: PlayerProgress): Promise<void>;
    findByUserId(userId: string): Promise<PlayerProgress | null>;
    getOrCreate(userId: string): Promise<PlayerProgress>;
}
