import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DishService from './dish.service';
import Dish from '../entity/Dish';
import DishHistory from '../entity/DishHistory';
import DishController from './dish.controller';
import CategoryModule from '../category/category.module';
import ArchiveModule from '../archive/archive.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, DishHistory]), CategoryModule, ArchiveModule],
  providers: [DishService],
  exports: [DishService],
  controllers: [DishController],
})
class DishModule {}

export default DishModule;
