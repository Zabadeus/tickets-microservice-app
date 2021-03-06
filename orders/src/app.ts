import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@zab-dev-tickets/common';
import { cancelOrderRouter } from './routes/cancel-order';
import { showOrderRouter } from './routes/show-order';
import { newOrderRouter } from './routes/new-order';
import { indexOrderRouter } from './routes/index-order';

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

app.use(cancelOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);

app.all('*', async() => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };