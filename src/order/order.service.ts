import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Order from '../entity/Order';
import OrderHistory from '../entity/OrderHistory';
import OrderedDishService from '../orderedDish/ordered-dish.service';

@Injectable()
class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderHistory)
    private readonly orderHistoryRepository: Repository<OrderHistory>,
    private readonly orderedDishService: OrderedDishService,
  ) {}

  async create(order: Order): Promise<Order> {
    const newOrder = await this.orderRepository.save(order);
    newOrder.orderedDishes = newOrder.orderedDishes.map((orderedDish) => {
      const newOrderedDish = orderedDish;
      newOrderedDish.orderId = newOrder.id;
      this.orderedDishService.create(newOrderedDish);
      return newOrderedDish;
    });
    return newOrder;
  }

  async delete(order: Order): Promise<void> {
    const deletedOrderedDishes = order.orderedDishes.map(
      (orderedDish) => this.orderedDishService.delete(orderedDish.id),
    );
    await Promise.all(deletedOrderedDishes);
    await this.orderRepository.delete(order.id);
  }

  async getByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['orderedDishes', 'orderedDishes.dish'],
    });
  }

  async getById(id: number, withRelations?: boolean): Promise<Order | undefined> {
    if (!withRelations) {
      return this.orderRepository.findOne(id);
    }
    return this.orderRepository.findOne({
      where: { id },
      relations: ['orderedDishes', 'orderedDishes.dish'],
    });
  }

  async getAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async getByPaymentStatus(isPaid: boolean): Promise<Order[]> {
    return this.orderRepository.find({
      where: { isPaid },
      relations: ['orderedDishes', 'orderedDishes.dish'],
    });
  }

  async getForCashier(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId, isPaid: false },
      relations: ['orderedDishes', 'orderedDishes.dish'],
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
    const completeOrderHistory = orderHistory;
    completeOrderHistory.completionDate = new Date();
    await this.orderHistoryRepository.update(order.orderHistoryId, completeOrderHistory);
  }
}

export default OrderService;
