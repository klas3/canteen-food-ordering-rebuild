import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Dish } from "./Dish";
import { IsNotEmpty, ValidateNested } from "class-validator";

@Entity()
export class OrderedDish {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ValidateNested()
  @IsNotEmpty()
  @Column()
  dishCount!: number;

  @Column()
  orderId!: string;

  @IsNotEmpty()
  @Column()
  dishId!: string;

  @ManyToOne(type => Order, order => order.orderedDishes)
  order!: Order;

  @ManyToOne(type => Dish, dish => dish.orderedDishes)
  dish!: Dish;

}
