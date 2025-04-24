import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  getOrdersSummary,
  getShipmentStats,
  getBlogWidget,
} from '../controllers/dashboardController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Overview endpoints for dashboard cards and widgets
 */

/**
 * @swagger
 * /dashboard/orders:
 *   get:
 *     summary: Get active and inactive order counts
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, last3months, last6months]
 *     responses:
 *       200:
 *         description: Returns active and inactive order summary
 */
router.get('/orders', authenticateJWT, getOrdersSummary);

/**
 * @swagger
 * /dashboard/shipment:
 *   get:
 *     summary: Get shipment status breakdown
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shipment statistics returned
 */
router.get('/shipment', authenticateJWT, getShipmentStats);

/**
 * @swagger
 * /dashboard/blogs:
 *   get:
 *     summary: Get latest 2 food safety blog entries for widget
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns latest blogs (title, image, description)
 */
router.get('/blogs', authenticateJWT, getBlogWidget);

export default router;
