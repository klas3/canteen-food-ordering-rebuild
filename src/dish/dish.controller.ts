import { Controller, Post, Body, BadRequestException, Get } from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from '../entity/Dish';
import { Authorize, ForRoles } from '../auth/auth.decorators';
import { Roles } from '../auth/roles';

@Authorize()
@Controller('dish')
export class DishController {
  private readonly maxImageSize: number = 400 * 1024;

  constructor(private dishService: DishService) {}

  @ForRoles(Roles.Cook)
  @Post('create')
  async create(@Body() dish: Dish): Promise<void> {
    if (!this.dishService.verifyImageSize(dish.photo, this.maxImageSize)) {
      throw new BadRequestException('Розмір картинки завелекий. Максимально допустимий розмір: 400 КБ');
    }
    return await this.dishService.create(dish);
  }

  @ForRoles(Roles.Cook)
  @Post('update')
  async update(@Body() dish: Dish): Promise<void> {
    if (!this.dishService.verifyImageSize(dish.photo, this.maxImageSize)) {
      throw new BadRequestException('Розмір картинки завелекий. Максимально допустимий розмір: 400 КБ');
    }
    return await this.dishService.update(dish);
  }

  @ForRoles(Roles.Cook)
  @Post('delete')
  async delete(@Body('id') id: string): Promise<void> {
    return await this.dishService.delete(id);
  }

  @Get('getAll')
  async getAll(): Promise<Dish[]> {
    return await this.dishService.getAll();
  }
}
