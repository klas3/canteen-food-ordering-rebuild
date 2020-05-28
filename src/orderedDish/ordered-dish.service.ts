import { Injectable } from '@nestjs/common';
import { OrderedDish } from 'src/entity/OrderedDish';
import { OrderedDishHistory } from 'src/entity/OrderedDishHistory';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderedDishService {
  constructor(
    @InjectRepository(OrderedDish)
    private orderedDishRepository: Repository<OrderedDish>,
    @InjectRepository(OrderedDishHistory)
    private orderedDishHistoryRepository: Repository<OrderedDishHistory>
  ) {}

  async create(orderedDish: OrderedDish): Promise<void> {
    await this.orderedDishRepository.save(orderedDish);
  }

  async createHistory(orderedDishHistory: OrderedDishHistory): Promise<void> {
    await this.orderedDishHistoryRepository.save(orderedDishHistory);
  }

  async delete(id: string): Promise<void> {
    await this.orderedDishRepository.delete(id);
  }

  async getByOrderId(orderId: string): Promise<OrderedDish[]> {
    return await this.orderedDishRepository.find({ orderId });
  }

  async getHistoryByDate(date: Date): Promise<OrderedDishHistory[]> {
    const dishes = await this.orderedDishHistoryRepository.find();
    date.setHours(0, 0, 0, 0);
    return dishes.filter((dish) => {
      const completionDate = new Date(dish.orderHistory.completionDate);
      completionDate.setHours(0, 0, 0, 0);
      if (date.getTime() === completionDate.getTime() && 
          dish.dishHistory.creationDate.getTime() <= completionDate.getTime()) {
        return true;
      }
      return false;
    });
  }
}
