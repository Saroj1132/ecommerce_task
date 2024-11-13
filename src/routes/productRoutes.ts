import { Router } from 'express';
import { createProduct, showAllProducts } from '../controllers/productController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/product/createProduct', authenticateJWT, createProduct);
router.get('/product/productList', authenticateJWT, showAllProducts);

export default router;
