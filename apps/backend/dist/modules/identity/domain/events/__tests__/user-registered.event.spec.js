"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_registered_event_1 = require("../user-registered.event");
describe('UserRegisteredEvent', () => {
    it('should create event with correct properties', () => {
        const event = new user_registered_event_1.UserRegisteredEvent({
            userId: 'user-id-123',
            email: 'user@example.com',
            username: 'john_doe',
        });
        expect(event.props.userId).toBe('user-id-123');
        expect(event.props.email).toBe('user@example.com');
        expect(event.props.username).toBe('john_doe');
        expect(event.eventName).toBe('user.registered');
    });
    it('should have occurredOn timestamp', () => {
        const beforeCreate = new Date();
        const event = new user_registered_event_1.UserRegisteredEvent({
            userId: 'user-id-123',
            email: 'user@example.com',
            username: 'john_doe',
        });
        const afterCreate = new Date();
        expect(event.occurredOn).toBeInstanceOf(Date);
        expect(event.occurredOn.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
        expect(event.occurredOn.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
    it('should return correct aggregate ID', () => {
        const event = new user_registered_event_1.UserRegisteredEvent({
            userId: 'user-id-123',
            email: 'user@example.com',
            username: 'john_doe',
        });
        expect(event.getAggregateId()).toBe('user-id-123');
    });
});
//# sourceMappingURL=user-registered.event.spec.js.map