import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../entity/Category';
import { Authorize, ForRoles } from '../auth/auth.decorators';
import { Roles } from 'src/auth/roles';

@Authorize()
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ForRoles(Roles.Cook)
  @Post('create')
  async create(@Body() category: Category): Promise<void> {
    if (!await this.categoryService.isNameUnique(category.name)) {
      throw new BadRequestException('Категорія з даним ім\'ям вже існує.');
    }
    return await this.categoryService.create(category);
  }

  @ForRoles(Roles.Cook)
  @Post('update')
  async update(@Body() category: Category): Promise<void> {
    if (!await this.categoryService.isNameUnique(category.name)) {
      throw new BadRequestException('Категорія з даним ім\'ям вже існує.');
    }
    return await this.categoryService.update(category);
  }

  @ForRoles(Roles.Cook)
  @Post('delete')
  async delete(@Body('id') id: string): Promise<void> {
    return await this.categoryService.delete(id);
  }

  @ForRoles(Roles.Cook)
  @Get('getAll')
  async getAll(): Promise<Category[]> {
    return await this.categoryService.getAll();
  }
}
