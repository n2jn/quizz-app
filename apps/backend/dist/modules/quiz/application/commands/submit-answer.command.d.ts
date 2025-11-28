export declare class SubmitAnswerCommand {
    readonly sessionId: string;
    readonly questionId: string;
    readonly answerId: string;
    readonly timeSpent: number;
    constructor(sessionId: string, questionId: string, answerId: string, timeSpent: number);
}
