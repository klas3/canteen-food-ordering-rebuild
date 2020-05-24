import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Dish } from "./Dish";

@Entity()
export class OrderedDish {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dishCount: number;

  @ManyToOne(type => Order, order => order.orderedDishes)
  order: Order

  @ManyToOne(type => Dish, dish => dish.orderedDishes)
  dish: Dish

}
