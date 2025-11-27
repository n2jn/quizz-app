import { Lives } from '../aggregates/lives.aggregate';

/**
 * Lives Repository Interface
 *
 * Defines contract for lives persistence operations.
 */
export interface ILivesRepository {
  save(lives: Lives): Promise<void>;
  findByUserId(userId: string): Promise<Lives | null>;
  getOrCreate(userId: string): Promise<Lives>;
}
