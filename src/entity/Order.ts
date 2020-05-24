import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { OrderedDish } from './OrderedDish';
import { User } from './User';

@Entity()
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creationDate: Date;

  @Column()
  desiredDate: Date;

  @Column()
  wishes: string;

  @Column()
  totalSum: number;

  @Column()
  isPaid: boolean;

  @Column()
  isReady: boolean;

  @ManyToOne(type => User, user => user.orders)
  user: User

  @OneToMany(type => OrderedDish, orderedDish => orderedDish.order)
  orderedDishes: OrderedDish[]

}
