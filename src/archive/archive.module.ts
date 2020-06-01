import { Module } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistory } from '../entity/OrderHistory';
import { DishHistory } from '../entity/DishHistory';
import { OrderedDishHistory } from '../entity/OrderedDishHistory';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHistory, DishHistory, OrderedDishHistory])],
  providers: [ArchiveService],
  exports: [ArchiveService],
})
export class ArchiveModule {}
