import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CategoryService from './category.service';
import Category from '../entity/Category';
import CategoryController from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
class CategoryModule {}

export default CategoryModule;
