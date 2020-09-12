import request from 'supertest';
import { app } from '../../app';

import { createCookieSignin } from '../../test/test-auth-helper';

it('responds with details about the current user', async () => {
    const cookie = await createCookieSignin()
    
    const response = await request(app)
        .get('/api/user/currentuser')
        .set('Cookie', cookie)
        .send({})
        .expect(200);
    
    expect(response.body.currentUser.email).toEqual('user@test.com');
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/user/currentuser')
        .send({})
        .expect(200);
    
    expect(response.body.currentUser).toEqual(null);
});