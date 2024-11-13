import express from 'express';
import roleRoutes from './routes/roleRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import { appDataSource } from './appDataSource';

const app = express();
const PORT = 3000;

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>
    }
  }
}

app.use(express.json());
app.use('/api', roleRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

appDataSource.initialize()
  .then(() => {
    console.log('Data Source initialized');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log('Error initializing Data Source:', error));
