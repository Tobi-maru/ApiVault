import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import prisma from '../db.js';

const router = Router();

// This route allows a user to "use" their saved API key to make a simulated 
// request and automatically increments the usage counter in the vault.
router.post('/simulate/:id', requireAuth(), async (req: Request<{id: string}>, res: Response) => {
    try {
        const { userId } = getAuth(req);
        const keyId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 1. Fetch the user's stored API Key securely
        const apiKey = await prisma.apiKey.findUnique({
            where: { id: keyId }
        });

        // @ts-ignore - TS IDE cache sometimes lags behind prisma schema changes
        if (!apiKey || apiKey.userId !== userId) {
            return res.status(404).json({ error: 'API Key not found or access denied.' });
        }

        // 2. Check if usage limit is reached
        if (apiKey.usageLimit && apiKey.currentUsage >= apiKey.usageLimit) {
            return res.status(403).json({ error: 'Usage limit reached for this API key.' });
        }

        // --- SIMULATED EXTERNAL API REQUEST ---
        // In a real app, this is where you would do:
        // const externalRes = await fetch('https://api.openai.com/...', { 
        //     headers: { Authorization: `Bearer ${apiKey.key}` } 
        // });
        
        // Let's pretend the API cost between $0.01 and $2.50
        const simCost = parseFloat((Math.random() * 2.5 + 0.01).toFixed(2));
        
        // --- END SIMULATION ---

        // 3. Update the tracked usage in the database
        const newUsage = parseFloat((apiKey.currentUsage + simCost).toFixed(2));
        
        const updatedKey = await prisma.apiKey.update({
            where: { id: keyId },
            data: { currentUsage: newUsage }
        });

        // 4. Return success to the client
        res.json({
            success: true,
            simulatedCost: simCost,
            newTotalUsage: updatedKey.currentUsage,
            message: `Successfully proxied request to ${apiKey.service}.`
        });

    } catch (error) {
        console.error('Failed to simulate proxy request:', error);
        res.status(500).json({ error: 'Failed to process request.' });
    }
});

export default router;