import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwr-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles';
import { ForRoles } from './auth/forRoles.decorator';
import { User } from './entity/User';

@Controller('auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() user: User) {
    return this.authService.login(user.login, user.password);
  }

  @ForRoles(Roles.Cash)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  get() {
    return 'Get action for customer!';
  }
}
