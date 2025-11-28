export declare class CreateQuestionAnswerDto {
    text: string;
    isCorrect: boolean;
}
export declare class CreateQuestionDto {
    text: string;
    explanation: string;
    categoryId: string;
    difficultyId: string;
    answers: CreateQuestionAnswerDto[];
    imageUrl?: string;
}
