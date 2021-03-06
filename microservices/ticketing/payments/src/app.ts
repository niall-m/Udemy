import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@nmgittickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // ingress-nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: process.env.NODE_ENV !== 'test' // enforce https unless in jest test env
  })
);
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };