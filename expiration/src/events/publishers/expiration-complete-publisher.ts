import { Publisher, ExpirationCompleteEvent, Subjects } from '@zab-dev-tickets/common';

// Create an event-publisher extending base class 'Publisher' provided an event type
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete; 
};
