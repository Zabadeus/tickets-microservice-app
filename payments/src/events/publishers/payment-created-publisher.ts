import { Publisher, PaymentCreatedEvent, Subjects } from '@zab-dev-tickets/common';

// Create an event-publisher extending base class 'Publisher' provided an event type
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated; 
};
