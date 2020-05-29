import { Controller, Post, Body, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../entity/Order';
import { GetUser, Authorize } from '../auth/auth.decorators';
import { User } from '../entity/User';

@Authorize()
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create')
  async create(@Body() order: Order): Promise<void> {
    for (const orderedDish of order.orderedDishes) {
      if (!orderedDish.dishId || !orderedDish.dishCount) {
        throw new BadRequestException();
      }
    }
    return await this.orderService.create(order);
  }

  @Post('delete')
  async update(
    @GetUser() user: User,
    @Body('id') id: string,
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException();
    }
    if ((await this.orderService.getById(id))?.userId !== user.id) {
      throw new ForbiddenException();
    }
    return await this.orderService.delete(id);
  }


}
