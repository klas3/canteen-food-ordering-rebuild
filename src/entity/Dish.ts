import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinTable } from "typeorm";
import { Category } from './Category';
import { OrderedDish } from "./OrderedDish";
import { IsNotEmpty } from "class-validator";
import { DishHistory } from "./DishHistory";

@Entity()
export class Dish {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @IsNotEmpty()
  @Column()
  name!: string;

  @IsNotEmpty()
  @Column()
  cost!: number;

  @Column()
  description!: string;

  @Column()
  photo!: string;

  @Column()
  imageMimeType!: string;

  @Column()
  dishHistoryId!: string;

  @OneToOne(type => DishHistory)
  @JoinTable()
  dishHistory!: DishHistory;

  @IsNotEmpty()
  @Column()
  categoryId!: string;

  @ManyToOne(type => Category, category => category.dishes)
  category!: Category;

  @OneToMany(type => OrderedDish, orderedDish => orderedDish.dish)
  orderedDishes!: OrderedDish[];

}
