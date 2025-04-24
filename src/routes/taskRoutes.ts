import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { createTask } from '../controllers/taskController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task creation for inventory or order placement
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task for the manager
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskType
 *               - assignee
 *               - priorityLevel
 *               - description
 *               - dueDate
 *               - location
 *             properties:
 *               taskType:
 *                 type: string
 *                 enum: [Order-Related, Stock-Related]
 *               assignee:
 *                 type: string
 *               priorityLevel:
 *                 type: string
 *                 enum: [Low, Medium, High, Critical]
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/tasks', authenticateJWT, createTask);

export default router;