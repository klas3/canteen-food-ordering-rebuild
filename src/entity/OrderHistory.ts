import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import OrderedDishHistory from './OrderedDishHistory';

@Entity()
class OrderHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  completionDate!: Date;

  @OneToMany((type) => OrderedDishHistory, (orderedDishHistory) => orderedDishHistory.orderHistory)
  orderedDishHistories!: OrderedDishHistory[];
}

export default OrderHistory;
