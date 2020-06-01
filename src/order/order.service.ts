import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from '../entity/Order';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistory } from '../entity/OrderHistory';
import { OrderedDishService } from '../orderedDish/ordered-dish.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderHistory)
    private orderHistoryRepository: Repository<OrderHistory>,
    private orderedDishService: OrderedDishService,
  ) {}

  async create(order: Order): Promise<void> {
    const { id } = await this.orderRepository.save(order);
    for (const orderedDish of order.orderedDishes) {
      orderedDish.orderId = id;
      await this.orderedDishService.create(orderedDish);
    }
  }

  async delete(order: Order): Promise<void> {
    for (const orderedDish of order.orderedDishes) {
      await this.orderedDishService.delete(orderedDish.id);
    }
    await this.orderRepository.delete(order.id);
  }

  async getByUserId(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({ where: { userId }, relations: ['orderedDishes'] });
  }

  async getById(id: string, withRelations?: boolean): Promise<Order | undefined> {
    if (!withRelations) {
      return await this.orderRepository.findOne(id);
    }
    return await this.orderRepository.findOne({ where: { id }, relations: ['orderedDishes'] });
  }

  async getAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async getByPaymentStatus(isPaid: boolean): Promise<Order[]> {
    return await this.orderRepository.find({ where: { isPaid }, relations: ['orderedDishes'] });
  }

  async getForCashier(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({ 
      where: { userId, isPaid: false }, 
      relations: ['orderedDishes'],
    });
  }

  async confirmPayment(order: Order): Promise<void> {
    order.confirmPayment();
    await this.orderRepository.update(order.id, order);
  }

  async confirmReadyStatus(order: Order): Promise<void> {
    order.confirmReadyStatus();
    await this.orderRepository.update(order.id, order);
  }

  async archive(order: Order, orderHistory: OrderHistory): Promise<void> {
    await this.delete(order);
    orderHistory.completionDate = new Date();
    await this.orderHistoryRepository.update(order.orderHistoryId, orderHistory);
  }
}