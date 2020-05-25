import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
	) {}

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne(id);
	}
	
	async findByLogin(login: string): Promise<User | undefined> {
		return this.usersRepository.findOne({ login });
	}
}
