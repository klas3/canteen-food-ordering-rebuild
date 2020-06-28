import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ArchiveService from './archive.service';
import OrderHistory from '../entity/OrderHistory';
import DishHistory from '../entity/DishHistory';
import OrderedDishHistory from '../entity/OrderedDishHistory';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHistory, DishHistory, OrderedDishHistory])],
  providers: [ArchiveService],
  exports: [ArchiveService],
})
class ArchiveModule {}

export default ArchiveModule;
