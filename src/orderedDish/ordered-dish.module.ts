import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderedDishRepository } from './orderedDish.repository';
import { OrderedDishService } from './ordered-dish.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderedDishRepository])],
  providers: [OrderedDishService],
  exports: [OrderedDishService],
})
export class OrderedDishModule {}
