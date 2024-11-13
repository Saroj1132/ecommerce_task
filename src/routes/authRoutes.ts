import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController';

const router = Router();

// Register route
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/logout', logoutUser);

export default router;
