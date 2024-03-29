import {
  Controller, Post, Body, Get, BadRequestException,
} from '@nestjs/common';
import CategoryService from './category.service';
import Category from '../entity/Category';
import { Authorize, ForRoles } from '../auth/auth.decorators';
import Roles from '../auth/roles';

@Authorize()
@Controller('category')
class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ForRoles(Roles.Cook)
  @Post('create')
  async create(@Body() category: Category): Promise<void> {
    if (!await this.categoryService.isNameUnique(category.name)) {
      throw new BadRequestException('Категорія з даним ім\'ям вже існує.');
    }
    await this.categoryService.create(category);
  }

  @ForRoles(Roles.Cook)
  @Post('update')
  async update(@Body() category: Category): Promise<void> {
    if (!await this.categoryService.isNameUnique(category.name)) {
      throw new BadRequestException('Категорія з даним ім\'ям вже існує.');
    }
    return this.categoryService.update(category);
  }

  @ForRoles(Roles.Cook)
  @Post('delete')
  async delete(@Body('id') id: string): Promise<void> {
    return this.categoryService.delete(id);
  }

  @Get('getAll')
  async getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }
}

export default CategoryController;
