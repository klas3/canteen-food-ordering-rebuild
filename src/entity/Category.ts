import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Dish } from "./Dish";

@Entity()
export class Category {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @OneToMany(type => Dish, dish => dish.categoty)
  dishes!: Dish[]

}
