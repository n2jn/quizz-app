export class PurchaseItemCommand {
  constructor(
    public readonly userId: string,
    public readonly itemId: string,
  ) {}
}
