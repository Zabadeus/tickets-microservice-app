import request from 'supertest';

import { app } from '../../app';
import { createCookieSignin, createIdSignin } from '../../test/test-auth-helper';

it('returns a 404 if the ticket is not found', async () =>{
    const id = createIdSignin();
    const response = await request(app)
        .get(`/api/tickets/${id}`)
        .send()
    
    expect(response.status).toEqual(404);
});

it('returns the ticket if the ticket is found', async () =>{
    const cookie = await createCookieSignin();
    const title = 'Concert';
    const price = 39.99
    
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(201);
    
    // alternatively create a won ticket
    // const ticket = Ticket.build({ title, price, userId: 'df#200u912' });
    // console.log(ticket)
    //console.log("TICKET", response.body.id)

    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});