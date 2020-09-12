import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
    await request(app)
        .post('/api/user/signup')
        .send({
            email: 'user@test.com',
            password: 'password'
        })
        .expect(201);
    
    const response = await request(app)
        .post('/api/user/signout')
        .send({})
        .expect(200);
    
    expect(response.get('Set-Cookie')).toEqual([expect.any(String)]);
});