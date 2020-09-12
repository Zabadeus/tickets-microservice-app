import { Publisher, OrderCreatedEvent, Subjects } from '@zab-dev-tickets/common';

// Create an event-publisher extending base class 'Publisher' provided an event type
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.OrderCreated = Subjects.OrderCreated; 
};
