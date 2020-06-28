import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import Dish from './Dish';

@Entity()
class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @IsNotEmpty()
  @Column()
  name!: string;

  @OneToMany((type) => Dish, (dish) => dish.category)
  dishes!: Dish[];
}

export default Category;
