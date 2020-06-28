import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DishHistory from '../entity/DishHistory';
import Dish from '../entity/Dish';
import OrderHistory from '../entity/OrderHistory';
import OrderedDishHistory from '../entity/OrderedDishHistory';
import OrderedDish from '../entity/OrderedDish';
import Order from '../entity/Order';

@Injectable()
class ArchiveService {
  constructor(
    @InjectRepository(OrderHistory)
    private readonly orderHistoryRepository: Repository<OrderHistory>,
    @InjectRepository(DishHistory)
    private readonly dishHistoryRepository: Repository<DishHistory>,
    @InjectRepository(OrderedDishHistory)
    private readonly orderedDishHistoryRepository: Repository<OrderedDishHistory>,
  ) {}

  async createDishHistory(dish: Dish): Promise<DishHistory> {
    const dishHistory = new DishHistory();
    dishHistory.name = dish.name;
    dishHistory.cost = dish.cost;
    dishHistory.description = dish.description;
    dishHistory.creationDate = new Date();
    return this.dishHistoryRepository.save(dishHistory);
  }

  // check
  async deleteEmptyDishHistory(id: string): Promise<void> {
    const dishHistories = await this.dishHistoryRepository.find({ where: { id }, relations: ['orderedDishHistories'] });
    const deletedDishHistories = dishHistories.map((dishHistory) => {
      if (dishHistory.orderedDishHistories.length === 0) {
        this.dishHistoryRepository.delete(dishHistory.id);
      }
      return null;
    });
    await Promise.all(deletedDishHistories);
  }

  async createOrderedDishHistory(
    orderedDish: OrderedDish,
    orderHistoryId: string,
    dish: Dish,
  ): Promise<void> {
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
    const createdOrderedDishHistories = order?.orderedDishes.map(
      (orderedDishHistory) => this.createOrderedDishHistory(
        orderedDishHistory, orderHistory.id, orderedDishHistory.dish,
      ),
    );
    await Promise.all(createdOrderedDishHistories);
    return orderHistory;
  }

  async deleteOrderHistory(orderHistory: OrderHistory): Promise<void> {
    const deletedOrderedDishHistories = orderHistory?.orderedDishHistories.map(
      (orderedDishHistory) => this.deleteOrderedDishHistory(orderedDishHistory.id),
    );
    await Promise.all(deletedOrderedDishHistories);
    await this.orderHistoryRepository.delete(orderHistory.id);
  }

  async getOrderedDishesHistoryByDate(date: Date): Promise<OrderedDishHistory[]> {
    const dishes = await this.orderedDishHistoryRepository.find({ relations: ['dishHistory', 'orderHistory'] });
    date.setHours(0, 0, 0, 0);
    return dishes.filter((dish) => {
      const completionDate = new Date(dish.orderHistory.completionDate);
      completionDate.setHours(0, 0, 0, 0);
      if (date.getTime() === completionDate.getTime()
          && dish.dishHistory.creationDate.getTime() >= completionDate.getTime()) {
        return true;
      }
      return false;
    });
  }

  async getOrderHistoryById(
    id: string,
    withRelations?: boolean,
  ): Promise<OrderHistory | undefined> {
    if (!withRelations) {
      return this.orderHistoryRepository.findOne(id);
    }
    return this.orderHistoryRepository.findOne({ where: { id }, relations: ['orderedDishHistories'] });
  }
}

export default ArchiveService;
