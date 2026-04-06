import 'dotenv/config';

import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import express from 'express';

import keysRouter from './routes/keys.js';
import proxyRouter from './routes/proxy.js';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
    }),
);
app.use(express.json());
app.use(clerkMiddleware());

app.use('/api/keys', keysRouter);
app.use('/api/proxy', proxyRouter);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
