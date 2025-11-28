export declare class StartQuizSessionCommand {
    readonly userId: string;
    readonly difficultyId: string;
    readonly categoryId?: string | undefined;
    constructor(userId: string, difficultyId: string, categoryId?: string | undefined);
}
