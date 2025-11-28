import { Lives } from '../aggregates/lives.aggregate';
export interface ILivesRepository {
    save(lives: Lives): Promise<void>;
    findByUserId(userId: string): Promise<Lives | null>;
    getOrCreate(userId: string): Promise<Lives>;
}
