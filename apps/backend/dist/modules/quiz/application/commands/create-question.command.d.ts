export interface CreateQuestionAnswerDto {
    text: string;
    isCorrect: boolean;
}
export declare class CreateQuestionCommand {
    readonly text: string;
    readonly explanation: string;
    readonly categoryId: string;
    readonly difficultyId: string;
    readonly createdById: string;
    readonly answers: CreateQuestionAnswerDto[];
    readonly imageUrl?: string | undefined;
    constructor(text: string, explanation: string, categoryId: string, difficultyId: string, createdById: string, answers: CreateQuestionAnswerDto[], imageUrl?: string | undefined);
}
