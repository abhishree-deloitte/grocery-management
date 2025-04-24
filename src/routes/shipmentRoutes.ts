import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getShipmentDetails } from '../controllers/shipmentController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Shipment
 *   description: Shipment tracking and details
 */

/**
 * @swagger
 * /shipmentDetails:
 *   get:
 *     summary: Get paginated shipment details with filters
 *     tags: [Shipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Number of items per page (default: 10)"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: "Filter shipments by status (e.g., Completed, In-Transit)"
 *     responses:
 *       200:
 *         description: Returns shipment details
 */

router.get('/shipmentDetails', authenticateJWT, getShipmentDetails);

export default router;