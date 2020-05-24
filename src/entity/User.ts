import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./Order";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  pushToken: string;

  @Column()
  resetCode: string;
  
  @Column()
  lastResetCodeCreationTime: Date

  @OneToMany(type => Order, order => order.user)
  orders: Order[]

}
