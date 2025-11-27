import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '../../domain/base/domain-event.base';

/**
 * Event Bus Service
 *
 * Wrapper around NestJS EventEmitter for publishing domain events.
 * Provides type-safe event publishing and ensures events are properly logged.
 */
@Injectable()
export class EventBusService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Publish a single domain event
   */
  async publish(event: DomainEvent): Promise<void> {
    console.log(`[EventBus] Publishing event: ${event.eventName}`);
    await this.eventEmitter.emitAsync(event.eventName, event);
  }

  /**
   * Publish multiple domain events
   */
  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
