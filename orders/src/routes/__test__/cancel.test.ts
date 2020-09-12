import request from 'supertest';

import { app } from '../../app';
import { createCookieSignin } from '../../test/test-auth-helper';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
    const user = createCookieSignin();

    // Create a ticket with Ticket Model
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    // Make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    const { body: cancelledOrder } = await request(app)
     .patch(`/api/orders/${order.id}`)
     .set('Cookie', user)
     .send()
     .expect(200);

    // expectation to make sure the ting is cancelled
    const updatedorder = await Order.findById(order.id);

    expect(updatedorder!.status).toEqual(OrderStatus.Cancelled);
    expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
    const user = createCookieSignin();

    // Create a ticket with Ticket Model
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    // Make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to cancel the order
    const { body: cancelledOrder } = await request(app)
     .patch(`/api/orders/${order.id}`)
     .set('Cookie', user)
     .send()
     .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});