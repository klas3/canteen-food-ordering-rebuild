import { Injectable } from '@nestjs/common';
import { OrderedDish } from '../entity/OrderedDish';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderedDishService {
  constructor(
    @InjectRepository(OrderedDish)
    private orderedDishRepository: Repository<OrderedDish>,
  ) {}

  async create(orderedDish: OrderedDish): Promise<void> {
    await this.orderedDishRepository.save(orderedDish);
  }

  async delete(id: string): Promise<void> {
    await this.orderedDishRepository.delete(id);
  }

  async getByOrderId(orderId: number): Promise<OrderedDish[]> {
    return await this.orderedDishRepository.find({ orderId });
  }
}
