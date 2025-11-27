export class StartQuizSessionCommand {
  constructor(
    public readonly userId: string,
    public readonly difficultyId: string,
    public readonly categoryId?: string,
  ) {}
}
