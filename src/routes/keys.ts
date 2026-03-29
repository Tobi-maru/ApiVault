import { Router, Request, Response } from 'express';
import prisma from '../db.js';

const router = Router();

// GET /api/keys
router.get('/', async (req: Request, res: Response) => {
    try {
        const keys = await prisma.apiKey.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(keys);
    } catch (error) {
        console.error('Failed to fetch keys:', error);
        res.status(500).json({ error: 'Failed to fetch keys' });
    }
});

// POST /api/keys
router.post('/', async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newKey = await prisma.apiKey.create({
            data: {
                service: data.service,
                projectName: data.projectName,
                modelName: data.modelName || null,
                key: data.key,
                usageLimit: data.usageLimit || null,
                currentUsage: 0,
            },
        });
        res.status(201).json(newKey);
    } catch (error) {
        console.error('Failed to create key:', error);
        res.status(500).json({ error: 'Failed to create key' });
    }
});

// PUT /api/keys/:id
router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const data = req.body;
        const updatedKey = await prisma.apiKey.update({
            where: { id: req.params.id },
            data,
        });
        res.json(updatedKey);
    } catch (error) {
        console.error('Failed to update key:', error);
        res.status(500).json({ error: 'Failed to update key' });
    }
});

// DELETE /api/keys/:id
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        await prisma.apiKey.delete({
            where: { id: req.params.id },
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to delete key:', error);
        res.status(500).json({ error: 'Failed to delete key' });
    }
});

export default router;
