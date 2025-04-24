import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { addStock } from '../controllers/inventoryController';

const router = Router();

router.post('/inventory', authenticateJWT, addStock);

export default router;
