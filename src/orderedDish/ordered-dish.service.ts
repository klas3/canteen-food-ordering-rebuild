import { Injectable } from '@nestjs/common';
import { OrderedDishRepository } from './orderedDish.repository';
import { OrderedDish } from 'src/entity/OrderedDish';
import { OrderedDishHistory } from 'src/entity/OrderedDishHistory';

@Injectable()
export class OrderedDishService {
  constructor(private orderedDishRepository: OrderedDishRepository) {}

  async createOrderedDish(orderedDish: OrderedDish): Promise<void> {
    await this.orderedDishRepository.createOrderedDish(orderedDish);
  }

  async createOrderedDishHistory(orderedDishHistory: OrderedDishHistory): Promise<void> {
    await this.orderedDishRepository.createOrderedDishHistory(orderedDishHistory);
  }

  async deleteOrderedDish(id: string): Promise<void> {
    await this.orderedDishRepository.deleteOrderedDish(id);
  }

  async getOrderedDishesByOrderId(orderId: string): Promise<OrderedDish[]> {
    return await this.orderedDishRepository.getOrderedDishesByOrderId(orderId);
  }
}
