import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@zab-dev-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

import { queueGroupName } from './queue-group-name';

// Create an event-listener extending base class 'listener' provided an event type
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findByIdAndVersion(data);

        if (!order){
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    };
};