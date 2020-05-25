import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, ManyToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Order } from "./Order";
import { Roles } from "../auth/roles";

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

  @Column()
  role!: Roles

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  isInRole(role: Roles) {
    return this.role === role;
  }

}
