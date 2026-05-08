import { Router } from 'express';
import { requireAuth } from '@clerk/express';
import { listKeys, createKey, updateKey, deleteKey } from '../controllers/keys.controller.js';

const router = Router();

router.use(requireAuth());

router.get('/', listKeys);
router.post('/', createKey);
router.put('/:id', updateKey);
router.delete('/:id', deleteKey);

export default router;
