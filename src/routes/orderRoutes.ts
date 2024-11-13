import { Router } from 'express';
import {
    createOrder,
    showUserOrders
} from '../controllers/orderController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/order/createOrder', authenticateJWT, createOrder);
router.get('/order/getAllOrder', authenticateJWT, showUserOrders);

export default router;
