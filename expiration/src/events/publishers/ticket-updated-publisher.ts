import { Publisher, TicketUpdatedEvent, Subjects } from '@zab-dev-tickets/common';

// Create an event-publisher extending base class 'Publisher' provided an event type
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated; 
};
