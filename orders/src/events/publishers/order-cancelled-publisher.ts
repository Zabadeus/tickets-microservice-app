import { Publisher, OrderCancelledEvent, Subjects } from '@zab-dev-tickets/common';

// Create an event-publisher extending base class 'Publisher' provided an event type
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled; 
};
