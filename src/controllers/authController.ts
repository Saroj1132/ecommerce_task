import { Request, Response } from 'express';
import { appDataSource } from '../appDataSource';
import { User } from '../models/user';
import { Role } from '../models/role';
import { registerSchema, loginSchema } from '../lib/userValidation';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../middlewares/authMiddleware';

appDataSource.initialize()
  .then(() => console.log('Data Source initialized'))
  .catch((error) => console.log('Error initializing Data Source:', error));
// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: 'Validation Error', details: error.details[0].message });
      return;
    }

    const { username, email, password, role_id } = req.body;

    const existingUser = await appDataSource.getRepository(User).findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const role = await appDataSource.getRepository(Role).findOne({ where: { id: role_id } });
    if (!role) {
      res.status(400).json({ message: 'Invalid role ID' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = appDataSource.getRepository(User).create({
      username,
      email,
      password: hashedPassword,
      role_id: role_id,
    });

    const savedUser = await appDataSource.getRepository(User).save(user);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login user and issue JWT token
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: 'Validation Error', details: error.details[0].message });
      return;
    }

    const { email, password } = req.body;

    const user = await appDataSource.getRepository(User).findOne({ where: { email }, relations: ['role_id'] });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ userId: user.id, role: user.role_id.name }, 'ecommerce_app2024', {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Logout user
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(400).json({ message: 'Token is missing' });
    return;
  }

  tokenBlacklist.push(token);
  res.status(200).json({ message: 'User logged out successfully' });
  return;
};
