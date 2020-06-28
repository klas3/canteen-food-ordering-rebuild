import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import OrderedDish from '../entity/OrderedDish';

@Injectable()
class OrderedDishService {
  constructor(
    @InjectRepository(OrderedDish)
    private readonly orderedDishRepository: Repository<OrderedDish>,
  ) {}

  async create(orderedDish: OrderedDish): Promise<OrderedDish> {
    return this.orderedDishRepository.save(orderedDish);
  }

  async delete(id: string): Promise<void> {
    await this.orderedDishRepository.delete(id);
  }

  async getByOrderId(orderId: number): Promise<OrderedDish[]> {
    return this.orderedDishRepository.find({ orderId });
  }
}

export default OrderedDishService;
