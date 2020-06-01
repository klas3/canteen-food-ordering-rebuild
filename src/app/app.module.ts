import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { OrderedDishModule } from '../orderedDish/ordered-dish.module';
import { CategoryModule } from '../category/category.module';
import { OrderModule } from '../order/order.module';
import { DishModule } from '../dish/dish.module';
import { ArchiveModule } from '../archive/archive.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    UserModule, 
    AuthModule, 
    OrderedDishModule, 
    CategoryModule, 
    OrderModule, 
    DishModule, 
    ArchiveModule, 
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
