import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import Order from './Order';
import Dish from './Dish';

@Entity()
class OrderedDish {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @IsNotEmpty()
  @Column()
  dishCount!: number;

  @Column()
  orderId!: number;

  @IsNotEmpty()
  @Column()
  dishId!: string;

  @ManyToOne((type) => Order, (order) => order.orderedDishes)
  order!: Order;

  @ManyToOne((type) => Dish, (dish) => dish.orderedDishes)
  dish!: Dish;
}

export default OrderedDish;
