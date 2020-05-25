import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderedDishHistory } from "./OrderedDishHistory";

@Entity()
export class DishHistory {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  cost!: number;

  @Column()
  description!: string;

  @OneToMany(type => OrderedDishHistory, orderedDishHistory => orderedDishHistory.dishHistory)
  orderedDishHistories!: OrderedDishHistory[]

}
