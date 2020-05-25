import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Order } from "./Order";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  login!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @Column()
  pushToken!: string;

  @Column()
  resetCode!: string;
  
  @Column()
  lastResetCodeCreationTime!: Date

  @OneToMany(type => Order, order => order.user)
  orders!: Order[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

}
