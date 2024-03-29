import { Module } from '@nestjs/common';
import PaymentService from './payment.service';
import PaymentController from './payment.controller';
import OrderModule from '../order/order.module';

@Module({
  imports: [OrderModule],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController],
})
class PaymentModule {}

export default PaymentModule;
