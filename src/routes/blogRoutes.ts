import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getAllBlogs, getBlogById } from '../controllers/blogController';

const router = Router();

router.get('/blogs/all', authenticateJWT, getAllBlogs);
router.get('/blog/:id', authenticateJWT, getBlogById);

export default router;
