import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '../../domain/base/domain-event.base';
export declare class EventBusService {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    publish(event: DomainEvent): Promise<void>;
    publishAll(events: DomainEvent[]): Promise<void>;
}
