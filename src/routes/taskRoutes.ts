import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { createTask } from '../controllers/taskController';

const router = Router();

router.post('/tasks', authenticateJWT, createTask);

export default router;
