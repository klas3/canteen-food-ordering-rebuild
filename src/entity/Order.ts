import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { OrderedDish } from './OrderedDish';
import { User } from './User';
import { IsNotEmpty } from "class-validator";
import { OrderHistory } from "./OrderHistory";

@Entity()
export class Order {

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  creationDate!: Date;

  @IsNotEmpty()
  @Column()
  desiredDate!: Date;

  @Column()
  wishes!: string;

  @Column('float')
  totalSum!: number;

  @Column()
  isPaid!: boolean;

  @Column()
  isReady!: boolean;

  @Column()
  userId!: string;

  @Column()
  orderHistoryId!: string;

  @OneToOne(type => OrderHistory)
  @JoinColumn()
  orderHistory!: OrderHistory;

  @ManyToOne(type => User, user => user.orders)
  user!: User;

  @IsNotEmpty()
  @OneToMany(type => OrderedDish, orderedDish => orderedDish.order)
  orderedDishes!: OrderedDish[];

  confirmPayment(): void {
    this.isPaid = true;
  }

  confirmReadyStatus(): void {
    this.isReady = true;
  }

}
