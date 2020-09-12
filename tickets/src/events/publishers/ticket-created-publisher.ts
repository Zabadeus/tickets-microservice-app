import { Publisher, TicketCreatedEvent, Subjects } from '@zab-dev-tickets/common';

// Create an event-publisher extending base class 'Publisher' provided an event type
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.TicketCreated = Subjects.TicketCreated; 
};
