import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from "typeorm";
import { OrderedDish } from './OrderedDish';
import { User } from './User';
import { IsNotEmpty } from "class-validator";

@Entity()
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  creationDate!: Date;

  @IsNotEmpty()
  @Column()
  desiredDate!: Date;

  @Column()
  wishes!: string;

  @Column()
  totalSum!: number;

  @Column()
  isPaid!: boolean;

  @Column()
  isReady!: boolean;

  @IsNotEmpty()
  @Column()
  userId!: string;

  @ManyToOne(type => User, user => user.orders)
  user!: User;

  @IsNotEmpty()
  @OneToMany(type => OrderedDish, orderedDish => orderedDish.order)
  orderedDishes!: OrderedDish[];

}
