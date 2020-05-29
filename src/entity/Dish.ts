import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BeforeInsert } from "typeorm";
import { Category } from './Category';
import { OrderedDish } from "./OrderedDish";
import { v4 as uuidv4 } from 'uuid';
import { IsNotEmpty } from "class-validator";

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

  @IsNotEmpty()
  @Column()
  description!: string;

  @Column()
  photo!: string;

  @Column()
  imageMimeType!: string;

  @Column()
  categoryId!: string;

  @ManyToOne(type => Category, category => category.dishes)
  categoty!: Category;

  @OneToMany(type => OrderedDish, orderedDish => orderedDish.dish)
  orderedDishes!: OrderedDish[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}
