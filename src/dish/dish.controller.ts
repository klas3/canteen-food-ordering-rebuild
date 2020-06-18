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

  constructor(
    private dishService: DishService,
    private archiveService: ArchiveService,
    private categoryService: CategoryService,
  ) {}

  @ForRoles(Roles.Cook)
  @Post('create')
  async create(
    @Body() dish: Dish,
    @Body('photo') photo: string,
  ): Promise<void> {
    if (photo && !this.dishService.verifyImageSize(photo, this.maxImageSize)) {
      throw new BadRequestException('Розмір картинки завелекий. Максимально допустимий розмір: 400 КБ');
    }
    if (!await this.categoryService.getById(dish.categoryId)) {
      throw new NotFoundException();
    }
    const dishHistory = await this.archiveService.createDishHistory(dish);
    dish.dishHistoryId = dishHistory.id;
    dish.photo = this.dishService.convertImageFromBase64(photo);
    await this.dishService.create(dish);
    return;
  }

  @ForRoles(Roles.Cook)
  @Post('update')
  async update(
    @Body() dish: Dish,
    @Body('photo') photo: string,
  ): Promise<void> {
    if (photo && !this.dishService.verifyImageSize(photo, this.maxImageSize)) {
      throw new BadRequestException('Розмір картинки завелекий. Максимально допустимий розмір: 400 КБ');
    }
    const currentDish = await this.dishService.getById(dish.id);
    if (!dish.id || !currentDish) {
      throw new BadRequestException();
    }
    await this.archiveService.deleteEmptyDishHistory(currentDish.dishHistoryId);
    const dishHistory = await this.archiveService.createDishHistory(dish);
    dish.dishHistoryId = dishHistory.id;
    dish.photo = this.dishService.convertImageFromBase64(photo);
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
}
