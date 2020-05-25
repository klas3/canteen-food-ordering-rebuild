import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Category } from './entity/Category';
import { Dish } from './entity/Dish';
import { DishHistory } from './entity/DishHistory';
import { Order } from './entity/Order';
import { OrderedDish } from './entity/OrderedDish';
import { OrderedDishHistory } from './entity/OrderedDishHistory';
import { OrderHistory } from './entity/OrderHistory';
import { User } from './entity/User';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'canteen',
    entities: [Category, Dish, DishHistory, Order, OrderedDish, OrderedDishHistory, OrderHistory, User],
    synchronize: true,
  }), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
