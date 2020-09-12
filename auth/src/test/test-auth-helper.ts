import request from 'supertest';
import { app } from '../app';

export const createCookieSignin = async () => {
    const email = 'user@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/user/signup')
        .send({
            email,
            password
        })
        .expect(201);
    
    const cookie = response.get('Set-Cookie');

    return cookie;
};