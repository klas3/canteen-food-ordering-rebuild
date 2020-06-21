import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../entity/Category';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async update(category: Category): Promise<void> {
    await this.categoryRepository.update(category.id, category);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async getById(id: string): Promise<Category | undefined> {
    return await this.categoryRepository.findOne(id);
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async isNameUnique(name: string): Promise<boolean> {
    return await this.categoryRepository.findOne({ name }) === undefined;
  }
}
