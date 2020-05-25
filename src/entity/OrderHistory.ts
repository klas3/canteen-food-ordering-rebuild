import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { OrderedDishHistory } from "./OrderedDishHistory";

@Entity()
export class OrderHistory {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  completionDate!: Date;

  @OneToMany(type => OrderedDishHistory, orderedDishHistory => orderedDishHistory.orderHistory)
  orderedDishHistories!: OrderedDishHistory[]

}
