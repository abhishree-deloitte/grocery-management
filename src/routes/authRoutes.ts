import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { signout } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/signin', login);
router.post('/signout', signout);

export default router;
