import { Injectable } from '@nestjs/common';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

  async create(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async update(user: User): Promise<void> {
    await this.userRepository.update(user.id, user);
  }

	async getById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ id });
  }

  async isLoginUnique(login: string): Promise<boolean> {
    return await this.userRepository.findOne({ login }) === undefined;
  }

  async isEmailUnique(email: string): Promise<boolean> {
    return await this.userRepository.findOne({ email }) === undefined;
  }
  
  async getEmailById(id: string): Promise<string> {
    const { email } = await this.userRepository.findOne(id) as User;
    return email;
  }

  async setPushToken(pushToken: string, id: string): Promise<void> {
    const user = await this.userRepository.findOne(id);
    await this.userRepository.update(id, { ...user, pushToken });
  }

  async getByLogin(login: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ login });
  }

  async getByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email });
  }

  async setResetCode(resetCode: string, id: string): Promise<void> {
    const user = await this.userRepository.findOne(id);
    await this.userRepository.update(id, { ...user, resetCode });
  }

  async clearResetCode(id: string): Promise<void> {
    const user = await this.userRepository.findOne(id);
    await this.userRepository.update(id, { ...user, resetCode: undefined });
  }
}