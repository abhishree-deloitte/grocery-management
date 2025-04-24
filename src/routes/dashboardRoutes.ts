import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  getOrdersSummary,
  getShipmentStats,
  getBlogWidget,
} from '../controllers/dashboardController';

const router = Router();

router.get('/orders', authenticateJWT, getOrdersSummary);
router.get('/shipment', authenticateJWT, getShipmentStats);
router.get('/blogs', authenticateJWT, getBlogWidget);

export default router;
