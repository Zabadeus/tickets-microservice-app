import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { createCookieSignin } from '../../test/test-auth-helper';
import { Order } from '../../models/order';
import { OrderStatus } from '@zab-dev-tickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

//jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
    const cookie = await createCookieSignin();

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'thwodkafl',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
    
    expect(response.status).toEqual(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const cookie = await createCookieSignin();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });
    await order.save();

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'thwodkafl',
            orderId: order.id
        })
    
    expect(response.status).toEqual(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const cookie = await createCookieSignin(userId);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Cancelled,
        userId: userId,
        version: 0
    });
    await order.save();

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'thwodkafl',
            orderId: order.id
        });
    
    expect(response.status).toEqual(400);
});

// // Test with a mock -- not using the actual stripe api but faster to test
// it('returns a 201 with valid inputs', async () => {
//     const userId = mongoose.Types.ObjectId().toHexString();
//     const cookie = await createCookieSignin(userId);

//     const order = Order.build({
//         id: mongoose.Types.ObjectId().toHexString(),
//         price: 20,
//         status: OrderStatus.Created,
//         userId: userId,
//         version: 0
//     });
//     await order.save();

//     const response = await request(app)
//         .post('/api/payments')
//         .set('Cookie', cookie)
//         .send({
//             token: 'tok_visa',
//             orderId: order.id
//         });
    
//     expect(response.status).toEqual(201);

//     const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//     expect(chargeOptions.source).toEqual('tok_visa');
//     expect(chargeOptions.amount).toEqual(order.price * 100);
//     expect(chargeOptions.currency).toEqual('usd');
// });

// Test using the actual stripe api for a realistic test
// -- takes longer to run since request to external api has to be made
it('returns a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const cookie = await createCookieSignin(userId);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: price,
        status: OrderStatus.Created,
        userId: userId,
        version: 0
    });
    await order.save();

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id
        });
    
    expect(response.status).toEqual(201);

    const stripeCharges = await stripe.charges.list( { limit: 50 });
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100
    });
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');
});

it('returns a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const cookie = await createCookieSignin(userId);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: price,
        status: OrderStatus.Created,
        userId: userId,
        version: 0
    });
    await order.save();

    const response = await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'tok_visa',
            orderId: order.id
        });
    
    expect(response.status).toEqual(201);

    const stripeCharges = await stripe.charges.list( { limit: 50 });
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100
    });
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    });
    expect(payment).not.toBeNull();

    // test if returned payment id from response is the same as in database
    const paymentById = await Payment.findById(response.body.id);
    expect(paymentById).toEqual(payment);
});