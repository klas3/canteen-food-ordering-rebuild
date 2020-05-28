import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from '../entity/Order';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistory } from '../entity/OrderHistory';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Order)
    private orderHistoryRepository: Repository<OrderHistory>,
  ) {}

  async create(order: Order): Promise<void> {
    await this.orderRepository.save(order);
  }

  async createHistory(orderHistory: OrderHistory): Promise<void> {
    await this.orderHistoryRepository.save(orderHistory);
  }

  async update(order: Order): Promise<void> {
    await this.orderRepository.update(order.id, order);
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async getByUserId(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({ userId });
  }

  async getById(id: string): Promise<Order | undefined> {
    return await this.orderRepository.findOne(id);
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
