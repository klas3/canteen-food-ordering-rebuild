import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinTable,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import Category from './Category';
import OrderedDish from './OrderedDish';
import DishHistory from './DishHistory';

@Entity()
class Dish {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @IsNotEmpty()
  @Column()
  name!: string;

  @IsNotEmpty()
  @Column('float')
  cost!: number;

  @Column()
  description!: string;

  @Column({ type: 'mediumblob' })
  photo!: Buffer;

  @Column()
  imageMimeType!: string;

  @Column()
  dishHistoryId!: string;

  @OneToOne((type) => DishHistory)
  @JoinTable()
  dishHistory!: DishHistory;

  @IsNotEmpty()
  @Column()
  categoryId!: string;

  @ManyToOne((type) => Category, (category) => category.dishes)
  category!: Category;

  @OneToMany((type) => OrderedDish, (orderedDish) => orderedDish.dish)
  orderedDishes!: OrderedDish[];
}

export default Dish;
