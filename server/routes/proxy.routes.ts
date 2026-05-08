import { Router } from 'express';
import { requireAuth } from '@clerk/express';
import { simulateProxy } from '../controllers/proxy.controller.js';

const router = Router();

router.post('/simulate/:id', requireAuth(), simulateProxy);

export default router;
