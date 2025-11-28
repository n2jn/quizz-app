export declare class AnswerOptionDto {
    id: string;
    text: string;
}
export declare class QuestionDto {
    id: string;
    text: string;
    imageUrl: string | null;
    answers: AnswerOptionDto[];
}
export declare class StartQuizResponseDto {
    sessionId: string;
    userId: string;
    difficultyId: string;
    categoryId: string | null;
    questions: QuestionDto[];
    expiresAt: Date;
}
export declare class SubmitAnswerResponseDto {
    sessionId: string;
    questionId: string;
    answerId: string;
    isCorrect: boolean;
    pointsEarned: number;
    timeBonus: number;
    correctAnswerId: string;
}
export declare class CompleteQuizResponseDto {
    sessionId: string;
    userId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    completedAt: Date;
}
export declare class CreateQuestionResponseDto {
    questionId: string;
    text: string;
    categoryId: string;
    difficultyId: string;
}
