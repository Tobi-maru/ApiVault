import 'dotenv/config';

import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import express from 'express';

import { config } from './config/env.js';
import keysRouter from './routes/keys.routes.js';
import proxyRouter from './routes/proxy.routes.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

const allowedOrigins = config.corsOrigin
    ? config.corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];

app.use(
    cors({
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    }),
);
app.use(express.json());
app.use(clerkMiddleware());

app.use('/api/keys', keysRouter);
app.use('/api/proxy', proxyRouter);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
