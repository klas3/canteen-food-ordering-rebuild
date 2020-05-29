import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from '../entity/Order';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistory } from '../entity/OrderHistory';
import { DishService } from '../dish/dish.service';
import { OrderedDishService } from 'src/orderedDish/ordered-dish.service';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Order)
    private orderHistoryRepository: Repository<OrderHistory>,
    private dishService: DishService,
    private orderedDishService: OrderedDishService,
  ) {}

  async create(order: Order): Promise<void> {
    order.creationDate = new Date();
    order.desiredDate = new Date(order.desiredDate);
    if (order.creationDate > order.desiredDate) {
      throw new BadRequestException('Бажана дата видачі повинна бути пізнішою, ніж дата створення');
    }
    order.orderedDishes.forEach(async (orderedDish) => {
      const dish = await this.dishService.getById(orderedDish.id);
      if (dish) {
        order.totalSum += dish?.cost * orderedDish.dishCount;
      }
    });
    const insertedOrder = await this.orderRepository.save(order);
    order.orderedDishes.forEach(async (orderedDish) => {
      orderedDish.orderId = insertedOrder.id;
      await this.orderedDishService.create(orderedDish);
    });
  }

  async createHistory(orderHistory: OrderHistory): Promise<void> {
    await this.orderHistoryRepository.save(orderHistory);
  }

  async update(order: Order): Promise<void> {
    await this.orderRepository.update(order.id, order);
  }

  async delete(id: string): Promise<void> {
    const order = await this.getById(id);
    if (!order) {
      throw new NotFoundException();
    }
    order?.orderedDishes.forEach(async (orderedDish) => {
      await this.orderedDishService.delete(orderedDish.id);
    });
    await this.orderRepository.delete(id);
  }

  async getByUserId(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({ userId });
  }

  async getById(id: string): Promise<Order | undefined> {
    return await this.orderRepository.findOne({ where: { id }, relations: ['orderedDishes'] });
  }

  async getAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async getByPaymentStatus(isPaid: boolean): Promise<Order[]> {
    return await this.orderRepository.find({ isPaid });
  }

  async getForCashier(id: string): Promise<Order[]> {
    return await this.orderRepository.find({ id, isPaid: false });
  }
}
