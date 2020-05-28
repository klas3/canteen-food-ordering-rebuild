import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entity/Order';
import { OrderHistory } from '../entity/OrderHistory';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderHistory])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
