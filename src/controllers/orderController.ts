import { Request, Response } from 'express';
import { appDataSource } from '../appDataSource';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { orderValidationSchema } from '../lib/orderValidator';


appDataSource.initialize()
  .then(() => console.log('Data Source initialized'))
  .catch((error) => console.log('Error initializing Data Source:', error));

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { error } = orderValidationSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: 'Validation error', details: error.details[0].message });
    return;
  }

  const { product_id, quantity, total_price } = req.body;
  const user_id = req.user?.userId;
  try {
    const productRepository = appDataSource.getRepository(Product);
    const product = await productRepository.findOne({ where: { id: product_id } });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const calculatedTotalPrice = quantity * product.price;
    console.log(calculatedTotalPrice)
    if (calculatedTotalPrice != total_price) {
      res.status(400).json({ message: 'Total price mismatch' });
      return;
    }
    const orderRepository = appDataSource.getRepository(Order);
    const newOrder = new Order();
    newOrder.user_id = user_id;
    newOrder.product_id = product_id;
    newOrder.quantity = quantity;
    newOrder.total_price = calculatedTotalPrice;

    await orderRepository.save(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error });
  }
};


// Show All User Order
export const showUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.user?.userId;
    const orderRepository = appDataSource.getRepository(Order);
    const orders = await orderRepository.find({
      where: { user_id: { id: user_id } },
      relations: ['product_id'],
      select: ['id', 'quantity', 'total_price', 'order_date', 'updated_at', 'user_id', 'product_id']
    });
    if (orders.length > 0) {
      res.status(200).json(orders);
      return;
    }
    res.status(400).json({ message: 'orders not found' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching products', error });
  }
};