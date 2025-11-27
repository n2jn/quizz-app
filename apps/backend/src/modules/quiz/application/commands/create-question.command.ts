export interface CreateQuestionAnswerDto {
  text: string;
  isCorrect: boolean;
}

export class CreateQuestionCommand {
  constructor(
    public readonly text: string,
    public readonly explanation: string,
    public readonly categoryId: string,
    public readonly difficultyId: string,
    public readonly createdById: string,
    public readonly answers: CreateQuestionAnswerDto[],
    public readonly imageUrl?: string,
  ) {}
}
