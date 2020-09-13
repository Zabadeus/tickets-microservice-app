import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { createCookieSignin, createIdSignin } from '../../test/test-auth-helper';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';


it('returns a 404 if the provided id does not exist', async () => {
    const id = createIdSignin();
    const cookie = createCookieSignin();
    const response = await request(app)
        .get(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 20
        });
    
    expect(response.status).toEqual(404);
});

it('returns a 404 if the user is not authenticated', async () => {
    const cookieOne = createCookieSignin();
    const cookieTwo = createCookieSignin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieOne)
        .send({
            title: 'Title',
            price: 20
        })
        .expect(201)

    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookieTwo)
        .send({
            title: 'updatedTitle',
            price: 20000
        });
    
    expect(updateResponse.status).toEqual(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = createCookieSignin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 20
        })
        .expect(201)

    const invalidTitleRes = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20000
        });
    
    const invalidPriceRes = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'updatedTitle',
            price: -20000
        });
    
    expect(invalidTitleRes.status).toEqual(400);
    expect(invalidPriceRes.status).toEqual(400);
});

it('returns a 201 if the user is authenticated', async () => {
    const cookie = createCookieSignin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 20
        })
        .expect(201)

    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'updatedTitle',
            price: 20000
        });
    
    expect(updateResponse.status).toEqual(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();
    
    expect(ticketResponse.body.title).toEqual('updatedTitle');
    expect(ticketResponse.body.price).toEqual(20000);
});

it('publishes an event', async () => {
    const cookie = createCookieSignin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 20
        })
        .expect(201)

    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'updatedTitle',
            price: 20000
        });
    
    expect(updateResponse.status).toEqual(200);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
    const cookie = createCookieSignin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 20
        })
        .expect(201)
    
    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'updatedTitle',
            price: 20000
        });
    
    expect(updateResponse.status).toEqual(400);
});