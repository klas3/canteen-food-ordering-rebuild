import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from "typeorm";
import { Order } from "./Order";
import { Dish } from "./Dish";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class OrderedDish {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  dishCount!: number;

  @Column()
  orderId!: string;

  @Column()
  dishId!: string;

  @ManyToOne(type => Order, order => order.orderedDishes)
  order!: Order;

  @ManyToOne(type => Dish, dish => dish.orderedDishes)
  dish!: Dish;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}
