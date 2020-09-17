import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@zab-dev-tickets/common';
import { CreateChargeRouter } from './routes/new-payment';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUser);

app.use(CreateChargeRouter);


app.all('*', async() => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };