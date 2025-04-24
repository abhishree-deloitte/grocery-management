import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  addStock,
  getStockDetails,
  getInventorySummary,
  getOrderGraph,
  getNewStock,
} from "../controllers/inventoryController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Stock management and inventory insights
 */

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Add new stock to inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - price
 *               - sellingPrice
 *               - dateAdded
 *               - status
 *               - cashier
 *               - consumerName
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               sellingPrice:
 *                 type: number
 *               dateAdded:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *               cashier:
 *                 type: string
 *               consumerName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Stock added successfully
 */
router.post("/inventory", authenticateJWT, addStock);

/**
 * @swagger
 * /stockDetails:
 *   get:
 *     summary: Get paginated stock records with filters
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by stock status (e.g., Available, Low)
 *     responses:
 *       200:
 *         description: Stock data fetched successfully
 */
router.get("/stockDetails", authenticateJWT, getStockDetails);

/**
 * @swagger
 * /inventory/summary:
 *   get:
 *     summary: Get total, low, and out-of-stock summaries
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory summary returned
 */
router.get("/inventory/summary", authenticateJWT, getInventorySummary);

/**
 * @swagger
 * /inventory/orders:
 *   get:
 *     summary: Get order breakdown by date (for charts)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: view
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *         description: "Time range view (default: daily)"
 *     responses:
 *       200:
 *         description: Order trend data returned
 */
router.get("/inventory/orders", authenticateJWT, getOrderGraph);

/**
 * @swagger
 * /inventory/newStock:
 *   get:
 *     summary: Get recently added stock items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest added stock entries returned
 */
router.get("/inventory/newStock", authenticateJWT, getNewStock);

export default router;
