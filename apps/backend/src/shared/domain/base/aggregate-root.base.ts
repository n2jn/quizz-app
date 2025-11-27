import { Entity } from './entity.base';
import { DomainEvent } from './domain-event.base';

/**
 * Aggregate Root base class
 *
 * Aggregates are clusters of domain objects that can be treated as a single unit.
 * Only Aggregate Roots can emit domain events.
 */
export abstract class AggregateRoot<T = string> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): ReadonlyArray<DomainEvent> {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
