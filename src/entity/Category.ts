import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Dish } from "./Dish";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Category {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @IsNotEmpty()
  @Column()
  name!: string;

  @OneToMany(type => Dish, dish => dish.categoty)
  dishes!: Dish[];

}
