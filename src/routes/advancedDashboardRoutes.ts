import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  getOrdersByDate,
  getStockBySupplier,
  getCriticalAlerts,
  getRestockTrends,
  getInventoryFinancials
} from '../controllers/advancedDashboardController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AdvancedDashboard
 *   description: In-depth dashboard analytics and business insights
 */

/**
 * @swagger
 * /dashboard/insights/orders-by-date:
 *   get:
 *     summary: Get number of orders grouped by date
 *     tags: [AdvancedDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders grouped by date returned
 */
router.get('/dashboard/insights/orders-by-date', authenticateJWT, getOrdersByDate);

/**
 * @swagger
 * /dashboard/insights/stock-by-supplier:
 *   get:
 *     summary: Get total stock grouped by supplier
 *     tags: [AdvancedDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock grouped by supplier returned
 */
router.get('/dashboard/insights/stock-by-supplier', authenticateJWT, getStockBySupplier);

/**
 * @swagger
 * /dashboard/alerts:
 *   get:
 *     summary: Get critical alerts like low stock or delayed shipments
 *     tags: [AdvancedDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alert data returned
 */
router.get('/dashboard/alerts', authenticateJWT, getCriticalAlerts);

/**
 * @swagger
 * /dashboard/trends/restocks:
 *   get:
 *     summary: Get top restocked products based on frequency
 *     tags: [AdvancedDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restock trend data returned
 */
router.get('/dashboard/trends/restocks', authenticateJWT, getRestockTrends);

/**
 * @swagger
 * /dashboard/financials:
 *   get:
 *     summary: Get total inventory cost, revenue, and margin
 *     tags: [AdvancedDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory financial overview returned
 */
router.get('/dashboard/financials', authenticateJWT, getInventoryFinancials);

export default router;