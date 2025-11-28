import { PlayerProgress } from '../aggregates/player-progress.aggregate';
export interface IPlayerProgressRepository {
    save(progress: PlayerProgress): Promise<void>;
    findByUserId(userId: string): Promise<PlayerProgress | null>;
    getOrCreate(userId: string): Promise<PlayerProgress>;
}
