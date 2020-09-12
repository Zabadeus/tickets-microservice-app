import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const createIdSignin = () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    
    return id;
}

export const createCookieSignin = () => {
    // Build a JWT payload { id, email }
    const payload = {
        id: createIdSignin(),
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session into JSON
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
};
