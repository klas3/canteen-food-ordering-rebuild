import { Controller, Post, Body, BadRequestException, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { User } from '../entity/User';
import { AuthService } from './auth.service';
import { Roles } from './roles';
import { Authorize, GetUser, ForRoles } from './auth.decorators';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body('login') login: string, 
    @Body('password') password: string,
    @Body('pushToken') pushToken: string,
  ): Promise<{ authToken: string }> {
    if (!login || !password) {
      throw new BadRequestException();
    }
    const user = await this.userService.getByLogin(login);
    if (!user || !await user.comparePassword(password)) {
      throw new UnauthorizedException('Неправильний логін або пароль');
    }
    await this.userService.setPushToken(pushToken, user.id);
    return { authToken: await this.authService.login(user) };
  }

  @Post('register')
  async register(@Body() user: User): Promise<void> {
    await this.ensureCreateAdmin();
    await this.verifyRegistration(user);
    user.role = Roles.Customer;
    return await this.authService.register(user);
  }

  @Post('registerWorker')
  @Authorize()
  @ForRoles(Roles.Admin)
  async registerWorker(@Body() user: User): Promise<void> {
    if (!user.role || user.role === Roles.Admin) {
      throw new BadRequestException();
    }
    await this.verifyRegistration(user);
    return await this.authService.register(user);
  }

  @Authorize()
  @Post('changePassword')
  async changePassword(
    @GetUser() user: User,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string
  ): Promise<void> {
    if(!oldPassword || !newPassword) {
      throw new BadRequestException();
    }
    if (!await user.comparePassword(oldPassword)) {
      throw new UnauthorizedException('Неправильний старий пароль');
    }
    return await this.authService.changePassword(user, newPassword);
  }

  @Post('requestResetPassword')
  async requestResetPassword(@Body('email') email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException();
    }
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.authService.requestResetPassword(user);
  }

  @Post('verifyResetCode')
  async verifyResetCode(
    @Body('email') email: string,
    @Body('code') code: string
  ): Promise<void> {
    if (!email || !code) {
      throw new BadRequestException();
    }
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    if(user.resetCode !== code) {
      throw new ForbiddenException('Ви ввели невірний код');
    }
    if (user.lastResetCodeCreationTime
      && new Date(user.lastResetCodeCreationTime.getTime() 
      + this.authService.extraResetCodeMinutes * this.authService.msMinutes).getTime()
      < new Date().getTime()) {
      await this.userService.clearResetCode(user.id);
      throw new ForbiddenException('Ваш код вже недійсний');
    }
    return;
  }

  @Post('resetPassword')
  async resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string
  ): Promise<void> {
    if (!email || !code || !newPassword) {
      throw new BadRequestException();
    }
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.resetCode !== code) {
      throw new ForbiddenException('Ви ввели невірний код');
    }
    return await this.authService.resetPassword(newPassword, user);
  }

  private async verifyRegistration(user: User): Promise<void> {
    if (!await this.userService.isLoginUnique(user.login)) {
      throw new BadRequestException(`Логін ${user.login} вже зайнятий`);
    }
    if (!await this.userService.isEmailUnique(user.email)) {
      throw new BadRequestException('Ця пошта вже зареєстрована');
    }
  }

  private async ensureCreateAdmin(): Promise<void> {
    if (await this.userService.isAdminExist()) {
      return;
    }
    if (!process.env.ADMIN_LOGIN || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_EMAIL) {
      return;
    }
    const admin = new User();
    admin.role = Roles.Admin;
    admin.login = process.env.ADMIN_LOGIN;
    admin.password = process.env.ADMIN_PASSWORD;
    admin.email = process.env.ADMIN_EMAIL;
    return await this.authService.register(admin);
  }
}
