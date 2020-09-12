import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@zab-dev-tickets/common';
import { createTicketRouter } from './routes/new-ticket';
import { showTicketRouter } from './routes/show-ticket';
import { indexTicketsRouter } from './routes/index-tickets';
import { updateTicketRouter } from './routes/update-ticket';

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketsRouter);
app.use(updateTicketRouter);

app.all('*', async() => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };