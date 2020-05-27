import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/roles';
import { ForRoles, Authorize } from '../auth/forRoles.decorator';
import { User } from '../entity/User';
import { OrderedDish } from '../entity/OrderedDish';
import { OrderedDishService } from '../orderedDish/ordered-dish.service';

@Controller('auth')
export class AppController {
  constructor(
    private authService: AuthService,
    private orderedDishService: OrderedDishService  
  ) {}

  @Post('test')
  async test(@Body() orderedDish: OrderedDish) {
    return 'Ok!';
  }

  @Post()
  async login(@Body() user: User) {
    return this.authService.login(user.login, user.password);
  }

  @Authorize()
  @ForRoles(Roles.Cash)
  @Get()
  get() {
    return 'Get action for customer!';
  }
}
