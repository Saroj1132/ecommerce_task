import { Request, Response } from 'express';
import { appDataSource } from '../appDataSource';
import { Product } from '../models/product';
import { productValidationSchema } from '../lib/productValidator';


appDataSource.initialize()
  .then(() => console.log('Data Source initialized'))
  .catch((error) => console.log('Error initializing Data Source:', error));

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { error } = productValidationSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: 'Validation error', details: error.details[0].message });
    return;
  }

  const { name, description, price, stock } = req.body;

  try {

    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      res.status(403).json({ message: 'You must be an admin to create products' });
      return;
    }

    const productRepository = appDataSource.getRepository(Product);
    const existingProduct = await productRepository.findOne({ where: { name } });
    if (existingProduct) {
      res.status(400).json({ message: 'Product with this name already exists' });
      return;
    }

    // Create a new product
    const newProduct = new Product();
    newProduct.name = name;
    newProduct.description = description || '';
    newProduct.price = price;
    newProduct.stock = stock || 0;

    await productRepository.save(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error });
  }
};


// Show All Products (accessible by both admin and regular users)
export const showAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const productRepository = appDataSource.getRepository(Product);
    const products = await productRepository.find();
    if (products.length > 0) {
      res.status(200).json(products);
      return;
    }

    res.status(400).json({ message: 'products not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};