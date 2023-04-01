import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'express-compression';
import { apiRateLimiter } from './rateLimiter.mjs';
import auth from './auth.mjs';
import sessionStore from '../services/session/sessionStore.mjs';
import validator from './validator.mjs';

function defaultMiddlewares(server) {
    server.use([
        apiRateLimiter,
        cors({
            origin: process.env.NODE_ENV === 'development' ?? '',
            preflightContinue: true,
        }),
        helmet(),
        express.json({
            limit: '100kb'
        }),
        sessionStore(),
        compression(),
    ])

    return server
}

function connectMiddlewares(server) {
    server = defaultMiddlewares(server)

    return server
}

export {
    connectMiddlewares,
    auth,
    validator,
}