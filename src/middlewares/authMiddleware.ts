import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Secret key to verify JWT token
const JWT_SECRET = 'ecommerce_app2024';

export interface JwtPayload {
  userId: number;
  role: number;
}

//for store invalid token
export const tokenBlacklist: string[] = [];

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Authorization token is required' });
    return;
  }

  if (tokenBlacklist.includes(token)) {
    res.status(403).json({ message: 'Token has been invalidated' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    res.status(403).json({ message: 'unauthorize user' });
  }
};
