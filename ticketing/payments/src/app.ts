import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import {createChargeRouter} from "./routes/new";

import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@mcgittix/common";

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
    cookieSession({
        signed: false,
        /*secure: process.env.NODE_ENV !== 'test',*/
        secure: false,
    })
);

app.use(currentUser);

app.use(createChargeRouter);


app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };