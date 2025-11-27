export class SubmitAnswerCommand {
  constructor(
    public readonly sessionId: string,
    public readonly questionId: string,
    public readonly answerId: string,
    public readonly timeSpent: number, // milliseconds
  ) {}
}
