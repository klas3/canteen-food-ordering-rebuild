import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from "typeorm";
import { OrderedDish } from './OrderedDish';
import { User } from './User';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Order {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  creationDate!: Date;

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

  @Column()
  userId!: string;

  @ManyToOne(type => User, user => user.orders)
  user!: User;

  @OneToMany(type => OrderedDish, orderedDish => orderedDish.order)
  orderedDishes!: OrderedDish[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}
