import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BeforeInsert } from "typeorm";
import { Category } from './Category';
import { OrderedDish } from "./OrderedDish";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Dish {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  cost!: number;

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
