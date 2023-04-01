import express from 'express';
import connectDatabase from './database.mjs';
import connectRouter from '../routes/index.mjs';
import { connectMiddlewares } from '../middlewares/index.mjs';

var server = express()

await connectDatabase()

server = connectMiddlewares(server)

server = connectRouter(server)

export default server;