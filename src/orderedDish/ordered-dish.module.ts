import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderedDishService from './ordered-dish.service';
import OrderedDish from '../entity/OrderedDish';

@Module({
  imports: [TypeOrmModule.forFeature([OrderedDish])],
  providers: [OrderedDishService],
  exports: [OrderedDishService],
})
class OrderedDishModule {}

export default OrderedDishModule;
