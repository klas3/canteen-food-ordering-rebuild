import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Category from '../entity/Category';

@Injectable()
class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  async update(category: Category): Promise<void> {
    await this.categoryRepository.update(category.id, category);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async getById(id: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne(id);
  }

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async isNameUnique(name: string): Promise<boolean> {
    return await this.categoryRepository.findOne({ name }) === undefined;
  }
}

export default CategoryService;
