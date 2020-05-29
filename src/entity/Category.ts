import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { Dish } from "./Dish";
import { v4 as uuidv4 } from 'uuid';
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

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}
