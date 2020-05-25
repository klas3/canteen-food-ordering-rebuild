import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { DishHistory } from "./DishHistory";
import { OrderHistory } from "./OrderHistory";

@Entity()
export class OrderedDishHistory {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  completionDate!: Date;

  @ManyToOne(type => DishHistory, dishHistory => dishHistory.orderedDishHistories)
  dishHistory!: DishHistory

  @ManyToOne(type => OrderHistory, orderHistory => orderHistory.orderedDishHistories)
  orderHistory!: OrderHistory

}
