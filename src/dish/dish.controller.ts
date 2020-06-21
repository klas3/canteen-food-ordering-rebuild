import { Controller, Post, Body, BadRequestException, Get, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from '../entity/Dish';
import { Authorize, ForRoles } from '../auth/auth.decorators';
import { Roles } from '../auth/roles';
import { ArchiveService } from '../archive/archive.service';
import { CategoryService } from '../category/category.service';

@Authorize()
@Controller('dish')
export class DishController {
  private readonly maxImageSize: number = 400 * 1024;
  private readonly countOfDigitsAfterInteger: number = 2;

  constructor(
    private readonly dishService: DishService,
    private readonly archiveService: ArchiveService,
    private readonly categoryService: CategoryService,
  ) {}

  @ForRoles(Roles.Cook)
  @Post('create')
  async create(@Body() dish: Dish): Promise<void> {
    await this.validateDish(dish);
    const dishHistory = await this.archiveService.createDishHistory(dish);
    dish.dishHistoryId = dishHistory.id;
    dish.cost = parseFloat(dish.cost.toFixed(this.countOfDigitsAfterInteger));
    await this.dishService.create(dish);
    return;
  }

  @ForRoles(Roles.Cook)
  @Post('update')
  async update(@Body() dish: Dish): Promise<void> {
    await this.validateDish(dish);
    const currentDish = await this.dishService.getById(dish.id);
    if (!currentDish) {
      throw new BadRequestException();
    }
    await this.archiveService.deleteEmptyDishHistory(currentDish.dishHistoryId);
    const dishHistory = await this.archiveService.createDishHistory(dish);
    dish.dishHistoryId = dishHistory.id;
    dish.cost = parseFloat(dish.cost.toFixed(this.countOfDigitsAfterInteger));
    await this.dishService.update(dish);
    return;
  }

  @ForRoles(Roles.Cook)
  @Post('delete')
  async delete(@Body('id') id: string): Promise<void> {
    const dish = await this.dishService.getById(id);
    if (!dish) {
      throw new NotFoundException();
    }
    if (dish.orderedDishes.length !== 0) {
      throw new ForbiddenException('Ви не можете видалити страву поки не виконаєте всі замовлення, в яких вона є');
    }
    await this.dishService.delete(id);
    await this.archiveService.deleteEmptyDishHistory(dish.dishHistoryId);
    return;
  }

  @Get('getAll')
  async getAll(): Promise<Dish[]> {
    return await this.dishService.getAll();
  }

  private async validateDish(dish: Dish): Promise<void> {
    if (dish.photo && dish.photo.length > this.maxImageSize) {
      throw new BadRequestException('Розмір картинки завелекий. Максимально допустимий розмір: 400 КБ');
    }
    if (!await this.categoryService.getById(dish.categoryId)) {
      throw new NotFoundException();
    }
  }
}
