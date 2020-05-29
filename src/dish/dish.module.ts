import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from '../entity/Dish';
import { DishHistory } from '../entity/DishHistory';
import { DishController } from './dish.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, DishHistory])],
  providers: [DishService],
  exports: [DishService],
  controllers: [DishController],
})
export class DishModule {}
