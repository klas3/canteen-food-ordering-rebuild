import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { OrderedDishModule } from '../orderedDish/ordered-dish.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AuthModule, OrderedDishModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
