import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@zab-dev-tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

// Create an event-listener extending base class 'listener' provided an event type
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    // the type notation '=' assignment makes 'subject' not changeable
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        
        if (!order){
            throw new Error('Order not found');
        }
        
        order.set({
            status: OrderStatus.Complete
        });

        await order.save();

        // potentially implement an OrderUpdatedEvent

        msg.ack();
    };
};