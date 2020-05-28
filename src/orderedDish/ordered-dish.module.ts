import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedDishService } from './ordered-dish.service';
import { OrderedDish } from '../entity/OrderedDish';
import { OrderedDishHistory } from '../entity/OrderedDishHistory';

@Module({
  imports: [TypeOrmModule.forFeature([OrderedDish, OrderedDishHistory])],
  providers: [OrderedDishService],
  exports: [OrderedDishService],
})
export class OrderedDishModule {}
