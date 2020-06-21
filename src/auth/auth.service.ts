import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/User';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  public readonly extraResetCodeMinutes: number = 5;
  public readonly msMinutes: number = 60000;

  private readonly resetCodeLength: number = 8;
  private readonly hashRounds: number = 10;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(user: User): Promise<void> {
    user.password = await bcrypt.hash(user.password, this.hashRounds);
    await this.userService.create(user);
  }

  async login(user: User): Promise<string> {
    const payload = { 
      id: user.id,
      login: user.login,
      password: user.password,
    };
    return this.jwtService.sign(payload);
  }

  async changePassword(user: User, newPassword: string): Promise<void> {
    await user.changePassword(newPassword);
    await this.userService.update(user);
  }

  async requestResetPassword(user: User): Promise<void> {
    const resetCode = this.generateResetCode();
    user.setResetCode(resetCode);
    await this.userService.update(user);
    await this.emailService.sendEmailAsync(user.email, 'Відновлення паролю', user.login, resetCode);
  }

  async resetPassword(newPassword: string, user: User): Promise<void> {
    await user.changePassword(newPassword);
    user.setResetCode(undefined);
    await this.userService.update(user);
  }

  private generateResetCode(): string {
    const result: string[] = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < this.resetCodeLength; i++) {
      result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }
    return result.join('');
  }
}
