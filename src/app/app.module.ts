import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { OrderedDishModule } from '../orderedDish/ordered-dish.module';
import { CategoryModule } from 'src/category/category.module';
import { OrderModule } from 'src/order/order.module';
import { DishModule } from 'src/dish/dish.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, OrderedDishModule, CategoryModule, OrderModule, DishModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
