import { QueryBus } from '@nestjs/cqrs';
export declare class GamificationController {
    private readonly queryBus;
    constructor(queryBus: QueryBus);
    getProgress(user: any): Promise<any>;
}
