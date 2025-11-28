import { IPlayerProgressRepository } from '../../domain/repositories/player-progress.repository.interface';
export declare class UserRegisteredGamificationHandler {
    private readonly progressRepository;
    private readonly logger;
    constructor(progressRepository: IPlayerProgressRepository);
    handle(event: any): Promise<void>;
}
