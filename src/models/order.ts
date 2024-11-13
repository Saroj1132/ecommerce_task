import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user';
import { Product } from './product';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product_id: Product;

    @Column({ type: 'int'})
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;

    @CreateDateColumn()
    order_date: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
