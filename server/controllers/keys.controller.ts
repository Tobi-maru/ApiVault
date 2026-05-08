import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import {
    getApiKeysByUser,
    createApiKey,
    updateApiKey,
    deleteApiKey,
} from '../services/keys.service.js';
import {
    parseCreateApiKeyInput,
    parseUpdateApiKeyInput,
    PayloadValidationError,
} from '../validators/api-key.validator.js';

export async function listKeys(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const keys = await getApiKeysByUser(userId);
        res.json(keys);
    } catch (error) {
        next(error);
    }
}

export async function createKey(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const data = parseCreateApiKeyInput(req.body);
        const newKey = await createApiKey(userId, data);
        res.status(201).json(newKey);
    } catch (error) {
        if (error instanceof PayloadValidationError) {
            res.status(400).json({ error: error.message });
            return;
        }
        next(error);
    }
}

export async function updateKey(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const data = parseUpdateApiKeyInput(req.body);
        const updatedKey = await updateApiKey(userId, req.params.id, data);
        res.json(updatedKey);
    } catch (error) {
        if (error instanceof PayloadValidationError) {
            res.status(400).json({ error: error.message });
            return;
        }
        if (error instanceof Error && error.message === 'Key not found') {
            res.status(404).json({ error: error.message });
            return;
        }
        next(error);
    }
}

export async function deleteKey(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await deleteApiKey(userId, req.params.id);
        res.json({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message === 'Key not found') {
            res.status(404).json({ error: error.message });
            return;
        }
        next(error);
    }
}
