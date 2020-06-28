import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Dish from '../entity/Dish';
import DishHistory from '../entity/DishHistory';

@Injectable()
class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    @InjectRepository(DishHistory)
    private readonly dishHistoryRepository: Repository<DishHistory>,
  ) {}

  async create(dish: Dish): Promise<Dish> {
    const newDish = dish;
    newDish.photo = Buffer.from(newDish.photo);
    return this.dishRepository.save(newDish);
  }

  async update(dish: Dish): Promise<void> {
    const updatedDish = dish;
    updatedDish.photo = Buffer.from(updatedDish.photo);
    await this.dishRepository.update(updatedDish.id, updatedDish);
  }

  async delete(id: string): Promise<void> {
    await this.dishRepository.delete(id);
  }

  async getById(id: string): Promise<Dish | undefined> {
    return this.dishRepository.findOne({ where: { id }, relations: ['orderedDishes'] });
  }

  async getHistoryById(id: string): Promise<DishHistory | undefined> {
    return this.dishHistoryRepository.findOne(id);
  }

  async getAll(): Promise<Dish[]> {
    return this.dishRepository.find();
  }
}

export default DishService;
