import { Listener, TicketCreatedEvent, Subjects } from '@zab-dev-tickets/common';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

// Create an event-listener extending base class 'listener' provided an event type
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {


        msg.ack();
    };
};