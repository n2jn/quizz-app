import { Entity } from './entity.base';
import { DomainEvent } from './domain-event.base';
export declare abstract class AggregateRoot<T = string> extends Entity<T> {
    private _domainEvents;
    get domainEvents(): ReadonlyArray<DomainEvent>;
    protected addDomainEvent(event: DomainEvent): void;
    clearEvents(): void;
}
