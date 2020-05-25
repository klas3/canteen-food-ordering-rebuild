import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from './Category';
import { OrderedDish } from "./OrderedDish";

@Entity()
export class Dish {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  cost!: number;

  @Column()
  description!: number;

  @Column()
  photo!: string;

  @Column()
  imageMimeType!: string;

  @ManyToOne(type => Category, category => category.dishes)
  categoty!: Category

  @OneToMany(type => OrderedDish, orderedDish => orderedDish.dish)
  orderedDishes!: OrderedDish[]

}
