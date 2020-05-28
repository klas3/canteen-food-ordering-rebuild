import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from "typeorm";
import { DishHistory } from "./DishHistory";
import { OrderHistory } from "./OrderHistory";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OrderedDishHistory {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  dishCount!: number;

  @Column()
  dishHistoryId!: string;

  @Column()
  orderHistoryId!: string;

  @ManyToOne(type => DishHistory, dishHistory => dishHistory.orderedDishHistories)
  dishHistory!: DishHistory;

  @ManyToOne(type => OrderHistory, orderHistory => orderHistory.orderedDishHistories)
  orderHistory!: OrderHistory;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}
