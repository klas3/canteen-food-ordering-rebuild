import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { OrderedDishHistory } from "./OrderedDishHistory";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OrderHistory {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  completionDate!: Date;

  @OneToMany(type => OrderedDishHistory, orderedDishHistory => orderedDishHistory.orderHistory)
  orderedDishHistories!: OrderedDishHistory[]

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}
