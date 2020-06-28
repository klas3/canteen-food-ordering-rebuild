import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppGateway from '../app/app.gateway';
import OrderService from './order.service';
import Order from '../entity/Order';
import OrderHistory from '../entity/OrderHistory';
import OrderController from './order.controller';
import DishModule from '../dish/dish.module';
import OrderedDishModule from '../orderedDish/ordered-dish.module';
import ArchiveModule from '../archive/archive.module';
import UserModule from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderHistory]),
    DishModule,
    OrderedDishModule,
    ArchiveModule,
    UserModule,
  ],
  providers: [OrderService, AppGateway],
  exports: [OrderService],
  controllers: [OrderController],
})
class OrderModule {}

export default OrderModule;
