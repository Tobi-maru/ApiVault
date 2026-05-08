import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { simulateProxyRequest } from '../services/proxy.service.js';

export async function simulateProxy(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const { userId } = getAuth(req);
        const keyId = req.params.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const result = await simulateProxyRequest(userId, keyId);
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'API Key not found or access denied.') {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error.message === 'Usage limit reached for this API key.') {
                res.status(403).json({ error: error.message });
                return;
            }
        }
        next(error);
    }
}
