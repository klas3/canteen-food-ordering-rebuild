import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { User } from '../entity/User';
import { AuthService } from './auth.service';
import { Roles } from './roles';
import { Authorize, GetUser } from './auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('login') login: string, 
    @Body('password') password: string
  ) {
    if (!login || !password) {
      throw new BadRequestException();
    }
    return await this.authService.login(login, password);
  }

  @Post('register')
  async register(@Body() user: User): Promise<void> {
    return await this.authService.register(user, Roles.Customer);
  }

  @Post('registerWorker')
  async registerWorker(@Body() user: User): Promise<void> {
    if (!user.role || user.role === Roles.Admin) {
      throw new BadRequestException();
    }
    return await this.authService.register(user, user.role);
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
    return await this.authService.changePassword(user, oldPassword, newPassword);
  }

  @Post('requestResetPassword')
  async requestResetPassword(@Body('email') email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException();
    }
    return await this.authService.requestResetPassword(email);
  }

  @Post('verifyResetCode')
  async verifyResetCode(
    @Body('email') email: string,
    @Body('code') code: string
  ): Promise<void> {
    if (!email || !code) {
      throw new BadRequestException();
    }
    return await this.authService.verifyResetCode(email, code);
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
    return await this.authService.resetPassword(newPassword, email, code);
  }
}
