import request from 'supertest';
import { app } from '../../app';

it('fails with 400 when a email that does not exist is supplied', async () => {
    return request(app)
        .post('/api/user/signin')
        .send({
            email: 'user@test.com',
            password: 'password'
        })
        .expect(400);
});

it('fails with 400 when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/user/signup')
        .send({
            email: 'user@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/user/signin')
        .send({
            email: 'user@test.com',
            password: 'pas'
        })
        .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/user/signup')
        .send({
            email: 'user@test.com',
            password: 'password'
        })
        .expect(201);
    
    const response = await request(app)
        .post('/api/user/signin')
        .send({
            email: 'user@test.com',
            password: 'password'
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});