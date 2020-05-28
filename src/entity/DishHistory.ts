import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { OrderedDishHistory } from "./OrderedDishHistory";
import { v4 as uuidv4 } from 'uuid';

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

  @Column()
  creationDate!: Date;

  @OneToMany(type => OrderedDishHistory, orderedDishHistory => orderedDishHistory.dishHistory)
  orderedDishHistories!: OrderedDishHistory[];

  @BeforeInsert()
  handleInsertion() {
    this.id = uuidv4();
    this.creationDate = new Date();
  }

}
