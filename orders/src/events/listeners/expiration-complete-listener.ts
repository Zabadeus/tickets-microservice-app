import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from '@zab-dev-tickets/common';
import { Message } from 'node-nats-streaming';

import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

// Create an event-listener extending base class 'listener' provided an event type
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id 
            }
        });

        msg.ack();
    };
};