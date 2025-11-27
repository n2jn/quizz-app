/**
 * Base Domain Event class
 *
 * Domain events represent something that happened in the domain.
 * They are immutable and should be named in past tense.
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string;

  constructor(eventName: string) {
    this.occurredOn = new Date();
    this.eventName = eventName;
  }

  abstract getAggregateId(): string;
}
