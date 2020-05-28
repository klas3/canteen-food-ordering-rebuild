import { Injectable } from '@nestjs/common';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	) {}

	async getById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ id });
  }

  async isLoginUnique(login: string): Promise<boolean> {
    return await this.usersRepository.findOne({ login }) === undefined;
  }

  async isEmailUnique(email: string): Promise<boolean> {
    return await this.usersRepository.findOne({ email }) === undefined;
  }
  
  async getEmailById(id: string): Promise<string> {
    const { email } = await this.usersRepository.findOne(id) as User;
    return email;
  }

  async setPushToken(pushToken: string, id: string): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    await this.usersRepository.update(id, { ...user, pushToken });
  }

  async getByLogin(login: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ login });
  }

  async setResetCode(resetCode: string, id: string): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    await this.usersRepository.update(id, { ...user, resetCode });
  }

  async clearResetCode(id: string): Promise<void> {
    const user = await this.usersRepository.findOne(id);
    await this.usersRepository.update(id, { ...user, resetCode: undefined });
  }
}
