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
    await this.createHistory(dish);
  }

  async update(dish: Dish): Promise<void> {
    await this.dishRepository.update(dish.id, dish);
    await this.createHistory(dish);
  }

  async delete(id: string): Promise<void> {
    const dish = await this.dishRepository.findOne({ id });
    const history = await this.dishHistoryRepository.find({ name: dish?.name });
    history.forEach(async (dish) => {
      if (dish.orderedDishHistories.length === 0) {
        await this.dishHistoryRepository.delete(dish);
      }
    });
    await this.dishRepository.delete(id);
  }

  async getById(id: string): Promise<Dish | undefined> {
    return await this.dishRepository.findOne(id);
  }

  async getHistoryById(id: string): Promise<DishHistory | undefined> {
    return await this.dishHistoryRepository.findOne(id);
  }

  async getAll(): Promise<Dish[]> {
    return await this.dishRepository.find();
  }

  verifyImageSize(photo: string, size: number): boolean {
    return atob(photo).length <= size;
  }

  private async createHistory(dish: Dish): Promise<void> {
    const dishHistory = new DishHistory();
    dishHistory.name = dish.name;
    dishHistory.cost = dish.cost;
    dishHistory.description = dish.description;
    await this.dishHistoryRepository.save(dishHistory);
  }
}
