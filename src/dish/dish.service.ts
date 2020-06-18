import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Dish } from '../entity/Dish';
import { InjectRepository } from '@nestjs/typeorm';
import { DishHistory } from '../entity/DishHistory';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(DishHistory)
    private dishHistoryRepository: Repository<DishHistory>
  ) {}

  async create(dish: Dish): Promise<void> {
    await this.dishRepository.save(dish);
  }

  async update(dish: Dish): Promise<void> {
    await this.dishRepository.update(dish.id, dish);
  }

  async delete(id: string): Promise<void> {
    await this.dishRepository.delete(id);
  }

  async getById(id: string): Promise<Dish | undefined> {
    return await this.dishRepository.findOne({ where: { id }, relations: ['orderedDishes'] });
  }

  async getHistoryById(id: string): Promise<DishHistory | undefined> {
    return await this.dishHistoryRepository.findOne(id);
  }

  async getAll(): Promise<Dish[]> {
    return await this.dishRepository.find();
  }
}
