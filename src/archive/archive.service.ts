import { Injectable } from '@nestjs/common';
import { DishHistory } from '../entity/DishHistory';
import { Dish } from '../entity/Dish';
import { OrderHistory } from '../entity/OrderHistory';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderedDishHistory } from '../entity/OrderedDishHistory';
import { OrderedDish } from '../entity/OrderedDish';
import { Order } from '../entity/Order';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,
    @InjectRepository(DishHistory)
    private dishHistoryRepository: Repository<DishHistory>,
    @InjectRepository(OrderedDishHistory)
    private orderedDishHistoryRepository: Repository<OrderedDishHistory>,
  ) {}

  async createDishHistory(dish: Dish): Promise<DishHistory> {
    const dishHistory = new DishHistory();
    dishHistory.name = dish.name;
    dishHistory.cost = dish.cost;
    dishHistory.description = dish.description;
    dishHistory.creationDate = new Date();
    return await this.dishHistoryRepository.save(dishHistory);
  }

  async deleteEmptyDishHistory(id: string): Promise<void> {
    const history = await this.dishHistoryRepository.find({ where: { id }, relations: ['orderedDishHistories'] });
    for (const dish of history) {
      if (dish.orderedDishHistories.length === 0) {
        await this.dishHistoryRepository.delete(dish.id);
      }
    }
  }

  async createOrderedDishHistory(orderedDish: OrderedDish, orderHistoryId: string, dish: Dish): Promise<void> {
    const dishHistory = await this.dishHistoryRepository.findOne(dish.dishHistoryId);
    const orderedDishHistory = new OrderedDishHistory();
    orderedDishHistory.orderHistoryId = orderHistoryId;
    orderedDishHistory.dishCount = orderedDish.dishCount;
    orderedDishHistory.dishHistoryId = (dishHistory as DishHistory).id;
    await this.orderedDishHistoryRepository.save(orderedDishHistory);
  }

  async deleteOrderedDishHistory(id: string): Promise<void> {
    await this.orderedDishHistoryRepository.delete(id);
  }

  async createOrderHistory(order: Order): Promise<OrderHistory> {
    const orderHistory = await this.orderHistoryRepository.save(new OrderHistory());
    for (const orderedDish of order?.orderedDishes) {
      await this.createOrderedDishHistory(orderedDish, orderHistory.id, orderedDish.dish);
    }
    return orderHistory;
  }

  async deleteOrderHistory(orderHistory: OrderHistory): Promise<void> {
    for (const dish of orderHistory?.orderedDishHistories) {
      await this.deleteOrderedDishHistory(dish.id);
    }
    await this.orderHistoryRepository.delete(orderHistory.id);
  }

  async getOrderedDishesHistoryByDate(date: Date): Promise<OrderedDishHistory[]> {
    const dishes = await this.orderedDishHistoryRepository.find({ relations: ['dishHistory', 'orderHistory'] });
    date.setHours(0, 0, 0, 0);
    return dishes.filter((dish) => {
      const completionDate = new Date(dish.orderHistory.completionDate);
      completionDate.setHours(0, 0, 0, 0);
      if (date.getTime() === completionDate.getTime() && 
          dish.dishHistory.creationDate.getTime() >= completionDate.getTime()) {
        return true;
      }
      return false;
    });
  }

  async getOrderHistoryById(id: string, withRelations?: boolean): Promise<OrderHistory | undefined> {
    if (!withRelations) {
      return await this.orderHistoryRepository.findOne(id);
    }
    return await this.orderHistoryRepository.findOne({ where: { id }, relations: ['orderedDishHistories'] });
  }
}
