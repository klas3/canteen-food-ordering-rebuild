import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderedDishHistory } from "./OrderedDishHistory";

@Entity()
export class DishHistory {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('float')
  cost!: number;

  @Column()
  description!: string;

  @Column()
  creationDate!: Date;

  @OneToMany(type => OrderedDishHistory, orderedDishHistory => orderedDishHistory.dishHistory)
  orderedDishHistories!: OrderedDishHistory[];

}
