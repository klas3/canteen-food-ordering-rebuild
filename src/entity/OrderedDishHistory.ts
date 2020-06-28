import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import DishHistory from './DishHistory';
import OrderHistory from './OrderHistory';

@Entity()
class OrderedDishHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  dishCount!: number;

  @Column()
  dishHistoryId!: string;

  @Column()
  orderHistoryId!: string;

  @ManyToOne((type) => DishHistory, (dishHistory) => dishHistory.orderedDishHistories)
  dishHistory!: DishHistory;

  @ManyToOne((type) => OrderHistory, (orderHistory) => orderHistory.orderedDishHistories)
  orderHistory!: OrderHistory;
}

export default OrderedDishHistory;
