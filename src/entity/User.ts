import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, ManyToOne, BaseEntity,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsNotEmpty } from 'class-validator';
import Order from './Order';
import Roles from '../auth/roles';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @IsNotEmpty()
  @Column()
  login!: string;

  @IsNotEmpty()
  @Column()
  password!: string;

  @IsNotEmpty()
  @Column()
  email!: string;

  @Column()
  pushToken?: string;

  @Column()
  resetCode?: string;

  @Column()
  lastResetCodeCreationTime?: Date;

  @OneToMany((type) => Order, (order) => order.user)
  orders!: Order[]

  @Column()
  role!: Roles;

  async changePassword(newPassword: string): Promise<void> {
    this.password = await bcrypt.hash(newPassword, 10);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  setResetCode(code: string | undefined): void {
    if (code) {
      this.lastResetCodeCreationTime = new Date();
    } else {
      this.lastResetCodeCreationTime = undefined;
    }
    this.resetCode = code;
  }

  isInRole(role: Roles) {
    return this.role === role;
  }
}

export default User;
