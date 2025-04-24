import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getShipmentDetails } from '../controllers/shipmentController';

const router = Router();

router.get('/shipmentDetails', authenticateJWT, getShipmentDetails);

export default router;
