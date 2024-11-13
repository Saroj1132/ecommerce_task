import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Role } from './models/role';
import { User } from './models/user';
import { Product } from './models/product';
import { Order } from './models/order';

export const appDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'rootuser',
  database: 'ecommerce_db',
  entities: [Role, User, Product, Order],
  synchronize: false,
  logging: true,
});
