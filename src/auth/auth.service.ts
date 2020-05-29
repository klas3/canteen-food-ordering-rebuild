import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/User';
import { Roles } from './roles';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly extraResetCodeMinutes: number = 5;
  private readonly msMinutes: number = 60000;
  private readonly resetCodeLength: number = 8;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(user: User, role: Roles): Promise<void> {
    if (!await this.userService.isLoginUnique(user.login)) {
      throw new BadRequestException(`Логін ${user.login} вже зайнятий`);
    }
    if (!await this.userService.isEmailUnique(user.email)) {
      throw new BadRequestException('Ця пошта вже зареєстрована');
    }
    user.role = role;
    user.password = await bcrypt.hash(user.password, 10);
    await this.userService.create(user);
  }

  async login(login: string, password: string): Promise<string> {
    const user = await this.userService.getByLogin(login);
    if (!user || !await user.comparePassword(password)) {
      throw new UnauthorizedException('Неправильний логін або пароль');
    }
    const payload = { 
      id: user.id,
      login: user.login,
      password: user.password,
    };
    return this.jwtService.sign(payload);
  }

  async changePassword(user: User, oldPassword: string, newPassword: string): Promise<void> {
    if (!await user.comparePassword(oldPassword)) {
      throw new UnauthorizedException('Неправильний старий пароль');
    }
    await user.changePassword(newPassword);
    await this.userService.update(user);
  }

  async requestResetPassword(email: string): Promise<void> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    const resetCode = this.generateResetCode();
    user.setResetCode(resetCode);
    await this.userService.update(user);
    await this.emailService.sendEmailAsync(email, 'Відновлення паролю', user.login, resetCode);
  }

  async verifyResetCode(email: string, resetCode: string): Promise<void> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    if(user.resetCode !== resetCode) {
      throw new ForbiddenException('Ви ввели невірний код');
    }
    if (user.lastResetCodeCreationTime
      && new Date(user.lastResetCodeCreationTime.getTime() + this.extraResetCodeMinutes * this.msMinutes).getTime()
      < new Date().getTime()) {
      await this.userService.clearResetCode(user.id);
      throw new ForbiddenException('Ваш код вже недійсний');
    }
  }

  async resetPassword(newPassword: string, email: string, resetCode: string): Promise<void> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    if(user.resetCode !== resetCode) {
      throw new ForbiddenException('Ви ввели невірний код');
    }
    await user.changePassword(newPassword);
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
