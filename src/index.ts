import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import keysRouter from './routes/keys.js';
import proxyRouter from './routes/proxy.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use('/api/keys', keysRouter);
app.use('/api/proxy', proxyRouter);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
