import { Listener, TicketCreatedEvent, Subjects } from '@zab-dev-tickets/common';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

// Create an event-listener extending base class 'listener' provided an event type
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        
        const ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();

        msg.ack();
    };
};