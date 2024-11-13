import { Router } from 'express';
import { getMyProfile } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.get('/user/profile', authenticateJWT, getMyProfile);

export default router;
