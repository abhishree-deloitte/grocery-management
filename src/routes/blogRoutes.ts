import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getAllBlogs, getBlogById } from '../controllers/blogController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Food safety blog and knowledge center
 */

/**
 * @swagger
 * /blogs/all:
 *   get:
 *     summary: Get paginated list of all blogs ordered by year
 *     tags: [Blogs]
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
 *         description: "Number of blogs per page (default: 10)"
 *     responses:
 *       200:
 *         description: Returns list of blogs
 */
router.get('/blogs/all', authenticateJWT, getAllBlogs);

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get a single blog post by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog post details
 *       404:
 *         description: Blog not found
 */
router.get('/blog/:id', authenticateJWT, getBlogById);

export default router;